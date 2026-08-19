## Context

El tema `algebra` existe desde el cambio anterior con siete generadores: patrones, secuencias, término lejano, construir, lenguaje algebraico en dos direcciones y valorizar. Cubre alrededor de la mitad de la Unidad 4.

La otra mitad son cuatro lecciones del libro (pp. 80-87) sobre ecuaciones, desigualdades e inecuaciones. En la evaluación final de la unidad son 8 de 18 preguntas, y dos de ellas empiezan por un dibujo de balanza. Ese dibujo es la razón por la que este trabajo se separó del anterior.

## Goals / Non-Goals

**Goals:**

- Que el niño pueda practicar la unidad completa desde una sola casilla, como se la van a tomar.
- Que la balanza enseñe el porqué, no solo acompañe: si le sacas a un lado, sácale al otro.
- Que entre sin tocar `Game.tsx`, `SoloGame.tsx`, el Worker ni la base de datos.

**Non-Goals:**

- **Ecuaciones con la incógnita en los dos lados.** No están en la unidad.
- **Números negativos y fracciones.** El libro trabaja con `x ∈ ℕ₀`.
- **Resolver paso a paso con el jugador.** El juego es de respuesta múltiple contra reloj; el desarrollo escrito es del cuaderno.

## Decisions

### La balanza se dibuja, no se describe

El estado —equilibrio o inclinación— va en la geometría: altura de los platillos, ángulo del travesaño, posición del fiel. Nada de texto auxiliar.

Es una decisión de contenido, no de estilo. Poner «este lado pesa más» al lado del dibujo convierte una pregunta de interpretación en una de lectura, y justo lo que la pregunta 12 del libro evalúa es si el niño sabe leer la balanza.

Se dibuja con CSS y un `transform: rotate` sobre el travesaño, no con SVG ni con imágenes: son cuatro cajas y una rotación, y así hereda los tokens del tema sin cargar nada.

### La incógnita cambia de lado

El libro escribe `25 = x − 56` y `55 = 5 + x`. Un niño que solo practicó `x + 12 = 23` lee esas como un error de imprenta. Los generadores alternan el lado del igual a propósito.

Es la misma decisión que rotar las letras en valorizar: practicar una sola forma da una falsa sensación de dominio que la prueba deshace.

### Los distractores salen de la balanza, no del azar

En las preguntas de plantear, todas las opciones se construyen con **los números que aparecen en el dibujo**, moviendo un término de lado o cambiando la operación. Una opción con un número que no está en la balanza se descarta sin pensar, y entonces la pregunta se resuelve por eliminación en vez de por comprensión.

En las de resolver, el distractor principal es **operar al revés** —sumar donde había que restar—, que es el error real de un niño que memoriza «se pasa al otro lado» sin entender por qué cambia el signo.

En la del menor natural, el distractor es **el valor que resuelve la igualdad**: quien contesta 13 a `x + 12 > 25` entendió la ecuación pero no la desigualdad, y esa confusión es exactamente lo que la pregunta 16 del libro persigue.

### Los tacos: la balanza se suelta al responder

La balanza se dibuja apoyada sobre dos tacos, y al responder los tacos se
retiran y el travesaño se suelta. Es idea del dueño y entra, pero **solo donde
el estado de la balanza es la respuesta, no el enunciado**.

- En **plantear la ecuación**, la balanza está en equilibrio y ese equilibrio es
  lo que la ecuación afirma. Con tacos, el niño ve dos platillos apoyados,
  elige la ecuación, y al acertar los tacos salen y la balanza **se queda
  quieta y nivelada**: la ecuación era cierta y la balanza lo confirma sola. Eso
  no es adorno, es la demostración.
- En **plantear la inecuación**, la inclinación es el dato de partida: así la
  dibuja el libro y sin ella no hay pregunta. Ahí la balanza aparece ya
  inclinada y sin tacos.

La distinción importa: poner tacos en la inecuación escondería justo lo que hay
que leer.

No hace falta fontanería nueva. El `Render` de cada tema ya recibe
`selectedOption` —decimales lo usa para pintar el signo elegido dentro del
enunciado—, así que la balanza sabe si el jugador ya respondió sin tocar las
pantallas de juego.

**Con tope de tiempo.** La animación va en el orden de los 400 ms y **no
bloquea** el botón de continuar. El juego ya tiene confeti y una pantalla de
chiste entre rondas; un tercer compás obligatorio, con el reloj corriendo,
convierte el premio en peaje.

### Un solo tema, no dos

Se descartó un tema `ecuaciones` separado. El libro lo enseña como una unidad y la prueba lo toma junto; obligar a marcar dos casillas para practicar una sola prueba es trasladar al niño una división que solo existe en el código. El coste es que `algebra` llega a trece generadores y su `Render` gana ramas — si eso se vuelve incómodo, la respuesta es partir el `Render` por tipo de presentación, no partir el tema.

## Risks / Trade-offs

- **El `Render` del tema crece.** Ya tiene tres formas de presentación y suma la balanza. Se mitiga sacando la balanza a su propio componente desde el principio, en vez de dejarla crecer dentro del `switch`.
- **La balanza en pantalla estrecha.** Dos platillos con pesas y números tienen que caber en 390 px sin que las cifras se solapen. Es lo primero que hay que mirar en la verificación visual, no lo último.
- **Una inecuación puede no tener solución natural** según cómo se sorteen los números (`x + 30 < 12`). El generador debe garantizar que exista al menos un natural que la cumpla antes de dar por buena la pregunta, igual que valorizar garantiza que el resultado no sea negativo.
- **La animación de los tacos puede cansar.** Se ve en cada pregunta de
  ecuación, y lo que la primera vez es una demostración a la décima es una
  espera. Por eso es corta y no bloquea; si aun así molesta al jugarlo, se quita
  y el dibujo estático sigue cumpliendo.
- **«Cuál NO satisface» se lee mal si el enunciado no lo grita.** El libro lo pone en mayúsculas por algo. El enunciado debe destacar el «no», o la pregunta mide comprensión lectora en vez de matemática.
