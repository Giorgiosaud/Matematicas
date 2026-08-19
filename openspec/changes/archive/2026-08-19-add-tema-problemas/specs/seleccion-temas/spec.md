## MODIFIED Requirements

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
