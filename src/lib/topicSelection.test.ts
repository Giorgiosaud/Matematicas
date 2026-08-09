import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { loadTopics, saveTopics, topicCategory } from './topicSelection'

beforeEach(() => localStorage.clear())
afterEach(() => vi.restoreAllMocks())

describe('loadTopics', () => {
  it('arranca en fracciones en un dispositivo nuevo', () => {
    expect(loadTopics()).toEqual(['fracciones'])
  })

  it('recuerda la selección de la sesión anterior', () => {
    saveTopics(['decimales'])
    expect(loadTopics()).toEqual(['decimales'])
  })

  it('ignora un tema guardado que ya no existe', () => {
    localStorage.setItem('fracciones:topics', JSON.stringify(['decimales', 'algebra']))
    expect(loadTopics()).toEqual(['decimales'])
  })

  it('vuelve a fracciones si no queda ningún tema válido', () => {
    localStorage.setItem('fracciones:topics', JSON.stringify(['algebra']))
    expect(loadTopics()).toEqual(['fracciones'])
  })

  it('tolera contenido corrupto', () => {
    localStorage.setItem('fracciones:topics', 'no es json')
    expect(loadTopics()).toEqual(['fracciones'])
  })

  it('tolera que el almacenamiento no esté disponible', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('bloqueado') })
    expect(loadTopics()).toEqual(['fracciones'])
  })
})

describe('saveTopics', () => {
  it('no revienta si el almacenamiento falla', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('lleno') })
    expect(() => saveTopics(['decimales'])).not.toThrow()
  })
})

describe('topicCategory', () => {
  it('clasifica una sesión de un solo tema con ese tema', () => {
    expect(topicCategory(['fracciones'])).toBe('fracciones')
    expect(topicCategory(['decimales'])).toBe('decimales')
  })

  it('clasifica como mixto cuando la sesión combina temas', () => {
    expect(topicCategory(['fracciones', 'decimales'])).toBe('mixto')
  })

  it('trata una selección vacía como fracciones', () => {
    expect(topicCategory([])).toBe('fracciones')
  })
})
