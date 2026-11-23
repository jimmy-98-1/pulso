import {burst, drawOrbit} from "./orbit.js";
import {flashKey, guideKey} from "./keyboard.js";

const missions = [
  {id:"launch",name:"Despegue",sector:"Órbita baja",skill:"Fila central",level:"Iniciación",tags:["A S D F","J K L Ñ"],desc:"Encuentra las marcas de F y J con los índices. Desde ahí, activa los motores sin mirar el teclado.",texts:["asdf jklñ fj dk sl añ faja sala ja lla", "fj dk sl añ asdf jklñ falda salsa dallas", "f j d k s l a ñ faja ala sala dada"]},
  {id:"rings",name:"Anillos de hielo",sector:"Anillos exteriores",skill:"Fila superior",level:"Control",tags:["Q W E R T","Y U I O P"],desc:"Asciende a la fila superior para navegar entre los anillos. Después de cada alcance, vuelve a la fila base.",texts:["agua quieta gira entre las rocas y el hielo", "el piloto cruza la ruta y esquiva el hielo", "quiere ver un puente de luz sobre europa"]},
  {id:"belt",name:"Cinturón de asteroides",sector:"Campo de rocas",skill:"Fila inferior",level:"Control",tags:["Z X C V","B N M"],desc:"Baja a la fila inferior. Mantén el ritmo cuando cambies de mano o de fila.",texts:["la nave cambia de rumbo y cruza la zona", "bruma y ceniza cubren la base del valle", "mi voz rompe el silencio en la nave"]},
  {id:"signal",name:"Señal perdida",sector:"Frecuencia lunar",skill:"Mayúsculas y tildes",level:"Precisión",tags:["Ñ","Á É Í Ó Ú","Mayús"],desc:"Restablece la señal escribiendo nombres, tildes y eñes. La guía indica cuándo combinar teclas.",texts:["Lucía soñó con un cañón en Titán.", "Iván oyó una señal más allá de Neptuno.", "El satélite Ícaro cambió de órbita."]},
  {id:"protocol",name:"Código de atraque",sector:"Estación orbital",skill:"Números y signos",level:"Precisión",tags:["0–9","¿ ?","¡ !"],desc:"Introduce el código de la estación. Trabaja los números, los signos y los cambios de mayúscula.",texts:["¿Base 07? ¡Aquí Orión! Canal 12, rumbo 235.", "¿Sector 54? ¡Muelles 3 y 8! Llegada: 09:16.", "¡Atención, nave 602! ¿Listos? Código: 13489."]},
  {id:"rescue",name:"Balizas de rescate",sector:"Luna exterior",skill:"Elección de objetivos",level:"Operación",tags:["3 GRUPOS DE BALIZAS","RUTA LIBRE"],desc:"Escribe la primera letra de cualquier baliza del radar para fijar el objetivo. Termina el nombre, pulsa Espacio y rescata la siguiente en el orden que quieras.",texts:["faro hielo nube radio señal valle cima pulso zenit", "cable duna eco faro giro isla lago marea norte", "alba balsa clave delta eje faro huella orbe torre"]},
  {id:"storm",name:"Tormenta de iones",sector:"Frente de iones",skill:"Supervivencia",level:"Desafío",tags:["6 ESCUDOS","Racha +1"],desc:"Cada error quita un escudo. Un impulso de 10 aciertos seguidos recupera uno. Llega al otro lado con la nave intacta.",texts:["¡Misión 21! Esquiva el relámpago, gira a babor y vuelve a órbita.", "La tormenta cayó encima. ¡Sube a 750 y mantén el rumbo!", "¿Ves la señal? A las 08:30 giramos. ¡Confía en tu tripulación!"]}
];
const tutorial = {
  id:"tutorial", name:"Primeras teclas", level:"Primer ejercicio", sector:"Hangar de prácticas",
  texts:["f j fj jf fjf jfj"],
  desc:"Coloca el índice izquierdo en F y el derecho en J. Las dos teclas tienen un pequeño relieve."
};
const steps = [
  "Pulsa F con el índice izquierdo. Usa un pulgar para el espacio.",
  "Pulsa J con el índice derecho. Deja el otro índice sobre F.",
  "Alterna las manos. Si te equivocas, prueba de nuevo la misma tecla."
];
const adaptive = {id:"adaptive",name:"Vuelo a medida",sector:"Zona de pruebas",skill:"Tus teclas",level:"Adaptativo",tags:[],desc:"El laboratorio ha preparado una secuencia con las teclas que más has fallado."};
const words = "agua quietud whisky teclado kiwi jazz zigzag extraño xilófono luna planeta radio cámara órbita nave motor volver bruma cima vecino zorro cosmos viaje veloz equipo juego queso qué quién cuándo dónde pingüino vergüenza año cañón señal pequeña mañana niño botón acción ágil héroe vídeo fútbol útil cráter éter ícaro misión túnel ciudad jinete kilómetro kilo control extra meteorito base espacio estación ruta salto dedos pulso colonia casco láser revolución".split(" ");
const storeKey = "pulso-arcade-v1";
const defaults = {xp:0,records:{},errors:{},history:[],sound:false,hints:true,guideDone:false};
let saved;
try {saved = {...defaults,...JSON.parse(localStorage.getItem(storeKey)||"{}")};} catch {saved = {...defaults};}
function persist(){try {localStorage.setItem(storeKey,JSON.stringify(saved));} catch {/* Session play remains available. */}}

