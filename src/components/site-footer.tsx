import { Rocket, Github, Heart } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400/30 to-amber-300/20 ring-1 ring-cyan-300/40">
              <Rocket className="h-4 w-4 text-cyan-300" />
            </div>
            <div className="text-sm">
              <span className="font-display font-bold">Stellarium</span>
              <span className="ml-2 text-muted-foreground">
                3D Solar System Explorer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" /> Source
            </a>
            <span className="flex items-center gap-1.5">
              Built with <Heart className="h-3 w-3 fill-rose-400 text-rose-400" /> using Next.js &amp; React Three Fiber
            </span>
          </div>
        </div>

        <div className="mt-4 text-center text-[11px] text-muted-foreground sm:text-left">
          Data is for educational/demo purposes. Planet sizes and distances are
          not to scale — they&apos;re tuned for a beautiful experience.
        </div>
      </div>
    </footer>
  )
}
