# tema-algebra Specification

## Purpose
TBD - created by archiving change add-tema-algebra. Update Purpose after archive.
## Requirements
### Requirement: El tema álgebra existe en el registro

El registro de temas SHALL incluir un tema `algebra`, con el mismo contrato que los demás: generadores indexados por tipo, un componente de render, y textos de enunciado y pista en español. El tema SHALL quedar disponible en el selector y en la generación de ejercicios sin modificar las pantallas de juego.

#### Scenario: El tema aparece para el jugador

- **WHEN** el jugador abre la pantalla inicial
- **THEN** álgebra aparece como un tema más que puede activar, junto a fracciones y decimales

#### Scenario: Sesión solo de álgebra

- **WHEN** el jugador activa únicamente álgebra y empieza una partida
- **THEN** todas las preguntas salen de los generadores de álgebra

#### Scenario: El tema hereda la verificación del contrato

- **WHEN** se ejecuta la prueba que recorre todos los generadores de todos los temas registrados
- **THEN** los generadores de álgebra quedan cubiertos sin escribir una prueba nueva para ese recorrido

### Requirement: Notación algebraica del libro

Las expresiones SHALL escribirse con la notación del libro del alumno. Un producto SHALL yuxtaponerse **solo cuando el número va delante de la variable** (`3x`, `9b`, `12b`, `5a`), y SHALL escribirse con **punto medio** en cualquier otro caso: variable delante de número (`x · 2`), variable por variable (`a · x`, `x · x`) y número por número (`5 · 8`). Ambas formas SHALL poder convivir en una misma expresión.

Cuando una pregunta contraste las cuatro operaciones sobre los mismos dos operandos (`4 + s`, `4 − s`, `4 · s`, `4 : s`), la multiplicación SHALL escribirse con punto medio aunque el número vaya delante: yuxtaponer ahí rompería el paralelismo de las opciones y delataría cuál es la de multiplicar.

El coeficiente 1 SHALL omitirse (`x`, no `1x`). La resta SHALL usar el signo menos (`−`) y no el guion del teclado. Los signos `×` y `*` SHALL NOT aparecer nunca. La división SHALL escribirse con dos puntos (`24 : 6`).

La regla SHALL vivir en un único punto del tema, de modo que ajustarla sea un cambio localizado.

#### Scenario: Coeficiente y variable

- **WHEN** un ejercicio muestra el triple de un número aumentado en nueve
- **THEN** la expresión se lee `3x + 9`, sin punto ni aspa entre el 3 y la x

#### Scenario: Producto de dos variables

- **WHEN** un ejercicio combina un coeficiente con un producto de variables
- **THEN** la expresión se lee `9b + a · b`, con el punto medio solo entre las dos variables

#### Scenario: La variable va delante del número

- **WHEN** una expresión multiplica una variable por un número en ese orden
- **THEN** se lee `x · 2` y no `x2`, que sería ilegible

#### Scenario: Ninguna expresión usa aspa

- **WHEN** se recorren todas las expresiones que producen los generadores del tema
- **THEN** ninguna contiene `×` ni `*`

### Requirement: Patrón de formación de una secuencia numérica

El tema SHALL ofrecer ejercicios donde, dada una secuencia numérica, el jugador identifica el patrón de formación entre opciones. Los patrones SHALL incluir los aditivos (sumar o restar una cantidad fija) y los multiplicativos (multiplicar o dividir por una cantidad fija). Las opciones incorrectas SHALL ser patrones plausibles y no valores al azar.

#### Scenario: Patrón aditivo

- **WHEN** se muestra la secuencia 18, 27, 36, 45, 54, 63
- **THEN** la respuesta correcta es sumar 9, y entre las opciones aparecen operaciones del mismo estilo sobre el mismo número

#### Scenario: Patrón multiplicativo

- **WHEN** se muestra la secuencia 20, 40, 80, 160, 320
- **THEN** la respuesta correcta es multiplicar por 2, y sumar 20 figura como distractor por ser el error habitual en los dos primeros términos

### Requirement: Completar una secuencia

El tema SHALL ofrecer ejercicios donde falta un término de la secuencia y el jugador elige cuál es. El término faltante SHALL poder estar al final o en medio de la secuencia mostrada.

#### Scenario: Falta el término siguiente