const $ = id => document.getElementById(id);
const make = (tag,text,klass) => {
  const item = document.createElement(tag);
  if (text !== undefined) item.textContent = text;
  if (klass) item.className = klass;
  return item;
};
const input = $("input");
input.setAttribute("aria-describedby","sequence");
const report = $("report");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const views = ["fly","map","lab"];
const counts = {};
let view = "fly";
let mission = missions[0];
let text = "";
let chars = [];
let letters = [];
let state = "idle";
let position = 0;
let attempts = 0;
let combo = 0;
let maxCombo = 0;
let shields = 6;
let errors = {};
let splits = [];
let started = 0;
let elapsedBefore = 0;
let ghost = null;
let badTimer;
let audio;
let lastTelemetry = 0;
let lastDraw = 0;

function sound(kind){
  if(!saved.sound) return;
  const Audio = window.AudioContext || window.webkitAudioContext;
  if(!Audio) return;
  try {
    audio ??= new Audio();
    if(audio.state === "suspended") audio.resume().catch(()=>{});
    const osc=audio.createOscillator(), volume=audio.createGain(), now=audio.currentTime;
    const tones={error:[150,77,.19],tap:[455,550,.07],boost:[420,900,.23],finish:[440,1100,.42]};
    const [start,end,duration]=tones[kind];
    osc.type=kind==="error"?"triangle":"sine";
    osc.frequency.setValueAtTime(start,now);
    osc.frequency.exponentialRampToValueAtTime(end,now+duration);
    volume.gain.setValueAtTime(.0001,now);
    volume.gain.exponentialRampToValueAtTime(kind==="tap"?.038:.095,now+.023);
    volume.gain.exponentialRampToValueAtTime(.0001,now+duration);
    osc.connect(volume).connect(audio.destination);
    osc.start(now);osc.stop(now+duration);
  } catch {/* Audio is optional. */}
}
function paintSound(){
  $("sound").setAttribute("aria-pressed",String(saved.sound));
  $("sound").setAttribute("aria-label",saved.sound?"Silenciar efectos":"Activar sonido");
  $("waves").setAttribute("d",saved.sound?"M16 9a4 4 0 0 1 0 6m2-8a7 7 0 0 1 0 10":"m16 10 5 5m0-5-5 5");
}
function paintProfile(){
  $("rank").textContent = saved.xp>=650?"Comandante":saved.xp>=280?"Piloto orbital":saved.xp>=90?"Piloto":"Cadete";
  $("xp").textContent = saved.xp+" XP";
}
function show(target){
  if(state==="active" && target!=="fly") pause();
  view=target;
  for(const id of views) $(id).hidden = id!==target;
  for(const button of document.querySelectorAll("[data-view]")){
    if(button.dataset.view===target) button.setAttribute("aria-current","page");
    else button.removeAttribute("aria-current");
  }
  if(target==="map") paintMissions();
  if(target==="lab") paintLab();
  window.scrollTo(0,0);
}

