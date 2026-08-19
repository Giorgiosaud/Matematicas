import { describe, expect, it } from 'vitest'
import { CONTEXTOS, type Contexto } from './contextos'

const VECES = 60

function generarMuchas(ctx: Contexto) {
  return Array.from({ length: VECES }, () => ctx.construir())
}

// Las palabras que delatarían con qué se resuelve. Decidirlo es el ejercicio.
const DELATORES = [
  'fracción', 'fracciones', 'fraccion',
  'decimal', 'decimales',
  'ecuación', 'ecuacion',
  'inecuación', 'inecuacion',
  'incógnita', 'incognita',
  'desigualdad',
]

describe('el catálogo de contextos', () => {
  it('tiene ids únicos', () => {
    const ids = CONTEXTOS.map(c => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('cubre las cuatro técnicas y ninguna se come más de la mitad', () => {
    const porTecnica: Record<string, number> = {}
    for (const c of CONTEXTOS) porTecnica[c.tecnica] = (porTecnica[c.tecnica] ?? 0) + 1
    for (const t of ['decimales', 'fracciones', 'ecuacion', 'inecuacion']) {
      expect(porTecnica[t] ?? 0).toBeGreaterThan(0)
      expect(porTecnica[t]).toBeLessThanOrEqual(CONTEXTOS.length / 2)
    }
  })
})

describe.each(CONTEXTOS.map(c => [c.id, c] as const))('contexto %s', (_id, ctx) => {
  const problemas = generarMuchas(ctx)

  it('nunca nombra la técnica en el enunciado', () => {
    for (const p of problemas) {
      const texto = p.enunciado.toLowerCase()
      for (const palabra of DELATORES) expect(texto).not.toContain(palabra)
    }
  })

  it('el enunciado termina en una pregunta', () => {
    for (const p of problemas) expect(p.enunciado.trim()).toMatch(/\?$/)
  })

  it('las cantidades caen dentro de lo creíble para la situación', () => {
    for (const p of problemas) {
      for (const cantidad of p.cantidades) {
        expect(cantidad).toBeGreaterThanOrEqual(ctx.limites.min)
        expect(cantidad).toBeLessThanOrEqual(ctx.limites.max)
      }
    }
  })

  it('la respuesta está dentro del temario: no negativa y hasta tres decimales', () => {
    for (const p of problemas) {
      expect(p.respuesta).toBeGreaterThanOrEqual(0)
      expect(Math.round(p.respuesta * 1000)).toBeCloseTo(p.respuesta * 1000, 6)
    }
  })

  it('la respuesta no es trivial', () => {
    // Una resta que da cero o un problema cuya respuesta es un dato del
    // enunciado se resuelve sin entenderlo.
    for (const p of problemas) {
      expect(p.respuesta).not.toBe(0)
      expect(p.cantidades).not.toContain(p.respuesta)
    }
  })

  it('los números del enunciado aparecen en la operación', () => {
    for (const p of problemas) expect(p.operacion.length).toBeGreaterThan(0)
  })

  it('ofrece al menos dos formas de equivocarse, y ninguna coincide con la respuesta', () => {
    for (const p of problemas) {
      expect(p.errores.length).toBeGreaterThanOrEqual(2)
      for (const error of p.errores) {
        expect(error.valor).not.toBe(p.respuesta)
        expect(error.operacion.length).toBeGreaterThan(0)
      }
    }
  })

  it('dos apariciones seguidas no son idénticas', () => {
    const enunciados = new Set(problemas.map(p => p.enunciado))
    expect(enunciados.size).toBeGreaterThan(1)
  })
})

describe('la notación es la del libro', () => {
  it('las operaciones no usan aspa ni el signo de dividir de la calculadora', () => {
    // El libro divide con dos puntos y multiplica con punto medio.
    for (const ctx of CONTEXTOS) {
      for (let i = 0; i < 10; i++) {
        const p = ctx.construir()
        const textos = [p.operacion, ...p.errores.map(e => e.operacion)]
        for (const t of textos) {
          expect(t).not.toContain('×')
          expect(t).not.toContain('÷')
          expect(t).not.toContain('*')
        }
      }
    }
  })

  it('las operaciones se escriben como operaciones, no como frases', () => {
    // Una opción en prosa entre opciones matemáticas se descarta sin resolver.
    for (const ctx of CONTEXTOS) {
      for (let i = 0; i < 10; i++) {
        const p = ctx.construir()
        for (const t of [p.operacion, ...p.errores.map(e => e.operacion)]) {
          expect(t).toMatch(/^[\d\s,.:·+−()]+$/)
        }
      }
    }
  })
})
