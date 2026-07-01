'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Crown, RefreshCw, Loader2, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useApp } from '@/lib/store'
import { api } from '@/lib/api'
import type { LeaderboardEntry } from '@/lib/types'
import { cn } from '@/lib/utils'

export function LeaderboardPanel() {
  const open = useApp((s) => s.leaderboardOpen)
  const setOpen = useApp((s) => s.setLeaderboardOpen)
  const explorer = useApp((s) => s.explorer)

  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(false)

  const load = () => {
    setLoading(true)
    api
      .get<{ leaderboard: LeaderboardEntry[] }>('/api/leaderboard')
      .then((r) => setEntries(r.leaderboard))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (open) {
      // Load leaderboard data when the dialog opens (external data sync).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      load()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0 glass-strong">
        <DialogHeader className="border-b border-border/40 px-5 py-4">
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400/30 to-orange-500/20 ring-1 ring-amber-300/40">
                <Trophy className="h-4.5 w-4.5 text-amber-200" />
              </span>
              <div>
                <DialogTitle className="font-display text-lg leading-none">
                  Cosmic Leaderboard
                </DialogTitle>
                <DialogDescription className="mt-1 text-xs">
                  Top explorers ranked by best quiz score
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={load}
              disabled={loading}
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-2 p-4">
            {loading && entries.length === 0 ? (
              <div className="grid h-40 place-items-center">
                <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
              </div>
            ) : entries.length === 0 ? (
              <div className="grid h-40 place-items-center px-6 text-center">
                <div>
                  <Trophy className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No scores yet. Be the first explorer on the board!
                  </p>
                </div>
              </div>
            ) : (
              entries.map((e, i) => {
                const isYou = explorer?.id === e.explorerId
                return (
                  <motion.div
                    key={e.explorerId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border p-3 transition-colors',
                      isYou
                        ? 'border-cyan-300/40 bg-cyan-400/10'
                        : 'border-border/40 bg-card/30',
                    )}
                  >
                    <RankBadge rank={e.rank} />
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold text-black"
                      style={{ backgroundColor: e.avatarColor }}
                    >
                      {e.name.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-semibold">{e.name}</span>
                        {isYou && (
                          <Badge className="bg-cyan-400/20 text-[10px] text-cyan-100 hover:bg-cyan-400/20">
                            you
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">@{e.handle}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg font-bold text-amber-200">
                        {e.score}
                        <span className="text-xs text-muted-foreground">/{e.total}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">{e.accuracy}% acc</div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-400/20 text-amber-200 ring-1 ring-amber-300/40">
        <Crown className="h-4 w-4" />
      </span>
    )
  if (rank === 2)
    return (
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-300/20 text-slate-200 ring-1 ring-slate-300/40">
        <Medal className="h-4 w-4" />
      </span>
    )
  if (rank === 3)
    return (
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-orange-400/20 text-orange-200 ring-1 ring-orange-300/40">
        <Medal className="h-4 w-4" />
      </span>
    )
  return (
    <span className="grid h-8 w-8 place-items-center rounded-lg bg-card/50 text-xs font-bold text-muted-foreground">
      {rank}
    </span>
  )
}
