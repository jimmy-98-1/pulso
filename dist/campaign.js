const classics = [
  {id:"launch",name:"Despegue",sector:"Órbita baja",skill:"Fila central",level:"Iniciación",tags:["A S D F","J K L Ñ"],desc:"Encuentra las marcas de F y J con los índices. Desde ahí, activa los motores sin mirar el teclado.",texts:["asdf jklñ fj dk sl añ faja sala ja lla", "fj dk sl añ asdf jklñ falda salsa dallas", "f j d k s l a ñ faja ala sala dada"]},
  {id:"rings",name:"Anillos de hielo",sector:"Anillos exteriores",skill:"Fila superior",level:"Control",tags:["Q W E R T","Y U I O P"],desc:"Asciende a la fila superior para navegar entre los anillos. Después de cada alcance, vuelve a la fila base.",texts:["agua quieta gira entre las rocas y el hielo", "el piloto cruza la ruta y esquiva el hielo", "quiere ver un puente de luz sobre europa"]},
  {id:"belt",name:"Cinturón de asteroides",sector:"Campo de rocas",skill:"Fila inferior",level:"Control",tags:["Z X C V","B N M"],desc:"Baja a la fila inferior. Mantén el ritmo cuando cambies de mano o de fila.",texts:["la nave cambia de rumbo y cruza la zona", "bruma y ceniza cubren la base del valle", "mi voz rompe el silencio en la nave"]},
  {id:"signal",name:"Señal perdida",sector:"Frecuencia lunar",skill:"Mayúsculas y tildes",level:"Precisión",tags:["Ñ","Á É Í Ó Ú","Mayús"],desc:"Restablece la señal escribiendo nombres, tildes y eñes. La guía indica cuándo combinar teclas.",texts:["Lucía soñó con un cañón en Titán.", "Iván oyó una señal más allá de Neptuno.", "El satélite Ícaro cambió de órbita."]},
  {id:"protocol",name:"Código de atraque",sector:"Estación orbital",skill:"Números y signos",level:"Precisión",tags:["0–9","¿ ?","¡ !"],desc:"Introduce el código de la estación. Trabaja los números, los signos y los cambios de mayúscula.",texts:["¿Base 07? ¡Aquí Orión! Canal 12, rumbo 235.", "¿Sector 54? ¡Muelles 3 y 8! Llegada: 09:16.", "¡Atención, nave 602! ¿Listos? Código: 13489."]},
  {id:"rescue",name:"Balizas de rescate",sector:"Luna exterior",skill:"Elección de objetivos",level:"Operación",tags:["3 GRUPOS DE BALIZAS","RUTA LIBRE"],desc:"Escribe la primera letra de cualquier baliza del radar para fijar el objetivo. Termina el nombre, pulsa Espacio y rescata la siguiente en el orden que quieras.",texts:["faro hielo nube radio señal valle cima pulso zenit", "cable duna eco faro giro isla lago marea norte", "alba balsa clave delta eje faro huella orbe torre"]},
  {id:"storm",name:"Tormenta de iones",sector:"Frente de iones",skill:"Supervivencia",level:"Desafío",tags:["Racha +1"],desc:"Una racha de 10 aciertos seguidos recupera una vida. Cruza la tormenta antes de que la nave se quede sin energía.",texts:["¡Misión 21! Esquiva el relámpago, gira a babor y vuelve a órbita.", "La tormenta cayó encima. ¡Sube a 750 y mantén el rumbo!", "¿Ves la señal? A las 08:30 giramos. ¡Confía en tu tripulación!"]}
];
const original = Object.fromEntries(classics.map(mission=>[mission.id,mission]));

