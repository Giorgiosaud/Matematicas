## Context

El motor de ejercicios vive hoy en `src/lib/exercises.ts`: seis generadores de fracciones, un `generateExercise(round)` que sortea entre ellos, y un tipo `Exercise` con campos de fracciones incrustados (`fractionA`, `fractionB`, `targetDenominator`). `ExerciseDisplay.tsx` sabe leer esos campos y renderizar numeradores y denominadores.

Todo lo demás —HP, rachas, puntaje, timer, sonido, efectos, tabla de posiciones— consume el `Exercise` sin saber que existen las fracciones. Esa es la buena noticia: el acoplamiento al tema está concentrado en dos archivos, no repartido.

La restricción que manda sobre el resto: `Game.tsx` (609 líneas) y `SoloGame.tsx` (481) son los archivos grandes y delicados del proyecto. Un diseño que obligue a editarlos con cada tema nuevo es un diseño fallido.

## Goals / Non-Goals

**Goals:**
- Que agregar el tercer tema sea crear una carpeta y añadir una línea a un índice.
- Que `Game.tsx` y `SoloGame.tsx` no vuelvan a tocarse por motivos de tema.
- Que decimales quede jugable, mezclable con fracciones, y con su propia tabla de posiciones.
- Que los récords existentes sobrevivan la migración.

**Non-Goals:**
- Cambiar la mecánica, el puntaje o los efectos del juego.
- Renombrar la app (el título sigue diciendo "FRACCIONES VS").
- Sumar, restar, multiplicar o dividir decimales entre sí.
- El modo VS en vivo entre dispositivos.

## Decisions

### Registro de temas con payload opaco, en vez de ensanchar `Exercise`

`Exercise` conserva `topic`, `type`, `answer`, `displayAnswer` y `options`, y todo lo específico del tema va en `payload: unknown` que solo su renderizador interpreta. Cada tema es una carpeta bajo `src/lib/topics/` que exporta generadores y componente de render, registrada en `src/lib/topics/index.ts`.

*Alternativa descartada:* agregar `decimalA`, `decimalB`, `places` al tipo actual y extender el `switch` del render. Llega antes a decimales, pero cada tema ensancha un tipo compartido y alarga una cadena de condicionales; para el tercer tema habría que hacer esta refactorización igual, con más código que migrar.

*Alternativa descartada:* una pantalla de juego por tema. Duplica ~500 líneas de lógica de puntaje, sonido y efectos, y es incompatible con la selección múltiple, donde una sola partida mezcla temas.

### La mezcla vive en el generador, no en la pantalla

`generateExercise(round, topics)` sortea primero el tema entre los activos y después el generador dentro de ese tema. Las pantallas de juego solo reenvían `config.topics`. Un sorteo plano sobre todos los generadores de todos los temas daría más peso al tema con más generadores; sortear el tema primero mantiene los temas equiprobables, que es lo que un niño espera al marcar dos casillas.

### Decimales como enteros escalados

Los valores se generan y comparan como enteros más un exponente (centésimas como `75` con escala `2`), nunca como `number` en coma flotante. `0.1 + 0.2 !== 0.3` en JavaScript, y un niño no puede perder HP por un artefacto de IEEE 754. La conversión fracción ↔ decimal se apoya en `fraction.js`, que ya es dependencia; las fracciones periódicas se excluyen en la generación, no se redondean.

### Tres cubos de leaderboard, derivados de la selección

La categoría se calcula: un solo tema activo → ese tema; más de uno → `mixto`. No es una elección aparte del jugador.

*Alternativa descartada:* segmentar por el conjunto exacto de temas. Es más justo, pero con dos temas ya son tres tablas y con cuatro son quince, cada una con dos niños dentro. La restricción real de este producto es la escasez de jugadores: el diseño tiene que concentrarlos en pocas tablas, no repartirlos.

*Alternativa descartada:* una sola tabla global. El puntaje ya se multiplica por dificultad de timer; sin segmentar por tema, gana quien elija el tema más fácil.

### La migración reconstruye la tabla