- **WHEN** se muestra 12, 17, 22, 27, y se pregunta por el que sigue
- **THEN** la respuesta correcta es 32

#### Scenario: Falta un término intermedio

- **WHEN** se muestra 150, 135, ?, 105, 90
- **THEN** la respuesta correcta es 120

### Requirement: Determinar un término lejano

El tema SHALL ofrecer ejercicios que pidan un término lejano de una secuencia —del orden del vigésimo o del centésimo— de modo que no se pueda resolver contando término a término. El enunciado SHALL nombrar la posición en ordinal, como lo hace el libro.

#### Scenario: Término lejano de una secuencia aditiva

- **WHEN** se muestra 16, 19, 22, 25, 28 y se pregunta por el 8.º término
- **THEN** la respuesta correcta es 37

#### Scenario: La pista explica el atajo

- **WHEN** el jugador falla un ejercicio de término lejano
- **THEN** la pista explica cómo llegar a la posición pedida sin escribir todos los términos

### Requirement: Lenguaje algebraico

El tema SHALL ofrecer ejercicios de traducción en las dos direcciones: de una frase en lenguaje natural a la expresión algebraica, y de una expresión algebraica a su lectura en palabras. Las frases SHALL cubrir las formas que usa el libro: doble, triple, mitad, tercera parte, cuarta parte, suma, diferencia, sucesor, antecesor, y "aumentado en" o "disminuido en".

#### Scenario: De la frase a la expresión

- **WHEN** el enunciado dice "la suma de un número y su doble"
- **THEN** la respuesta correcta es `x + 2x`

#### Scenario: De la expresión a la frase

- **WHEN** el enunciado muestra `3x + 9`
- **THEN** la respuesta correcta es "el triple de un número aumentado en nueve unidades"

#### Scenario: Distractores que confunden operación

- **WHEN** se genera un ejercicio de traducción
- **THEN** entre las opciones aparece la confusión habitual —doble por triple, o sumar por restar— y no expresiones sin relación con el enunciado

### Requirement: Valorizar expresiones algebraicas

El tema SHALL ofrecer ejercicios donde se dan los valores de una o dos variables y el jugador calcula el valor de la expresión. Las expresiones SHALL usar coeficientes yuxtapuestos y SHALL poder combinar dos variables distintas.

#### Scenario: Una variable

- **WHEN** el enunciado dice que x = 4 y muestra `3x − 5`
- **THEN** la respuesta correcta es 7

#### Scenario: Dos variables

- **WHEN** el enunciado dice que a = 4 y b = 2, y muestra `9b + a · b`
- **THEN** la respuesta correcta es 26

#### Scenario: Distractor por orden de operaciones

- **WHEN** la expresión combina un producto y una suma
- **THEN** entre las opciones aparece el resultado de operar de izquierda a derecha ignorando la precedencia, que es el error que el ejercicio busca detectar

### Requirement: Las variables no se limitan a x

Los generadores SHALL rotar entre las letras que usa el libro —`x`, `y`, `a`, `b`, `c`, `n`, `s`, `w`, `z`— en lugar de emplear siempre `x`.

#### Scenario: Variedad de letras

- **WHEN** se generan varios ejercicios de valorizar
- **THEN** aparecen expresiones con letras distintas y no solo con `x`

### Requirement: La dificultad crece con la ronda

La dificultad SHALL derivarse únicamente del número de ronda, como en los demás temas. Las rondas iniciales SHALL usar patrones aditivos con números pequeños y expresiones de una variable; las rondas avanzadas SHALL habilitar patrones multiplicativos, términos lejanos y expresiones de dos variables.

#### Scenario: Primeras rondas

- **WHEN** se genera un ejercicio en la ronda 1
- **THEN** no aparecen expresiones de dos variables ni términos más allá del décimo

#### Scenario: Rondas avanzadas

- **WHEN** se genera un ejercicio en una ronda alta
- **THEN** pueden aparecer patrones multiplicativos y términos lejanos

### Requirement: Balanzas para ecuaciones e inecuaciones

El tema SHALL presentar ecuaciones e inecuaciones con una balanza de dos platillos, como hace el libro. La balanza SHALL mostrar las pesas de cada platillo —una de ellas con la incógnita— y SHALL indicar con la inclinación del travesaño y la posición del fiel si está en equilibrio o si un lado pesa más. El estado de la balanza SHALL NOT anunciarse con texto: escribir «mayor que» junto al dibujo regalaría la respuesta.

