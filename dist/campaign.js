const classics = [
  {id:"launch",name:"Despegue",sector:"Órbita baja",skill:"Fila central",level:"Iniciación",tags:["A S D F","J K L Ñ"],desc:"Encuentra las marcas de F y J con los índices. Desde ahí, activa los motores sin mirar el teclado.",texts:["asdf jklñ fj dk sl añ faja sala ja lla", "fj dk sl añ asdf jklñ falda salsa dallas", "f j d k s l a ñ faja ala sala dada"]},
  {id:"rings",name:"Anillos de hielo",sector:"Anillos exteriores",skill:"Fila superior",level:"Control",tags:["Q W E R T","Y U I O P"],desc:"Asciende a la fila superior para navegar entre los anillos. Después de cada alcance, vuelve a la fila base.",texts:["el piloto gira y el hielo queda lejos", "el piloto altera la ruta y el hielo queda lejos", "el equipo quiere girar y llegar al puerto"]},
  {id:"belt",name:"Cinturón de asteroides",sector:"Campo de rocas",skill:"Fila inferior",level:"Control",tags:["Z X C V","B N M"],desc:"Baja a la fila inferior. Mantén el ritmo cuando cambies de mano o de fila.",texts:["la nave cambia de rumbo y cruza la zona", "bruma y ceniza cubren la base del valle", "mi voz rompe el silencio en la nave"]},
  {id:"signal",name:"Señal perdida",sector:"Frecuencia lunar",skill:"Mayúsculas y tildes",level:"Precisión",tags:["Ñ","Á É Í Ó Ú","Mayús"],desc:"Restablece la señal escribiendo nombres, tildes y eñes. La guía indica cuándo combinar teclas.",texts:["Lucía soñó con un cañón en Titán.", "Iván oyó una señal más allá de Neptuno.", "El satélite Ícaro cambió de órbita."]},
  {id:"protocol",name:"Código de atraque",sector:"Estación orbital",skill:"Números y signos",level:"Precisión",tags:["0–9","¿ ?","¡ !"],desc:"Introduce el código de la estación. Trabaja los números, los signos y los cambios de mayúscula.",texts:["¿Base 07? ¡Aquí Orión! Canal 12, rumbo 235.", "¿Sector 54? ¡Muelles 3 y 8! Llegada: 09:16.", "¡Atención, nave 602! ¿Listos? Código: 13489."]},
  {id:"rescue",name:"Balizas de rescate",sector:"Luna exterior",skill:"Elección de objetivos",level:"Operación",tags:["3 GRUPOS DE BALIZAS","RUTA LIBRE"],desc:"Escribe la primera letra de cualquier baliza del radar para fijar el objetivo. Termina el nombre, pulsa Espacio y rescata la siguiente en el orden que quieras.",texts:["faro hielo nube radio señal valle cima pulso zenit", "cable duna eco faro giro isla lago marea norte", "alba balsa clave delta eje faro huella orbe torre"]},
  {id:"storm",name:"Tormenta de iones",sector:"Frente de iones",skill:"Supervivencia",level:"Desafío",tags:["Racha +1"],desc:"Una racha de 10 aciertos seguidos recupera una vida. Cruza la tormenta antes de que la nave se quede sin energía.",texts:["¡Misión 21! Esquiva el relámpago, gira a babor y vuelve a órbita.", "La tormenta cayó encima. ¡Sube a 750 y mantén el rumbo!", "¿Ves la señal? A las 08:30 giramos. ¡Confía en tu tripulación!"]}
];
const original = Object.fromEntries(classics.map(mission=>[mission.id,mission]));

