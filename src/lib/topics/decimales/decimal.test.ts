import { describe, it, expect } from 'vitest'
import { add, compare, decimal, digitAt, format, fromFraction, integerPart, parse, roundTo } from './decimal'

describe('decimal como entero escalado', () => {
  it('formatea con coma, que es como se escribe en español', () => {
    expect(format(decimal(34, 1))).toBe('3,4')
    expect(format(decimal(75, 2))).toBe('0,75')
    expect(format(decimal(5, 3))).toBe('0,005')
    expect(format(decimal(20, 0))).toBe('20')
  })

  it('lee tanto la coma como el punto', () => {
    expect(compare(parse('0,75'), parse('0.75'))).toBe(0)
    expect(format(parse('3.402'))).toBe('3,402')
  })

  it('suma sin el error del punto flotante', () => {
    // 0.1 + 0.2 !== 0.3 en aritmética de punto flotante.
    expect(format(add(parse('0.1'), parse('0.2')))).toBe('0,3')
    expect(format(add(parse('0.35'), parse('0.4')))).toBe('0,75')
  })

  it('compara valores con distinta cantidad de cifras', () => {
    expect(compare(parse('0.7'), parse('0.65'))).toBeGreaterThan(0)
    expect(compare(parse('0.65'), parse('0.7'))).toBeLessThan(0)
    expect(compare(parse('0.9'), parse('0.2'))).toBeGreaterThan(0)
  })

  it('trata 0,5 y 0,50 como el mismo número', () => {
    expect(compare(parse('0.5'), parse('0.50'))).toBe(0)
  })

  it('redondea hacia arriba cuando la cifra siguiente es exactamente cinco', () => {
    expect(format(roundTo(parse('3.472'), 1))).toBe('3,5')
    expect(format(roundTo(parse('3.45'), 1))).toBe('3,5')
    expect(format(roundTo(parse('3.44'), 1))).toBe('3,4')
    expect(format(roundTo(parse('2.999'), 2))).toBe('3')
  })

  it('convierte fracciones exactas y rechaza las periódicas', () => {
    expect(format(fromFraction(3, 4)!)).toBe('0,75')
    expect(format(fromFraction(1, 8)!)).toBe('0,125')
    expect(format(fromFraction(7, 10)!)).toBe('0,7')
    expect(fromFraction(1, 3)).toBeNull()
    expect(fromFraction(2, 7)).toBeNull()
  })

  it('expone la cifra de cada posición y la parte entera', () => {
    const d = parse('3.472')
    expect(integerPart(d)).toBe(3)
    expect(digitAt(d, 1)).toBe(4)
    expect(digitAt(d, 2)).toBe(7)
    expect(digitAt(d, 3)).toBe(2)
  })
})
