import {burst, drawOrbit} from "./orbit.js";
import {flashKey, guideKey} from "./keyboard.js";
import {initFreePractice} from "./free-practice.js";
import {chooseCoachMessage} from "./coach.js";

import {missions, tiers} from "./campaign.js";

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
const defaults = {xp:0,records:{},errors:{},history:[],sound:false,hints:true,guideDone:false,welcomeSeen:false,pilotName:"",coachSeen:{}};
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
const coach = $("coach");
let coachText;
let reportAction;
const welcome = $("welcome");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const views = ["fly","map","lab"];
const counts = {};
let view = "fly";
let mission = missions[0];
let selectedTier=0;
let selectedWaypoint;
let text = "";
let initialSequence = "";
let chars = [];
let letters = [];
let state = "idle";
let position = 0;
let attempts = 0;
let combo = 0;
let maxCombo = 0;
let lives = 0;
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
  if(target==="lab"){
    $("pilotName").value=saved.pilotName;
    $("pilotStatus").textContent="";
    paintLab();
  }
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
  $("lessonLevel").textContent=mission.number?mission.level+" · NIVEL "+mission.number:mission.level;
  $("missionTitle").textContent=mission.name;
  $("missionDesc").textContent=mission.desc;
  $("lessonSteps").hidden=!isGuide;
  if(!isGuide) return;
  const step=position<2?0:position<4?1:2;
  for(const [index,item] of [...$("lessonSteps").children].entries()){
    item.classList.toggle("complete",index<step || state==="won");
    if(index===step && state!=="won") item.setAttribute("aria-current","step");
    else item.removeAttribute("aria-current");
  }
  if(state==="active" || state==="paused") $("missionDesc").textContent=steps[step];
  if(state==="won") $("missionDesc").textContent="Has completado los tres pasos. Puedes seguir con la primera misión de la fila central.";
}
function renderPrompt(){
  const prompt = $("prompt");
  prompt.replaceChildren();
  const chunkSize=42;
  let begin=0;
  let end=0;
  do {
    begin=end;
    end=Math.min(chars.length,begin+chunkSize);
    if(end===chars.length) break;
    let boundary=end;
    while(boundary>begin && chars[boundary-1]!==" ") boundary--;
    if(boundary>begin) end=boundary;
  } while(position>=end);
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
const clock=$("chrono");
const clockReadout=$("deadline");
const compactTime=$("compactTime");
function paintCountdown(ms){
  const limit=mission.seconds??0;
  const remainder=Math.max(0,limit-ms/1000);
  const seconds=Math.ceil(remainder);
  const formatted=String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0");
  const face=limit?formatted:"∞";
  if(clockReadout.textContent!==face){
    clockReadout.textContent=face;
    clockReadout.setAttribute("aria-label",limit?seconds+" segundos restantes":"Sin límite de tiempo");
    compactTime.textContent=formatted;
    compactTime.setAttribute("aria-label",seconds+" segundos restantes");
  }
  clock.style.setProperty("--sweep", (limit?remainder/limit:1)*360+"deg");
  const urgency=limit && seconds<=10;
  clock.classList.toggle("urgent",Boolean(urgency));
  compactTime.classList.toggle("urgent",Boolean(urgency));
  const label=limit===0?"Sin límite":state==="idle"?"Al empezar":state==="paused"?"En pausa":state==="won"?"Completada":state==="lost"?(seconds?"Intento cerrado":"Tiempo agotado"):urgency?"Últimos segundos":"En marcha";
  if($("chronoStatus").textContent!==label) $("chronoStatus").textContent=label;
}
const progressTrack=document.querySelector(".track");
function telemetry(now=performance.now()){
  lastTelemetry=now;
  const {ms,ppm,accuracy}=metrics();
  paintCountdown(ms);
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
const lifeHud=$("lives");
function paintLives(){
  if(!mission.lives) return;
  if(lifeHud.childElementCount!==mission.lives){
    lifeHud.replaceChildren(...Array.from({length:mission.lives},()=>make("span","♥","life")));
  }
  if(lifeHud.dataset.count===String(lives) && lifeHud.dataset.max===String(mission.lives)) return;
  lifeHud.dataset.count=lives;
  lifeHud.dataset.max=mission.lives;
  lifeHud.setAttribute("aria-label",lives+" de "+mission.lives+(mission.lives===1?" vida":" vidas"));
  for(const [index,heart] of [...lifeHud.children].entries()){
    heart.classList.toggle("spent",index>=lives);
  }
  lifeHud.classList.toggle("critical",lives===1);
}
function timeExpired(){
  return mission.seconds && elapsed()>=mission.seconds*1000;
}
function paintState(){
  const phase=state==="active"?"EN VUELO":state==="paused"?"EN PAUSA":state==="won"?"DESTINO ALCANZADO":state==="lost"?"VUELO INTERRUMPIDO":"EN HANGAR";
  $("phase").textContent=phase;
  $("flightRules").hidden=!mission.lives && !mission.seconds;
  compactTime.hidden=!mission.seconds;
  $("fly").dataset.flightState=state;
  paintLives();
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
  $("ghostCopy").textContent=mission===tutorial?"":ghost?"El fantasma morado repite los tiempos de tu récord.":record?"Vuela la misma secuencia contra tu mejor tiempo.":"Completa un vuelo para competir contra tu marca.";
}
function prepare(challenge,sequence=null,opponent=null){
  clearTimeout(badTimer);
  mission=challenge;
  if(mission.tier!==undefined) selectedTier=mission.tier;
  selectedWaypoint=undefined;
  ghost=opponent;
  text=sequence??mission.texts[(counts[mission.id]??0)%mission.texts.length];
  chars=Array.from(text);
  initialSequence=text;
  state="idle";
  position=attempts=combo=maxCombo=elapsedBefore=0;
  lives=mission.lives??0;
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
  if(state==="lost") prepare(mission,initialSequence,ghost);
  if(state==="won") prepare(mission,ghost?.text??(mission.id==="adaptive"?text:null),ghost);
  input.disabled=false;
  started=performance.now();
  state="active";
  input.focus({preventScroll:true});
  paintState();telemetry();
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
function finish(success,reason="lives"){
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
  if(success) counts[mission.id]=(counts[mission.id]??0)+1;
  reportAction=undefined;
  coachText=success && saved.pilotName ? chooseCoachMessage({
    accuracy:final.accuracy,record:Boolean(previous && improved),elapsed:final.ms/1000,
    limit:mission.seconds,lives
  },saved.coachSeen):null;
  persist();paintProfile();paintState();telemetry();
  paintBeacons();
  burst(success?"finish":"error");
  sound(success?"finish":"error");
  $("reportTitle").textContent=mission===tutorial?"¡Ya sabes dónde empezar!":success?(ahead?"¡Fantasma superado!":"¡Destino alcanzado!"):reason==="time"?"Tiempo agotado":"Te has quedado sin vidas";
  const toughest=Object.entries(errors).sort((a,b)=>b[1]-a[1])[0];
  const accuracyLabel=final.accuracy===null?"—":final.accuracy+"%";
  const notes=[mission===tutorial?"Ya has practicado F y J. La ruta te irá presentando los demás dedos de la fila central.":improved?"Nuevo récord de misión.":success?"Vuelo registrado.":"Vuelve a intentar esta misión. Las misiones superadas siguen registradas."];
  if(toughest && success) notes.push("Tecla más fallada: "+keyLabel(toughest[0])+".");
  $("reportCopy").textContent=notes.join(" ");
  $("reportMetrics").replaceChildren(...[[final.ppm,"Palabras/min"],[accuracyLabel,"Precisión"],[success?"+"+xp:"×"+maxCombo,success?"XP":"Mejor racha"]].map(([value,label])=>{
    const tile=make("div");tile.append(make("strong",value),make("span",label));return tile;
  }));
  const index=missions.findIndex(item=>item.id===mission.id);
  $("next").textContent=mission===tutorial?"Ir a la primera misión":success && index>=0 && index<missions.length-1?"Siguiente misión":success?"Repetir ejercicio":"Reintentar esta misión";
  report.showModal();
}
function hit(char){
  if(state!=="active") return;
  if(timeExpired()){finish(false,"time");return;}
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
    if(boost && mission.id==="storm") lives=Math.min(lives+1,mission.lives);
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
    if(mission.lives){
      lives--;
      announce(retry+" Vidas restantes: "+lives+".");
      if(lives===0){finish(false);return;}
    } else announce(retry);
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
  if(event.repeat && !event.isComposing){event.preventDefault();return;}
  if(event.key==="Enter" && !event.isComposing){event.preventDefault();hit(" ");}
});
const freePractice=initFreePractice({onOpen:pause,onClose:paintHints});

document.addEventListener("keydown",event=>{
  if(freePractice.open || report.open || coach.open || welcome.open || event.isComposing || view!=="fly") return;
  if(event.key==="Escape" && state==="active"){event.preventDefault();pause();$("start").focus();return;}
  if(event.key==="Enter" && state!=="active" && !event.target.closest("button,textarea")){
    event.preventDefault();begin();
  }
});
document.addEventListener("visibilitychange",()=>{if(document.hidden) pause();});
$("prompt").addEventListener("click",begin);
$("start").addEventListener("click",begin);
$("pause").addEventListener("click",()=>{pause();$("start").focus();});
$("restart").addEventListener("click",()=>{prepare(mission,initialSequence,ghost);begin();});
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
function openWelcome(){
  if(state==="active") pause();
  welcome.showModal();
}
$("openGuide").addEventListener("click",openWelcome);
$("closeGuide").addEventListener("click",()=>welcome.close());
welcome.addEventListener("close",()=>{
  saved.welcomeSeen=true;
  persist();
  if(view==="fly") $("start").focus({preventScroll:true});
});
$("tutorial").addEventListener("click",()=>{
  welcome.close();
  saved.hints=true;
  persist();
  prepare(tutorial);
  show("fly");
  paintHints();
  $("start").focus();
});
$("pilotForm").addEventListener("submit",event=>{
  event.preventDefault();
  const field=$("pilotName");
  saved.pilotName=field.value.trim().replace(/\s+/gu," ");
  field.value=saved.pilotName;
  persist();
  $("pilotStatus").textContent=saved.pilotName?"Nombre guardado.":"Nombre borrado.";
});

function applyReportAction(){
  const action=reportAction;
  reportAction=undefined;
  if(action) action();
  else $("start").focus({preventScroll:true});
}

$("closeReport").addEventListener("click",()=>report.close());
$("next").addEventListener("click",()=>{
  const index=missions.findIndex(item=>item.id===mission.id);
  const move=state==="won" && index>=0 && index<missions.length-1;
  reportAction=mission===tutorial || move?()=>{
    prepare(missions[index+1]);
    $("start").focus();
  }:begin;
  report.close();
});
report.addEventListener("close",()=>{
  if(!coachText){applyReportAction();return;}
  $("coachTitle").textContent="Para "+saved.pilotName;
  $("coachMessage").textContent=coachText;
  coachText=null;
  coach.showModal();
});
$("dismissCoach").addEventListener("click",()=>coach.close());
coach.addEventListener("close",applyReportAction);

function paintMissions(){
  const countsByTier=tiers.map((_,tier)=>{
    const entries=missions.filter(item=>item.tier===tier);
    return {entries,complete:entries.filter(item=>saved.records[item.id]).length};
  });
  const total=countsByTier.reduce((sum,entry)=>sum+entry.complete,0);
  $("campaignProgress").textContent=total+" de "+missions.length+" misiones superadas";
  $("tierPicker").replaceChildren(...tiers.map((tier,index)=>{
    const {entries,complete}=countsByTier[index];
    const button=make("button",undefined,"planet-button");
    button.type="button";
    button.setAttribute("aria-pressed",String(index===selectedTier));
    button.style.setProperty("--arc",complete/entries.length*360+"deg");
    const orbit=make("span",undefined,"planet-orbit");
    orbit.setAttribute("aria-hidden","true");
    orbit.append(make("span",undefined,"planet-sphere"));
    button.append(orbit,make("strong",tier.name),make("span",complete+" / "+entries.length,"planet-count"));
    button.addEventListener("click",()=>{
      selectedTier=index;
      selectedWaypoint=undefined;
      paintMissions();
      $("tierPicker").children[index].focus({preventScroll:true});
    });
    return button;
  }));
  const {entries,complete}=countsByTier[selectedTier];
  $("tierName").textContent=tiers[selectedTier].name;
  $("tierDesc").textContent=tiers[selectedTier].desc;
  $("tierProgress").textContent=complete+" de "+entries.length+" superadas";
  const recommended=entries.find(item=>!saved.records[item.id]);
  const current=entries.find(item=>item.id===selectedWaypoint)??recommended??entries[0];
  paintStages(entries,recommended,current);
}

function paintStages(entries,recommended,current){
  const stageNames=tiers[current.tier].stages;
  $("stagePicker").replaceChildren(...stageNames.map((name,index)=>{
    const levels=entries.filter(item=>item.stage===index);
    const cleared=levels.filter(item=>saved.records[item.id]).length;
    const button=make("button",undefined,"stage-button");
    button.type="button";
    button.setAttribute("aria-pressed",String(index===current.stage));
    button.append(make("strong",name),make("span",cleared+" / "+levels.length+" superadas"));
    button.addEventListener("click",()=>{
      const next=levels.find(item=>!saved.records[item.id])??levels[0];
      selectedWaypoint=next.id;
      paintStages(entries,recommended,next);
      $("stagePicker").children[index].focus({preventScroll:true});
    });
    return button;
  }));
  paintWaypoints(entries.filter(item=>item.stage===current.stage),recommended,current);
}

function paintWaypoints(entries,recommended,current){
  $("waypoints").replaceChildren(...entries.map((item,index)=>{
    const cleared=Boolean(saved.records[item.id]);
    const stop=make("button",undefined,"waypoint");
    stop.type="button";
    stop.setAttribute("aria-pressed",String(item===current));
    stop.setAttribute("aria-label","Nivel "+item.number+" · "+item.name+(cleared?" · Superada":item===recommended?" · Siguiente":""));
    stop.classList.toggle("cleared",cleared);
    const number=make("span",cleared?"✓":String(item.number),"waypoint-number");
    number.setAttribute("aria-hidden","true");
    stop.append(number,make("span",item.name,"waypoint-name"));
    stop.addEventListener("click",()=>{
      selectedWaypoint=item.id;
      paintWaypoints(entries,recommended,item);
      $("waypoints").children[index].focus({preventScroll:true});
    });
    return stop;
  }));
  const record=saved.records[current.id];
  const card=make("article",undefined,"mission-brief");
  const info=make("div");
  const label="Nivel "+current.number+(record?" · Superada":current===recommended?" · Siguiente":"");
  info.append(make("div",label,"eyebrow"),make("h3",current.name),make("p",current.desc));
  const tags=make("div",undefined,"mission-target");
  tags.append(make("span","♥ "+current.lives+" "+(current.lives===1?"vida":"vidas"),"life-tag"));
  tags.append(make("span",Math.floor(current.seconds/60)+":"+String(current.seconds%60).padStart(2,"0")));
  tags.append(make("span",current.skill));
  if(record) tags.append(make("span","Récord "+record.ppm+" PPM"));
  for(const tag of current.tags??[]) tags.append(make("span",tag));
  info.append(tags);
  const button=make("button",record?"Repetir misión":"Jugar nivel "+current.number,"primary");
  button.type="button";
  button.addEventListener("click",()=>{if(current!==mission) prepare(current);show("fly");$("start").focus();});
  card.append(info,button);
  $("missions").replaceChildren(card);
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
    const summary=result.won?`${result.ppm} PPM`:"Interrumpido";
    const accuracy=result.accuracy===null?"":` · ${result.accuracy}%`;
    row.append(make("strong",result.name),make("span",summary+accuracy));return row;
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
if(!saved.welcomeSeen) openWelcome();
function frame(now){
  if(view==="fly" && !document.hidden){
    if(state==="active" && timeExpired()) finish(false,"time");
    if(state==="active" && now-lastTelemetry>120) telemetry(now);
    if(!reduced.matches || now-lastDraw>120){
      lastDraw=now;
      drawOrbit(now,{progress:position/chars.length,ghost:compareGhost(elapsed()),active:state==="active",route:Math.max(0,missions.indexOf(mission))});
    }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
