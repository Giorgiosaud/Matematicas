## 1. El catálogo

**Files:** Create: `src/lib/topics/problemas/contextos.ts`, `src/lib/topics/problemas/contextos.test.ts`
**Interfaces:** `Contexto` · `CONTEXTOS: Contexto[]` · `construir(ctx: Contexto): ProblemaGenerado`

- [x] 1.1 Escribir las pruebas del contrato de un contexto: enunciado no vacío, respuesta dentro del temario (no negativa, hasta tres decimales), y **ningún enunciado nombra la técnica**.
- [x] 1.2 Escribir la prueba de rangos: generando cada contexto muchas veces, todas las cantidades caen dentro de lo que declara.
- [x] 1.3 Definir el tipo `Contexto` con sus rangos, su técnica y sus formas de equivocarse.
- [x] 1.4 Escribir los contextos de **decimales**: masas, dinero, medidas, agua caída, tiempos de carrera. Al menos diez.
- [x] 1.5 Escribir los de **fracciones**: repartos, recetas, partes de un total. Al menos diez.
- [x] 1.6 Escribir los de **ecuaciones**: cuánto falta, cuánto había antes, edades. Al menos diez.
- [x] 1.7 Escribir los de **inecuaciones**: cupos, pesos máximos, presupuestos, «como máximo» y «al menos». Al menos diez.
- [x] 1.8 Prueba de cobertura: las cuatro técnicas presentes y ninguna con más de la mitad del catálogo.

## 2. Generadores

**Files:** Create: `src/lib/topics/problemas/generators.ts`, `generators.test.ts`

- [x] 2.1 Pruebas y generador **resultado**: opciones con la misma unidad, y todas obtenidas operando con los números del enunciado.
- [x] 2.2 Pruebas y generador **que-operacion**: las opciones son operaciones planteadas con los números del enunciado y solo una corresponde.
- [x] 2.3 Comprobar que dos apariciones del mismo contexto dan números y respuesta distintos.
- [x] 2.4 Descartar los sorteos que vuelven trivial el problema (una resta que da cero, una fracción que se simplifica sola).

## 3. Presentación

**Files:** Create: `src/lib/topics/problemas/Render.tsx`, `Render.css`, `text.ts` · Modify: `src/lib/topics/index.ts`, `types.ts`

- [x] 3.1 `Render` del enunciado, legible y sin adornos: es un texto que hay que leer entero.
- [x] 3.2 CSS con los tokens del tema y **sin Tailwind nuevo**.
- [x] 3.3 Registrar el tema y sumar `'problemas'` a `TopicId`.
- [x] 3.4 Enunciados y pistas: la pista **sí** nombra la técnica y explica por qué es esa.
- [x] 3.5 Verificación visual con la skill `run` **a 390 px primero**: el enunciado y las opciones tienen que caber sin scroll mientras corre el reloj.

## 4. Categoría de tabla de posiciones

**Files:** Modify: `src/lib/topicSelection.ts`, `worker/index.ts` y sus pruebas

- [x] 4.1 Pruebas: `topicCategory(['problemas'])` es `'problemas'`, combinada es `'mixto'`, y el Worker acepta el valor.
- [x] 4.2 Sumar `'problemas'` a `TopicCategory` y a `TOPIC_CATEGORIES`, **en el mismo cambio**, o los puntajes se archivan bajo otro contenido.

## 5. Cierre

- [x] 5.1 Verificación con evidencia: `pnpm vitest run`, `pnpm lint` y `pnpm build`, pegando la salida real.
- [x] 5.2 Actualizar `CLAUDE.md`: cuatro temas y cinco categorías.
- [ ] 5.3 Fusionar a `main` y dejar que el pipeline despliegue; comprobar en producción.
- [ ] 5.4 `openspec validate` y `openspec archive`, y mover al roadmap lo que quede (problemas de varios pasos).
