import type { Exercise } from '../types'
import type { Contexto, ProblemaGenerado, Tecnica } from './contextos'
import { CONTEXTOS, numero, randInt } from './contextos'

export interface ProblemasPayload {
  enunciado: string
  // De qué técnica es. Sirve para la pista y para las pruebas de cobertura;
  // **nunca** llega al enunciado: decidirlo es el ejercicio.
  tecnica: Tecnica
  // La operación que lo resuelve, para explicarlo al corregir.
  operacion: string
}

// Único punto de estrechamiento del payload en el tema.
export function problemasPayload(exercise: Exercise): ProblemasPayload {
  return exercise.payload as ProblemasPayload
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// La unidad va donde se escribe en Chile: el peso delante, todo lo demás detrás.
function conUnidad(valor: number, unidad?: string): string {
  if (!unidad) return numero(valor)
  return unidad === '$' ? `$${numero(valor)}` : `${numero(valor)} ${unidad}`
}

// Las primeras rondas se quedan con los problemas de respuesta entera: un
// resultado con coma añade una dificultad que no es la que el ejercicio mide.
function contextoDeRonda(round: number): { ctx: Contexto; problema: ProblemaGenerado } {
  for (let intento = 0; intento < 40; intento++) {
    const ctx = pick(CONTEXTOS)
    const problema = ctx.construir()
    if (round > 2 || Number.isInteger(problema.respuesta)) return { ctx, problema }
  }
  const ctx = pick(CONTEXTOS)
  return { ctx, problema: ctx.construir() }
}

function make(type: string, answer: string, options: string[], payload: ProblemasPayload): Exercise {
  return { topic: 'problemas', type, answer, displayAnswer: answer, options, payload }
}

function buildOptions(correct: string, candidates: string[], total = 4): string[] {
  const distractors: string[] = []
  for (const candidate of candidates) {
    if (candidate !== correct && !distractors.includes(candidate)) distractors.push(candidate)
    if (distractors.length >= total - 1) break
  }
  return shuffle([correct, ...distractors])
}

function payloadDe(ctx: Contexto, problema: ProblemaGenerado): ProblemasPayload {
  return { enunciado: problema.enunciado, tecnica: ctx.tecnica, operacion: problema.operacion }
}

// Pregunta el resultado. Todas las opciones llevan la misma unidad: una sin
// unidad, o con otra, se descartaría sin resolver el problema.
function makeResultado(round: number): Exercise {
  const { ctx, problema } = contextoDeRonda(round)
  const answer = conUnidad(problema.respuesta, ctx.unidad)
  const vecinos = problema.errores.map(e => conUnidad(e.valor, ctx.unidad))
  return make('resultado', answer, buildOptions(answer, vecinos), payloadDe(ctx, problema))
}

// Un error como «quedarse con el total» se anota con el número solo, y eso
// sirve para la pregunta del resultado pero no para la de la operación: entre
// tres operaciones, una opción que es un número suelto se descarta sin pensar.
function pareceOperacion(texto: string): boolean {
  return /[:·+−]/.test(texto)
}

// Pregunta qué operación lo resuelve. Es la dificultad en estado puro —decidir
// qué hacer con los datos— sin la aritmética de por medio.
function makeQueOperacion(round: number): Exercise {
  for (let intento = 0; intento < 40; intento++) {
    const { ctx, problema } = contextoDeRonda(round)
    const vecinos = problema.errores.map(e => e.operacion).filter(pareceOperacion)
    if (vecinos.length === 0) continue
    return make('que-operacion', problema.operacion, buildOptions(problema.operacion, vecinos), payloadDe(ctx, problema))
  }
  // Salida segura: preguntar el resultado, que no depende de esa condición.
  return makeResultado(round)
}

export const generators: Record<string, (round: number) => Exercise> = {
  resultado: makeResultado,
  'que-operacion': makeQueOperacion,
}

// Se exporta para que las pruebas puedan sortear sin depender del reloj.
export { randInt }
