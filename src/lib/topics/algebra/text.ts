import type { Exercise } from '../types'
import { algebraPayload } from './generators'
import { describirPatron } from './secuencia'

// Los ordinales como los escribe el libro: «el 8.º término», «el 100.º término».
export function ordinal(posicion: number): string {
  return `${posicion}.º`
}

// «si a = 4 y b = 2», con la conjunción en su sitio aunque haya una sola letra.
export function listarValores(valores: Record<string, number>): string {
  const partes = Object.entries(valores).map(([letra, valor]) => `${letra} = ${valor}`)
  if (partes.length <= 1) return partes.join('')
  return `${partes.slice(0, -1).join(', ')} y ${partes[partes.length - 1]}`
}

// Un número pegado a una letra: `3x`, `12b`. La pista cambia según lo tenga.
function tieneCoeficiente(expresion?: string): boolean {
  return expresion !== undefined && /\d[a-z]/.test(expresion)
}

export function describe(exercise: Exercise): string {
  const { posicionPedida } = algebraPayload(exercise)
  switch (exercise.type) {
    case 'patron':
      return '¿Cuál es el patrón de formación?'
    case 'completar':
      return '¿Qué término falta?'
    case 'termino-lejano':
      return `¿Cuál es el ${ordinal(posicionPedida ?? 0)} término?`
    case 'construir':
      return 'Escribe los 5 primeros términos'
    case 'frase-a-expresion':
      return '¿Con qué expresión algebraica se escribe?'
    case 'expresion-a-frase':
      return '¿Qué significa esta expresión?'
    case 'valorizar':
      return '¿Cuál es el valor de la expresión?'
    case 'ecuacion-balanza':
      return '¿Qué ecuación representa la balanza?'
    case 'resolver-ecuacion':
      return '¿Cuánto vale la incógnita?'
    case 'ecuacion-desde-frase':
      return '¿Qué ecuación representa la situación?'
    case 'desigualdad':
      return 'Completa con <, > o ='
    case 'inecuacion-balanza':
      return '¿Qué inecuación representa la balanza?'
    case 'menor-natural':
      return '¿Cuál es el menor número natural que la cumple?'
    case 'no-satisface':
      // El «NO» va en mayúsculas como en el libro: sin eso la pregunta acaba
      // midiendo comprensión lectora en vez de matemática.
      return '¿Cuál de estos números NO la cumple?'
    default:
      return 'Resuelve'
  }
}

export function hint(exercise: Exercise): string {
  const { secuencia, posicionPedida, expresion } = algebraPayload(exercise)

  switch (exercise.type) {
    case 'patron':
      return 'Pista: mira qué le pasa a un término para llegar al siguiente, y comprueba que sirva para todos, no solo para los dos primeros.'
    case 'completar':
      return secuencia
        ? `Pista: el patrón es «${describirPatron(secuencia).toLowerCase()}» — aplícalo al término anterior.`
        : ''
    case 'termino-lejano': {
      const saltos = (posicionPedida ?? 1) - 1
      return `Pista: del 1.º al ${ordinal(posicionPedida ?? 0)} hay ${saltos} saltos, no ${posicionPedida}. No hace falta escribirlos todos.`
    }
    case 'construir':
      return 'Pista: el primer término se escribe tal cual; el patrón se aplica a partir del segundo.'
    case 'frase-a-expresion':
      return 'Pista: «el doble» multiplica por 2 y «el triple» por 3; «aumentado en» suma y «disminuido en» resta.'
    case 'expresion-a-frase':
      return 'Pista: el número pegado a la letra la multiplica — 3x es el triple del número, no el número más 3.'
    case 'valorizar':
      // La pista sobre el coeficiente implícito solo sirve si la expresión lo
      // tiene; colgarla de un `y − 1` manda al niño a buscar una multiplicación
      // que no está.
      return tieneCoeficiente(expresion)
        ? 'Pista: 3x quiere decir 3 · x. Cambia cada letra por su valor y resuelve primero las multiplicaciones.'
        : 'Pista: cambia cada letra por su valor y resuelve la operación.'
    case 'ecuacion-balanza':
      return 'Pista: lo que hay en un platillo pesa lo mismo que lo del otro. Eso es lo que dice el igual.'
    case 'resolver-ecuacion':
      return 'Pista: lo que le quitas a un lado, quítaselo al otro. Si en la ecuación suma, tú restas; si resta, sumas.'
    case 'ecuacion-desde-frase':
      return 'Pista: lo que ya tienes más lo que falta da el total. Esa suma es la ecuación.'
    case 'desigualdad':
      return 'Pista: no hace falta calcular los dos lados enteros. Compara una parte con la otra.'
    case 'inecuacion-balanza':
      return 'Pista: el platillo que baja es el que pesa más, y la punta del signo mira siempre al lado más pequeño.'
    case 'menor-natural':
      return 'Pista: busca primero el valor que dejaría los dos lados iguales. El que sirve es el siguiente.'
    case 'no-satisface':
      return 'Pista: prueba los números uno por uno. Buscas el único que NO la cumple, no los que sí.'
    default:
      return ''
  }
}
