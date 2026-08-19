import type { Decimal } from './decimal'
import { numeroEnPalabras } from '../../palabras'
import { integerPart } from './decimal'

const POSICIONES: Record<number, string> = { 1: 'décima', 2: 'centésima', 3: 'milésima' }

export function nombrePosicion(scale: number, plural: boolean): string {
  const nombre = POSICIONES[scale]
  return plural ? `${nombre}s` : nombre
}

// Lectura por posición — "tres enteros y cuatro décimas" — que es la que
// practica el vocabulario del tema, en vez de "tres coma cuatro".
export function leerDecimal(value: Decimal): string {
  const entero = integerPart(value)
  const fraccion = Math.abs(value.units) % 10 ** value.scale

  if (value.scale === 0 || fraccion === 0) return numeroEnPalabras(Math.abs(value.units) / 10 ** value.scale)

  const parteDecimal = `${numeroEnPalabras(fraccion, true)} ${nombrePosicion(value.scale, fraccion !== 1)}`
  if (entero === 0) return parteDecimal

  const enteroEnPalabras = entero === 1 ? 'un' : numeroEnPalabras(entero)
  return `${enteroEnPalabras} ${entero === 1 ? 'entero' : 'enteros'} y ${parteDecimal}`
}
