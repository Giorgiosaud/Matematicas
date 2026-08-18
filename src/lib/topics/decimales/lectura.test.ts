import { describe, it, expect } from 'vitest'
import { parse } from './decimal'
import { leerDecimal, nombrePosicion } from './lectura'

describe('nombrePosicion', () => {
  it('nombra cada posición decimal en singular y plural', () => {
    expect(nombrePosicion(1, false)).toBe('décima')
    expect(nombrePosicion(1, true)).toBe('décimas')
    expect(nombrePosicion(2, true)).toBe('centésimas')
    expect(nombrePosicion(3, true)).toBe('milésimas')
  })
})

describe('leerDecimal', () => {
  it('lee la parte decimal por su posición', () => {
    expect(leerDecimal(parse('0.3'))).toBe('tres décimas')
    expect(leerDecimal(parse('0.25'))).toBe('veinticinco centésimas')
    expect(leerDecimal(parse('0.125'))).toBe('ciento veinticinco milésimas')
  })

  it('concuerda en singular cuando es una sola', () => {
    expect(leerDecimal(parse('0.1'))).toBe('una décima')
    expect(leerDecimal(parse('0.01'))).toBe('una centésima')
  })

  it('antepone la parte entera cuando la hay', () => {
    expect(leerDecimal(parse('3.4'))).toBe('tres enteros y cuatro décimas')
    expect(leerDecimal(parse('1.5'))).toBe('un entero y cinco décimas')
  })

  it('lee un número sin parte decimal como un entero cualquiera', () => {
    expect(leerDecimal(parse('20'))).toBe('veinte')
  })

  it('trata los ceros a la derecha como parte del número leído', () => {
    // 0,50 son cincuenta centésimas; que se muestre como 0,5 es otra cosa.
    expect(leerDecimal(parse('0.50'))).toBe('cincuenta centésimas')
  })
})
