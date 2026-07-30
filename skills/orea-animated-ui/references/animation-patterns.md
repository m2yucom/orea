# Framer Motion patterns

These are the exact motion recipes used across the orea library. Reach for the one that
matches the interaction. All examples assume `"use client"` and `import { ... } from "framer-motion"`.

## Spring feel cheatsheet

- Snappy pointer follow / tilt: `useSpring(mv, { stiffness: 220, damping: 18 })`
- Magnetic buttons (looser, springier): `{ stiffness: 300, damping: 15 }`
- Soft settle / gentle: `{ stiffness: 120, damping: 20 }`
- Duration-based reveals: `transition={{ duration: 0.4, ease: "easeOut" }}`
- Enter-from-below reveal: `initial={{ opacity: 0, y: 16 }}` → `animate/whileInView {{ opacity: 1, y: 0 }}`

Prefer springs for anything the user directly drives (pointer, drag, toggle). Prefer
tweens/durations for scripted reveals and loops.

---

## 1. Pointer-driven 3D tilt + glare

Use for cards that should react to the cursor in 3D with a moving light highlight.

```tsx
const ref = useRef<HTMLDivElement>(null)
const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 })
const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 })
const glareX = useMotionValue(50)
const glareY = useMotionValue(50)

function handleMove(e: React.MouseEvent) {
  const el = ref.current
  if (!el) return
  const rect = el.getBoundingClientRect()
  const px = (e.clientX - rect.left) / rect.width
  const py = (e.clientY - rect.top) / rect.height
  rotateY.set((px - 0.5) * 22)
  rotateX.set((0.5 - py) * 22)
  glareX.set(px * 100)
  glareY.set(py * 100)
}

const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.28), transparent 55%)`

// wrap in a div with style={{ perspective: 900 }}
// motion.div: style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
// reset on onMouseLeave: rotateX.set(0); rotateY.set(0)
```

## 2. Magnetic element (follow cursor, spring back)

```tsx
const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 15 })
const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 15 })

function handleMove(e: React.MouseEvent) {
  const rect = e.currentTarget.getBoundingClientRect()
  x.set((e.clientX - rect.left - rect.width / 2) * 0.4)
  y.set((e.clientY - rect.top - rect.height / 2) * 0.4)
}
// onMouseLeave: x.set(0); y.set(0)  •  style={{ x, y }}
```

## 3. Spotlight follow (mask that tracks the pointer)

```tsx
const mx = useMotionValue(0)
const my = useMotionValue(0)
const bg = useMotionTemplate`radial-gradient(240px circle at ${mx}px ${my}px, rgba(59,130,246,0.15), transparent 70%)`
// onMouseMove: mx.set(e.clientX - rect.left); my.set(e.clientY - rect.top)
// render an absolutely-positioned motion.div with style={{ background: bg }}
```

## 4. Count-up / animated number

```tsx
const ref = useRef<HTMLSpanElement>(null)
const inView = useInView(ref, { once: true })
const count = useMotionValue(0)
const rounded = useTransform(count, (v) => Math.round(v).toLocaleString())

useEffect(() => {
  if (!inView) return
  const controls = animate(count, 48250, { duration: 2, ease: "easeOut" })
  return controls.stop // cleanup!
}, [inView, count])
// render <motion.span ref={ref}>{rounded}</motion.span>
```

## 5. Enter / exit (modals, toasts, stacks)

```tsx
<AnimatePresence mode="popLayout">
  {items.map((item) => (
    <motion.div
      key={item.id}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    />
  ))}
</AnimatePresence>
```

Use `mode="wait"` when a single element swaps (e.g. copy → check icon), and
`mode="popLayout"` + `layout` when siblings reflow (stacks, lists).

## 6. Looping ambient motion (marquee, shimmer, aurora)

```tsx
// Marquee: duplicate content, translate x from 0 to -50%
<motion.div
  animate={{ x: ["0%", "-50%"] }}
  transition={{ duration: 18, ease: "linear", repeat: Infinity }}
/>

// Shimmer text: animate backgroundPosition of a clipped gradient
<motion.span
  className="bg-[linear-gradient(...)] bg-clip-text text-transparent"
  animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
  transition={{ duration: 3, ease: "linear", repeat: Infinity }}
/>
```

Keep ambient loops subtle and low-frequency. Gate them behind reduced-motion when decorative.

## 7. SVG path draw (checkmarks, icons)

```tsx
<motion.path
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
  strokeLinecap="round"
/>
```

## 8. Staggered children

```tsx
<motion.ul
  initial="hidden"
  animate="show"
  variants={{ show: { transition: { staggerChildren: 0.06 } } }}
>
  <motion.li variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} />
</motion.ul>
```

---

## Reduced motion

For decorative/ambient motion, respect the user's preference:

```tsx
import { useReducedMotion } from "framer-motion"
const reduce = useReducedMotion()
// then: transition={reduce ? { duration: 0 } : { duration: 2, repeat: Infinity }}
// or skip the looping animation entirely and render the resting state.
```

Direct-manipulation feedback (a toggle snapping, a button press) can stay, but
should be quick and non-distracting.