#### Scenario: Balanza en equilibrio

- **WHEN** el ejercicio plantea una ecuación
- **THEN** los dos platillos se dibujan a la misma altura y el fiel aparece centrado

#### Scenario: Balanza inclinada

- **WHEN** el ejercicio plantea una inecuación
- **THEN** el platillo del lado que pesa más se dibuja más abajo, y el fiel se desplaza hacia ese lado

#### Scenario: Sin texto que delate

- **WHEN** se muestra cualquier balanza
- **THEN** el dibujo no incluye las palabras «mayor», «menor», «igual» ni los signos `<`, `>` o `=`

### Requirement: Plantear la ecuación de una balanza

El tema SHALL ofrecer ejercicios donde, dada una balanza en equilibrio, el jugador elige entre varias la ecuación que la representa. Los distractores SHALL ser ecuaciones construidas con los mismos números, cambiando de lado un término o la operación, y SHALL NOT ser ecuaciones con números que no aparecen en el dibujo.

#### Scenario: Ecuación de una balanza

- **WHEN** un platillo tiene una pesa de 12 g junto a la incógnita y el otro una de 23 g
- **THEN** la respuesta correcta es `x + 12 = 23`

#### Scenario: Distractores del mismo dibujo

- **WHEN** se generan las opciones
- **THEN** todas usan únicamente los números que aparecen en la balanza

### Requirement: Resolver una ecuación

El tema SHALL ofrecer ecuaciones de un paso para hallar el valor de la incógnita. La incógnita SHALL aparecer unas veces a la izquierda y otras a la derecha del igual, como en el libro (`25 = x − 56`). El enunciado SHALL poder incluir términos que se agrupan antes de resolver (`24 + y + 2 = 54`). La solución SHALL ser siempre un entero no negativo.

#### Scenario: Incógnita a la izquierda

- **WHEN** el ejercicio muestra `72 + x = 180`
- **THEN** la respuesta correcta es 108

#### Scenario: Incógnita a la derecha

- **WHEN** el ejercicio muestra `25 = x − 56`
- **THEN** la respuesta correcta es 81

#### Scenario: Distractor por operar al revés

- **WHEN** la ecuación es una suma
- **THEN** entre las opciones aparece el resultado de sumar en vez de restar, que es el error que el ejercicio busca detectar

### Requirement: Desigualdades entre expresiones

El tema SHALL ofrecer ejercicios donde el jugador completa con `<`, `>` o `=` entre dos expresiones numéricas. Los pares SHALL poder resolverse comparando las partes en vez de calculando ambos lados por completo, que es la propiedad que enseña el libro.

#### Scenario: Comparar sin calcular del todo

- **WHEN** el ejercicio muestra `7 + 25` y `5 + 22`
- **THEN** la respuesta correcta es `>`, y se puede ver comparando 7 con 5 y 25 con 22

#### Scenario: Dos expresiones iguales

- **WHEN** las dos expresiones valen lo mismo
- **THEN** `=` está entre las opciones y es la respuesta correcta

### Requirement: Plantear e interpretar inecuaciones

El tema SHALL ofrecer tres formas de trabajar una inecuación: elegir la que representa una balanza inclinada, hallar el **menor natural** que la satisface, y señalar cuál de varios números **no** la satisface. Los valores SHALL mantenerse en los naturales incluyendo el cero.

#### Scenario: Inecuación de una balanza inclinada

- **WHEN** el platillo con la incógnita y una pesa de 8 g pesa menos que el otro con 14 g
- **THEN** la respuesta correcta es `x + 8 < 14`

#### Scenario: El menor natural que la cumple

- **WHEN** el ejercicio muestra `x + 12 > 25`
- **THEN** la respuesta correcta es 14, y 13 figura entre las opciones por ser el error de quien resuelve la igualdad y se queda ahí

#### Scenario: El número que no la satisface

- **WHEN** el ejercicio pide cuál de varios números **no** cumple `x < 24`
- **THEN** la respuesta correcta es el único que no la cumple, y el enunciado deja claro que se busca el que falla

