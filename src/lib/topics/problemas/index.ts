import type { Topic } from '../types'
import { generators } from './generators'
import { Render } from './Render'
import { describe, hint } from './text'

export const problemas: Topic = {
  id: 'problemas',
  label: 'PROBLEMAS',
  generators,
  Render,
  describe,
  hint,
}
