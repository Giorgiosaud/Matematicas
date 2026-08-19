## ADDED Requirements

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
