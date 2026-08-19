import type { Exercise } from '../types'
import type { Expr } from './expresion'
import { evaluar, formatear, tieneDivision, variablesDe } from './expresion'
import type { Plantilla } from './frases'
import { PLANTILLAS, plantillasVecinas } from './frases'
import type { Inecuacion, Lado, Signo } from './ecuacion'
import {
  ecuacion, formatearEcuacion, formatearInecuacion, inecuacion,
  menorNaturalQueSatisface, tieneSolucionNatural,
} from './ecuacion'
import type { Operacion, Secuencia } from './secuencia'
import { describirPatron, secuencia, termino, terminos, tramoValido } from './secuencia'

// Las letras que usa el libro. Fijar siempre `x` daría una falsa sensación de
// dominio: el libro valoriza `9b + a · b` y pregunta por `4 · s`, y un niño que
// solo practicó con `x` cree que la letra es parte de la operación.
const LETRAS = ['x', 'y', 'a', 'b', 'c', 'n', 's', 'w', 'z']

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
  // Expresión que se muestra, ya formateada con la notación del libro.
  expresion?: string
  // Valores de las letras en los ejercicios de valorizar ("si a = 4 y b = 2").
  valores?: Record<string, number>
  // Balanza a dibujar. `estado` dice qué platillo baja; en las de ecuación es
  // 'equilibrio' y el dibujo se apoya en tacos hasta que el jugador responde.
  balanza?: Balanza
}

export interface Pesa {
  gramos?: number
  incognita?: string
}

