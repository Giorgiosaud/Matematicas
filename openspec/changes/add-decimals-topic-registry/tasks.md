## 1. Generalizar el motor de ejercicios

- [x] 1.1 Escribir la prueba genérica del registro: recorre todos los temas registrados, corre cada generador en varias rondas y verifica la forma del `Exercise` (respuesta incluida en las opciones, mínimo dos opciones, sin duplicados). Debe fallar por ausencia del registro.
- [x] 1.2 Definir el `Exercise` genérico (`topic`, `type`, `answer`, `displayAnswer`, `options`, `payload`) y el contrato de tema en `src/lib/topics/types.ts`.
- [x] 1.3 Mover los seis generadores de fracciones a `src/lib/topics/fracciones/generators.ts`, adaptándolos al `payload`, sin cambiar su comportamiento. Las pruebas existentes de `exercises.test.ts` deben seguir pasando.
- [x] 1.4 Mover el renderizado de fracciones de `ExerciseDisplay.tsx` a `src/lib/topics/fracciones/Render.tsx`, incluyendo el visualizador y las pistas.
- [x] 1.5 Crear `src/lib/topics/index.ts` con el registro, y reescribir `generateExercise(round, topics)` para sortear tema y luego generador. Verificar que 1.1 pasa.
- [x] 1.6 Reducir `ExerciseDisplay.tsx` a despachar al renderizador del tema del ejercicio.
- [x] 1.7 Pasar `config.topics` desde `Game.tsx` y `SoloGame.tsx` al generador. Es el único cambio permitido en esos archivos.
- [ ] 1.8 Verificación visual con la skill `run`: jugar una partida de fracciones y confirmar que se ve y se comporta igual que antes de la refactorización.

## 2. Tema de decimales

- [x] 2.1 Escribir las pruebas del helper de decimales escalados: construcción, comparación, redondeo y conversión desde fracción, incluyendo los casos que el punto flotante calcularía mal (`0.1 + 0.2`, `0.5` vs `0.50`).
- [x] 2.2 Implementar el helper como enteros escalados en `src/lib/topics/decimales/decimal.ts`.
- [x] 2.3 Escribir las pruebas del lector de decimales en español (cifras → palabras y palabras → cifras), incluidas las lecturas con parte entera y los distractores de posición vecina.
- [x] 2.4 Implementar el lector en `src/lib/topics/decimales/lectura.ts`.
- [x] 2.5 Escribir las pruebas de los cuatro generadores según los escenarios de `specs/tema-decimales`, incluida la exclusión de fracciones periódicas y la progresión de dificultad por ronda.
- [x] 2.6 Implementar los generadores: leer/escribir, comparar, convertir fracción ↔ decimal, y redondear / valor posicional.
- [x] 2.7 Implementar `Render.tsx` del tema y registrarlo en el índice. La prueba genérica de 1.1 ahora cubre decimales sin tocarla.
- [x] 2.8 Verificación visual con `run`: jugar una partida solo de decimales y revisar que los enunciados se lean bien en móvil.

## 3. Selección de temas en la interfaz

- [x] 3.1 Consultar `https://ds.bepartnerlabs.com/registry/components.json` e identificar el componente de BPL DS más cercano a un grupo de chips de selección múltiple.
- [x] 3.2 Escribir las pruebas de `Home` según los escenarios de `specs/seleccion-temas`: selección múltiple, botón deshabilitado sin temas, valor por defecto en dispositivo nuevo, persistencia, tema persistido inexistente, almacenamiento local no disponible.
- [x] 3.3 Agregar `topics` a `GameConfig` y persistir la selección junto a los nombres de jugador.
- [x] 3.4 Construir el selector siguiendo BPL DS — tokens `--<componente>-*`, estado con ARIA y pseudo-clases, sin clases toggle — y **sin agregar clases de Tailwind**.
- [x] 3.5 Verificación visual con `run`: comprobar que el selector convive con la estética del Home y que se usa cómodo con el pulgar en un teléfono.

## 4. Leaderboard por categoría de tema

- [x] 4.1 Escribir la migración `migrations/0007_add_topic_category.sql`: crear la tabla nueva con la llave `(name, question_limit, topic_category)`, copiar las filas existentes como `fracciones`, borrar la vieja, renombrar.
- [x] 4.2 Aplicarla en local sobre una copia con datos y verificar el conteo de filas antes y después. **No continuar si no coincide.**
- [x] 4.3 Escribir las pruebas del Worker para la categoría: valor conocido se respeta, valor desconocido cae a `fracciones`, la consulta segmenta por categoría.
- [x] 4.4 Implementar la validación y las consultas en `worker/index.ts`.
- [x] 4.5 Escribir las pruebas de `leaderboardApi` y `scoreQueue`: la submission lleva `topicCategory`, y una entrada encolada sin ese campo se reintenta como `fracciones`.
- [x] 4.6 Implementar el envío de la categoría, derivándola de los temas de la sesión.
- [x] 4.7 Agregar el selector de categoría a `Leaderboard.tsx`, siguiendo BPL DS y sin Tailwind nuevo.
- [ ] 4.8 Verificación visual con `run`: terminar una partida mixta y confirmar que aparece en la tabla `mixto` y no en las otras.

## 5. Cierre

- [ ] 5.1 Verificación con evidencia (skill `verification-before-completion`): `pnpm vitest run`, `pnpm lint` y `pnpm build` en verde, pegando la salida real.
- [ ] 5.2 Revisión de código (skill `requesting-code-review`) sobre el diff completo.
- [ ] 5.3 Actualizar `CLAUDE.md`: el registro de temas sustituye la descripción actual del motor de ejercicios, y la tabla queda segmentada también por categoría.
- [ ] 5.4 Aplicar la migración a remoto y desplegar, en el orden del plan de migración del diseño: base de datos, Worker, front.
- [ ] 5.5 Archivar el cambio con `openspec archive add-decimals-topic-registry` para que las tres capacidades pasen a `openspec/specs/`.
