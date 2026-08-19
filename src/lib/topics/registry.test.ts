import { describe, it, expect } from 'vitest'
import { TOPICS, TOPIC_LIST, generateExercise, getTopic, isTopicId } from './index'
import type { Exercise } from './types'

const ROUNDS = [1, 2, 3, 5, 8, 13]
const SAMPLES = 25

// Esta prueba es genérica a propósito: recorre lo que haya en el registro, así
// que un tema nuevo queda cubierto por el solo hecho de registrarse.
describe('registro de temas', () => {
  it('expone al menos un tema', () => {
    expect(TOPIC_LIST.length).toBeGreaterThan(0)
  })

  it.each(TOPIC_LIST.map(t => [t.id, t] as const))('%s cumple el contrato de tema', (_id, topic) => {
    expect(topic.id).toMatch(/^[a-z][a-z0-9-]*$/)
    expect(topic.label.length).toBeGreaterThan(0)
    expect(Object.keys(topic.generators).length).toBeGreaterThan(0)
    expect(typeof topic.Render).toBe('function')
    expect(typeof topic.describe).toBe('function')
    expect(typeof topic.hint).toBe('function')
  })

  it('el id de cada tema coincide con su llave en el registro', () => {
    for (const [key, topic] of Object.entries(TOPICS)) {
      expect(topic.id).toBe(key)
    }
  })
})

function eachGenerator() {
  return TOPIC_LIST.flatMap(topic =>
    Object.entries(topic.generators).map(([type, generate]) =>
      [`${topic.id}/${type}`, topic.id, generate] as const
    )
  )
}

describe.each(eachGenerator())('generador %s', (_name, topicId, generate) => {
  const samples: Exercise[] = ROUNDS.flatMap(round =>
    Array.from({ length: SAMPLES }, () => generate(round))
  )

  it('marca el ejercicio con su propio tema', () => {
    for (const ex of samples) expect(ex.topic).toBe(topicId)
  })

  it('incluye la respuesta correcta entre las opciones, exactamente una vez', () => {
    for (const ex of samples) {
      expect(ex.options.filter(o => o === ex.displayAnswer)).toHaveLength(1)
    }
  })

  it('ofrece al menos dos opciones y ninguna repetida', () => {
    for (const ex of samples) {
      expect(ex.options.length).toBeGreaterThanOrEqual(2)
      expect(new Set(ex.options).size).toBe(ex.options.length)
    }
  })

  it('no deja campos vacíos', () => {
    for (const ex of samples) {
      expect(ex.type.length).toBeGreaterThan(0)
      expect(String(ex.answer).length).toBeGreaterThan(0)
      expect(ex.displayAnswer.length).toBeGreaterThan(0)
      expect(ex.payload).toBeDefined()
    }
  })
})

describe('generateExercise', () => {
  it('solo produce ejercicios de los temas activos', () => {
    for (const topic of TOPIC_LIST) {
      for (let i = 0; i < 40; i++) {
        expect(generateExercise(1, [topic.id]).topic).toBe(topic.id)
      }
    }
  })

  it('mezcla los temas cuando hay más de uno activo', () => {
    if (TOPIC_LIST.length < 2) return
    const ids = TOPIC_LIST.map(t => t.id)
    const seen = new Set<string>()
    for (let i = 0; i < 400; i++) seen.add(generateExercise(1, ids).topic)
    expect(seen.size).toBe(ids.length)
  })

  it('cae a fracciones cuando la lista de temas viene vacía', () => {
    expect(generateExercise(1, []).topic).toBe('fracciones')
  })
})

describe('isTopicId', () => {
  it('acepta los temas registrados', () => {
    for (const topic of TOPIC_LIST) expect(isTopicId(topic.id)).toBe(true)
  })

  it('rechaza las propiedades heredadas de Object', () => {
    // Con el operador `in` en vez de Object.hasOwn, 'constructor' pasaría por
    // tema válido y getTopic devolvería una función del prototipo.
    expect(isTopicId('constructor')).toBe(false)
    expect(isTopicId('toString')).toBe(false)
    expect(isTopicId('__proto__')).toBe(false)
  })

  it('rechaza cualquier otra cosa', () => {
    expect(isTopicId('geometria')).toBe(false)
    expect(isTopicId(undefined)).toBe(false)
    expect(isTopicId(3)).toBe(false)
  })
})

describe('getTopic', () => {
  it('cae al tema por defecto ante un id heredado del prototipo', () => {
    expect(getTopic('constructor' as never).id).toBe('fracciones')
  })
})

describe('reparto de temas por turnos', () => {
  it('con tres temas, treinta preguntas dan diez de cada uno', () => {
    // Sortear cada pregunta por separado da la proporción correcta sólo a la
    // larga: en una partida corta un 6-2-2 es perfectamente posible y deja al
    // niño casi sin practicar dos de los tres temas.
    const conteo: Record<string, number> = {}
    for (let i = 0; i < 30; i++) {
      const ex = generateExercise(1, ['fracciones', 'decimales', 'algebra'], i)
      conteo[ex.topic] = (conteo[ex.topic] ?? 0) + 1
    }
    expect(conteo).toEqual({ fracciones: 10, decimales: 10, algebra: 10 })
  })

  it('con dos temas, diez preguntas dan cinco de cada uno', () => {
    const conteo: Record<string, number> = {}
    for (let i = 0; i < 10; i++) {
      const ex = generateExercise(1, ['decimales', 'algebra'], i)
      conteo[ex.topic] = (conteo[ex.topic] ?? 0) + 1
    }
    expect(conteo).toEqual({ decimales: 5, algebra: 5 })
  })

  it('no empieza siempre por el mismo tema: el orden rota en cada vuelta', () => {
    const temas = ['fracciones', 'decimales', 'algebra'] as const
    const primeros = [0, 3, 6].map(i => generateExercise(1, [...temas], i).topic)
    expect(new Set(primeros).size).toBeGreaterThan(1)
  })

  it('sin índice sigue sorteando, para quien lo llame sin número de pregunta', () => {
    const vistos = new Set<string>()
    for (let i = 0; i < 200; i++) vistos.add(generateExercise(1, ['fracciones', 'algebra']).topic)
    expect(vistos.size).toBe(2)
  })

  it('un solo tema no se ve afectado', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateExercise(1, ['algebra'], i).topic).toBe('algebra')
    }
  })
})
