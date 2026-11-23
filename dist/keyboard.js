const rows = [
  [["º","ª"],["1","!"],["2",'"',"@"],["3","·","#"],["4","$"],["5","%"],["6","&","¬"],["7","/"],["8","("],["9",")"],["0","="],["'","?"],["¡","¿"],["Retroceso","",null,1.8]],
  [["Tab","",null,1.45],["q"],["w"],["e","","€"],["r"],["t"],["y"],["u"],["i"],["o"],["p"],["`","^","["],["+","*","]"],["Intro","",null,1.35]],
  [["Bloq Mayús","",null,1.7],["a"],["s"],["d"],["f"],["g"],["h"],["j"],["k"],["l"],["ñ"],["´","¨","{"],["ç","","}"],["","",null,1.1]],
  [["Mayús izq.","",null,1.25],["<",">"],["z"],["x"],["c"],["v"],["b"],["n"],["m"],[",",";"],[".",":"],["-","_"],["Mayús der.","",null,2.55]],
  [["Ctrl","",null,1.35],["Alt","",null,1.3],[" ","",null,6],["Alt Gr","",null,1.3],["Ctrl der.","",null,1.35]]
];
const groups = ["º1qaz<","2wsx","3edc","45rtfgvb","67yuhjnm","8ik,","9ol.","0'¡p`+ñ´ç-"," "];
const names = ["Meñique izquierdo","Anular izquierdo","Medio izquierdo","Índice izquierdo","Índice derecho","Medio derecho","Anular derecho","Meñique derecho","Pulgar"];
const colors = ["pinky","ring","middle","index","index","middle","ring","pinky","thumb"];
const shifted = Object.fromEntries(rows.flat().filter(([,alt])=>alt).map(([key,alt])=>[alt,key]));
const altGraphics = Object.fromEntries(rows.flat().filter(([, ,alt])=>alt).map(([key,,alt])=>[alt,key]));
const labels = {" ":"Espacio","Retroceso":"⌫","Intro":"↵","Mayús izq.":"⇧","Mayús der.":"⇧","Ctrl der.":"Ctrl"};
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
    tile.style.setProperty("--weight",weight);
    if(alt) tile.append(create("span","key-shift",alt));
    if(altGr) tile.append(create("span","key-alt",altGr));
    tile.append(create("span","key-value",labels[key]??key.toUpperCase()));
    if(key==="f" || key==="j") tile.classList.add("home-marker");
    if("asdfjklñ".includes(key) && key) tile.classList.add("home");
    if(Object.hasOwn(labels,key) || weight!==1) tile.classList.add("special");
    if(!key) tile.classList.add("enter-tail");
    tiles.set(key,tile);
    line.append(tile);
  }
  byId("keys").append(line);
}

const svgNS="http://www.w3.org/2000/svg";
const svgElement=(tag,attributes)=>{
  const element=document.createElementNS(svgNS,tag);
  for(const [key,value] of Object.entries(attributes)) element.setAttribute(key,value);
  return element;
};
const fingers=[];
const hands=svgElement("svg",{viewBox:"0 0 166 65"});
for(let side=0;side<2;side++){
  const group=svgElement("g",{transform:side?"translate(166,0) scale(-1,1)":"translate(0,0)"});
  group.append(svgElement("path",{class:"palm",d:"M 13,34 C 18,29 55,29 58,39 L 60,49 Q 59,60 48,62 H 28 Q 15,61 13,50 Z"}));
  const digits=[
    ["M15 37 L12 25",0],
    ["M25 34 L23 14",1],
    ["M35 32 L34 8",2],
    ["M46 34 L46 13",3],
    ["M56 45 L68 29",8]
  ];
  for(const [d,index] of digits){
    const position=side && index!==8 ? 7-index : index;
    const finger=svgElement("path",{class:"finger",d,"data-finger":colors[position]});
    group.append(finger);
    fingers.push({position,finger});
  }
  hands.append(group);
}
byId("hands").append(hands);

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

export function guideKey(char, enabled, finished){
  for(const tile of tiles.values()) tile.classList.remove("active","modifier");
  for(const {finger} of fingers) finger.classList.remove("active");
  const next=byId("nextKey");
  const name=byId("finger");
  const action=byId("keyAction");
  const hint=identify(char);
  const prompt=byId("prompt");
  prompt.removeAttribute("data-finger");
  next.dataset.finger="";
  byId("keys").classList.toggle("neutral",!enabled);
  if(!hint || !enabled){
    next.textContent=finished?"✓":"·";
    name.textContent=finished?"Secuencia completa":enabled?"Posición de partida":"Modo sin pistas";
    action.textContent=finished?"Puedes repetir el ejercicio o elegir otro.":enabled?"Coloca los índices sobre F y J.":"Sigue la letra marcada en el ejercicio.";
    return;
  }
  const {key,finger,shift,altGr,accent}=hint;
  const base=key.toUpperCase();
  const tile=tiles.get(key);
  if(tile) tile.classList.add("active");
  if(accent) tiles.get("´")?.classList.add("modifier");
  if(shift || accent==="¨") tiles.get(finger<4 && accent!=="¨"?"Mayús der.":"Mayús izq.")?.classList.add("modifier");
  if(altGr) tiles.get("Alt Gr")?.classList.add("modifier");
  for(const item of fingers) item.finger.classList.toggle("active",item.position===finger);
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
