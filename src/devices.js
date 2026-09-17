// Warning light types (MUTCD 2009 §6F.83, §6F.63) and TTC devices (§6F.60–6F.87, ODOT T-503/T-506)
const LIGHTS = [
  {k:"A",  n:"Type A", full:"Type A low-intensity flashing", use:"Night only. Warns of a hazard. Yellow lens, bottom of lens at least 30 in above ground."},
  {k:"B",  n:"Type B", full:"Type B high-intensity flashing", use:"Day and night. Usually on advance warning signs, barricades and flag trees. Visible 1,000 ft in daylight."},
  {k:"C",  n:"Type C", full:"Type C steady-burn", use:"Night. Marks the edge of the traveled way on channelizing devices placed in a line."},
  {k:"D",  n:"Type D", full:"Type D 360° steady-burn", use:"Night. Steady-burn delineation visible from every direction."},
  {k:"SEQ",n:"Sequential", full:"Sequential flashing warning light", use:"Mounted on channelizing devices in a merging taper. Flashes 55–75 times/min, one after another toward the closure."}
];
const LT = Object.fromEntries(LIGHTS.map(l=>[l.k,l]));

const DEVICES = [
  // Barricades — ODOT practice: carry a Type B light
  {id:"BARR-I",  n:"Type I barricade",  cat:"BAR", unit:"EA", lt:"B", ln:1, face:"barr1", aka:"type 1 barricade type i one rail",
   spec:"1 rail · rail 8–12 in wide × 24 in min. long · 6 in orange/white stripes (4 in if rail < 36 in) · top ≥ 36 in above ground"},
  {id:"BARR-II", n:"Type II barricade", cat:"BAR", unit:"EA", lt:"B", ln:1, face:"barr2", aka:"type 2 barricade type ii two rail",
   spec:"2 rails · rails 8–12 in wide × 24 in min. long · 6 in stripes (4 in if rail < 36 in) · used on freeways/expressways"},
  {id:"BARR-III",n:"Type III barricade",cat:"BAR", unit:"EA", lt:"B", ln:1, face:"barr3", aka:"type 3 barricade type iii road closure three rail",
   spec:"3 rails · rails 8–12 in wide × 48 in min. long · 6 in stripes · ≈5 ft tall · for full or partial road closures"},
  {id:"DIB",     n:"Direction indicator barricade", cat:"BAR", unit:"EA", lt:"B", ln:1, face:"dib", aka:"direction indicator barricade arrow barricade dib",
   spec:"W1-6 arrow sign 24 × 12 in above a 24 × 8 in rail · 4 in stripes · ≥ 36 in tall · used in tapers"},

  // Channelizing devices
  {id:"CONE-18", n:"Traffic cone, 18 in", cat:"CH", unit:"EA", face:"cone18", aka:"cone 18 inch traffic cone low speed daytime",
   spec:"18 in min. height · orange · daytime, low-speed roads only"},
  {id:"CONE-28", n:"Traffic cone, 28 in", cat:"CH", unit:"EA", face:"cone28", aka:"cone 28 inch traffic cone night high speed",
   spec:"28 in min. height · 6 in and 4 in white retroreflective bands · freeways, high-speed roads and night work"},
  {id:"CONE-36", n:"Traffic cone, over 36 in", cat:"CH", unit:"EA", face:"cone42", aka:"cone 36 inch tall cone",
   spec:"Over 36 in · at least 2 orange and 2 white 4–6 in stripes, orange stripe on top · gaps ≤ 3 in"},
  {id:"CHAN-42", n:"Trimline channelizer / grabber cone (42 in)", cat:"CH", unit:"EA", face:"chan42", aka:"trimline channelizer grabber cone 42 inch looper tall channelizer delineator",
   spec:"≈42 in tall channelizer on a rubber base · 4 alternating 4–6 in orange/white bands · brand-name device, check project spec"},
  {id:"DRUM",    n:"Drum (channelizing drum)", cat:"CH", unit:"EA", face:"drum", aka:"drum barrel channelizer 55 gallon",
   spec:"36 in min. height · 18 in min. width · 4–6 in horizontal orange/white stripes (≥ 2 of each), orange on top · no metal"},
  {id:"TUBE-18", n:"Tubular marker, 18 in", cat:"CH", unit:"EA", face:"tube18", aka:"tubular marker 18 flexible delineator post",
   spec:"18 in min. height · 2 in min. width facing traffic · one 3 in white band · low-speed"},
  {id:"TUBE-28", n:"Tubular marker, 28 in", cat:"CH", unit:"EA", face:"tube28", aka:"tubular marker 28 flexible delineator post high speed",
   spec:"28 in min. height · two 3 in white bands · high-speed and night"},
  {id:"TUBE-42", n:"Tubular marker, 42 in +", cat:"CH", unit:"EA", face:"tube42", aka:"tubular marker 42 tall",
   spec:"42 in or taller · four 4–6 in alternating orange/white stripes"},
  {id:"VPANEL",  n:"Vertical panel", cat:"CH", unit:"EA", face:"vpanel", aka:"vertical panel panel",
   spec:"8–12 in wide × 24 in min. tall · 45° orange/white stripes, 6 in (4 in if panel < 36 in)"},
  {id:"OTLD",    n:"Opposing traffic lane divider", cat:"CH", unit:"EA", face:"otld", aka:"opposing traffic lane divider w6-4 two way",
   spec:"W6-4 sign 12 × 18 in on a flexible support · separates opposing lanes"},
  {id:"LCD",     n:"Longitudinal channelizing device", cat:"CH", unit:"LF", face:"lcd", aka:"longitudinal channelizing device water filled barrier lcd",
   spec:"Lightweight, interlocking device (often water-filled) · orange/white · not a crash barrier unless crash-tested"},
  {id:"TLS",     n:"Temporary lane separator", cat:"CH", unit:"LF", face:"tls", aka:"temporary lane separator curb",
   spec:"Low, mountable curb (≤ 4 in tall, ≤ 18 in wide) · may carry tubular markers or vertical panels"},
  {id:"PCD",     n:"Pedestrian channelizing device / detectable edging", cat:"CH", unit:"LF", face:"edging", aka:"pedestrian channelizing detectable edging sidewalk",
   spec:"Continuous; bottom edge ≤ 2 in and top ≥ 32 in above ground · detectable by cane users"},

  // Lighting devices (standalone)
  {id:"LT-A",   n:"Warning light, Type A", cat:"L", unit:"EA", light:"A", face:"lampA", aka:"warning light type a low intensity flashing", spec:LT.A.use},
  {id:"LT-B",   n:"Warning light, Type B", cat:"L", unit:"EA", light:"B", face:"lampB", aka:"warning light type b high intensity flashing", spec:LT.B.use},
  {id:"LT-C",   n:"Warning light, Type C", cat:"L", unit:"EA", light:"C", face:"lampC", aka:"warning light type c steady burn", spec:LT.C.use},
  {id:"LT-D",   n:"Warning light, Type D", cat:"L", unit:"EA", light:"D", face:"lampD", aka:"warning light type d 360 steady burn", spec:LT.D.use},
  {id:"LT-SEQ", n:"Sequential flashing warning light", cat:"L", unit:"EA", light:"SEQ", face:"lampS", aka:"sequential flashing warning light taper", spec:LT.SEQ.use},
  {id:"FLOOD",  n:"Floodlight (night work)", cat:"L", unit:"EA", face:"flood", aka:"floodlight light tower night work", spec:"Lights the work area at night without glaring road users."},
  {id:"BEACON", n:"Portable flashing beacon", cat:"L", unit:"EA", face:"beacon", aka:"flashing beacon portable", spec:"Yellow flashing beacon, 50–60 flashes/min, often above a warning sign."},

  // Other TTC devices
  {id:"AB-A", n:"Arrow board, Type A", cat:"O", unit:"EA", face:"ab", aka:"arrow board arrow panel type a", spec:"48 × 24 in · 12 lamps · visible ½ mile · low-speed urban streets"},
  {id:"AB-B", n:"Arrow board, Type B", cat:"O", unit:"EA", face:"ab", aka:"arrow board arrow panel type b", spec:"60 × 30 in · 13 lamps · visible ¾ mile · intermediate speed, moving operations"},
  {id:"AB-C", n:"Arrow board, Type C", cat:"O", unit:"EA", face:"ab", aka:"arrow board arrow panel type c trailer", spec:"96 × 48 in · 15 lamps · visible 1 mile · high-speed, high-volume roads"},
  {id:"AB-D", n:"Arrow board, Type D (vehicle-mounted)", cat:"O", unit:"EA", face:"abd", aka:"arrow board type d vehicle mounted", spec:"Arrow-shaped · 12 lamps · vehicle-mounted only, where the agency allows"},
  {id:"PCMS", n:"Portable changeable message sign", cat:"O", unit:"EA", face:"pcms", aka:"pcms message board cms dms variable message sign vms", spec:"3 lines × 8 characters or full matrix · 18 in letters · max 2 phases · visible ½ mile"},
  {id:"FLAG", n:"High-level warning device (flag tree)", cat:"O", unit:"EA", lt:"B", ln:1, face:"flagtree", aka:"flag tree high level warning device", spec:"≥ 2 orange flags, 16 in square · flags and light ≥ 8 ft above road · Type B light optional"},
  {id:"PTS",  n:"Portable temporary traffic signal", cat:"O", unit:"EA", face:"tsig", aka:"temporary traffic signal portable signal one lane", spec:"Trailer-mounted signal for one-lane, two-way control"},
  {id:"AFAD", n:"Automated flagger assistance device", cat:"O", unit:"EA", face:"afad", aka:"afad automated flagger", spec:"Remotely operated STOP/SLOW or red/yellow lens device, run by a flagger"},
  {id:"TMA",  n:"Truck-mounted attenuator", cat:"O", unit:"EA", face:"tma", aka:"tma truck mounted attenuator crash truck", spec:"Crash cushion mounted on a shadow vehicle"},
  {id:"CC",   n:"Crash cushion / impact attenuator (sand-filled)", cat:"O", unit:"EA", face:"cushion", aka:"crash cushion impact attenuator sand barrels", spec:"See ODOT T-523 for sand-filled attenuator arrays"},
  {id:"PLB",  n:"Portable longitudinal barrier", cat:"O", unit:"LF", face:"barrier", aka:"portable concrete barrier temporary traffic barrier jersey", spec:"Temporary traffic barrier · see ODOT T-524 / T-525"},
  {id:"TRS",  n:"Temporary rumble strips (set)", cat:"O", unit:"EA", face:"rumble", aka:"temporary rumble strips portable", spec:"Portable transverse rumble strips ahead of a work zone"}
];

