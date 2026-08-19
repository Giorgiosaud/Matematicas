import { describe, expect, it } from 'vitest'
import { getRandomJoke, jokes } from './jokes'

describe('el catálogo de chistes', () => {
  it('no repite ningún remate', () => {
    // Con más de cincuenta entradas, meter dos veces el mismo chiste es fácil
    // y solo se nota jugando.
    const remates = jokes.map(j => j.punchline)
    expect(new Set(remates).size).toBe(remates.length)
  })

  it('no repite ninguna pregunta', () => {
    const preguntas = jokes.map(j => j.setup)
    expect(new Set(preguntas).size).toBe(preguntas.length)
  })

  it('todos tienen pregunta y remate, y ninguno queda a medias', () => {
    for (const joke of jokes) {
      expect(joke.setup.trim().length).toBeGreaterThan(0)
      expect(joke.punchline.trim().length).toBeGreaterThan(0)
      expect(joke.punchline.trim()).toMatch(/[.!?…]$/)
    }
  })

  it('las preguntas que empiezan con «¿» también la cierran', () => {
    for (const joke of jokes) {
      if (joke.setup.startsWith('¿')) expect(joke.setup).toContain('?')
    }
  })
})

describe('getRandomJoke', () => {
  it('nunca devuelve el mismo dos veces seguidas', () => {
    let anterior = getRandomJoke()
    for (let i = 0; i < 500; i++) {
      const actual = getRandomJoke()
      expect(actual.setup).not.toBe(anterior.setup)
      anterior = actual
    }
  })

  it('con el tiempo saca variedad y no se queda en dos o tres', () => {
    const vistos = new Set<string>()
    for (let i = 0; i < 800; i++) vistos.add(getRandomJoke().setup)
    expect(vistos.size).toBeGreaterThan(jokes.length * 0.8)
  })
})

describe('los chistes en inglés', () => {
  const ingleses = jokes.filter(j => /^(Why|What|How|Where)\b/.test(j.setup))

  it('hay unos cuantos, no uno suelto perdido entre cincuenta', () => {
    // Uno solo se leería como un error de traducción; un grupo se lee como lo
    // que es, una decisión.
    expect(ingleses.length).toBeGreaterThanOrEqual(10)
  })

  it('no llevan signos de apertura españoles', () => {
    for (const joke of ingleses) {
      expect(joke.setup).not.toContain('¿')
      expect(joke.punchline).not.toContain('¡')
    }
  })

  it('son minoría: el juego sigue siendo en español', () => {
    expect(ingleses.length).toBeLessThan(jokes.length / 2)
  })
})
