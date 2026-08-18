import { describe, it, expect } from 'vitest'
import { numeroEnPalabras } from './palabras'

describe('numeroEnPalabras', () => {
  it('cubre unidades, decenas y centenas', () => {
    expect(numeroEnPalabras(0)).toBe('cero')
    expect(numeroEnPalabras(3)).toBe('tres')
    expect(numeroEnPalabras(16)).toBe('dieciséis')
    expect(numeroEnPalabras(25)).toBe('veinticinco')
    expect(numeroEnPalabras(42)).toBe('cuarenta y dos')
    expect(numeroEnPalabras(100)).toBe('cien')
    expect(numeroEnPalabras(101)).toBe('ciento uno')
    expect(numeroEnPalabras(375)).toBe('trescientos setenta y cinco')
    expect(numeroEnPalabras(500)).toBe('quinientos')
  })

  it('concuerda en femenino, porque las décimas y centésimas lo son', () => {
    expect(numeroEnPalabras(1, true)).toBe('una')
    expect(numeroEnPalabras(21, true)).toBe('veintiuna')
    expect(numeroEnPalabras(31, true)).toBe('treinta y una')
    expect(numeroEnPalabras(200, true)).toBe('doscientas')
    expect(numeroEnPalabras(500, true)).toBe('quinientas')
  })
})
