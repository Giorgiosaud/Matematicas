import { describe, it, expect } from 'vitest'
import { TOPICS, TOPIC_LIST, generateExercise } from './index'
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
