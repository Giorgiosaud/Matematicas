## ADDED Requirements

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

Las expresiones SHALL escribirse con la notación del libro del alumno, que combina dos reglas: un coeficiente numérico junto a una variable se escribe **yuxtapuesto** (`3x`, `9b`, `12b`, `5a`), y un producto entre factores sueltos —variable por variable, o número por número— se escribe con **punto medio** (`a · b`, `x · x`, `4 · s`). Ambas SHALL poder convivir en una misma expresión. Los signos `×` y `*` SHALL NOT aparecer nunca. La división SHALL escribirse con dos puntos (`24 : 6`).

La regla SHALL vivir en un único punto del tema, de modo que ajustarla sea un cambio localizado.

#### Scenario: Coeficiente y variable

- **WHEN** un ejercicio muestra el triple de un número aumentado en nueve
- **THEN** la expresión se lee `3x + 9`, sin punto ni aspa entre el 3 y la x

#### Scenario: Producto de dos variables

- **WHEN** un ejercicio combina un coeficiente con un producto de variables
- **THEN** la expresión se lee `9b + a · b`, con el punto medio solo entre las dos variables

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
