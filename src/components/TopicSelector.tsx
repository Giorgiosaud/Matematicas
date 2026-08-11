import { TOPIC_LIST } from '../lib/topics'
import type { TopicId } from '../lib/types'
import './TopicSelector.css'

interface Props {
  selected: TopicId[]
  onChange: (topics: TopicId[]) => void
}

export default function TopicSelector({ selected, onChange }: Props) {
  const toggle = (id: TopicId) => {
    onChange(selected.includes(id) ? selected.filter(t => t !== id) : [...selected, id])
  }

  return (
    <div className="temas" role="group" aria-label="Temas para practicar">
      {TOPIC_LIST.map(topic => (
        <label key={topic.id} className="tema-chip">
          <input
            className="tema-chip__input"
            type="checkbox"
            checked={selected.includes(topic.id)}
            onChange={() => toggle(topic.id)}
          />
          <span className="tema-chip__marca" aria-hidden="true">{selected.includes(topic.id) ? '✓' : ''}</span>
          {topic.label}
        </label>
      ))}
    </div>
  )
}
