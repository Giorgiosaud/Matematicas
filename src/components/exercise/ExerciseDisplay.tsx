import { motion } from 'framer-motion'
import type { Exercise } from '../../lib/types'
import { getTopic } from '../../lib/topics'

// Este archivo ya no sabe nada de fracciones: despacha al renderizador del tema
// del ejercicio. Lo que queda aquí es lo genérico — la rejilla de opciones y el
// formato de las etiquetas, que sirven igual para cualquier tema.

export function renderExercise(ex: Exercise, selectedOpt: string | null = null) {
  const { Render } = getTopic(ex.topic)
  return <Render exercise={ex} selectedOption={selectedOpt} />
}

export function ExerciseVisual({ exercise, color }: { exercise: Exercise; color: string }) {
  const { Visual } = getTopic(exercise.topic)
  if (!Visual) return null
  return <Visual exercise={exercise} color={color} />
}

export function exerciseLabel(ex: Exercise) {
  return getTopic(ex.topic).describe(ex)
}

// Render option label nicely (fractions inline)
export function OptionLabel({ text }: { text: string }) {
  // e.g. "3/4" → render as fraction, "1 y 3/4" → "1 y 3/4" with fraction part styled
  if (text === '>' || text === '<' || text === '=') {
    return <span className="text-2xl font-black">{text}</span>
  }
  // mixed: "1 y 3/4"
  const mixedMatch = text.match(/^(\d+)\sy\s(\d+)\/(\d+)$/)
  if (mixedMatch) {
    return (
      <span className="flex items-center gap-1 text-lg font-bold">
        {mixedMatch[1]} y
        <span className="inline-flex flex-col items-center leading-none text-base mx-1">
          <span>{mixedMatch[2]}</span>
          <span className="w-full border-t border-current my-0.5" />
          <span>{mixedMatch[3]}</span>
        </span>
      </span>
    )
  }
  // plain fraction: "3/4"
  const fracMatch = text.match(/^(\d+)\/(\d+)$/)
  if (fracMatch) {
    return (
      <span className="inline-flex flex-col items-center leading-none text-base font-bold">
        <span>{fracMatch[1]}</span>
        <span className="w-full border-t border-current my-0.5" />
        <span>{fracMatch[2]}</span>
      </span>
    )
  }
  // number
  return <span className="text-xl font-bold">{text}</span>
}

interface OptionGridProps {
  options: string[]
  locked: boolean
  onSelect: (opt: string) => void
  wrongSelections: string[]
  correctAnswer: string
  revealCorrect: boolean
  color: 'blue' | 'red'
}

export function OptionGrid({ options, locked, onSelect, wrongSelections, correctAnswer, revealCorrect, color }: OptionGridProps) {
  const accentColor = color === 'blue' ? '#1D9BF0' : '#FF3B3B'
  const canClick = locked && !revealCorrect

  return (
    <div className={`grid gap-1.5 sm:gap-2 grid-cols-3 w-full max-w-xs sm:max-w-sm transition-opacity ${!locked ? 'opacity-40' : ''}`}>
      {options.map((opt, i) => {
        const isWrong = wrongSelections.includes(opt)
        const isCorrect = revealCorrect && opt === correctAnswer

        let style: React.CSSProperties
        let extraCls = ''

        if (isCorrect) {
          style = { border: '3px solid #00E676', background: 'rgba(0,230,118,0.15)', color: '#00E676', boxShadow: '0 0 12px #00E676, 3px 3px 0 #000' }
        } else if (isWrong) {
          style = { border: '3px solid rgba(255,59,59,0.5)', background: 'rgba(255,59,59,0.08)', color: 'rgba(255,59,59,0.5)', boxShadow: '3px 3px 0 #000' }
          extraCls = 'line-through'
        } else if (canClick) {
          style = { border: `3px solid ${accentColor}`, background: '#16162A', color: 'white', boxShadow: '3px 3px 0 #000', cursor: 'pointer' }
        } else {
          style = { border: '3px solid #2a2a4a', background: '#16162A', color: '#444', boxShadow: '3px 3px 0 #000' }
        }

        return (
          <motion.button
            key={opt}
            whileTap={canClick && !isWrong ? { scale: 0.93, x: 2, y: 2 } : {}}
            onClick={() => canClick && !isWrong && onSelect(opt)}
            style={style}
            className={`rounded-xl px-2 sm:px-3 py-2 sm:py-3 flex items-center justify-center min-h-[44px] sm:min-h-[56px] transition-colors ${extraCls}`}
            title={locked ? `Opción ${i + 1}` : ''}
          >
            <OptionLabel text={opt} />
          </motion.button>
        )
      })}
    </div>
  )
}

export function buildHint(ex: Exercise): string {
  return getTopic(ex.topic).hint(ex)
}
