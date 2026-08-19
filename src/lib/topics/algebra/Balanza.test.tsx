import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Balanza } from './Balanza'

const equilibrio = {
  izquierda: [{ incognita: 'x' }, { gramos: 12 }],
  derecha: [{ gramos: 23 }],
  estado: 'equilibrio' as const,
}

const inclinada = { ...equilibrio, estado: 'baja-derecha' as const }

describe('Balanza', () => {
  it('no dice con palabras ni con signos lo que hay que leer del dibujo', () => {
    // Escribir «este lado pesa más» convertiría una pregunta de interpretación
    // en una de lectura, y leer la balanza es justo lo que el libro evalúa.
    const { container } = render(<Balanza datos={inclinada} respondida={false} />)
    const texto = container.textContent ?? ''
    for (const delator of ['mayor', 'menor', 'igual', '<', '>', '=']) {
      expect(texto.toLowerCase()).not.toContain(delator)
    }
  })

  it('muestra las pesas de los dos platillos', () => {
    const { container } = render(<Balanza datos={equilibrio} respondida={false} />)
    expect(container.textContent).toContain('12 g')
    expect(container.textContent).toContain('23 g')
    expect(container.textContent).toContain('x')
  })

  it('la balanza en equilibrio nace apoyada en tacos', () => {
    const { container } = render(<Balanza datos={equilibrio} respondida={false} />)
    expect(container.querySelectorAll('.balanza__taco')).toHaveLength(2)
    expect(container.querySelectorAll('.balanza__taco--fuera')).toHaveLength(0)
  })

  it('al responder se sueltan los tacos', () => {
    const { container } = render(<Balanza datos={equilibrio} respondida={true} />)
    expect(container.querySelectorAll('.balanza__taco--fuera')).toHaveLength(2)
  })

  it('la balanza inclinada no lleva tacos: ahí la inclinación es el enunciado', () => {
    const { container } = render(<Balanza datos={inclinada} respondida={false} />)
    expect(container.querySelectorAll('.balanza__taco')).toHaveLength(0)
  })

  it('el estado va en una clase, para que lo exprese la geometría', () => {
    const { container } = render(<Balanza datos={inclinada} respondida={false} />)
    expect(container.querySelector('.balanza--baja-derecha')).not.toBeNull()
  })
})
