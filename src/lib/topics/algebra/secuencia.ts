// Una secuencia se describe como dato —de dónde parte y qué se le hace a cada
// término— y no como una lista de números. Así el mismo objeto sirve para las
// cuatro preguntas que hace el libro (qué patrón es, qué término falta, cuál es
// el 100.º, escribe los cinco primeros) y, sobre todo, permite construir los
// distractores aplicando el patrón equivocado en vez de inventar números: una
// opción que nadie elegiría no enseña nada.

export type Operacion = 'suma' | 'resta' | 'multiplica' | 'divide'

export interface Secuencia {
  inicio: number
  operacion: Operacion
  paso: number
}

export function secuencia(inicio: number, operacion: Operacion, paso: number): Secuencia {
  return { inicio, operacion, paso }
}

function siguiente(valor: number, { operacion, paso }: Secuencia): number {
  switch (operacion) {
    case 'suma':
      return valor + paso
    case 'resta':
      return valor - paso
    case 'multiplica':
      return valor * paso
    case 'divide':
      return valor / paso
  }
}

export function terminos(sec: Secuencia, cantidad: number): number[] {
  const lista: number[] = []
  let valor = sec.inicio
  for (let i = 0; i < cantidad; i++) {
    lista.push(valor)
    valor = siguiente(valor, sec)
  }
  return lista
}

// Llega a la posición pedida sin desarrollar la secuencia entera: es el atajo
// que la pregunta del término lejano quiere enseñar.
export function termino(sec: Secuencia, posicion: number): number {
  const saltos = posicion - 1
  switch (sec.operacion) {
    case 'suma':
      return sec.inicio + sec.paso * saltos
    case 'resta':
      return sec.inicio - sec.paso * saltos
    case 'multiplica':
      return sec.inicio * sec.paso ** saltos
    case 'divide':
      return sec.inicio / sec.paso ** saltos
  }
}

const NOMBRES: Record<Operacion, (paso: number) => string> = {
  suma: paso => `Sumar ${paso}`,
  resta: paso => `Restar ${paso}`,
  multiplica: paso => `Multiplicar por ${paso}`,
  divide: paso => `Dividir por ${paso}`,
}

export function describirPatron(sec: Secuencia): string {
  return NOMBRES[sec.operacion](sec.paso)
}

// Un tramo sirve si todos sus términos son enteros y no negativos. La unidad de
// patrones no mezcla decimales todavía, y un término como 2,5 o −4 desviaría la
// pregunta a un contenido que el niño aún no vio.
export function tramoValido(sec: Secuencia, cantidad: number): boolean {
  return terminos(sec, cantidad).every(valor => Number.isInteger(valor) && valor >= 0)
}
