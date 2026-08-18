import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { generators } from './generators'
import { describe as describir, hint, listarValores, ordinal } from './text'

describe('listarValores', () => {
  it('escribe una sola letra sin conjunción', () => {
    expect(listarValores({ x: 4 })).toBe('x = 4')
  })

  it('une dos letras con «y»', () => {
    expect(listarValores({ a: 4, b: 2 })).toBe('a = 4 y b = 2')
  })

  it('usa comas y deja la «y» solo para la última', () => {
    expect(listarValores({ a: 1, b: 2, c: 3 })).toBe('a = 1, b = 2 y c = 3')
  })
})

describe('ordinal', () => {
  it('escribe la posición como el libro', () => {
    expect(ordinal(8)).toBe('8.º')
    expect(ordinal(100)).toBe('100.º')
  })
})

describe('enunciado y pista de todos los tipos', () => {
  const tipoArb = fc.constantFrom(...(Object.keys(generators) as (keyof typeof generators)[]))
  const rondaArb = fc.integer({ min: 1, max: 30 })

  it('todo ejercicio tiene un enunciado en español, sin marcadores sueltos', () => {
    fc.assert(fc.property(tipoArb, rondaArb, (tipo, ronda) => {
      const texto = describir(generators[tipo](ronda))
      return texto.length > 0 && texto !== 'Resuelve' && !texto.includes('undefined')
    }))
  })

  it('todo ejercicio tiene pista, y ninguna deja un hueco sin rellenar', () => {
    fc.assert(fc.property(tipoArb, rondaArb, (tipo, ronda) => {
      const texto = hint(generators[tipo](ronda))
      return texto.length > 0 && !texto.includes('undefined') && !texto.includes('NaN')
    }))
  })
})

describe('la pista de valorizar se ajusta a la expresión', () => {
  const conCoeficiente = { type: 'valorizar', payload: { expresion: '3x + 9' } } as never
  const sinCoeficiente = { type: 'valorizar', payload: { expresion: 'y − 1' } } as never

  it('habla del coeficiente implícito solo cuando lo hay', () => {
    expect(hint(conCoeficiente)).toContain('3 · x')
    expect(hint(sinCoeficiente)).not.toContain('3 · x')
  })

  it('la versión sin coeficiente sigue diciendo qué hacer', () => {
    expect(hint(sinCoeficiente)).toContain('cambia cada letra por su valor')
  })
})