const sections = [
  {
    name:"Acabo de empezar", sector:"Órbita baja",
    desc:"Aprende la fila central, dedo a dedo. Empieza con F y J y acaba escribiendo palabras sin mirar el teclado.",
    stages:[
      {name:"Índices y medios", pace:4, lives:8, entries:[
        ["punto-partida", "Punto de partida", "F, J y espacio", "ff jj fj jf fjj jff", "Apoya los índices en F y J y pulsa el espacio con un pulgar."],
        ["indices","Dos motores","F y J","fj jf ff jj fjf jfj fj jf","Alterna los índices. Usa un pulgar para los espacios."],
        ["medios","Antenas gemelas","D y K","fd jk df kj dkk kdd fd jk","Mueve los dedos medios y deja los índices apoyados en F y J."],
        ["espejo-base", "Movimientos en espejo", "F, D, J y K", "df fd jk kj dj kd fj dk", "Cambia de mano entre pares y vuelve a F y J."],
        ["eco-cuatro", "Eco de cuatro teclas", "Alternar manos", "fdjk kjdf djfk jdfk fkdj", "Mantén cada dedo sobre su tecla mientras alternas las manos."],
      ]},
      {name:"Anulares y meñiques", pace:5, lives:7, entries:[
        ["anulares","Panel de navegación","S y L","sl ls sll lss das las sal sd lk","Añade los dedos anulares y vuelve a la posición base después de cada pulsación."],
        ["meniques","Ajuste fino","A y Ñ","a ñ aa ññ as ñl sal daña sala","Pulsa A y Ñ con los meñiques."],
        ["base-izquierda", "Ala izquierda", "A, S, D y F", "asdf fdsa as da fa das fada", "Recorre la mitad izquierda desde el meñique hasta el índice."],
        ["base-derecha", "Ala derecha", "J, K, L y Ñ", "jklñ ñlkj jl lk jñ kj lñ", "Vuelve a apoyar cada dedo en su tecla después de pulsar."],
        "launch",
      ]},
      {name:"Centro del teclado", pace:6, lives:7, entries:[
        ["centro","Centro de mando","G y H","fg jh gh hg gala haga daga falda","Alcanza G y H con los índices y vuelve a F y J."],
        ["vuelta-indices", "Regreso a la base", "F–G y J–H", "fgf jhj gfg hjh fg hj gala haga", "Recorre el centro con el índice y vuelve a la tecla con relieve."],
        ["pares-base", "Acoplamiento", "Pares de dedos", "as sa dk kd gl lg hñ ñh fj jf", "Haz una pausa entre pares si pierdes la posición."],
        ["dobles-base", "Doble pulso", "Letras repetidas", "alla falla halla llaga hallas fallas", "Teclea las dos eles por separado. Evita mantener pulsada la tecla."],
        ["base","Órbita estable","Fila central completa","la falda ajada la sala la faja la daga","Encadena palabras de la fila central con pausas regulares."],
      ]},
      {name:"Palabras en órbita", pace:8, lives:6, entries:[
        ["carga-basica", "Carga ligera", "Palabras de la fila central", "sal gas hada saga daga gasa falda faja", "Lee la palabra completa y vuelve a la fila base."],
        ["sala-mandos", "Sala de mandos", "Espacios regulares", "la sala las salas la gala las galas la sal", "Usa siempre el pulgar para separar las palabras."],
        ["alas-base", "Alas del hangar", "Palabras cortas y largas", "alas las alas las faldas la faja la gasa la llaga", "Mantén un ritmo parecido en palabras cortas y largas."],
        ["faro-base", "Última parada del hangar", "Frases de la fila central", "sal a la sala halla la falda hala la faja", "Separa los grupos con el espacio y deja los dedos cerca de su base."],
        ["certifica-base", "Certificación de la fila central", "Repaso de toda la fila", "asdf jklñ gh hg sal a la sala halla la falda las alas la daga", "Reúne todos los dedos de la fila central antes de pasar al resto del teclado."],
      ]},
    ]
  },
  {
    name:"Principiante", sector:"Anillos de Saturno",
    desc:"Añade la fila superior y la inferior en grupos cortos. Termina combinando las tres filas en minúsculas.",
    stages:[
      {name:"Primeros ascensos", pace:9, lives:7, entries:[
        ["re","Radar cercano","R, T y E","fer ter red tres tarde arte radar rata","Sube con el índice para R y T y con el dedo medio para E."],
        ["ui","Luces de pista","U, I y O","odio radio ruido orilla sitio suelo rueda","Sube con la mano derecha. Devuelve los dedos a J, K y L."],
        ["dedos-superiores", "Ascenso escalonado", "E, R, T, U, I y O", "tre tir reo giro rueda torre ruido ruta", "Sube a la fila superior y vuelve a la base tras cada grupo."],
        ["puente-p", "Puente de babor", "P y O", "po op pala paso pilar puerto polilla", "Usa el meñique derecho para P y el anular para O."],
        ["giro-y", "Giro a estribor", "Y e I", "yu uy hoy y rayo y playa y ruta", "Alcanza Y con el índice derecho y vuelve a J."],
      ]},
      {name:"Toda la fila superior", pace:11, lives:6, entries:[
        ["cuarzo-q", "Radar de cuarzo", "Q y U", "que quieto quiero queso equipo parque", "Pulsa Q con el meñique izquierdo y U con el índice derecho."],
        ["doble-u", "Frecuencia exterior", "W y Q", "qw wq kiwi wiki watt queso quieto", "Practica el anular izquierdo de W y el meñique de Q."],
        "rings",
        ["puertos-altos", "Puertos en serie", "Alternancia entre filas", "el radar gira y el piloto pide paso al equipo", "Vuelve a la fila central tras cada alcance."],
        ["velas-altas", "Vuelta por los anillos", "Frase de dos filas", "el piloto gira y la rueda del puerto rueda y pasa al otro lado", "Combina palabras de las dos filas a un ritmo regular."],
      ]},
      {name:"Primeros descensos", pace:13, lives:6, entries:[
        ["cv","Pista de aterrizaje","C, V y B","cabo breve cueva boca clave curva viva","Baja a C con el dedo medio y a V y B con el índice izquierdo."],
        ["nm","Nave auxiliar","N y M","mina mano mono mima nombre mando motor","Usa el índice derecho para N y M."],
        ["fila-inferior-espejo", "Maniobra baja", "V, B, N y M", "vb bv nm mn nave breve mando cambio camino", "Usa cada índice para las teclas inferiores de su lado."],
        ["zx","Zona de cruce","Z y X","zona zorro extra texto mezcla exacta zeta","Entrena el meñique y el anular izquierdos en la fila inferior."],
        ["suelo-entrenamiento", "Cruce de pista", "Z, X, C, V, B, N y M", "cruza la zona con calma y vuelve al camino marcado", "Baja con el dedo correspondiente y recupera la posición base."],
      ]},
      {name:"Las tres filas", pace:15, lives:5, entries:[
        "belt",
        ["pista-kw", "Ruta poco común", "K y W", "el kayak verde lleva kiwi para el equipo del muelle", "Usa K con el medio derecho y W con el anular izquierdo."],
        ["senales-n", "Señales del muelle", "Ñ y letras de las tres filas", "la nave se acerca a la cabina y el equipo enseña el camino", "Distingue N de Ñ al alternar filas."],
        ["ritmo-tres", "Cruce sin pausa", "Frases en minúsculas", "la bruma baja sobre el valle y la nave cruza la zona por un puente de luz", "Agrupa las palabras y mantén los pulgares cerca del espacio."],
        ["certifica-tres", "Certificación de las tres filas", "Alfabeto y espacio", "la nave vuelve al puerto con el mapa del cruce y una caja de cuarzo para el equipo", "Recorre las tres filas en una secuencia sostenida antes de añadir símbolos."],
      ]},
    ]
  },
  {
    name:"Intermedio", sector:"Frecuencia lunar",
    desc:"Domina Mayús, puntuación, tildes y números antes de combinarlos en un mensaje completo.",
    stages:[
      {name:"Mayúsculas y pausas", pace:16, lives:6, entries:[
        ["mayus-dos", "Cambio de guardia", "Mayús a ambos lados", "Alba Feli Luis Jara Nora Vera Sara", "Con cada nombre, pulsa Mayús con la mano contraria a la de la inicial."],
        ["mayus-nombres", "Credenciales", "Nombres propios", "Eva, Pablo, Iris, Bruno, Leo, Sara.", "Suelta Mayús después de cada inicial y vuelve a la fila base."],
        ["caps","Lista de tripulación","Mayúsculas","Alba, Julia, Marcos, Elena, Gonzalo y Azucena.","Usa la tecla Mayús del lado contrario a la mano que escribe la letra."],
        ["punto-corto", "Pausa de radio", "Punto y mayúscula", "La pista abre. La nave sale. El equipo espera.", "Pulsa el punto con el anular derecho y prepara la mayúscula siguiente."],
        ["puntos","Conversación en órbita","Comas y puntos","La nave gira, baja y se detiene. Después, todo queda en calma.","Marca las pausas con comas y puntos."],
      ]},
      {name:"Tildes y diéresis", pace:18, lives:5, entries:[
        ["tilde-uno", "Vocales en órbita", "Vocales con tilde", "mamá café jardín avión menú sofá rincón país", "Pulsa y suelta la tilde antes de la vocal."],
        ["tilde-dos", "Eco de acentos", "Acentos entre sílabas", "rápido, débil, tímido, lógico, número, miércoles", "Mantén la secuencia aunque cambie la posición de la vocal."],
        "signal",
        ["dieresis", "Sensor de diéresis", "Diéresis en minúscula", "El pingüino vio agua. La cigüeña cruzó el cielo.", "Pulsa Mayús con la tecla de tilde, suelta y escribe U."],
        ["tildes","Mensaje cifrado","Acentos y diéresis","Música, brújula, océano, acción, pingüino y vergüenza.","Practica la tilde y la diéresis. Pulsa y suelta el signo antes de la vocal."],
      ]},
      {name:"Números de vuelo", pace:20, lives:5, entries:[
        ["digitos-izquierda", "Marcador de babor", "Cifras 1 a 5", "Canal 15, base 23, muelle 41, sector 52.", "Alcanza las cifras con la mano izquierda y vuelve a la base."],
        ["digitos-derecha", "Marcador de estribor", "Cifras 6 a 0", "Canal 70, base 96, muelle 80, sector 69.", "Reparte las cifras entre los dedos de la mano derecha."],
        ["coord","Coordenadas lunares","Números","Sector 08, canal 23, rumbo 145, altura 679, muelle 10.","Localiza los números con ambas manos."],
        ["tiempo-local", "Ventana de atraque", "Dos puntos y hora", "Salida: 09:15. Llegada: 10:42. Relevo: 12:08.", "Usa Mayús con el punto para escribir dos puntos."],
        ["decimal-simple", "Medición lunar", "Coma decimal", "Masa: 4,5. Altura: 12,8. Tiempo: 0,37. Revisa las 3 medidas.", "Diferencia las comas de una lista de las comas decimales."],
      ]},
      {name:"Señales completas", pace:22, lives:4, entries:[
        ["preguntas", "Respuesta del hangar", "Signos de interrogación", "¿Quién llama? ¿Desde qué muelle? ¿En qué canal?", "Abre y cierra cada pregunta. Sigue la pista para cada signo."],
        ["avisos", "Alerta de pista", "Signos de exclamación", "¡Atención! ¡La pista está libre! ¡Entrad por la puerta 6!", "Combina la tecla de apertura con la de cierre al final del aviso."],
        ["dobles","Canal abierto","¿? e ¡!","¿Nos oís desde la Tierra? ¡Aquí empieza el viaje! ¿Preparados?","Combina los signos de apertura y cierre."],
        "protocol",
        ["certifica-radio", "Certificación de radio", "Mayúsculas, tildes y cifras", "¿Base 21? A las 08:46, Begoña confirmó la señal. ¡El módulo 9 está listo!", "Completa un mensaje que mezcla todos los recursos de este planeta."],
      ]},
    ]
  },
  {
    name:"Avanzado", sector:"Luna exterior",
    desc:"Añade símbolos de Mayús y Alt Gr. Alterna entre texto natural, código y decisiones de vuelo.",
    stages:[
      {name:"Signos de precisión", pace:23, lives:5, entries:[
        ["guiones", "Módulos numerados", "Guiones y paréntesis", "Abre el módulo A-07 (reserva 2) y revisa el paso B-19 (entrada de servicio).", "Observa dónde empieza y termina cada paréntesis."],
        ["porcentajes", "Panel de energía", "Porcentajes y punto y coma", "Batería: 72%; motor: 51%; radar: 18%. Repite la lectura en el canal 6.", "Identifica las dos combinaciones de Mayús en cada lectura."],
        ["falla","Informe técnico","Paréntesis y porcentajes","Presión: 86%; combustible: 42%; temperatura: 19 (sensor auxiliar).","Pasa de números a símbolos y unidades sin mirar el teclado."],
        ["turno","Turno nocturno","Hora y signos","A las 03:47, conecta el módulo B-19; a las 04:05, abre el canal de emergencia.","Sostén un ritmo constante al pasar de letras a cifras."],
        ["credenciales-av", "Clave del piloto", "Guiones bajos y barra", "Usuario: nave_08 / base: sector_12 / canal: aux_7. Confirma el acceso antes de las 06:05.", "Practica el guion bajo con Mayús y la barra con la tecla 7."],
      ]},
      {name:"Símbolos de Alt Gr", pace:25, lives:4, entries:[
        ["arroba", "Antena de correo", "Arroba y almohadilla", "radio@pulso.es / operador@pulso.es / canal #07 / solicitud #21.", "Usa Alt Gr con 2 para la arroba y con 3 para la almohadilla."],
        ["euros-av", "Inventario de carga", "Euro y decimales", "Batería: 45,20 €; panel: 13,05 €; cable: 9,80 €. Total: 68,05 €.", "Mantén Alt Gr y pulsa E para escribir el símbolo del euro."],
        ["enlace","Enlace terrestre","Alt Gr","radio@pulso.es / canal #12 / reserva: 45 € / usuario: nave_07","Practica los símbolos que requieren Alt Gr."],
        ["corchetes-av", "Balizas etiquetadas", "Corchetes", "[A-02] activa; [B-19] en espera; [C-06] sin señal; [D-08] reserva.", "Practica las dos teclas contiguas de apertura y cierre con Alt Gr."],
        ["llaves-av", "Paquete de reserva", "Llaves y corchetes", "[05:10] {base: A-02, motor: activo}; [05:12] {base: B-19, motor: reserva}.", "Mantén separados los pares de corchetes y de llaves."],
      ]},
      {name:"Cambios de ritmo", pace:27, lives:4, entries:[
        ["muy-lejos","Relevo de exploración","Saltos entre filas","Isabel exploró las cuevas; Gonzalo bajó al cráter y Víctor cruzó el viejo puente.","Practica saltos frecuentes entre filas sin perder la posición base."],
        "rescue",
        ["dialogo-av", "Turno por radio", "Comillas y puntuación", "\"Sal por el muelle 7\", dijo Begoña. \"¿Antes de las 09:00?\", preguntó Óscar. \"¡Ahora mismo!\".", "Prepara Mayús antes de cada comilla sin mantenerla al escribir el diálogo."],
        ["en-voz","Registro de cabina","Comillas y diálogos",'"Rumbo 039", dijo Ana. "¿Podéis ver Titán?" Yo respondí: "Sí, al oeste".',"Conserva las mayúsculas, las tildes y los signos del diálogo."],
        ["modo-manual", "Corrección de rumbo", "Símbolos dentro de frases", "Si el nivel baja del 43%, vuelve al muelle [B-10]. Si supera el 68%, sigue hacia la baliza #21.", "Vuelve a la fila base tras los símbolos para enlazar con la frase."],
      ]},
      {name:"Operación completa", pace:30, lives:3, entries:[
        ["puertos-av", "Cruce de canales", "Horas, etiquetas y correos", "A las 04:08, envía el registro [Q-12] a radio@pulso.es. A las 04:19, confirma el canal #31 y espera.", "Encadena tres tipos de signos sin acelerar en los tramos de texto."],
        ["suministros-av", "Suministros de socorro", "Paréntesis, euro y porcentaje", "Compra 2 baterías (14,75 € cada una) y 1 panel (52,40 €). Reserva el 18% para el módulo [A-9].", "Cambia de mano para las cifras, los paréntesis y el símbolo del euro."],
        ["solicitud-av", "Permiso de salida", "Comillas y Alt Gr", "\"¿Listos en [B-08]?\" Si la presión es menor del 67%, responde a control@pulso.es con la clave {R-27}.", "Mantén el ritmo entre el diálogo y la clave de control."],
        ["ronda-av", "Ronda de verificación", "Texto técnico y tildes", "A las 22:14, Iván confirmó el código {A-17} en el canal #6. Begoña revisó el panel (39%) y activó la señal.", "Usa el tiempo para corregir un cambio de fila sin perder el hilo."],
        "storm",
      ]},
    ]
  },
  {
    name:"Experto", sector:"Espacio profundo",
    desc:"Sostén la precisión en textos largos, informes y diálogos. Cada tramo reúne más cambios de teclado y deja menos margen de error.",
    stages:[
      {name:"Ritmo sostenido", pace:31, lives:4, entries:[
        ["cartas-ex", "Cartas desde la cubierta", "Párrafo narrativo", "El piloto abrió la escotilla y vio cómo la sombra del anillo avanzaba sobre el cristal. Nadie habló hasta que las primeras luces cubrieron la cubierta.", "Mantén un ritmo estable en todo el párrafo, incluso entre frases."],
        ["cartografia","Cartografía nocturna","Texto largo","Volamos sobre un océano oscuro. A estribor, una grieta azul dibujaba una línea perfecta; a babor, los relámpagos revelaban el perfil de los glaciares.","Mantén la precisión durante todo un párrafo."],
        ["bitacora-ex", "Bitácora del hielo", "Tildes, comas y continuidad", "A mediodía, el equipo encontró un refugio bajo el hielo. Allí guardó las baterías, cubrió los sensores y esperó a que pasara la tormenta. Después, retomó la marcha hacia el valle.", "Agrupa las palabras de cada frase para conservar la regularidad."],
        ["nombres","Señal multilingüe","Mayús, tildes y diéresis","Íñigo pasó el aviso a Úrsula. Óscar, Begoña y Güell esperaron junto al vehículo en la bahía 7.","Practica vocales acentuadas en mayúscula y nombres con diéresis."],
        ["abismo","La boca del abismo","Letras poco frecuentes","El zigzag del xenón cruzó el vacío. Félix vio brillar el cuarzo, guardó el whisky y ajustó el cajón del radar.","Afina las secuencias de X, Z y Q."],
      ]},
      {name:"Datos en movimiento", pace:34, lives:3, entries:[
        ["registro","Archivo de telemetría","Corchetes y llaves","[23:08] {módulo: B17, presión: 97%, canal: #09} [23:11] {módulo: C02, reserva: 58%}","Los signos requieren alternar Alt Gr y Mayús en el teclado español."],
        ["series-ex", "Serie espectral", "Series y agrupación", "[03:51] {A-11: 42,85%; B-07: 97,00%; C-52: 61,30%}. [03:52] {A-11: 43,02%; B-07: 96,82%; C-52: 61,21%}. Confirma el canal #09.", "Fíjate en los pares de signos y en los decimales que cambian en cada lectura."],
        ["costes","Manifiesto orbital","Importes y símbolos","Carga A: 1.275,30 €; carga B: 840,09 €; ajuste: -3,75%; total provisional: 2.036,31 €.","Escribe el separador de miles y la coma decimal donde corresponda."],
        ["equipos-ex", "Registro de compras", "Cifras y formato monetario", "Factura [F-812]: 3 sensores a 129,95 €; 2 placas a 87,40 €; 1 cable a 9,85 €. Aplica un ajuste del 12,5% y manda el informe a compras@pulso.es.", "Separa mentalmente cada artículo antes de teclear el siguiente."],
        ["traza-ex", "Traza de seguimiento", "Alt Gr sostenido", "[01:02] {sonda: X-7, lectura: 6,35%, canal: #08}; [01:03] {sonda: Z-3, lectura: 8,12%, canal: #12}. Envía ambos bloques a registros@pulso.es.", "Vuelve a la posición base después de cada combinación de Alt Gr."],
      ]},
      {name:"Mensajes extensos", pace:37, lives:3, entries:[
        ["dialogo-ex", "Conversación en la esclusa", "Comillas, tildes y signos dobles", "\"¿Has oído a Íñigo?\", preguntó Begoña. \"Sí, llamó a las 06:37\", contestó Óscar. \"¡Pide que nadie abra la esclusa [B-11]! El módulo auxiliar aún está al 27%\".", "Ajusta el ritmo al pasar de diálogo a cifras y símbolos."],
        ["manual","Manual de contingencia","Texto técnico largo","Si la válvula 7-B pierde presión, cierra los pasos 03 y 04; después, confirma la señal \"RESERVA\" en el panel. Nunca cierres ambos circuitos a la vez.","Mantén la atención en los signos y el orden de las palabras."],
        ["plan-ex", "Plan de evacuación", "Incisos y texto técnico", "A las 04:52, comprueba el panel (modo AUX) y confirma la presión. Si baja del 34%, cierra la válvula [B-07]; si supera el 81%, avisa a guardia@pulso.es. Usa el canal #12 solo durante el giro de la nave.", "Divide el parte por condiciones y conserva todos los delimitadores."],
        ["cronica-ex", "Crónica del eclipse", "Párrafo largo con nombres", "Íñigo divisó un satélite en el horizonte, pero Óscar se fijó en el resplandor que lo seguía. \"¿Será la sonda?\", preguntó. Begoña abrió el canal 17 y confirmó el código de atraque. A las 23:41, la nave salió de la sombra.", "Mantén la precisión al enlazar narración y diálogo."],
        ["perihelio","Paso por el perihelio","Cambios rápidos","¿Listos para el giro? ¡Ahora! Activa las órdenes [A-51] y {B-09}; confirma el canal #7 a las 02:46 e informa al módulo común.","Conserva la calma al cambiar entre minúsculas, mayúsculas, cifras y símbolos."],
      ]},
      {name:"Certificación de vuelo", pace:40, lives:2, entries:[
        ["doble-parte", "Doble parte de vuelo", "Datos, tildes y comillas", "[13:52] {base: X-47, carga: 63,29%, canal: #05}. El aviso de Úrsula decía: \"¡Quedan 2 módulos!\". [13:54] {base: Z-92, carga: 48,02%, canal: #16}. Reenvía la actualización a guardia@pulso.es.", "Mantén el mismo ritmo en el registro y en el aviso."],
        ["puntos-ciegos", "Tramo de puntos ciegos", "Letras poco frecuentes y cifras", "Güell llevó el xilófono al muelle [X-19] y Óscar cerró el cajón del whisky. Por radio, Íñigo marcó un giro de 127º; dos minutos después, volvió al canal #31 para pedir la clave {QZ-07}.", "Regresa a la base después de los saltos a X, Z y Q."],
        ["protocolo-ex", "Protocolo del observatorio", "Corchetes, llaves, euro y hora", "A las 02:38, revisa [W-05] {coste: 407,60 €, reserva: 12,85%}. Si falla el panel, activa [Q-07] y manda el parte a control@pulso.es. Confirma por radio: \"¿Listos para el giro de 90º?\".", "Prepara los cambios de modificador con una palabra de antelación."],
        ["informe-ex", "Informe de regreso", "Texto técnico largo", "Cuando la baliza [C-12] se apague, gira 15,75º a babor y registra la altura. Si la lectura cae por debajo del 31%, cambia al canal #08 y transmite la clave {X-52, Z-09}. A las 08:55, envía el informe a ruta@pulso.es.", "Une los segmentos cortos sin perder la estructura del mensaje."],
        ["certifica-ex", "Certificación de espacio profundo", "Resistencia y precisión", "[23:58] {módulo: Ñ-04, reserva: 67,84%, cargo: 2.706,18 €}. \"¿Podemos girar 135º?\", preguntó Begoña. Úrsula confirmó el canal #17, pidió cerrar [X-07] y envió el parte a órbita@pulso.es. [23:59] {estado: listo}.", "Supera el último vuelo con dos vidas antes de entrar en Demencial."],
      ]},
    ]
  },
  {
    name:"Demencial", sector:"Límite del sistema",
    desc:"Domina mensajes densos con tiempo ajustado. Los dos últimos tramos se juegan con una sola vida.",
    stages:[
      {name:"Límite de velocidad", pace:43, lives:2, entries:[
        ["eco-rojo", "Eco a contrarreloj", "Acentos y cifras", "El enlace falló a las 03:47. Íñigo giró 145º; Óscar revisó la presión (86%) y Begoña confirmó la salida por el canal 17. ¿Quedaba un segundo aviso? ¡Sí!", "Lee un grupo por delante mientras escribes."],
        ["agujero","Horizonte de sucesos","Contrarreloj y tildes","Al cruzar la última boya, Lucía oyó el zumbido del módulo auxiliar. ¿Era un eco? No: el reloj saltó de 03:49 a 03:52 y el radar mostró una órbita imposible.","Vuela con un ritmo alto desde la primera tecla."],
        ["cronica-dm", "Giro sin aviso", "Mayúsculas y signos de apertura", "¿A las 18:32? ¡Ahora! Güell confirmó la latitud 37,45º y Úrsula abrió el módulo [Q-07]. Óscar anotó una caída del 23,5% y cerró la escotilla antes de llegar al cráter.", "Mantén la precisión cuando el texto cambie de ritmo."],
        ["senal-dm", "Señal de emergencia", "Puntuación encadenada", "[11:08] {alarma: B-04, presión: 71,8%, canal: #03}. \"¿Está listo Óscar?\". \"¡Sí, pero Íñigo sigue en [Ñ-19]!\". Confirma el código y avisa a guardia@pulso.es.", "Anticipa el cambio a Alt Gr al terminar cada frase."],
        ["rejilla","Rejilla inestable","Alt Gr y signos","[09:28] {XQ-51: 63%, ZM-08: 17%, BY-12: 84%}; [09:29] {XQ-51: 62%, ZM-08: 19%, BY-12: 83%}. ¿Reinicio? ¡Aún no!","Encadena símbolos, mayúsculas y números sin perder velocidad."],
      ]},
      {name:"Símbolos en cadena", pace:47, lives:2, entries:[
        ["sintaxis-dm", "Sintaxis de emergencia", "Corchetes, llaves y decimales", "[01:47] {K-51: 97,2%; X-04: 58,0%; Z-29: 16,4%}. [01:48] {K-51: 96,9%; X-04: 58,3%; Z-29: 19,5%}. Revisa #07 y reenvía a datos@pulso.es.", "Distingue los bloques casi idénticos. Mira las cifras antes de repetir la secuencia."],
        ["interferencia","Interferencia cruzada","Correos y coordenadas","De: órbita@pulso.es; para: guía@estación.es. Asunto: \"¡Rumbo 287,5º!\". Referencia: [Q7] {X-9, Z-24} / canal #06 / reserva 28%.","Escribe el parte completo. El reloj corre desde que pulsas Empezar."],
        ["contabilidad-dm", "Cargo de emergencia", "Euros, porcentajes y corchetes", "[N-42] {cargo: 1.871,04 €, ajuste: 3,75%}; [Z-09] {cargo: 983,15 €, ajuste: 8,24%}. Total: 2.854,19 €. Reenvía el parte a caja@pulso.es por el canal #16.", "Mantén separados el punto de miles y la coma decimal."],
        ["secuencia-dm", "Ráfaga de coordenadas", "Alternancia de modificadores", "[13:59] {QZ-04: 59,75º; WX-51: 173,80º; Ñ-02: 8,25º}. [14:00] {QZ-04: 61,02º; WX-51: 172,95º; Ñ-02: 9,10º}. Confirma por #24 y cierra [X-7].", "Pulsa las mayúsculas por tramos y vuelve enseguida a las cifras."],
        ["clave-dm", "Clave de frontera", "Tildes, correo y sintaxis", "¿Clave de acceso? {ÑZ-27: 87,69%; XQ-35: 19,02%; WX-04: 59,84%}. ¡Envía el registro [13:42] a órbita@pulso.es! Usa el canal #19; la reserva está al 11%.", "Concentra la atención en los signos que preceden cada clave."],
      ]},
      {name:"Margen cero", pace:51, lives:1, entries:[
        ["linea-roja","Línea roja","Una vida","¡Atención! El módulo {B-39} giró 180º; la sonda [XQ-07] ya no responde. A las 04:56, desconecta el enlace #21 y reenvía el parte a órbita@pulso.es.","Una sola pulsación equivocada termina el intento."],
        ["desfase","Desfase temporal","Mayúsculas acentuadas","Úrsula dijo: \"Óscar, ¿hay señal?\". Íñigo llamó a Güell desde [C-02] a las 11:08; Begoña confirmó un 99,7% de desfase en la baliza X-6.","Conserva cada tilde, cada mayúscula y cada signo bajo presión."],
        ["deriva-dm", "Deriva de la estación", "Precisión con una vida", "[18:37] {B-41: +7,85º; X-08: -12,04º}. Úrsula preguntó: \"¿Güell sigue en [Ñ-09]?\". Begoña cerró el enlace #28 y reenvió el parte a órbita@pulso.es.", "Un error agota la única vida. Reserva un instante para leer los signos más densos."],
        ["senda-dm", "Senda del cometa", "Letras raras y símbolos", "El xenón se encendió a las 23:46. Íñigo marcó [XQ-71] {ángulo: 276,5º; reserva: 8,49%}; Óscar vio el zigzag del cuarzo. ¡Responde a guía@pulso.es en #39!", "Anticipa los saltos a la fila superior y baja solo cuando la siguiente palabra lo pida."],
        ["estacion-cero","Estación cero","Secuencia de control","[00:00] {A-7: 05%; B-19: 99%; Ñ-04: 63%}. Aplica 2,75º al eje Z; después, abre #41, cierra #08 y anota el cargo: 9.875,06 € (módulo X).","Alterna las dos manos al encadenar grupos de símbolos."],
      ]},
      {name:"Última frontera", pace:56, lives:1, entries:[
        ["frontera-dm", "Frontera quebrada", "Informe de alta densidad", "[04:56] {Ñ-81: 6,03%; QZ-29: 99,17%; WX-04: 48,75%}. \"¡Gira 183,25º!\", gritó Óscar. [04:57] {canal: #17; cargo: 3.491,09 €}. Reenvía todo a órbita@pulso.es.", "Mantén las pulsaciones regulares incluso en los bloques más densos."],
        ["sombra-dm", "Protocolo de sombra", "Alt Gr y diálogo rápido", "¡ALERTA! A las 22:58, Güell cerró [WX-83] y dejó la clave {QZ-16; Ñ-04; 291,7º}. \"¿Se mantiene el 89,06%?\", preguntó Íñigo. Usa #51 y confirma en radio@pulso.es.", "Prepara el modificador adecuado antes de cada signo."],
        ["nexo-dm", "Nexo de los tres módulos", "Tres registros encadenados", "[03:18] {Ñ-7: 94,17%; WX-52: 6,94%}. [03:19] {QZ-08: 7,62%; XQ-91: 51,09%}. [03:20] {canal: #62; cargo: 8.041,72 €}. Óscar responde a guía@pulso.es: \"¡Ya!\".", "Controla las transiciones entre los tres bloques sin quedarte atrás."],
        ["preludio-dm", "Antes del último pulso", "Prueba de precisión completa", "[23:58] {WQ-19: 72,46º; ÑX-07: 17,93%; Z-81: 2.801,04 €}. \"¿Listos, Íñigo y Úrsula?\". ¡Canal #49 abierto! Envía la clave a órbita@pulso.es y cierra [QZ-6].", "Conserva la calma con una vida y un mensaje lleno de cambios de fila."],
        ["ultimo","Último pulso","Prueba final","¡PULSO-O! A las 23:59, Íñigo y Úrsula cruzaron el anillo [Z-07]. ¿Clave? {XQ-9: 7,25º; Ñ-2: 99,9%}. Escribe ya a radio@pulso.es, abre #48 y gira 270º.","Completa el mensaje final con una vida y el reloj en marcha."],
      ]},
    ]
  },
];

export const tiers = sections.map(({name,desc,stages})=>({
  name,desc,stages:stages.map(({name})=>name)
}));

export const missions = sections.flatMap((section,tier)=>{
  let number=0;
  return section.stages.flatMap((phase,stage)=>phase.entries.map(entry=>{
    let mission;
    if(typeof entry==="string"){
      mission=original[entry];
    } else {
      const [id,name,skill,sequence,desc]=entry;
      mission={id,name,skill,texts:[sequence],desc,sector:section.sector};
    }
    const longest=Math.max(...mission.texts.map(sequence=>Array.from(sequence).length));
    // Typing speed uses the conventional five keystrokes per word.
    const seconds=mission.id==="ultimo"?34:Math.ceil(longest*12/phase.pace)+(tier===0?12:4);
    return {...mission,tier,stage,number:++number,level:section.name,lives:phase.lives,seconds};
  }));
});
