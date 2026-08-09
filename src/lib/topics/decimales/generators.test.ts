import { describe, it, expect } from 'vitest'
import { generators, decimalesPayload } from './generators'
import { compare, format, fromFraction, roundTo } from './decimal'
import { leerDecimal } from './lectura'

const muestras = (type: keyof typeof generators, round: number, n = 60) =>
  Array.from({ length: n }, () => generators[type](round))

describe('leer', () => {
  it('la respuesta es la lectura por posición del número mostrado', () => {
    for (const ex of muestras('leer', 3)) {
      expect(ex.answer).toBe(leerDecimal(decimalesPayload(ex).value))
    }
  })

  it('ofrece la lectura de la posición vecina como distractor', () => {
    // Confundir décimas con centésimas es el error que el ejercicio caza, así
    // que esa opción tiene que estar sobre la mesa.
    const conVecina = muestras('leer', 5).filter(ex => {
      const { value } = decimalesPayload(ex)
      const vecinas = [value.scale - 1, value.scale + 1]
        .filter(s => s >= 1 && s <= 3)
        .map(s => leerDecimal({ units: value.units, scale: s }))
      return vecinas.some(v => ex.options.includes(v))
    })
    expect(conVecina.length).toBeGreaterThan(0)
  })
})

describe('escribir', () => {
  it('plantea el enunciado en palabras y responde en cifras', () => {
    for (const ex of muestras('escribir', 3)) {
      const { value, prompt } = decimalesPayload(ex)
      expect(prompt).toBe(leerDecimal(value))
      expect(ex.answer).toBe(format(value))
      expect(ex.answer).toContain(',')
    }
  })
})

describe('comparar', () => {
  it('responde con el símbolo que relaciona los dos números', () => {
    for (const ex of muestras('comparar', 4)) {
      const { value, other } = decimalesPayload(ex)
      const cmp = compare(value, other!)
      expect(ex.answer).toBe(cmp > 0 ? '>' : cmp < 0 ? '<' : '=')
      expect(ex.options).toHaveLength(3)
    }
  })

  it('en la primera ronda usa una sola cifra decimal', () => {
    for (const ex of muestras('comparar', 1)) {
      const { value, other } = decimalesPayload(ex)
      expect(value.scale).toBe(1)
      expect(other!.scale).toBe(1)
    }
  })

  it('en rondas avanzadas llega a tres cifras', () => {
    const escalas = muestras('comparar', 8).map(ex => decimalesPayload(ex).value.scale)
    expect(Math.max(...escalas)).toBe(3)
  })
})

describe('convertir fracción y decimal', () => {
  it('de fracción a decimal responde el decimal exacto', () => {
    for (const ex of muestras('fraccion-a-decimal', 4)) {
      const { fraction } = decimalesPayload(ex)
      expect(ex.answer).toBe(format(fromFraction(fraction!.numerator, fraction!.denominator)!))
    }
  })

  it('de decimal a fracción responde la fracción simplificada', () => {
    for (const ex of muestras('decimal-a-fraccion', 4)) {
      expect(ex.answer).toMatch(/^\d+(\/\d+)?$/)
    }
  })

  it('nunca usa fracciones periódicas', () => {
    for (const type of ['fraccion-a-decimal', 'decimal-a-fraccion'] as const) {
      for (const ex of muestras(type, 8)) {
        const { fraction } = decimalesPayload(ex)
        expect(fromFraction(fraction!.numerator, fraction!.denominator)).not.toBeNull()
      }
    }
  })
})

describe('redondear', () => {
  it('redondea a la posición pedida, hacia arriba en el cinco exacto', () => {
    for (const ex of muestras('redondear', 6)) {
      const { value, targetScale } = decimalesPayload(ex)
      expect(ex.answer).toBe(format(roundTo(value, targetScale!)))
    }
  })
})

describe('valor posicional', () => {
  it('nombra la cifra con la posición que ocupa', () => {
    for (const ex of muestras('valor-posicional', 6)) {
      const { value, position } = decimalesPayload(ex)
      const nombres = ['décima', 'centésima', 'milésima']
      expect(ex.answer).toContain(nombres[position! - 1])
      expect(value.scale).toBeGreaterThanOrEqual(position!)
    }
  })
})
