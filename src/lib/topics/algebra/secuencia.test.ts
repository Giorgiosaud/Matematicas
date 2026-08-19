import { describe, expect, it } from 'vitest'
import { describirPatron, secuencia, termino, terminos } from './secuencia'

describe('terminos', () => {
  it('desarrolla una secuencia aditiva', () => {
    expect(terminos(secuencia(12, 'suma', 5), 5)).toEqual([12, 17, 22, 27, 32])
  })

  it('desarrolla una secuencia con paso negativo', () => {
    expect(terminos(secuencia(150, 'resta', 15), 5)).toEqual([150, 135, 120, 105, 90])
  })

  it('desarrolla una secuencia multiplicativa', () => {
    expect(terminos(secuencia(20, 'multiplica', 2), 5)).toEqual([20, 40, 80, 160, 320])
  })

  it('desarrolla una secuencia que divide', () => {
    expect(terminos(secuencia(256, 'divide', 2), 5)).toEqual([256, 128, 64, 32, 16])
  })
})

describe('termino', () => {
  it('llega a una posición lejana sin enumerar', () => {
    // p.91 #4 del libro: 16, 19, 22, 25, 28... el 8.° término es 37.
    expect(termino(secuencia(16, 'suma', 3), 8)).toBe(37)
  })

  it('la posición 1 es el primer término', () => {
    expect(termino(secuencia(9, 'suma', 8), 1)).toBe(9)
  })

  it('coincide con desarrollar la secuencia entera', () => {
    const sec = secuencia(7, 'multiplica', 2)
    const lista = terminos(sec, 10)
    for (let i = 1; i <= 10; i++) {
      expect(termino(sec, i)).toBe(lista[i - 1])
    }
  })
})

describe('describirPatron', () => {
  it('describe el patrón como lo hace el libro', () => {
    expect(describirPatron(secuencia(18, 'suma', 9))).toBe('Sumar 9')
    expect(describirPatron(secuencia(150, 'resta', 15))).toBe('Restar 15')
    expect(describirPatron(secuencia(20, 'multiplica', 2))).toBe('Multiplicar por 2')
    expect(describirPatron(secuencia(256, 'divide', 2))).toBe('Dividir por 2')
  })
})

describe('las secuencias se mantienen en enteros', () => {
  it('una secuencia que divide nunca produce fracciones en el tramo que se muestra', () => {
    // La unidad de patrones no mezcla decimales: un término como 2,5 desviaría
    // la pregunta a otro contenido y confundiría al niño.
    const sec = secuencia(1024, 'divide', 4)
    for (const valor of terminos(sec, 6)) {
      expect(Number.isInteger(valor)).toBe(true)
    }
  })

  it('una secuencia que resta no cruza a los negativos en el tramo que se muestra', () => {
    const sec = secuencia(100, 'resta', 20)
    for (const valor of terminos(sec, 5)) {
      expect(valor).toBeGreaterThanOrEqual(0)
    }
  })
})
