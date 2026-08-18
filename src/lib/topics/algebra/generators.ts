import type { Exercise } from '../types'
import type { Operacion, Secuencia } from './secuencia'
import { describirPatron, secuencia, termino, terminos, tramoValido } from './secuencia'

export interface AlgebraPayload {
  secuencia?: Secuencia
  // Términos que el enunciado muestra al jugador.
  mostrados?: number[]
  // Posición (1-based, dentro de `mostrados`) del término reemplazado por el «?».
  posicionOculta?: number
  // Posición que pide el ejercicio de término lejano, siempre más allá de lo mostrado.
  posicionPedida?: number
  // Enunciado ya redactado cuando la pregunta se plantea con palabras.
  prompt?: string
}

// Único punto de estrechamiento del payload en el tema.
export function algebraPayload(exercise: Exercise): AlgebraPayload {
  return exercise.payload as AlgebraPayload
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
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

function buildOptions(correct: string, candidates: string[], total = 4): string[] {
  const distractors: string[] = []
  for (const candidate of candidates) {
    if (candidate !== correct && !distractors.includes(candidate)) distractors.push(candidate)
    if (distractors.length >= total - 1) break
  }
  return shuffle([correct, ...distractors])
}

function make(type: string, answer: string, options: string[], payload: AlgebraPayload): Exercise {
  return { topic: 'algebra', type, answer, displayAnswer: answer, options, payload }
}

// Los patrones multiplicativos crecen rapidísimo, así que solo entran cuando el
// juego ya va avanzado; las primeras rondas se quedan en sumar y restar.
function operacionesDeRonda(round: number): Operacion[] {
  return round <= 3 ? ['suma', 'resta'] : ['suma', 'resta', 'multiplica', 'divide']
}

// Sortea una secuencia cuyo tramo visible sea entero y no negativo. El bucle
// tiene tope: si la combinación sorteada no sirve, se cae a una aditiva simple
// en vez de girar para siempre.
function secuenciaDeRonda(round: number, largo: number): Secuencia {
  for (let intento = 0; intento < 40; intento++) {
    const operacion = pick(operacionesDeRonda(round))
    const candidata = sortearSecuencia(operacion, round, largo)
    if (tramoValido(candidata, largo)) return candidata
  }
  return secuencia(randInt(2, 12), 'suma', randInt(2, 9))
}

function sortearSecuencia(operacion: Operacion, round: number, largo: number): Secuencia {
  const paso = operacion === 'multiplica' || operacion === 'divide' ? randInt(2, 4) : randInt(2, 15)
  switch (operacion) {
    case 'suma':
      return secuencia(randInt(1, 20 + round * 5), 'suma', paso)
    case 'resta':
      // Arranca lo bastante alto como para que el tramo no cruce a los negativos.
      return secuencia(paso * largo + randInt(0, 30), 'resta', paso)
    case 'multiplica':
      return secuencia(randInt(2, 12), 'multiplica', paso)
    case 'divide':
      // Se construye desde el final: así la división siempre da entero.
      return secuencia(randInt(2, 9) * paso ** (largo - 1), 'divide', paso)
  }
}

// Patrones del mismo estilo sobre números cercanos. Son los que un niño
// confunde de verdad — "sumar 9" contra "multiplicar por 9" en 18, 27, 36 — así
// que valen mucho más como opciones que un número al azar.
function patronesVecinos(sec: Secuencia): string[] {
  const otras: Operacion[] = (['suma', 'resta', 'multiplica', 'divide'] as Operacion[])
    .filter(op => op !== sec.operacion)
  return shuffle([
    ...otras.map(op => describirPatron(secuencia(sec.inicio, op, sec.paso))),
    describirPatron(secuencia(sec.inicio, sec.operacion, sec.paso + 1)),
    describirPatron(secuencia(sec.inicio, sec.operacion, Math.max(2, sec.paso - 1))),
  ])
}

function makePatron(round: number): Exercise {
  const largo = 5
  const sec = secuenciaDeRonda(round, largo)
  const mostrados = terminos(sec, largo)
  const answer = describirPatron(sec)
  return make('patron', answer, buildOptions(answer, patronesVecinos(sec)), { secuencia: sec, mostrados })
}

function makeCompletar(round: number): Exercise {
  const largo = 5
  const sec = secuenciaDeRonda(round, largo)
  const mostrados = terminos(sec, largo)
  // El hueco cae en cualquier término salvo el primero: sin un término inicial
  // visible no hay desde dónde deducir el patrón.
  const posicionOculta = randInt(2, largo)
  const valor = mostrados[posicionOculta - 1]
  const answer = String(valor)
  const vecinos = [
    // Aplicar el patrón una vez de menos o de más: el error de contar mal.
    String(termino(sec, posicionOculta - 1)),
    String(termino(sec, posicionOculta + 1)),
    String(valor + sec.paso),
    String(valor - sec.paso),
  ].filter(candidato => Number(candidato) >= 0)
  return make('completar', answer, buildOptions(answer, vecinos), { secuencia: sec, mostrados, posicionOculta })
}

function makeTerminoLejano(round: number): Exercise {
  const visibles = 5
  // Solo aditivas: una multiplicativa en la posición 20 da números que no caben
  // en la cabeza de un niño de diez años ni en el ancho de la pantalla.
  const sec = secuenciaDeRonda(round, visibles).operacion === 'multiplica'
    ? secuencia(randInt(1, 20), 'suma', randInt(2, 9))
    : secuenciaDeRonda(round, visibles)
  const aditiva = sec.operacion === 'suma' || sec.operacion === 'resta'
    ? sec
    : secuencia(randInt(1, 20), 'suma', randInt(2, 9))
  const posicionPedida = round <= 3 ? randInt(7, 10) : pick([8, 10, 12, 15, 20, 100])
  const valor = termino(aditiva, posicionPedida)
  if (valor < 0) return makeTerminoLejano(1)
  const answer = String(valor)
  const vecinos = [
    // Contar un salto de menos o de más, y confundir la posición con el índice:
    // los tres errores habituales al llegar al término n.
    String(termino(aditiva, posicionPedida - 1)),
    String(termino(aditiva, posicionPedida + 1)),
    String(aditiva.inicio + aditiva.paso * posicionPedida),
  ].filter(candidato => Number(candidato) >= 0)
  return make('termino-lejano', answer, buildOptions(answer, vecinos), {
    secuencia: aditiva,
    mostrados: terminos(aditiva, visibles),
    posicionPedida,
  })
}

function makeConstruir(round: number): Exercise {
  const largo = 5
  const sec = secuenciaDeRonda(round, largo)
  const answer = terminos(sec, largo).join(', ')
  const prompt = `Primer término: ${sec.inicio}. Patrón: ${describirPatron(sec).toLowerCase()} al término anterior.`
  const vecinos = [
    // Empezar aplicando el patrón al primer término en vez de escribirlo tal cual.
    terminos(secuencia(sec.inicio, sec.operacion, sec.paso), largo).slice(1).concat(
      termino(sec, largo + 1)
    ).join(', '),
    terminos(secuencia(sec.inicio, sec.operacion, sec.paso + 1), largo).join(', '),
    terminos(secuencia(sec.inicio, sec.operacion, Math.max(2, sec.paso - 1)), largo).join(', '),
  ]
  return make('construir', answer, buildOptions(answer, vecinos), { secuencia: sec, mostrados: terminos(sec, largo), prompt })
}

export const generators: Record<string, (round: number) => Exercise> = {
  patron: makePatron,
  completar: makeCompletar,
  'termino-lejano': makeTerminoLejano,
  construir: makeConstruir,
}
