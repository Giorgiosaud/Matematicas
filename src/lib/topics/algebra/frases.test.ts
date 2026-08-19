import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { evaluar, formatear, tieneDivision } from './expresion'
import { PLANTILLAS, plantillaPorId, plantillasVecinas } from './frases'

function texto(id: string, v = 'x', n = 9, w = 'y') {
  const { frase, expr } = plantillaPorId(id).construir(v, n, w)
  return { frase, expresion: formatear(expr) }
}

describe('plantillas del libro', () => {
  it('escribe las expresiones como la tabla de la página 78', () => {
    expect(texto('doble').expresion).toBe('2x')
    expect(texto('triple').expresion).toBe('3x')
    expect(texto('mitad').expresion).toBe('x : 2')
    expect(texto('cuarta-parte').expresion).toBe('x : 4')
    expect(texto('triple-aumentado', 'n').expresion).toBe('3n + 9')
    expect(texto('sucesor', 'w').expresion).toBe('w + 1')
    expect(texto('antecesor', 'm').expresion).toBe('m − 1')
    expect(texto('suma-doble').expresion).toBe('x + 2x')
    expect(texto('suma-dos').expresion).toBe('x + y')
    expect(texto('producto-dos').expresion).toBe('x · y')
    expect(texto('tercera-menos-otro').expresion).toBe('x : 3 − y')
  })

  it('escribe los números de la frase en palabras, como el libro', () => {
    expect(texto('triple-aumentado').frase).toBe('El triple de un número aumentado en nueve unidades.')
    expect(texto('aumentado', 'x', 21).frase).toBe('Un número aumentado en veintiuna unidades.')
  })

  it('nombra la letra cuando la frase habla de ella', () => {
    expect(texto('sucesor', 'w').frase).toBe('El sucesor de w.')
  })
})

describe('el catálogo es consistente', () => {
  it('ningún id se repite', () => {
    const ids = PLANTILLAS.map(p => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('toda plantilla tiene vecinas y ninguna se apunta a sí misma', () => {
    for (const plantilla of PLANTILLAS) {
      const vecinas = plantillasVecinas(plantilla.id)
      expect(vecinas.length).toBeGreaterThan(0)
      expect(vecinas.map(v => v.id)).not.toContain(plantilla.id)
    }
  })

  it('las vecinas producen una expresión distinta de la original', () => {
    for (const plantilla of PLANTILLAS) {
      const propia = formatear(plantilla.construir('x', 9, 'y').expr)
      for (const vecina of plantillasVecinas(plantilla.id)) {
        expect(formatear(vecina.construir('x', 9, 'y').expr)).not.toBe(propia)
      }
    }
  })

  it('las vecinas producen una frase distinta de la original', () => {
    for (const plantilla of PLANTILLAS) {
      const propia = plantilla.construir('x', 9, 'y').frase
      for (const vecina of plantillasVecinas(plantilla.id)) {
        expect(vecina.construir('x', 9, 'y').frase).not.toBe(propia)
      }
    }
  })

  it('las plantillas de dos letras usan las dos', () => {
    for (const plantilla of PLANTILLAS.filter(p => p.letras === 2)) {
      const expresion = formatear(plantilla.construir('a', 9, 'b').expr)
      expect(expresion).toContain('a')
      expect(expresion).toContain('b')
    }
  })

  it('las plantillas de una letra no cuelan una segunda', () => {
    for (const plantilla of PLANTILLAS.filter(p => p.letras === 1)) {
      expect(formatear(plantilla.construir('a', 9, 'b').expr)).not.toContain('b')
    }
  })
})

// ── Propiedades ──────────────────────────────────────────────────────────────

const letraArb = fc.constantFrom('x', 'y', 'a', 'b', 'c', 'n', 's', 'w', 'z')
const nArb = fc.integer({ min: 2, max: 20 })
const plantillaArb = fc.constantFrom(...PLANTILLAS)

describe('propiedades del catálogo', () => {
  it('toda plantilla produce frase y expresión con cualquier letra y número', () => {
    fc.assert(fc.property(plantillaArb, letraArb, nArb, letraArb, (plantilla, v, n, w) => {
      const { frase, expr } = plantilla.construir(v, n, w)
      return frase.length > 0 && formatear(expr).length > 0
    }))
  })

  it('una plantilla sin división da siempre un valor entero', () => {
    // Ésta es la que se rompió: `tercera-menos-otro` divide pero su id no dice
    // «parte», así que el filtro por nombre la dejó pasar hasta valorizar y el
    // resultado salió fraccionario. Aquí la comprobación mira el árbol.
    fc.assert(fc.property(
      plantillaArb, letraArb, nArb, letraArb,
      fc.integer({ min: 1, max: 30 }), fc.integer({ min: 1, max: 30 }),
      (plantilla, v, n, w, valorV, valorW) => {
        const { expr } = plantilla.construir(v, n, w)
        fc.pre(!tieneDivision(expr))
        return Number.isInteger(evaluar(expr, { [v]: valorV, [w]: valorW }))
      },
    ))
  })

  it('las vecinas de una plantilla nunca coinciden con ella', () => {
    fc.assert(fc.property(plantillaArb, letraArb, nArb, letraArb, (plantilla, v, n, w) => {
      const propia = formatear(plantilla.construir(v, n, w).expr)
      return plantillasVecinas(plantilla.id).every(
        vecina => formatear(vecina.construir(v, n, w).expr) !== propia,
      )
    }))
  })

  it('ninguna frase deja un «undefined» suelto por un número sin traducir', () => {
    fc.assert(fc.property(plantillaArb, letraArb, nArb, letraArb, (plantilla, v, n, w) =>
      !plantilla.construir(v, n, w).frase.includes('undefined'),
    ))
  })
})
