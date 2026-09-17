
// Sign face legends: "A|B|C" = text lines, "#name" = drawn symbol
const LEG = {
"R1-1":"#stop","R1-2":"#yield","R1-2aP":"TO ONCOMING|TRAFFIC","R1-7":"WAIT|ON|STOP","R1-8":"GO|ON|SLOW",
"R2-1":"#speed","R2-6P":"FINES|HIGHER","R2-6aP":"FINES|DOUBLE","R2-6bP":"$250|FINE",
"R2-10":"BEGIN|HIGHER|FINES|ZONE","R2-11":"END|HIGHER|FINES|ZONE","R2-12":"END|WORK ZONE|SPEED|LIMIT",
"R3-1":"#noright","R3-2":"#noleft","R3-3":"NO|TURNS","R3-4":"#nou","R3-18":"#nouleft","R3-27":"#nostraight",
"R3-5":"#laneonly","R3-6":"#laneopt","R3-7":"RIGHT LANE|MUST|TURN RIGHT","R3-8":"#lanecontrol",
"R4-1":"DO NOT|PASS","R4-2":"PASS|WITH|CARE","R4-7":"#keepright","R4-7c":"#keepright","R4-9":"STAY|IN|LANE",
"R5-1":"#dne","R5-1a":"#wrongway","R6-1":"#oneway","R6-2":"#oneway2","R8-3":"#nopark",
"R9-8":"#crosswalk","R9-9":"SIDEWALK|CLOSED","R9-10":"SIDEWALK CLOSED|USE OTHER SIDE","R9-11":"SIDEWALK CLOSED|AHEAD|CROSS HERE",
"R9-11a":"SIDEWALK CLOSED|CROSS HERE","R11-2":"ROAD|CLOSED","R11-3a":"ROAD CLOSED 10 MILES AHEAD|LOCAL TRAFFIC ONLY",
"R11-3b":"BRIDGE OUT 10 MILES AHEAD|LOCAL TRAFFIC ONLY","R11-4":"ROAD CLOSED|TO THRU TRAFFIC",
"R12-1":"WEIGHT|LIMIT|10|TONS","R12-2":"AXLE|WEIGHT|LIMIT|10 TONS","R12-5":"WEIGHT|LIMIT|10T 20T|30T",
"W1-1":"#turn","W1-2":"#curve","W1-3":"#revturn","W1-4":"#revcurve","W1-4b":"#revcurve2","W1-4c":"#revcurve3",
"W1-6":"#bigarrow","W1-8":"#chevron","W3-1":"#stopahead","W3-2":"#yieldahead","W3-3":"#signalahead",
"W3-4":"BE|PREPARED|TO STOP","W3-5":"REDUCED|SPEED|AHEAD","W3-5a":"45 MPH|SPEED ZONE|AHEAD",
"W4-1":"#merge","W4-5":"#merge","W4-2":"#laneends","W4-3":"#addedlane","W4-6":"#addedlane","W4-5P":"NO|MERGE|AREA",
"W5-1":"#narrows","W5-2":"#bridge","W5-3":"ONE LANE|BRIDGE","W5-4":"RAMP|NARROWS",
"W6-1":"#divided","W6-2":"#dividedends","W6-3":"#twoway","W6-4":"#twoway","W7-1":"#hill","W7-3aP":"NEXT|5 MILES",
"W8-1":"BUMP","W8-2":"DIP","W8-3":"PAVEMENT|ENDS","W8-4":"SOFT|SHOULDER","W8-5":"#slippery","W8-6":"#truck",
"W8-7":"LOOSE|GRAVEL","W8-8":"ROUGH|ROAD","W8-9":"LOW|SHOULDER","W8-11":"UNEVEN|LANES","W8-12":"NO|CENTER|LINE",
"W8-14":"FALLEN|ROCKS","W8-15":"GROOVED|PAVEMENT","W8-15P":"#moto","W8-17":"#drop","W8-17P":"SHOULDER|DROP-OFF",
"W8-18":"ROAD|MAY|FLOOD","W8-23":"NO|SHOULDER","W8-24":"STEEL|PLATE|AHEAD","W8-25":"SHOULDER|ENDS",
"W9-1":"RIGHT|LANE|ENDS","W9-2":"LANE ENDS|MERGE|LEFT","W9-3":"CENTER|LANE CLOSED|AHEAD",
"W10-1":"#rr","W11-10":"#truck","W12-1":"#doublearrow","W12-2":"#lowclear",
"W13-1P":"45|M.P.H.","W13-4P":"ON|RAMP","W14-3":"#pennant","W16-2P":"500|FEET","W16-2aP":"500 FT","W16-7P":"#arrowplaque","W16-9P":"AHEAD",
"W20-1":"ROAD|WORK|500 FT","W20-2":"DETOUR|500 FT","W20-3":"ROAD|CLOSED|500 FT","W20-4":"ONE LANE|ROAD|500 FT",
"W20-5":"RIGHT LANE|CLOSED|500 FT","W20-5a":"RIGHT 2|LANES CLOSED|1/2 MILE","W20-7":"#flagger","W20-7a":"FLAGGER|500 FT","W20-8":"SLOW",
"W21-1":"#workers","W21-1a":"WORKERS","W21-2":"FRESH|OIL","W21-3":"ROAD|MACHINERY|AHEAD","W21-4":"SLOW MOVING|VEHICLE",
"W21-5":"SHOULDER|WORK","W21-5a":"RIGHT|SHOULDER|CLOSED","W21-5b":"RIGHT|SHOULDER CLOSED|500 FT","W21-6":"#survey",
"W21-7":"UTILITY|WORK|AHEAD","W21-8":"MOWING|AHEAD","W22-1":"BLASTING|ZONE|AHEAD","W22-2":"TURN OFF|2-WAY RADIO|AND CELL PHONE",
"W22-3":"END|BLASTING ZONE","W23-1":"SLOW|TRAFFIC|AHEAD","W23-2":"NEW|TRAFFIC|PATTERN|AHEAD",
"W24-1":"#dblrev","W24-1a":"#dblrev2","W24-1b":"#dblrev3","W24-1cP":"ALL|LANES",
"G20-1":"ROAD WORK|NEXT 5 MILES","G20-2":"END|ROAD WORK","G20-4":"PILOT CAR|FOLLOW ME","G20-5aP":"WORK|ZONE",
"E5-2":"EXIT|OPEN","E5-2a":"EXIT|CLOSED","E5-3":"EXIT|ONLY","M4-8":"DETOUR","M4-8a":"END|DETOUR","M4-8b":"END",
"M4-9":"#detour","W1-5":"#revcurve","W2-1":"#cross","W2-2":"#sideroad","W2-3":"#sideroad","W2-4":"#tee","W2-5":"#yroad","W11-1":"#moto","W11-2":"#ped","W11-15":"#ped","W7-1a":"#hill","W7-5":"#hill","W8-10":"#moto","W11-5":"#truck","W17-1":"SPEED|HUMP","W14-1":"DEAD|END","W14-2":"NO|OUTLET","W3-6":"DRAW|BRIDGE","W4-4P":"CROSS TRAFFIC|DOES NOT STOP","R4-3":"SLOWER|TRAFFIC|KEEP RIGHT","R4-16":"KEEP RIGHT|EXCEPT|TO PASS","R11-1":"KEEP|OFF|MEDIAN","R14-1":"TRUCK|ROUTE","S5-2":"END|SCHOOL|ZONE","S4-3P":"SCHOOL","M2-1":"JCT","M4-6":"END","M4-5":"TO","M3-1":"NORTH","M3-2":"EAST","M3-3":"SOUTH","M3-4":"WEST","M4-9a":"#detour","M4-9b":"#detour","M4-9c":"#detour","M4-10":"#detourbig"
};

