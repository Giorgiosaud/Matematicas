import type { Exercise, Topic, TopicId } from './types'
import { fracciones } from './fracciones'
import { decimales } from './decimales'
import { algebra } from './algebra'

// Única fuente de verdad sobre qué temas existen. Agregar un tema es crear su
// carpeta y añadirlo aquí — ninguna pantalla de juego se entera.
export const TOPICS: Record<string, Topic> = {
  fracciones,
  decimales,
  algebra,
}

export const TOPIC_LIST: Topic[] = Object.values(TOPICS)

export const DEFAULT_TOPIC: TopicId = 'fracciones'

// Con tres temas registrados, arrancar solo en fracciones deja fuera por
// defecto justo lo que el niño está estudiando. Un dispositivo nuevo empieza
// con todo marcado y el que quiera concentrarse desmarca.
export const DEFAULT_TOPICS: TopicId[] = TOPIC_LIST.map(t => t.id)

export function getTopic(id: TopicId): Topic {
  return isTopicId(id) ? TOPICS[id] : TOPICS[DEFAULT_TOPIC]
}

// `Object.hasOwn` y no `in`: con `in`, cualquier propiedad heredada de Object
// ('constructor', 'toString') pasaría por tema válido, y una selección
// guardada corrupta acabaría intentando generar ejercicios con una función
// del prototipo.
export function isTopicId(value: unknown): value is TopicId {
  return typeof value === 'string' && Object.hasOwn(TOPICS, value)
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

// Sortea primero el tema y después el generador dentro de él: un sorteo plano
// sobre todos los generadores daría más peso al tema que tenga más, y un niño
// que marca dos casillas espera verlas por igual.
//
// Con `indice` —el número de pregunta— los temas se reparten por turnos en vez
// de sortearse cada vez. Sortear cada pregunta por separado da la proporción
// correcta sólo a la larga: en una partida de diez preguntas con tres temas,
// un 6-2-2 es perfectamente posible y deja al niño casi sin practicar dos de
// los tres. Por turnos, diez preguntas son 4-3-3 siempre.
//
// El orden rota una posición en cada vuelta para que no salga siempre el mismo
// tema primero.
function temaDeTurno(activos: TopicId[], indice: number): TopicId {
  const n = activos.length
  const vuelta = Math.floor(indice / n)
  return activos[(indice + vuelta) % n]
}

export function generateExercise(round: number, topics: TopicId[] = DEFAULT_TOPICS, indice?: number): Exercise {
  const active = topics.filter(isTopicId)
  if (active.length === 0) return getTopic(DEFAULT_TOPIC).generators[Object.keys(getTopic(DEFAULT_TOPIC).generators)[0]](round)
  const elegido = indice === undefined ? pick(active) : temaDeTurno(active, indice)
  const topic = getTopic(elegido)
  const generate = pick(Object.values(topic.generators))
  return generate(round)
}

export function validateAnswer(exercise: Exercise, userInput: string): boolean {
  const normalize = (value: string) => value.trim().replace(/\s+/g, '').toLowerCase()
  return normalize(userInput) === normalize(exercise.answer)
}

export type { Exercise, Topic, TopicId }