const sections = [
  {
    name:"Acabo de empezar", sector:"Órbita baja", lives:[8,8,7,7,6,6,6],
    desc:"Coloca los dedos en la fila central y practica unas pocas teclas cada vez.",
    entries:[
      "launch",
      ["indices","Dos motores","F y J","fj jf ff jj fjf jfj fj jf","Alterna los índices. Usa un pulgar para los espacios."],
      ["medios","Antenas gemelas","D y K","fd jk df kj dkk kdd fd jk","Mueve los dedos medios y deja los índices apoyados en F y J."],
      ["anulares","Panel de navegación","S y L","sl ls sll lss das las sal sd lk","Añade los dedos anulares y vuelve a la posición base después de cada pulsación."],
      ["meniques","Ajuste fino","A y Ñ","a ñ aa ññ as ñl sal daña sala","Pulsa A y Ñ con los meñiques."],
      ["centro","Centro de mando","G y H","fg jh gh hg gala haga daga falda","Alcanza G y H con los índices y vuelve a F y J."],
      ["base","Órbita estable","Fila central completa","la falda lila la sala la faja la daga","Encadena palabras de la fila central con pausas regulares."]
    ]
  },
  {
    name:"Principiante", sector:"Anillos de Saturno", lives:[7,7,6,6,5,5,5],
    desc:"Añade las filas superior e inferior y aprende a regresar a la posición base.",
    entries:[
      ["re","Radar cercano","R, T y E","fer ter red tres tarde arte radar ruta","Sube con el índice para R y T y con el dedo medio para E."],
      ["ui","Luces de pista","U, I y O","luz sitio puerto ruido orilla piloto","Sube con la mano derecha. Devuelve los dedos a J, K y L."],
      "rings",
      ["cv","Pista de aterrizaje","C, V y B","cabo breve cueva boca clave curva viva","Baja a C con el dedo medio y a V y B con el índice izquierdo."],
      ["nm","Nave auxiliar","N y M","mina mano mono mima nombre mando motor","Usa el índice derecho para N y M."],
      ["zx","Zona de cruce","Z y X","zona zorro extra texto mezcla exacta zeta","Entrena el meñique y el anular izquierdos en la fila inferior."],
      "belt"
    ]
  },
  {
    name:"Intermedio", sector:"Frecuencia lunar", lives:[6,6,5,5,4,4,4],
    desc:"Combina Mayús, tildes y puntuación en mensajes cortos.",
    entries:[
      ["caps","Lista de tripulación","Mayúsculas","Alba, Julia, Marcos, Elena, Gonzalo y Azucena.","Usa la tecla Mayús del lado contrario a la mano que escribe la letra."],
      "signal",
      ["tildes","Mensaje cifrado","Acentos y diéresis","Música, brújula, océano, acción, pingüino y vergüenza.","Practica la tilde y la diéresis. Pulsa y suelta el signo antes de la vocal."],
      ["puntos","Conversación en órbita","Comas y puntos","La nave gira, baja y se detiene. Después, todo queda en calma.","Marca las pausas con comas y puntos."],
      ["dobles","Canal abierto","¿? e ¡!","¿Nos oís desde la Tierra? ¡Aquí empieza el viaje! ¿Preparados?","Combina los signos de apertura y cierre."],
      ["coord","Coordenadas lunares","Números","Sector 08, canal 23, rumbo 145, altura 679, muelle 10.","Localiza los números con ambas manos."],
      "protocol"
    ]
  },
  {
    name:"Avanzado", sector:"Luna exterior", lives:[5,5,4,4,3,3,3],
    desc:"Cambia de ritmo y alterna entre signos, números y palabras menos comunes.",
    entries:[
      "rescue",
      ["turno","Turno nocturno","Hora y signos","A las 03:47, conecta el módulo B-19; a las 04:05, abre el canal de emergencia.","Sostén un ritmo constante al pasar de letras a cifras."],
      ["muy-lejos","Relevo de exploración","Saltos entre filas","Isabel exploró las cuevas; Gonzalo bajó al cráter y Víctor cruzó el viejo puente.","Practica saltos frecuentes entre filas sin perder la posición base."],
      ["falla","Informe técnico","Paréntesis y porcentajes","Presión: 86%; combustible: 42%; temperatura: 19 (sensor auxiliar).","Pasa de números a símbolos y unidades sin mirar el teclado."],
      ["enlace","Enlace terrestre","Alt Gr","radio@pulso.es / canal #12 / reserva: 45 € / usuario: nave_07","Practica los símbolos que requieren Alt Gr."],
      ["en-voz","Registro de cabina","Comillas y diálogos",'"Rumbo 039", dijo Ana. "¿Podéis ver Titán?" Yo respondí: "Sí, al oeste".',"Conserva las mayúsculas, las tildes y los signos del diálogo."],
      "storm"
    ]
  },
  {
    name:"Experto", sector:"Espacio profundo", lives:[4,4,3,3,2,2,2],
    desc:"Vuelos largos con combinaciones exigentes y poco margen de error.",
    entries:[
      ["cartografia","Cartografía nocturna","Texto largo","Volamos sobre un océano oscuro. A estribor, una grieta azul dibujaba una línea perfecta; a babor, los relámpagos revelaban el perfil de los glaciares.","Mantén la precisión durante todo un párrafo."],
      ["registro","Archivo de telemetría","Corchetes y llaves","[23:08] {módulo: B17, presión: 97%, canal: #09} [23:11] {módulo: C02, reserva: 58%}","Los signos requieren alternar Alt Gr y Mayús en el teclado español."],
      ["nombres","Señal multilingüe","Mayús, tildes y diéresis","Íñigo pasó el aviso a Úrsula. Óscar, Begoña y Güell esperaron junto al vehículo en la bahía 7.","Practica vocales acentuadas en mayúscula y nombres con diéresis."],
      ["abismo","La boca del abismo","Letras poco frecuentes","El zigzag del xenón cruzó el vacío. Félix vio brillar el cuarzo, guardó el whisky y ajustó el cajón del radar.","Afina las secuencias de X, Z y Q."],
      ["costes","Manifiesto orbital","Importes y símbolos","Carga A: 1.275,30 €; carga B: 840,09 €; ajuste: -3,75%; total provisional: 2.036,31 €.","Escribe el separador de miles y la coma decimal donde corresponda."],
      ["manual","Manual de contingencia","Texto técnico largo","Si la válvula 7-B pierde presión, cierra los pasos 03 y 04; después, confirma la señal \"RESERVA\" en el panel. Nunca cierres ambos circuitos a la vez.","Mantén la atención en los signos y el orden de las palabras."],
      ["perihelio","Paso por el perihelio","Cambios rápidos","¿Listos para el giro? ¡Ahora! Activa las órdenes [A-51] y {B-09}; confirma el canal #7 a las 02:46 e informa al módulo común.","Conserva la calma al cambiar entre minúsculas, mayúsculas, cifras y símbolos."]
    ]
  },
  {
    name:"Demencial", sector:"Límite del sistema", lives:[2,2,2,1,1,1,1], timers:[40,40,39,40,38,36,34],
    desc:"Contrarreloj con textos largos, símbolos encadenados y hasta una sola vida.",
    entries:[
      ["agujero","Horizonte de sucesos","Contrarreloj y tildes","Al cruzar la última boya, Lucía oyó el zumbido del módulo auxiliar. ¿Era un eco? No: el reloj saltó de 03:49 a 03:52 y el radar mostró una órbita imposible.","Vuela con un ritmo alto desde la primera tecla."],
      ["rejilla","Rejilla inestable","Alt Gr y signos","[09:28] {XQ-51: 63%, ZM-08: 17%, BY-12: 84%}; [09:29] {XQ-51: 62%, ZM-08: 19%, BY-12: 83%}. ¿Reinicio? ¡Aún no!","Encadena símbolos, mayúsculas y números sin perder velocidad."],
      ["interferencia","Interferencia cruzada","Correos y coordenadas","De: órbita@pulso.es; para: guía@estación.es. Asunto: \"¡Rumbo 287,5º!\". Referencia: [Q7] {X-9, Z-24} / canal #06 / reserva 28%.","Escribe el parte completo. El reloj corre desde que pulsas Empezar."],
      ["linea-roja","Línea roja","Una vida","¡Atención! El módulo {B-39} giró 180º; la sonda [XQ-07] ya no responde. A las 04:56, desconecta el enlace #21 y reenvía el parte a órbita@pulso.es.","Una sola pulsación equivocada termina el intento."],
      ["desfase","Desfase temporal","Mayúsculas acentuadas","Úrsula dijo: \"Óscar, ¿hay señal?\". Íñigo llamó a Güell desde [C-02] a las 11:08; Begoña confirmó un 99,7% de desfase en la baliza X-6.","Conserva cada tilde, cada mayúscula y cada signo bajo presión."],
      ["estacion-cero","Estación cero","Secuencia de control","[00:00] {A-7: 05%; B-19: 99%; Ñ-04: 63%}. Aplica 2,75º al eje Z; después, abre #41, cierra #08 y anota el cargo: 9.875,06 € (módulo X).","Alterna las dos manos al encadenar grupos de símbolos."],
      ["ultimo","Último pulso","Prueba final","¡PULSO-O! A las 23:59, Íñigo y Úrsula cruzaron el anillo [Z-07]. ¿Clave? {XQ-9: 7,25º; Ñ-2: 99,9%}. Escribe ya a radio@pulso.es, abre #48 y gira 270º.","Completa el mensaje final con una vida y el reloj en marcha."]
    ]
  }
];

export const tiers=sections.map(({name,desc})=>({name,desc}));
export const missions=sections.flatMap((section,tier)=>section.entries.map((entry,index)=>{
  const [id,name,skill,sequence,desc]=typeof entry==="string"?[]:entry;
  const mission=typeof entry==="string"?original[entry]:{id,name,skill,texts:[sequence],desc,sector:section.sector};
  return {...mission,tier,number:index+1,level:section.name,lives:section.lives[index],seconds:section.timers?.[index]};
}));
