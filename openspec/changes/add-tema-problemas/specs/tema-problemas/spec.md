## ADDED Requirements

### Requirement: El enunciado nunca revela la técnica

Un problema SHALL presentar únicamente la situación y la pregunta. El enunciado SHALL NOT nombrar la técnica que lo resuelve ni contener las palabras «fracción», «decimal», «ecuación», «inecuación», «incógnita» ni «desigualdad». Decidir qué hacer es el ejercicio; decirlo lo anula.

El tema SHALL NOT ofrecer al jugador la opción de filtrar los problemas por técnica, por el mismo motivo.

#### Scenario: Un enunciado cualquiera

- **WHEN** se muestra un problema
- **THEN** el texto describe una situación y hace una pregunta, sin mencionar con qué se resuelve

#### Scenario: Ninguno se delata

- **WHEN** se recorren todos los contextos del catálogo con cualquier sorteo de números
- **THEN** ninguno de sus enunciados contiene el nombre de una técnica

### Requirement: Catálogo de contextos escritos a mano

Los contextos SHALL estar escritos a mano y SHALL cubrir las cuatro técnicas del temario: fracciones, decimales, ecuaciones e inecuaciones. El catálogo SHALL tener al menos cuarenta contextos, y agregar uno SHALL ser una entrada más en el catálogo, sin tocar los generadores.

Cada contexto SHALL declarar de qué técnica es. Ese dato SHALL usarse solo para comprobar la cobertura y para redactar la pista, y SHALL NOT llegar nunca al enunciado.

#### Scenario: Las cuatro técnicas están representadas

- **WHEN** se agrupan los contextos del catálogo por técnica
- **THEN** las cuatro tienen al menos un contexto, y ninguna concentra más de la mitad

#### Scenario: Agregar un contexto

- **WHEN** se añade una entrada al catálogo
- **THEN** entra en el sorteo sin modificar los generadores ni el `Render`

### Requirement: Los números se sortean sin romper la situación

Los números de un problema SHALL sortearse en cada aparición, para que la respuesta no se pueda memorizar. Cada contexto SHALL declarar sus propios rangos, de modo que la situación siga siendo creíble: una mochila no puede pesar trescientos kilos ni un recreo durar noventa horas.

El resultado SHALL quedar dentro de lo que el niño ya sabe: entero o decimal de hasta tres cifras, nunca negativo, y las fracciones con denominadores del temario.

#### Scenario: Dos apariciones del mismo contexto

- **WHEN** el mismo contexto sale dos veces
- **THEN** los números son distintos y la respuesta también

#### Scenario: Magnitudes creíbles

- **WHEN** se genera cualquier problema del catálogo muchas veces
- **THEN** todas las cantidades quedan dentro del rango que su contexto declara

#### Scenario: Resultado dentro del temario

- **WHEN** se resuelve cualquier problema generado
- **THEN** el resultado no es negativo y no tiene más de tres cifras decimales

### Requirement: Se pregunta el resultado o la operación

El tema SHALL ofrecer dos formas de pregunta: **cuál es el resultado** y **qué operación lo resuelve**. La segunda ataca de frente la dificultad, que es decidir qué hacer con los datos.

Cuando la respuesta lleve unidad, todas las opciones SHALL llevar la misma unidad: una opción sin unidad, o con otra, se descartaría sin resolver el problema.

#### Scenario: Preguntar el resultado

- **WHEN** el problema pide cuánto pesan los libros de una mochila
- **THEN** las opciones son cantidades con la misma unidad y una de ellas es la correcta

#### Scenario: Preguntar la operación

- **WHEN** el problema pide qué operación lo resuelve
- **THEN** las opciones son operaciones planteadas con los números del enunciado, y solo una corresponde a la situación

### Requirement: Los distractores son la operación equivocada

Las opciones incorrectas SHALL construirse aplicando la operación que no era —sumar donde había que restar, usar el total en lugar de la diferencia, repartir en vez de multiplicar—. SHALL NOT ser cantidades al azar: quien falla un problema de contexto falla eligiendo mal la operación, y una opción que nadie elegiría no enseña nada.

#### Scenario: Restar cuando había que sumar

- **WHEN** el problema se resuelve con una resta
- **THEN** entre las opciones aparece el resultado de haber sumado

#### Scenario: Ninguna opción es un número suelto

- **WHEN** se generan las opciones de cualquier problema
- **THEN** todas se obtienen operando con los números del enunciado

### Requirement: La corrección sí nombra la técnica

La pista y la explicación tras fallar SHALL decir con qué se resuelve el problema y por qué. Ocultar la técnica en el enunciado es el ejercicio; ocultarla también al corregir sería esconder la lección.

#### Scenario: Pista de un problema de decimales

- **WHEN** el jugador falla un problema que se resuelve restando decimales
- **THEN** la pista explica que hay que restar y que conviene alinear las comas
