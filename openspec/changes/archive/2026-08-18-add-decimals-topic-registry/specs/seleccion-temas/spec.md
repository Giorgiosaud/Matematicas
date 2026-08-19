## ADDED Requirements

### Requirement: Selector de temas en la pantalla inicial

La pantalla inicial SHALL presentar los temas del registro como una selección múltiple, y SHALL exigir al menos un tema activo para poder empezar una partida. Aplica por igual al modo de práctica solo y al de dos jugadores.

#### Scenario: Selección de varios temas

- **WHEN** el jugador marca fracciones y decimales
- **THEN** puede empezar la partida y las preguntas salen de ambos temas

#### Scenario: Ningún tema marcado

- **WHEN** el jugador desmarca todos los temas
- **THEN** el botón de empezar queda deshabilitado, con un mensaje en español que explica que debe elegir al menos un tema

#### Scenario: Estado inicial en un dispositivo nuevo

- **WHEN** un jugador abre la app por primera vez
- **THEN** aparece fracciones marcado por defecto

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

Cada partida SHALL clasificarse en exactamente una de tres categorías: `fracciones` si solo se practicó ese tema, `decimales` si solo se practicó ese, y `mixto` si la sesión combinó más de un tema. La categoría SHALL derivarse de la selección, sin que el jugador la elija aparte.

#### Scenario: Sesión de un solo tema

- **WHEN** la partida se jugó únicamente con decimales
- **THEN** su categoría es `decimales`

#### Scenario: Sesión combinada

- **WHEN** la partida se jugó con fracciones y decimales
- **THEN** su categoría es `mixto`

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
