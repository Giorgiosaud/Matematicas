import type { Exercise } from '../types'
import { problemasPayload } from './generators'

export function describe(exercise: Exercise): string {
  switch (exercise.type) {
    case 'resultado':
      return 'Lee y resuelve'
    case 'que-operacion':
      return '¿Qué operación lo resuelve?'
    default:
      return 'Lee y resuelve'
  }
}

// Al corregir sí se dice con qué se resuelve. Ocultarlo en el enunciado es el
// ejercicio; ocultarlo también aquí sería esconder la lección.
const COMO_SE_RESUELVE: Record<string, string> = {
  decimales: 'se resuelve sumando o restando decimales — alinea las comas antes de operar',
  fracciones: 'se resuelve con una parte del total: divide entre el de abajo y multiplica por el de arriba',
  ecuacion: 'se resuelve buscando el dato que falta: lo que hay más lo que falta da el total',
  inecuacion: 'se resuelve viendo cuánto cabe todavía, o cuánto falta para pasar del límite',
}

export function hint(exercise: Exercise): string {
  const { tecnica, operacion } = problemasPayload(exercise)
  const como = COMO_SE_RESUELVE[tecnica] ?? ''
  if (exercise.type === 'que-operacion') {
    return `Pista: ${como}. Fíjate en qué te preguntan, no en los números.`
  }
  return `Pista: ${como}. La cuenta es ${operacion}.`
}
