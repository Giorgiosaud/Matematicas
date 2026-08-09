import type { Exercise } from '../types'
import { fraccionesPayload } from './generators'

// Enunciados y pistas viven aparte del renderizado: no son componentes, y
// mezclarlos rompía el fast refresh de Vite.

export function describe(exercise: Exercise): string {
  if (exercise.type === 'compare') return '¿Mayor >, menor < o igual =?'
  if (exercise.type === 'simplify') return 'Simplifica la fracción'
  if (exercise.type === 'amplify') return '¿Cuál es el numerador que falta?'
  if (exercise.type === 'add') return 'Suma las fracciones'
  if (exercise.type === 'subtract') return 'Resta las fracciones'
  return 'Convierte a número mixto'
}

export function hint(exercise: Exercise): string {
  const { fractionA, fractionB, targetDenominator } = fraccionesPayload(exercise)

  if (exercise.type === 'compare') {
    const b = fractionB!
    const da = (fractionA.numerator / fractionA.denominator).toFixed(2)
    const db = (b.numerator / b.denominator).toFixed(2)
    return `Pista: convierte a decimal → ${fractionA.numerator}/${fractionA.denominator} = ${da}  y  ${b.numerator}/${b.denominator} = ${db}`
  }
  if (exercise.type === 'simplify') {
    return `Pista: busca el MCD de ${fractionA.numerator} y ${fractionA.denominator}, luego divide ambos por él`
  }
  if (exercise.type === 'amplify') {
    const factor = targetDenominator! / fractionA.denominator
    return `Pista: ${fractionA.denominator} × ${factor} = ${targetDenominator}, así que el numerador es ${fractionA.numerator} × ${factor}`
  }
  if (exercise.type === 'add' || exercise.type === 'subtract') {
    const b = fractionB!
    const op = exercise.type === 'add' ? '+' : '−'
    return `Pista: busca un denominador común, transforma ambas fracciones y luego ${exercise.type === 'add' ? 'suma' : 'resta'} los numeradores: ${fractionA.numerator}/${fractionA.denominator} ${op} ${b.numerator}/${b.denominator}`
  }
  // mixed
  const { numerator: n, denominator: d } = fractionA
  const whole = Math.floor(n / d)
  const rem = n % d
  return `Pista: ${n} ÷ ${d} = ${whole} (resto ${rem}), entonces es ${whole} y ${rem}/${d}`
}
