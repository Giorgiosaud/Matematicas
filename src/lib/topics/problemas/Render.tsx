import type { ExerciseRenderProps } from '../types'
import { problemasPayload } from './generators'
import './Render.css'

export function Render({ exercise }: ExerciseRenderProps) {
  return <p className="problema">{problemasPayload(exercise).enunciado}</p>
}