export interface Balanza {
  izquierda: Pesa[]
  derecha: Pesa[]
  estado: 'equilibrio' | 'baja-izquierda' | 'baja-derecha'
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

// ── Lenguaje algebraico y valorizar ──────────────────────────────────────────

// Dos letras distintas para las plantillas que las necesitan.
function dosLetras(): [string, string] {
  const v = pick(LETRAS)
  const otras = LETRAS.filter(letra => letra !== v)
  return [v, pick(otras)]
}

function plantillaDeRonda(round: number): Plantilla {
  // Las de dos letras piden leer con más cuidado, así que entran más adelante.
  const disponibles = round <= 2 ? PLANTILLAS.filter(p => p.letras === 1) : PLANTILLAS
  return pick(disponibles)
}

function makeFraseAExpresion(round: number): Exercise {
  const [v, w] = dosLetras()
  const n = randInt(2, 20)
  const plantilla = plantillaDeRonda(round)
  const { frase, expr } = plantilla.construir(v, n, w)
  const answer = formatear(expr)
  const vecinas = plantillasVecinas(plantilla.id).map(p => formatear(p.construir(v, n, w).expr))
  return make('frase-a-expresion', answer, buildOptions(answer, vecinas), { prompt: frase })
}

function makeExpresionAFrase(round: number): Exercise {
  const [v, w] = dosLetras()
  const n = randInt(2, 20)
  const plantilla = plantillaDeRonda(round)
  const { frase, expr } = plantilla.construir(v, n, w)
  const vecinas = plantillasVecinas(plantilla.id).map(p => p.construir(v, n, w).frase)
  return make('expresion-a-frase', frase, buildOptions(frase, vecinas), {
    expresion: formatear(expr),
  })
}

function makeValorizar(round: number): Exercise {
  const [v, w] = dosLetras()
  const n = randInt(2, 12)
  // Solo plantillas cuyo valor numérico sea entero: la mitad o la tercera parte
  // de un número darían decimales, y esta unidad todavía no los mezcla. Se mira
  // el árbol de la expresión, no el nombre de la plantilla.
  const enteras = PLANTILLAS.filter(p => !tieneDivision(p.construir(v, n, w).expr))
  const candidatas = round <= 2 ? enteras.filter(p => p.letras === 1) : enteras
  const plantilla = pick(candidatas)
  const { expr } = plantilla.construir(v, n, w)

  // Los valores se sortean hasta que el resultado sea entero y no negativo. El
  // libro elige siempre valores así (`2b − a` con a=10 y b=5 da 0, nunca −5):
  // los números negativos son de otro curso y aquí solo confundirían.
  const encontrado = valoresQueDanEnteroPositivo(expr)
  // Si no hubo forma de que diera un entero no negativo, se cambia de plantilla
  // en vez de devolver un valor raro: una respuesta fraccionaria dejaría fuera
  // a todos los distractores y el ejercicio saldría con una sola opción.
  if (!encontrado) return makeValorizar(1)
  const { valores, valor } = encontrado
  const answer = String(valor)
  return make('valorizar', answer, buildOptions(answer, distractoresDeValor(expr, valores, valor)), {
    expresion: formatear(expr),
    valores,
  })
}

function valoresQueDanEnteroPositivo(expr: Expr): { valores: Record<string, number>; valor: number } | null {
  const letras = variablesDe(expr)
  for (let intento = 0; intento < 30; intento++) {
    const valores: Record<string, number> = {}
    // Se sortea de mayor a menor por posición: la primera letra suele ser el
    // minuendo, así que darle el rango alto reduce los intentos fallidos.
    letras.forEach((letra, i) => { valores[letra] = i === 0 ? randInt(6, 14) : randInt(2, 6) })
    const valor = evaluar(expr, valores)
    if (Number.isInteger(valor) && valor >= 0) return { valores, valor }
  }
  return null
}

// Los errores que este ejercicio busca cazar: operar de izquierda a derecha
// ignorando la precedencia, y confundir el coeficiente con una suma.
function distractoresDeValor(expr: Expr, valores: Record<string, number>, correcto: number): string[] {
  const candidatos = [
    izquierdaADerecha(expr, valores),
    coeficienteComoSuma(expr, valores),
    correcto + 1,
    correcto - 1,
  ]
  return candidatos
    .filter(valor => Number.isInteger(valor) && valor !== correcto && valor >= 0)
    .map(String)
}

// Evalúa como si no hubiera precedencia: (a + b) · c en vez de a + b · c.
function izquierdaADerecha(expr: Expr, valores: Record<string, number>): number {
  switch (expr.tipo) {
    case 'suma':
      return aplanarIzquierda(expr.izq, expr.der, valores, (a, b) => a + b)
    case 'resta':
      return aplanarIzquierda(expr.izq, expr.der, valores, (a, b) => a - b)
    default:
      return evaluar(expr, valores)
  }
}

function aplanarIzquierda(
  izq: Expr,
  der: Expr,
  valores: Record<string, number>,
  combinar: (a: number, b: number) => number,
): number {
  if (der.tipo === 'producto') {
    return combinar(evaluar(izq, valores), evaluar(der.izq, valores)) * evaluar(der.der, valores)
  }
  if (der.tipo === 'termino') {
    return combinar(evaluar(izq, valores), der.coeficiente) * (valores[der.variable] ?? 0)
  }
  return combinar(evaluar(izq, valores), evaluar(der, valores))
}

// Leer `3x` como `3 + x`: el error de quien no ve la multiplicación implícita.
function coeficienteComoSuma(expr: Expr, valores: Record<string, number>): number {
  switch (expr.tipo) {
    case 'termino':
      return expr.coeficiente + (valores[expr.variable] ?? 0)
    case 'suma':
      return coeficienteComoSuma(expr.izq, valores) + coeficienteComoSuma(expr.der, valores)
    case 'resta':
      return coeficienteComoSuma(expr.izq, valores) - coeficienteComoSuma(expr.der, valores)
    default:
      return evaluar(expr, valores)
  }
}


// ── Ecuaciones, desigualdades e inecuaciones ─────────────────────────────────

// Los números de las opciones salen siempre del propio dibujo. Una opción con
// un número que no está en la balanza se descarta sin pensar, y entonces la
// pregunta se resuelve por eliminación en vez de por comprensión.
function makeEcuacionBalanza(round: number): Exercise {
  const v = pick(LETRAS)
  const sumando = randInt(2, 20 + round * 3)
  const solucion = randInt(2, 30 + round * 5)
  const total = solucion + sumando
  const ec = ecuacion(v, [null, sumando], total)
  const answer = formatearEcuacion(ec)
  const vecinas = [
    formatearEcuacion(ecuacion(v, [null, -sumando], total)),
    formatearEcuacion(ecuacion(v, [null, sumando], total, { izquierda: false })),
    formatearEcuacion(ecuacion(v, [null, total], sumando)),
  ]
  return make('ecuacion-balanza', answer, buildOptions(answer, vecinas), {
    balanza: {
      izquierda: [{ incognita: v }, { gramos: sumando }],
      derecha: [{ gramos: total }],
      estado: 'equilibrio',
    },
  })
}

function makeResolverEcuacion(round: number): Exercise {
  const v = pick(LETRAS)
  const solucion = randInt(3, 40 + round * 8)
  const termino = randInt(2, 30 + round * 5)
  const resta = Math.random() < 0.4
  const izquierda = Math.random() < 0.5
  const lado: Lado = resta ? [null, -termino] : [termino, null]
  const ec = ecuacion(v, lado, solucion + (resta ? -termino : termino), { izquierda })
  const answer = String(solucion)
  const vecinos = [
    // Operar al revés: el error de quien memoriza «se pasa al otro lado» sin
    // entender por qué cambia el signo.
    String(ec.resultado + (resta ? -termino : termino)),
    String(solucion + 1),
    String(Math.abs(solucion - termino)),
  ].filter(candidato => Number(candidato) >= 0)
  return make('resolver-ecuacion', answer, buildOptions(answer, vecinos), {
    expresion: formatearEcuacion(ec),
  })
}

function makeEcuacionDesdeFrase(round: number): Exercise {
  const v = pick(LETRAS)
  const parte = randInt(10, 40 + round * 10)
  const total = parte + randInt(10, 60)
  const ec = ecuacion(v, [parte, null], total)
  const answer = formatearEcuacion(ec)
  const prompt = `Ana ya leyó ${parte} páginas de un libro de ${total}. ¿Qué ecuación dice cuántas le faltan?`
  const vecinas = [
    formatearEcuacion(ecuacion(v, [null, -parte], total)),
    formatearEcuacion(ecuacion(v, [parte, null], total, { izquierda: false })),
    formatearEcuacion(ecuacion(v, [total, null], parte)),
  ]
  return make('ecuacion-desde-frase', answer, buildOptions(answer, vecinas), { prompt })
}

// Pares que se pueden comparar mirando las partes, sin calcular los dos lados
// enteros: es la propiedad de las desigualdades que enseña el libro.
function makeDesigualdad(round: number): Exercise {
  const max = 20 + round * 5
  const a = randInt(2, max)
  const b = randInt(2, max)
  // El segundo par se construye moviendo cada sumando un poco respecto del
  // primero: así se puede resolver comparando parte con parte, que es la
  // propiedad que enseña el libro, en vez de sumando los dos totales.
  // El mínimo de 1 no es cosmético: sin él un sumando puede salir negativo y el
  // enunciado quedaría escrito «7 + −2», que no es lo que se está preguntando.
  const c = Math.max(1, a + pick([0, randInt(1, 8), -randInt(1, 8)]))
  const d = Math.max(1, b + pick([0, randInt(1, 8), -randInt(1, 8)]))
  const izquierda = a + b
  const derecha = c + d
  const answer = izquierda === derecha ? '=' : izquierda > derecha ? '>' : '<'
  return make('desigualdad', answer, shuffle(['<', '>', '=']), {
    prompt: `${a} + ${b}   ?   ${c} + ${d}`,
  })
}

function inecuacionDeRonda(round: number): { inec: Inecuacion; balanza: Balanza } {
  for (let intento = 0; intento < 30; intento++) {
    const v = pick(LETRAS)
    const sumando = randInt(2, 15 + round * 2)
    const total = randInt(sumando + 2, sumando + 30 + round * 4)
    const signo: Signo = Math.random() < 0.5 ? '<' : '>'
    const inec = inecuacion(v, [null, sumando], signo, total)
    if (!tieneSolucionNatural(inec)) continue
    return {
      inec,
      balanza: {
        izquierda: [{ incognita: v }, { gramos: sumando }],
        derecha: [{ gramos: total }],
        estado: signo === '<' ? 'baja-derecha' : 'baja-izquierda',
      },
    }
  }
  const inec = inecuacion('x', [null, 5], '<', 20)
  return {
    inec,
    balanza: { izquierda: [{ incognita: 'x' }, { gramos: 5 }], derecha: [{ gramos: 20 }], estado: 'baja-derecha' },
  }
}

function makeInecuacionBalanza(round: number): Exercise {
  const { inec, balanza } = inecuacionDeRonda(round)
  const answer = formatearInecuacion(inec)
  const contrario: Signo = inec.signo === '<' ? '>' : '<'
  const vecinas = [
    formatearInecuacion(inecuacion(inec.incognita, inec.lado, contrario, inec.resultado)),
    formatearInecuacion(inecuacion(inec.incognita, [null, -(inec.lado[1] as number)], inec.signo, inec.resultado)),
    formatearInecuacion(inecuacion(inec.incognita, [inec.resultado, null], inec.signo, inec.lado[1] as number)),
  ]
  return make('inecuacion-balanza', answer, buildOptions(answer, vecinas), { balanza })
}

function makeMenorNatural(round: number): Exercise {
  // Solo «mayor que»: con «menor que» el menor natural es siempre el cero y la
  // pregunta no enseña nada.
  for (let intento = 0; intento < 30; intento++) {
    const v = pick(LETRAS)
    const sumando = randInt(2, 15 + round * 2)
    const total = randInt(sumando + 3, sumando + 30 + round * 5)
    const inec = inecuacion(v, [null, sumando], '>', total)
    const menor = menorNaturalQueSatisface(inec)
    if (menor === null || menor <= 0) continue
    const answer = String(menor)
    const vecinos = [
      // El valor que resuelve la igualdad: quien contesta esto entendió la
      // ecuación pero no la desigualdad.
      String(menor - 1),
      String(menor + 1),
      String(menor + 2),
    ].filter(candidato => Number(candidato) >= 0)
    return make('menor-natural', answer, buildOptions(answer, vecinos), {
      expresion: formatearInecuacion(inec),
    })
  }
  return makeMenorNatural(1)
}

function makeNoSatisface(round: number): Exercise {
  for (let intento = 0; intento < 30; intento++) {
    const v = pick(LETRAS)
    const total = randInt(12, 40 + round * 6)
    const inec = inecuacion(v, [null], '<', total)
    const cumplen = shuffle(Array.from({ length: total }, (_, i) => i)).slice(0, 3)
    const falla = total + randInt(0, 20)
    if (cumplen.length < 3) continue
    const answer = String(falla)
    const opciones = shuffle([answer, ...cumplen.map(String)])
    if (new Set(opciones).size !== opciones.length) continue
    return make('no-satisface', answer, opciones, { expresion: formatearInecuacion(inec) })
  }
  return makeNoSatisface(1)
}

export const generators: Record<string, (round: number) => Exercise> = {
  patron: makePatron,
  completar: makeCompletar,
  'termino-lejano': makeTerminoLejano,
  construir: makeConstruir,
  'frase-a-expresion': makeFraseAExpresion,
  'expresion-a-frase': makeExpresionAFrase,
  valorizar: makeValorizar,
  'ecuacion-balanza': makeEcuacionBalanza,
  'resolver-ecuacion': makeResolverEcuacion,
  'ecuacion-desde-frase': makeEcuacionDesdeFrase,
  desigualdad: makeDesigualdad,
  'inecuacion-balanza': makeInecuacionBalanza,
  'menor-natural': makeMenorNatural,
  'no-satisface': makeNoSatisface,
}
