import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import type { Expr } from './expresion'
import { division, evaluar, formatear, num, producto, resta, suma, termino, tieneDivision, variable, variablesDe } from './expresion'

describe('formatear', () => {
  it('yuxtapone el coeficiente cuando va delante de la variable', () => {
    expect(formatear(termino(3, 'x'))).toBe('3x')
    expect(formatear(termino(9, 'b'))).toBe('9b')
    expect(formatear(termino(12, 'b'))).toBe('12b')
    expect(formatear(termino(5, 'a'))).toBe('5a')
  })

  it('omite el coeficiente 1: se escribe x, no 1x', () => {
    expect(formatear(termino(1, 'x'))).toBe('x')
  })

  it('usa el punto medio cuando la variable va delante del número', () => {
    // El libro escribe `x · 2` y no `x2`, que sería ilegible (p.91 #9).
    expect(formatear(producto(variable('x'), num(2)))).toBe('x · 2')
  })

  it('usa el punto medio entre dos variables', () => {
    expect(formatear(producto(variable('a'), variable('b')))).toBe('a · b')
    expect(formatear(producto(variable('x'), variable('x')))).toBe('x · x')
  })

  it('usa el punto medio entre dos números', () => {
    expect(formatear(producto(num(5), num(8)))).toBe('5 · 8')
  })

  it('permite forzar el punto entre número y variable', () => {
    // Cuando la pregunta contrasta las cuatro operaciones sobre los mismos dos
    // operandos, el libro escribe la multiplicación explícita: 4 + s, 4 − s,
    // 4 · s (p.91 #7). Yuxtaponer ahí rompería el paralelismo de las opciones.
    expect(formatear(producto(num(4), variable('s'), { explicito: true }))).toBe('4 · s')
  })

  it('combina las dos reglas en una misma expresión', () => {
    // p.91 #8, textual.
    const expr = suma(termino(9, 'b'), producto(variable('a'), variable('b')))
    expect(formatear(expr)).toBe('9b + a · b')
  })

  it('escribe sumas y restas con espacios alrededor del signo', () => {
    expect(formatear(suma(termino(3, 'x'), num(9)))).toBe('3x + 9')
    expect(formatear(resta(termino(2, 'b'), variable('a')))).toBe('2b − a')
    expect(formatear(suma(variable('a'), termino(12, 'b')))).toBe('a + 12b')
    expect(formatear(suma(termino(9, 'c'), termino(3, 'a')))).toBe('9c + 3a')
  })

  it('usa el signo menos del libro y no el guion del teclado', () => {
    expect(formatear(resta(termino(2, 'b'), variable('a')))).toContain('−')
    expect(formatear(resta(termino(2, 'b'), variable('a')))).not.toContain('-')
  })

  it('nunca produce aspa ni asterisco', () => {
    const expresiones = [
      termino(3, 'x'),
      producto(variable('a'), variable('b')),
      producto(num(4), variable('s'), { explicito: true }),
      suma(termino(9, 'b'), producto(variable('a'), variable('b'))),
    ]
    for (const expr of expresiones) {
      const texto = formatear(expr)
      expect(texto).not.toContain('×')
      expect(texto).not.toContain('*')
    }
  })
})

describe('evaluar', () => {
  it('resuelve una expresión de una variable', () => {
    expect(evaluar(resta(termino(3, 'x'), num(5)), { x: 4 })).toBe(7)
  })

  it('respeta la precedencia del producto sobre la suma', () => {
    // p.91 #8 del libro: si a = 4 y b = 2, 9b + a · b vale 26.
    const expr = suma(termino(9, 'b'), producto(variable('a'), variable('b')))
    expect(evaluar(expr, { a: 4, b: 2 })).toBe(26)
  })

  it('una variable sin valor cuenta como cero en vez de dar NaN', () => {
    expect(evaluar(termino(3, 'x'), {})).toBe(0)
  })
})

