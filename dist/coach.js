const messages={
  perfect:[
    "Cada carácter en su sitio. Esa precisión te permite ganar velocidad sin cargar con errores.",
    "Cero fallos, de la primera tecla a la última. Intenta recordar cómo te has colocado las manos.",
    "El texto ha salido limpio. Mantén esa forma de escribir cuando aparezcan secuencias más largas.",
    "Has acertado todas las teclas. Puedes probar el siguiente tramo con la misma calma.",
    "Una lectura atenta y unas manos tranquilas: acabas de demostrar lo bien que funcionan juntas.",
    "Hoy ninguna tecla te ha desviado de la ruta. El siguiente vuelo te espera.",
    "Has mantenido la precisión hasta el último carácter. Eso cuesta más que empezar bien.",
    "Tu siguiente objetivo puede ser sencillo: repetir esta precisión con un ritmo un poco más uniforme.",
    "Ni un fallo. Date un momento para celebrar lo que hace unas cuantas prácticas habría costado más.",
    "Vuelo limpio. Cuando aparezca una tecla nueva, sigue usando la misma atención que en esta misión.",
    "Ni las transiciones ni el final te han hecho perder el control. Buen trabajo de principio a fin.",
    "Ese 100 % es tuyo. Busca el mismo control en la próxima secuencia, aunque tardes un poco más."
  ],
  record:[
    "Has mejorado tu propia marca. Ahí tienes una comparación que sí merece la pena: tú contra tu intento anterior.",
    "Nuevo récord personal. Fíjate en qué partes de la secuencia fluyeron mejor esta vez.",
    "Acabas de dejar tu marca anterior atrás. Intenta repetir ese ritmo sin sacrificar precisión.",
    "Hoy has encontrado una forma más rápida de recorrer este texto. Guarda la sensación, te servirá en otro vuelo.",
    "Tu mejor marca acaba de cambiar. Es un buen momento para probar un texto distinto y ver qué se mantiene.",
    "La práctica se nota cuando un texto conocido empieza a salir con menos esfuerzo. Justo como ahora.",
    "Has subido el listón. La próxima vez puedes trabajar la tecla que todavía te obliga a hacer una pausa.",
    "Ya hay un nuevo tiempo de referencia. Puedes celebrarlo y seguir a tu ritmo.",
    "Mejoraste tu marca en esta misión. Date crédito por el trabajo que hubo entre los dos intentos.",
    "Otra vuelta, una marca mejor. Prueba a conservar el ritmo incluso en los últimos caracteres.",
    "Superaste a tu versión anterior. Quédate con la técnica que te permitió avanzar.",
    "Tu récord ya tiene una nueva cifra. Un buen siguiente paso es repetirla con menos tensión en las manos."
  ],
  fast:[
    "Te ha sobrado tiempo. En la siguiente misión puedes dedicar ese margen a las teclas menos familiares.",
    "Buen ritmo de principio a fin. Prueba a mantener la misma cadencia al encontrar una palabra larga.",
    "Llegaste con tiempo para pensar. Aprovecha ese margen cuando aparezca una combinación complicada.",
    "Los dedos ya encuentran muchas teclas sin pausa. Conserva una presión ligera al aumentar la velocidad.",
    "Avanzaste deprisa por la secuencia. Mira una palabra por delante y deja que los dedos sigan el ritmo.",
    "Has escrito con soltura. La próxima vez trata de que los tramos fáciles y difíciles suenen igual de regulares.",
    "Tu ritmo te ha dado aire. Puedes llevarlo al siguiente nivel con la misma atención.",
    "El cronómetro ha quedado atrás. Ahora tienes espacio para trabajar las transiciones entre una mano y otra.",
    "Buena velocidad. Intenta llegar igual de cómodo a la última palabra que a la primera.",
    "Ese ritmo se gana con práctica. Si vuelves a jugar, busca un vuelo aún más constante.",
    "Terminaste con margen. Suelta las manos un momento antes de volver a despegar.",
    "Has encontrado una cadencia eficaz. Quédate con ella cuando te toque un texto nuevo."
  ],
  steady:[
    "Buen control. Has seguido escribiendo con precisión después de corregir los fallos.",
    "Has encontrado un ritmo que puedes sostener. Repite esa forma de empezar en tu próximo vuelo.",
    "El final ha llegado sin perder el rumbo. Cuando repitas, fíjate en la transición que más te frenó.",
    "La misión está hecha. Te llevas una combinación de teclas que hoy saldrá un poco más fácil.",
    "Se nota una práctica cuidada. Prueba a volver a la posición base después de una tecla lejana.",
    "Vas construyendo soltura. Dale prioridad a que el movimiento se sienta natural.",
    "Buen vuelo. Puedes intentar la siguiente misión o afianzar esta con una vuelta tranquila.",
    "Has pasado el tramo con una buena base. En el próximo, deja que la mirada vaya una palabra por delante.",
    "Has recuperado enseguida el ritmo después de algún tropiezo. Esa recuperación también se entrena.",
    "Ya estás juntando precisión y continuidad. Conserva las dos cuando cambie el texto.",
    "Cada vuelta refuerza dónde están las teclas. Hoy has sumado una que salió bien.",
    "Has terminado con atención. Mantén esa paciencia cuando toque un símbolo nuevo."
  ],
  recover:[
    "Has acabado incluso cuando costaba. Elige una de las teclas difíciles y practícala por separado.",
    "La misión se ha completado. Baja un poco el ritmo en el próximo intento y fíjate si disminuyen los fallos.",
    "Recuperarte después de equivocarte también es práctica. Hoy lo has hecho hasta llegar al final.",
    "Hay alguna tecla que aún pide atención. En Perfil puedes ver las teclas que más te cuestan y practicarlas con calma.",
    "Ya tienes una referencia. En el próximo intento, mejorar un solo detalle será suficiente.",
    "Has encontrado los puntos difíciles del texto. Ahora sabes dónde concentrar el siguiente intento.",
    "Los tropiezos de hoy te señalan qué practicar. Empieza por la transición que más veces te frenó.",
    "Has seguido hasta completar la misión. Si repites, empieza más despacio y acelera solo cuando estés a gusto.",
    "Terminar con poco margen también cuenta. Relaja las manos y prueba otra vez con un ritmo más regular.",
    "Acabas de ganar experiencia con esta secuencia. La próxima vez reconocerás antes sus partes complicadas.",
    "Completar el texto después de varios fallos exige paciencia. Llévate esa paciencia al siguiente vuelo.",
    "Tu próxima meta puede ser acertar dos teclas más. Una mejora pequeña también cambia el resultado."
  ]
};

export function chooseCoachMessage(result,seen){
  const {accuracy,record,elapsed,limit,lives}=result;
  const group=accuracy===100?"perfect":record?"record":accuracy<90||lives===1?"recover":
    limit && elapsed<limit*.55?"fast":"steady";
  const pool=messages[group];
  const previous=Array.isArray(seen[group])?seen[group]:[];
  const available=pool.map((_,index)=>index).filter(index=>!previous.includes(index));
  const candidates=available.length?available:pool.map((_,index)=>index).filter(index=>index!==previous.at(-1));
  const pick=candidates[Math.floor(Math.random()*candidates.length)];
  seen[group]=available.length?[...previous,pick]:[pick];
  return pool[pick];
}