// ---------- Sign face drawing (simplified MUTCD designs) ----------
const SF = (function(){
  const ORANGE="#F7862A", YELLOW="#FFCC1F", RED="#C8102E", BLK="#111", WHT="#fff", GREEN="#0B6B3A";
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const FONT="Overpass,'Arial Narrow',Arial,sans-serif";
  const hd=(x,y,a,c)=>`<polygon points="0,-11 -9,2 9,2" fill="${c||BLK}" transform="translate(${x} ${y}) rotate(${a})"/>`;
  const st=(d,w,c)=>`<path d="${d}" fill="none" stroke="${c||BLK}" stroke-width="${w||6}" stroke-linejoin="round"/>`;
  const G = {
    turn: ()=>st("M42 74V48H56")+hd(56,48,90),
    curve: ()=>st("M42 74V60Q42 42 58 38")+hd(58,38,70),
    revturn: ()=>st("M40 76V60H58V38")+hd(58,38,0),
    revcurve: ()=>st("M42 76V66C42 54 58 56 58 44V38")+hd(58,38,0),
    revcurve2: ()=>st("M36 76V66C36 54 52 56 52 44V38",5)+hd(52,38,0)+st("M50 76V66C50 56 64 58 64 46V40",5)+hd(64,40,0),
    revcurve3: ()=>st("M32 74V66C32 56 46 58 46 46V42",4)+hd(46,42,0)+st("M42 76V66C42 56 56 58 56 46V42",4)+hd(56,42,0)+st("M52 76V66C52 56 66 58 66 46V42",4)+hd(66,42,0),
    dblrev: ()=>st("M42 78V72C42 64 58 64 58 56C58 48 42 48 42 40V36")+hd(42,36,0),
    dblrev2: ()=>st("M36 78V72C36 64 50 64 50 56C50 48 36 48 36 40V36",5)+hd(36,36,0)+st("M50 78V72C50 64 64 64 64 56C64 48 50 48 50 40V36",5)+hd(50,36,0),
    dblrev3: ()=>[30,42,54].map(x=>st(`M${x} 78V72C${x} 64 ${x+14} 64 ${x+14} 56C${x+14} 48 ${x} 48 ${x} 40V38`,4)+hd(x,38,0)).join(""),
    merge: ()=>st("M58 78V38")+hd(58,38,0)+st("M36 74Q36 56 56 48",5),
    laneends: ()=>st("M42 78V36")+hd(42,36,0)+st("M60 78V62Q60 52 46 46",6),
    addedlane: ()=>st("M42 78V36")+hd(42,36,0)+st("M50 78Q60 62 60 44V38")+hd(60,38,0),
    narrows: ()=>st("M36 76V60L44 50V26")+st("M64 76V60L56 50V26"),
    bridge: ()=>st("M42 72V28")+st("M58 72V28")+st("M42 38L34 30M42 62L34 70M58 38L66 30M58 62L66 70",4),
    divided: ()=>`<rect x="46" y="40" width="8" height="26" rx="4" fill="${BLK}"/>`+st("M50 80V72Q38 70 38 58V38",5)+hd(38,38,0)+st("M50 72Q62 70 62 58V38",5)+hd(62,38,0),
    dividedends: ()=>`<rect x="46" y="58" width="8" height="22" rx="4" fill="${BLK}"/>`+st("M38 80V60Q38 50 50 46V32",5)+hd(50,32,0)+st("M62 80V60Q62 50 50 46",5),
    twoway: ()=>st("M42 72V36")+hd(42,36,0)+st("M58 28V64")+hd(58,64,180),
    hill: ()=>`<polygon points="26,70 74,70 74,54" fill="${BLK}"/><g transform="rotate(-18 50 50)"><rect x="34" y="46" width="24" height="12" fill="${BLK}"/><rect x="58" y="49" width="9" height="9" fill="${BLK}"/><circle cx="40" cy="60" r="3.5" fill="${BLK}"/><circle cx="62" cy="60" r="3.5" fill="${BLK}"/></g>`,
    slippery: ()=>`<rect x="40" y="30" width="20" height="22" rx="4" fill="${BLK}"/><rect x="38" y="46" width="24" height="6" fill="${BLK}"/>`+st("M40 58Q34 64 40 70T40 82",3.5)+st("M60 58Q66 64 60 70T60 82",3.5),
    truck: ()=>`<rect x="26" y="40" width="34" height="18" fill="${BLK}"/><path d="M62 46H70L76 52V58H62Z" fill="${BLK}"/><circle cx="34" cy="61" r="4.5" fill="${BLK}"/><circle cx="52" cy="61" r="4.5" fill="${BLK}"/><circle cx="69" cy="61" r="4.5" fill="${BLK}"/>`,
    drop: ()=>st("M24 50H56V62H76",7),
    doublearrow: ()=>st("M50 34L36 60")+hd(36,60,208)+st("M50 34L64 60")+hd(64,60,152),
    lowclear: ()=>`<text x="50" y="57" font-family="${FONT}" font-weight="800" font-size="17" text-anchor="middle" fill="${BLK}">12'-6"</text>`+hd(50,36,180).replace("50 36","50 30")+hd(50,66,0).replace("50 66","50 72"),
    stopahead: ()=>st("M50 78V58")+hd(50,58,0)+`<polygon points="45.4,28 54.6,28 61,34.4 61,43.6 54.6,50 45.4,50 39,43.6 39,34.4" fill="${RED}"/>`,
    yieldahead: ()=>st("M50 78V58")+hd(50,58,0)+`<polygon points="37,30 63,30 50,52" fill="${RED}"/><polygon points="43,33.5 57,33.5 50,45.5" fill="${WHT}"/>`,
    signalahead: ()=>`<rect x="42" y="24" width="16" height="40" rx="3" fill="${BLK}"/><circle cx="50" cy="31" r="4.5" fill="${RED}"/><circle cx="50" cy="44" r="4.5" fill="${YELLOW}"/><circle cx="50" cy="57" r="4.5" fill="#1aa34a"/>`+st("M50 80V70",5),
    flagger: ()=>`<circle cx="46" cy="30" r="5" fill="${BLK}"/>`+st("M46 38V58M46 58L40 74M46 58L52 74M46 42L36 52",5)+st("M46 42L58 38L58 30",4)+`<polygon points="55,20 61,20 64,23 64,29 61,32 55,32 52,29 52,23" fill="${BLK}"/>`,
    workers: ()=>`<circle cx="44" cy="30" r="5" fill="${BLK}"/>`+st("M44 38L48 56M48 56L40 72M48 56L56 72M45 42L58 50",5)+st("M50 38L64 66",3.5)+`<path d="M60 64L70 62L68 72Z" fill="${BLK}"/><path d="M24 74Q32 64 40 74Z" fill="${BLK}"/>`,
    survey: ()=>`<circle cx="40" cy="30" r="5" fill="${BLK}"/>`+st("M40 38V56M40 56L34 72M40 56L46 72M40 43L52 44",5)+st("M58 42L52 74M58 42L64 74M58 42V74",2.5)+`<rect x="54" y="34" width="10" height="7" fill="${BLK}"/>`,
    moto: ()=>`<circle cx="36" cy="60" r="8" fill="none" stroke="${BLK}" stroke-width="4"/><circle cx="66" cy="60" r="8" fill="none" stroke="${BLK}" stroke-width="4"/>`+st("M36 60L48 46H58L66 60M48 46L44 40H52",4)+`<circle cx="52" cy="34" r="4" fill="${BLK}"/>`,
    rr: ()=>st("M30 30L70 70M70 30L30 70",7)+`<text x="30" y="57" font-family="${FONT}" font-weight="800" font-size="16" text-anchor="middle" fill="${BLK}">R</text><text x="70" y="57" font-family="${FONT}" font-weight="800" font-size="16" text-anchor="middle" fill="${BLK}">R</text>`,
    cross: ()=>st("M50 78V22",8)+st("M24 50H76",8),
    sideroad: ()=>st("M50 78V22",8)+st("M50 50H74",7),
    tee: ()=>st("M50 78V44",8)+st("M24 40H76",8),
    yroad: ()=>st("M50 78V52L34 30M50 52L66 30",8),
    ped: ()=>`<circle cx="50" cy="28" r="5.5" fill="${BLK}"/>`+st("M50 36L46 56M46 56L38 74M46 56L56 74M49 40L40 52M49 40L60 50",6),
    arrowplaque: ()=>st("M36 22L60 38",5)+hd(60,38,124),
    noright: ()=>st("M44 72V48H58",7)+hd(58,48,90)+PRO(),
    noleft: ()=>st("M56 72V48H42",7)+hd(42,48,-90)+PRO(),
    nou: ()=>st("M58 72V46A8 8 0 0 0 42 46V56",7)+hd(42,56,180)+PRO(),
    nouleft: ()=>st("M60 72V48A6 6 0 0 0 48 48V56",6)+hd(48,56,180)+st("M60 60H40",6)+hd(40,60,-90)+PRO(),
    nostraight: ()=>st("M50 74V40",7)+hd(50,40,0)+PRO(),
    laneonly: ()=>st("M50 70V36",8)+hd(50,36,0)+`<text x="50" y="92" font-family="${FONT}" font-weight="800" font-size="16" text-anchor="middle">ONLY</text>`,
    laneopt: ()=>st("M50 74V34",7)+hd(50,34,0)+st("M50 56Q50 46 62 44",7)+hd(62,44,90),
    lanecontrol: ()=>st("M30 74V46",6)+hd(30,46,0)+st("M50 74V46",6)+hd(50,46,0)+st("M70 74V58Q70 50 78 50",6)+hd(78,50,90),
    keepright: ()=>`<rect x="30" y="30" width="16" height="44" rx="8" fill="${BLK}"/>`+st("M64 26V46Q64 56 56 62V66",6)+hd(56,66,200),
    dne: ()=>`<circle cx="50" cy="50" r="40" fill="${RED}"/><rect x="22" y="44" width="56" height="12" fill="${WHT}"/><text x="50" y="36" font-family="${FONT}" font-weight="800" font-size="11" text-anchor="middle" fill="${WHT}">DO NOT</text><text x="50" y="72" font-family="${FONT}" font-weight="800" font-size="11" text-anchor="middle" fill="${WHT}">ENTER</text>`,
    nopark: ()=>`<text x="50" y="66" font-family="${FONT}" font-weight="800" font-size="46" text-anchor="middle" fill="${BLK}">P</text>`+PRO(),
    crosswalk: ()=>`<text x="50" y="36" font-family="${FONT}" font-weight="800" font-size="13" text-anchor="middle">CROSSWALK</text>`+st("M24 48H76M24 70H76",3)+st("M32 52V66M42 52V66M52 52V66M62 52V66M72 52V66",4),
    detour: ()=>`<text x="50" y="44" font-family="${FONT}" font-weight="800" font-size="18" text-anchor="middle">DETOUR</text>`+st("M24 64H66",7)+hd(66,64,90),
  };
  function PRO(){ return `<circle cx="50" cy="50" r="38" fill="none" stroke="${RED}" stroke-width="7"/>`+`<path d="M23 23L77 77" stroke="${RED}" stroke-width="7"/>`; }

  function textBlock(lines, cx, cy, maxW, maxH, color, widthAt){
    let fs = Math.min(maxH/(lines.length*1.08), 40);
    const cw = 0.63;
    const fits = f => lines.every((l,i)=>{ const y = cy + (i-(lines.length-1)/2)*f*1.08; const w = widthAt?widthAt(y,f):maxW; return l.length*f*cw <= w; });
    while(fs>4 && !fits(fs)) fs -= 0.5;
    return lines.map((l,i)=>{ const y = cy + (i-(lines.length-1)/2)*fs*1.08 + fs*0.36; return `<text x="${cx}" y="${y.toFixed(1)}" font-family="${FONT}" font-weight="800" font-size="${fs}" text-anchor="middle" fill="${color}">${esc(l)}</text>`; }).join("");
  }

  function autoLegend(name){
    let s=name.replace(/\(.*?\)/g,'').replace(/\s+/g,' ').trim().toUpperCase();
    const words=s.split(' '); const lines=[]; let cur='';
    words.forEach(w=>{ if((cur+' '+w).trim().length>11 && cur){ lines.push(cur); cur=w; } else cur=(cur+' '+w).trim(); });
    if(cur) lines.push(cur);
    while(lines.length>4){ const a=lines.pop(); lines[lines.length-1]+=' '+a; }
    return lines;
  }
  function colors(o){
    const c=o.c||'';
    if(o.color) return o.color;
    if(o.t==='W') return (o.ttc||/^W2[0-4]/.test(c)) && c!=='W10-1' ? {bg:ORANGE,fg:BLK} : {bg:YELLOW,fg:BLK};
    if(o.t==='S') return {bg:'#C6DA2E',fg:BLK};
    if(o.t==='G'){
      if(/^(G20|M4-8|M4-9|M4-10|E5)/.test(c) || o.ttc) return {bg:ORANGE,fg:BLK};
      if(/^(D|M1-8|M1-9|M5|M6)/.test(c) && !/^M[1-6]-[0-9]$/.test(c)) return {bg:GREEN,fg:WHT};
      return {bg:WHT,fg:BLK};
    }
    return {bg:WHT,fg:BLK};
  }
  function draw(o, sizeStr){
    const code=o.c||'';
    const shape=o.sh;
    const leg = o.leg!=null ? o.leg : (LEG[code] || null);
    const s = String(sizeStr||o.conv||"30x30").toLowerCase();
    const dims = s.endsWith("d") ? [parseFloat(s),parseFloat(s)] : s.split("x").map(Number);
    const col = colors(o);
    const bg = col.bg, fg0 = col.fg;
    const sym = leg && leg[0]==="#" ? leg.slice(1) : null;
    const lines = sym ? null : (leg ? String(leg).split("|") : autoLegend(o.n||code));
    if(shape==="oct"){
      return svg(100,100,`<polygon points="29.3,1 70.7,1 99,29.3 99,70.7 70.7,99 29.3,99 1,70.7 1,29.3" fill="${RED}"/><polygon points="30.5,4 69.5,4 96,30.5 96,69.5 69.5,96 30.5,96 4,69.5 4,30.5" fill="none" stroke="${WHT}" stroke-width="2.5"/>`+(o.custom? textBlock(lines,50,50,70,50,WHT) : `<text x="50" y="60" font-family="${FONT}" font-weight="800" font-size="28" text-anchor="middle" fill="${WHT}">STOP</text>`));
    }
    if(shape==="tri"){
      return svg(100,88,`<polygon points="2,2 98,2 50,86" fill="${RED}" stroke="${RED}" stroke-width="2" stroke-linejoin="round"/><polygon points="20,12.5 80,12.5 50,64.5" fill="${WHT}"/><text x="50" y="31" font-family="${FONT}" font-weight="800" font-size="13" text-anchor="middle" fill="${RED}">${o.custom?esc((lines||[''])[0]).slice(0,8):'YIELD'}</text>`);
    }
    if(shape==="circ"){
      return svg(100,100,`<circle cx="50" cy="50" r="48" fill="${code==='W10-1'?YELLOW:bg}" stroke="${BLK}" stroke-width="3"/>`+(code==='W10-1'||!o.custom?G.rr():textBlock(lines,50,50,70,60,fg0)));
    }
    if(shape==="pen"){
      return svg(100,76,`<polygon points="2,2 2,74 98,38" fill="${ORANGE}" stroke="${BLK}" stroke-width="2.5" stroke-linejoin="round"/>`+textBlock(o.custom?lines:["NO","PASSING","ZONE"],32,38,30,40,BLK,(y,f)=>Math.max(0,(98-2)*(1-Math.abs(y-38)/36)-40)));
    }
    if(shape==="pent"){
      return svg(100,100,`<polygon points="50,2 98,40 98,98 2,98 2,40" fill="${bg}" stroke="${BLK}" stroke-width="2" stroke-linejoin="round"/><polygon points="50,7 93,42 93,93 7,93 7,42" fill="none" stroke="${BLK}" stroke-width="2.4" stroke-linejoin="round"/>`+(o.custom?textBlock(lines,50,64,76,40,fg0):`<circle cx="40" cy="46" r="5"/><circle cx="60" cy="46" r="5"/><path d="M40 53L32 76M40 53L44 76M60 53L56 76M60 53L68 76M36 60H64" stroke="${BLK}" stroke-width="5"/><path d="M20 86H80" stroke="${BLK}" stroke-width="3" stroke-dasharray="6 4"/>`));
    }
    if(shape==="xbuck"){
      return svg(100,100,`<g transform="rotate(45 50 50)"><rect x="2" y="41" width="96" height="18" fill="${WHT}" stroke="${BLK}" stroke-width="1.5"/></g><g transform="rotate(-45 50 50)"><rect x="2" y="41" width="96" height="18" fill="${WHT}" stroke="${BLK}" stroke-width="1.5"/></g><text x="30" y="36" font-family="${FONT}" font-weight="800" font-size="9" text-anchor="middle" transform="rotate(45 30 33)">RAILROAD</text><text x="70" y="36" font-family="${FONT}" font-weight="800" font-size="9" text-anchor="middle" transform="rotate(-45 70 33)">CROSSING</text>`);
    }
    if(shape==="dia"){
      let inner = `<polygon points="50,1.5 98.5,50 50,98.5 1.5,50" fill="${bg}" stroke="${BLK}" stroke-width="1"/><polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="${fg0}" stroke-width="2.4" stroke-linejoin="round"/>`;
      if(sym && G[sym]) inner += `<g transform="translate(50 50) scale(.9) translate(-50 -50)">${G[sym]()}</g>`;
      else inner += textBlock(lines,50,50,60,50,fg0,(y,f)=>2*(42-Math.abs(y-50)-f*0.5));
      return svg(100,100,inner);
    }
    // rectangle
    let [w,h] = dims; if(!h||isNaN(h)) h=w; if(!w||isNaN(w)){w=30;h=30;}
    const H = 100*h/w, W = 100;
    let fg = fg0, face = bg, border = fg0;
    if(code==="R5-1a"){ face=RED; fg=WHT; border=WHT; }
    if(code==="R6-1"){ face=BLK; border=WHT; }
    const r=Math.min(W,H);
    let inner = `<rect x="1" y="1" width="${W-2}" height="${H-2}" rx="${r*0.06}" fill="${face}" stroke="${face===WHT?'#777':face}" stroke-width="1"/><rect x="${r*0.035}" y="${r*0.035}" width="${W-r*0.07}" height="${H-r*0.07}" rx="${r*0.045}" fill="none" stroke="${border}" stroke-width="${Math.max(1.2,r*0.025)}"/>`;
    if(/^OM3/.test(code)){ let st2=''; for(let i=-4;i<12;i++){ st2+=`<path d="M0 ${i*H/6} L100 ${i*H/6+ (code==='OM3-R'?-100:100)}" stroke="${BLK}" stroke-width="12"/>`; } return svg(W,H,`<defs><clipPath id="om${code}"><rect x="1" y="1" width="98" height="${H-2}"/></clipPath></defs><rect x="1" y="1" width="98" height="${H-2}" fill="${YELLOW}"/><g clip-path="url(#om${code})">${st2}</g>`); }
    if(!o.custom){
    if(code==="R5-1"){ inner = `<rect x="1" y="1" width="98" height="98" rx="6" fill="${WHT}" stroke="#777" stroke-width="1"/>`+G.dne(); return svg(100,100,inner); }
    if(code==="R5-1a"){ inner += textBlock(["WRONG","WAY"],50,H/2,86,H*0.7,WHT); return svg(W,H,inner); }
    if(code==="R6-1"){ inner += `<path d="M10 ${H*0.3}H66V${H*0.14}L92 ${H/2}L66 ${H*0.86}V${H*0.7}H10Z" fill="${WHT}"/><text x="40" y="${H*0.62}" font-family="${FONT}" font-weight="800" font-size="${H*0.33}" text-anchor="middle" fill="${BLK}">ONE WAY</text>`; return svg(W,H,inner); }
    if(code==="R6-2"){ inner += textBlock(["ONE","WAY"],50,H*0.3,80,H*0.34,BLK)+st(`M50 ${H*0.9}V${H*0.62}`,10)+`<polygon points="0,-16 -14,3 14,3" transform="translate(50 ${H*0.6})"/>`; return svg(W,H,inner); }
    if(code==="R2-1"){ inner += textBlock(["SPEED","LIMIT"],50,H*0.3,78,H*0.3,BLK)+`<text x="50" y="${H*0.84}" font-family="${FONT}" font-weight="800" font-size="${H*0.36}" text-anchor="middle">45</text>`; return svg(W,H,inner); }
    if(code==="W1-6"){ inner += `<path d="M10 ${H*0.36}H62V${H*0.16}L92 ${H/2}L62 ${H*0.84}V${H*0.64}H10Z" fill="${BLK}"/>`; return svg(W,H,inner); }
    if(code==="W1-7"){ inner += `<path d="M8 ${H/2}L30 ${H*0.16}V${H*0.36}H70V${H*0.16}L92 ${H/2}L70 ${H*0.84}V${H*0.64}H30V${H*0.84}Z" fill="${BLK}"/>`; return svg(W,H,inner); }
    if(code==="W1-8"){ inner += `<path d="M28 ${H*0.18}L62 ${H/2}L28 ${H*0.82}L40 ${H*0.82}L74 ${H/2}L40 ${H*0.18}Z" fill="${BLK}"/>`; return svg(W,H,inner); }
    if(code==="M4-10"){ inner += `<path d="M8 ${H*0.3}H70V${H*0.12}L94 ${H/2}L70 ${H*0.88}V${H*0.7}H8Z" fill="${BLK}"/><text x="40" y="${H*0.6}" font-family="${FONT}" font-weight="800" font-size="${H*0.28}" text-anchor="middle" fill="${ORANGE}">DETOUR</text>`; return svg(W,H,inner); }
    if(code==="W6-4"){ inner += `<g transform="translate(0 ${(H-100)/2})">`+st("M36 80V30",8)+hd(36,30,0)+st("M64 20V70",8)+hd(64,70,180)+`</g>`; return svg(W,H,inner); }
    if(code==="W16-7P"){ inner += st(`M26 ${H*0.25}L${W-34} ${H*0.62}`,Math.max(4,H*0.1))+`<polygon points="0,-${H*0.3} -${H*0.24},${H*0.06} ${H*0.24},${H*0.06}" transform="translate(${W-28} ${H*0.66}) rotate(118)"/>`; return svg(W,H,inner); }
    if(code==="R11-3a"||code==="R11-3b"){ const L=leg.split("|"); inner += textBlock([L[0]],50,H*0.36,88,H*0.28,fg)+textBlock([L[1]],50,H*0.7,80,H*0.24,fg); return svg(W,H,inner); }
    if(/^M1-[145]$/.test(code)){ const nm={"M1-1":"INTERSTATE","M1-4":"U.S.","M1-5":"STATE"}[code]; inner=`<rect x="1" y="1" width="98" height="98" rx="6" fill="${code==='M1-1'?'#1b3f94':WHT}" stroke="#777"/>`+(code==='M1-1'?`<rect x="1" y="1" width="98" height="26" rx="6" fill="${RED}"/><text x="50" y="20" font-family="${FONT}" font-weight="800" font-size="12" text-anchor="middle" fill="${WHT}">INTERSTATE</text><text x="50" y="78" font-family="${FONT}" font-weight="800" font-size="44" text-anchor="middle" fill="${WHT}">35</text>`:`<text x="50" y="68" font-family="${FONT}" font-weight="800" font-size="44" text-anchor="middle">${code==='M1-4'?'177':'51'}</text><text x="50" y="22" font-family="${FONT}" font-weight="700" font-size="11" text-anchor="middle">${nm}</text>`); return svg(100,100,inner); }
    if(code==="M4-9a"||code==="M4-9b"||code==="M4-9c"){
      const t={"M4-9a":"BIKE/PED","M4-9b":"PED","M4-9c":"BIKE"}[code];
      inner += `<g transform="translate(0 ${(H-100)/2})">${G.detour()}<text x="50" y="22" font-family="${FONT}" font-weight="700" font-size="11" text-anchor="middle">${t}</text></g>`; return svg(W,H,inner);
    }
    if(sym && G[sym]){
      const sc = Math.min(W,H)/100;
      inner += `<g transform="translate(${W/2} ${H/2}) scale(${sc}) translate(-50 -50)">${G[sym]()}</g>`;
      return svg(W,H,inner);
    }
    }
    const aspect=W/H;
    inner += textBlock(lines,50,H/2,86,H*0.8,fg);
    return svg(W,H,inner);
  }
  function svg(w,h,body){ return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" style="overflow:visible">${body}</svg>`; }
  return {draw};
})();
