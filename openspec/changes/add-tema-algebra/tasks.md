## 1. Andamiaje del tema y notación

**Files:** Create: `src/lib/topics/algebra/expresion.ts`, `src/lib/topics/algebra/expresion.test.ts`, `src/lib/topics/algebra/index.ts` · Modify: `src/lib/topics/types.ts`, `src/lib/topics/index.ts`
**Interfaces:** `termino(coeficiente: number, variable: string): string` · `producto(...factores: string[]): string` · `formatear(expr: Expr): string`

- [x] 1.1 Escribir las pruebas de `expresion.ts` contra los ejemplos textuales del libro: `3x + 9`, `9b`, `a + 12b`, `9c + 3a`, `a · b`, `x · x`, `4 · s`, y el caso mixto `9b + a · b`. Incluir una prueba que falle si aparece `×` o `*`.
- [x] 1.2 Implementar `expresion.ts` con la regla mixta: coeficiente junto a variable se yuxtapone; factores sueltos van con punto medio. Coeficiente 1 se omite (`x`, no `1x`).
- [x] 1.3 Sumar `'algebra'` a `TopicId` en `types.ts`.
- [x] 1.4 Crear `algebra/index.ts` con el objeto `Topic` y registrarlo en `topics/index.ts`. Verificar que `registry.test.ts` sigue verde con el tema vacío antes de agregar generadores.

## 2. Secuencias numéricas

**Files:** Create: `src/lib/topics/algebra/secuencia.ts`, `src/lib/topics/algebra/secuencia.test.ts` · Modify: `src/lib/topics/algebra/generators.ts`, `src/lib/topics/algebra/generators.test.ts`
**Interfaces:** `terminos(sec: Secuencia, cantidad: number): number[]` · `termino(sec: Secuencia, posicion: number): number` · `describirPatron(sec: Secuencia): string`

- [x] 2.1 Escribir las pruebas de `secuencia.ts`: términos de una secuencia aditiva y de una multiplicativa, término lejano sin enumerar, y que un paso negativo o una división produzcan enteros (nada de decimales sueltos en una unidad que aún no los mezcla).
- [x] 2.2 Implementar `secuencia.ts` con la secuencia como dato (`inicio`, `paso`, `operacion`).
- [x] 2.3 Escribir las pruebas del generador **patrón de formación**: la respuesta correcta describe el patrón real y los distractores son patrones plausibles sobre el mismo número, no valores al azar.
- [x] 2.4 Implementar el generador de patrón de formación.
- [x] 2.5 Escribir las pruebas del generador **completar secuencia**, cubriendo el término faltante al final y en medio.
- [x] 2.6 Implementar el generador de completar secuencia.
- [x] 2.7 Escribir las pruebas del generador **término lejano**: la posición pedida SHALL estar lo bastante lejos como para no resolverse contando, y el enunciado nombra la posición en ordinal.
- [x] 2.8 Implementar el generador de término lejano, con la pista explicando el atajo.
- [x] 2.9 Escribir las pruebas del generador **construir la secuencia** a partir de primer término más patrón descrito.
- [x] 2.10 Implementar el generador de construir la secuencia.

## 3. Lenguaje algebraico y valorizar

**Files:** Modify: `src/lib/topics/algebra/generators.ts`, `src/lib/topics/algebra/generators.test.ts` · Create: `src/lib/topics/algebra/frases.ts`, `src/lib/topics/algebra/frases.test.ts`
**Interfaces:** `frase(expr: Expr): string` · `evaluar(expr: Expr, valores: Record<string, number>): number`

- [x] 3.1 Escribir las pruebas de `frases.ts` con las redacciones textuales del libro: doble, triple, mitad, tercera parte, cuarta parte, suma, diferencia, sucesor, antecesor, aumentado en, disminuido en.
- [x] 3.2 Implementar `frases.ts`, reutilizando `expresion.ts` para el lado algebraico.
- [x] 3.3 Escribir las pruebas del generador **de la frase a la expresión**, con distractores que confundan operación (doble por triple, sumar por restar).
- [x] 3.4 Implementar ese generador.
- [x] 3.5 Escribir las pruebas del generador **de la expresión a la frase**.
- [x] 3.6 Implementar ese generador.
- [x] 3.7 Escribir las pruebas de `evaluar` y del generador **valorizar**: una y dos variables, y un distractor por orden de operaciones. Incluir la prueba de que **ninguna opción se repite** cuando el distractor por precedencia coincide con la respuesta.
- [x] 3.8 Implementar `evaluar` y el generador de valorizar.
- [x] 3.9 Comprobar que las letras rotan y no siempre sale `x`.

