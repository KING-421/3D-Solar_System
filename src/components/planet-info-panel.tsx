'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  X,
  Heart,
  Ruler,
  Orbit,
  Clock,
  CalendarDays,
  Thermometer,
  Moon,
  Gauge,
  FlaskConical,
  Sparkles,
  Send,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useApp } from '@/lib/store'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import type { Note, PlanetDetail } from '@/lib/types'
import { cn } from '@/lib/utils'

export function PlanetInfoPanel() {
  const selectedSlug = useApp((s) => s.selectedSlug)
  const selectPlanet = useApp((s) => s.selectPlanet)
  const setFocusSlug = useApp((s) => s.setFocusSlug)
  const explorer = useApp((s) => s.explorer)
  const favoriteSlugs = useApp((s) => s.favoriteSlugs)
  const toggleFavoriteSlug = useApp((s) => s.toggleFavoriteSlug)
  const setOnboardOpen = useApp((s) => s.setOnboardOpen)
  const { toast } = useToast()

  const [detail, setDetail] = useState<PlanetDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [favBusy, setFavBusy] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [postingNote, setPostingNote] = useState(false)

  const isFav = selectedSlug ? favoriteSlugs.has(selectedSlug) : false

  // Fetch detail when selection changes
  useEffect(() => {
    if (!selectedSlug) {
      setDetail(null)
      return
    }
    setLoading(true)
    setDetail(null)
    api
      .get<{ planet: PlanetDetail['slug'] extends never ? never : Omit<PlanetDetail, 'notes'> & { notes: Note[] }; favoriteCount: number; notes: Note[] }>(
        `/api/planets/${selectedSlug}`,
      )
      .then((r) => {
        setDetail({
          ...(r.planet as unknown as PlanetDetail),
          favoriteCount: r.favoriteCount,
          notes: r.notes,
        })
      })
      .finally(() => setLoading(false))
  }, [selectedSlug])

  const toggleFavorite = async () => {
    if (!selectedSlug) return
    if (!explorer) {
      setOnboardOpen(true)
      return
    }
    setFavBusy(true)
    const wasFav = isFav
    toggleFavoriteSlug(selectedSlug) // optimistic
    try {
      await api.post('/api/favorites', { planetSlug: selectedSlug })
      toast({
        title: wasFav ? 'Removed from star log' : 'Saved to star log',
        description: wasFav ? undefined : `${detail?.name ?? 'Planet'} is now in your favorites.`,
      })
    } catch (e) {
      toggleFavoriteSlug(selectedSlug) // rollback
      toast({ title: 'Could not update favorite', description: (e as Error).message, variant: 'destructive' })
    } finally {
      setFavBusy(false)
    }
  }

  const submitNote = async () => {
    if (!selectedSlug || !explorer) {
      setOnboardOpen(true)
      return
    }
    const content = noteText.trim()
    if (!content) return
    setPostingNote(true)
    try {
      const res = await api.post<{ note: Note }>('/api/notes', {
        planetSlug: selectedSlug,
        content,
      })
      setDetail((d) =>
        d ? { ...d, notes: [res.note, ...d.notes] } : d,
      )
      setNoteText('')
      toast({ title: 'Note added to star log' })
    } catch (e) {
      toast({ title: 'Could not post note', description: (e as Error).message, variant: 'destructive' })
    } finally {
      setPostingNote(false)
    }
  }

  const close = () => {
    selectPlanet(null)
    setFocusSlug(null)
  }

  return (
    <AnimatePresence>
      {selectedSlug && (
        <motion.aside
          key={selectedSlug}
          className="pointer-events-auto absolute right-0 top-0 z-30 flex h-full w-full max-w-md flex-col"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 240 }}
        >
          <div className="flex h-full flex-col glass-strong border-l border-border/40">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 p-5">
              <div className="flex items-center gap-3">
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl text-2xl shadow-lg"
                  style={{
                    backgroundColor: detail?.color ?? '#444',
                    boxShadow: `0 0 30px ${detail?.color ?? '#444'}55`,
                  }}
                >
                  {detail?.type === 'star' ? <SunIcon /> : <PlanetIcon />}
                </span>
                <div>
                  {loading || !detail ? (
                    <div className="space-y-2">
                      <div className="h-6 w-32 animate-pulse rounded bg-card/60" />
                      <div className="h-3.5 w-20 animate-pulse rounded bg-card/40" />
                    </div>
                  ) : (
                    <>
                      <h2 className="font-display text-2xl font-bold leading-none">
                        {detail.name}
                      </h2>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize">
                          {detail.type}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Heart className="h-3 w-3" /> {detail.favoriteCount}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={close}
                className="grid h-9 w-9 place-items-center rounded-full bg-card/50 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Body */}
            <ScrollArea className="flex-1 px-5">
              {loading || !detail ? (
                <div className="space-y-3 pb-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-card/40" />
                  ))}
                </div>
              ) : (
                <div className="space-y-5 pb-6">
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {detail.description}
                  </p>

                  {/* Fun fact */}
                  <div className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-200">
                      <Sparkles className="h-3.5 w-3.5" /> Fun fact
                    </div>
                    <p className="mt-1.5 text-sm text-amber-50/90">{detail.funFact}</p>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <Stat icon={<Ruler className="h-3.5 w-3.5" />} label="Diameter" value={detail.diameterKm} />
                    <Stat icon={<Orbit className="h-3.5 w-3.5" />} label="Distance" value={detail.distanceAu} />
                    <Stat icon={<Clock className="h-3.5 w-3.5" />} label="Day length" value={detail.dayLength} />
                    <Stat icon={<CalendarDays className="h-3.5 w-3.5" />} label="Year length" value={detail.yearLength} />
                    <Stat icon={<Thermometer className="h-3.5 w-3.5" />} label="Temperature" value={detail.temperatureC} />
                    <Stat icon={<Moon className="h-3.5 w-3.5" />} label="Moons" value={String(detail.moonCount)} />
                    <Stat icon={<Gauge className="h-3.5 w-3.5" />} label="Gravity" value={detail.gravity} />
                    <Stat icon={<FlaskConical className="h-3.5 w-3.5" />} label="Composition" value={detail.composition} />
                  </div>

                  {/* Favorite button */}
                  <Button
                    onClick={toggleFavorite}
                    disabled={favBusy}
                    variant={isFav ? 'default' : 'outline'}
                    className={cn(
                      'w-full',
                      isFav
                        ? 'bg-rose-500 text-white hover:bg-rose-400'
                        : 'border-rose-400/30 bg-rose-400/5 text-rose-100 hover:bg-rose-400/15',
                    )}
                  >
                    {favBusy ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Heart className={cn('mr-2 h-4 w-4', isFav && 'fill-current')} />
                    )}
                    {isFav ? 'In your star log' : 'Add to star log'}
                  </Button>

                  {/* Notes / star log */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                        <Star className="h-4 w-4 text-cyan-300" /> Explorer Notes
                        <span className="text-muted-foreground">({detail.notes.length})</span>
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <Textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder={
                          explorer
                            ? 'Leave a note for fellow explorers…'
                            : 'Sign in to leave a note'
                        }
                        maxLength={280}
                        rows={2}
                        className="resize-none border-border/60 bg-card/40 text-sm"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">
                          {noteText.length}/280
                        </span>
                        <Button
                          size="sm"
                          onClick={submitNote}
                          disabled={postingNote || !noteText.trim()}
                          className="bg-cyan-400 text-black hover:bg-cyan-300"
                        >
                          {postingNote ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Send className="mr-1 h-3.5 w-3.5" />}
                          Post
                        </Button>
                      </div>
                    </div>

                    <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                      {detail.notes.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border/50 p-4 text-center text-xs text-muted-foreground">
                          No notes yet. Be the first to chart this world.
                        </div>
                      ) : (
                        detail.notes.map((n) => (
                          <div key={n.id} className="rounded-lg border border-border/40 bg-card/30 p-3">
                            <div className="flex items-center gap-2">
                              <span
                                className="grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-black"
                                style={{ backgroundColor: n.explorer.avatarColor }}
                              >
                                {n.explorer.name.slice(0, 1).toUpperCase()}
                              </span>
                              <span className="text-xs font-medium">{n.explorer.name}</span>
                              <span className="text-[11px] text-muted-foreground">
                                @{n.explorer.handle}
                              </span>
                            </div>
                            <p className="mt-1.5 text-sm text-foreground/90">{n.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/30 p-2.5">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-medium leading-tight">{value}</div>
    </div>
  )
}

function SunIcon() {
  return <span className="text-2xl">☀</span>
}
function PlanetIcon() {
  return <span className="text-xl">🪐</span>
}
