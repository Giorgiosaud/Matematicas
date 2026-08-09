// Un decimal es un entero escalado: `units / 10^scale`. Nunca se opera con
// `number` fraccionario, porque 0.1 + 0.2 !== 0.3 en punto flotante y un niño
// no puede perder una pregunta por un artefacto de IEEE 754.
export interface Decimal {
  units: number
  scale: number
}

export const MAX_SCALE = 3

export function decimal(units: number, scale: number): Decimal {
  return { units, scale }
}

function pow10(n: number): number {
  return 10 ** n
}

// Lleva ambos números a la misma cantidad de cifras decimales para poder
// compararlos u operarlos como enteros.
function align(a: Decimal, b: Decimal): [number, number, number] {
  const scale = Math.max(a.scale, b.scale)
  return [a.units * pow10(scale - a.scale), b.units * pow10(scale - b.scale), scale]
}

export function parse(text: string): Decimal {
  const [whole, frac = ''] = text.trim().replace(',', '.').split('.')
  const sign = whole.startsWith('-') ? -1 : 1
  const wholeDigits = whole.replace('-', '') || '0'
  return decimal(sign * Number(`${wholeDigits}${frac}`), frac.length)
}

// Se escribe con coma, que es la notación decimal en español. Los ceros a la
// derecha se recortan: 0,50 y 0,5 son el mismo número y se muestran igual.
export function format(value: Decimal): string {
  const negative = value.units < 0
  const digits = String(Math.abs(value.units)).padStart(value.scale + 1, '0')
  const whole = digits.slice(0, digits.length - value.scale) || '0'
  const frac = value.scale > 0 ? digits.slice(digits.length - value.scale).replace(/0+$/, '') : ''
  return `${negative ? '-' : ''}${whole}${frac ? `,${frac}` : ''}`
}

export function compare(a: Decimal, b: Decimal): number {
  const [ua, ub] = align(a, b)
  return ua - ub
}

export function add(a: Decimal, b: Decimal): Decimal {
  const [ua, ub, scale] = align(a, b)
  return decimal(ua + ub, scale)
}

export function integerPart(value: Decimal): number {
  return Math.trunc(value.units / pow10(value.scale))
}

// Cifra que ocupa una posición decimal: digitAt(3,472 , 2) === 7 (centésimas).
export function digitAt(value: Decimal, position: number): number {
  if (position < 1 || position > value.scale) return 0
  return Math.floor(Math.abs(value.units) / pow10(value.scale - position)) % 10
}

// Redondeo al alza cuando la cifra siguiente es exactamente 5 — es la regla que
// se enseña en la escuela, y se aplica igual en todos los ejercicios del tema.
export function roundTo(value: Decimal, scale: number): Decimal {
  if (scale >= value.scale) return value
  const factor = pow10(value.scale - scale)
  const sign = value.units < 0 ? -1 : 1
  const abs = Math.abs(value.units)
  const rounded = Math.floor(abs / factor) + (abs % factor >= factor / 2 ? 1 : 0)
  return decimal(sign * rounded, scale)
}

// Solo las fracciones cuyo denominador se descompone en dos y cincos tienen
// decimal exacto; el resto es periódico y no entra en los ejercicios.
export function fromFraction(numerator: number, denominator: number): Decimal | null {
  let d = denominator
  while (d % 2 === 0) d /= 2
  while (d % 5 === 0) d /= 5
  if (d !== 1) return null

  for (let scale = 0; scale <= MAX_SCALE; scale++) {
    const units = (numerator * pow10(scale)) / denominator
    if (Number.isInteger(units)) return decimal(units, scale)
  }
  return null
}
