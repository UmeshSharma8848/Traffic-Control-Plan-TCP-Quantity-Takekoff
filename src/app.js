(function(){
"use strict";
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const TYPE={R:"Regulatory",W:"Warning",G:"Guide / detour",S:"School"};
const SHAPE={oct:"Octagon",tri:"Triangle",dia:"Diamond",rect:"Rectangle",circ:"Circle",pen:"Pennant",pent:"Pentagon",xbuck:"Crossbuck"};
const RANGES=[
  {k:"A",s:"< 6.25 SF",label:"Less than 6.25 SF",pay:"Construction signs (less than 6.25 SF)",c:"--ra",min:0,max:6.25},
  {k:"B",s:"6.25–15.99 SF",label:"6.25 – 15.99 SF",pay:"Construction signs (6.25 – 15.99 SF)",c:"--rb",min:6.25,max:16},
  {k:"C",s:"16–32 SF",label:"16 – 32 SF",pay:"Construction signs (16 – 32 SF)",c:"--rc",min:16,max:32.0000001},
  {k:"X",s:"> 32 SF",label:"Over 32 SF",pay:"Signs over 32 SF",c:"--rx",min:32.0000001,max:Infinity}
];
const DCAT={BAR:{n:"Barricades",c:"--bar"},CH:{n:"Channelizing devices",c:"--ch"},L:{n:"Warning lights & lighting",c:"--lt"},O:{n:"Other TTC devices",c:"--ot"}};
const ROADS=[{k:"c",label:"Conventional",sfx:"",short:"Conv"},{k:"ml",label:"Multi-lane",sfx:"ML",short:"ML"},{k:"e",label:"Expressway (E)",sfx:"E",short:"E"},{k:"f",label:"Freeway (F)",sfx:"F",short:"F"},{k:"m",label:"Minimum",sfx:"MIN",short:"Min"},{k:"o",label:"Oversized",sfx:"OV",short:"Over"}];
const RL=Object.fromEntries(ROADS.map(r=>[r.k,r]));
const SIGN=Object.fromEntries(SIGNS.map(s=>[s.id,s]));
const DEV=Object.fromEntries(DEVICES.map(d=>[d.id,d]));
const LS={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};
const uidGen=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);

// ---------------- state ----------------
const blankProj=()=>({id:uidGen(),name:"",number:"",location:"",days:150,basis:"actual",lines:[]});
let P=LS.get("wzsf3-draft",null)||blankProj();
let S={tab:"signs",road:LS.get("wzsf3-road","c"),cat:null,range:null,ttc:false,q:"",limit:60};
let CUSTOM=LS.get("wzsf3-custom",[]); // local mirror
let saved=[]; let dirty=false;
const pendingLight={};
function draft(){ LS.set("wzsf3-draft",P); LS.set("wzsf3-road",S.road); }
function markDirty(){ dirty=true; draft(); renderStatus(); }

// ---------------- storage (account db with local fallback) ----------------
const Store=(function(){
  let db=null, uid=null, mode="local";
  const cl=window.claude;
  const ready=(async()=>{
    try{
      if(!cl||!cl.use) return;
      const [d,u]=await Promise.all([cl.use("db"),cl.use("user")]);
      if(!d||!u) return;
      const id=await u.id();
      if(!id) return;
      db=d; uid=id; mode="account";
    }catch(e){ db=null; mode="local"; }
  })();
  const base=()=>db.doc("data/users/"+uid+"/profile");
  async function list(coll,lsKey){
    await ready;
    if(mode==="account"){ try{ const snap=await base().collection(coll).get(); return snap.docs.map(d=>d.data()); }catch(e){ return LS.get(lsKey,[]); } }
    return LS.get(lsKey,[]);
  }
  async function put(coll,lsKey,obj){
    await ready;
    if(mode==="account"){ await base().collection(coll).doc(obj.id).set(JSON.parse(JSON.stringify(obj))); return; }
    const arr=LS.get(lsKey,[]).filter(x=>x.id!==obj.id); arr.push(obj); LS.set(lsKey,arr);
  }
  async function del(coll,lsKey,id){
    await ready;
    if(mode==="account"){ await base().collection(coll).doc(id).delete(); return; }
    LS.set(lsKey,LS.get(lsKey,[]).filter(x=>x.id!==id));
  }
  return {
    ready, mode:()=>mode,
    listProjects:()=>list("projects","wzsf3-projects"),
    saveProject:p=>put("projects","wzsf3-projects",p),
    deleteProject:id=>del("projects","wzsf3-projects",id),
    listCustom:()=>list("customSigns","wzsf3-custom"),
    saveCustom:c=>put("customSigns","wzsf3-custom",c),
    deleteCustom:id=>del("customSigns","wzsf3-custom",id)
  };
})();

// ---------------- sizes & area ----------------
function sizeFor(o,road){
  const has=v=>v&&v!=="";
  const pick=(k,fbList)=>{ if(has(o[k])) return {s:o[k],road:rk(k)}; for(const f of fbList){ if(has(o[f])) return {s:o[f],road:rk(f),fb:true}; } return {s:o.conv||"",road:"c",fb:true}; };
  function rk(k){return {conv:"c",ml:"ml",e:"e",f:"f",min:"m",ov:"o"}[k];}
  if(o.custom) return {s:o.conv,road:"c"};
  switch(road){
    case "c": return has(o.conv)?{s:o.conv,road:"c"}:pick("conv",["ml","e","f"]);
    case "ml": return pick("ml",["conv"]);
    case "e": return pick("e",["f","ml","conv"]);
    case "f": return pick("f",["e","ml","conv"]);
    case "m": return pick("min",["conv"]);
    case "o": return pick("ov",["f","e","ml","conv"]);
  }
  return {s:o.conv,road:"c"};
}
function parse(s){ if(!s) return null; s=String(s).trim().toLowerCase(); if(/d$/.test(s)) return [parseFloat(s)]; return s.split("x").map(Number); }
function area(shape,d,basis){
  if(!d||!d.length||d.some(x=>isNaN(x))) return null;
  const w=d[0], h=d[1]??d[0];
  if(basis==="rect"){
    if(shape==="tri") return w*(Math.sqrt(3)/2*w)/144;
    if(shape==="pen"){const b=d[2];return Math.sqrt(w*w-b*b/4)*b/144;}
    if(shape==="xbuck"){ return (w*0.7071+h*0.7071)**2/144; }
    return w*h/144;
  }
  switch(shape){
    case "oct": return 2*(Math.SQRT2-1)*w*w/144;
    case "tri": return Math.sqrt(3)/4*w*w/144;
    case "circ": return Math.PI*w*w/4/144;
    case "pen": {const b=d[2];return 0.5*b*Math.sqrt(w*w-b*b/4)/144;}
    case "pent": return 0.75*w*h/144;
    case "xbuck": return (2*w*h-h*h)/144;
    default: return w*h/144;
  }
}
const rangeOf=a=>{ if(a==null) return null; const r=+a.toFixed(2); return RANGES.find(x=>r>=x.min&&r<x.max); };
const fmtSize=(shape,s)=>!s?"—":shape==="circ"?parseFloat(s)+"″ dia.":String(s).replace(/x/g," × ");
const pill=(r,short)=>r?`<span class="pill" style="--c:var(${r.c});--cs:var(${r.c}Soft)">${r.k} · ${short?r.s:r.label}</span>`:"";
const f2=v=>(v||0).toFixed(2), f0=v=>Math.round(v||0).toLocaleString();

const custById=id=>CUSTOM.find(c=>c.id===id);
function signObj(kind,ref){ return kind==="custom"?custById(ref):SIGN[ref]; }
function calcSign(o,road){ const z=sizeFor(o,road); const a=area(o.sh,parse(z.s),P.basis); return {z,a,r:rangeOf(a)}; }
const faceCache=new Map();
function signFace(o,s){ const k=(o.custom?"c:"+o.id+":"+o.v:"s:"+o.id)+"|"+s; if(!faceCache.has(k)) faceCache.set(k,SF.draw(o,s)); return faceCache.get(k); }
function devFace(d){ const k="d:"+d.face; if(!faceCache.has(k)) faceCache.set(k,DEVFACE.draw(d.face)); return faceCache.get(k); }

// ---------------- items & search ----------------
const norm=s=>String(s||"").toLowerCase().replace(/[^a-z0-9]/g,"");
function buildItems(){
  const items=[];
  SIGNS.forEach(o=>{ const leg=(LEG[o.c]||"").startsWith("#")?"":(LEG[o.c]||"").replace(/\|/g," ");
    const text=[o.c,o.n,leg,TYPE[o.t],SHAPE[o.sh],o.note,o.src,o.ttc?"work zone construction":""].join(" ").toLowerCase();
    items.push({kind:"sign",id:o.id,o,code:norm(o.c),text,flat:norm(text),cat:o.t}); });
  CUSTOM.forEach(o=>{ const text=[o.c,o.n,o.leg,o.project,"project specific custom",TYPE[o.t]].join(" ").toLowerCase();
    items.push({kind:"custom",id:o.id,o,code:norm(o.c),text,flat:norm(text),cat:"CUS"}); });
  DEVICES.forEach(d=>{ const text=[d.id,d.n,d.aka,d.spec,DCAT[d.cat].n].join(" ").toLowerCase();
    items.push({kind:"dev",id:d.id,o:d,code:norm(d.id),text,flat:norm(text),cat:d.cat}); });
  return items;
}
let ITEMS=buildItems();
function search(q){
  const nq=norm(q); if(!nq) return null;
  const words=q.toLowerCase().split(/[\s,]+/).map(norm).filter(Boolean);
  const out=[];
  ITEMS.forEach(x=>{
    let score=-1, road=null;
    if(x.code===nq) score=100;
    else if(x.kind==="sign" && x.code+"e"===nq){score=99;road="e";}
    else if(x.kind==="sign" && x.code+"f"===nq){score=99;road="f";}
    else if(x.code.startsWith(nq)) score=80-Math.min(20,x.code.length-nq.length);
    else if(nq.length>=2 && x.code.includes(nq)) score=55;
    else if(words.length && words.every(w=>x.text.includes(w)||x.flat.includes(w))) score=40+(x.o.ttc?3:0)+(x.kind!=="sign"?2:0);
    else if(nq.length>=4 && x.flat.includes(nq)) score=30;
    if(score>=0) out.push({x,score,road});
  });
  out.sort((a,b)=>b.score-a.score);
  return out;
}

// ---------------- lines ----------------
function lineKey(kind,ref,road){ return kind==="sign"?`s:${ref}|${road}`:kind==="custom"?`c:${ref}`:`d:${ref}`; }
const findLine=key=>P.lines.find(l=>l.key===key);
function defaultLight(kind,ref){ if(kind==="dev"){ const d=DEV[ref]; if(d&&d.lt) return {lt:d.lt,ln:d.ln||1}; } return {lt:"",ln:0}; }
function setQty(kind,ref,road,qty){
  qty=Math.max(0,Math.round(+qty||0));
  const key=lineKey(kind,ref,road);
  let l=findLine(key);
  if(!l && qty>0){ const pl=pendingLight[key]||defaultLight(kind,ref); l={key,kind,ref,road:kind==="sign"?road:"",qty:0,days:"",lt:pl.lt,ln:pl.ln}; P.lines.push(l); }
  if(l){ l.qty=qty; if(!qty) P.lines=P.lines.filter(x=>x!==l); }
  markDirty();
}
function lineInfo(l){
  const days=(l.days===""||l.days==null)?(+P.days||0):(+l.days||0);
  const lights=(l.lt?(+l.ln||0):0)*l.qty;
  const base={days,unitDays:l.qty*days,lights,lightDays:lights*days};
  if(l.kind==="dev"){ const d=DEV[l.ref]; if(!d) return null; return {...base,dev:d,group:d.cat,name:d.n,code:d.id,unit:d.unit}; }
  const o=signObj(l.kind,l.ref); if(!o) return null;
  const c=calcSign(o,l.road||"c");
  return {...base,o,...c,group:c.r?c.r.k:"X",name:o.n,code:o.c,unit:"EA",tsf:c.a!=null?c.a*l.qty:0};
}

// ---------------- render: header ----------------
function renderHeader(){
  $("projName").textContent=P.name||"Untitled project";
  $("storeMode").textContent=Store.mode()==="account"?"Saved to your account":"Saved in this browser";
  $("road").innerHTML=ROADS.map(r=>`<button type="button" data-v="${r.k}" aria-pressed="${S.road===r.k}">${r.k==="c"?"Conv":r.k==="ml"?"Multi-lane":r.k==="e"?"Expwy (E)":r.k==="f"?"Fwy (F)":r.k==="m"?"Min":"Oversized"}</button>`).join("");
  document.querySelectorAll("nav.tabs button").forEach(b=>b.setAttribute("aria-selected",b.dataset.tab===S.tab));
  $("p-signs").hidden=S.tab!=="signs"; $("p-sheet").hidden=S.tab!=="sheet"; $("p-guide").hidden=S.tab!=="guide";
}

// ---------------- render: catalog ----------------
function lightSelect(key,cur,label){
  return `<select data-light="${esc(key)}" class="${cur?"on":""}" aria-label="Warning light for ${esc(label)}"><option value="">No light</option>${LIGHTS.map(L=>`<option value="${L.k}"${cur===L.k?" selected":""}>${L.n}</option>`).join("")}</select>`;
}
function stepper(key,q,label){
  return `<div class="step"><button type="button" data-step="-1" data-key="${esc(key)}" aria-label="Fewer ${esc(label)}">−</button><input type="number" min="0" inputmode="numeric" value="${q||""}" placeholder="0" data-qty="${esc(key)}" aria-label="Quantity of ${esc(label)}"><button type="button" data-step="1" data-key="${esc(key)}" aria-label="More ${esc(label)}">+</button></div>`;
}
function rowSign(x,road){
  const o=x.o, isC=x.kind==="custom";
  const c=calcSign(o,road); const effRoad=isC?"c":road;
  const key=lineKey(x.kind,o.id,effRoad);
  const l=findLine(key); const q=l?l.qty:0;
  const lt=l?l.lt:(pendingLight[key]?.lt||"");
  const others=isC?"":ROADS.filter(r=>r.k!==road).map(r=>{ const z=sizeFor(o,r.k); if(z.fb) return ""; const a=area(o.sh,parse(z.s),P.basis); const rg=rangeOf(a); return a==null?"":`<span>${r.short} ${fmtSize(o.sh,z.s)} · ${f2(a)} (${rg.k})</span>`; }).join("");
  const sfx=!isC&&RL[road].sfx&&!c.z.fb?`<span class="sfx">${RL[road].sfx}</span>`:"";
  const tags=(isC?`<span class="tag" style="--c:var(--cu);--cs:var(--cuSoft)">Project-specific · ${esc(o.project||"")}</span>`:"")+(o.ttc&&!isC?`<span class="tag" style="--c:var(--accent);--cs:var(--accentSoft)">6F-1</span>`:"");
  const sizeSel=isC?`<button class="btn sm" type="button" data-edit="${esc(o.id)}">Edit</button><button class="btn sm danger" type="button" data-delc="${esc(o.id)}">Delete</button>`
    :`<select data-size="${esc(o.id)}" aria-label="Size for ${esc(o.c)}">${ROADS.map(r=>{const z=sizeFor(o,r.k);return `<option value="${r.k}"${r.k===road?" selected":""}${z.fb&&r.k!=="c"?" disabled":""}>${r.short}</option>`;}).join("")}</select>`;
  return `<div class="item${q?" has":""}" data-kind="${x.kind}" data-id="${esc(o.id)}" data-road="${effRoad}">
    <div class="face">${signFace(o,c.z.s)}</div>
    <div><div class="code mono">${esc(o.c)}${sfx}${tags}</div><div class="nm">${esc(o.n)}</div>
      <div class="meta">${TYPE[o.t]||""} · ${SHAPE[o.sh]||""}${isC?"":" · Table "+esc(o.src)}${o.note?" · "+esc(o.note):""}</div></div>
    <div class="sizes">${c.a!=null?`<div class="cur"><span class="dim mono">${fmtSize(o.sh,c.z.s)}</span><span class="sf mono">${f2(c.a)} SF</span>${pill(c.r,true)}</div>
      ${c.z.fb&&!isC?`<div class="meta">No ${RL[road].label} size · showing ${RL[c.z.road].label}</div>`:""}<div class="others mono">${others}</div>`:`<div class="meta">No size listed</div>`}</div>
    <div class="ctrl">${sizeSel}${lightSelect(key,lt,o.c)}${stepper(key,q,o.c)}</div></div>`;
}
function rowDev(x){
  const d=x.o, key=lineKey("dev",d.id), l=findLine(key), q=l?l.qty:0;
  const lt=l?l.lt:(pendingLight[key]?pendingLight[key].lt:(d.lt||""));
  const cat=DCAT[d.cat];
  return `<div class="item${q?" has":""}" data-kind="dev" data-id="${esc(d.id)}">
    <div class="face">${devFace(d)}</div>
    <div><div class="code mono">${esc(d.id)}<span class="tag" style="--c:var(${cat.c});--cs:var(${cat.c}Soft)">${cat.n}</span></div><div class="nm">${esc(d.n)}</div></div>
    <div class="sizes"><div class="meta" style="color:var(--ink2)">${esc(d.spec)}</div><div class="meta">Unit: ${d.unit}${d.lt?` · Comes with ${LT[d.lt].n} light`:""}</div></div>
    <div class="ctrl">${d.cat==="L"?"":lightSelect(key,lt,d.n)}${stepper(key,q,d.n)}</div></div>`;
}
const CHIPS=[[null,"All"],["W","Warning"],["R","Regulatory"],["G","Guide / detour"],["S","School"],["CUS","Project-specific"],["BAR","Barricades"],["CH","Channelizing"],["L","Lights"],["O","Other devices"]];
function renderCatalog(){
  const res=search(S.q);
  let rows;
  if(res){ rows=res.map(r=>({x:r.x,road:r.road||S.road})); }
  else{
    rows=ITEMS.filter(x=>(!S.cat||x.cat===S.cat)&&(!S.ttc||x.o.ttc)).map(x=>({x,road:S.road}));
    if(S.range) rows=rows.filter(r=>r.x.kind!=="dev"&&calcSign(r.x.o,r.road).r?.k===S.range);
    if(!S.cat&&!S.ttc&&!S.range){ // work zone signs and devices first
      rows.sort((a,b)=>rank(a.x)-rank(b.x));
    }
  }
  function rank(x){ return x.kind==="custom"?0:x.o.ttc?1:x.kind==="dev"?2:3; }
  const dim=res?" dim":"";
  const catCount=k=>ITEMS.filter(x=>!k||x.cat===k).length;
  $("filters").innerHTML=CHIPS.map(([k,l])=>`<button type="button" class="chip${dim}" data-cat="${k??""}" aria-pressed="${!res&&S.cat===k}">${l}<span class="ct">${catCount(k)}</span></button>`).join("")
    +`<span class="vsep"></span><button type="button" class="chip${dim}" data-ttc="1" aria-pressed="${!res&&S.ttc}">Work zone signs (6F-1)</button><span class="vsep"></span>`
    +RANGES.map(R=>`<button type="button" class="chip${dim}" data-range="${R.k}" aria-pressed="${!res&&S.range===R.k}" style="--c:var(${R.c})"><span class="dot"></span>${R.k} · ${R.s}</button>`).join("");
  const total=rows.length, shown=rows.slice(0,S.limit);
  $("hint").textContent=res?`${total} match${total===1?"":"es"} across every category for “${S.q.trim()}”`:`${total} items · sign sizes shown for ${RL[S.road].label}`;
  $("list").innerHTML=shown.map(r=>r.x.kind==="dev"?rowDev(r.x):rowSign(r.x,r.road)).join("")+(total>S.limit?`<div class="more"><button class="btn" type="button" id="moreBtn">Show ${Math.min(60,total-S.limit)} more of ${total-S.limit}</button></div>`:"");
  $("list").hidden=!total; $("empty").hidden=!!total;
}
function renderBar(){
  const T=totals();
  $("badge").textContent=T.count||"";
  const parts=[];
  RANGES.forEach(R=>{ if(T.g[R.k].qty) parts.push(`<span>${pill(R,true)} <b class="mono">${T.g[R.k].qty}</b></span>`); });
  Object.entries(DCAT).forEach(([k,c])=>{ if(T.g[k].qty) parts.push(`<span><span class="tag" style="--c:var(${c.c});--cs:var(${c.c}Soft)">${c.n}</span> <b class="mono">${T.g[k].qty}</b></span>`); });
  const lt=Object.values(T.lights).reduce((a,b)=>a+b.total,0);
  if(lt) parts.push(`<span><span class="tag" style="--c:var(--lt);--cs:var(--ltSoft)">Warning lights</span> <b class="mono">${lt}</b></span>`);
  $("barsum").innerHTML=parts.length?parts.join(""):`<span class="meta">Enter quantities with + / −. Totals show up here.</span>`;
  $("bar").hidden=S.tab!=="signs";
}

// ---------------- totals ----------------
function totals(){
  const g={}; [...RANGES.map(r=>r.k),...Object.keys(DCAT)].forEach(k=>g[k]={qty:0,sf:0,ud:0,lights:0,ld:0,lf:0});
  const lights={}; LIGHTS.forEach(L=>lights[L.k]={att:0,alone:0,total:0,ld:0});
  let count=0;
  P.lines.forEach(l=>{ const i=lineInfo(l); if(!i) return; const G=g[i.group]; if(!G) return;
    G.qty+=l.qty; G.ud+=i.unitDays; G.sf+=i.tsf||0; count+=l.qty;
    if(i.lights&&l.lt){ lights[l.lt].att+=i.lights; lights[l.lt].total+=i.lights; lights[l.lt].ld+=i.lightDays; G.lights+=i.lights; G.ld+=i.lightDays; }
    if(i.dev&&i.dev.light){ lights[i.dev.light].alone+=l.qty; lights[i.dev.light].total+=l.qty; lights[i.dev.light].ld+=i.unitDays; }
  });
  return {g,lights,count};
}

// ---------------- render: summary sheet ----------------
function renderSheet(){
  $("pName").value=P.name; $("pNo").value=P.number; $("pLoc").value=P.location; $("days").value=P.days;
  document.querySelectorAll("#basis button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===P.basis));
  const T=totals();
  let cards=RANGES.filter(R=>R.k!=="X"||T.g.X.qty).map(R=>`<div class="card" style="--c:var(${R.c})"><h3>${R.k} · ${R.label}</h3><div class="sub">${R.pay}</div>
    <div class="kv"><span class="u">Signs</span><b class="mono">${T.g[R.k].qty}</b><span class="u">Total SF</span><span class="mono">${f2(T.g[R.k].sf)}</span><span class="u">Sign-days (SD)</span><b class="mono">${f0(T.g[R.k].ud)}</b></div></div>`).join("");
  Object.entries(DCAT).forEach(([k,c])=>{ if(k==="L") return; if(!T.g[k].qty && k!=="BAR") return;
    cards+=`<div class="card" style="--c:var(${c.c})"><h3>${c.n}</h3><div class="sub">${k==="BAR"?"Each with its warning light":"All types"}</div><div class="kv"><span class="u">Quantity</span><b class="mono">${T.g[k].qty}</b><span class="u">Unit-days</span><b class="mono">${f0(T.g[k].ud)}</b></div></div>`; });
  const lt=LIGHTS.filter(L=>T.lights[L.k].total);
  cards+=`<div class="card" style="--c:var(--lt)"><h3>Warning lights</h3><div class="sub">All types, on devices and stand-alone</div><div class="kv">${lt.length?lt.map(L=>`<span class="u">${L.n}</span><b class="mono">${T.lights[L.k].total}</b>`).join(""):`<span class="u">None yet</span><b class="mono">0</b>`}<span class="u">Light-days</span><span class="mono">${f0(lt.reduce((a,L)=>a+T.lights[L.k].ld,0))}</span></div></div>`;
  $("cards").innerHTML=cards;

  if(!P.lines.length){ $("sheet").innerHTML=`<tr><td colspan="14" class="empty">No quantities yet. Add signs and devices on <b>Enter items</b>.</td></tr>`; }
  else{
    let html=""; const groups=[...RANGES.map(R=>({k:R.k,n:R.pay,c:R.c,sign:true})),...Object.entries(DCAT).map(([k,c])=>({k,n:c.n,c:c.c}))];
    let grand={qty:0,sf:0,ud:0,li:0,ld:0};
    groups.forEach(G=>{
      const ls=P.lines.map((l,idx)=>({l,idx,i:lineInfo(l)})).filter(r=>r.i&&r.i.group===G.k).sort((a,b)=>String(a.i.code).localeCompare(String(b.i.code),undefined,{numeric:true}));
      if(!ls.length) return;
      html+=`<tr class="grp" style="--c:var(${G.c});--cs:var(${G.c}Soft)"><td colspan="14">${G.sign?G.k+" · ":""}${esc(G.n)}</td></tr>`;
      const s={qty:0,sf:0,ud:0,li:0,ld:0};
      ls.forEach(({l,idx,i})=>{
        s.qty+=l.qty; s.sf+=i.tsf||0; s.ud+=i.unitDays; s.li+=i.lights; s.ld+=i.lightDays;
        const face=i.dev?devFace(i.dev):signFace(i.o,i.z.s);
        const sfx=l.kind==="sign"&&RL[l.road]?.sfx&&!i.z.fb?`<span class="sfx"> ${RL[l.road].sfx}</span>`:"";
        const isLight=i.dev&&i.dev.cat==="L";
        html+=`<tr>
          <td class="f"><div class="face">${face}</div></td>
          <td class="mono" style="font-weight:800;white-space:nowrap">${esc(i.code)}${sfx}${l.kind==="custom"?' <span class="tag" style="--c:var(--cu);--cs:var(--cuSoft)">PS</span>':""}</td>
          <td>${esc(i.name)}${i.dev&&i.dev.unit!=="EA"?` <span class="meta">(${i.dev.unit})</span>`:""}</td>
          <td class="mono" style="white-space:nowrap">${i.dev?"—":fmtSize(i.o.sh,i.z.s)}</td>
          <td class="num mono">${i.dev?"":f2(i.a)}</td>
          <td class="num"><input class="num-in mono" type="number" min="0" value="${l.qty}" data-lq="${idx}" aria-label="Quantity"></td>
          <td class="num mono">${i.dev?"":f2(i.tsf)}</td>
          <td class="num"><input class="num-in mono" type="number" min="0" value="${l.days??""}" placeholder="${+P.days||0}" data-ld="${idx}" aria-label="Days"></td>
          <td class="num mono" style="font-weight:700">${f0(i.unitDays)}</td>
          <td>${isLight?`<span class="meta">${LT[i.dev.light].n} (stand-alone)</span>`:`<select data-llt="${idx}" aria-label="Warning light type"><option value="">None</option>${LIGHTS.map(L=>`<option value="${L.k}"${l.lt===L.k?" selected":""}>${L.n}</option>`).join("")}</select>`}</td>
          <td class="num">${isLight||!l.lt?"":`<input class="num-in mono" style="width:48px" type="number" min="0" value="${l.ln}" data-lln="${idx}" aria-label="Lights per unit">`}</td>
          <td class="num mono">${i.lights||""}</td>
          <td class="num mono">${i.lightDays?f0(i.lightDays):""}</td>
          <td><button class="rm" type="button" data-rm="${idx}" aria-label="Remove line">×</button></td></tr>`;
      });
      html+=`<tr class="subt"><td></td><td colspan="4">Subtotal · ${esc(G.sign?G.k:G.n)}</td><td class="num mono">${s.qty}</td><td class="num mono">${G.sign?f2(s.sf):""}</td><td></td><td class="num mono">${f0(s.ud)}</td><td></td><td></td><td class="num mono">${s.li||""}</td><td class="num mono">${s.ld?f0(s.ld):""}</td><td></td></tr>`;
      grand.qty+=s.qty; grand.sf+=s.sf; grand.ud+=s.ud; grand.li+=s.li; grand.ld+=s.ld;
    });
    html+=`<tr class="grand"><td></td><td colspan="4">Total, all items</td><td class="num mono">${grand.qty}</td><td class="num mono">${f2(grand.sf)}</td><td></td><td class="num mono">${f0(grand.ud)}</td><td></td><td></td><td class="num mono">${grand.li||""}</td><td class="num mono">${grand.ld?f0(grand.ld):""}</td><td></td></tr>`;
    $("sheet").innerHTML=html;
  }
  $("lightsum").innerHTML=LIGHTS.map(L=>{const t=T.lights[L.k];return `<tr><td style="font-weight:700;white-space:nowrap">${L.full}</td><td class="meta" style="color:var(--ink2)">${esc(L.use)}</td><td class="num mono">${t.att}</td><td class="num mono">${t.alone}</td><td class="num mono" style="font-weight:800">${t.total}</td><td class="num mono">${f0(t.ld)}</td></tr>`;}).join("");
  renderStatus();
}
function renderStatus(){
  const el=$("saveStatus"); if(!el) return;
  const where=Store.mode()==="account"?"your account":"this browser";
  el.className="status"+(dirty?" dirty":"");
  el.textContent=dirty?`Unsaved changes · saves to ${where}`:(P.savedAt?`Saved ${new Date(P.savedAt).toLocaleString()} · ${where}`:`Not saved yet · saves to ${where}`);
  $("projName").textContent=P.name||"Untitled project";
}
async function refreshSaved(){
  saved=await Store.listProjects();
  saved.sort((a,b)=>(b.savedAt||0)-(a.savedAt||0));
  $("openProj").innerHTML=`<option value="">Open saved project… (${saved.length})</option>`+saved.map(p=>`<option value="${esc(p.id)}">${esc(p.name||"Untitled")}${p.number?" · "+esc(p.number):""}</option>`).join("");
}
async function refreshCustom(){
  const list=await Store.listCustom();
  CUSTOM=list; LS.set("wzsf3-custom",list); ITEMS=buildItems();
}

function renderAll(){ renderHeader(); if(S.tab==="signs") renderCatalog(); if(S.tab==="sheet") renderSheet(); if(S.tab==="guide") renderGuide(); renderBar(); }
function renderGuide(){ $("lightRef").innerHTML=LIGHTS.map(L=>`<tr><td style="font-weight:700;white-space:nowrap">${L.full}</td><td>${esc(L.use)}</td></tr>`).join(""); }

// ---------------- events: header/catalog ----------------
document.querySelector("nav.tabs").addEventListener("click",e=>{const b=e.target.closest("button"); if(b){S.tab=b.dataset.tab; renderAll(); window.scrollTo({top:0});}});
$("goSheet").addEventListener("click",()=>{S.tab="sheet";renderAll();window.scrollTo({top:0});});
$("road").addEventListener("click",e=>{const b=e.target.closest("button"); if(b){S.road=b.dataset.v; S.limit=60; draft(); renderAll();}});
let qT; $("q").addEventListener("input",e=>{ S.q=e.target.value; S.limit=60; clearTimeout(qT); qT=setTimeout(renderCatalog,90); });
$("clearQ").addEventListener("click",()=>{S.q="";$("q").value="";S.limit=60;renderCatalog();$("q").focus();});
$("filters").addEventListener("click",e=>{const b=e.target.closest(".chip"); if(!b) return;
  if(S.q){S.q="";$("q").value="";}
  if(b.dataset.range) S.range=S.range===b.dataset.range?null:b.dataset.range;
  else if(b.dataset.ttc) S.ttc=!S.ttc;
  else S.cat=b.dataset.cat||null;
  S.limit=60; renderCatalog();});
const list=$("list");
function parseKey(key){ if(key.startsWith("s:")){ const [ref,road]=key.slice(2).split("|"); return {kind:"sign",ref,road}; } if(key.startsWith("c:")) return {kind:"custom",ref:key.slice(2),road:"c"}; return {kind:"dev",ref:key.slice(2),road:""}; }
function refreshRow(item){
  const kind=item.dataset.kind, id=item.dataset.id;
  const x=ITEMS.find(i=>i.kind===kind&&i.id===id); if(!x) return;
  const html=kind==="dev"?rowDev(x):rowSign(x,item.dataset.road||S.road);
  const t=document.createElement("div"); t.innerHTML=html; item.replaceWith(t.firstElementChild);
}
list.addEventListener("click",e=>{
  if(e.target.id==="moreBtn"){ S.limit+=60; renderCatalog(); return; }
  const st=e.target.closest("[data-step]");
  if(st){ const k=parseKey(st.dataset.key); const l=findLine(st.dataset.key); setQty(k.kind,k.ref,k.road,(l?l.qty:0)+ +st.dataset.step); refreshRow(st.closest(".item")); renderBar(); return; }
  const ed=e.target.closest("[data-edit]"); if(ed){ openCustom(custById(ed.dataset.edit)); return; }
  const dc=e.target.closest("[data-delc]"); if(dc){ deleteCustom(dc.dataset.delc); return; }
});
list.addEventListener("change",e=>{
  const t=e.target;
  if(t.dataset.qty!=null){ const k=parseKey(t.dataset.qty); setQty(k.kind,k.ref,k.road,t.value); refreshRow(t.closest(".item")); renderBar(); return; }
  if(t.dataset.light!=null){ const key=t.dataset.light; const l=findLine(key); const lt=t.value;
    if(l){ l.lt=lt; l.ln=lt?(+l.ln||1):0; markDirty(); } else pendingLight[key]={lt,ln:lt?1:0};
    t.classList.toggle("on",!!lt); renderBar(); return; }
  if(t.dataset.size!=null){ const item=t.closest(".item"); item.dataset.road=t.value; refreshRow(item); return; }
});

// ---------------- events: sheet ----------------
function bindField(id,prop,num){ $(id).addEventListener("input",e=>{ P[prop]=num?(+e.target.value||0):e.target.value; markDirty(); if(num) renderSheet(); }); }
bindField("pName","name"); bindField("pNo","number"); bindField("pLoc","location");
$("days").addEventListener("change",e=>{ P.days=Math.max(0,+e.target.value||0); markDirty(); renderSheet(); });
$("basis").addEventListener("click",e=>{const b=e.target.closest("button"); if(b){P.basis=b.dataset.v; markDirty(); faceCache.clear(); renderSheet();}});
const sheet=$("sheet");
sheet.addEventListener("change",e=>{
  const d=e.target.dataset, v=e.target.value;
  if(d.lq!=null){ const l=P.lines[+d.lq]; l.qty=Math.max(0,Math.round(+v||0)); if(!l.qty) P.lines.splice(+d.lq,1); }
  else if(d.ld!=null){ P.lines[+d.ld].days=v===""?"":Math.max(0,+v||0); }
  else if(d.llt!=null){ const l=P.lines[+d.llt]; l.lt=v; l.ln=v?(+l.ln||1):0; }
  else if(d.lln!=null){ P.lines[+d.lln].ln=Math.max(0,+v||0); }
  else return;
  markDirty(); renderSheet(); renderBar();
});
sheet.addEventListener("click",e=>{const b=e.target.closest("[data-rm]"); if(b){P.lines.splice(+b.dataset.rm,1); markDirty(); renderSheet(); renderBar();}});
function flash(t,bad){ const m=$("msg"); m.textContent=t; m.style.color=bad?"var(--rc)":""; clearTimeout(flash._t); flash._t=setTimeout(()=>m.textContent="",4000); }
$("bulkB").addEventListener("click",()=>{ let n=0; P.lines.forEach(l=>{ if(l.kind==="sign"){ const o=SIGN[l.ref]; if(o&&/^W2[01]-/.test(o.c)&&!/P$/.test(o.c)){ l.lt="B"; l.ln=Math.max(1,+l.ln||0); n++; } } }); markDirty(); renderSheet(); flash(n?`Type B light added to ${n} advance warning sign line${n===1?"":"s"}.`:"No W20/W21 signs on the sheet yet."); });
$("bulkNone").addEventListener("click",()=>{ P.lines.forEach(l=>{ if(l.kind!=="dev"){ l.lt=""; l.ln=0; } }); markDirty(); renderSheet(); flash("Lights removed from all sign lines. Barricade and device lights are unchanged."); });
$("clearAll").addEventListener("click",()=>{ if(!P.lines.length) return; P.lines=[]; markDirty(); renderSheet(); renderBar(); flash("Quantities cleared. Project details were kept."); });
$("print").addEventListener("click",()=>{ try{ window.print(); }catch(e){ flash("Printing isn't available here. Use Export to Excel instead.",true); } });

// projects
$("saveProj").addEventListener("click",async()=>{
  if(!P.name.trim()){ flash("Add a project name before saving.",true); $("pName").focus(); return; }
  P.savedAt=Date.now();
  const btn=$("saveProj"); btn.disabled=true;
  try{ await Store.saveProject(P); dirty=false; draft(); await refreshSaved(); flash(`Saved “${P.name}”.`); }
  catch(e){ flash("Couldn't save the project. Your work is still here. Try again in a moment.",true); }
  btn.disabled=false; renderStatus();
});
$("openProj").addEventListener("change",e=>{
  const p=saved.find(x=>x.id===e.target.value); e.target.value="";
  if(!p) return;
  if(dirty && P.lines.length && !confirmSwitch()) return;
  P=JSON.parse(JSON.stringify(p)); dirty=false; draft(); faceCache.clear(); renderAll(); flash(`Opened “${P.name}”.`);
});
function confirmSwitch(){ flash("You have unsaved changes. Save first, or click again to discard them.",true); if(confirmSwitch.armed){ confirmSwitch.armed=false; return true; } confirmSwitch.armed=true; setTimeout(()=>confirmSwitch.armed=false,5000); return false; }
$("newProj").addEventListener("click",()=>{ if(dirty && P.lines.length && !confirmSwitch()) return; P=blankProj(); dirty=false; draft(); renderAll(); flash("Started a new project."); $("pName").focus(); });
$("delProj").addEventListener("click",async()=>{
  if(!saved.find(x=>x.id===P.id)){ flash("This project hasn't been saved, so there's nothing to delete.",true); return; }
  if(!$("delProj").dataset.armed){ $("delProj").dataset.armed="1"; $("delProj").textContent="Click again to delete"; setTimeout(()=>{delete $("delProj").dataset.armed; $("delProj").textContent="Delete saved";},4000); return; }
  delete $("delProj").dataset.armed; $("delProj").textContent="Delete saved";
  try{ await Store.deleteProject(P.id); await refreshSaved(); P.savedAt=null; dirty=true; renderStatus(); flash("Saved copy deleted. The sheet stays open until you start a new project."); }
  catch(e){ flash("Couldn't delete it. Try again in a moment.",true); }
});

// ---------------- export ----------------
function tableRows(){
  const rows=[["Pay group","Item","Size type","Description","Size (in)","Shape","SF each","Qty","Unit","Total SF","Days","Sign/unit-days","Warning light","Lights per unit","Lights","Light-days"]];
  const order=[...RANGES.map(r=>r.k),...Object.keys(DCAT)];
  const gname=k=>RANGES.find(r=>r.k===k)?.pay||DCAT[k].n;
  order.forEach(k=>P.lines.map(lineInfo).forEach((i,idx)=>{ if(!i||i.group!==k) return; const l=P.lines[idx];
    rows.push([gname(k), i.code+(l.kind==="sign"&&["E","F"].includes(RL[l.road]?.sfx)&&!i.z.fb?RL[l.road].sfx:""), i.dev?"":(l.kind==="custom"?"Project-specific":RL[i.z.road].label), i.name, i.dev?"":i.z.s, i.dev?"":SHAPE[i.o.sh], i.dev?"":+f2(i.a), l.qty, i.dev?i.dev.unit:"EA", i.dev?"":+f2(i.tsf), i.days, i.unitDays, i.dev&&i.dev.light?LT[i.dev.light].full+" (stand-alone)":(l.lt?LT[l.lt].full:""), l.lt?+l.ln:"", i.lights||"", i.lightDays||""]); }));
  return rows;
}
function summaryRows(){
  const T=totals();
  const r=[["Work Zone Sign Quantity Summary"],[],["Project",P.name],["Job / contract no.",P.number],["Location / notes",P.location],["Construction calendar days",+P.days||0],["Sign area basis",P.basis==="actual"?"Actual shape area":"Width × height"],["Prepared",new Date().toLocaleDateString()],[],["Pay item","Quantity (EA)","Total SF","Sign-days / unit-days","Lights","Light-days"]];
  RANGES.forEach(R=>{ if(R.k!=="X"||T.g.X.qty) r.push([R.pay,T.g[R.k].qty,+f2(T.g[R.k].sf),T.g[R.k].ud,T.g[R.k].lights,T.g[R.k].ld]); });
  Object.entries(DCAT).forEach(([k,c])=>{ if(k!=="L") r.push([c.n,T.g[k].qty,"",T.g[k].ud,T.g[k].lights,T.g[k].ld]); });
  r.push([]); r.push(["Warning lights","On signs & devices","Stand-alone","Total lights","Light-days"]);
  LIGHTS.forEach(L=>{ const t=T.lights[L.k]; r.push([L.full,t.att,t.alone,t.total,t.ld]); });
  r.push([]); r.push(["Sign-days = quantity × days. Sizes per MUTCD 2009 Table 6F-1 and Part 2 tables; project plans govern."]);
  return r;
}
function lineDetail(){
  return [["Item","Description","Qty","Days","Warning light","Per unit"]];
}
async function exportXlsx(){
  if(!window.XLSX){ flash("The Excel library didn't load. Check your connection, or use Copy table instead.",true); return; }
  const wb=XLSX.utils.book_new();
  const s1=XLSX.utils.aoa_to_sheet(summaryRows()); s1["!cols"]=[{wch:44},{wch:16},{wch:14},{wch:22},{wch:12},{wch:12}];
  const s2=XLSX.utils.aoa_to_sheet(tableRows()); s2["!cols"]=[{wch:34},{wch:12},{wch:16},{wch:40},{wch:12},{wch:11},{wch:9},{wch:7},{wch:6},{wch:10},{wch:7},{wch:14},{wch:34},{wch:12},{wch:8},{wch:11}];
  s2["!autofilter"]={ref:"A1:P1"};
  XLSX.utils.book_append_sheet(wb,s1,"Summary");
  XLSX.utils.book_append_sheet(wb,s2,"Quantities");
  const used=new Set(P.lines.filter(l=>l.kind==="custom").map(l=>l.ref)); const cs=CUSTOM.filter(c=>used.has(c.id)||c.project===P.name);
  if(cs.length){ const s3=XLSX.utils.aoa_to_sheet([["Project","Code","Description","Category","Shape","Size (in)","Actual SF","Legend"],...cs.map(c=>[c.project,c.c,c.n,TYPE[c.t],SHAPE[c.sh],c.conv,+f2(area(c.sh,parse(c.conv),"actual")),(c.leg||"").replace(/\|/g," / ")])]); s3["!cols"]=[{wch:26},{wch:12},{wch:36},{wch:14},{wch:12},{wch:10},{wch:10},{wch:36}]; XLSX.utils.book_append_sheet(wb,s3,"Project-specific signs"); }
  const buf=XLSX.write(wb,{bookType:"xlsx",type:"array"});
  const fname=((P.name||"Work zone quantities").replace(/[\\/:*?"<>|]+/g," ").trim().slice(0,80)||"Work zone quantities")+" - sign quantities.xlsx";
  const blob=new Blob([buf],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
  let dl=null; try{ dl=window.claude&&window.claude.use?await Promise.race([window.claude.use("downloads"),new Promise(r=>setTimeout(()=>r(null),1500))]):null; }catch(e){ dl=null; }
  if(dl){
    try{ await dl.save({filename:fname,data:blob}); flash("Excel file saved."); }
    catch(e){ const c=e&&e.code; if(c==="declined") flash("Download canceled."); else if(c==="rate_limited") flash("A save prompt is already open.",true); else flash("The Excel download isn't available here. Use Copy table instead.",true); }
    return;
  }
  try{ const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=fname; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500); flash("Excel file downloaded."); }
  catch(e){ flash("The download was blocked. Use Copy table instead.",true); }
}
$("xlsx").addEventListener("click",exportXlsx);
$("copy").addEventListener("click",()=>{
  const txt=[...summaryRows(),[],...tableRows()].map(r=>r.join("\t")).join("\n");
  if(navigator.clipboard) navigator.clipboard.writeText(txt).then(()=>flash("Copied. Paste into Excel."),()=>flash("The browser blocked copying.",true));
  else flash("Copying isn't available in this browser.",true);
});

// ---------------- custom signs ----------------
const dlg=$("dlg"); let editing=null;
function customFromForm(){
  const sh=$("cShape").value, w=+$("cW").value, h=+$("cH").value;
  const t=$("cType").value;
  const sq=["dia","oct","tri","circ"].includes(sh);
  const conv=sh==="circ"?`${w}d`:sh==="tri"?`${w}x${w}x${w}`:sq?`${w}x${w}`:`${w}x${h}`;
  const legLines=$("cLeg").value.split(/\n|\|/).map(s=>s.trim().toUpperCase()).filter(Boolean);
  const orange=$("cOrange").checked;
  const color = t==="R"?{bg:"#fff",fg:"#111"}: t==="S"?{bg:"#C6DA2E",fg:"#111"}: orange?{bg:"#F7862A",fg:"#111"}: t==="G"?{bg:"#0B6B3A",fg:"#fff"}:{bg:"#FFCC1F",fg:"#111"};
  return {id:editing?editing.id:"cs-"+uidGen(),custom:true,v:Date.now(),project:$("cProj").value.trim(),c:$("cCode").value.trim(),n:$("cName").value.trim(),t,sh,conv,leg:legLines.length?legLines.join("|"):null,color,orange,ttc:orange};
}
function cPreview(){
  const sh=$("cShape").value;
  const one=["dia","oct","tri","circ"].includes(sh);
  $("cHwrap").hidden=one;
  $("cWl").textContent=sh==="circ"?"Diameter (in)":sh==="dia"||sh==="tri"?"Side (in)":"Width (in)";
  const o=customFromForm(); if(!o.leg) o.leg=(o.n||o.c||"SIGN").toUpperCase().split(" ").reduce((a,w)=>{const L=a[a.length-1];if(L&&(L+" "+w).length<=11)a[a.length-1]=L+" "+w;else a.push(w);return a;},[]).slice(0,4).join("|");
  const a=area(o.sh,parse(o.conv),P.basis), r=rangeOf(a);
  $("cPrev").innerHTML=(+$("cW").value>0)?SF.draw(o,o.conv):"";
  $("cArea").textContent=a?`${fmtSize(o.sh,o.conv)} · ${f2(a)} SF`:"Enter a size";
  $("cPill").innerHTML=pill(r);
}
function openCustom(c){
  editing=c||null;
  $("dlgTitle").textContent=c?"Edit project-specific sign":"New project-specific sign";
  $("cProj").value=c?c.project:(P.name||"");
  $("cCode").value=c?c.c:""; $("cName").value=c?c.n:""; $("cType").value=c?c.t:"W"; $("cShape").value=c?c.sh:"rect";
  const d=c?parse(c.conv):[48,30]; $("cW").value=d[0]; $("cH").value=d[1]??d[0];
  $("cLeg").value=c&&c.leg?c.leg.split("|").join("\n"):""; $("cOrange").checked=c?!!c.orange:true; $("cMsg").textContent="";
  cPreview();
  if(dlg.showModal) dlg.showModal(); else dlg.setAttribute("open","");
  setTimeout(()=>$(c?"cName":"cCode").focus(),30);
}
["cShape","cW","cH","cLeg","cType","cOrange","cCode","cName"].forEach(id=>$(id).addEventListener("input",cPreview));
$("newCustom").addEventListener("click",()=>openCustom(null));
$("cform").addEventListener("submit",async e=>{
  const sub=e.submitter; if(!sub||sub.value!=="save") return;
  e.preventDefault();
  const o=customFromForm();
  if(!o.project||!o.c||!o.n||!(+$("cW").value>0)||(!$("cHwrap").hidden&&!(+$("cH").value>0))){ $("cMsg").textContent="Fill in project, code, description and size."; return; }
  $("cSave").disabled=true;
  try{
    await Store.saveCustom(o);
    await refreshCustom(); faceCache.clear();
    dlg.close();
    if(!P.name){ P.name=o.project; markDirty(); }
    S.q=o.c; $("q").value=o.c; S.tab="signs"; renderAll();
  }catch(err){ $("cMsg").textContent="Couldn't save the sign. Try again in a moment."; }
  $("cSave").disabled=false;
});
async function deleteCustom(id){
  const btn=list.querySelector(`[data-delc="${CSS.escape(id)}"]`);
  if(btn&&!btn.dataset.armed){ btn.dataset.armed="1"; btn.textContent="Confirm delete"; setTimeout(()=>{ if(btn.isConnected){delete btn.dataset.armed; btn.textContent="Delete";} },4000); return; }
  try{ await Store.deleteCustom(id); P.lines=P.lines.filter(l=>!(l.kind==="custom"&&l.ref===id)); markDirty(); await refreshCustom(); renderAll(); }
  catch(e){ if(btn) btn.textContent="Couldn't delete"; }
}

// ---------------- boot ----------------
if(!LS.get("wzsf3-seen",false) && !P.lines.length){
  const add=(kind,ref,road,q,lt,ln)=>{ P.lines.push({key:lineKey(kind,ref,road),kind,ref,road,qty:q,days:"",lt:lt||"",ln:ln||0}); };
  P.name="Example project (replace me)";
  add("sign","W20-1","c",4,"B",1); add("sign","W20-5","c",2,"B",1); add("sign","W20-7","c",2,"B",1); add("sign","R2-1","c",2); add("sign","G20-2","c",2); add("sign","W3-5","c",2);
  add("dev","BARR-III","",4,"B",1); add("dev","DRUM","",40); add("dev","CONE-28","",60); add("dev","AB-C","",1);
  LS.set("wzsf3-seen",true); draft();
}
renderAll();
Store.ready.then(async()=>{ await Promise.all([refreshSaved(),refreshCustom()]); renderAll(); });
})();
