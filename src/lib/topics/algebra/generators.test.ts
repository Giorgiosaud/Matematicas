import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
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

describe('frase-a-expresion', () => {
  const ejercicios = muestrear('frase-a-expresion')

  it('muestra la frase y responde con la expresión', () => {
    for (const ex of ejercicios) {
      expect(algebraPayload(ex).prompt).toBeTruthy()
      expect(ex.answer).not.toBe('')
    }
  })

  it('ninguna opción usa aspa ni asterisco', () => {
    for (const ex of ejercicios) {
      for (const opcion of ex.options) {
        expect(opcion).not.toContain('×')
        expect(opcion).not.toContain('*')
      }
    }
  })

  it('ofrece más de una opción para elegir', () => {
    for (const ex of ejercicios) {
      expect(ex.options.length).toBeGreaterThanOrEqual(2)
    }
  })
})

describe('expresion-a-frase', () => {
  const ejercicios = muestrear('expresion-a-frase')

  it('muestra la expresión y responde con la frase', () => {
    for (const ex of ejercicios) {
      expect(algebraPayload(ex).expresion).toBeTruthy()
      expect(ex.answer.endsWith('.')).toBe(true)
    }
  })
})

describe('valorizar', () => {
  const ejercicios = muestrear('valorizar')

  it('el resultado es un entero no negativo', () => {
    for (const ex of ejercicios) {
      const valor = Number(ex.answer)
      expect(Number.isInteger(valor)).toBe(true)
      expect(valor).toBeGreaterThanOrEqual(0)
    }
  })

  it('da un valor a cada letra que aparece en la expresión', () => {
    for (const ex of ejercicios) {
      const { expresion, valores } = algebraPayload(ex)
      for (const letra of Object.keys(valores!)) {
        expect(expresion).toContain(letra)
      }
      expect(Object.keys(valores!).length).toBeGreaterThan(0)
    }
  })

  it('ninguna opción se repite, ni cuando el distractor coincide con la respuesta', () => {
    for (const ex of ejercicios) {
      expect(new Set(ex.options).size).toBe(ex.options.length)
    }
  })

  it('todas las opciones son números', () => {
    for (const ex of ejercicios) {
      for (const opcion of ex.options) {
        expect(Number.isNaN(Number(opcion))).toBe(false)
      }
    }
  })
})

describe('las letras rotan', () => {
  it('no sale siempre x', () => {
    const letras = new Set<string>()
    for (const ex of muestrear('valorizar')) {
      for (const letra of Object.keys(algebraPayload(ex).valores!)) letras.add(letra)
    }
    expect(letras.size).toBeGreaterThan(1)
  })
})

// ── Propiedades ──────────────────────────────────────────────────────────────
// Los generadores sortean por dentro, así que lo que fast-check controla aquí
// es la ronda. Sigue valiendo: si un contrato solo se rompe en la ronda 13,
// el informe lo dice en vez de dejar un fallo intermitente sin entrada conocida.

const rondaArb = fc.integer({ min: 1, max: 30 })
const tipoArb = fc.constantFrom(...(Object.keys(generators) as (keyof typeof generators)[]))

describe('propiedades de todos los generadores', () => {
  it('siempre ofrece al menos dos opciones distintas', () => {
    fc.assert(fc.property(tipoArb, rondaArb, (tipo, ronda) => {
      const ex = generators[tipo](ronda)
      return ex.options.length >= 2 && new Set(ex.options).size === ex.options.length
    }), { numRuns: 500 })
  })

  it('la respuesta está entre las opciones exactamente una vez', () => {
    fc.assert(fc.property(tipoArb, rondaArb, (tipo, ronda) => {
      const ex = generators[tipo](ronda)
      return ex.options.filter(o => o === ex.displayAnswer).length === 1
    }), { numRuns: 500 })
  })

  it('ninguna opción queda vacía ni dice «undefined» o «NaN»', () => {
    fc.assert(fc.property(tipoArb, rondaArb, (tipo, ronda) => {
      const ex = generators[tipo](ronda)
      return ex.options.every(o => o.length > 0 && !o.includes('undefined') && !o.includes('NaN'))
    }), { numRuns: 500 })
  })
})

// ── Ecuaciones, desigualdades e inecuaciones ─────────────────────────────────

function numerosDe(texto: string): number[] {
  return (texto.match(/\d+/g) ?? []).map(Number)
}

