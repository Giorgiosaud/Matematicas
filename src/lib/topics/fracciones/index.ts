import type { Topic } from '../types'
import { generators } from './generators'
import { Render, Visual } from './Render'
import { describe, hint } from './text'

export const fracciones: Topic = {
  id: 'fracciones',
  label: 'FRACCIONES',
  generators,
  Render,
  Visual,
  describe,
  hint,
}
