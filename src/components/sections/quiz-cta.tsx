'use client'

import { motion } from 'framer-motion'
import { Rocket, Trophy, ArrowRight, Github, Code2, Database, Boxes, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/store'

export function QuizCta() {
  const setQuizOpen = useApp((s) => s.setQuizOpen)
  const setLeaderboardOpen = useApp((s) => s.setLeaderboardOpen)
  const setOnboardOpen = useApp((s) => s.setOnboardOpen)
  const explorer = useApp((s) => s.explorer)

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-cyan-500/10 via-violet-500/5 to-amber-500/10 p-8 sm:p-12"
      >
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-200">
              <Sparkles className="h-3.5 w-3.5" /> Mission Briefing
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
              Think you know the planets?
              <br />
              <span className="aurora-text">Prove it on the cosmic quiz.</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Answer questions about every world from Mercury to Neptune. Every
              correct answer lifts you up the global leaderboard — compete with
              explorers across the galaxy.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:from-amber-300 hover:to-orange-400"
                onClick={() => (explorer ? setQuizOpen(true) : setOnboardOpen(true))}
              >
                <Rocket className="mr-2 h-4 w-4" />
                {explorer ? 'Launch the quiz' : 'Join & launch'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-cyan-300/30 bg-cyan-400/5 text-cyan-100 hover:bg-cyan-400/15"
                onClick={() => setLeaderboardOpen(true)}
              >
                <Trophy className="mr-2 h-4 w-4" />
                View leaderboard
              </Button>
            </div>
          </div>

          {/* Tech badges */}
          <div className="grid grid-cols-2 gap-3">
            <TechBadge icon={Boxes} label="Next.js 16" sub="App Router" />
            <TechBadge icon={Code2} label="React Three Fiber" sub="WebGL 3D" />
            <TechBadge icon={Database} label="Prisma + SQLite" sub="Real backend" />
            <TechBadge icon={Github} label="Open source" sub="Ready for GitHub" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function TechBadge({ icon: Icon, label, sub }: { icon: React.ElementType; label: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border/40 bg-card/40 p-3.5 backdrop-blur transition-colors hover:border-cyan-300/30">
      <Icon className="h-5 w-5 text-cyan-200" />
      <div className="mt-2 text-sm font-semibold">{label}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  )
}

export function AboutSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-border/40 bg-card/20 p-8 sm:p-10">
        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs uppercase tracking-[0.22em] text-violet-200">
              <Code2 className="h-3.5 w-3.5" /> Engineering
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold">Built with a real full-stack</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Stellarium isn&apos;t a mockup. Every planet, quiz score, favorite,
              and note is persisted in a real database through REST API routes.
            </p>
            <Button asChild variant="outline" className="mt-5 border-cyan-300/30 bg-cyan-400/5 text-cyan-100 hover:bg-cyan-400/15">
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <Github className="mr-2 h-4 w-4" /> View on GitHub
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <Feature title="Interactive 3D scene" desc="React Three Fiber renders a live solar system with orbiting planets, rings, Earth's moon, and a glowing Sun." />
            <Feature title="REST API backend" desc="Next.js route handlers power explorers, planets, favorites, notes, quizzes & leaderboard." />
            <Feature title="Prisma + SQLite" desc="A typed schema models explorers, planets, favorites, notes, quiz questions & scores." />
            <Feature title="Framer Motion UI" desc="Animated HUD, slide-over panels, quiz flow and count-up stats throughout." />
          </div>
        </div>
      </div>
    </section>
  )
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border/40 bg-background/30 p-3.5">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{desc}</p>
    </div>
  )
}
