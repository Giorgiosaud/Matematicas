## Why

Los problemas con enunciado son lo que más se le complica al niño, y el motivo no es la aritmética: **el enunciado no dice qué técnica usar**. Puede resolverse con una fracción, con decimales, con una ecuación o con una inecuación, y decidir cuál es la parte difícil. Cuando ya sabe que "esto es de decimales", el problema deja de ser un problema.

La app hoy no entrena eso. Cada tema anuncia su contenido desde la casilla que el jugador marcó, así que un problema colocado dentro de `decimales` llega con la mitad de la respuesta puesta.

Los dos exámenes finales del libro terminan con problemas de contexto (pp. 70-71 y 90-91), y las fichas los usan de cierre en casi todas las lecciones. Es contenido evaluado y sin cubrir.

## Open Questions & Assumptions

- Q: ¿Los problemas van dentro de cada tema o aparte? → **Supuesto:** aparte, como tema propio. Es la decisión que da sentido al cambio: dentro de `decimales`, marcar la casilla ya revela la técnica y se pierde justo la dificultad que se quiere entrenar.
- Q: ¿Y si el jugador quiere practicar solo problemas de decimales? → **Supuesto:** no se ofrece. Sería volver a regalar la técnica. Si más adelante hace falta, se añade como filtro, no como estructura.
- Q: ¿Catálogo fijo o generado? → **Supuesto:** contextos escritos a mano, **números sorteados en cada aparición**. Un catálogo con números fijos se memoriza a la tercera vez y deja de enseñar; una plantilla que también invente el contexto produce enunciados que suenan a robot. Lo escrito a mano es lo que ninguna plantilla hace bien.
- Q: ¿Qué se pregunta? → **Supuesto:** dos cosas. El resultado, y —en parte de los problemas— **qué operación lo resuelve**. La segunda ataca la dificultad de frente: es literalmente la decisión que se les atraganta.
- Q: ¿Los números sorteados pueden romper el contexto? → **Supuesto:** sí, y hay que impedirlo. Una mochila de 340 kg o un recreo de 90 horas destruyen la credibilidad del enunciado. Cada contexto define sus propios rangos.
- Q: ¿Cuántos hacen falta? → **Supuesto:** al menos cuarenta para empezar, repartidos entre las cuatro técnicas, y que agregar uno sea una entrada más en el catálogo.
- Q: ¿Se dice de qué técnica es al corregir? → **Supuesto:** sí, en la pista y tras fallar. Ocultarla en el enunciado es el ejercicio; ocultarla también en la corrección sería esconder la lección.

## Alternatives Considered

1. **Un tema `problemas` transversal** (recomendado): el jugador no sabe qué técnica le toca, igual que en la prueba. Trade-off: un tema más en el selector y una categoría más en la tabla de posiciones.
2. **Problemas dentro de cada tema existente**: reutiliza los temas y no añade nada al selector. Trade-off: **regala la técnica**, que es exactamente la dificultad a entrenar. Descartado por eso.
3. **Un modo de juego aparte, fuera de los temas**: daría pantalla propia y más espacio al enunciado. Trade-off: obliga a tocar `Game.tsx` y `SoloGame.tsx`, se sale del registro de temas y no se podría mezclar con el resto en una misma partida.

## What Changes

- Nuevo tema **`problemas`** en el registro, con enunciados de contexto que **nunca nombran la técnica**.
- Un **catálogo de contextos escritos a mano** —al menos cuarenta— repartidos entre fracciones, decimales, ecuaciones e inecuaciones, cada uno con sus rangos de números para que el enunciado siga siendo creíble al sortearlos.
- Dos formas de pregunta: **cuál es el resultado** y **qué operación lo resuelve**.
- Distractores construidos con **la operación equivocada** —sumar donde había que restar, usar el total en vez de la diferencia—, que es el error real de quien no supo qué hacer.
- La pista y la corrección **sí** nombran la técnica: ocultarla en el enunciado es el ejercicio, ocultarla al corregir sería esconder la lección.
- Una **quinta categoría de tabla de posiciones**, `problemas`, en cliente y Worker.

## Capabilities

### New Capabilities
- `tema-problemas`: los problemas con enunciado, el catálogo de contextos y la regla de no revelar la técnica.

### Modified Capabilities
- `seleccion-temas`: el selector pasa de tres temas a cuatro y la tabla de posiciones suma su categoría.

## Impact

- **Código nuevo:** `src/lib/topics/problemas/` (catálogo de contextos, generadores, `Render`, textos) y sus pruebas.
- **Código modificado:** `src/lib/topics/index.ts` y `types.ts` (`TopicId`), `src/lib/topicSelection.ts` y `worker/index.ts` (la categoría nueva).
- **Sin cambios:** `Game.tsx`, `SoloGame.tsx`, el esquema de D1. No hace falta migración: `topic_category` es texto y ya está en la llave primaria.
- **Cobertura:** el tema hereda `registry.test.ts` con solo registrarse, y el reparto por turnos ya reparte las preguntas entre los cuatro temas.
