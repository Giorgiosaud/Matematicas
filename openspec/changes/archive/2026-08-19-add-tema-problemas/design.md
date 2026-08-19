## Context

La app tiene cuatro temas cubriendo las dos unidades de la prueba. Lo que no cubre es el formato que más se le complica al niño: el problema con enunciado.

La dificultad no está en la aritmética. Está en que el enunciado **no dice qué técnica usar**. Puede resolverse restando decimales, con una fracción, planteando una ecuación o con una inecuación, y elegir cuál es el trabajo. Los dos exámenes finales del libro cierran con problemas así, y las fichas los usan al final de casi todas las lecciones.

## Goals / Non-Goals

**Goals:**

- Entrenar la decisión —qué hacer con estos datos—, no la cuenta.
- Que el enunciado llegue igual de mudo que en la prueba.
- Que el catálogo crezca escribiendo contextos, no tocando código.

**Non-Goals:**

- **Filtrar problemas por técnica.** Sería devolver la pista que el cambio existe para quitar.
- **Problemas de varios pasos encadenados.** El libro los tiene, pero con respuesta múltiple y reloj corriendo se vuelven una trampa de lectura. Van al roadmap.
- **Que el jugador escriba la respuesta.** El juego es de opciones; el desarrollo escrito es del cuaderno.

## Decisions

### Tema propio, no una sección dentro de cada tema

Es la decisión que sostiene todo lo demás. Un problema dentro de `decimales` llega anunciado: el jugador marcó esa casilla, así que sabe con qué se resuelve antes de leer. Justo la parte difícil, regalada.

Como tema aparte, el jugador sabe que le toca *un problema* y nada más. Igual que en la prueba.

El coste es una casilla más y una categoría más en la tabla de posiciones. Barato, y el reparto por turnos ya distribuye las preguntas entre los cuatro temas sin tocar nada.

### El catálogo se escribe a mano; los números se sortean

Dos errores opuestos, y el diseño evita los dos.

Un catálogo con números fijos —como el de chistes— se memoriza a la tercera vuelta y deja de enseñar. Con un chiste da igual; con un ejercicio, no.

Una plantilla que además invente el contexto produce enunciados que suenan a robot: «Juan tiene 47 objetos y regala 12». El contexto es lo único que ninguna plantilla hace bien, y es lo que hace que el niño se meta en la situación.

Así que: el contexto lo escribe una persona —la mochila, la feria, el agua caída, el ahorro—, y los números se sortean en cada aparición dentro de los rangos que ese contexto declara.

**Los rangos son parte del contexto, no un detalle.** Una mochila de 340 kg o un recreo de 90 horas rompen la credibilidad y el niño deja de leer el enunciado como una situación. Cada entrada del catálogo dice entre qué valores tienen sentido sus cantidades.

### La técnica se guarda, pero no se enseña

Cada contexto declara de qué técnica es. Ese dato sirve para dos cosas: comprobar en las pruebas que las cuatro están representadas, y redactar la pista.

**No llega nunca al enunciado.** Una prueba recorre el catálogo entero y falla si algún enunciado contiene «fracción», «decimal», «ecuación» o «incógnita».

Al corregir sí se dice: ocultar la técnica en el enunciado es el ejercicio, ocultarla también en la corrección sería esconder la lección.

### Los distractores son la operación equivocada

En el resto de los temas los distractores salen del error de cálculo. Aquí salen del **error de decisión**, que es otro: quien falla un problema de contexto no se equivoca restando, se equivoca eligiendo restar.

Por eso cada contexto declara además cómo se equivoca la gente con él: sumar en vez de restar, quedarse con el total en lugar de la diferencia, repartir cuando había que multiplicar. Esas son las opciones.

### Preguntar la operación, no solo el resultado

Parte de los problemas no piden el número sino **qué operación lo resuelve**. Es la dificultad en estado puro, sin la aritmética de por medio, y da una segunda forma de practicar lo mismo cuando el reloj aprieta.

## Risks / Trade-offs

- **Escribir cuarenta contextos buenos es el trabajo de verdad.** El código es un catálogo y dos generadores; lo que cuesta es que los enunciados suenen a algo que pasa. Si salen flojos, el tema no sirve por mucho que la mecánica funcione.
- **La unidad puede delatar la respuesta.** Si la correcta lleva «kg» y las demás no, se acierta sin leer. Todas las opciones comparten unidad, y hay una prueba que lo comprueba.
- **Los enunciados son largos para una pantalla de teléfono con reloj.** Hay que mirarlo a 390 px desde el principio: si el niño tiene que hacer scroll para leer la pregunta mientras corre el tiempo, el problema mide otra cosa.
- **Sortear números puede volver trivial un problema** —una resta que da cero, una fracción que se simplifica sola—. Cada contexto tiene que descartar esos casos, igual que valorizar descarta los resultados negativos.
