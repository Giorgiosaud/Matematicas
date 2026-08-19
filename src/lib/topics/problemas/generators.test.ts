import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { CONTEXTOS } from './contextos'
import { generators, problemasPayload } from './generators'

const RONDAS = [1, 2, 3, 5, 8, 13]
const MUESTRAS = 40

function muestrear(tipo: keyof typeof generators) {
  return RONDAS.flatMap(round => Array.from({ length: MUESTRAS }, () => generators[tipo](round)))
}

describe('resultado', () => {
  const ejercicios = muestrear('resultado')

  it('muestra el enunciado y responde con una cantidad', () => {
    for (const ex of ejercicios) {
      expect(problemasPayload(ex).enunciado.length).toBeGreaterThan(20)
      expect(ex.answer.length).toBeGreaterThan(0)
    }
  })

  it('todas las opciones llevan la misma unidad', () => {
    // Si la correcta lleva «kg» y las demás no, se acierta sin leer.
    for (const ex of ejercicios) {
      const unidades = ex.options.map(o => o.replace(/[\d.,\s$]/g, ''))
      expect(new Set(unidades).size).toBe(1)
    }
  })

  it('ninguna opción se repite', () => {
    for (const ex of ejercicios) {
      expect(new Set(ex.options).size).toBe(ex.options.length)
    }
  })

  it('el enunciado no dice con qué se resuelve', () => {
    for (const ex of ejercicios) {
      const texto = problemasPayload(ex).enunciado.toLowerCase()
      for (const palabra of ['fracción', 'decimal', 'ecuación', 'inecuación', 'incógnita']) {
        expect(texto).not.toContain(palabra)
      }
    }
  })
})

describe('que-operacion', () => {
  const ejercicios = muestrear('que-operacion')

  it('las opciones son operaciones, no cantidades sueltas', () => {
    for (const ex of ejercicios) {
      for (const opcion of ex.options) {
        expect(opcion).toMatch(/[:·+−]/)
      }
    }
  })

  it('la respuesta es la operación que resuelve el problema', () => {
    for (const ex of ejercicios) {
      expect(ex.options).toContain(ex.answer)
      expect(problemasPayload(ex).operacion).toBe(ex.answer)
    }
  })

  it('ninguna opción usa notación de calculadora', () => {
    for (const ex of ejercicios) {
      for (const opcion of ex.options) {
        expect(opcion).not.toContain('×')
        expect(opcion).not.toContain('÷')
      }
    }
  })
})

describe('propiedades de los dos generadores', () => {
  const tipoArb = fc.constantFrom(...(Object.keys(generators) as (keyof typeof generators)[]))
  const rondaArb = fc.integer({ min: 1, max: 30 })

  it('siempre hay al menos dos opciones distintas y la respuesta está una vez', () => {
    fc.assert(fc.property(tipoArb, rondaArb, (tipo, ronda) => {
      const ex = generators[tipo](ronda)
      return ex.options.length >= 2
        && new Set(ex.options).size === ex.options.length
        && ex.options.filter(o => o === ex.displayAnswer).length === 1
    }), { numRuns: 400 })
  })

  it('el ejercicio siempre sabe de qué técnica es, para poder dar la pista', () => {
    fc.assert(fc.property(tipoArb, rondaArb, (tipo, ronda) => {
      const { tecnica } = problemasPayload(generators[tipo](ronda))
      return ['decimales', 'fracciones', 'ecuacion', 'inecuacion'].includes(tecnica)
    }))
  })

  it('con el tiempo salen contextos variados y no siempre el mismo', () => {
    const vistos = new Set<string>()
    for (let i = 0; i < 600; i++) vistos.add(problemasPayload(generators.resultado(5)).enunciado.slice(0, 25))
    expect(vistos.size).toBeGreaterThan(CONTEXTOS.length / 2)
  })
})