const DEVFACE = (function(){
  const O="#F7862A", W="#fff", K="#1a1a1a", Y="#FFCC1F";
  const svg=(w,h,b)=>`<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img">${b}</svg>`;
  let uid=0;
  function rail(x,y,w,h,dir){ const id="rl"+(uid++); let s=""; for(let i=-2;i<w/8+3;i++){ const x0=x+i*10; s+=`<path d="M${x0} ${y+h} L${x0+h} ${y}" stroke="${O}" stroke-width="5"/>`; } return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${W}" stroke="#999" stroke-width=".6"/><g clip-path="url(#${id})">${s}</g>`; }
  const legs=(x1,x2,top,bot)=>`<path d="M${x1} ${top}L${x1-4} ${bot}M${x1} ${top}L${x1+4} ${bot}M${x2} ${top}L${x2-4} ${bot}M${x2} ${top}L${x2+4} ${bot}" stroke="#666" stroke-width="2"/>`;
  const lamp=(x,y,c)=>`<rect x="${x-2}" y="${y+5}" width="4" height="6" fill="#444"/><circle cx="${x}" cy="${y}" r="6" fill="${c||Y}" stroke="#7a5b00" stroke-width="1"/>`;
  function cone(h,bands){ const top=96-h; let b=`<path d="M40 96L47 ${top}H53L60 96Z" fill="${O}"/><rect x="30" y="94" width="40" height="4" rx="1" fill="#333"/>`; bands.forEach(([y,t])=>{ const yy=top+y; const k=(yy-top)/(96-top); b+=`<rect x="${47-7*k}" y="${yy}" width="${6+14*k}" height="${t}" fill="${W}"/>`; }); return svg(100,100,b); }
  function striped(x,y,w,h,n){ let s=""; const sh=h/n; for(let i=0;i<n;i++) s+=`<rect x="${x}" y="${y+i*sh}" width="${w}" height="${sh}" fill="${i%2?W:O}"/>`; return s; }
  const F = {
    barr1:()=>svg(100,100,rail(18,34,64,14)+legs(26,74,48,92)+lamp(80,24)),
    barr2:()=>svg(100,100,rail(18,30,64,13)+rail(18,52,64,13)+legs(26,74,65,94)+lamp(80,20)),
    barr3:()=>svg(100,100,rail(8,24,84,11)+rail(8,44,84,11)+rail(8,64,84,11)+`<path d="M18 18V96M82 18V96" stroke="#666" stroke-width="3"/>`+lamp(88,12)),
    dib:()=>svg(100,100,`<rect x="26" y="18" width="48" height="24" rx="2" fill="${O}" stroke="${K}" stroke-width="1.5"/><path d="M34 30H56V24L66 30L56 36V30" fill="${K}" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>`+rail(26,46,48,16)+legs(34,66,62,94)+lamp(74,10)),
    cone18:()=>cone(44,[]),
    cone28:()=>cone(68,[[10,7],[21,5]]),
    cone42:()=>cone(86,[[12,7],[26,7],[40,7]]),
    chan42:()=>svg(100,100,`<rect x="30" y="88" width="40" height="8" rx="3" fill="#222"/><path d="M44 88L46 10H54L56 88Z" fill="${O}"/><rect x="46" y="4" width="8" height="8" rx="3" fill="${O}"/>`+[20,36,52,68].map(y=>`<rect x="44.8" y="${y}" width="10.4" height="7" fill="${W}"/>`).join("")),
    drum:()=>svg(100,100,`<ellipse cx="50" cy="94" rx="30" ry="4" fill="#222"/>`+`<path d="M30 20Q50 14 70 20V88Q50 94 30 88Z" fill="${O}"/>`+[30,48,66].map(y=>`<path d="M30 ${y}Q50 ${y+5} 70 ${y}V${y+9}Q50 ${y+14} 30 ${y+9}Z" fill="${W}"/>`).join("")+`<ellipse cx="50" cy="20" rx="20" ry="4" fill="#d96c1c"/>`),
    tube18:()=>svg(100,100,`<rect x="36" y="90" width="28" height="6" rx="2" fill="#222"/><rect x="46" y="50" width="8" height="40" rx="3" fill="${O}"/><rect x="46" y="56" width="8" height="5" fill="${W}"/>`),
    tube28:()=>svg(100,100,`<rect x="36" y="90" width="28" height="6" rx="2" fill="#222"/><rect x="46" y="30" width="8" height="60" rx="3" fill="${O}"/><rect x="46" y="36" width="8" height="5" fill="${W}"/><rect x="46" y="46" width="8" height="5" fill="${W}"/>`),
    tube42:()=>svg(100,100,`<rect x="36" y="90" width="28" height="6" rx="2" fill="#222"/><rect x="46" y="8" width="8" height="82" rx="3" fill="${O}"/>`+[18,34,50,66].map(y=>`<rect x="46" y="${y}" width="8" height="8" fill="${W}"/>`).join("")),
    vpanel:()=>svg(100,100,rail(40,10,20,52)+`<path d="M50 62V94M40 94H60" stroke="#666" stroke-width="3"/>`),
    otld:()=>svg(100,100,`<rect x="38" y="8" width="24" height="36" rx="2" fill="${O}" stroke="${K}"/><path d="M44 38V16M40 20L44 14L48 20M56 14V36M52 32L56 38L60 32" stroke="${K}" stroke-width="2.5" fill="none"/><rect x="47" y="44" width="6" height="46" fill="${O}"/><rect x="38" y="90" width="24" height="6" rx="2" fill="#222"/>`),
    lcd:()=>svg(100,100,`<path d="M6 80V52Q6 40 18 40H82Q94 40 94 52V80Z" fill="${O}"/><rect x="6" y="56" width="88" height="8" fill="${W}"/><path d="M30 80V70H70V80" fill="#fff" opacity=".35"/>`),
    tls:()=>svg(100,100,`<path d="M4 84L14 70H86L96 84Z" fill="#f3c21c" stroke="#8a6d00"/><rect x="28" y="30" width="6" height="40" fill="${O}"/><rect x="28" y="36" width="6" height="4" fill="${W}"/><rect x="66" y="30" width="6" height="40" fill="${O}"/><rect x="66" y="36" width="6" height="4" fill="${W}"/>`),
    edging:()=>svg(100,100,rail(6,36,88,14)+rail(6,76,88,10)+`<path d="M12 36V90M88 36V90" stroke="#666" stroke-width="3"/>`),
    lampA:()=>svg(100,100,`<circle cx="50" cy="44" r="26" fill="${Y}" stroke="#7a5b00" stroke-width="3"/><text x="50" y="52" text-anchor="middle" font-family="Overpass,Arial" font-weight="800" font-size="22">A</text><rect x="44" y="72" width="12" height="20" fill="#444"/>`),
    lampB:()=>svg(100,100,`<g stroke="#e0a800" stroke-width="3">${[0,45,90,135,180,225,270,315].map(a=>`<path d="M50 44L${50+40*Math.cos(a*Math.PI/180)} ${44+40*Math.sin(a*Math.PI/180)}" transform=""/>`).join("")}</g><circle cx="50" cy="44" r="26" fill="${Y}" stroke="#7a5b00" stroke-width="3"/><text x="50" y="52" text-anchor="middle" font-family="Overpass,Arial" font-weight="800" font-size="22">B</text><rect x="44" y="72" width="12" height="20" fill="#444"/>`),
    lampC:()=>svg(100,100,`<circle cx="50" cy="44" r="26" fill="#ffe38a" stroke="#7a5b00" stroke-width="3"/><text x="50" y="52" text-anchor="middle" font-family="Overpass,Arial" font-weight="800" font-size="22">C</text><rect x="44" y="72" width="12" height="20" fill="#444"/>`),
    lampD:()=>svg(100,100,`<rect x="30" y="18" width="40" height="52" rx="18" fill="#ffe38a" stroke="#7a5b00" stroke-width="3"/><text x="50" y="52" text-anchor="middle" font-family="Overpass,Arial" font-weight="800" font-size="22">D</text><rect x="44" y="72" width="12" height="20" fill="#444"/>`),
    lampS:()=>svg(100,100,[18,50,82].map((x,i)=>`<circle cx="${x}" cy="44" r="13" fill="${i===2?Y:'#f7e4a0'}" stroke="#7a5b00" stroke-width="2"/><rect x="${x-3}" y="57" width="6" height="30" fill="#444"/>`).join("")+`<path d="M8 20H88M80 14L88 20L80 26" stroke="#555" stroke-width="3" fill="none"/>`),
    flood:()=>svg(100,100,`<path d="M50 30V92M34 92H66" stroke="#555" stroke-width="4"/><rect x="26" y="10" width="48" height="24" rx="3" fill="#333"/><rect x="30" y="14" width="40" height="16" rx="2" fill="#fff4c2"/><path d="M30 34L10 70M70 34L90 70" stroke="#ffe38a" stroke-width="3" opacity=".8"/>`),
    beacon:()=>svg(100,100,`<rect x="40" y="10" width="20" height="44" rx="4" fill="#333"/><circle cx="50" cy="32" r="8" fill="${Y}"/><path d="M50 54V94" stroke="#555" stroke-width="4"/>`),
    ab:()=>svg(100,100,`<rect x="8" y="16" width="84" height="44" rx="3" fill="#111"/>`+[[22,38],[34,38],[46,38],[58,38],[70,38],[64,30],[64,46],[58,24],[58,52]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.4" fill="${Y}"/>`).join("")+`<path d="M50 60V78M30 92L50 78L70 92" stroke="#666" stroke-width="3" fill="none"/><rect x="24" y="78" width="52" height="8" fill="${O}"/>`),
    abd:()=>svg(100,100,`<path d="M8 36H60V20L92 50L60 80V64H8Z" fill="#111"/>`+[[18,50],[30,50],[42,50],[54,50],[66,50],[78,50],[66,38],[66,62]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.2" fill="${Y}"/>`).join("")),
    pcms:()=>svg(100,100,`<rect x="6" y="12" width="88" height="44" rx="3" fill="#111"/><text x="50" y="30" text-anchor="middle" font-family="Overpass Mono,monospace" font-weight="700" font-size="11" fill="#ffb000">LANE</text><text x="50" y="46" text-anchor="middle" font-family="Overpass Mono,monospace" font-weight="700" font-size="11" fill="#ffb000">CLOSED</text><path d="M50 56V78M30 92L50 78L70 92" stroke="#666" stroke-width="3" fill="none"/><rect x="24" y="78" width="52" height="8" fill="${O}"/>`),
    flagtree:()=>svg(100,100,`<path d="M50 14V94M34 94H66" stroke="#555" stroke-width="3"/><path d="M50 22L72 22L72 38L50 38Z" fill="${O}"/><path d="M50 22L28 22L28 38L50 38Z" fill="#e24a1f"/>`+lamp(50,10)),
    tsig:()=>svg(100,100,`<rect x="40" y="6" width="20" height="50" rx="4" fill="#222"/><circle cx="50" cy="16" r="5.5" fill="#d7262b"/><circle cx="50" cy="31" r="5.5" fill="#6b5a1a"/><circle cx="50" cy="46" r="5.5" fill="#1d5e34"/><path d="M50 56V80" stroke="#555" stroke-width="4"/><rect x="26" y="80" width="48" height="10" fill="${O}"/>`),
    afad:()=>svg(100,100,`<polygon points="38,8 62,8 72,18 72,42 62,52 38,52 28,42 28,18" fill="#C8102E"/><text x="50" y="35" text-anchor="middle" font-family="Overpass,Arial" font-weight="800" font-size="12" fill="#fff">STOP</text><path d="M50 52V80" stroke="#555" stroke-width="4"/><rect x="26" y="80" width="48" height="10" fill="${O}"/><path d="M72 64H92" stroke="#e24a1f" stroke-width="6"/>`),
    tma:()=>svg(100,100,`<rect x="30" y="34" width="46" height="30" fill="#f2f2f2" stroke="#555"/><rect x="76" y="42" width="16" height="22" fill="#ddd" stroke="#555"/><rect x="6" y="38" width="24" height="22" fill="${O}"/><path d="M6 38L16 60M14 38L24 60M22 38L30 52" stroke="#111" stroke-width="3"/><circle cx="42" cy="68" r="6" fill="#222"/><circle cx="82" cy="68" r="6" fill="#222"/><rect x="40" y="22" width="30" height="10" fill="#111"/>`),
    cushion:()=>svg(100,100,[[20,40],[40,40],[60,40],[30,62],[50,62],[70,62],[80,40]].map(([x,y])=>`<ellipse cx="${x}" cy="${y+18}" rx="9" ry="3" fill="#b25e12"/><rect x="${x-9}" y="${y}" width="18" height="18" fill="#f5c400"/><ellipse cx="${x}" cy="${y}" rx="9" ry="3" fill="#ffe066"/>`).join("")),
    barrier:()=>svg(100,100,`<path d="M4 86L10 68L22 60V40H78V60L90 68L96 86Z" fill="#bdbdb8" stroke="#777"/><rect x="40" y="46" width="20" height="6" fill="#f1c40f"/>`),
    rumble:()=>svg(100,100,[30,46,62].map(y=>`<rect x="8" y="${y}" width="84" height="8" rx="2" fill="${O}" stroke="#8a3d00"/>`).join(""))
  };
  return {draw:(key)=>F[key]?F[key]():svg(100,100,"")};
})();
