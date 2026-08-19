## Why

El tema `algebra` cubre hoy patrones, secuencias, lenguaje algebraico y valorizar. Falta la otra mitad de la Unidad 4: **ecuaciones, desigualdades e inecuaciones**, que el libro desarrolla en cuatro lecciones (pp. 80-87) y que en su evaluación final son **8 de las 18 preguntas**. Es el hueco más grande que queda para la prueba trimestral del 3 de septiembre de 2026.

El libro no las presenta solo con símbolos: las introduce con **balanzas de pesas**, donde una pesa lleva `x` y el fiel muestra si los platillos están en equilibrio o inclinados. Ese es el modelo mental que la profesora está enseñando, y es también lo que hace que este cambio no fuera parte del anterior: pide un dibujo que no existe.

## Open Questions & Assumptions

- Q: ¿Hace falta la balanza o basta con la ecuación escrita? → **Supuesto:** hace falta. Dos preguntas de la evaluación final (11 y 12) muestran una balanza y piden elegir la ecuación o la inecuación que representa. Sin el dibujo esas preguntas no se pueden practicar, y son las que enseñan *por qué* se resuelve así.
- Q: ¿Qué ecuaciones entran? → **Supuesto:** las del libro, de un solo paso o con términos que se agrupan primero: `72 + x = 180`, `x − 14 = 48`, `25 = x − 56`, `2 + x − 2 = 8`, `24 + y + 2 = 54`. **Sin** coeficiente delante de la incógnita salvo donde el libro lo usa (`2x = 15` aparece como opción en la pregunta 14), y nunca con la incógnita en los dos lados.
- Q: ¿La incógnita siempre a la izquierda? → **Supuesto:** no. El libro escribe `25 = x − 56` y `55 = 5 + x`, y un niño que solo vio la incógnita a la izquierda se traba con eso. Los generadores alternan el lado.
- Q: ¿Qué se pide en una inecuación? → **Supuesto:** tres cosas distintas, como el libro: qué valores la satisfacen, cuál es el **menor natural** que la cumple (pregunta 16), y cuál de unos números dados **no** la satisface (pregunta 15). La tercera es la que caza al que resuelve sin comprobar.
- Q: ¿Se usan negativos o fracciones? → **Supuesto:** no. El libro trabaja con `x ∈ ℕ₀`; los resultados se mantienen enteros y no negativos, igual que en el resto del tema.
- Q: ¿Cómo se dibuja el fiel de la balanza? → **Supuesto:** con la inclinación del travesaño y la posición del fiel, no con texto. Una balanza que dijera «mayor que» al lado sería una pista regalada.

## Alternatives Considered

1. **Extender el tema `algebra` con generadores y un `Render` de balanza** (recomendado): el niño activa un solo tema y practica toda la unidad, como la prueba se la va a tomar. Trade-off: el tema crece a trece generadores y su `Render` gana una rama grande.
2. **Un tema `ecuaciones` aparte**: deja elegir con más precisión y mantiene los archivos pequeños. Trade-off: contradice al libro, que lo enseña como una unidad; obliga a marcar dos casillas para practicar lo que entra en una sola prueba; y fragmenta más la tabla de posiciones, que ya sufre de escasez de jugadores.
3. **Ecuaciones sin balanza, solo simbólicas**: entra en la mitad de tiempo. Trade-off: deja fuera las dos preguntas de la evaluación que empiezan por el dibujo, que son justo las que explican el porqué.

## What Changes

- **Ecuaciones:** elegir la ecuación que representa una balanza, resolver una ecuación de un paso con la incógnita a cualquiera de los dos lados, y elegir qué ecuación representa un enunciado.
- **Desigualdades:** comparar dos expresiones numéricas con `<`, `>` o `=` sin calcular ambos lados del todo, que es la propiedad que el libro enseña.
- **Inecuaciones:** elegir la inecuación que representa una balanza inclinada, encontrar el **menor natural** que la satisface, y detectar cuál de varios números **no** la satisface.
- **Un componente de balanza** que dibuja los platillos, las pesas y el fiel, en equilibrio o inclinado, dentro del estilo arcade del juego.
- Los tipos nuevos se suman al `Render` y a los textos del tema `algebra` existente.

## Capabilities

### New Capabilities
- (ninguna)

### Modified Capabilities
- `tema-algebra`: el tema pasa a cubrir también ecuaciones, desigualdades e inecuaciones, y a mostrar balanzas.

## Impact

- **Código nuevo:** `src/lib/topics/algebra/Balanza.tsx` y su CSS, `src/lib/topics/algebra/ecuacion.ts` con sus pruebas.
- **Código modificado:** `algebra/generators.ts` (seis generadores más), `algebra/Render.tsx`, `algebra/text.ts` y sus pruebas.
- **Sin cambios:** `Game.tsx`, `SoloGame.tsx`, el Worker, el esquema de D1 y la categoría de tabla de posiciones — `algebra` ya existe en las cuatro.
- **Cobertura:** `registry.test.ts` cubre los generadores nuevos con solo registrarlos, y las propiedades de fast-check sobre el contrato ya recorren todos los tipos del tema.
