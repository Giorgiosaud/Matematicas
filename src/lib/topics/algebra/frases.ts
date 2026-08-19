import { numeroEnPalabras } from '../../palabras'
import type { Expr } from './expresion'
import { division, num, producto, resta, suma, termino, variable } from './expresion'

// Cada plantilla es una frase del libro emparejada con su expresión. Las
// redacciones son las de la página 78 y no sinónimos inventados: el niño tiene
// que reconocer la frase, y "la tercera parte" y "un tercio" no se leen igual
// aunque signifiquen lo mismo.
export interface Plantilla {
  id: string
  // Cuántas letras distintas necesita la frase.
  letras: 1 | 2
  construir(v: string, n: number, w: string): { frase: string; expr: Expr }
}

// «la parte de un número» se escribe con dos puntos, como el dominó del libro
// que empareja «Un tercio de un número» con `n : 3`.
function parte(v: string, divisor: number): Expr {
  return division(variable(v), num(divisor))
}

// «unidades» es femenino, así que el número que lo acompaña concuerda:
// «veintiuna unidades», no «veintiuno unidades». Cuando el número va suelto
// («y veintiuno») se queda en masculino.
export const PLANTILLAS: Plantilla[] = [
  {
    id: 'doble',
    letras: 1,
    construir: v => ({ frase: 'El doble de un número.', expr: termino(2, v) }),
  },
  {
    id: 'triple',
    letras: 1,
    construir: v => ({ frase: 'El triple de un número.', expr: termino(3, v) }),
  },
  {
    id: 'mitad',
    letras: 1,
    construir: v => ({ frase: 'La mitad de un número.', expr: parte(v, 2) }),
  },
  {
    id: 'tercera-parte',
    letras: 1,
    construir: v => ({ frase: 'La tercera parte de un número.', expr: parte(v, 3) }),
  },
  {
    id: 'cuarta-parte',
    letras: 1,
    construir: v => ({ frase: 'La cuarta parte de un número.', expr: parte(v, 4) }),
  },
  {
    id: 'aumentado',
    letras: 1,
    construir: (v, n) => ({
      frase: `Un número aumentado en ${numeroEnPalabras(n, true)} unidades.`,
      expr: suma(variable(v), num(n)),
    }),
  },
  {
    id: 'disminuido',
    letras: 1,
    construir: (v, n) => ({
      frase: `Un número disminuido en ${numeroEnPalabras(n, true)} unidades.`,
      expr: resta(variable(v), num(n)),
    }),
  },
  {
    id: 'sucesor',
    letras: 1,
    construir: v => ({ frase: `El sucesor de ${v}.`, expr: suma(variable(v), num(1)) }),
  },
  {
    id: 'antecesor',
    letras: 1,
    construir: v => ({ frase: `El antecesor de ${v}.`, expr: resta(variable(v), num(1)) }),
  },
  {
    id: 'triple-aumentado',
    letras: 1,
    construir: (v, n) => ({
      frase: `El triple de un número aumentado en ${numeroEnPalabras(n, true)} unidades.`,
      expr: suma(termino(3, v), num(n)),
    }),
  },
  {
    id: 'diferencia-doble',
    letras: 1,
    construir: (v, n) => ({
      frase: `La diferencia entre el doble de un número y ${numeroEnPalabras(n)}.`,
      expr: resta(termino(2, v), num(n)),
    }),
  },
  {
    id: 'suma-doble',
    letras: 1,
    construir: v => ({
      frase: 'La suma de un número y su doble.',
      expr: suma(variable(v), termino(2, v)),
    }),
  },
  {
    id: 'suma-dos',
    letras: 2,
    construir: (v, _n, w) => ({
      frase: 'Un número aumentado en otro número.',
      expr: suma(variable(v), variable(w)),
    }),
  },
  {
    id: 'producto-dos',
    letras: 2,
    construir: (v, _n, w) => ({
      frase: 'El producto de dos números.',
      expr: producto(variable(v), variable(w)),
    }),
  },
  {
    id: 'tercera-menos-otro',
    letras: 2,
    construir: (v, _n, w) => ({
      frase: 'La tercera parte de un número disminuida en otro número.',
      expr: resta(parte(v, 3), variable(w)),
    }),
  },
]

export function plantillaPorId(id: string): Plantilla {
  const encontrada = PLANTILLAS.find(p => p.id === id)
  if (!encontrada) throw new Error(`Plantilla desconocida: ${id}`)
  return encontrada
}

// Plantillas que se confunden con la dada: la misma forma con otra operación o
// con otro multiplicador. Son los distractores que enseñan; una frase de otra
// familia se descarta de un vistazo y no obliga a leer.
const VECINAS: Record<string, string[]> = {
  doble: ['triple', 'mitad'],
  triple: ['doble', 'tercera-parte'],
  mitad: ['tercera-parte', 'doble'],
  'tercera-parte': ['cuarta-parte', 'mitad'],
  'cuarta-parte': ['tercera-parte', 'mitad'],
  aumentado: ['disminuido', 'sucesor'],
  disminuido: ['aumentado', 'antecesor'],
  sucesor: ['antecesor', 'aumentado'],
  antecesor: ['sucesor', 'disminuido'],
  'triple-aumentado': ['diferencia-doble', 'aumentado'],
  'diferencia-doble': ['triple-aumentado', 'disminuido'],
  'suma-doble': ['doble', 'triple'],
  'suma-dos': ['producto-dos', 'tercera-menos-otro'],
  'producto-dos': ['suma-dos', 'tercera-menos-otro'],
  'tercera-menos-otro': ['suma-dos', 'producto-dos'],
}

export function plantillasVecinas(id: string): Plantilla[] {
  return (VECINAS[id] ?? []).map(plantillaPorId)
}
