import { describe, expect, it } from 'vitest'
import { algebraPayload, generators } from './generators'
import { describirPatron, terminos } from './secuencia'

const RONDAS = [1, 2, 3, 5, 8, 13]
const MUESTRAS = 40

function muestrear(tipo: keyof typeof generators) {
  return RONDAS.flatMap(round => Array.from({ length: MUESTRAS }, () => generators[tipo](round)))
}

describe('patron', () => {
  const ejercicios = muestrear('patron')

  it('la respuesta describe el patrón real de la secuencia', () => {
    for (const ex of ejercicios) {
      const { secuencia } = algebraPayload(ex)
      expect(ex.answer).toBe(describirPatron(secuencia!))
    }
  })

  it('los distractores son patrones plausibles, no números sueltos', () => {
    for (const ex of ejercicios) {
      for (const opcion of ex.options) {
        expect(opcion).toMatch(/^(Sumar|Restar|Multiplicar por|Dividir por) \d+$/)
      }
    }
  })

  it('muestra suficientes términos para que el patrón se pueda deducir', () => {
    for (const ex of ejercicios) {
      expect(algebraPayload(ex).mostrados!.length).toBeGreaterThanOrEqual(4)
    }
  })

  it('ningún término mostrado es negativo ni fraccionario', () => {
    for (const ex of ejercicios) {
      for (const valor of algebraPayload(ex).mostrados!) {
        expect(Number.isInteger(valor)).toBe(true)
        expect(valor).toBeGreaterThanOrEqual(0)
      }
    }
  })
})

describe('completar', () => {
  const ejercicios = muestrear('completar')

  it('la respuesta es el término que falta', () => {
    for (const ex of ejercicios) {
      const { secuencia, posicionOculta } = algebraPayload(ex)
      const lista = terminos(secuencia!, 8)
      expect(ex.answer).toBe(String(lista[posicionOculta! - 1]))
    }
  })

  it('el hueco cae dentro de lo que se muestra', () => {
    for (const ex of ejercicios) {
      const { mostrados, posicionOculta } = algebraPayload(ex)
      expect(posicionOculta).toBeGreaterThanOrEqual(1)
      expect(posicionOculta).toBeLessThanOrEqual(mostrados!.length)
    }
  })

  it('a veces el hueco está en medio y no siempre al final', () => {
    const { length } = ejercicios.filter(ex => {
      const { mostrados, posicionOculta } = algebraPayload(ex)
      return posicionOculta! < mostrados!.length
    })
    expect(length).toBeGreaterThan(0)
  })
})

describe('termino-lejano', () => {
  const ejercicios = muestrear('termino-lejano')

  it('la respuesta es el término de la posición pedida', () => {
    for (const ex of ejercicios) {
      const { secuencia, posicionPedida } = algebraPayload(ex)
      const lista = terminos(secuencia!, posicionPedida!)
      expect(ex.answer).toBe(String(lista[posicionPedida! - 1]))
    }
  })

  it('la posición pedida queda más allá de lo que se muestra, para que no se cuente', () => {
    for (const ex of ejercicios) {
      const { mostrados, posicionPedida } = algebraPayload(ex)
      expect(posicionPedida!).toBeGreaterThan(mostrados!.length)
    }
  })

  it('el resultado sigue siendo un entero manejable', () => {
    for (const ex of ejercicios) {
      const valor = Number(ex.answer)
      expect(Number.isInteger(valor)).toBe(true)
      expect(Math.abs(valor)).toBeLessThan(1_000_000)
    }
  })
})

describe('construir', () => {
  const ejercicios = muestrear('construir')

  it('la respuesta son los primeros términos separados por comas', () => {
    for (const ex of ejercicios) {
      const { secuencia } = algebraPayload(ex)
      expect(ex.answer).toBe(terminos(secuencia!, 5).join(', '))
    }
  })

  it('el enunciado nombra el primer término y el patrón', () => {
    for (const ex of ejercicios) {
      const { secuencia, prompt } = algebraPayload(ex)
      expect(prompt).toContain(String(secuencia!.inicio))
      expect(prompt!.toLowerCase()).toContain(describirPatron(secuencia!).toLowerCase())
    }
  })
})
