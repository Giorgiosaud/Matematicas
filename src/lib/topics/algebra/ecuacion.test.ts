import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import {
  ecuacion,
  formatearEcuacion,
  formatearInecuacion,
  inecuacion,
  menorNaturalQueSatisface,
  resolver,
  satisface,
  tieneSolucionNatural,
} from './ecuacion'

describe('resolver', () => {
  it('con la incógnita a la izquierda', () => {
    // p.81 del libro, textual.
    expect(resolver(ecuacion('x', [72, null], 180))).toBe(108)
    expect(resolver(ecuacion('x', [null, -14], 48))).toBe(62)
  })

  it('con la incógnita a la derecha', () => {
    expect(resolver(ecuacion('x', [null, -56], 25, { izquierda: false }))).toBe(81)
    expect(resolver(ecuacion('x', [5, null], 55, { izquierda: false }))).toBe(50)
  })

  it('agrupa los términos del mismo lado antes de despejar', () => {
    // p.91 #13: 24 + y + 2 = 54.
    expect(resolver(ecuacion('y', [24, null, 2], 54))).toBe(28)
    // p.81: 2 + x − 2 = 8.
    expect(resolver(ecuacion('x', [2, null, -2], 8))).toBe(8)
  })
})

describe('formatearEcuacion', () => {
  it('escribe la ecuación como el libro', () => {
    expect(formatearEcuacion(ecuacion('x', [72, null], 180))).toBe('72 + x = 180')
    expect(formatearEcuacion(ecuacion('x', [null, -14], 48))).toBe('x − 14 = 48')
    expect(formatearEcuacion(ecuacion('y', [24, null, 2], 54))).toBe('24 + y + 2 = 54')
  })

  it('respeta el lado en el que va la incógnita', () => {
    expect(formatearEcuacion(ecuacion('x', [null, -56], 25, { izquierda: false }))).toBe('25 = x − 56')
    expect(formatearEcuacion(ecuacion('x', [5, null], 55, { izquierda: false }))).toBe('55 = 5 + x')
  })

  it('usa el signo menos del libro, no el guion', () => {
    expect(formatearEcuacion(ecuacion('x', [null, -14], 48))).toContain('−')
    expect(formatearEcuacion(ecuacion('x', [null, -14], 48))).not.toContain('-')
  })
})

describe('inecuaciones', () => {
  it('dice cuál es el menor natural que la cumple', () => {
    // p.91 #16: el menor natural para x + 12 > 25 es 14.
    expect(menorNaturalQueSatisface(inecuacion('x', [null, 12], '>', 25))).toBe(14)
  })

  it('el menor natural de una inecuación con «menor que» es el cero cuando entra', () => {
    expect(menorNaturalQueSatisface(inecuacion('x', [null, 7], '<', 9))).toBe(0)
  })

  it('comprueba si un valor concreto la satisface', () => {
    const inec = inecuacion('x', [null], '<', 24)
    expect(satisface(inec, 8)).toBe(true)
    expect(satisface(inec, 23)).toBe(true)
    expect(satisface(inec, 30)).toBe(false)
    // El umbral nunca se cumple a sí mismo: 24 < 24 es falso.
    expect(satisface(inec, 24)).toBe(false)
  })

  it('reconoce las que ningún natural puede cumplir', () => {
    // x + 30 < 12 no tiene solución en los naturales, y una pregunta así no se
    // puede responder: el generador tiene que descartarla antes de plantearla.
    expect(tieneSolucionNatural(inecuacion('x', [null, 30], '<', 12))).toBe(false)
    expect(tieneSolucionNatural(inecuacion('x', [null, 7], '<', 9))).toBe(true)
    expect(tieneSolucionNatural(inecuacion('x', [null, 12], '>', 25))).toBe(true)
  })

  it('las de «mayor que» siempre tienen solución natural', () => {
    expect(tieneSolucionNatural(inecuacion('x', [null, 5], '>', 1000))).toBe(true)
  })

  it('las escribe como el libro', () => {
    expect(formatearInecuacion(inecuacion('x', [null, 7], '<', 9))).toBe('x + 7 < 9')
    expect(formatearInecuacion(inecuacion('a', [34, null], '<', 5))).toBe('34 + a < 5')
    expect(formatearInecuacion(inecuacion('b', [null, -2], '<', 10))).toBe('b − 2 < 10')
  })
})

describe('propiedades', () => {
  const incognitaArb = fc.constantFrom('x', 'y', 'a', 'b', 'n')
  const ladoArb = fc.tuple(fc.integer({ min: 0, max: 60 }), fc.integer({ min: -40, max: 40 }))
    .map(([a, b]) => (b === 0 ? [a, null] : [a, null, b]) as (number | null)[])

  it('la solución de una ecuación siempre la cumple', () => {
    fc.assert(fc.property(incognitaArb, ladoArb, fc.integer({ min: 0, max: 300 }), (v, lado, res) => {
      const ec = ecuacion(v, lado, res)
      const x = resolver(ec)
      const suma = lado.reduce<number>((acc, t) => acc + (t ?? 0), 0)
      return x + suma === res
    }))
  })

  it('el menor natural que satisface la cumple, y el anterior no', () => {
    fc.assert(fc.property(
      incognitaArb, ladoArb, fc.constantFrom('<' as const, '>' as const), fc.integer({ min: 0, max: 200 }),
      (v, lado, signo, res) => {
        const inec = inecuacion(v, lado, signo, res)
        fc.pre(tieneSolucionNatural(inec))
        const menor = menorNaturalQueSatisface(inec)
        if (menor === null) return false
        return satisface(inec, menor) && (menor === 0 || !satisface(inec, menor - 1))
      },
    ))
  })

  it('si no tiene solución natural, ningún natural pequeño la cumple', () => {
    fc.assert(fc.property(incognitaArb, ladoArb, fc.integer({ min: 0, max: 200 }), (v, lado, res) => {
      const inec = inecuacion(v, lado, '<', res)
      fc.pre(!tieneSolucionNatural(inec))
      return Array.from({ length: 50 }, (_, i) => i).every(n => !satisface(inec, n))
    }))
  })
})
