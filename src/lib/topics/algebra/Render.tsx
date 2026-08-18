import type { ExerciseRenderProps } from '../types'
import { algebraPayload } from './generators'
import './Render.css'

function Tira({ terminos, oculto, conPuntos }: { terminos: number[]; oculto?: number; conPuntos?: boolean }) {
  return (
    <div className="algebra__secuencia">
      {terminos.map((valor, i) => {
        const esOculto = oculto === i + 1
        const ultimo = i === terminos.length - 1
        return (
          <span key={i} className={esOculto ? 'algebra__termino--oculto' : undefined}>
            {esOculto ? '?' : valor}
            {ultimo ? '' : ','}
          </span>
        )
      })}
      {conPuntos ? <span className="algebra__puntos">…</span> : null}
    </div>
  )
}

export function Render({ exercise }: ExerciseRenderProps) {
  const { mostrados, posicionOculta, posicionPedida, prompt } = algebraPayload(exercise)

  if (exercise.type === 'construir') {
    return <p className="algebra__enunciado">{prompt}</p>
  }

  if (!mostrados) return null

  return (
    <Tira
      terminos={mostrados}
      oculto={posicionOculta}
      // Los puntos suspensivos dicen que la secuencia sigue: son los que hacen
      // legible preguntar por el 100.º término mostrando solo cinco.
      conPuntos={posicionPedida !== undefined || posicionOculta === undefined}
    />
  )
}
