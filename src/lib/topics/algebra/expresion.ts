// Cómo se imprime una expresión algebraica. Único lugar del tema que lo decide:
// el libro del alumno usa dos reglas de multiplicación a la vez y basta con que
// una se escriba distinto para que el juego contradiga al cuaderno.

export type Expr =
  | { tipo: 'num'; valor: number }
  | { tipo: 'var'; nombre: string }
  | { tipo: 'termino'; coeficiente: number; variable: string }
  | { tipo: 'suma'; izq: Expr; der: Expr }
  | { tipo: 'resta'; izq: Expr; der: Expr }
  | { tipo: 'producto'; izq: Expr; der: Expr; explicito: boolean }
  | { tipo: 'division'; izq: Expr; der: Expr }

// El menos del libro es el signo matemático, no el guion del teclado.
const MENOS = '−'
const POR = ' · '

export function num(valor: number): Expr {
  return { tipo: 'num', valor }
}

export function variable(nombre: string): Expr {
  return { tipo: 'var', nombre }
}

// Coeficiente pegado a la variable: 3x, 9b, 12b.
export function termino(coeficiente: number, variable: string): Expr {
  return { tipo: 'termino', coeficiente, variable }
}

export function suma(izq: Expr, der: Expr): Expr {
  return { tipo: 'suma', izq, der }
}

export function resta(izq: Expr, der: Expr): Expr {
  return { tipo: 'resta', izq, der }
}

// `explicito` fuerza el punto medio entre un número y la variable que le sigue.
// Se usa cuando la pregunta contrasta las cuatro operaciones sobre los mismos
// operandos (4 + s, 4 − s, 4 · s): ahí yuxtaponer rompería el paralelismo.
export function producto(izq: Expr, der: Expr, opciones?: { explicito?: boolean }): Expr {
  return { tipo: 'producto', izq, der, explicito: opciones?.explicito ?? false }
}

export function division(izq: Expr, der: Expr): Expr {
  return { tipo: 'division', izq, der }
}

// Un producto se yuxtapone solo cuando el número va delante de la variable.
// Al revés (x · 2) el punto es obligatorio: `x2` no se lee.
function seYuxtapone(izq: Expr, der: Expr): boolean {
  return izq.tipo === 'num' && der.tipo === 'var'
}

export function formatear(expr: Expr): string {
  switch (expr.tipo) {
    case 'num':
      return expr.valor < 0 ? `${MENOS}${Math.abs(expr.valor)}` : String(expr.valor)
    case 'var':
      return expr.nombre
    case 'termino':
      return expr.coeficiente === 1 ? expr.variable : `${expr.coeficiente}${expr.variable}`
    case 'suma':
      return `${formatear(expr.izq)} + ${formatear(expr.der)}`
    case 'resta':
      return `${formatear(expr.izq)} ${MENOS} ${formatear(expr.der)}`
    case 'producto':
      return !expr.explicito && seYuxtapone(expr.izq, expr.der)
        ? `${formatear(expr.izq)}${formatear(expr.der)}`
        : `${formatear(expr.izq)}${POR}${formatear(expr.der)}`
    case 'division':
      return `${formatear(expr.izq)} : ${formatear(expr.der)}`
  }
}
