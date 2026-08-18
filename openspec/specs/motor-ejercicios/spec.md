# motor-ejercicios Specification

## Purpose
TBD - created by archiving change add-decimals-topic-registry. Update Purpose after archive.
## Requirements
### Requirement: Forma genérica del ejercicio

Un ejercicio SHALL exponer únicamente los campos que el juego consume — `topic`, `type`, `answer`, `displayAnswer` y `options` — más un `payload` cuya forma es responsabilidad exclusiva del tema que lo produjo. Ningún componente fuera del tema SHALL leer dentro del `payload`.

#### Scenario: El juego consume un ejercicio sin conocer el tema

- **WHEN** la pantalla de juego recibe un ejercicio de cualquier tema registrado
- **THEN** puede mostrar las opciones, validar la respuesta y calcular puntaje sin ninguna rama condicional por tema

#### Scenario: Un tema nuevo no obliga a tocar la pantalla de juego

- **WHEN** se registra un tema nuevo con sus generadores y su renderizador
- **THEN** `Game.tsx` y `SoloGame.tsx` funcionan con él sin modificación alguna

### Requirement: Contrato del registro de temas

Cada tema SHALL registrarse aportando un identificador estable en kebab-case, una etiqueta en español para la interfaz, al menos un generador de ejercicios y un componente de renderizado que sepa interpretar su propio `payload`. El registro SHALL ser la única fuente de verdad sobre qué temas existen.

#### Scenario: Listado de temas disponibles

- **WHEN** la interfaz necesita ofrecer los temas al jugador
- **THEN** los obtiene del registro, sin listas duplicadas en otros archivos

#### Scenario: Tema incompleto

- **WHEN** un tema se registra sin generadores o sin renderizador
- **THEN** el sistema falla en tiempo de compilación, no en tiempo de ejecución

### Requirement: Generación mezclada entre temas activos

`generateExercise` SHALL recibir la ronda actual y la lista de temas activos, elegir un tema al azar entre los activos y luego un generador al azar dentro de ese tema. La dificultad SHALL derivarse de la ronda de forma independiente en cada tema.

#### Scenario: Sesión con varios temas

- **WHEN** el jugador activó fracciones y decimales
- **THEN** las preguntas de la sesión salen mezcladas de ambos temas

#### Scenario: Sesión con un solo tema

- **WHEN** el jugador activó únicamente decimales
- **THEN** todas las preguntas de la sesión son de decimales

#### Scenario: Lista de temas vacía

- **WHEN** `generateExercise` recibe una lista de temas vacía
- **THEN** genera el ejercicio usando el tema de fracciones, en lugar de fallar

### Requirement: Validez de las opciones

Todo ejercicio generado SHALL incluir la respuesta correcta entre sus opciones, SHALL ofrecer al menos dos opciones, y SHALL NOT contener opciones repetidas.

#### Scenario: Cualquier generador de cualquier tema

- **WHEN** se genera un ejercicio con cualquier generador registrado, en cualquier ronda
- **THEN** sus opciones contienen exactamente una vez la respuesta correcta y no tienen duplicados

