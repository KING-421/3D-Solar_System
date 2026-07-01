'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Rocket,
  Check,
  XCircle,
  Loader2,
  Trophy,
  RotateCcw,
  ChevronRight,
  Brain,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useApp } from '@/lib/store'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import type { QuizQuestion } from '@/lib/types'
import { cn } from '@/lib/utils'

type Phase = 'loading' | 'intro' | 'playing' | 'reveal' | 'done'

export function QuizModal() {
  const open = useApp((s) => s.quizOpen)
  const setOpen = useApp((s) => s.setQuizOpen)
  const explorer = useApp((s) => s.explorer)
  const setLeaderboardOpen = useApp((s) => s.setLeaderboardOpen)
  const setOnboardOpen = useApp((s) => s.setOnboardOpen)
  const { toast } = useToast()

  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [phase, setPhase] = useState<Phase>('loading')
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  // Load questions when opened
  useEffect(() => {
    if (!open) return
    /* eslint-disable react-hooks/set-state-in-effect */
    setPhase('loading')
    setIdx(0)
    setSelected(null)
    setScore(0)
    api
      .get<{ questions: QuizQuestion[] }>('/api/quiz')
      .then((r) => {
        // shuffle questions for variety
        const shuffled = [...r.questions].sort(() => Math.random() - 0.5)
        setQuestions(shuffled)
        setPhase('intro')
      })
      .catch((e) => {
        toast({ title: 'Could not load quiz', description: (e as Error).message, variant: 'destructive' })
        setOpen(false)
      })
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [open])

  const current = questions[idx]

  const start = () => {
    if (!explorer) {
      setOpen(false)
      setOnboardOpen(true)
      return
    }
    setPhase('playing')
  }

  const choose = (i: number) => {
    if (phase !== 'playing') return
    setSelected(i)
    setPhase('reveal')
    if (i === current.correctIndex) setScore((s) => s + 1)
  }

  const next = async () => {
    if (idx + 1 < questions.length) {
      setIdx((i) => i + 1)
      setSelected(null)
      setPhase('playing')
    } else {
      // submit score
      setPhase('done')
      try {
        await api.post('/api/quiz/submit', { score, total: questions.length })
        toast({ title: 'Score recorded!', description: 'Check the leaderboard.' })
      } catch (e) {
        toast({ title: 'Score not saved', description: (e as Error).message, variant: 'destructive' })
      }
    }
  }

  const restart = () => {
    setIdx(0)
    setSelected(null)
    setScore(0)
    setPhase('playing')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => phase !== 'loading' && setOpen(false)}
          />
          <motion.div
            className="relative w-full max-w-xl overflow-hidden rounded-3xl glass-strong shadow-2xl gradient-border"
            initial={{ scale: 0.92, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 24 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400/30 to-rose-400/20 ring-1 ring-amber-300/40">
                  <Brain className="h-4.5 w-4.5 text-amber-200" />
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold leading-none">Cosmic Quiz</h2>
                  <p className="text-xs text-muted-foreground">Test your solar system knowledge</p>
                </div>
              </div>
              <button
                onClick={() => phase !== 'loading' && setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-card/50 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              {phase === 'loading' && (
                <div className="grid h-48 place-items-center">
                  <Loader2 className="h-7 w-7 animate-spin text-cyan-300" />
                </div>
              )}

              {phase === 'intro' && (
                <div className="text-center">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 ring-1 ring-cyan-300/30">
                    <Rocket className="h-7 w-7 text-cyan-200" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">Ready for launch?</h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    {questions.length} questions about the Sun, planets, and the far
                    reaches of our solar system. Each correct answer earns you a place
                    on the leaderboard.
                  </p>
                  {!explorer && (
                    <div className="mt-3 rounded-lg border border-amber-300/30 bg-amber-300/10 p-2.5 text-xs text-amber-100">
                      You need an explorer handle to save your score.
                    </div>
                  )}
                  <Button
                    className="mt-5 bg-gradient-to-r from-cyan-400 to-teal-400 text-black hover:from-cyan-300 hover:to-teal-300"
                    onClick={start}
                  >
                    {explorer ? 'Begin mission' : 'Create explorer & begin'}
                    <ChevronRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              )}

              {(phase === 'playing' || phase === 'reveal') && current && (
                <div>
                  <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Question {idx + 1} of {questions.length}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5 text-amber-300" />
                      Score {score}
                    </span>
                  </div>
                  <Progress
                    value={((idx + (phase === 'reveal' ? 1 : 0)) / questions.length) * 100}
                    className="mb-5 h-1.5"
                  />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.25 }}
                    >
                      {current.planetSlug && (
                        <Badge variant="secondary" className="mb-2 capitalize">
                          {current.planetSlug}
                        </Badge>
                      )}
                      <h3 className="font-display text-xl font-semibold leading-snug">
                        {current.question}
                      </h3>

                      <div className="mt-4 grid gap-2">
                        {current.options.map((opt, i) => {
                          const isCorrect = i === current.correctIndex
                          const isChosen = i === selected
                          const showState = phase === 'reveal'
                          return (
                            <button
                              key={i}
                              onClick={() => choose(i)}
                              disabled={phase !== 'playing'}
                              className={cn(
                                'group flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all',
                                !showState &&
                                  'border-border/60 bg-card/40 hover:border-cyan-300/40 hover:bg-cyan-400/5',
                                showState && isCorrect && 'border-emerald-400/50 bg-emerald-400/10 text-emerald-50',
                                showState && isChosen && !isCorrect && 'border-rose-400/50 bg-rose-400/10 text-rose-50',
                                showState && !isCorrect && !isChosen && 'border-border/40 bg-card/20 opacity-60',
                              )}
                            >
                              <span>{opt}</span>
                              {showState && isCorrect && <Check className="h-4 w-4 text-emerald-300" />}
                              {showState && isChosen && !isCorrect && <XCircle className="h-4 w-4 text-rose-300" />}
                            </button>
                          )
                        })}
                      </div>

                      <AnimatePresence>
                        {phase === 'reveal' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 overflow-hidden"
                          >
                            <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/5 p-3 text-sm text-cyan-50/90">
                              <span className="font-semibold text-cyan-200">Why: </span>
                              {current.explanation}
                            </div>
                            <Button
                              className="mt-3 w-full bg-cyan-400 text-black hover:bg-cyan-300"
                              onClick={next}
                            >
                              {idx + 1 < questions.length ? 'Next question' : 'See results'}
                              <ChevronRight className="ml-1.5 h-4 w-4" />
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {phase === 'done' && (
                <div className="text-center">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-amber-400/30 to-orange-400/20 ring-1 ring-amber-300/40">
                    <Trophy className="h-7 w-7 text-amber-200" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">Mission complete!</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {score === questions.length
                      ? 'Flawless! You\'re a true cosmonaut. 🌟'
                      : score >= questions.length * 0.7
                        ? 'Stellar work — almost perfect!'
                        : score >= questions.length * 0.5
                          ? 'Nice run. The cosmos awaits another attempt.'
                          : 'Every explorer starts somewhere. Try again!'}
                  </p>

                  <div className="mx-auto mt-5 grid max-w-xs grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border/40 bg-card/40 p-4">
                      <div className="font-display text-3xl font-bold text-cyan-200">{score}</div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Correct</div>
                    </div>
                    <div className="rounded-xl border border-border/40 bg-card/40 p-4">
                      <div className="font-display text-3xl font-bold text-amber-200">
                        {Math.round((score / questions.length) * 100)}%
                      </div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Accuracy</div>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={restart}>
                      <RotateCcw className="mr-1.5 h-4 w-4" /> Retry
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:from-amber-300 hover:to-orange-400"
                      onClick={() => {
                        setOpen(false)
                        setLeaderboardOpen(true)
                      }}
                    >
                      <Trophy className="mr-1.5 h-4 w-4" /> Leaderboard
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
