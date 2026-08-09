import type { Topic } from '../types'
import { generators } from './generators'
import { Render } from './Render'
import { describe, hint } from './text'

export const decimales: Topic = {
  id: 'decimales',
  label: 'DECIMALES',
  generators,
  Render,
  describe,
  hint,
}