describe('variablesDe', () => {
  it('enumera las letras en orden de aparición y sin repetir', () => {
    const expr = suma(termino(9, 'b'), producto(variable('a'), variable('b')))
    expect(variablesDe(expr)).toEqual(['b', 'a'])
  })

  it('una expresión sin letras no devuelve ninguna', () => {
    expect(variablesDe(num(7))).toEqual([])
  })
})

describe('tieneDivision', () => {
  it('detecta la división aunque esté anidada', () => {
    expect(tieneDivision(resta(division(variable('x'), num(3)), variable('y')))).toBe(true)
    expect(tieneDivision(suma(termino(3, 'x'), num(9)))).toBe(false)
  })
})

// ── Propiedades ──────────────────────────────────────────────────────────────
// Los ejemplos de arriba fijan la notación del libro caso por caso. Esto
// comprueba lo mismo sobre expresiones que nadie escribió a mano: fast-check
// arma árboles al azar y, cuando algo falla, lo reduce al caso más pequeño que
// lo reproduce en vez de dejarte adivinando con qué entrada fue.

const letraArb = fc.constantFrom('x', 'y', 'a', 'b', 'c', 'n', 's', 'w', 'z')

const exprArb: fc.Arbitrary<Expr> = fc.letrec<{ expr: Expr }>(tie => ({
  expr: fc.oneof(
    { maxDepth: 3 },
    fc.integer({ min: 0, max: 99 }).map(num),
    letraArb.map(variable),
    fc.tuple(fc.integer({ min: 1, max: 12 }), letraArb).map(([c, v]) => termino(c, v)),
    fc.tuple(tie('expr'), tie('expr')).map(([a, b]) => suma(a, b)),
    fc.tuple(tie('expr'), tie('expr')).map(([a, b]) => resta(a, b)),
    fc.tuple(tie('expr'), tie('expr')).map(([a, b]) => producto(a, b)),
    fc.tuple(tie('expr'), fc.integer({ min: 2, max: 9 })).map(([a, d]) => division(a, num(d))),
  ),
})).expr

const valoresArb = fc.dictionary(letraArb, fc.integer({ min: 0, max: 50 }))

describe('propiedades de formatear', () => {
  it('ninguna expresión, por rara que sea, usa aspa o asterisco', () => {
    fc.assert(fc.property(exprArb, expr => {
      const texto = formatear(expr)
      return !texto.includes('×') && !texto.includes('*')
    }))
  })

  it('la resta siempre usa el signo menos y nunca el guion del teclado', () => {
    fc.assert(fc.property(exprArb, expr => !formatear(expr).includes('-')))
  })

  it('nunca escribe un coeficiente 1 pegado a la variable', () => {
    fc.assert(fc.property(letraArb, v => formatear(termino(1, v)) === v))
  })
})

describe('propiedades de tieneDivision', () => {
  it('detecta la división exactamente cuando el texto la muestra', () => {
    fc.assert(fc.property(exprArb, expr => tieneDivision(expr) === formatear(expr).includes(' : ')))
  })

  it('una expresión sin división evaluada con enteros da un entero', () => {
    // Es la propiedad que se rompió: una plantilla con división se coló por un
    // filtro que miraba el nombre, el valor salió fraccionario y el ejercicio
    // acabó con una sola opción.
    fc.assert(fc.property(exprArb, valoresArb, (expr, valores) => {
      fc.pre(!tieneDivision(expr))
      return Number.isInteger(evaluar(expr, valores))
    }))
  })
})

describe('propiedades de variablesDe', () => {
  it('no repite letras', () => {
    fc.assert(fc.property(exprArb, expr => {
      const letras = variablesDe(expr)
      return new Set(letras).size === letras.length
    }))
  })

  it('enumera justo las letras que aparecen en el texto', () => {
    fc.assert(fc.property(exprArb, expr => {
      const texto = formatear(expr)
      return variablesDe(expr).every(letra => texto.includes(letra))
    }))
  })

  it('si no usa letras, su valor no depende de los valores dados', () => {
    fc.assert(fc.property(exprArb, valoresArb, (expr, valores) => {
      fc.pre(variablesDe(expr).length === 0)
      return evaluar(expr, valores) === evaluar(expr, {})
    }))
  })
})