describe('ecuacion-balanza', () => {
  const ejercicios = muestrear('ecuacion-balanza')

  it('la balanza está en equilibrio', () => {
    for (const ex of ejercicios) {
      expect(algebraPayload(ex).balanza!.estado).toBe('equilibrio')
    }
  })

  it('todas las opciones usan solo números que están en el dibujo', () => {
    // Una opción con un número que no aparece se descarta sin pensar, y la
    // pregunta se resuelve por eliminación en vez de por comprensión.
    for (const ex of ejercicios) {
      const { balanza } = algebraPayload(ex)
      const enDibujo = new Set(
        [...balanza!.izquierda, ...balanza!.derecha]
          .map(p => p.gramos)
          .filter((g): g is number => g !== undefined),
      )
      for (const opcion of ex.options) {
        for (const n of numerosDe(opcion)) expect(enDibujo.has(n)).toBe(true)
      }
    }
  })

  it('un platillo lleva la incógnita y el otro no', () => {
    for (const ex of ejercicios) {
      const { balanza } = algebraPayload(ex)
      const conIncognita = [balanza!.izquierda, balanza!.derecha]
        .filter(lado => lado.some(p => p.incognita !== undefined))
      expect(conIncognita).toHaveLength(1)
    }
  })
})

describe('resolver-ecuacion', () => {
  const ejercicios = muestrear('resolver-ecuacion')

  it('la solución es un entero no negativo', () => {
    for (const ex of ejercicios) {
      const valor = Number(ex.answer)
      expect(Number.isInteger(valor)).toBe(true)
      expect(valor).toBeGreaterThanOrEqual(0)
    }
  })

  it('la incógnita cae a veces a la izquierda y a veces a la derecha', () => {
    // El libro escribe `25 = x − 56`; quien solo practicó una forma lee la otra
    // como una errata.
    const derecha = ejercicios.filter(ex => /^\d+ =/.test(algebraPayload(ex).expresion!))
    expect(derecha.length).toBeGreaterThan(0)
    expect(derecha.length).toBeLessThan(ejercicios.length)
  })
})

describe('inecuacion-balanza', () => {
  const ejercicios = muestrear('inecuacion-balanza')

  it('la balanza siempre está inclinada, nunca en equilibrio', () => {
    for (const ex of ejercicios) {
      expect(algebraPayload(ex).balanza!.estado).not.toBe('equilibrio')
    }
  })

  it('el signo de la respuesta concuerda con el platillo que baja', () => {
    for (const ex of ejercicios) {
      const { balanza } = algebraPayload(ex)
      // El lado con la incógnita es el izquierdo; si baja el derecho, pesa menos.
      const esperado = balanza!.estado === 'baja-derecha' ? '<' : '>'
      expect(ex.answer).toContain(esperado)
    }
  })
})

describe('menor-natural', () => {
  const ejercicios = muestrear('menor-natural')

  it('la respuesta es un natural mayor que cero', () => {
    for (const ex of ejercicios) {
      expect(Number(ex.answer)).toBeGreaterThan(0)
    }
  })

  it('el valor anterior está entre las opciones', () => {
    // Quien contesta el anterior entendió la ecuación pero no la desigualdad,
    // y esa confusión es justo lo que la pregunta busca.
    for (const ex of ejercicios) {
      expect(ex.options).toContain(String(Number(ex.answer) - 1))
    }
  })
})

describe('no-satisface', () => {
  const ejercicios = muestrear('no-satisface')

  it('exactamente una opción incumple la inecuación', () => {
    for (const ex of ejercicios) {
      const limite = Number(algebraPayload(ex).expresion!.match(/< (\d+)/)![1])
      const fallan = ex.options.filter(o => Number(o) >= limite)
      expect(fallan).toHaveLength(1)
      expect(fallan[0]).toBe(ex.answer)
    }
  })

  it('todas las opciones son números distintos', () => {
    for (const ex of ejercicios) {
      expect(new Set(ex.options).size).toBe(ex.options.length)
      for (const o of ex.options) expect(Number.isNaN(Number(o))).toBe(false)
    }
  })
})

describe('desigualdad', () => {
  const ejercicios = muestrear('desigualdad')

  it('solo ofrece los tres signos', () => {
    for (const ex of ejercicios) {
      expect(new Set(ex.options)).toEqual(new Set(['<', '>', '=']))
    }
  })

  it('el signo responde a la comparación real de las dos sumas', () => {
    for (const ex of ejercicios) {
      const [izq, der] = algebraPayload(ex).prompt!.split('?').map(numerosDe)
      const a = izq.reduce((x, y) => x + y, 0)
      const b = der.reduce((x, y) => x + y, 0)
      expect(ex.answer).toBe(a === b ? '=' : a > b ? '>' : '<')
    }
  })
})
