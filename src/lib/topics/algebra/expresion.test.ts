import { describe, expect, it } from 'vitest'
import { formatear, num, producto, resta, suma, termino, variable } from './expresion'

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
