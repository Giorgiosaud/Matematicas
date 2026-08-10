import { useEffect, useState } from 'react'
import { fetchTop } from '../lib/leaderboardApi'
import type { TopicCategory } from '../lib/topicSelection'
import type { LeaderboardEntry } from '../lib/types'
import './TopicSelector.css'

type Status = 'loading' | 'ready' | 'error' | 'empty'

// Mirrors the Home-screen timer options — shows kids what difficulty a
// score was set under (0 = no limit, scored at half rate).
function formatTimer(seconds: number): string {
  return seconds === 0 ? '∞' : `${seconds}s`
}

const CATEGORIES: { id: TopicCategory; label: string }[] = [
  { id: 'fracciones', label: 'FRACCIONES' },
  { id: 'decimales', label: 'DECIMALES' },
  { id: 'mixto', label: 'MIXTO' },
]

interface Props {
  questionLimit: number
  category: TopicCategory
  limit?: number
}

// La tabla se remonta al cambiar de categoría o de configuración, así que su
// estado inicial ya es "cargando": el efecto solo escribe estado cuando llega
// la respuesta, nunca de forma síncrona.
function Tabla({ questionLimit, category, limit }: { questionLimit: number; category: TopicCategory; limit: number }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    let cancelled = false
    fetchTop(questionLimit, category, limit).then((result) => {
      if (cancelled) return
      if (result === null) setStatus('error')
      else if (result.length === 0) setStatus('empty')
      else {
        setEntries(result)
        setStatus('ready')
      }
    })
    return () => { cancelled = true }
  }, [questionLimit, category, limit])

  if (status === 'loading') return <p className="text-white/50 text-sm text-center">Cargando...</p>
  if (status === 'error') return <p className="text-white/50 text-sm text-center">No se pudo cargar la tabla.</p>
  if (status === 'empty') return <p className="text-white/50 text-sm text-center">¡Sé el primero en aparecer aquí!</p>

  return (
    <ol className="flex flex-col gap-1">
      {entries.map((entry, i) => (
        <li key={entry.name} className="flex items-center justify-between text-sm text-white bg-[#16162A] rounded-lg px-3 py-1.5">
          <span className="flex items-center gap-2">
            <span className="text-white/40 w-4 text-right">{i + 1}</span>
            <span className="font-bold">{entry.name}</span>
            <span className="text-white/40 text-xs">⏱ {formatTimer(entry.bestTimerSeconds)}</span>
          </span>
          <span className="text-[#FFD700]">{entry.bestScore} pts <span className="text-white/40">· {entry.bestStreak} 🔥</span></span>
        </li>
      ))}
    </ol>
  )
}

export default function Leaderboard({ questionLimit, category, limit = 10 }: Props) {
  // Se abre en la categoría de la sesión, pero el jugador puede curiosear las
  // otras — media gracia de la tabla es ver contra quién se compite.
  const [selected, setSelected] = useState<TopicCategory>(category)

  return (
    <div className="w-full max-w-xs mx-auto">
      <p className="font-display text-base text-[#FFD700] tracking-widest mb-2 text-center">
        TABLA · PARTIDAS DE {questionLimit}
      </p>

      <div className="temas temas--compacto" role="radiogroup" aria-label="Categoría de la tabla">
        {CATEGORIES.map(({ id, label }) => (
          <label key={id} className="tema-chip">
            <input
              className="tema-chip__input"
              type="radio"
              name="categoria-tabla"
              value={id}
              checked={selected === id}
              onChange={() => setSelected(id)}
            />
            {label}
          </label>
        ))}
      </div>

      <Tabla key={`${questionLimit}-${selected}`} questionLimit={questionLimit} category={selected} limit={limit} />
    </div>
  )
}
