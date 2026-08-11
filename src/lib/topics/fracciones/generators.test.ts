import { describe, it, expect } from 'vitest'
import { generators, fraccionesPayload } from './generators'
import { generateExercise, validateAnswer } from '../index'
import { addFractions, subtractFractions, simplifyFraction, fractionToString } from '../../fractions'

// Estas pruebas venían de src/lib/exercises.test.ts y comprueban que la
// aritmética de cada generador sigue siendo correcta tras mover el tema a su
// carpeta. La forma genérica del ejercicio la cubre registry.test.ts.

describe('generateExercise sobre fracciones', () => {
  it('devuelve un ejercicio con tipo y respuesta', () => {
    const ex = generateExercise(1, ['fracciones'])
    expect(ex.type).toBeDefined()
    expect(ex.answer).toBeDefined()
    expect(ex.displayAnswer).toBeDefined()
  })

  it('comparar trae las dos fracciones y responde con un símbolo', () => {
    const ex = generators.compare(1)
    const { fractionA, fractionB } = fraccionesPayload(ex)
    expect(fractionA).toBeDefined()
    expect(fractionB).toBeDefined()
    expect(['>', '<', '=']).toContain(ex.answer)
  })

  it('simplificar responde con una fracción', () => {
    const ex = generators.simplify(1)
    expect(ex.answer).toMatch(/^\d+\/\d+$/)
  })
})

describe.each(['add', 'subtract'] as const)('ejercicio de %s', (type) => {
  it('trae las dos fracciones y una respuesta con forma de fracción o entero', () => {
    const ex = generators[type](1)
    const { fractionA, fractionB } = fraccionesPayload(ex)
    expect(fractionA).toBeDefined()
    expect(fractionB).toBeDefined()
    // Los resultados enteros (p. ej. 1/2 - 1/2) se muestran como "0" o "2",
    // no como "0/1" — que es como lo escribiría un niño.
    expect(ex.answer).toMatch(/^-?\d+(\/\d+)?$/)
    expect(ex.displayAnswer).toBe(ex.answer)
  })

  it('la respuesta es el resultado simplificado de la operación', () => {
    const ex = generators[type](1)
    const { fractionA, fractionB } = fraccionesPayload(ex)
    const expected = type === 'add'
      ? addFractions(fractionA, fractionB!)
      : subtractFractions(fractionA, fractionB!)
    expect(ex.answer).toBe(fractionToString(simplifyFraction(expected)))
  })

  it('validateAnswer acepta la correcta y rechaza otra', () => {
    const ex = generators[type](1)
    expect(validateAnswer(ex, ex.answer)).toBe(true)
    const wrong = ex.options.find(o => o !== ex.answer)
    if (wrong) expect(validateAnswer(ex, wrong)).toBe(false)
  })
})

describe('validateAnswer', () => {
  it('ignora mayúsculas y espacios sobrantes', () => {
    const ex = generators.mixed(1)
    expect(validateAnswer(ex, `  ${ex.answer.toUpperCase()}  `)).toBe(true)
  })

  it('rechaza una respuesta distinta', () => {
    const ex = generators.compare(1)
    expect(validateAnswer(ex, ex.answer === '>' ? '<' : '>')).toBe(false)
  })
})
