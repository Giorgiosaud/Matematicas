import type { ExerciseRenderProps } from '../types'
import { Balanza } from './Balanza'
import { algebraPayload } from './generators'
import { listarValores } from './text'
import './Render.css'

// Los tokens del tema viven en `.algebra`; sin este contenedor las variables no
// resuelven y el navegador descarta las declaraciones que las usan — se pierden
// el espaciado de la tira, el tamaño y el amarillo de la incógnita.
function Marco({ children }: { children: React.ReactNode }) {
  return <div className="algebra">{children}</div>
}

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

export function Render({ exercise, selectedOption }: ExerciseRenderProps) {
  const { mostrados, posicionOculta, posicionPedida, prompt, expresion, valores, balanza } = algebraPayload(exercise)

  // La balanza vive en su propio componente y no dentro de este `switch`: el
  // tema ya tiene cuatro formas de presentación y dejarla crecer aquí es como
  // este archivo se vuelve el que nadie quiere tocar.
  if (balanza) {
    return (
      <Marco>
        <Balanza datos={balanza} respondida={selectedOption !== null} />
      </Marco>
    )
  }

  // La frase se lee, no se calcula: va como enunciado y la expresión aparece
  // en las opciones.
  if (
    exercise.type === 'construir'
    || exercise.type === 'frase-a-expresion'
    || exercise.type === 'ecuacion-desde-frase'
    || exercise.type === 'desigualdad'
  ) {
    return <Marco><p className="algebra__enunciado">{prompt}</p></Marco>
  }

  if (expresion) {
    return (
      <Marco>
        <div className="algebra__expresion">
          {valores ? <p className="algebra__sustitucion">si {listarValores(valores)}</p> : null}
          <p className="algebra__formula">{expresion}</p>
        </div>
      </Marco>
    )
  }

  if (!mostrados) return null

  return (
    <Marco>
      <Tira
        terminos={mostrados}
        oculto={posicionOculta}
        // Los puntos suspensivos dicen que la secuencia sigue: son los que hacen
        // legible preguntar por el 100.º término mostrando solo cinco.
        conPuntos={posicionPedida !== undefined || posicionOculta === undefined}
      />
    </Marco>
  )
}
