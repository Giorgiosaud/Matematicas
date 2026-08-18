import type { Topic } from '../types'
import { generators } from './generators'
import { Render } from './Render'
import { describe, hint } from './text'

export const algebra: Topic = {
  id: 'algebra',
  label: 'ÁLGEBRA',
  generators,
  Render,
  describe,
  hint,
}
