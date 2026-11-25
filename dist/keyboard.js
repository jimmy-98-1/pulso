const rows = [
  [["º","ª"],["1","!","|"],["2",'"',"@"],["3","·","#"],["4","$","~"],["5","%"],["6","&","¬"],["7","/"],["8","("],["9",")"],["0","="],["'","?"],["¡","¿"],["Retroceso","",null,2]],
  [["Tab","",null,1.5],["q"],["w"],["e","","€"],["r"],["t"],["y"],["u"],["i"],["o"],["p"],["`","^","["],["+","*","]"],["Intro","",null,1.5]],
  [["Bloq Mayús","",null,1.75],["a"],["s"],["d"],["f"],["g"],["h"],["j"],["k"],["l"],["ñ"],["´","¨","{"],["ç","","}"],["","",null,1.25]],
  [["Mayús izq.","",null,1.25],["<",">"],["z"],["x"],["c"],["v"],["b"],["n"],["m"],[",",";"],[".",":"],["-","_"],["Mayús der.","",null,2.75]],
  [["Ctrl","",null,1.25],["Super izq.","",null,1.25],["Alt","",null,1.25],[" ","",null,6.25],["Alt Gr","",null,1.25],["Super der.","",null,1.25],["Menú","",null,1.25],["Ctrl der.","",null,1.25]]
];
const groups = ["º1qaz<","2wsx","3edc","45rtfgvb","67yuhjnm","8ik,","9ol.","0'¡p`+ñ´ç-"," "];
const names = ["Meñique izquierdo","Anular izquierdo","Medio izquierdo","Índice izquierdo","Índice derecho","Medio derecho","Anular derecho","Meñique derecho","Pulgar"];
const colors = ["pinky","ring","middle","index","index","middle","ring","pinky","thumb"];
const shifted = Object.fromEntries(rows.flat().filter(([,alt])=>alt).map(([key,alt])=>[alt,key]));
const altGraphics = Object.fromEntries(rows.flat().filter(([, ,alt])=>alt).map(([key,,alt])=>[alt,key]));
const labels = {" ":"Espacio","Retroceso":"⌫","Intro":"↵","Tab":"↹","Bloq Mayús":"⇪","Mayús izq.":"⇧","Mayús der.":"⇧","Ctrl der.":"Ctrl","Super izq.":"⊞","Super der.":"⊞","Menú":"☰"};
const byId = id => document.getElementById(id);
const create = (tag,className="",text="") => {
  const node=document.createElement(tag);
  node.className=className;
  node.textContent=text;
  return node;
};
const tiles = new Map();
for(const row of rows){
  const line=create("div","keyrow");
  for(const [key,alt,altGr,weight=1] of row){
    const tile=create("span","key");
    if(key.length===1) tile.dataset.finger=colors[groups.findIndex(group=>group.includes(key))]??"";
    tile.style.setProperty("--units",weight*4);
    const cap=create("span","keycap");
    const face=create("span","key-face");
    if(alt) face.append(create("span","key-shift",alt));
    if(altGr) face.append(create("span","key-alt",altGr));
    face.append(create("span","key-value",labels[key]??key.toUpperCase()));
    cap.append(face);
    tile.append(cap);
    if(key==="f" || key==="j") tile.classList.add("home-marker");
    if(Object.hasOwn(labels,key) || weight!==1) tile.classList.add("special");
    if(!key) tile.classList.add("enter-tail");
    if(key==="Intro") tile.classList.add("enter-head");
    tiles.set(key,tile);
    line.append(tile);
  }
  byId("keys").append(line);
}

function identify(char){
  if(!char) return null;
  const nfd=char.normalize("NFD");
  const accent=nfd.includes("\u0301")?"´":nfd.includes("\u0308")?"¨":"";
  const base=shifted[char]??altGraphics[char]??(nfd[0]==="n" && nfd.includes("\u0303") || nfd[0]==="N" && nfd.includes("\u0303") ? "ñ" : char.toLowerCase());
  const key=accent?nfd[0].toLowerCase():base;
  return {
    key,
    finger:groups.findIndex(group=>group.includes(key)),
    shift:Object.hasOwn(shifted,char) || char!==char.toLowerCase(),
    altGr:Object.hasOwn(altGraphics,char),
    accent
  };
}

// The campaign and free practice share a single rendered keyboard.
export function highlightKey(char,enabled=true){
  for(const tile of tiles.values()) tile.classList.remove("active","modifier");
  byId("keys").classList.toggle("neutral",!enabled);
  const hint=enabled?identify(char):null;
  if(!hint) return null;
  const {key,finger,shift,altGr,accent}=hint;
  const tile=tiles.get(key);
  if(tile) tile.classList.add("active");
  if(accent) tiles.get("´")?.classList.add("modifier");
  if(shift || accent==="¨") tiles.get(finger<4 && accent!=="¨"?"Mayús der.":"Mayús izq.")?.classList.add("modifier");
  if(altGr) tiles.get("Alt Gr")?.classList.add("modifier");
  return hint;
}

export function guideKey(char, enabled, finished){
  const next=byId("nextKey");
  const name=byId("finger");
  const action=byId("keyAction");
  const hint=highlightKey(char,enabled);
  const chord=byId("keyChord");
  chord.hidden=true;
  chord.replaceChildren();
  const prompt=byId("prompt");
  prompt.removeAttribute("data-finger");
  next.dataset.finger="";
  if(!hint){
    next.textContent=finished?"✓":"·";
    name.textContent=finished?"Secuencia completa":enabled?"Posición de partida":"Modo sin pistas";
    action.textContent=finished?"Puedes repetir el ejercicio o elegir otro.":enabled?"Coloca los índices sobre F y J.":"Sigue la letra marcada en el ejercicio.";
    return;
  }
  const {key,finger,shift,altGr,accent}=hint;
  const base=key.toUpperCase();
  if(accent || shift || altGr){
    const parts=[];
    if(accent==="¨") parts.push("Mayús","+","´","·");
    else if(accent) parts.push(accent,"·");
    if(shift) parts.push("Mayús","+");
    if(altGr) parts.push("Alt Gr","+");
    parts.push(base);
    chord.append(...parts.map(part=>part==="+" || part==="·"?create("span","key-operator",part):create("kbd","",part)));
    chord.hidden=false;
  }
  next.textContent=char===" "?"␣":char;
  next.dataset.finger=colors[finger]??"";
  prompt.dataset.finger=next.dataset.finger;
  name.textContent=key===" "?"Pulgar · Espacio":names[finger]??"Siguiente tecla";
  const capital=shift?"Mayús + ":"";
  action.textContent=key===" "?"Pulsa la barra espaciadora una vez.":accent?`Pulsa ${accent==="¨"?"Mayús + ´":"´"}, suelta y escribe ${capital}${base}.`:altGr?`Mantén Alt Gr y pulsa ${base}.`:shift?`Mantén Mayús y pulsa ${base}.`:key==="f" || key==="j"?`Pulsa ${base}. Busca el relieve de la tecla.`:`Pulsa la tecla ${base}.`;
}

let feedbackTimer;
let previousTile;
export function flashKey(char, correct){
  previousTile?.classList.remove("pressed","missed");
  clearTimeout(feedbackTimer);
  const hint=identify(char);
  previousTile=hint&&tiles.get(hint.key);
  previousTile?.classList.add(correct?"pressed":"missed");
  feedbackTimer=setTimeout(()=>previousTile?.classList.remove("pressed","missed"),230);
}
