"use client"

// orea component template
// ------------------------
// Copy this file to components/library/<kebab-name>.tsx and rename the export.
// Rules:
//   - "use client" on line 1
//   - one named export, PascalCase
//   - NO required props (add defaults if you need props)
//   - self-contained demo sized for a ~h-64 preview tile (e.g. h-44 w-72)
//   - dark palette + one accent, Framer Motion for motion
//   - honor prefers-reduced-motion for decorative animation
// Then register it in components/library/registry.tsx (see references/registry-workflow.md).

import { useRef } from "react"
import { motion, useMotionValue, useSpring, useMotionTemplate, useReducedMotion } from "framer-motion"

export function ComponentTemplate() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  // Example: pointer-driven tilt + glare (swap for your interaction).
  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 })
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)

  function handleMove(e: React.MouseEvent) {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * 20)
    rotateX.set((0.5 - py) * 20)
    glareX.set(px * 100)
    glareY.set(py * 100)
  }

  function reset() {
    rotateX.set(0)
    rotateY.set(0)
  }

  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.28), transparent 55%)`

  return (
    <div style={{ perspective: 900 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-44 w-72 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800 to-neutral-900 p-5"
      >
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: glare }} />
        <div className="relative flex h-full flex-col justify-between">
          <span className="text-xs font-medium text-neutral-400">Template</span>
          <div>
            <p className="text-lg font-semibold tracking-tight text-neutral-50">Replace me</p>
            <p className="text-sm leading-relaxed text-neutral-400">Describe the effect here.</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
