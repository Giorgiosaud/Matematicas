## ADDED Requirements

### Requirement: Precisión numérica sin punto flotante

Los decimales SHALL generarse, compararse y operarse como enteros escalados por una potencia de diez. El sistema SHALL NOT depender de aritmética de punto flotante para decidir si una respuesta es correcta.

#### Scenario: Suma que el punto flotante calcularía mal

- **WHEN** un ejercicio involucra valores como `0.1` y `0.2`
- **THEN** la respuesta correcta es `0.3` y se valida como correcta

#### Scenario: Igualdad entre representaciones distintas

- **WHEN** el jugador enfrenta `0.5` y `0.50`
- **THEN** el sistema los trata como iguales

### Requirement: Comparar decimales

El tema SHALL ofrecer ejercicios que presenten dos decimales y pidan la relación entre ellos, con las opciones `>`, `<` y `=`.

#### Scenario: Comparación con distinta cantidad de cifras

- **WHEN** se presenta `0.7` frente a `0.65`
- **THEN** la respuesta correcta es `>`

#### Scenario: Comparación de iguales

- **WHEN** ambos decimales tienen el mismo valor
- **THEN** la respuesta correcta es `=`

### Requirement: Convertir fracción y decimal

El tema SHALL ofrecer ejercicios de conversión en ambas direcciones: dada una fracción, elegir su decimal; y dado un decimal, elegir su fracción. Las fracciones usadas SHALL tener representación decimal exacta.

#### Scenario: De fracción a decimal

- **WHEN** se presenta `3/4` y se pide su decimal
- **THEN** la respuesta correcta es `0.75` y está entre las opciones

#### Scenario: De decimal a fracción

- **WHEN** se presenta `0.75` y se pide su fracción
- **THEN** la respuesta correcta es `3/4` en su forma simplificada

#### Scenario: Fracciones periódicas excluidas

- **WHEN** se genera un ejercicio de conversión
- **THEN** nunca aparece una fracción cuyo decimal sea periódico, como `1/3`

### Requirement: Redondear y valor posicional

El tema SHALL ofrecer ejercicios que pidan redondear un decimal a una posición dada, y ejercicios que pregunten qué valor representa una cifra dentro del número.

#### Scenario: Redondeo a décimas

- **WHEN** se pide redondear `3.472` a las décimas
- **THEN** la respuesta correcta es `3.5`

#### Scenario: Redondeo con cifra exactamente cinco

- **WHEN** se pide redondear un número cuya cifra siguiente es exactamente `5`
- **THEN** el redondeo es hacia arriba, y esa regla es la misma en todos los ejercicios del tema

#### Scenario: Valor posicional

- **WHEN** se pregunta cuánto vale el `7` en `3.472`
- **THEN** la respuesta correcta corresponde a las centésimas

### Requirement: Progresión de dificultad por ronda

La dificultad de los ejercicios de decimales SHALL crecer con la ronda: primero una cifra decimal y valores claramente distintos entre sí, y en rondas avanzadas más cifras decimales y valores más parecidos entre sí.

#### Scenario: Ronda inicial

- **WHEN** se genera un ejercicio de comparación en la primera ronda
- **THEN** los decimales tienen una sola cifra decimal

#### Scenario: Ronda avanzada

- **WHEN** se genera un ejercicio de comparación en una ronda avanzada
- **THEN** los decimales pueden tener hasta tres cifras y diferenciarse solo en la última
