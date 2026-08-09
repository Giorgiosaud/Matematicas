## Why

La app nació como "una parte de matemáticas" — fracciones — pero los niños ya están viendo decimales en clase y necesitan practicarlo ahora. El motor de ejercicios asume fracciones en su tipo de datos y en su renderizado, así que agregar un tema exige generalizarlo primero. Hacerlo ahora, con el segundo tema, evita pagar el costo con el tercero y el cuarto ya encima.

## What Changes

- **Registro de temas**: `Exercise` se generaliza — conserva solo lo que el juego consume (`topic`, `type`, `answer`, `displayAnswer`, `options`) y mueve los datos propios de cada tema a un `payload` opaco. Cada tema pasa a ser una carpeta autocontenida (generadores + renderizado) registrada en un índice.
- **Módulo de decimales** con cuatro familias de ejercicios: leer y escribir decimales (cifras ↔ palabras), comparar decimales, convertir fracción ↔ decimal, y redondear / valor posicional.
- **Selección múltiple de temas** en el Home: el jugador marca uno o varios y las preguntas de la sesión salen mezcladas de todos los marcados. La selección se recuerda entre sesiones.
- **Leaderboard segmentado por categoría de tema** — tres cubos fijos: `fracciones`, `decimales`, `mixto` (cuando la sesión combina temas). Se suma a la segmentación por cantidad de preguntas que ya existe. **BREAKING** para el esquema de D1: la llave única de `scores` cambia y la tabla se reconstruye; los puntajes existentes se preservan y se clasifican como `fracciones`.
- **No cambia** la mecánica de juego: puntaje, rachas, HP, timer, sonidos y efectos quedan igual. `Game.tsx` y `SoloGame.tsx` solo pasan a reenviar los temas activos al generador.

Fuera de alcance, anotado para después: multiplicar/dividir decimales, sumar/restar decimales, renombrar la app (hoy el título dice "FRACCIONES VS" y ya no describe el producto), y el modo VS en vivo entre dispositivos.

## Capabilities

### New Capabilities
- `motor-ejercicios`: cómo se generan, se validan y se muestran los ejercicios; el contrato del registro de temas y qué debe cumplir un tema para poder registrarse.
- `tema-decimales`: las familias de ejercicios de decimales, su progresión de dificultad y sus reglas de precisión numérica.
- `seleccion-temas`: cómo el jugador elige uno o varios temas, cómo se mezclan en una sesión y cómo se recuerda la elección.

### Modified Capabilities
Ninguna. `openspec/specs/` está vacío: este es el primer cambio bajo OpenSpec, así que las capacidades que toca se declaran como nuevas aunque el código correspondiente ya exista. El leaderboard se cubre dentro de `seleccion-temas` en lo que respecta a la categoría de tema; su comportamiento general se especificará cuando un cambio futuro lo requiera.

## Impact

**Código**
- `src/lib/exercises.ts` y `src/lib/types.ts` — se reparten en el nuevo registro `src/lib/topics/`.
- `src/components/exercise/ExerciseDisplay.tsx` — pierde la lógica de fracciones y pasa a despachar al renderizador del tema.
- `src/components/Home.tsx` — chips de selección múltiple, mínimo un tema.
- `src/components/Leaderboard.tsx` — selector de categoría.
- `src/components/Game.tsx` y `src/components/SoloGame.tsx` — cambio mínimo: pasar `config.topics` al generador.
- `src/lib/leaderboardApi.ts` y `src/lib/scoreQueue.ts` — la submission lleva `topicCategory`; las entradas encoladas antes de este cambio se asumen `fracciones`.

**Datos**
- Nueva migración en `migrations/` que reconstruye `scores` (SQLite no permite alterar una llave única con `ALTER TABLE`).
- `worker/index.ts` valida `topicCategory` contra el conjunto fijo, igual que ya hace con `questionLimit` y `timerSeconds`.

**Dependencias**: ninguna nueva. `fraction.js` ya está instalado y cubre la conversión fracción ↔ decimal.

**Riesgo principal**: la migración de `scores`. Es la única parte no reversible y la única que puede perder datos reales — los récords que a los niños les importan.
