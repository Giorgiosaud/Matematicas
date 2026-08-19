// Números en español. Vive fuera de los temas porque es lenguaje, no matemática:
// decimales lo usa para leer posiciones ("veinticinco centésimas") y álgebra para
// redactar enunciados ("aumentado en nueve unidades"). Tenerlo duplicado en cada
// tema sería garantía de que las dos copias se separen.

const HASTA_29 = [
  'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
  'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
  'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve',
]

const DECENAS: Record<number, string> = {
  3: 'treinta', 4: 'cuarenta', 5: 'cincuenta', 6: 'sesenta', 7: 'setenta', 8: 'ochenta', 9: 'noventa',
}

const CENTENAS: Record<number, string> = {
  1: 'ciento', 2: 'doscientos', 3: 'trescientos', 4: 'cuatrocientos', 5: 'quinientos',
  6: 'seiscientos', 7: 'setecientos', 8: 'ochocientos', 9: 'novecientos',
}

// Las posiciones decimales son femeninas ("una décima", "doscientas milésimas"),
// así que el número que las acompaña tiene que concordar.
function enFemenino(palabras: string): string {
  return palabras
    .replace(/\bveintiuno\b/, 'veintiuna')
    .replace(/\buno\b/, 'una')
    .replace(/cientos\b/, 'cientas')
    .replace(/quinientos\b/, 'quinientas')
}

export function numeroEnPalabras(n: number, femenino = false): string {
  const palabras = construir(n)
  return femenino ? enFemenino(palabras) : palabras
}

function construir(n: number): string {
  if (n < 30) return HASTA_29[n]
  if (n < 100) {
    const decena = DECENAS[Math.floor(n / 10)]
    const unidad = n % 10
    return unidad === 0 ? decena : `${decena} y ${HASTA_29[unidad]}`
  }
  if (n === 100) return 'cien'
  const centena = CENTENAS[Math.floor(n / 100)]
  const resto = n % 100
  return resto === 0 ? centena : `${centena} ${construir(resto)}`
}
