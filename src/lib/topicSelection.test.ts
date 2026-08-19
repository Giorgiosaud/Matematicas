import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { DEFAULT_TOPICS } from './topics'
import { loadTopics, saveTopics, topicCategory } from './topicSelection'

beforeEach(() => localStorage.clear())
afterEach(() => vi.restoreAllMocks())

describe('loadTopics', () => {
  it('arranca con todos los temas marcados en un dispositivo nuevo', () => {
    // Con tres temas registrados, empezar solo en fracciones dejaría fuera por
    // defecto justo lo que el niño está estudiando.
    expect(loadTopics()).toEqual([...DEFAULT_TOPICS])
    expect(loadTopics().length).toBeGreaterThan(1)
  })

  it('recuerda la selección de la sesión anterior', () => {
    saveTopics(['decimales'])
    expect(loadTopics()).toEqual(['decimales'])
  })

  it('ignora un tema guardado que ya no existe', () => {
    localStorage.setItem('fracciones:topics', JSON.stringify(['decimales', 'geometria']))
    expect(loadTopics()).toEqual(['decimales'])
  })

  it('vuelve a la selección por defecto si no queda ningún tema válido', () => {
    localStorage.setItem('fracciones:topics', JSON.stringify(['geometria']))
    expect(loadTopics()).toEqual([...DEFAULT_TOPICS])
  })

  it('tolera contenido corrupto', () => {
    localStorage.setItem('fracciones:topics', 'no es json')
    expect(loadTopics()).toEqual([...DEFAULT_TOPICS])
  })

  it('tolera que el almacenamiento no esté disponible', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('bloqueado') })
    expect(loadTopics()).toEqual([...DEFAULT_TOPICS])
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

  it('clasifica una sesión solo de álgebra en su propia categoría', () => {
    // Sin esto el Worker no reconocería el valor y lo archivaría como
    // fracciones: el puntaje competiría contra partidas de otro contenido.
    expect(topicCategory(['algebra'])).toBe('algebra')
  })

  it('clasifica una sesión solo de problemas en su propia categoría', () => {
    expect(topicCategory(['problemas'])).toBe('problemas')
  })

  it('cualquier combinación con álgebra es mixto', () => {
    expect(topicCategory(['algebra', 'decimales'])).toBe('mixto')
    expect(topicCategory(['fracciones', 'algebra'])).toBe('mixto')
  })

  it('clasifica como mixto cuando la sesión combina temas', () => {
    expect(topicCategory(['fracciones', 'decimales'])).toBe('mixto')
  })

  it('trata una selección vacía como fracciones', () => {
    expect(topicCategory([])).toBe('fracciones')
  })
})