## 4. Presentación

**Files:** Create: `src/lib/topics/algebra/Render.tsx`, `src/lib/topics/algebra/Render.css`, `src/lib/topics/algebra/text.ts` · Modify: `src/components/TopicSelector.tsx` si hiciera falta
**Interfaces:** `Render(props: ExerciseRenderProps)` · `describe(e: Exercise): string` · `hint(e: Exercise): string`

- [x] 4.1 Escribir `text.ts` con los enunciados y pistas en español, siguiendo la redacción del libro. Va aparte del `Render` para no romper fast refresh, igual que en fracciones y decimales.
- [x] 4.2 Implementar la **tira de secuencia**: términos en fila con el `?` amarillo en el término preguntado, envolviendo en vez de hacer scroll horizontal, y `…` antes de la pregunta cuando el término pedido es lejano.
- [x] 4.3 Implementar la **tarjeta de expresión**, con la sustitución de variables encima y números tabulares.
- [x] 4.4 Escribir `Render.css` siguiendo BPL DS como en `TopicSelector.css` —tokens nombrados por la propiedad, resolutores privados con `--_`—. **Sin Tailwind nuevo.**
- [x] 4.5 Verificar que el chip de álgebra aparece en el selector y que la selección persiste entre recargas.
- [x] 4.6 Verificación visual con la skill `run`: jugar una partida solo de álgebra en el navegador y revisar los tres formatos —tira, tira con `…`, tarjeta— en ancho de teléfono y de escritorio. Confirmar que ninguna expresión muestra `×` ni `*`.

## 5. Categoría de tabla de posiciones

**Files:** Modify: `src/lib/topicSelection.ts`, `src/lib/topicSelection.test.ts`, `worker/index.ts`, `worker/index.test.ts`

- [x] 5.1 Escribir las pruebas: `topicCategory(['algebra'])` es `'algebra'`; combinada con cualquier otro tema es `'mixto'`; y `readTopicCategory('algebra')` en el Worker devuelve `'algebra'` en vez de caer a `'fracciones'`.
- [x] 5.2 Sumar `'algebra'` a `TopicCategory` en el cliente y a `TOPIC_CATEGORIES` en el Worker.
- [x] 5.3 Comprobar contra el Worker corriendo que una partida de álgebra queda en su tabla y no aparece en las otras tres.

## 6. Tips del tema — movido al roadmap

Se descarta de este cambio. Un campo `tips` sin pantalla que lo muestre es
contenido que nadie lee, y la pantalla no cabe antes del 3 de septiembre sin
comerse el tiempo de ecuaciones e inecuaciones, que pesan mucho más en la
prueba. Las pistas de cada ejercicio ya explican en el momento del error, que
es donde el niño está mirando. Anotado en `openspec/roadmap.md`.

## 7. Cierre

- [x] 7.1 Verificación con evidencia (skill `verification-before-completion`): `pnpm vitest run`, `pnpm lint` y `pnpm build` en verde, pegando la salida real.
- [x] 7.2 Revisión del diff completo. **Hecha a mano, no con la skill `requesting-code-review`**: esa skill despacha subagentes y en esta sesión no estaban autorizados. Queda anotado por si se quiere repetir con la skill.
- [x] 7.3 Actualizar `CLAUDE.md`: el registro pasa a tener tres temas y la tabla de posiciones cuatro categorías.
- [x] 7.4 Desplegar. **Corrección:** la tarea decía «primero el Worker y después el front», y eso era un error de concepto. El Worker y los assets van en el mismo `wrangler deploy`, es un despliegue atómico y no se pueden separar. Tampoco hace falta: un cliente viejo en caché manda categorías que el Worker nuevo sigue aceptando. Desplegado el 18-ago-2026, versión `e89b47ad`, con `algebra` respondiendo en la tabla de posiciones.
- [x] 7.5 Anotar en `openspec/roadmap.md` lo que queda fuera: ecuaciones e inecuaciones con balanza, secuencias de figuras, y la pantalla Aprende.
- [ ] 7.6 `openspec validate add-tema-algebra` y luego `openspec archive add-tema-algebra`.
