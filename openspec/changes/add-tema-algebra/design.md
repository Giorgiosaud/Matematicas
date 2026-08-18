## Context

La app tiene hoy dos temas —`fracciones` y `decimales`— sobre un registro donde cada tema es una carpeta autocontenida en `src/lib/topics/` que exporta generadores, un `Render`, y sus textos. Agregar un tema es esa carpeta más una línea en el índice: las pantallas de juego no saben de matemáticas.

Ese diseño ya se probó una vez. Cuando entró `decimales`, `Game.tsx` y `SoloGame.tsx` no se tocaron y `registry.test.ts` cubrió los generadores nuevos con solo registrarlos. Este cambio se apoya en lo mismo.

Lo que se agrega es el contenido de la Unidad 4 del libro, en su parte numérica y simbólica. La referencia es el libro del alumno (SM Savia, Matemática 5º básico) y en particular su evaluación final de unidad, que es selección múltiple A/B/C/D: el mismo formato del juego, así que sirve de especificación literal.

## Goals / Non-Goals

**Goals:**

- Que el niño pueda practicar patrones, secuencias, lenguaje algebraico y valorización antes del 3 de septiembre.
- Que las expresiones se escriban exactamente como en su libro, para que el juego no contradiga al cuaderno.
- Que el tema entre sin tocar `Game.tsx` ni `SoloGame.tsx`, y sin migración de base de datos.
- Que sea desplegable por partes: unos pocos generadores en producción valen más que doce a medio terminar.

**Non-Goals:**

- **Ecuaciones e inecuaciones.** Están en la unidad y en la prueba, pero el libro las presenta con balanzas de pesas y ese dibujo es trabajo de otra naturaleza. Van en el cambio siguiente.
- **Secuencias de figuras.** Mismo motivo: piden un renderizador de figuras. El patrón se practica igual con secuencias numéricas, que son la mitad de las preguntas de patrones de la evaluación.
- **Quitar Tailwind del resto de la app.** Es un cambio aparte.
- **Un módulo de lecciones.** Los tips del tema se escriben aquí, pero la pantalla que los muestra es otro cambio.

## Decisions

### La notación vive en un solo archivo

El libro usa **dos** reglas de multiplicación a la vez: coeficiente pegado a la variable (`3x`, `9b`, `12b`) y punto medio entre factores sueltos (`a · b`, `x · x`, `4 · s`). Conviven en la misma expresión —la pregunta 8 de la p. 91 es `9b + a · b`—, así que no alcanza con elegir una.

La regla se implementa en `algebra/expresion.ts`, que es el único lugar del tema que decide cómo se imprime un producto. Los generadores construyen expresiones como datos (coeficiente, variable, operación) y piden el texto a ese módulo. Si mañana aparece una página del libro que contradiga algo, se ajusta ahí y no en siete generadores.

Se descartó formatear la expresión dentro de cada generador: es como se desincronizan las notaciones.

### Las secuencias son datos, no cadenas

Una secuencia se describe con `{ inicio, paso, operacion }` y los términos se calculan con una función pura. Eso permite, con la misma estructura, generar los cuatro tipos de ejercicio que pide el libro —identificar el patrón, completar un término, pedir el 100.º, construir desde la descripción— y sobre todo permite **generar los distractores desde el error**: el término que sale de aplicar el patrón equivocado, no un número al azar.

Es la misma decisión que se tomó en decimales, donde `redondear` usa el truncamiento como distractor porque ese es el error real que comete un niño. Una opción incorrecta que nadie elegiría no enseña nada.

### La categoría `algebra` va en el cliente **y** en el Worker

`topicCategory` deriva la categoría del tema cuando la sesión usó uno solo. Con álgebra registrada devolvería `'algebra'`, un valor que el Worker no conoce y que su validación convierte en `'fracciones'`: los puntajes de álgebra se archivarían compitiendo contra partidas de fracciones.

Por eso `'algebra'` entra en `TopicCategory` (cliente) y en `TOPIC_CATEGORIES` (Worker) en el mismo cambio. No hace falta migración: `topic_category` es texto y ya forma parte de la llave primaria de `scores`, así que un valor nuevo entra sin tocar la tabla.

El orden de despliegue importa igual: **primero el Worker, después el front**. Si el front sale antes, las primeras partidas de álgebra se archivan mal y esa fila queda escrita con la categoría equivocada.

### Dirección visual: la tira y la tarjeta

El tema aporta dos formas nuevas de mostrar un enunciado, y ambas se resuelven dentro del lenguaje que ya tiene el juego —tipografía display, fondo oscuro, acento amarillo, el `?` como incógnita— sin inventar un estilo aparte.

- **Tira de secuencia:** los términos en fila, separados por comas, con el término preguntado sustituido por el `?` amarillo que ya usan fracciones y decimales. Si la secuencia no cabe a lo ancho, se envuelve; no se hace scroll horizontal, porque en el teléfono del niño eso esconde justamente el término que importa. Cuando el ejercicio pide un término lejano, la tira muestra los primeros y termina en `…` antes de la pregunta, tal como lo imprime el libro.
- **Tarjeta de expresión:** la expresión centrada y grande, con la sustitución de variables (`x = 4`) encima en un tamaño menor. Los números se mantienen tabulares para que las opciones no bailen al cambiar de pregunta.

Se descartó una cuadrícula tipo tabla para las secuencias, aunque el libro la use: en el libro la tabla existe porque el niño escribe dentro, y aquí solo lee.

**Sin Tailwind nuevo.** El CSS del tema sigue el patrón de `TopicSelector.css`: tokens nombrados por la propiedad que resuelven, resolutores privados con `--_`. Esto deja una inconsistencia consciente —el `Render` de decimales sí usa Tailwind, porque es anterior a la regla— que se salda cuando se saque Tailwind del proyecto.

### Las variables rotan

Fijar `x` sería más simple, pero el libro valoriza `9b + a · b` y pregunta por `4 · s`. Un niño que solo practicó con `x` llega a la prueba creyendo que la letra es parte de la operación. Los generadores eligen entre las letras del libro.

## Risks / Trade-offs

- **El tema entra incompleto.** Sin ecuaciones ni inecuaciones cubre alrededor de la mitad de la evaluación de la unidad. Se asume a propósito: el niño empieza a practicar en días y el resto llega antes de la prueba. El riesgo es que se lea como "álgebra ya está lista" — por eso los tips del tema deben decir qué cubre y qué no.
- **La traducción a lenguaje natural admite más de una redacción correcta.** "El triple de un número aumentado en nueve" y "nueve más el triple de un número" son ambas válidas y el juego solo acepta una. Se mitiga usando las redacciones textuales del libro, que son las que el niño reconoce, y no sinónimos inventados.
- **Los distractores de valorizar pueden delatar la respuesta.** Si el distractor por precedencia coincide con el resultado correcto, la pregunta queda con dos opciones iguales. El generador debe descartar ese caso, igual que `valor-posicional` descarta preguntar por un dígito cero.
- **La regla `frontend-design` del proyecto no se pudo cumplir al pie de la letra:** esa skill no existe en la versión de superpowers instalada. La decisión estética quedó registrada arriba, que es lo que la regla busca, pero conviene corregir `openspec/config.yaml` para que no apunte a una skill inexistente.
