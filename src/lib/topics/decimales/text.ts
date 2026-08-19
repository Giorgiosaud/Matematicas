import type { Exercise } from '../types'
import { decimalesPayload } from './generators'
import { digitAt, format } from './decimal'
import { nombrePosicion } from './lectura'
import { numeroEnPalabras } from '../../palabras'

export function describe(exercise: Exercise): string {
  const { targetScale } = decimalesPayload(exercise)
  if (exercise.type === 'leer') return '¿Cómo se lee este número?'
  if (exercise.type === 'escribir') return 'Escríbelo en cifras'
  if (exercise.type === 'comparar') return '¿Mayor >, menor < o igual =?'
  if (exercise.type === 'fraccion-a-decimal') return 'Conviértelo a decimal'
  if (exercise.type === 'decimal-a-fraccion') return 'Conviértelo a fracción'
  if (exercise.type === 'redondear') return `Redondea a las ${nombrePosicion(targetScale!, true)}`
  return '¿Cuánto vale la cifra marcada?'
}

export function hint(exercise: Exercise): string {
  const { value, other, fraction, targetScale, position } = decimalesPayload(exercise)

  if (exercise.type === 'leer' || exercise.type === 'escribir') {
    return `Pista: la primera cifra después de la coma son las décimas, la segunda las centésimas y la tercera las milésimas`
  }
  if (exercise.type === 'comparar') {
    return `Pista: compara cifra por cifra desde la coma hacia la derecha — ${format(value)} y ${format(other!)} — y completa con ceros la que tenga menos cifras`
  }
  if (exercise.type === 'fraccion-a-decimal') {
    return `Pista: divide ${fraction!.numerator} entre ${fraction!.denominator}, o amplía la fracción hasta que el denominador sea 10, 100 o 1000`
  }
  if (exercise.type === 'decimal-a-fraccion') {
    return `Pista: ${format(value)} son ${numeroEnPalabras(Math.abs(value.units) % 10 ** value.scale, true)} ${nombrePosicion(value.scale, true)}; escríbelo sobre ${10 ** value.scale} y simplifica`
  }
  if (exercise.type === 'redondear') {
    const siguiente = digitAt(value, targetScale! + 1)
    return `Pista: mira la cifra que sigue a las ${nombrePosicion(targetScale!, true)} — es ${siguiente}. Si es 5 o más, subes una; si es menos, la dejas igual`
  }
  const cifra = digitAt(value, position!)
  return `Pista: cuenta las posiciones desde la coma. El ${cifra} está en la posición ${position}, así que son ${nombrePosicion(position!, true)}`
}
