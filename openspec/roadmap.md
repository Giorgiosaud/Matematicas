# Roadmap

Ideas y pendientes sin detallar. Una o dos líneas cada uno, con de dónde salió.
El análisis es el change de OpenSpec y puede concluir que no se hace.

Lo que ya está decidido vive en `openspec/changes/<nombre>/`, no aquí.

## Contenido — antes de la prueba del 3 de septiembre de 2026

- **Problemas con enunciado, como tema propio.** Es lo que más se les complica,
  y el motivo no es la aritmética: el enunciado **no dice qué técnica usar**, y
  puede ser una fracción, un decimal, una ecuación o una inecuación. Por eso no
  puede vivir dentro de cada tema —marcar «decimales» ya revelaría la mitad de
  la respuesta— sino como un tema transversal donde el niño tiene que decidir.
  Contextos escritos a mano y números sorteados en cada aparición: un catálogo
  fijo se memoriza. Sale de la conversación del 18-ago-2026.
- **Huecos de decimales contra la Unidad 3.** Faltan componer y descomponer con
  la notación de letras del libro, sumar y restar, división con cociente
  decimal, ordenar tres o más números, densidad («escribe un número entre 0,43 y
  0,46»), truncamiento y su contraste con el redondeo, y ampliar la escala hasta
  millonésimas. Sale de leer las nueve fichas SM.

## Contenido — después de la prueba

- **Secuencias de figuras.** Las preguntas 2, 3 y 5 de la evaluación de la
  Unidad 4 usan figuras; hoy solo hay secuencias numéricas. Pide un
  renderizador de figuras.
- **Recta numérica para decimales.** Ficha 25. Es el único generador de
  decimales que necesita dibujo nuevo.
- **Pantalla Aprende con los tips por tema.** Un campo `tips` en el contrato
  `Topic` y una pantalla que recorre el registro. Hoy las pistas ya cumplen el
  papel de explicar en el momento del error, que es donde está la atención; la
  pantalla añade el repaso *antes* de jugar. Sale de la conversación del
  18-ago-2026 sobre un módulo de repaso para el trimestral.

## Deuda técnica

- **Aleatoriedad inyectable en los generadores.** Hoy usan `Math.random()`
  directo, así que fast-check solo controla la ronda y su reducción no puede
  entrar en el sorteo. Con un PRNG con semilla pasado como parámetro, las
  propiedades cubrirían los generadores de verdad. Sale de comprobar que
  fast-check no cazaba de forma fiable el bug de la opción única.
- **Sacar Tailwind.** El código nuevo ya no lo agrega, pero las pantallas
  existentes y el `Render` de decimales siguen usándolo.
- **`onlyBuiltDependencies` en package.json.** `pnpm install` avisa que ignora
  los scripts de esbuild, sharp y workerd. Hoy todo compila igual, pero es la
  misma familia del problema que dejó el CI rojo en agosto.
- **`openspec/config.yaml` apunta a una skill inexistente.** La regla de diseño
  exige invocar `frontend-design` de superpowers, que no está en la versión
  instalada.

## Descartadas

- **KaTeX o MathJax para las expresiones.** La notación del libro es propia
  (`·`, `:` para dividir, `−`) y LaTeX impondría las suyas; además obligaría a
  renderizar también las opciones, que hoy son cadenas que se comparan. El
  formateador propio son treinta líneas.
- **mathjs para evaluar expresiones.** `evaluar` son quince líneas sobre un
  árbol que ya controlamos, y seguiría haciendo falta el formateo a mano.
