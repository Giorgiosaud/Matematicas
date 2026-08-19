## 1. Ecuaciones como dato

**Files:** Create: `src/lib/topics/algebra/ecuacion.ts`, `src/lib/topics/algebra/ecuacion.test.ts`
**Interfaces:** `ecuacion(izq, der): Ecuacion` · `resolver(ec: Ecuacion): number` · `formatearEcuacion(ec: Ecuacion): string`

- [x] 1.1 Escribir las pruebas: resolver con la incógnita a cada lado, con suma y con resta, y con términos que se agrupan (`24 + y + 2 = 54`). Incluir que la solución sea siempre entera y no negativa.
- [x] 1.2 Implementar `ecuacion.ts` reutilizando `expresion.ts` para el formato, para que la notación siga viviendo en un solo sitio.
- [x] 1.3 Escribir las pruebas de las inecuaciones: menor natural que satisface, y comprobar si un valor dado cumple. Incluir que toda inecuación generada tenga al menos una solución natural.
- [x] 1.4 Implementar la parte de inecuaciones.

## 2. Generadores

**Files:** Modify: `src/lib/topics/algebra/generators.ts`, `src/lib/topics/algebra/generators.test.ts`

- [x] 2.1 Pruebas y generador **ecuacion-balanza**: la respuesta representa la balanza, y todas las opciones usan solo los números del dibujo.
- [x] 2.2 Pruebas y generador **resolver-ecuacion**, alternando el lado de la incógnita, con el distractor de operar al revés.
- [x] 2.3 Pruebas y generador **ecuacion-desde-frase**.
- [x] 2.4 Pruebas y generador **desigualdad**: completar con `<`, `>` o `=`, con pares que se puedan comparar por partes.
- [x] 2.5 Pruebas y generador **inecuacion-balanza**.
- [x] 2.6 Pruebas y generador **menor-natural**, con el valor que resuelve la igualdad como distractor.
- [x] 2.7 Pruebas y generador **no-satisface**, comprobando que **exactamente una** opción incumple la inecuación.

## 3. La balanza

**Files:** Create: `src/lib/topics/algebra/Balanza.tsx`, `src/lib/topics/algebra/Balanza.css` · Modify: `src/lib/topics/algebra/Render.tsx`

- [x] 3.1 Implementar `Balanza.tsx`: dos platillos, sus pesas, el travesaño y el fiel. El estado se expresa con la geometría.
- [x] 3.2 Escribir `Balanza.css` con los tokens del tema y sin Tailwind nuevo. La inclinación con `transform: rotate` sobre el travesaño.
- [x] 3.3 Enganchar la balanza en el `Render` del tema, sacándola a su propio componente y no dentro del `switch`.
- [x] 3.4 Comprobar con una prueba que el dibujo no contiene las palabras «mayor», «menor» ni «igual», ni los signos `<`, `>`, `=`.
- [x] 3.5 Dibujar los **tacos** bajo los platillos en las balanzas en equilibrio, y soltarlos cuando `selectedOption` deja de ser nulo: los tacos salen y el travesaño queda nivelado. La animación dura ~400 ms y **no bloquea** el botón de continuar.
- [x] 3.6 Las balanzas de inecuación aparecen **ya inclinadas y sin tacos**: ahí la inclinación es el enunciado, no la respuesta.
- [ ] 3.7 Comprobar en el navegador que la animación se ve bien también al fallar, y que no retrasa la siguiente pregunta.

## 4. Enunciados y pistas

**Files:** Modify: `src/lib/topics/algebra/text.ts`, `src/lib/topics/algebra/text.test.ts`

- [x] 4.1 Enunciados y pistas de los siete tipos nuevos, en español y con la redacción del libro.
- [x] 4.2 El enunciado de **no-satisface** destaca el «no», o la pregunta acaba midiendo comprensión lectora.
- [x] 4.3 La pista de las ecuaciones dice la regla de la balanza: lo que le quitas a un lado se lo quitas al otro.

## 5. Cierre

- [ ] 5.1 Verificación visual con la skill `run`: jugar una partida solo de álgebra, revisar la balanza en equilibrio y las dos inclinaciones, en ancho de teléfono **y** de escritorio. Que ninguna cifra se solape.
- [ ] 5.2 Verificación con evidencia: `pnpm vitest run`, `pnpm lint` y `pnpm build` en verde, pegando la salida real.
- [ ] 5.3 Actualizar `CLAUDE.md` si el tema cambia de forma.
- [ ] 5.4 Desplegar y comprobar en producción.
- [ ] 5.5 `openspec validate` y `openspec archive`, y mover al roadmap lo que quede pendiente.
