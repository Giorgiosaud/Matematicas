// El catálogo de problemas. Los contextos se escriben a mano —es lo único que
// ninguna plantilla hace bien— y los números se sortean en cada aparición, para
// que la respuesta no se pueda memorizar.
//
// Regla que no se negocia: **el enunciado nunca nombra la técnica**. Decidir qué
// hacer con los datos es el ejercicio; decirlo lo anula. `tecnica` existe solo
// para comprobar la cobertura del catálogo y para redactar la pista.

export type Tecnica = 'decimales' | 'fracciones' | 'ecuacion' | 'inecuacion'

export interface ProblemaGenerado {
  enunciado: string
  // Los números que aparecen en el enunciado. Sirven para comprobar que el
  // sorteo no se salió de lo creíble.
  cantidades: number[]
  respuesta: number
  // Cómo se plantea, para las preguntas de «qué operación lo resuelve».
  operacion: string
  // Cómo se equivoca la gente con este problema. No son números al azar: quien
  // falla un problema de contexto no se equivoca calculando, se equivoca
  // eligiendo qué calcular.
  errores: { operacion: string; valor: number }[]
}

export interface Contexto {
  id: string
  tecnica: Tecnica
  // Unidad que acompaña a la respuesta y a todas las opciones. Si una opción
  // llevara otra, se descartaría sin resolver el problema.
  unidad?: string
  // Magnitudes creíbles para esta situación. Una mochila de 340 kg rompe el
  // enunciado: el niño deja de leerlo como algo que pasa.
  limites: { min: number; max: number }
  construir(): ProblemaGenerado
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Coma decimal y sin ceros de relleno, como el libro.
export function numero(valor: number): string {
  const redondeado = Math.round(valor * 1000) / 1000
  return String(redondeado).replace('.', ',')
}

// Vuelve a sortear hasta que el problema no salga trivial. Un problema cuya
// respuesta es uno de los datos del enunciado, o cuya resta da cero, se acierta
// sin entenderlo. El tope evita girar para siempre si un contexto está mal
// planteado; en ese caso las pruebas del catálogo lo cazan.
export function sortearHasta(intentar: () => ProblemaGenerado): ProblemaGenerado {
  let ultimo = intentar()
  for (let i = 0; i < 60; i++) {
    if (esUtil(ultimo)) return ultimo
    ultimo = intentar()
  }
  return ultimo
}

function esUtil(p: ProblemaGenerado): boolean {
  if (p.respuesta <= 0) return false
  if (p.cantidades.includes(p.respuesta)) return false
  return p.errores.every(e => e.valor !== p.respuesta)
}

export const CONTEXTOS: Contexto[] = [
  {
    id: 'mochila',
    tecnica: 'decimales',
    unidad: 'kg',
    limites: { min: 0.2, max: 12 },
    construir() {
      return sortearHasta(() => {
      const vacia = randInt(4, 12) / 10
      const libros = randInt(400, 3000) / 1000
      const llena = Math.round((vacia + libros) * 1000) / 1000
      return {
        enunciado: `La mochila de Sofía vacía tiene una masa de ${numero(vacia)} kg y llena de libros, ${numero(llena)} kg. ¿Cuál es la masa de los libros?`,
        cantidades: [vacia, llena],
        respuesta: libros,
        operacion: `${numero(llena)} − ${numero(vacia)}`,
        errores: [
          { operacion: `${numero(llena)} + ${numero(vacia)}`, valor: Math.round((llena + vacia) * 1000) / 1000 },
          { operacion: `${numero(llena)}`, valor: llena },
        ],
      }
      })
    },
  },
  {
    id: 'feria',
    tecnica: 'inecuacion',
    unidad: 'kg',
    limites: { min: 0.5, max: 30 },
    construir() {
      return sortearHasta(() => {
      const maximo = randInt(8, 20)
      const yaLleva = randInt(2, maximo - 3)
      return {
        enunciado: `El carro de la feria aguanta ${maximo} kg como máximo. Carlos ya cargó ${yaLleva} kg. ¿Cuántos kilos más puede echar sin pasarse?`,
        cantidades: [maximo, yaLleva],
        respuesta: maximo - yaLleva,
        operacion: `${maximo} − ${yaLleva}`,
        errores: [
          { operacion: `${maximo} + ${yaLleva}`, valor: maximo + yaLleva },
          { operacion: `${maximo}`, valor: maximo },
        ],
      }
      })
    },
  },
  {
    id: 'lluvia-semana',
    tecnica: 'decimales',
    unidad: 'mm',
    limites: { min: 0.3, max: 22 },
    construir() {
      return sortearHasta(() => {
        const lunes = randInt(3, 220) / 10
        const jueves = randInt(3, 220) / 10
        return {
          enunciado: `Según el pluviómetro de la escuela, el lunes cayeron ${numero(lunes)} mm de agua y el jueves cayeron ${numero(jueves)} mm. ¿Cuántos milímetros de lluvia cayeron esos dos días en total?`,
          cantidades: [lunes, jueves],
          respuesta: Math.round((lunes + jueves) * 1000) / 1000,
          operacion: `${numero(lunes)} + ${numero(jueves)}`,
          errores: [
            { operacion: `${numero(Math.max(lunes, jueves))} − ${numero(Math.min(lunes, jueves))}`, valor: Math.round(Math.abs(lunes - jueves) * 1000) / 1000 },
            { operacion: `${numero(Math.max(lunes, jueves))}`, valor: Math.max(lunes, jueves) },
          ],
        }
      })
    },
  },
  {
    id: 'estatura-companeros',
    tecnica: 'decimales',
    unidad: 'm',
    limites: { min: 1.2, max: 1.6 },
    construir() {
      return sortearHasta(() => {
        const pedro = randInt(120, 160) / 100
        const tomas = randInt(120, 160) / 100
        const mayor = Math.max(pedro, tomas)
        const menor = Math.min(pedro, tomas)
        return {
          enunciado: `Pedro mide ${numero(pedro)} m y su amigo Tomás mide ${numero(tomas)} m. ¿Cuántos metros más mide el más alto de los dos?`,
          cantidades: [pedro, tomas],
          respuesta: Math.round((mayor - menor) * 1000) / 1000,
          operacion: `${numero(mayor)} − ${numero(menor)}`,
          errores: [
            { operacion: `${numero(pedro)} + ${numero(tomas)}`, valor: Math.round((pedro + tomas) * 1000) / 1000 },
            { operacion: `${numero(mayor)}`, valor: mayor },
          ],
        }
      })
    },
  },
  {
    id: 'vuelta-pista',
    tecnica: 'decimales',
    unidad: 's',
    limites: { min: 12, max: 24 },
    construir() {
      return sortearHasta(() => {
        const camila = randInt(1200, 2400) / 100
        const antonia = randInt(1200, 2400) / 100
        const mayor = Math.max(camila, antonia)
        const menor = Math.min(camila, antonia)
        return {
          enunciado: `En la prueba de 100 metros, Camila corrió en ${numero(camila)} s y Antonia en ${numero(antonia)} s. ¿Por cuántos segundos le ganó la más rápida a la otra?`,
          cantidades: [camila, antonia],
          respuesta: Math.round((mayor - menor) * 1000) / 1000,
          operacion: `${numero(mayor)} − ${numero(menor)}`,
          errores: [
            { operacion: `${numero(camila)} + ${numero(antonia)}`, valor: Math.round((camila + antonia) * 1000) / 1000 },
            { operacion: `${numero(menor)}`, valor: menor },
          ],
        }
      })
    },
  },
  {
    id: 'bicicleta-dos-dias',
    tecnica: 'decimales',
    unidad: 'km',
    limites: { min: 1.5, max: 12 },
    construir() {
      return sortearHasta(() => {
        const sabado = randInt(15, 120) / 10
        const domingo = randInt(15, 120) / 10
        return {
          enunciado: `En bicicleta, Matías recorrió ${numero(sabado)} km el sábado y ${numero(domingo)} km el domingo. ¿Cuántos kilómetros recorrió en total ese fin de semana?`,
          cantidades: [sabado, domingo],
          respuesta: Math.round((sabado + domingo) * 1000) / 1000,
          operacion: `${numero(sabado)} + ${numero(domingo)}`,
          errores: [
            { operacion: `${numero(Math.max(sabado, domingo))} − ${numero(Math.min(sabado, domingo))}`, valor: Math.round(Math.abs(sabado - domingo) * 1000) / 1000 },
            { operacion: `${numero(sabado)}`, valor: sabado },
          ],
        }
      })
    },
  },
  {
    id: 'temperatura-dia',
    tecnica: 'decimales',
    unidad: '°C',
    limites: { min: 5, max: 27 },
    construir() {
      return sortearHasta(() => {
        const manana = randInt(50, 180) / 10
        const subida = randInt(5, 90) / 10
        const tarde = Math.round((manana + subida) * 1000) / 1000
        return {
          enunciado: `En Rancagua, en la mañana el termómetro marcaba ${numero(manana)} °C y en la tarde marcaba ${numero(tarde)} °C. ¿Cuántos grados subió la temperatura entre la mañana y la tarde?`,
          cantidades: [manana, tarde],
          respuesta: subida,
          operacion: `${numero(tarde)} − ${numero(manana)}`,
          errores: [
            { operacion: `${numero(tarde)} + ${numero(manana)}`, valor: Math.round((tarde + manana) * 1000) / 1000 },
            { operacion: `${numero(tarde)}`, valor: tarde },
          ],
        }
      })
    },
  },
  {
    id: 'botella-bebida',
    tecnica: 'decimales',
    unidad: 'L',
    limites: { min: 0.3, max: 3 },
    construir() {
      return sortearHasta(() => {
        const llena = randInt(15, 30) / 10
        const servido = randInt(3, 12) / 10
        return {
          enunciado: `La botella de bebida tenía ${numero(llena)} L y en el almuerzo se sirvieron ${numero(servido)} L. ¿Cuántos litros quedan en la botella?`,
          cantidades: [llena, servido],
          respuesta: Math.round((llena - servido) * 1000) / 1000,
          operacion: `${numero(llena)} − ${numero(servido)}`,
          errores: [
            { operacion: `${numero(llena)} + ${numero(servido)}`, valor: Math.round((llena + servido) * 1000) / 1000 },
            { operacion: `${numero(servido)}`, valor: servido },
          ],
        }
      })
    },
  },
  {
    id: 'pecera-agua',
    tecnica: 'decimales',
    unidad: 'L',
    limites: { min: 0.3, max: 2.5 },
    construir() {
      return sortearHasta(() => {
        const inicial = randInt(8, 25) / 10
        const agregada = randInt(3, 15) / 10
        return {
          enunciado: `La pecera tenía ${numero(inicial)} L de agua y Valentina le agregó ${numero(agregada)} L más. ¿Cuántos litros de agua quedaron en la pecera en total?`,
          cantidades: [inicial, agregada],
          respuesta: Math.round((inicial + agregada) * 1000) / 1000,
          operacion: `${numero(inicial)} + ${numero(agregada)}`,
          errores: [
            { operacion: `${numero(inicial)} − ${numero(agregada)}`, valor: Math.round(Math.abs(inicial - agregada) * 1000) / 1000 },
            { operacion: `${numero(inicial)}`, valor: inicial },
          ],
        }
      })
    },
  },
  {
    id: 'cinta-costura',
    tecnica: 'decimales',
    unidad: 'm',
    limites: { min: 0.3, max: 5 },
    construir() {
      return sortearHasta(() => {
        const rollo = randInt(20, 50) / 10
        const usado = randInt(3, 15) / 10
        return {
          enunciado: `Para el disfraz, Renata tenía un rollo de cinta de ${numero(rollo)} m y usó ${numero(usado)} m para el cinturón. ¿Cuántos metros de cinta le quedan?`,
          cantidades: [rollo, usado],
          respuesta: Math.round((rollo - usado) * 1000) / 1000,
          operacion: `${numero(rollo)} − ${numero(usado)}`,
          errores: [
            { operacion: `${numero(rollo)} + ${numero(usado)}`, valor: Math.round((rollo + usado) * 1000) / 1000 },
            { operacion: `${numero(usado)}`, valor: usado },
          ],
        }
      })
    },
  },
  {
    id: 'posta-natacion',
    tecnica: 'decimales',
    unidad: 's',
    limites: { min: 22, max: 38 },
    construir() {
      return sortearHasta(() => {
        const tramo1 = randInt(2200, 3800) / 100
        const tramo2 = randInt(2200, 3800) / 100
        return {
          enunciado: `En la posta de natación de la piscina municipal, el primer tramo se nadó en ${numero(tramo1)} s y el segundo en ${numero(tramo2)} s. ¿Cuánto tiempo tomaron los dos tramos juntos?`,
          cantidades: [tramo1, tramo2],
          respuesta: Math.round((tramo1 + tramo2) * 1000) / 1000,
          operacion: `${numero(tramo1)} + ${numero(tramo2)}`,
          errores: [
            { operacion: `${numero(Math.max(tramo1, tramo2))} − ${numero(Math.min(tramo1, tramo2))}`, valor: Math.round(Math.abs(tramo1 - tramo2) * 1000) / 1000 },
            { operacion: `${numero(tramo1)}`, valor: tramo1 },
          ],
        }
      })
    },
  },
  {
    id: 'bolsa-harina',
    tecnica: 'decimales',
    unidad: 'kg',
    limites: { min: 0.2, max: 5 },
    construir() {
      return sortearHasta(() => {
        const bolsa = randInt(10, 50) / 10
        const usado = randInt(2, 9) / 10
        return {
          enunciado: `Para hacer un queque, la abuela de Ignacio usó ${numero(usado)} kg de harina de una bolsa que tenía ${numero(bolsa)} kg. ¿Cuántos kilos de harina quedaron en la bolsa?`,
          cantidades: [usado, bolsa],
          respuesta: Math.round((bolsa - usado) * 1000) / 1000,
          operacion: `${numero(bolsa)} − ${numero(usado)}`,
          errores: [
            { operacion: `${numero(bolsa)} + ${numero(usado)}`, valor: Math.round((bolsa + usado) * 1000) / 1000 },
            { operacion: `${numero(usado)}`, valor: usado },
          ],
        }
      })
    },
  },
  {
    id: 'paseo-curso',
    tecnica: 'ecuacion',
    unidad: '$',
    limites: { min: 10000, max: 220000 },
    construir() {
      return sortearHasta(() => {
        const meta = randInt(60, 220) * 1000
        const yaJuntaron = randInt(10, Math.floor(meta / 1000) - 15) * 1000
        return {
          enunciado: `El curso de Camila necesita reunir $${meta} para el paseo a Pucón. Hasta ahora llevan juntados $${yaJuntaron}. ¿Cuánto dinero les falta para completar la meta?`,
          cantidades: [meta, yaJuntaron],
          respuesta: meta - yaJuntaron,
          operacion: `${meta} − ${yaJuntaron}`,
          errores: [
            { operacion: `${meta} + ${yaJuntaron}`, valor: meta + yaJuntaron },
            { operacion: `${meta}`, valor: meta },
          ],
        }
      })
    },
  },
  {
    id: 'entradas-cine',
    tecnica: 'ecuacion',
    unidad: '$',
    limites: { min: 3, max: 18000 },
    construir() {
      return sortearHasta(() => {
        const amigos = randInt(3, 6)
        const costoEntrada = randInt(2, 6) * 500
        const total = amigos * costoEntrada
        return {
          enunciado: `Entre ${amigos} amigos pagaron $${total} por las entradas al cine, todos pusieron lo mismo. ¿Cuánto costó la entrada de cada uno?`,
          cantidades: [amigos, total],
          respuesta: costoEntrada,
          operacion: `${total} : ${amigos}`,
          errores: [
            { operacion: `${total} · ${amigos}`, valor: total * amigos },
            { operacion: `${total}`, valor: total },
          ],
        }
      })
    },
  },
  {
    id: 'edad-hermana',
    tecnica: 'ecuacion',
    unidad: 'años',
    limites: { min: 20, max: 45 },
    construir() {
      return sortearHasta(() => {
        const edadMama = randInt(30, 45)
        const diferencia = randInt(20, edadMama - 10)
        return {
          enunciado: `La mamá de Valentina tiene ${edadMama} años. Le lleva ${diferencia} años a su hija. ¿Cuántos años tiene Valentina?`,
          cantidades: [edadMama, diferencia],
          respuesta: edadMama - diferencia,
          operacion: `${edadMama} − ${diferencia}`,
          errores: [
            { operacion: `${edadMama} + ${diferencia}`, valor: edadMama + diferencia },
            { operacion: `${edadMama}`, valor: edadMama },
          ],
        }
      })
    },
  },
  {
    id: 'alcancia-antes',
    tecnica: 'ecuacion',
    unidad: '$',
    limites: { min: 1000, max: 40000 },
    construir() {
      return sortearHasta(() => {
        const ahora = randInt(2, 40) * 1000
        const gastado = randInt(1, 15) * 1000
        return {
          enunciado: `Rodrigo gastó $${gastado} en un jugo y le quedaron $${ahora} en la alcancía. ¿Cuánto dinero tenía antes de comprar el jugo?`,
          cantidades: [gastado, ahora],
          respuesta: ahora + gastado,
          operacion: `${ahora} + ${gastado}`,
          errores: [
            { operacion: `${ahora} − ${gastado}`, valor: Math.abs(ahora - gastado) },
            { operacion: `${ahora}`, valor: ahora },
          ],
        }
      })
    },
  },
  {
    id: 'album-figuritas',
    tecnica: 'ecuacion',
    unidad: 'figuritas',
    limites: { min: 30, max: 250 },
    construir() {
      return sortearHasta(() => {
        const total = randInt(120, 250)
        const tiene = randInt(30, total - 20)
        return {
          enunciado: `El álbum del Mundial tiene ${total} figuritas en total. Matías ya pegó ${tiene} figuritas. ¿Cuántas figuritas le faltan para completar el álbum?`,
          cantidades: [total, tiene],
          respuesta: total - tiene,
          operacion: `${total} − ${tiene}`,
          errores: [
            { operacion: `${tiene} + ${total}`, valor: tiene + total },
            { operacion: `${total}`, valor: total },
          ],
        }
      })
    },
  },
  {
    id: 'perro-peso',
    tecnica: 'ecuacion',
    unidad: 'kg',
    limites: { min: 0.3, max: 22 },
    construir() {
      return sortearHasta(() => {
        const engordo = randInt(3, 25) / 10
        const ahora = randInt(50, 220) / 10
        const antes = Math.round((ahora - engordo) * 10) / 10
        return {
          enunciado: `El perro de Benjamín subió ${numero(engordo)} kg durante las vacaciones y ahora pesa ${numero(ahora)} kg. ¿Cuánto pesaba antes de las vacaciones?`,
          cantidades: [engordo, ahora],
          respuesta: antes,
          operacion: `${numero(ahora)} − ${numero(engordo)}`,
          errores: [
            { operacion: `${numero(ahora)} + ${numero(engordo)}`, valor: Math.round((ahora + engordo) * 10) / 10 },
            { operacion: `${numero(ahora)}`, valor: ahora },
          ],
        }
      })
    },
  },
  {
    id: 'helados-primos',
    tecnica: 'ecuacion',
    unidad: '$',
    limites: { min: 3, max: 18900 },
    construir() {
      return sortearHasta(() => {
        const personas = randInt(3, 7)
        const precioHelado = randInt(3, 9) * 300
        const total = personas * precioHelado
        return {
          enunciado: `Un grupo de ${personas} primos juntó $${total} para comprarse un helado cada uno, todos del mismo precio. ¿Cuánto costaba cada helado?`,
          cantidades: [personas, total],
          respuesta: precioHelado,
          operacion: `${total} : ${personas}`,
          errores: [
            { operacion: `${total} · ${personas}`, valor: total * personas },
            { operacion: `${total}`, valor: total },
          ],
        }
      })
    },
  },
  {
    id: 'edad-hace-anios',
    tecnica: 'ecuacion',
    unidad: 'años',
    limites: { min: 6, max: 55 },
    construir() {
      return sortearHasta(() => {
        const edadActual = randInt(35, 55)
        const anios = randInt(6, 20)
        return {
          enunciado: `El papá de Fernanda tiene hoy ${edadActual} años. Hace ${anios} años, ¿qué edad tenía?`,
          cantidades: [edadActual, anios],
          respuesta: edadActual - anios,
          operacion: `${edadActual} − ${anios}`,
          errores: [
            { operacion: `${edadActual} + ${anios}`, valor: edadActual + anios },
            { operacion: `${edadActual}`, valor: edadActual },
          ],
        }
      })
    },
  },
  {
    id: 'torta-cumpleanos',
    tecnica: 'fracciones',
    unidad: 'pedazos',
    limites: { min: 8, max: 16 },
    construir() {
      return sortearHasta(() => {
        const total = randInt(2, 4) * 4
        const tarde = randInt(1, Math.floor(total / 2) - 1)
        const noche = randInt(1, total - tarde - 1)
        return {
          enunciado: `La torta de cumpleaños de Martina se cortó en ${total} pedazos. En la tarde se comieron ${tarde}/${total} y en la noche ${noche}/${total}. ¿Cuántos pedazos se comieron en total?`,
          cantidades: [total],
          respuesta: tarde + noche,
          operacion: `${tarde} + ${noche}`,
          errores: [
            { operacion: `${total}`, valor: total },
            { operacion: `${total} − ${tarde} − ${noche}`, valor: total - tarde - noche },
          ],
        }
      })
    },
  },
  {
    id: 'caramelos-premio',
    tecnica: 'fracciones',
    unidad: 'caramelos',
    limites: { min: 18, max: 90 },
    construir() {
      return sortearHasta(() => {
        const denom = [3, 4, 5, 6][randInt(0, 3)]
        const total = denom * randInt(6, 15)
        const numerador = randInt(1, denom - 1)
        return {
          enunciado: `La profesora Daniela compró una bolsa con ${total} caramelos y repartió ${numerador}/${denom} de la bolsa como premio. ¿Cuántos caramelos repartió?`,
          cantidades: [total],
          respuesta: (total / denom) * numerador,
          operacion: `${total} : ${denom} · ${numerador}`,
          errores: [
            { operacion: `${total}`, valor: total },
            { operacion: `${total} : ${denom}`, valor: total / denom },
          ],
        }
      })
    },
  },
  {
    id: 'bencina-estanque',
    tecnica: 'fracciones',
    unidad: 'L',
    limites: { min: 18, max: 100 },
    construir() {
      return sortearHasta(() => {
        const denom = [3, 4, 5][randInt(0, 2)]
        const total = denom * randInt(6, 20)
        const numerador = randInt(1, denom - 1)
        const lleno = (total / denom) * numerador
        return {
          enunciado: `El estanque del auto de don Hernán tiene capacidad para ${total} litros y el indicador marca ${numerador}/${denom}. ¿Cuántos litros le faltan para llenarlo?`,
          cantidades: [total],
          respuesta: total - lleno,
          operacion: `${total} − ${total} : ${denom} · ${numerador}`,
          errores: [
            { operacion: `${total} : ${denom} · ${numerador}`, valor: lleno },
            { operacion: `${total}`, valor: total },
          ],
        }
      })
    },
  },
  {
    id: 'libro-aventuras',
    tecnica: 'fracciones',
    unidad: 'páginas',
    limites: { min: 30, max: 240 },
    construir() {
      return sortearHasta(() => {
        const denom = [3, 4, 5, 6][randInt(0, 3)]
        const total = denom * randInt(10, 40)
        const numerador = randInt(1, denom - 1)
        const leidas = (total / denom) * numerador
        return {
          enunciado: `El libro de aventuras que lee Vicente tiene ${total} páginas y ya leyó ${numerador}/${denom} del libro. ¿Cuántas páginas le faltan por leer?`,
          cantidades: [total],
          respuesta: total - leidas,
          operacion: `${total} − ${total} : ${denom} · ${numerador}`,
          errores: [
            { operacion: `${total} : ${denom} · ${numerador}`, valor: leidas },
            { operacion: `${total}`, valor: total },
          ],
        }
      })
    },
  },
  {
    id: 'cancha-colegio',
    tecnica: 'fracciones',
    unidad: 'm²',
    limites: { min: 80, max: 360 },
    construir() {
      return sortearHasta(() => {
        const denom = [4, 5, 6][randInt(0, 2)]
        const total = denom * randInt(20, 60)
        const lunes = randInt(1, denom - 2)
        const martes = randInt(1, denom - lunes - 1)
        const pintado = ((lunes + martes) / denom) * total
        return {
          enunciado: `La cancha del colegio mide ${total} metros cuadrados. El maestro Rodrigo pintó ${lunes}/${denom} el lunes y ${martes}/${denom} el martes. ¿Cuántos metros cuadrados le faltan por pintar?`,
          cantidades: [total],
          respuesta: total - pintado,
          operacion: `${total} − (${lunes} + ${martes}) : ${denom} · ${total}`,
          errores: [
            { operacion: `(${lunes} + ${martes}) : ${denom} · ${total}`, valor: pintado },
            { operacion: `${total}`, valor: total },
          ],
        }
      })
    },
  },
  {
    id: 'bidon-campamento',
    tecnica: 'fracciones',
    unidad: 'L',
    limites: { min: 1, max: 80 },
    construir() {
      return sortearHasta(() => {
        const patrullas = [4, 5, 6, 8][randInt(0, 3)]
        const total = patrullas * randInt(3, 10)
        const parte = total / patrullas
        const usados = randInt(1, parte - 1)
        return {
          enunciado: `En el campamento, ${patrullas} patrullas se repartieron en partes iguales un bidón de ${total} litros. La patrulla de Ignacio ya usó ${usados} litros para cocinar. ¿Cuántos litros le quedan a esa patrulla?`,
          cantidades: [total, usados],
          respuesta: parte - usados,
          operacion: `${total} : ${patrullas} − ${usados}`,
          errores: [
            { operacion: `${total} : ${patrullas}`, valor: parte },
            { operacion: `${total} − ${usados}`, valor: total - usados },
          ],
        }
      })
    },
  },
  {
    id: 'huerto-abuelo',
    tecnica: 'fracciones',
    unidad: 'm²',
    limites: { min: 18, max: 120 },
    construir() {
      return sortearHasta(() => {
        const denom = [6, 8, 10][randInt(0, 2)]
        const total = denom * randInt(3, 12)
        const lechugas = randInt(1, denom - 2)
        const tomates = randInt(1, denom - lechugas - 1)
        return {
          enunciado: `El huerto del abuelo de Fernanda mide ${total} metros cuadrados. Sembró lechugas en ${lechugas}/${denom} y tomates en ${tomates}/${denom}. ¿Cuántos metros cuadrados sembró en total?`,
          cantidades: [total],
          respuesta: ((lechugas + tomates) / denom) * total,
          operacion: `(${lechugas} + ${tomates}) : ${denom} · ${total}`,
          errores: [
            { operacion: `${total}`, valor: total },
            { operacion: `${total} : ${denom}`, valor: total / denom },
          ],
        }
      })
    },
  },
  {
    id: 'bicicleta-trinidad',
    tecnica: 'fracciones',
    unidad: '$',
    limites: { min: 16000, max: 120000 },
    construir() {
      return sortearHasta(() => {
        const denom = [4, 5, 6][randInt(0, 2)]
        const precio = denom * randInt(4, 20) * 1000
        const numerador = randInt(1, denom - 1)
        const ahorrado = (precio / denom) * numerador
        return {
          enunciado: `Trinidad quiere una bicicleta que cuesta $${precio} y ya juntó ${numerador}/${denom} de ese precio. ¿Cuánto dinero le falta?`,
          cantidades: [precio],
          respuesta: precio - ahorrado,
          operacion: `${precio} − ${precio} : ${denom} · ${numerador}`,
          errores: [
            { operacion: `${precio} : ${denom} · ${numerador}`, valor: ahorrado },
            { operacion: `${precio}`, valor: precio },
          ],
        }
      })
    },
  },
  {
    id: 'maraton-familiar',
    tecnica: 'fracciones',
    unidad: 'km',
    limites: { min: 6, max: 40 },
    construir() {
      return sortearHasta(() => {
        const denom = [3, 4, 5][randInt(0, 2)]
        const total = denom * randInt(2, 8)
        const numerador = randInt(1, denom - 1)
        const recorrido = (total / denom) * numerador
        return {
          enunciado: `El recorrido de la corrida familiar del colegio mide ${total} kilómetros y Camila ya lleva ${numerador}/${denom} del trayecto. ¿Cuántos kilómetros le faltan para la meta?`,
          cantidades: [total],
          respuesta: total - recorrido,
          operacion: `${total} − ${total} : ${denom} · ${numerador}`,
          errores: [
            { operacion: `${total} : ${denom} · ${numerador}`, valor: recorrido },
            { operacion: `${total}`, valor: total },
          ],
        }
      })
    },
  },
  {
    id: 'jarra-jugo',
    tecnica: 'fracciones',
    unidad: 'ml',
    limites: { min: 600, max: 3200 },
    construir() {
      return sortearHasta(() => {
        const vasos = [4, 5, 6, 8][randInt(0, 3)]
        const jarra = vasos * randInt(150, 400)
        const tomados = randInt(1, vasos - 1)
        return {
          enunciado: `Benjamín preparó una jarra de ${jarra} ml de jugo para la once y la repartió en ${vasos} vasos iguales. Rocío se tomó ${tomados}/${vasos} de la jarra. ¿Cuántos mililitros tomó Rocío?`,
          cantidades: [jarra],
          respuesta: (jarra / vasos) * tomados,
          operacion: `${jarra} : ${vasos} · ${tomados}`,
          errores: [
            { operacion: `${jarra}`, valor: jarra },
            { operacion: `${jarra} : ${vasos}`, valor: jarra / vasos },
          ],
        }
      })
    },
  },
  {
    id: 'ascensor-carga',
    tecnica: 'inecuacion',
    unidad: 'kg',
    limites: { min: 100, max: 500 },
    construir() {
      return sortearHasta(() => {
        const maximo = randInt(300, 450)
        const yaSube = randInt(150, maximo - 30)
        return {
          enunciado: `El ascensor del edificio de Camila aguanta ${maximo} kg como máximo. Adentro ya hay ${yaSube} kg entre personas y bolsos. ¿Cuántos kilos más pueden subir sin pasarse?`,
          cantidades: [maximo, yaSube],
          respuesta: maximo - yaSube,
          operacion: `${maximo} − ${yaSube}`,
          errores: [
            { operacion: `${maximo} + ${yaSube}`, valor: maximo + yaSube },
            { operacion: `${maximo}`, valor: maximo },
          ],
        }
      })
    },
  },
  {
    id: 'club-lectura',
    tecnica: 'inecuacion',
    unidad: 'libros',
    limites: { min: 2, max: 15 },
    construir() {
      return sortearHasta(() => {
        const meta = randInt(8, 15)
        const leidos = randInt(2, meta - 1)
        return {
          enunciado: `Para pasar de nivel en el club de lectura hay que leer al menos ${meta} libros en el semestre. Trinidad lleva ${leidos}. ¿Cuántos más debe leer como mínimo?`,
          cantidades: [meta, leidos],
          respuesta: meta - leidos,
          operacion: `${meta} − ${leidos}`,
          errores: [
            { operacion: `${meta} + ${leidos}`, valor: meta + leidos },
            { operacion: `${meta}`, valor: meta },
          ],
        }
      })
    },
  },
  {
    id: 'vueltas-circuito',
    tecnica: 'inecuacion',
    unidad: 'vueltas',
    limites: { min: 5, max: 35 },
    construir() {
      return sortearHasta(() => {
        const record = randInt(15, 35)
        const lleva = randInt(5, record - 1)
        return {
          enunciado: `El récord de vueltas al circuito del parque en una hora es ${record}. Ignacio lleva ${lleva}. ¿Cuántas vueltas más necesita como mínimo para superar el récord?`,
          cantidades: [record, lleva],
          respuesta: record - lleva + 1,
          operacion: `${record} − ${lleva} + 1`,
          errores: [
            { operacion: `${record} − ${lleva}`, valor: record - lleva },
            { operacion: `${record} + ${lleva}`, valor: record + lleva },
          ],
        }
      })
    },
  },
  {
    id: 'goles-temporada',
    tecnica: 'inecuacion',
    unidad: 'goles',
    limites: { min: 3, max: 30 },
    construir() {
      return sortearHasta(() => {
        const record = randInt(12, 30)
        const lleva = randInt(3, record - 1)
        return {
          enunciado: `El récord de goles en una temporada del equipo de Vicente es ${record} y él lleva ${lleva}. ¿Cuántos goles más necesita anotar como mínimo para superarlo?`,
          cantidades: [record, lleva],
          respuesta: record - lleva + 1,
          operacion: `${record} − ${lleva} + 1`,
          errores: [
            { operacion: `${record} − ${lleva}`, valor: record - lleva },
            { operacion: `${record} + ${lleva}`, valor: record + lleva },
          ],
        }
      })
    },
  },
  {
    id: 'cajas-galletas',
    tecnica: 'ecuacion',
    unidad: 'galletas',
    limites: { min: 3, max: 24 },
    construir() {
      return sortearHasta(() => {
        const porCaja = randInt(8, 24)
        const cajas = randInt(3, 9)
        return {
          enunciado: `Para la once del curso, la mamá de Emilia llevó ${cajas} cajas de galletas y en cada caja vienen ${porCaja}. ¿Cuántas galletas llevó en total?`,
          cantidades: [porCaja, cajas],
          respuesta: porCaja * cajas,
          operacion: `${porCaja} · ${cajas}`,
          errores: [
            { operacion: `${porCaja} + ${cajas}`, valor: porCaja + cajas },
            { operacion: `${porCaja} − ${cajas}`, valor: porCaja - cajas },
          ],
        }
      })
    },
  },
  {
    id: 'entradas-familia',
    tecnica: 'ecuacion',
    unidad: '$',
    limites: { min: 3, max: 9000 },
    construir() {
      return sortearHasta(() => {
        const precio = randInt(6, 18) * 500
        const personas = randInt(3, 6)
        return {
          enunciado: `La entrada al museo interactivo cuesta $${precio} por persona y la familia de Tomás va con ${personas} personas. ¿Cuánto pagan en total?`,
          cantidades: [precio, personas],
          respuesta: precio * personas,
          operacion: `${precio} · ${personas}`,
          errores: [
            { operacion: `${precio} + ${personas}`, valor: precio + personas },
            { operacion: `${precio} : ${personas}`, valor: Math.round((precio / personas) * 1000) / 1000 },
          ],
        }
      })
    },
  },
  {
    id: 'bolsas-manzanas',
    tecnica: 'inecuacion',
    unidad: 'bolsas',
    limites: { min: 4, max: 120 },
    construir() {
      return sortearHasta(() => {
        const porBolsa = randInt(4, 9)
        const manzanas = randInt(30, 120)
        return {
          enunciado: `En el puesto de don Luis hay ${manzanas} manzanas y en cada bolsa caben ${porBolsa}. ¿Cuántas bolsas puede llenar por completo?`,
          cantidades: [manzanas, porBolsa],
          respuesta: Math.floor(manzanas / porBolsa),
          operacion: `${manzanas} : ${porBolsa}`,
          errores: [
            { operacion: `${manzanas} − ${porBolsa}`, valor: manzanas - porBolsa },
            { operacion: `${manzanas} · ${porBolsa}`, valor: manzanas * porBolsa },
          ],
        }
      })
    },
  },
  {
    id: 'vuelto-kiosco',
    tecnica: 'inecuacion',
    unidad: '$',
    limites: { min: 2, max: 10000 },
    construir() {
      return sortearHasta(() => {
        const precio = randInt(3, 12) * 100
        const cuantos = randInt(2, 6)
        const lleva = randInt(4, 10) * 1000
        return {
          enunciado: `Javiera lleva $${lleva} al kiosco y quiere comprar ${cuantos} completos de $${precio} cada uno. ¿Cuánto dinero le sobra?`,
          cantidades: [precio, cuantos, lleva],
          respuesta: lleva - precio * cuantos,
          operacion: `${lleva} − ${precio} · ${cuantos}`,
          errores: [
            { operacion: `${lleva} − ${precio}`, valor: lleva - precio },
            { operacion: `${precio} · ${cuantos}`, valor: precio * cuantos },
          ],
        }
      })
    },
  },
  {
    id: 'agua-dias',
    tecnica: 'decimales',
    unidad: 'L',
    limites: { min: 0.25, max: 7 },
    construir() {
      return sortearHasta(() => {
        const porDia = randInt(25, 200) / 100
        const dias = randInt(3, 7)
        return {
          enunciado: `El entrenador le pidió a Martín tomar ${numero(porDia)} L de agua cada día. Si lo cumple durante ${dias} días, ¿cuántos litros habrá tomado?`,
          cantidades: [porDia, dias],
          respuesta: Math.round(porDia * dias * 1000) / 1000,
          operacion: `${numero(porDia)} · ${dias}`,
          errores: [
            { operacion: `${numero(porDia)} + ${dias}`, valor: Math.round((porDia + dias) * 1000) / 1000 },
            { operacion: `${dias} − ${numero(porDia)}`, valor: Math.round((dias - porDia) * 1000) / 1000 },
          ],
        }
      })
    },
  },
  {
    id: 'doble-hermano',
    tecnica: 'ecuacion',
    unidad: 'años',
    limites: { min: 6, max: 24 },
    construir() {
      return sortearHasta(() => {
        const menor = randInt(6, 12)
        const mayor = menor * 2
        return {
          enunciado: `Cristóbal tiene ${mayor} años y eso es justo el doble de la edad de su hermana Amanda. ¿Qué edad tiene Amanda?`,
          cantidades: [mayor],
          respuesta: menor,
          operacion: `${mayor} : 2`,
          errores: [
            { operacion: `${mayor} · 2`, valor: mayor * 2 },
            { operacion: `${mayor} − 2`, valor: mayor - 2 },
          ],
        }
      })
    },
  },
  {
    id: 'receta-porciones',
    tecnica: 'fracciones',
    unidad: 'tazas',
    limites: { min: 2, max: 24 },
    construir() {
      return sortearHasta(() => {
        const base = randInt(2, 6)
        const veces = randInt(2, 4)
        return {
          enunciado: `La receta de panqueques de la tía Marcela usa ${base} tazas de harina y alcanza para 4 personas. Si quiere que alcance para ${4 * veces} personas, ¿cuántas tazas de harina necesita?`,
          cantidades: [base, 4 * veces],
          respuesta: base * veces,
          operacion: `${base} · ${veces}`,
          errores: [
            { operacion: `${base} + ${4 * veces}`, valor: base + 4 * veces },
            { operacion: `${4 * veces} : ${base}`, valor: Math.round(((4 * veces) / base) * 1000) / 1000 },
          ],
        }
      })
    },
  },
]
