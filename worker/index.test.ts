import { describe, it, expect } from 'vitest'
import { readTopicCategory } from './index'

describe('readTopicCategory', () => {
  it('respeta las categorías conocidas', () => {
    expect(readTopicCategory('fracciones')).toBe('fracciones')
    expect(readTopicCategory('decimales')).toBe('decimales')
    expect(readTopicCategory('mixto')).toBe('mixto')
  })

  it('trata cualquier valor desconocido como fracciones en vez de rechazarlo', () => {
    // Perder el puntaje de un niño es peor que archivarlo en la categoría
    // equivocada: un cliente viejo o una partida encolada antes del cambio
    // deben seguir contando.
    expect(readTopicCategory('algebra')).toBe('fracciones')
    expect(readTopicCategory(undefined)).toBe('fracciones')
    expect(readTopicCategory(null)).toBe('fracciones')
    expect(readTopicCategory(42)).toBe('fracciones')
    expect(readTopicCategory('')).toBe('fracciones')
  })
})
