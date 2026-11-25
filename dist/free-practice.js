import {flashKey,highlightKey} from "./keyboard.js";

const words=[
  "agua aire árbol amigo arena azul barco base beso boca bosque brazo brisa bruma bueno búho calle calma cama camino campo canción carta casa causa cielo clase clave cobre coche color comienzo comida compra costa cuento curso dato dedo día dibujo disco dulce eco edad espacio espuma estrella examen faro fecha flor fondo forma frase frente frío fuego futuro gato género gente gesto giro globo golpe grado grano grupo guía gusto hada hoja hora huella hielo idea isla jabón jardín jaula jefe juego jugo junio kilo kiwi lago lápiz lata leche lengua letra libre lima línea lista llave lluvia lobo lugar luna luz madre mapa mar marca marco marea mesa metal metro miedo miel mina mirar modo molino monte motor muelle museo música nave niño noche norte nube nunca ojo ola olivo onda orden otoño oveja padre página pala palma papel parque parte paso patio piedra piel pista playa pluma poder poema polvo prado premio puente pulso punto queso rama ratón rayo razón red reina reloj remo ritmo río roca rojo rosa rueda ruido rumbo ruta sabor sala sal salto sangre seda señal serie sierra silla sitio sobre sol sombra sonido sueño suelo sur tarde tarea taza tecla tela tema tiempo tinta tipo torre traje tren trueno túnel turno unión uña uva valle vapor vaso vela velo verde verso viaje viento villa vino vista vuelo vuelta yate yema yeso yoga zanja zapato zorro zona zurdo",
  "abedul abrazo acento acorde ágil águila albahaca aldea alegría alimento almacén amapola ancla anillo antena arco archivo artículo átomo aurora aventura balcón bambú bandera barrera batería belleza biblioteca bicicleta bolsillo botella brújula burbuja cabina cacao cadena calabaza cámara campus canoa capullo carácter caracol caramelo caverna cepillo chimenea ciencia cintura círculo cisne ciudad clavel colibrí columna cometa compás conejo consejo constelación corona cortina cráter cristal cuaderno cuarzo cubierta cueva delfín deporte destino diamante domingo dragón esfera escudo estación estuche fábrica farola figura frambuesa frontera galaxia gaviota girasol golondrina granizo hangar harina helicóptero horizonte iceberg infusión inventor jarabe jazmín jirafa jornada lámpara latido lechuza leyenda linterna luciérnaga madera maleta mandarina marfil mármol máscara memoria mensaje merienda meteorito micrófono mochila montaña mosaico murciélago nácar naranja neblina nido nogal océano orquesta oxígeno pájaro palacio pañuelo paraje paraguas pasillo paisaje péndulo pétalo piano pingüino planeta plegaria portátil primavera proteína púrpura quimera radar refugio relámpago retrato riqueza romero salvia satélite semáforo semilla serpiente silencioso sirena solsticio sonrisa tejado teléfono telescopio tormenta tortuga trébol universo válvula vehículo ventana verano vértice viajero violeta volcán",
].join(" ").split(" ");
const vocabulary=[...new Set(words)];

export function initFreePractice({onOpen,onClose}){
  const dialog=document.querySelector("#freePractice");
  const openButton=document.querySelector("#openFree");
  const exitButton=document.querySelector("#closeFree");
  const input=document.querySelector("#freeInput");
  const prompt=document.querySelector("#freePrompt");
  const spokenWord=document.querySelector("#freeWord");
  const keyboard=document.querySelector(".keyboard-case");
  const keyboardHome=keyboard.parentElement;
  const afterKeyboard=keyboard.nextSibling;
  const keyboardSlot=document.querySelector("#freeKeyboard");

  let bag=[];
  let word="";
  let position=0;
  let letters=[];
  let composing=false;
  let errorTimer;

  function nextWord(){
    if(!bag.length){
      bag=vocabulary.filter(candidate=>candidate!==word);
      for(let index=bag.length-1;index>0;index--){
        const swap=Math.floor(Math.random()*(index+1));
        [bag[index],bag[swap]]=[bag[swap],bag[index]];
      }
    }
    word=bag.pop();
    position=0;
    letters=Array.from(word,character=>{
      const letter=document.createElement("span");
      letter.textContent=character;
      return letter;
    });
    prompt.replaceChildren(...letters);
    spokenWord.textContent=word;
    markNext();
  }

  function markNext(){
    letters[position].classList.add("current");
    highlightKey(letters[position].textContent);
  }

  function consume(){
    const value=input.value.normalize("NFC");
    input.value="";
    for(const character of value){
      if(/\s/u.test(character)) continue;
      const current=letters[position];
      const correct=character===current.textContent;
      flashKey(character,correct);
      clearTimeout(errorTimer);
      current.classList.toggle("bad",!correct);
      if(!correct){
        errorTimer=setTimeout(()=>current.classList.remove("bad"),220);
        continue;
      }
      current.classList.remove("current");
      current.classList.add("done");
      position++;
      if(position===letters.length) nextWord();
      else markNext();
    }
  }

  openButton.addEventListener("click",()=>{
    onOpen();
    keyboardSlot.append(keyboard);
    exitButton.hidden=false;
    nextWord();
    dialog.showModal();
    input.focus({preventScroll:true});
  });

  function closePractice(){
    clearTimeout(errorTimer);
    composing=false;
    input.value="";
    exitButton.hidden=true;
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
