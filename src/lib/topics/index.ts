import type { Exercise, Topic, TopicId } from './types'
import { fracciones } from './fracciones'
import { decimales } from './decimales'

// Única fuente de verdad sobre qué temas existen. Agregar un tema es crear su
// carpeta y añadirlo aquí — ninguna pantalla de juego se entera.
export const TOPICS: Record<string, Topic> = {
  fracciones,
  decimales,
}

export const TOPIC_LIST: Topic[] = Object.values(TOPICS)

export const DEFAULT_TOPIC: TopicId = 'fracciones'

export function getTopic(id: TopicId): Topic {
  return TOPICS[id] ?? TOPICS[DEFAULT_TOPIC]
}

export function isTopicId(value: unknown): value is TopicId {
  return typeof value === 'string' && value in TOPICS
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

// Sortea primero el tema y después el generador dentro de él: un sorteo plano
// sobre todos los generadores daría más peso al tema que tenga más, y un niño
// que marca dos casillas espera verlas por igual.
export function generateExercise(round: number, topics: TopicId[] = [DEFAULT_TOPIC]): Exercise {
  const active = topics.filter(isTopicId)
  const topic = getTopic(active.length > 0 ? pick(active) : DEFAULT_TOPIC)
  const generate = pick(Object.values(topic.generators))
  return generate(round)
}

export function validateAnswer(exercise: Exercise, userInput: string): boolean {
  const normalize = (value: string) => value.trim().replace(/\s+/g, '').toLowerCase()
  return normalize(userInput) === normalize(exercise.answer)
}

export type { Exercise, Topic, TopicId }
