import type { Exercise } from '../types'
import type { FractionValue } from '../../types'
import { simplifyFraction, fractionToString } from '../../fractions'
import type { Decimal } from './decimal'
import { compare, decimal, digitAt, format, fromFraction, roundTo } from './decimal'
import { leerDecimal, nombrePosicion } from './lectura'
import { numeroEnPalabras } from '../../palabras'

export interface DecimalesPayload {
  value: Decimal
  other?: Decimal
  fraction?: FractionValue
  targetScale?: number
  position?: number
  // Enunciado ya resuelto cuando el ejercicio se plantea con palabras
  // ("veinticinco centésimas") en vez de con cifras.
  prompt?: string
}

// Único punto de estrechamiento del payload en el tema.
export function decimalesPayload(exercise: Exercise): DecimalesPayload {
  return exercise.payload as DecimalesPayload
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Cuántas cifras decimales admite la ronda: se empieza por décimas y se llega
// a milésimas cuando el juego ya va avanzado.
function maxScale(round: number): number {
  if (round <= 2) return 1
  if (round <= 5) return 2
  return 3
}

function randomDecimal(round: number, { withInteger = false } = {}): Decimal {
  const scale = randInt(1, maxScale(round))
  const frac = randInt(1, 10 ** scale - 1)
  const whole = withInteger && Math.random() < 0.6 ? randInt(1, 9) : 0
  return decimal(whole * 10 ** scale + frac, scale)
}

// Arma las opciones garantizando que la correcta aparezca exactamente una vez
// y que no haya repetidas — el contrato que registry.test.ts verifica.
function buildOptions(correct: string, candidates: string[], total = 4): string[] {
  const distractors: string[] = []
  for (const candidate of candidates) {
    if (candidate !== correct && !distractors.includes(candidate)) distractors.push(candidate)
    if (distractors.length >= total - 1) break
  }
  return shuffle([correct, ...distractors])
}

function make(type: string, answer: string, options: string[], payload: DecimalesPayload): Exercise {
  return { topic: 'decimales', type, answer, displayAnswer: answer, options, payload }
}

// Mismo número leído en la posición vecina: 0,3 → "tres centésimas". Es el
// error que estos ejercicios buscan cazar, así que siempre está entre las
// opciones.
function lecturaVecina(value: Decimal, delta: number): string | null {
  const scale = value.scale + delta
  if (scale < 1 || scale > 3) return null
  return leerDecimal(decimal(value.units, scale))
}

function cifraVecina(value: Decimal, delta: number): string | null {
  const scale = value.scale + delta
  if (scale < 1 || scale > 4) return null
  return format(decimal(value.units, scale))
}

// ── Leer y escribir ──────────────────────────────────────────────────────────

function makeLeer(round: number): Exercise {
  const value = randomDecimal(round, { withInteger: true })
  const answer = leerDecimal(value)
  const candidates = [
    lecturaVecina(value, 1),
    lecturaVecina(value, -1),
    leerDecimal(decimal(value.units + 1, value.scale)),
    leerDecimal(decimal(Math.max(1, value.units - 1), value.scale)),
  ].filter((c): c is string => c !== null)
  return make('leer', answer, buildOptions(answer, candidates), { value })
}

function makeEscribir(round: number): Exercise {
  const value = randomDecimal(round, { withInteger: true })
  const answer = format(value)
  const candidates = [
    cifraVecina(value, 1),
    cifraVecina(value, -1),
    format(decimal(value.units + 1, value.scale)),
    format(decimal(value.units * 10, value.scale)),
  ].filter((c): c is string => c !== null)
  return make('escribir', answer, buildOptions(answer, candidates), {
    value,
    prompt: leerDecimal(value),
  })
}

// ── Comparar ─────────────────────────────────────────────────────────────────

function makeComparar(round: number): Exercise {
  const a = randomDecimal(round)
  // En rondas avanzadas los números se parecen: cambiar solo la última cifra
  // obliga a mirar la posición, que es donde está la dificultad real.
  const parecido = round > 2 && Math.random() < 0.6
  const b = parecido
    ? decimal(Math.max(1, a.units + randInt(-3, 3)), randInt(1, maxScale(round)))
    : randomDecimal(round)
  const cmp = compare(a, b)
  const answer = cmp > 0 ? '>' : cmp < 0 ? '<' : '='
  return make('comparar', answer, shuffle(['>', '<', '=']), { value: a, other: b })
}

// ── Convertir fracción ↔ decimal ─────────────────────────────────────────────

const DENOMINADORES_EXACTOS = [2, 4, 5, 8, 10, 20, 25, 50]

function fraccionExacta(round: number): { fraction: FractionValue; value: Decimal } {
  const pool = round <= 2 ? [2, 4, 5, 10] : DENOMINADORES_EXACTOS
  for (let i = 0; i < 20; i++) {
    const denominator = pool[randInt(0, pool.length - 1)]
    const numerator = randInt(1, denominator - 1)
    const value = fromFraction(numerator, denominator)
    if (value) return { fraction: { numerator, denominator }, value }
  }
  return { fraction: { numerator: 1, denominator: 2 }, value: decimal(5, 1) }
}

function makeFraccionADecimal(round: number): Exercise {
  const { fraction, value } = fraccionExacta(round)
  const answer = format(value)
  const candidates = [
    cifraVecina(value, 1),
    cifraVecina(value, -1),
    format(decimal(value.units + 1, value.scale)),
    format(decimal(fraction.numerator * 10 + fraction.denominator, 2)),
  ].filter((c): c is string => c !== null)
  return make('fraccion-a-decimal', answer, buildOptions(answer, candidates), { value, fraction })
}

function makeDecimalAFraccion(round: number): Exercise {
  const { fraction, value } = fraccionExacta(round)
  const simplificada = simplifyFraction(fraction)
  const answer = fractionToString(simplificada)
  const candidates = [
    fractionToString(simplifyFraction({ numerator: simplificada.numerator + 1, denominator: simplificada.denominator })),
    fractionToString(simplifyFraction({ numerator: simplificada.denominator, denominator: simplificada.numerator })),
    fractionToString(simplifyFraction({ numerator: simplificada.numerator, denominator: simplificada.denominator * 2 })),
    fractionToString(simplifyFraction({ numerator: simplificada.numerator * 2, denominator: simplificada.denominator + 1 })),
  ]
  return make('decimal-a-fraccion', answer, buildOptions(answer, candidates), { value, fraction })
}

// ── Redondear y valor posicional ─────────────────────────────────────────────

function makeRedondear(round: number): Exercise {
  const scale = Math.max(2, maxScale(round))
  const value = decimal(randInt(1, 9) * 10 ** scale + randInt(1, 10 ** scale - 1), scale)
  const targetScale = randInt(1, scale - 1)
  const answer = format(roundTo(value, targetScale))
  const candidates = [
    // truncar en vez de redondear: el error clásico
    format(decimal(Math.floor(value.units / 10 ** (scale - targetScale)), targetScale)),
    format(roundTo(value, targetScale + 1)),
    format(decimal(Math.floor(value.units / 10 ** (scale - targetScale)) + 2, targetScale)),
    format(decimal(value.units, scale)),
  ]
  return make('redondear', answer, buildOptions(answer, candidates), { value, targetScale })
}

function makeValorPosicional(round: number): Exercise {
  const scale = Math.max(2, maxScale(round))
  const value = decimal(randInt(1, 9) * 10 ** scale + randInt(1, 10 ** scale - 1), scale)
  // Se pregunta por una cifra distinta de cero: "cero décimas" es una respuesta
  // válida pero no enseña nada, y deja el ejercicio sin sustancia.
  const posiciones = Array.from({ length: scale }, (_, i) => i + 1).filter(p => digitAt(value, p) !== 0)
  const position = posiciones.length > 0 ? posiciones[randInt(0, posiciones.length - 1)] : 1
  const digit = digitAt(value, position)
  const nombrar = (n: number, pos: number) => `${numeroEnPalabras(n, true)} ${nombrePosicion(pos, n !== 1)}`
  const answer = nombrar(digit, position)
  const candidates = [
    position + 1 <= 3 ? nombrar(digit, position + 1) : null,
    position - 1 >= 1 ? nombrar(digit, position - 1) : null,
    nombrar(digit === 9 ? 1 : digit + 1, position),
  ].filter((c): c is string => c !== null)
  return make('valor-posicional', answer, buildOptions(answer, candidates), { value, position })
}

export const generators: Record<string, (round: number) => Exercise> = {
  leer: makeLeer,
  escribir: makeEscribir,
  comparar: makeComparar,
  'fraccion-a-decimal': makeFraccionADecimal,
  'decimal-a-fraccion': makeDecimalAFraccion,
  redondear: makeRedondear,
  'valor-posicional': makeValorPosicional,
}
