// Ecuaciones e inecuaciones de un paso, las de las páginas 80 a 87 del libro.
//
// El lado de la incógnita se guarda como una lista en orden, con `null` en el
// hueco donde va la letra y los números con su signo. Guardar el orden importa:
// el libro escribe `72 + x = 180` y también `25 = x − 56`, y un niño que solo
// practicó una de las dos formas lee la otra como una errata.

export type Signo = '<' | '>'

// `null` marca la posición de la incógnita; los números negativos se restan.
export type Lado = (number | null)[]

export interface Ecuacion {
  incognita: string
  lado: Lado
  resultado: number
  // ¿El lado con la incógnita va a la izquierda del igual?
  izquierda: boolean
}

export interface Inecuacion {
  incognita: string
  lado: Lado
  signo: Signo
  resultado: number
}

const MENOS = '−'

export function ecuacion(
  incognita: string,
  lado: Lado,
  resultado: number,
  opciones?: { izquierda?: boolean },
): Ecuacion {
  return { incognita, lado, resultado, izquierda: opciones?.izquierda ?? true }
}

export function inecuacion(incognita: string, lado: Lado, signo: Signo, resultado: number): Inecuacion {
  return { incognita, lado, signo, resultado }
}

function sumaDeTerminos(lado: Lado): number {
  return lado.reduce<number>((acc, termino) => acc + (termino ?? 0), 0)
}

export function resolver(ec: Ecuacion): number {
  return ec.resultado - sumaDeTerminos(ec.lado)
}

// Escribe el lado de la incógnita respetando el orden: el primer término va sin
// signo delante, y los siguientes con `+` o `−` según lo lleven.
function formatearLado(incognita: string, lado: Lado): string {
  return lado
    .map((termino, i) => {
      const texto = termino === null ? incognita : String(Math.abs(termino))
      if (i === 0) return texto
      const signo = termino !== null && termino < 0 ? MENOS : '+'
      return `${signo} ${texto}`
    })
    .join(' ')
}

export function formatearEcuacion(ec: Ecuacion): string {
  const conIncognita = formatearLado(ec.incognita, ec.lado)
  return ec.izquierda
    ? `${conIncognita} = ${ec.resultado}`
    : `${ec.resultado} = ${conIncognita}`
}

export function formatearInecuacion(inec: Inecuacion): string {
  return `${formatearLado(inec.incognita, inec.lado)} ${inec.signo} ${inec.resultado}`
}

export function satisface(inec: Inecuacion, valor: number): boolean {
  const total = valor + sumaDeTerminos(inec.lado)
  return inec.signo === '<' ? total < inec.resultado : total > inec.resultado
}

// Umbral que la incógnita tiene que superar o no alcanzar: `x + 12 > 25` deja
// x > 13, y `x + 7 < 9` deja x < 2.
function umbral(inec: Inecuacion): number {
  return inec.resultado - sumaDeTerminos(inec.lado)
}

export function menorNaturalQueSatisface(inec: Inecuacion): number | null {
  if (!tieneSolucionNatural(inec)) return null
  // Con «menor que», cualquier natural por debajo del umbral vale, así que el
  // menor es el cero. Con «mayor que», el primero que lo supera.
  if (inec.signo === '<') return 0
  const limite = umbral(inec)
  return Math.max(0, Math.floor(limite) + 1)
}

// Una inecuación sin ningún natural que la cumpla no es una pregunta: no hay
// nada que responder. El generador tiene que descartarla antes de plantearla.
export function tieneSolucionNatural(inec: Inecuacion): boolean {
  // Con «mayor que» siempre hay naturales suficientemente grandes.
  if (inec.signo === '>') return true
  return umbral(inec) > 0
}
