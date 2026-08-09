import type { FractionValue } from '../../types'
import type { Exercise, ExerciseRenderProps } from '../types'
import { fraccionesPayload } from './generators'
import FractionVisualizer from '../../../components/FractionVisualizer'

export function FractionDisplay({ frac }: { frac: FractionValue }) {
  return (
    <span className="inline-flex flex-col items-center leading-none">
      <span>{frac.numerator}</span>
      <span className="w-full border-t-2 border-white my-1" />
      <span>{frac.denominator}</span>
    </span>
  )
}

export function Render({ exercise, selectedOption }: ExerciseRenderProps) {
  const { fractionA, fractionB, targetDenominator } = fraccionesPayload(exercise)

  if (exercise.type === 'compare') {
    const symbol = selectedOption ?? '?'
    const symbolColor = selectedOption ? 'text-[#FFD700]' : 'text-white/40'
    return (
      <div className="flex items-center gap-3 sm:gap-5 md:gap-6 text-2xl sm:text-3xl md:text-4xl font-black">
        <FractionDisplay frac={fractionA} />
        <span className={`text-3xl sm:text-4xl md:text-5xl w-8 sm:w-10 md:w-12 text-center transition-all ${symbolColor}`}>{symbol}</span>
        <FractionDisplay frac={fractionB!} />
      </div>
    )
  }
  if (exercise.type === 'simplify') {
    return (
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-2xl sm:text-3xl md:text-4xl font-black">
        <FractionDisplay frac={fractionA} />
        <span className="text-white/40">=</span>
        <span className="text-[#FFD700] text-3xl sm:text-4xl md:text-5xl">?</span>
      </div>
    )
  }
  if (exercise.type === 'amplify') {
    return (
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-2xl sm:text-3xl md:text-4xl font-black">
        <FractionDisplay frac={fractionA} />
        <span className="text-white/40">=</span>
        <div className="inline-flex flex-col items-center leading-none">
          <span className="text-[#FFD700]">?</span>
          <span className="w-full border-t-2 border-white my-1" />
          <span>{targetDenominator}</span>
        </div>
      </div>
    )
  }
  if (exercise.type === 'add' || exercise.type === 'subtract') {
    return (
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-2xl sm:text-3xl md:text-4xl font-black">
        <FractionDisplay frac={fractionA} />
        <span className="text-white/40">{exercise.type === 'add' ? '+' : '−'}</span>
        <FractionDisplay frac={fractionB!} />
        <span className="text-white/40">=</span>
        <span className="text-[#FFD700] text-3xl sm:text-4xl md:text-5xl">?</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-2xl sm:text-3xl md:text-4xl font-black">
      <FractionDisplay frac={fractionA} />
      <span className="text-white/40">=</span>
      <span className="text-[#FFD700] text-2xl sm:text-3xl">? y ?/?</span>
    </div>
  )
}

export function Visual({ exercise, color }: { exercise: Exercise; color: string }) {
  return <FractionVisualizer fraction={fraccionesPayload(exercise).fractionA} color={color} />
}
