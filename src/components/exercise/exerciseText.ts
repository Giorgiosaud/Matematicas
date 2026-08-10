import type { Exercise } from '../../lib/types'
import { getTopic } from '../../lib/topics'

// El enunciado y la pista los pone cada tema. Viven fuera del archivo de
// componentes para no romper el fast refresh de Vite.

export function exerciseLabel(exercise: Exercise): string {
  return getTopic(exercise.topic).describe(exercise)
}

export function buildHint(exercise: Exercise): string {
  return getTopic(exercise.topic).hint(exercise)
}
