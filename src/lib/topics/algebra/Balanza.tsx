import type { Balanza as DatosBalanza, Pesa } from './generators'
import './Balanza.css'

function Pesas({ pesas }: { pesas: Pesa[] }) {
  return (
    <div className="balanza__pesas">
      {pesas.map((pesa, i) => (
        <span
          key={i}
          className={pesa.incognita ? 'balanza__pesa balanza__pesa--incognita' : 'balanza__pesa'}
        >
          {pesa.incognita ?? `${pesa.gramos} g`}
        </span>
      ))}
    </div>
  )
}

// `respondida` sólo cambia algo en las balanzas en equilibrio: los tacos salen
// y el travesaño se queda nivelado por sí solo, que es la demostración de que
// la ecuación era cierta. Las inclinadas nacen sin tacos, porque ahí la
// inclinación es el enunciado y esconderla borraría la pregunta.
export function Balanza({ datos, respondida }: { datos: DatosBalanza; respondida: boolean }) {
  const conTacos = datos.estado === 'equilibrio'

  return (
    <div className={`balanza balanza--${datos.estado}`}>
      <div className="balanza__brazos">
        <div className="balanza__travesano" />
        <div className="balanza__lado balanza__lado--izquierda">
          <Pesas pesas={datos.izquierda} />
          <div className="balanza__plato" />
        </div>
        <div className="balanza__lado balanza__lado--derecha">
          <Pesas pesas={datos.derecha} />
          <div className="balanza__plato" />
        </div>
      </div>
      <div className="balanza__pie" />
      {conTacos ? (
        <div className="balanza__tacos">
          <span className={respondida ? 'balanza__taco balanza__taco--fuera' : 'balanza__taco'} />
          <span className={respondida ? 'balanza__taco balanza__taco--fuera' : 'balanza__taco'} />
        </div>
      ) : null}
      <div className="balanza__base" />
    </div>
  )
}
