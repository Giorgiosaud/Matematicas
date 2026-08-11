import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  color: string
  trigger: number
  opacity?: number
}

export default function ScreenFlash({ color, trigger, opacity = 0.45 }: Props) {
  // Cada disparo es un elemento nuevo (`key={trigger}`) que se anima de opaco a
  // transparente. No hace falta estado: el destello *es* la animación.
  return (
    <AnimatePresence>
      {trigger > 0 && (
        <motion.div
          key={trigger}
          initial={{ opacity }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed inset-0 pointer-events-none z-50"
          style={{ background: color }}
        />
      )}
    </AnimatePresence>
  )
}
