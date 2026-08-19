## MODIFIED Requirements

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

## ADDED Requirements

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
