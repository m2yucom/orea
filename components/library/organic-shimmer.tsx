"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useMotionTemplate, useTransform, animate, useReducedMotion } from "framer-motion"

export function OrganicShimmer() {
  const reduce = useReducedMotion()
  const [running, setRunning] = useState(true)

  // ONE normalized progress value (0 -> 1) is the single source of truth.
  // The light travels a defined path (top-left -> bottom-right), and the edge
  // highlight is derived from the SAME progress, so it stays locked to the light.
  const progress = useMotionValue(0)

  useEffect(() => {
    if (reduce) {
      progress.set(0.5)
      return
    }
    if (!running) return
    const controls = animate(progress, 1, {
      duration: 4.5,
      ease: "easeInOut", // eases in at the start, out at the end of the path
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse", // travels there and back instead of snapping
    })
    return () => controls.stop()
  }, [reduce, running, progress])

  // Explicit start/end points of the diagonal path (percent coordinates).
  const x = useTransform(progress, [0, 1], [16, 84])
  const y = useTransform(progress, [0, 1], [16, 84])

  // The moving shimmer blob, positioned on the path.
  const shimmer = useMotionTemplate`radial-gradient(58% 58% at ${x}% ${y}%, rgba(56,189,248,0.55), rgba(45,212,191,0.28) 42%, transparent 70%)`

  // Same coordinates feed a bright spot; a ring-shaped mask keeps it ONLY on the
  // border, so just the segment the light is passing lights up (not the whole edge).
  const ringLight = useMotionTemplate`radial-gradient(circle at ${x}% ${y}%, rgba(190,225,255,0.95), rgba(190,225,255,0) 26%)`

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950">
        {/* moving shimmer, radially masked so it fades out before the edge */}
        <motion.div
          className="absolute inset-0 blur-md [mask-image:radial-gradient(80%_80%_at_50%_50%,black,transparent)]"
          style={{ background: shimmer }}
        />
        {/* quiet vignette keeps the middle calm */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_45%,rgba(10,10,12,0.6))]" />
        {/* edge highlight: ring-mask means only the border near the light glows */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            padding: 1.5,
            background: ringLight,
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => setRunning((r) => !r)}
        aria-pressed={running}
        className="rounded-full bg-neutral-800 px-5 py-2 text-sm font-medium text-neutral-100 transition-colors hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {running ? "Stop" : "Play"}
      </button>
    </div>
  )
}
