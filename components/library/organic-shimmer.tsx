"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useMotionTemplate, useTransform, animate, useReducedMotion } from "framer-motion"

export function OrganicShimmer() {
  const reduce = useReducedMotion()
  const [running, setRunning] = useState(true)

  // A single phase value drives BOTH the shimmer drift and the edge glow,
  // so the glow stays phase-locked to the wave. sin/cos are continuous at 0<->1.
  const phase = useMotionValue(0)

  useEffect(() => {
    if (reduce || !running) return
    const controls = animate(phase, 1, {
      duration: 7,
      ease: "linear",
      repeat: Number.POSITIVE_INFINITY,
    })
    return () => controls.stop()
  }, [reduce, running, phase])

  const TAU = Math.PI * 2
  // Two blobs drift on offset sine paths for an organic, non-repeating feel.
  const x1 = useTransform(phase, (p) => 50 + Math.sin(p * TAU) * 22)
  const y1 = useTransform(phase, (p) => 50 + Math.cos(p * TAU * 1.3) * 20)
  const x2 = useTransform(phase, (p) => 50 + Math.cos(p * TAU * 0.8) * 24)
  const y2 = useTransform(phase, (p) => 50 + Math.sin(p * TAU * 1.1) * 22)

  const shimmer = useMotionTemplate`radial-gradient(55% 55% at ${x1}% ${y1}%, rgba(56,189,248,0.5), transparent 70%), radial-gradient(50% 50% at ${x2}% ${y2}%, rgba(45,212,191,0.38), transparent 72%), radial-gradient(65% 65% at 50% 115%, rgba(59,130,246,0.45), transparent 75%)`

  // Phase-locked light. Kept as an INSET shadow so it lives inside the card and
  // never leaks past the rounded border. Highlight top-left, shade bottom-right
  // give the raised / embossed feel; the colored inset pulses on the same phase.
  const glowAlpha = useTransform(phase, (p) => 0.18 + (Math.sin(p * TAU) + 1) * 0.11)
  const innerGlow = useMotionTemplate`inset 0 1px 0 0 rgba(255,255,255,0.14), inset 0 -10px 24px -12px rgba(0,0,0,0.7), inset 0 0 22px 2px rgba(56,189,248,${glowAlpha})`

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-40 w-40 rounded-2xl bg-neutral-950 p-px">
        {/* clipping surface: everything colorful is contained here */}
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950">
          {/* drifting shimmer, radially masked so it fades to nothing before the edge */}
          <motion.div
            className="absolute inset-0 blur-md [mask-image:radial-gradient(78%_78%_at_50%_50%,black,transparent)]"
            style={{ background: shimmer }}
          />
          {/* quiet vignette to keep the center calm */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_40%,rgba(10,10,12,0.65))]" />
          {/* phase-locked raised edge (inset only -> stays inside the card) */}
          <motion.div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ boxShadow: innerGlow }} />
        </div>
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
