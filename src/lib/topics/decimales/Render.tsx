import type { ExerciseRenderProps } from '../types'
import { decimalesPayload } from './generators'
import { format } from './decimal'
import { nombrePosicion } from './lectura'

function Numero({ children }: { children: React.ReactNode }) {
  return <span className="tabular-nums">{children}</span>
}

function Incognita() {
  return <span className="text-[#FFD700] text-3xl sm:text-4xl md:text-5xl">?</span>
}

function Fila({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 md:gap-4 text-2xl sm:text-3xl md:text-4xl font-black text-center">
      {children}
    </div>
  )
}

export function Render({ exercise, selectedOption }: ExerciseRenderProps) {
  const { value, other, fraction, targetScale, position, prompt } = decimalesPayload(exercise)

  if (exercise.type === 'comparar') {
    const symbol = selectedOption ?? '?'
    const symbolColor = selectedOption ? 'text-[#FFD700]' : 'text-white/40'
    return (
      <Fila>
        <Numero>{format(value)}</Numero>
        <span className={`w-8 sm:w-10 md:w-12 text-center transition-all ${symbolColor}`}>{symbol}</span>
        <Numero>{format(other!)}</Numero>
      </Fila>
    )
  }

  if (exercise.type === 'escribir') {
    return (
      <div className="text-center">
        <p className="text-xl sm:text-2xl md:text-3xl font-black leading-tight">«{prompt}»</p>
      </div>
    )
  }

  if (exercise.type === 'fraccion-a-decimal') {
    return (
      <Fila>
        <span className="inline-flex flex-col items-center leading-none">
          <span>{fraction!.numerator}</span>
          <span className="w-full border-t-2 border-white my-1" />
          <span>{fraction!.denominator}</span>
        </span>
        <span className="text-white/40">=</span>
        <Incognita />
      </Fila>
    )
  }

  if (exercise.type === 'decimal-a-fraccion') {
    return (
      <Fila>
        <Numero>{format(value)}</Numero>
        <span className="text-white/40">=</span>
        <Incognita />
      </Fila>
    )
  }

  if (exercise.type === 'redondear') {
    return (
      <div className="text-center">
        <Fila><Numero>{format(value)}</Numero></Fila>
        <p className="mt-2 text-sm sm:text-base text-white/60 font-bold tracking-wide">
          a las {nombrePosicion(targetScale!, true)}
        </p>
      </div>
    )
  }

  if (exercise.type === 'valor-posicional') {
    // Se resalta la cifra por la que se pregunta: sin eso el enunciado obliga
    // a contar posiciones de memoria, que no es lo que se está evaluando.
    const texto = format(value)
    const coma = texto.indexOf(',')
    const indice = coma + position!
    return (
      <Fila>
        <Numero>
          {texto.split('').map((c, i) => (
            <span key={i} className={i === indice ? 'text-[#FFD700] underline decoration-4 underline-offset-4' : undefined}>{c}</span>
          ))}
        </Numero>
      </Fila>
    )
  }

  // leer
  return (
    <Fila>
      <Numero>{format(value)}</Numero>
    </Fila>
  )
}
