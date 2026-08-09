import { DEFAULT_TOPIC, isTopicId } from './topics'
import type { TopicId } from './topics/types'

const KEY = 'fracciones:topics'

export type TopicCategory = 'fracciones' | 'decimales' | 'mixto'

// La selección se recuerda entre sesiones, pero nunca puede impedir jugar: una
// selección corrupta, vacía o con temas que ya no existen vuelve al tema por
// defecto en vez de dejar al niño con la pantalla bloqueada.
export function loadTopics(): TopicId[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return [DEFAULT_TOPIC]
    const parsed: unknown = JSON.parse(raw)
    const valid = Array.isArray(parsed) ? parsed.filter(isTopicId) : []
    return valid.length > 0 ? valid : [DEFAULT_TOPIC]
  } catch {
    return [DEFAULT_TOPIC]
  }
}

export function saveTopics(topics: TopicId[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(topics))
  } catch {
    // Almacenamiento no disponible (navegación privada / cuota) — se pierde la
    // preferencia, pero eso jamás puede bloquear el juego.
  }
}

// Categoría con la que la partida entra a la tabla de posiciones. Se deriva de
// la selección: el jugador no la elige aparte.
export function topicCategory(topics: TopicId[]): TopicCategory {
  const unique = [...new Set(topics.filter(isTopicId))]
  if (unique.length === 0) return DEFAULT_TOPIC as TopicCategory
  if (unique.length > 1) return 'mixto'
  return unique[0] as TopicCategory
}