function rescueOptions(){
  if(mission.id!=="rescue" || position>=chars.length) return [];
  const prefix=chars.slice(0,position).join("");
  const index=prefix.split(" ").length-1;
  const boundary=position===0 || chars[position-1]===" ";
  const words=text.split(" ");
  const waveEnd=Math.min(words.length,(Math.floor(index/3)+1)*3);
  return words.slice(index,waveEnd).map((word,offset)=>({word,index:index+offset,ready:boundary || offset>0}));
}
function paintBeacons(){
  const options=rescueOptions();
  const radar=$("beacons");
  radar.hidden=options.length===0;
  radar.replaceChildren(...options.map(({word,ready})=>{
    const tag=make("span",undefined,ready?"beacon":"beacon locked");
    tag.append(make("b",word[0]),word.slice(1));
    return tag;
  }));
}
function selectBeacon(char){
  if(mission.id!=="rescue" || (position!==0 && chars[position-1]!==" ") || char===chars[position]) return;
  const options=rescueOptions();
  const match=options.find(({word})=>word[0]===char);
  if(!match) return;
  const words=text.split(" ");
  const from=options[0].index;
  [words[from],words[match.index]]=[words[match.index],words[from]];
  text=words.join(" ");
  chars=Array.from(text);
  renderPrompt();
  announce("Baliza "+match.word+" fijada.");
}
function keyGuide(char){
  guideKey(char,saved.hints,position===chars.length);
}
function paintHints(){
  $("hints").setAttribute("aria-pressed",String(saved.hints));
  $("hints").textContent=saved.hints?"Pistas activadas":"Pistas desactivadas";
  keyGuide(chars[position]);
}
function paintLesson(){
  const isGuide=mission===tutorial;
  $("lessonLevel").textContent=mission.level;
  $("missionTitle").textContent=mission.name;
  $("missionDesc").textContent=mission.desc;
  $("lessonSteps").hidden=!isGuide;
  $("guideCard").hidden=isGuide;
  if(!isGuide) return;
  const step=position<2?0:position<4?1:2;
  for(const [index,item] of [...$("lessonSteps").children].entries()){
    item.classList.toggle("complete",index<step || state==="won");
    if(index===step && state!=="won") item.setAttribute("aria-current","step");
    else item.removeAttribute("aria-current");
  }
  if(state==="active" || state==="paused") $("missionDesc").textContent=steps[step];
  if(state==="won") $("missionDesc").textContent="Has completado los tres pasos. Puedes seguir con Despegue desde Misiones.";
}
function renderPrompt(){
  const prompt = $("prompt");
  prompt.replaceChildren();
  const chunkSize=42;
  let begin=Math.floor(position/chunkSize)*chunkSize;
  if(position===chars.length) begin=Math.floor((position-1)/chunkSize)*chunkSize;
  const end=Math.min(chars.length,begin+chunkSize);
  letters = [];
  let word = make("span",undefined,"word");
  prompt.append(word);
  for(let i=begin;i<end;i++){
    const char=chars[i];
    const span=make("span",char===" "?" ":char,"letter");
    if(i<position) span.classList.add("done");
    if(i===position){span.classList.add("current");if(char===" ") span.textContent="·";}
    word.append(span);
    letters[i]=span;
    if(char===" " && i+1<end){word=make("span",undefined,"word");prompt.append(word);}
  }
  $("sequence").textContent = "Secuencia. " + chars.slice(position,end).join("");
  keyGuide(chars[position]);
}
function advancePrompt(){
  const previous=letters[position-1];
  const next=letters[position];
  if(!previous || !next){renderPrompt();return;}
  previous.classList.remove("current","bad");
  previous.classList.add("done");
  if(chars[position-1]===" ") previous.textContent=" ";
  next.classList.add("current");
  if(chars[position]===" ") next.textContent="·";
  keyGuide(chars[position]);
}
function announce(message){$("status").textContent=message;}
function elapsed(){return elapsedBefore+(state==="active"?performance.now()-started:0);}
function metrics(){
  const ms=elapsed();
  return {ms,ppm:position?Math.round(position*12000/Math.max(ms,1000)):0,accuracy:attempts?Math.round(100*position/attempts):null};
}
function compareGhost(ms){
  if(!ghost || state==="idle") return null;
  let low=0,high=ghost.splits.length;
  while(low<high){
    const middle=(low+high)>>>1;
    if(ghost.splits[middle]<=ms) low=middle+1;
    else high=middle;
  }
  return low/chars.length;
}
const progressTrack=document.querySelector(".track");
function telemetry(now=performance.now()){
  lastTelemetry=now;
  const {ms,ppm,accuracy}=metrics();
  const seconds=Math.floor(ms/1000);
  $("timer").textContent=String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0");
  $("speed").textContent=ppm;
  $("accuracy").textContent=accuracy===null?"—":accuracy+"%";
  const percent=Math.floor(100*position/chars.length);
  $("distance").textContent=percent;
  $("progress").style.width=percent+"%";
  progressTrack.setAttribute("aria-valuenow",String(percent));
  const racing=compareGhost(ms);
  $("ghostMarker").hidden=racing===null;
  if(racing!==null) $("ghostMarker").style.left=(racing*100)+"%";
}
function paintState(){
  const phase=state==="active"?"EN VUELO":state==="paused"?"EN PAUSA":state==="won"?"DESTINO ALCANZADO":state==="lost"?"VUELO INTERRUMPIDO":"EN HANGAR";
  $("phase").textContent=mission.id==="storm" && ["active","paused"].includes(state)?phase+" · "+shields+" ESCUDOS":phase;
  $("combo").textContent="RACHA ×"+combo;
  $("combo").classList.toggle("hot",combo>=5);
  $("start").hidden=state==="active";
  $("start").firstChild.textContent=state==="paused"?"Continuar ":state==="won" || state==="lost"?"Repetir ejercicio ":"Empezar ";
  $("letterCount").textContent=position+" / "+chars.length;
  paintLesson();
  $("pause").hidden=state!=="active";
  $("restart").hidden=state==="idle";
  $("help").replaceChildren();
  if(state==="active") $("help").append(make("kbd","Esc")," para pausar");
  else if(state==="paused") $("help").append(make("kbd","Enter")," para reanudar");
  else if(state==="idle") $("help").append("Pulsa ",make("kbd","Enter")," para empezar");
  const record=saved.records[mission.id];
  $("record").textContent=record?record.ppm+" PPM":"—";
  $("ghost").hidden=mission===tutorial;
  $("ghost").disabled=!record || ["active","paused"].includes(state);
  $("ghost").textContent=ghost?"Desactivar fantasma":"Activar fantasma";
  $("ghostCopy").textContent=mission===tutorial?"En esta guía puedes tomarte el tiempo que necesites.":ghost?"El fantasma morado repite los tiempos de tu récord.":record?"Vuela la misma secuencia contra tu mejor tiempo.":"Completa un vuelo para competir contra tu marca.";
}
function prepare(challenge,sequence=null,opponent=null){
  clearTimeout(badTimer);
  mission=challenge;
  ghost=opponent;
  text=sequence??mission.texts[(counts[mission.id]??0)%mission.texts.length];
  chars=Array.from(text);
  state="idle";
  position=attempts=combo=maxCombo=elapsedBefore=0;
  shields=6;
  errors={};
  splits=[];
  input.value="";
  input.disabled=true;
  $("flightName").textContent=mission.name.toUpperCase();
  $("sector").textContent=mission.sector.toUpperCase();
  $("typingFeedback").textContent="";
  paintState();renderPrompt();paintBeacons();telemetry();
}
function begin(){
  if(view!=="fly" || state==="active") {if(view==="fly") input.focus({preventScroll:true});return;}
  if(state==="won" || state==="lost") prepare(mission,ghost?.text??(mission.id==="adaptive"?text:null),ghost);
  input.disabled=false;
  started=performance.now();
  state="active";
  input.focus({preventScroll:true});
  paintState();
  $("typingFeedback").textContent="";
  announce("Ejercicio en marcha. Escribe la tecla marcada.");
  sound("tap");
}
function pause(){
  if(state!=="active") return;
  elapsedBefore=elapsed();
  state="paused";
  input.value="";
  input.disabled=true;
  composing=false;
  paintState();telemetry();
  announce("Vuelo en pausa.");
}
function finish(success){
  elapsedBefore=elapsed();
  state=success?"won":"lost";
  input.disabled=true;
  const final=metrics();
  const previous=saved.records[mission.id];
  const improved=mission!==tutorial && success && (!previous || final.ppm>previous.ppm || (final.ppm===previous.ppm && final.ms<previous.ms));
  if(improved) saved.records[mission.id]={text,splits:[...splits],ppm:final.ppm,ms:final.ms};
  const ahead=ghost && elapsedBefore<ghost.ms;
  const xp=success?Math.round((32+maxCombo*.8)*final.accuracy/100):0;
  saved.xp+=xp;
  if(mission===tutorial && success) saved.guideDone=true;
  for(const [key,count] of Object.entries(errors)) saved.errors[key]=(saved.errors[key]??0)+count;
  saved.history.unshift({name:mission.name,ppm:final.ppm,accuracy:final.accuracy,won:success});
  saved.history=saved.history.slice(0,12);
  counts[mission.id]=(counts[mission.id]??0)+1;
  persist();paintProfile();paintState();telemetry();
  paintBeacons();
  burst(success?"finish":"error");
  sound(success?"finish":"error");
  $("reportTitle").textContent=mission===tutorial?"¡Ya sabes dónde empezar!":success?(ahead?"¡Fantasma superado!":"¡Destino alcanzado!"):"Escudos agotados";
  const toughest=Object.entries(errors).sort((a,b)=>b[1]-a[1])[0];
  const notes=[mission===tutorial?"Ya has practicado F y J. En Despegue aprenderás el resto de la fila central.":improved?"Nuevo récord de misión.":success?"Vuelo registrado.":"Cada error ha quedado registrado en el laboratorio."];
  if(toughest && success) notes.push("Tecla más fallada: "+keyLabel(toughest[0])+".");
  $("reportCopy").textContent=notes.join(" ");
  $("reportMetrics").replaceChildren(...[[final.ppm,"Palabras/min"],[final.accuracy+"%","Precisión"],[success?"+"+xp:"×"+maxCombo,success?"XP":"Mejor racha"]].map(([value,label])=>{
    const tile=make("div");tile.append(make("strong",value),make("span",label));return tile;
  }));
  const index=missions.findIndex(item=>item.id===mission.id);
  $("next").textContent=mission===tutorial?"Ir a Despegue":success && index>=0 && index<missions.length-1?"Siguiente misión":"Repetir ejercicio";
  report.showModal();
}
function hit(char){
  if(state!=="active") return;
  attempts++;
  selectBeacon(char);
  const correct=char===chars[position];
  flashKey(char,correct);
  $("typingFeedback").textContent="";
  if(correct){
    position++;
    splits.push(elapsed());
    combo++;
    maxCombo=Math.max(combo,maxCombo);
    const boost=combo%10===0;
    if(boost && mission.id==="storm") shields=Math.min(shields+1,6);
    burst(boost?"boost":"tap");
    sound(boost?"boost":"tap");
    advancePrompt();
    if(mission.id==="rescue") paintBeacons();
    if(position===chars.length){finish(true);return;}
    if(boost) announce("Impulso. Racha de "+combo+" aciertos.");
  } else {
    combo=0;
    const target=chars[position];
    errors[target]=(errors[target]??0)+1;
    const mark=letters[position];
    mark?.classList.add("bad");
    clearTimeout(badTimer);
    badTimer=setTimeout(()=>mark?.classList.remove("bad"),260);
    burst("error");sound("error");
    const retry=target===" "?"Pulsa Espacio para seguir.":"Prueba otra vez con «"+target+"».";
    $("typingFeedback").textContent=retry;
    announce(retry);
    if(mission.id==="storm" && --shields===0){finish(false);return;}
  }
  paintState();telemetry();
}
function keyLabel(key){return key===" "?"Espacio":key;}
function consume(){
  const value=input.value.normalize("NFC").replace(/\r?\n/g," ");
  input.value="";
  for(const char of value) hit(char);
}
input.addEventListener("input",event=>{if(!event.isComposing && !composing) consume();});
let composing=false;
input.addEventListener("compositionstart",()=>{composing=true;});
input.addEventListener("compositionend",()=>{composing=false;consume();});
input.addEventListener("beforeinput",event=>{if(event.inputType==="insertFromPaste" || event.inputType==="insertFromDrop") event.preventDefault();});
input.addEventListener("paste",event=>event.preventDefault());
input.addEventListener("keydown",event=>{
  if(event.key==="Enter" && !event.isComposing){event.preventDefault();hit(" ");}
});
document.addEventListener("keydown",event=>{
  if(report.open || event.isComposing || view!=="fly") return;
  if(event.key==="Escape" && state==="active"){event.preventDefault();pause();$("start").focus();return;}
  if(event.key==="Enter" && state!=="active" && !event.target.closest("button,textarea")){
    event.preventDefault();begin();
  }
});
document.addEventListener("visibilitychange",()=>{if(document.hidden) pause();});
$("prompt").addEventListener("click",begin);
$("start").addEventListener("click",begin);
$("pause").addEventListener("click",()=>{pause();$("start").focus();});
$("restart").addEventListener("click",()=>{prepare(mission,text,ghost);begin();});
$("sound").addEventListener("click",()=>{
  saved.sound=!saved.sound;persist();paintSound();sound("tap");
  if(state==="active" && view==="fly") input.focus({preventScroll:true});
});
$("ghost").addEventListener("click",()=>{
  const record=saved.records[mission.id];
  if(!record) return;
  if(ghost) prepare(mission,mission.id==="adaptive"?text:null);
  else prepare(mission,record.text,record);
  $("start").focus();
});
for(const button of document.querySelectorAll("[data-view],[data-go]")){
  button.addEventListener("click",()=>show(button.dataset.view??button.dataset.go));
}
$("hints").addEventListener("click",()=>{
  saved.hints=!saved.hints;
  persist();
  paintHints();
  if(state==="active") input.focus({preventScroll:true});
});
$("tutorial").addEventListener("click",()=>{
  saved.hints=true;
  persist();
  prepare(tutorial);
  paintHints();
  $("start").focus();
});
$("closeReport").addEventListener("click",()=>report.close());
$("next").addEventListener("click",()=>{
  const index=missions.findIndex(item=>item.id===mission.id);
  const move=state==="won" && index>=0 && index<missions.length-1;
  report.close();
  if(mission===tutorial || move){prepare(missions[index+1]);$("start").focus();}
  else begin();
});

