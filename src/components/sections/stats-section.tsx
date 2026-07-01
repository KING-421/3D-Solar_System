'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Globe2, HelpCircle, Users, Sparkles } from 'lucide-react'

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(eased * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])
  return value
}

export function StatsSection({
  planetCount,
  questionCount,
  explorerCount,
}: {
  planetCount: number
  questionCount: number
  explorerCount: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const items = [
    { icon: Globe2, label: 'Celestial bodies', value: planetCount, color: '#7dd3fc' },
    { icon: HelpCircle, label: 'Quiz questions', value: questionCount, color: '#fbbf24' },
    { icon: Users, label: 'Explorers', value: explorerCount, color: '#a78bfa' },
    { icon: Sparkles, label: 'Light-years of fun', value: 999, color: '#34d399', suffix: '+' },
  ]

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((it, i) => (
          <StatCard key={it.label} {...it} active={inView} delay={i * 0.1} />
        ))}
      </div>
    </section>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  active,
  delay,
  suffix,
}: {
  icon: React.ElementType
  label: string
  value: number
  color: string
  active: boolean
  delay: number
  suffix?: string
}) {
  const v = useCountUp(value, active)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/30 p-4 sm:p-5"
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-25 blur-2xl"
        style={{ backgroundColor: color }}
      />
      <div className="relative flex items-center gap-2">
        <span
          className="grid h-8 w-8 place-items-center rounded-lg"
          style={{ backgroundColor: `${color}22`, color }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <div
        className="relative mt-3 font-display text-3xl font-bold sm:text-4xl"
        style={{ color }}
      >
        {v}
        {suffix}
      </div>
    </motion.div>
  )
}
