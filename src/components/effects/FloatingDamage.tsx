import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  value: string
  side: 'left' | 'right'
  trigger: number
}

export default function FloatingDamage({ value, side, trigger }: Props) {
  // Un solo número por golpe: `key={trigger}` monta uno nuevo en cada disparo y
  // la animación lo desvanece. No hace falta guardar la lista en estado.
  const items = trigger > 0 ? [{ id: trigger, value }] : []

  return (
    <div
      className="fixed top-16 pointer-events-none z-40"
      style={{ [side === 'left' ? 'left' : 'right']: '8rem' }}
    >
      <AnimatePresence>
        {items.map(item => (
          <motion.div
            key={item.id}
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={{ y: -60, opacity: 0, scale: 1.3 }}
            exit={{}}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="font-display text-2xl text-[#FF3B3B] drop-shadow-[2px_2px_0_#000] whitespace-nowrap"
            style={{ textShadow: '0 0 12px #FF3B3B' }}
          >
            {item.value}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
