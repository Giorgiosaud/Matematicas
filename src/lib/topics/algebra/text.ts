import type { Exercise } from '../types'
import { algebraPayload } from './generators'
import { describirPatron } from './secuencia'

// Los ordinales como los escribe el libro: «el 8.º término», «el 100.º término».
export function ordinal(posicion: number): string {
  return `${posicion}.º`
}

export function describe(exercise: Exercise): string {
  const { posicionPedida } = algebraPayload(exercise)
  switch (exercise.type) {
    case 'patron':
      return '¿Cuál es el patrón de formación?'
    case 'completar':
      return '¿Qué término falta?'
    case 'termino-lejano':
      return `¿Cuál es el ${ordinal(posicionPedida ?? 0)} término?`
    case 'construir':
      return 'Escribe los 5 primeros términos'
    default:
      return 'Resuelve'
  }
}

export function hint(exercise: Exercise): string {
  const { secuencia, posicionPedida } = algebraPayload(exercise)
  if (!secuencia) return ''

  switch (exercise.type) {
    case 'patron':
      return `Pista: mira qué le pasa a un término para llegar al siguiente, y comprueba que sirva para todos.`
    case 'completar':
      return `Pista: el patrón es «${describirPatron(secuencia).toLowerCase()}» — aplícalo al término anterior.`
    case 'termino-lejano': {
      const saltos = (posicionPedida ?? 1) - 1
      return `Pista: del 1.º al ${ordinal(posicionPedida ?? 0)} hay ${saltos} saltos, no ${posicionPedida}. No hace falta escribirlos todos.`
    }
    case 'construir':
      return `Pista: el primer término se escribe tal cual; el patrón se aplica a partir del segundo.`
    default:
      return ''
  }
}