function paintMissions(){
  $("missions").replaceChildren(...missions.map(item=>{
    const card=make("article",undefined,"panel mission-card");
    const record=saved.records[item.id];
    const button=make("button",item===mission?"Volver a practicar":item===missions[0]?"Practicar en Despegue":"Elegir misión",item===missions[0]?"primary":"secondary");
    button.type="button";
    button.addEventListener("click",()=>{if(item!==mission) prepare(item);show("fly");$("start").focus();});
    const tags=make("div",undefined,"mission-target");
    tags.append(...item.tags.map(tag=>make("span",tag)));
    card.append(make("span",item.level.toUpperCase(),"eyebrow"),make("h2",item.name),make("p",item.skill+" · "+(record?record.ppm+" PPM de récord":item===missions[0]?"Recomendado para empezar":"Por completar")),make("p",item.desc),tags,button);
    return card;
  }));
}
function weaknesses(){return Object.entries(saved.errors).sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0],"es")).slice(0,4);}
function paintLab(){
  const weak=weaknesses();
  $("labCopy").textContent=weak.length?"Estas teclas acumulan más fallos en tus vuelos registrados.":"Completa una misión para que el laboratorio pueda detectar qué teclas necesitas practicar.";
  $("drill").disabled=!weak.length;
  $("weakKeys").replaceChildren(...weak.map(([key,count])=>{
    const row=make("div",undefined,"weak-row");
    row.append(make("strong",keyLabel(key)),make("span",count===1?"1 fallo":count+" fallos"));return row;
  }));
  if(!saved.history.length){$("history").replaceChildren(make("p","Tus vuelos aparecerán aquí."));return;}
  $("history").replaceChildren(...saved.history.map(result=>{
    const row=make("div",undefined,"history-row");
    row.append(make("strong",result.name),make("span",result.won?`${result.ppm} PPM · ${result.accuracy}%`:`Interrumpido · ${result.accuracy}%`));return row;
  }));
}
$("drill").addEventListener("click",()=>{
  const weak=weaknesses().map(([key])=>key);
  if(!weak.length) return;
  const segments=[];
  for(let round=0;round<3;round++){
    for(const key of weak){
      const matches=words.filter(word=>word.includes(key.toLowerCase()));
      if(key===" "){segments.push(["ala lunar","luz azul","base sur"][round]);continue;}
      if(!matches.length){segments.push(key+"a"+key);continue;}
      const example=matches[(round*3)%matches.length];
      segments.push(key===key.toLowerCase()?example:example.replace(key.toLowerCase(),key));
    }
  }
  prepare({...adaptive,tags:weak.map(keyLabel)},segments.join(" "));
  show("fly");
  $("start").focus();
});

paintSound();paintProfile();prepare(saved.guideDone || saved.history.length?mission:tutorial);paintHints();
function frame(now){
  if(view==="fly" && !document.hidden){
    if(state==="active" && now-lastTelemetry>120) telemetry(now);
    if(!reduced.matches || now-lastDraw>120){
      lastDraw=now;
      drawOrbit(now,{progress:position/chars.length,ghost:compareGhost(elapsed()),active:state==="active",route:Math.max(0,missions.indexOf(mission))});
    }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