SQLite no permite alterar una llave única con `ALTER TABLE`. La migración crea `scores_new` con la llave `(name, question_limit, topic_category)`, copia todas las filas existentes con `topic_category = 'fracciones'`, borra la vieja y renombra. Es la única parte no reversible del cambio.

### BPL DS acotado al chrome

Los componentes nuevos sin animación heredada —los chips de selección de temas y el selector de categoría de la tabla— se construyen siguiendo los patrones y tokens de BPL DS (`https://ds.bepartnerlabs.com/AGENTS.md`): tokens de componente `--<componente>-*`, estado vía ARIA y pseudo-clases en vez de clases toggle, sin estilos inline en esos elementos.

framer-motion se queda: no choca con el DS, anima envolviendo elementos y escribiendo transformaciones, y es responsable de buena parte del carácter del juego.

Tailwind es otra historia. Sí choca con el DS —dos sistemas de utilidades compitiendo por la misma cascada, y tokens duplicados en dos vocabularios— y la intención es sacarlo. Pero migrar las ~2.000 líneas de JSX que hoy dependen de clases Tailwind es un cambio propio, con su propio riesgo visual, y no puede colgar de "agregar decimales".

La regla para este cambio es: **el código nuevo no agrega Tailwind.** Los chips del selector y el selector de categoría se construyen con BPL DS y CSS propio. Así el cambio no aumenta la deuda que la migración futura tendrá que pagar, y de paso sirve de prueba real del DS en dos componentes antes de comprometerse con toda la app.

La frontera de estilo queda: **chrome (Home, tabla, marcador) sigue el DS; pantallas de juego mantienen la estética de arcade**, que es deliberada y es lo que hace que a los niños les guste.

Y una condición que manda sobre ambos lados de esa frontera: **el estilo se mantiene juvenil y moderno, no corporativo.** BPL DS entra como vocabulario de tokens y patrones de CSS, no como paleta ni como tono. En la práctica: los colores saturados, la tipografía display, las sombras duras y el relieve de los botones se conservan remapeando los tokens `--bp-*` hacia la identidad del juego, en vez de adoptar los valores por defecto del DS. Si un componente del DS se ve serio dentro de esta app, se le cambian los tokens — no se cambia la app.

## Risks / Trade-offs

**La migración de `scores` puede perder los récords que a los niños les importan** → Probarla contra una copia local con datos reales (`wrangler d1 migrations apply --local`) y verificar el conteo de filas antes y después; aplicar a remoto solo tras esa verificación.

**La refactorización toca el motor sin producir nada visible** → Es el grueso del riesgo de regresión. Se mitiga con una prueba genérica sobre el registro que corre todos los generadores de todos los temas y valida la forma del `Exercise`, más las pruebas de fracciones que ya existen y deben seguir pasando sin cambios de comportamiento.

**El `payload: unknown` mueve errores del compilador al tiempo de ejecución** → El renderizador de cada tema hace el estrechamiento de tipo en un único punto, junto a los generadores que producen ese payload, de modo que el error queda contenido en la carpeta del tema.

**Partidas encoladas antes del cambio no traen categoría** → Se asumen `fracciones` al reintentarlas, en vez de descartarse. Es la interpretación correcta: en ese momento fracciones era el único tema.

**Dos convenciones de documentación conviviendo** (`docs/superpowers/` y `openspec/`) → Los documentos viejos describen trabajo ya implementado; no se migran y no se actualizan.

## Migration Plan

1. Migración `0007` aplicada en local, verificando que el conteo de filas de `scores` se conserva y que todas quedan como `fracciones`.
2. Despliegue del Worker con validación de `topicCategory` tolerante: cualquier valor desconocido cae a `fracciones`, de modo que un cliente viejo siga funcionando contra el servidor nuevo.
3. Despliegue del front.

*Rollback:* revertir el Worker y el front es inmediato. La migración de datos no se revierte; por eso el paso 1 es el que decide si se sigue.

## Open Questions

- Regla de desempate y prioridad si en el futuro se agregan temas que compartan familias de ejercicios con fracciones (por ejemplo, comparar aparece en ambos temas).
- Si `mixto` debe exigir un mínimo de preguntas por tema para evitar que una sesión "mixta" salga casi toda de un solo tema por azar.
