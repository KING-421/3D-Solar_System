'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Trophy, Sparkles, LogOut, UserPlus, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useApp } from '@/lib/store'
import { api, getStoredExplorerId, setStoredExplorerId, clearStoredExplorerId } from '@/lib/api'
import type { Explorer } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

const AVATAR_COLORS = [
  '#7dd3fc', '#f0abfc', '#fbbf24', '#34d399',
  '#f87171', '#a78bfa', '#fb923c', '#22d3ee',
]

export function ExplorerBar() {
  const explorer = useApp((s) => s.explorer)
  const setExplorer = useApp((s) => s.setExplorer)
  const setQuizOpen = useApp((s) => s.setQuizOpen)
  const setLeaderboardOpen = useApp((s) => s.setLeaderboardOpen)
  const setOnboardOpen = useApp((s) => s.setOnboardOpen)
  const { toast } = useToast()

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // SSR hydration guard — must run after mount to read localStorage safely.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // On first load, try to restore the explorer from localStorage
  useEffect(() => {
    if (!mounted) return
    const id = getStoredExplorerId()
    if (!id) return
    api
      .get<{ explorer: Explorer | null }>('/api/explorers/me')
      .then((r) => setExplorer(r.explorer))
      .catch(() => {
        clearStoredExplorerId()
      })
  }, [mounted, setExplorer])

  const handleLogout = () => {
    clearStoredExplorerId()
    setExplorer(null)
    toast({ title: 'Signed out', description: 'Come back soon, explorer.' })
  }

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-strong border-b border-border/40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <button
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/30 to-amber-300/20 ring-1 ring-cyan-300/40">
              <Sparkles className="h-4.5 w-4.5 text-cyan-300" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-twinkle rounded-full bg-amber-300" />
            </div>
            <div className="text-left leading-none">
              <div className="font-display text-lg font-bold tracking-tight">
                Stellarium
              </div>
              <div className="hidden text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:block">
                3D Solar System Explorer
              </div>
            </div>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-cyan-200 hover:bg-cyan-400/10 hover:text-cyan-100 sm:flex"
              onClick={() => setLeaderboardOpen(true)}
            >
              <Trophy className="mr-1.5 h-4 w-4" />
              Leaderboard
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:from-amber-300 hover:to-orange-400"
              onClick={() => {
                if (!explorer) {
                  setOnboardOpen(true)
                  toast({
                    title: 'Create your explorer handle',
                    description: 'Sign up to take quizzes and save favorites.',
                  })
                  return
                }
                setQuizOpen(true)
              }}
            >
              <Rocket className="mr-1.5 h-4 w-4" />
              Launch Quiz
            </Button>

            {mounted && explorer ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-1 flex items-center gap-2 rounded-full border border-border/60 bg-card/40 p-1 pr-2.5 transition-colors hover:bg-card/70">
                    <span
                      className="grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-black"
                      style={{ backgroundColor: explorer.avatarColor }}
                    >
                      {explorer.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="hidden text-sm font-medium sm:inline">
                      {explorer.handle}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-strong">
                  <DropdownMenuLabel className="flex flex-col">
                    <span>{explorer.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      @{explorer.handle}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLeaderboardOpen(true)}>
                    <Trophy className="mr-2 h-4 w-4" /> Leaderboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : mounted ? (
              <Button
                variant="outline"
                size="sm"
                className="border-cyan-300/30 bg-cyan-400/5 text-cyan-100 hover:bg-cyan-400/15"
                onClick={() => setOnboardOpen(true)}
              >
                <UserPlus className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">Become an Explorer</span>
                <span className="sm:hidden">Join</span>
              </Button>
            ) : (
              <div className="h-9 w-24 animate-pulse rounded-md bg-card/40" />
            )}
          </div>
        </div>
      </div>

      <OnboardModal />
    </header>
  )
}

function OnboardModal() {
  const onboardOpen = useApp((s) => s.onboardOpen)
  const setOnboardOpen = useApp((s) => s.setOnboardOpen)
  const setExplorer = useApp((s) => s.setExplorer)
  const setQuizOpen = useApp((s) => s.setQuizOpen)
  const { toast } = useToast()

  const [handle, setHandle] = useState('')
  const [name, setName] = useState('')
  const [color, setColor] = useState(AVATAR_COLORS[0])
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    const clean = handle.trim().toLowerCase()
    if (clean.length < 2) {
      toast({ title: 'Handle too short', description: 'At least 2 characters, letters/numbers/underscore.', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const res = await api.post<{ explorer: Explorer }>('/api/explorers', {
        handle: clean,
        name: name.trim() || clean,
        avatarColor: color,
      })
      setStoredExplorerId(res.explorer.id)
      setExplorer(res.explorer)
      setOnboardOpen(false)
      toast({
        title: `Welcome, ${res.explorer.name}!`,
        description: 'You can now save favorites, take quizzes, and join the leaderboard.',
      })
      setTimeout(() => setQuizOpen(true), 400)
    } catch (e) {
      toast({ title: 'Could not create explorer', description: (e as Error).message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {onboardOpen && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOnboardOpen(false)}
          />
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl glass-strong p-6 shadow-2xl gradient-border"
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          >
            <button
              className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setOnboardOpen(false)}
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="mb-5 flex items-center gap-2">
              <Badge className="bg-cyan-400/15 text-cyan-200 hover:bg-cyan-400/20">
                <Rocket className="mr-1 h-3 w-3" /> New Mission
              </Badge>
            </div>
            <h2 className="font-display text-2xl font-bold">Become an Explorer</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a handle, choose your signal color, and start your journey across the solar system.
            </p>

            <div className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="handle">Explorer handle</Label>
                <div className="flex items-center rounded-lg border border-border/60 bg-card/40">
                  <span className="pl-3 text-muted-foreground">@</span>
                  <Input
                    id="handle"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="star_voyager"
                    className="border-0 bg-transparent focus-visible:ring-0"
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Display name <span className="text-muted-foreground">(optional)</span></Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="border-border/60 bg-card/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Signal color</Label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`h-8 w-8 rounded-full transition-transform ${color === c ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-background' : 'opacity-70 hover:opacity-100'}`}
                      style={{ backgroundColor: c }}
                      aria-label={`color ${c}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Button
              className="mt-6 w-full bg-gradient-to-r from-cyan-400 to-teal-400 text-black hover:from-cyan-300 hover:to-teal-300"
              onClick={submit}
              disabled={loading}
            >
              {loading ? 'Launching…' : 'Launch my journey'}
              <Rocket className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
