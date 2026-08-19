# seleccion-temas Specification

## Purpose
TBD - created by archiving change add-decimals-topic-registry. Update Purpose after archive.
## Requirements
### Requirement: Selector de temas en la pantalla inicial

La pantalla inicial SHALL presentar los temas del registro como una selección múltiple, y SHALL exigir al menos un tema activo para poder empezar una partida. Aplica por igual al modo de práctica solo y al de dos jugadores.

Un dispositivo nuevo SHALL arrancar con **todos** los temas marcados. Con tres temas registrados, arrancar solo en fracciones dejaría fuera por defecto justo el contenido que el jugador está estudiando; quien quiera concentrarse en uno desmarca los demás.

#### Scenario: Selección de varios temas

- **WHEN** el jugador marca fracciones y decimales
- **THEN** puede empezar la partida y las preguntas salen de ambos temas

#### Scenario: Ningún tema marcado

- **WHEN** el jugador desmarca todos los temas
- **THEN** el botón de empezar queda deshabilitado, con un mensaje en español que explica que debe elegir al menos un tema

#### Scenario: Estado inicial en un dispositivo nuevo

- **WHEN** un jugador abre la app por primera vez
- **THEN** aparecen todos los temas marcados

### Requirement: La selección se recuerda entre sesiones

La selección de temas SHALL persistir localmente en el dispositivo y restaurarse en la siguiente sesión, junto con los nombres de los jugadores que ya se guardan. Una selección persistida inválida SHALL NOT impedir jugar.

#### Scenario: Regreso a la app

- **WHEN** el jugador vuelve a abrir la app tras haber jugado con decimales marcado
- **THEN** decimales aparece marcado sin que tenga que volver a elegirlo

#### Scenario: Tema persistido que ya no existe

- **WHEN** la selección guardada nombra un tema ausente del registro
- **THEN** ese tema se ignora, y si no queda ninguno válido se vuelve a fracciones

#### Scenario: Almacenamiento local no disponible

- **WHEN** el almacenamiento local falla o está bloqueado
- **THEN** la app arranca con la selección por defecto y el juego funciona con normalidad

### Requirement: Categoría de tema de una partida

Cada partida SHALL clasificarse en exactamente una categoría: la del tema practicado cuando la sesión usó uno solo —`fracciones`, `decimales`, `algebra` o `problemas`— y `mixto` cuando combinó más de uno. La categoría SHALL derivarse de la selección, sin que el jugador la elija aparte. El conjunto de categorías SHALL mantenerse alineado entre el cliente y el servidor: un tema que exista en el registro y no tenga categoría propia en el servidor haría que sus puntajes se archivaran bajo otro contenido.

#### Scenario: Sesión de un solo tema

- **WHEN** la partida se jugó únicamente con decimales
- **THEN** su categoría es `decimales`

#### Scenario: Sesión solo de álgebra

- **WHEN** la partida se jugó únicamente con álgebra
- **THEN** su categoría es `algebra`, y el servidor la acepta en vez de archivarla como `fracciones`

#### Scenario: Sesión solo de problemas

- **WHEN** la partida se jugó únicamente con problemas
- **THEN** su categoría es `problemas`, y el servidor la acepta

#### Scenario: Sesión combinada

- **WHEN** la partida se jugó con fracciones y decimales
- **THEN** su categoría es `mixto`

#### Scenario: Sesión combinada que incluye álgebra

- **WHEN** la partida se jugó con decimales y álgebra
- **THEN** su categoría es `mixto`, igual que cualquier otra combinación

### Requirement: Tabla de posiciones segmentada por categoría

La tabla de posiciones SHALL segmentarse por categoría de tema además de por cantidad de preguntas, y SHALL permitir al jugador consultar cada categoría. El servidor SHALL validar la categoría recibida contra el conjunto conocido y SHALL tratar cualquier valor desconocido como `fracciones`.

#### Scenario: Puntajes de temas distintos no compiten

- **WHEN** un jugador registra un puntaje de decimales y otro de fracciones con la misma cantidad de preguntas
- **THEN** cada uno aparece en la tabla de su categoría y no compiten entre sí

#### Scenario: Categoría desconocida

- **WHEN** el servidor recibe una categoría que no reconoce
- **THEN** la registra como `fracciones` en lugar de rechazar el puntaje

#### Scenario: Puntajes anteriores al cambio

- **WHEN** se consulta la tabla después de migrar la base de datos
- **THEN** los puntajes que existían aparecen en la categoría `fracciones`, con sus valores intactos

#### Scenario: Partida encolada antes del cambio

- **WHEN** se reintenta una partida que quedó encolada sin categoría de tema
- **THEN** se envía como `fracciones` en lugar de descartarse

### Requirement: Reparto equilibrado entre los temas activos

Cuando una partida combine varios temas, las preguntas SHALL repartirse entre ellos **por turnos** y no por sorteo independiente. Sortear cada pregunta por separado da la proporción correcta sólo a la larga: en una partida de diez preguntas con tres temas activos, un reparto 6-2-2 es perfectamente posible y dejaría al jugador casi sin practicar dos de los tres.

El orden de los turnos SHALL rotar una posición en cada vuelta, para que no salga siempre el mismo tema en la primera pregunta.

#### Scenario: Tres temas en treinta preguntas

- **WHEN** la partida combina fracciones, decimales y álgebra
- **THEN** en treinta preguntas salen diez de cada tema

#### Scenario: Dos temas en diez preguntas

- **WHEN** la partida combina dos temas
- **THEN** en diez preguntas salen cinco de cada uno

#### Scenario: El primer tema no es siempre el mismo

- **WHEN** se comparan las primeras preguntas de vueltas sucesivas
- **THEN** no todas empiezan por el mismo tema

#### Scenario: Un solo tema

- **WHEN** la partida usa un único tema
- **THEN** todas las preguntas salen de ese tema, sin cambios respecto al comportamiento anterior

