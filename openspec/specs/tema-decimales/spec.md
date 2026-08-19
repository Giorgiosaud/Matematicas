# tema-decimales Specification

## Purpose
TBD - created by archiving change add-decimals-topic-registry. Update Purpose after archive.
## Requirements
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

### Requirement: Leer y escribir decimales

El tema SHALL ofrecer ejercicios que conecten el número con su nombre en español, en ambas direcciones: dado un decimal escrito en cifras, elegir cómo se lee; y dado un decimal escrito en palabras, elegir su forma en cifras. La lectura SHALL usar el vocabulario de posición en español —décimas, centésimas, milésimas— y la coma decimal, no el punto.

#### Scenario: De cifras a palabras

- **WHEN** se presenta `0.3` y se pregunta cómo se lee
- **THEN** la respuesta correcta es «tres décimas»

#### Scenario: De palabras a cifras

- **WHEN** se presenta «veinticinco centésimas» y se pide escribirlo
- **THEN** la respuesta correcta es `0,25`

#### Scenario: Número con parte entera

- **WHEN** se presenta `3,4`
- **THEN** la respuesta correcta es «tres enteros y cuatro décimas» — la lectura por posición, que es la que practica el vocabulario del tema — y las demás opciones no son lecturas válidas del mismo número

#### Scenario: Distractores que reflejan el error típico

- **WHEN** se genera un ejercicio de lectura
- **THEN** entre las opciones aparece la lectura de la posición vecina —por ejemplo «tres centésimas» para `0.3`— porque confundir décimas con centésimas es el error que el ejercicio busca detectar

### Requirement: Progresión de dificultad por ronda

La dificultad de los ejercicios de decimales SHALL crecer con la ronda: primero una cifra decimal y valores claramente distintos entre sí, y en rondas avanzadas más cifras decimales y valores más parecidos entre sí.

#### Scenario: Ronda inicial

- **WHEN** se genera un ejercicio de comparación en la primera ronda
- **THEN** los decimales tienen una sola cifra decimal

#### Scenario: Ronda avanzada

- **WHEN** se genera un ejercicio de comparación en una ronda avanzada
- **THEN** los decimales pueden tener hasta tres cifras y diferenciarse solo en la última

