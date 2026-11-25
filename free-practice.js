import {flashKey,highlightKey} from "./keyboard.js";

const words=[
  "agua aire árbol amigo arena azul barco base beso boca bosque brazo brisa bruma bueno búho calle calma cama camino campo canción carta casa causa cielo clase clave cobre coche color comienzo comida compra costa cuento curso dato dedo día dibujo disco dulce eco edad espacio espuma estrella examen faro fecha flor fondo forma frase frente frío fuego futuro gato género gente gesto giro globo golpe grado grano grupo guía gusto hada hoja hora huella hielo idea isla jabón jardín jaula jefe juego jugo junio kilo kiwi lago lápiz lata leche lengua letra libre lima línea lista llave lluvia lobo lugar luna luz madre mapa mar marca marco marea mesa metal metro miedo miel mina mirar modo molino monte motor muelle museo música nave niño noche norte nube nunca ojo ola olivo onda orden otoño oveja padre página pala palma papel parque parte paso patio piedra piel pista playa pluma poder poema polvo prado premio puente pulso punto queso rama ratón rayo razón red reina reloj remo ritmo río roca rojo rosa rueda ruido rumbo ruta sabor sala sal salto sangre seda señal serie sierra silla sitio sobre sol sombra sonido sueño suelo sur tarde tarea taza tecla tela tema tiempo tinta tipo torre traje tren trueno túnel turno unión uña uva valle vapor vaso vela velo verde verso viaje viento villa vino vista vuelo vuelta yate yema yeso yoga zanja zapato zorro zona zurdo",
  "abedul abrazo acento acorde ágil águila albahaca aldea alegría alimento almacén amapola ancla anillo antena arco archivo artículo átomo aurora aventura balcón bambú bandera barrera batería belleza biblioteca bicicleta bolsillo botella brújula burbuja cabina cacao cadena calabaza cámara campus canoa capullo carácter caracol caramelo caverna cepillo chimenea ciencia cintura círculo cisne ciudad clavel colibrí columna cometa compás conejo consejo constelación corona cortina cráter cristal cuaderno cuarzo cubierta cueva delfín deporte destino diamante domingo dragón esfera escudo estación estuche fábrica farola figura frambuesa frontera galaxia gaviota girasol golondrina granizo hangar harina helicóptero horizonte iceberg infusión inventor jarabe jazmín jirafa jornada lámpara latido lechuza leyenda linterna luciérnaga madera maleta mandarina marfil mármol máscara memoria mensaje merienda meteorito micrófono mochila montaña mosaico murciélago nácar naranja neblina nido nogal océano orquesta oxígeno pájaro palacio pañuelo paraje paraguas pasillo paisaje péndulo pétalo piano pingüino planeta plegaria portátil primavera proteína púrpura quimera radar refugio relámpago retrato riqueza romero salvia satélite semáforo semilla serpiente silencioso sirena solsticio sonrisa tejado teléfono telescopio tormenta tortuga trébol universo válvula vehículo ventana verano vértice viajero violeta volcán",
].join(" ").split(" ");
const vocabulary=[...new Set(words)];

const historySlots=2;
const upcomingSlots=3;
const graphSeconds=45;
const rhythmWindowMs=15000;

