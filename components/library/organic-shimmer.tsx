"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useMotionTemplate, useTransform, animate, useReducedMotion } from "framer-motion"

export function OrganicShimmer() {
  const reduce = useReducedMotion()
  const [running, setRunning] = useState(true)

  // Single phase value drives BOTH the shimmer drift and the edge glow,
  // so the glow stays phase-locked to the wave. sin/cos are continuous at 0↔1.
  const phase = useMotionValue(0)

  useEffect(() => {
    if (reduce || !running) return
    const controls = animate(phase, 1, {
      duration: 7,
      ease: "linear",
      repeat: Infinity,
    })
    return () => controls.stop()
  }, [reduce, running, phase])

  const TAU = Math.PI * 2
  // Two blobs drift on offset sine paths for an organic, non-repeating feel.
  const x1 = useTransform(phase, (p) => 50 + Math.sin(p * TAU) * 26)
  const y1 = useTransform(phase, (p) => 50 + Math.cos(p * TAU * 1.3) * 24)
  const x2 = useTransform(phase, (p) => 50 + Math.cos(p * TAU * 0.8) * 28)
  const y2 = useTransform(phase, (p) => 50 + Math.sin(p * TAU * 1.1) * 26)

  const shimmer = useMotionTemplate`radial-gradient(60% 60% at ${x1}% ${y1}%, rgba(56,189,248,0.55), transparent 70%), radial-gradient(55% 55% at ${x2}% ${y2}%, rgba(45,212,191,0.4), transparent 72%), radial-gradient(70% 70% at 50% 120%, rgba(59,130,246,0.5), transparent 75%)`

  // Edge glow pulses on the same phase — locked to the wave, never drifting.
  const glowAlpha = useTransform(phase, (p) => 0.25 + (Math.sin(p * TAU) + 1) * 0.16)
  const glowSpread = useTransform(phase, (p) => 8 + (Math.cos(p * TAU) + 1) * 5)
  const edgeGlow = useMotionTemplate`0 0 28px ${glowSpread}px rgba(56,189,248,${glowAlpha})`

  return (
    <div className="flex flex-col items-center gap-5">
      <motion.div
        style={{ boxShadow: edgeGlow }}
        className="relative h-40 w-40 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950"
      >
        {/* drifting shimmer field */}
        <motion.div className="absolute inset-0 blur-md" style={{ background: shimmer }} />
        {/* soft dark vignette to keep it quiet */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/40 via-transparent to-neutral-950/60" />
        {/* fine top sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent" />
      </motion.div>

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
