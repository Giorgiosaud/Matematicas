## Why

El 3 de septiembre de 2026 hay prueba trimestral sobre las Unidades 3 y 4 del libro (SM Savia, Matemática 5º básico). La Unidad 4 —patrones y álgebra— es cerca de la mitad de la evaluación y hoy la app **no tiene un solo ejercicio** de ese contenido: solo sabe de fracciones y decimales.

La evaluación final de la unidad (pp. 90-91 del libro) es selección múltiple A/B/C/D, exactamente el formato del juego. Eso hace que el temario sirva como especificación literal: cada pregunta del libro indica qué generador hace falta.

## Open Questions & Assumptions

- Q: ¿Entra álgebra completa o solo la parte de patrones? → **Supuesto:** entra completa, pero este cambio cubre la parte **numérica y simbólica** (patrones, secuencias, lenguaje algebraico, valorizar). Ecuaciones e inecuaciones van en un cambio aparte porque el libro las presenta con **balanzas**, y ese dibujo es trabajo de otra naturaleza. Partir así deja al niño practicando en días, no en semanas.
- Q: ¿Qué notación de multiplicación usa el libro? → **Resuelto, no supuesto.** Es mixta: coeficiente pegado a la variable (`3x + 9`, `9b`, `a + 12b`, `9c + 3a`) y punto medio entre factores sueltos (`a · b`, `x · x`, `4 · s`). Conviven en una misma expresión: la pregunta 8 de la p. 91 es `9b + a · b`. Nunca `×` ni `*`.
- Q: ¿Las secuencias de figuras entran en este cambio? → **Supuesto:** no. Las preguntas 2, 3 y 5 de la evaluación usan figuras, pero la 1 y la 4 son puramente numéricas y el patrón se practica igual sin dibujo. El renderizador de figuras va con el mismo cambio que la balanza.
- Q: ¿Qué letras usar como variable? → **Supuesto:** las del libro, rotando entre `x`, `y`, `a`, `b`, `c`, `n`, `s`, `w`, `z`. Fijar solo `x` daría una falsa sensación de dominio: la pregunta 8 valoriza `9b + a · b` y la 16 usa `x`, y un niño que solo vio `x` se traba.
- Q: ¿Cómo se dosifica la dificultad? → **Supuesto:** igual que los temas existentes, solo por `round`. Rondas bajas: patrones aditivos y valorizar con una variable; rondas altas: patrones multiplicativos, términos lejanos (el 100.º) y expresiones con dos variables.
- Q: ¿Y si el niño solo marca "álgebra" y le salen ejercicios de secuencias sin variables? → **Supuesto:** está bien. El libro los enseña en la misma unidad y la prueba los mezcla; separarlos en dos temas sería más fiel al código que al cuaderno.

## Alternatives Considered

1. **Un tema `algebra` nuevo en el registro** (recomendado): sigue el patrón que ya existe —una carpeta más una línea en el índice—, hereda las pruebas de `registry.test.ts` y el selector de temas sin tocar nada. Trade-off: el tema arranca sin ecuaciones ni figuras, así que queda incompleto hasta el cambio siguiente.
2. **Dos temas separados, `patrones` y `algebra`**: deja al niño elegir con más precisión qué practicar. Trade-off: duplica la infraestructura y contradice al libro, que los enseña juntos; además fragmenta más la tabla de posiciones, que ya sufre de escasez de jugadores.
3. **Extender el tema `fracciones` con generadores algebraicos**: cero infraestructura nueva. Trade-off: rompe la premisa del registro —un tema es un contenido— y haría imposible practicar álgebra sola, que es justo lo que hace falta.

## What Changes

- Nuevo tema **`algebra`** en `src/lib/topics/`, registrado en el índice. Aparece solo en el selector de temas y en la tabla de posiciones sin tocar `Game.tsx` ni `SoloGame.tsx`.
- Generadores de **patrones y secuencias numéricas**: identificar el patrón de formación, completar el término que falta, determinar un término lejano y construir la secuencia a partir de una descripción.
- Generadores de **lenguaje algebraico**: traducir de lenguaje natural a expresión y de expresión a lenguaje natural.
- Generador de **valorizar expresiones algebraicas**: dado el valor de una o dos variables, calcular el valor de la expresión.
- Un helper único que **formatea expresiones con la notación del libro**, para que la regla mixta de multiplicación viva en un solo lugar y cambiarla sea una línea.
- Una **cuarta categoría de tabla de posiciones**, `algebra`, aceptada tanto por el cliente como por el Worker. Sin esto, una sesión solo de álgebra deriva la categoría `algebra`, el Worker no la reconoce y la archiva como `fracciones`: el niño vería su puntaje compitiendo contra partidas de otro contenido. La categoría `mixto` sigue cubriendo cualquier combinación.

## Capabilities

### New Capabilities
- `tema-algebra`: los ejercicios de patrones, secuencias, lenguaje algebraico y valorización de expresiones, con la notación del libro.

### Modified Capabilities
- `seleccion-temas`: el selector pasa de dos temas a tres, y la derivación de la categoría de tabla de posiciones tiene que contemplar el tercero.

## Impact

- **Código nuevo:** `src/lib/topics/algebra/` (generadores, `Render`, textos, formateo de expresiones, tips) y sus pruebas colocadas.
- **Código modificado:** `src/lib/topics/index.ts` (una línea), `src/lib/topics/types.ts` (`TopicId` suma `'algebra'`), `src/lib/topicSelection.ts` (`TopicCategory` suma `'algebra'`) y `worker/index.ts` (`TOPIC_CATEGORIES` suma `'algebra'`).
- **Sin cambios:** `Game.tsx`, `SoloGame.tsx` y el esquema de D1. **No hace falta migración:** `topic_category` es texto y ya forma parte de la llave primaria, así que un valor nuevo entra sin tocar la tabla.
- **Cobertura:** `registry.test.ts` recorre todos los generadores de todos los temas registrados, así que el tema hereda la verificación del contrato `Exercise` con solo registrarse.