export function initFreePractice({onOpen,onClose}){
  const dialog=document.querySelector("#freePractice");
  const openButton=document.querySelector("#openFree");
  const exitButton=document.querySelector("#closeFree");
  const input=document.querySelector("#freeInput");
  const prompt=document.querySelector("#freePrompt");
  const track=document.querySelector("#freeTrack");
  const reducedMotion=matchMedia("(prefers-reduced-motion: reduce)");
  const spokenWord=document.querySelector("#freeWord");
  const readyLabel=document.querySelector("#freeReady");
  const keyboard=document.querySelector(".keyboard-case");
  const keyboardHome=keyboard.parentElement;
  const afterKeyboard=keyboard.nextSibling;
  const keyboardSlot=document.querySelector("#freeKeyboard");
  const timeLabel=document.querySelector("#freeTime");
  const rateLabel=document.querySelector("#freeRate");
  const countLabel=document.querySelector("#freeCompleted");
  const chartLine=document.querySelector("#freeChartLine");
  const chartArea=document.querySelector("#freeChartArea");
  const chartMax=document.querySelector("#freeChartMax");

  let bag=[];
  let lastDrawn;
  let activeIndex=historySlots;
  let slide;
  let position=0;
  let letters=[];
  let composing=false;
  let errorTimer;
  let timer;
  let started=null;
  let hits=[];
  let completed=0;
  let samples=[];
  let lastSample=0;

  function drawWord(){
    if(!bag.length){
      bag=vocabulary.filter(candidate=>candidate!==lastDrawn);
      for(let index=bag.length-1;index>0;index--){
        const swap=Math.floor(Math.random()*(index+1));
        [bag[index],bag[swap]]=[bag[swap],bag[index]];
      }
    }
    lastDrawn=bag.pop();
    return lastDrawn;
  }

  function wordSlot(word){
    const slot=document.createElement("span");
    const text=document.createElement("span");
    slot.className="free-word";
    text.className="free-word-text";
    text.style.setProperty("--letter-count",word.length);
    text.append(...Array.from(word,character=>{
      const letter=document.createElement("span");
      letter.textContent=character;
      return letter;
    }));
    slot.append(text);
    return slot;
  }

  function centerActive(){
    track.style.setProperty("--center-offset",-(activeIndex+.5));
  }

  function paintActive(){
    position=0;
    prompt.classList.remove("awaiting-space");
    readyLabel.textContent="";
    const slot=track.children[activeIndex];
    slot.classList.add("free-active-word");
    letters=[...slot.firstElementChild.children];
    spokenWord.textContent=slot.textContent;
    markNext();
  }

  function settleTrack(){
    while(activeIndex>historySlots){
      track.firstElementChild.remove();
      activeIndex--;
    }
    centerActive();
  }

  function advanceWord(){
    const from=getComputedStyle(track).transform;
    slide?.cancel();
    slide=undefined;
    track.children[activeIndex].classList.remove("free-active-word");
    activeIndex++;
    track.append(wordSlot(drawWord()));
    centerActive();
    paintActive();
    if(reducedMotion.matches){
      settleTrack();
      return;
    }
    const to=getComputedStyle(track).transform;
    slide=track.animate([{transform:from},{transform:to}],{
      duration:430,easing:"cubic-bezier(.18,.7,.24,1)"
    });
    slide.onfinish=()=>{
      slide=undefined;
      settleTrack();
    };
  }

  function resetTrack(){
    activeIndex=historySlots;
    track.replaceChildren(
      ...Array.from({length:historySlots},()=>wordSlot("")),
      ...Array.from({length:upcomingSlots+1},()=>wordSlot(drawWord()))
    );
    centerActive();
    paintActive();
  }

  function markNext(){
    letters[position].classList.add("current");
    highlightKey(letters[position].textContent);
  }

  function paintChart(){
    const maximum=Math.max(60,Math.ceil(Math.max(0,...samples.map(sample=>sample.rate))/60)*60);
    chartMax.textContent=maximum;
    const finalSecond=samples.at(-1)?.second??0;
    const firstSecond=Math.max(0,finalSecond-graphSeconds);
    const points=samples.map(({second,rate})=>[
      ((second-firstSecond)*450/graphSeconds).toFixed(2),
      (72-rate*66/maximum).toFixed(2)
    ]);
    const path=points.map(([x,y],index)=>(index?"L":"M")+x+","+y).join(" ");
    chartLine.setAttribute("d",path);
    chartArea.setAttribute("d",points.length>1?path+` L${points.at(-1)[0]},72 L${points[0][0]},72 Z`:"");
  }

  function refreshStats(now=performance.now()){
    const elapsed=started===null?0:now-started;
    const seconds=Math.floor(elapsed/1000);
    const hours=Math.floor(seconds/3600);
    const clock=[Math.floor(seconds/60)%60,seconds%60].map(value=>String(value).padStart(2,"0")).join(":");
    timeLabel.textContent=hours?hours+":"+clock:clock;

    hits=hits.filter(hit=>now-hit<rhythmWindowMs);
    const windowMs=Math.max(3000,Math.min(elapsed,rhythmWindowMs));
    const rate=Math.round(hits.length*60000/windowMs);
    rateLabel.textContent=rate;

    if(seconds>lastSample){
      samples=samples.filter(sample=>seconds-sample.second<=graphSeconds);
      samples.push({second:seconds,rate});
      lastSample=seconds;
      paintChart();
    }
  }

  function resetStats(){
    started=null;
    hits=[];
    completed=0;
    lastSample=0;
    samples=[{second:0,rate:0}];
    countLabel.textContent="0";
    paintChart();
    refreshStats();
  }

  function consume(){
    const value=input.value.normalize("NFC");
    input.value="";
    for(const character of value){
      if(position===letters.length){
        if(character===" "){
          hits.push(performance.now());
          flashKey(" ",true);
          countLabel.textContent=++completed;
          advanceWord();
        }
        continue;
      }
      if(/\s/u.test(character)) continue;
      const now=performance.now();
      started??=now;
      const current=letters[position];
      const correct=character===current.textContent;
      flashKey(character,correct);
      clearTimeout(errorTimer);
      current.classList.toggle("bad",!correct);
      if(!correct){
        errorTimer=setTimeout(()=>current.classList.remove("bad"),220);
        continue;
      }
      hits.push(now);
      current.classList.remove("current");
      current.classList.add("done");
      position++;
      if(position===letters.length){
        prompt.classList.add("awaiting-space");
        readyLabel.textContent="Palabra completa. Pulsa Espacio.";
        highlightKey(" ");
      } else markNext();
    }
    refreshStats();
  }

  openButton.addEventListener("click",()=>{
    onOpen();
    keyboardSlot.append(keyboard);
    resetStats();
    resetTrack();
    dialog.showModal();
    input.focus({preventScroll:true});
    timer=setInterval(()=>refreshStats(),250);
  });

  function closePractice(){
    clearInterval(timer);
    slide?.cancel();
    slide=undefined;
    clearTimeout(errorTimer);
    composing=false;
    input.value="";
    keyboardHome.insertBefore(keyboard,afterKeyboard);
    dialog.close();
    onClose();
    openButton.focus({preventScroll:true});
  }

  exitButton.addEventListener("click",closePractice);
  dialog.addEventListener("cancel",event=>{
    event.preventDefault();
    closePractice();
  });

  prompt.addEventListener("click",()=>input.focus({preventScroll:true}));
  input.addEventListener("compositionstart",()=>{composing=true;});
  input.addEventListener("compositionend",()=>{composing=false;consume();});
  input.addEventListener("input",event=>{if(!composing && !event.isComposing) consume();});
  input.addEventListener("beforeinput",event=>{
    if(event.inputType==="insertFromPaste" || event.inputType==="insertFromDrop") event.preventDefault();
  });
  input.addEventListener("paste",event=>event.preventDefault());
  input.addEventListener("keydown",event=>{
    if(!event.isComposing && (event.repeat || event.key==="Enter")) event.preventDefault();
  });
  return dialog;
}
