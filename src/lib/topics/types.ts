import type { ComponentType } from 'react'

export type TopicId = 'fracciones' | 'decimales' | 'algebra' | 'problemas'

// Lo único que el juego consume de un ejercicio. Los datos propios de cada tema
// viven en `payload`, y solo el tema que lo produjo sabe qué hay dentro — así
// agregar un tema no ensancha este tipo ni obliga a tocar las pantallas de juego.
export interface Exercise {
  topic: TopicId
  type: string
  answer: string
  displayAnswer: string
  options: string[]
  payload: unknown
}

export interface ExerciseRenderProps {
  exercise: Exercise
  // Opción elegida por el jugador; algunos temas la muestran dentro del enunciado
  // (comparar la pinta entre los dos números en vez de dejar un "?").
  selectedOption: string | null
}

export interface Topic {
  id: TopicId
  label: string
  generators: Record<string, (round: number) => Exercise>
  Render: ComponentType<ExerciseRenderProps>
  // Apoyo gráfico opcional bajo el enunciado (las fracciones muestran una barra
  // partida; un tema que no lo necesite simplemente no lo declara).
  Visual?: ComponentType<{ exercise: Exercise; color: string }>
  // Enunciado corto que acompaña al ejercicio ("Simplifica la fracción").
  describe: (exercise: Exercise) => string
  hint: (exercise: Exercise) => string
}
