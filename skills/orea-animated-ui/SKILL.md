---
name: orea-animated-ui
description: >-
  Build polished, self-contained animated React UI components in the "orea"
  style — dark theme, Framer Motion physics, copy-pasteable code — and register
  them in the orea component library. Use this skill whenever the user asks to
  create, design, or add an animated component, micro-interaction, hover effect,
  motion demo, or a new entry to the orea registry.
license: MIT
compatible_tools:
  - Claude Code
  - Antigravity
  - Codex
  - OpenCode
  - Cursor
  - Windsurf
  - any AGENTS.md-aware agent
---

# orea Animated UI

You are an expert at building **beautiful, self-contained animated UI components**
in the visual and technical style of the **orea** component library. Each
component is a single, copy-pasteable file that looks great in a small preview
tile and animates with tasteful, physics-based motion.

## When to use this skill

Trigger on requests like:

- "Add an animated <thing> component"
- "Make a hover / tilt / magnetic / spotlight / marquee / ticker effect"
- "Build a micro-interaction for <button|card|input|toggle>"
- "Add a new component to the registry / library"
- "Make it feel more alive / animated / premium"

## Core principles (non-negotiable)

1. **Self-contained.** One file, one named export, `"use client"` at the top.
   No required props — the component renders a complete, attractive demo on its
   own so it works in a preview tile.
2. **Framer Motion is the motion engine.** Import from `framer-motion`. Prefer
   `useMotionValue` + `useSpring` + `useMotionTemplate` for pointer/physics work,
   and `AnimatePresence` + `layout` for enter/exit and layout transitions.
3. **Dark-first aesthetic.** Neutral-900/950 surfaces, subtle `white/10` borders,
   generous rounding (`rounded-2xl`/`rounded-3xl`), one restrained accent
   (blue-500 family). No purple/violet unless asked. See
   `references/design-tokens.md`.
4. **Fixed, tidy preview dimensions.** Demos should size themselves (e.g.
   `h-44 w-72`, or a compact centered element) so they sit nicely in a
   `h-64` preview area. Never render full-width/full-page layouts.
5. **Accessible & respectful of motion.** Real semantic elements, `aria-*`
   where needed, keyboard support for interactive controls, and honor
   `prefers-reduced-motion` for non-essential animation.
6. **Performance.** Animate only `transform`/`opacity`/filter where possible.
   Clean up timers, `animate()` controls, and listeners. No layout thrash.

## Workflow

Follow these steps in order. Read the referenced files the first time you build
a component in a session.

### 1. Understand the target style

Read `references/design-tokens.md` (visual language) and
`references/animation-patterns.md` (the exact Framer Motion recipes used across
the library). Match them precisely — the components must feel like siblings of
the existing ones.

### 2. Scaffold the component file

Create `components/library/<kebab-name>.tsx` using
`examples/component-template.tsx` as the starting point. Rules:

- First line: `"use client"`.
- Export a single named function: `export function PascalName() { ... }`.
- No required props. If you add props, give every one a default.
- Keep it under ~120 lines. If it needs more, simplify the idea.
- Use Tailwind classes only (v4 — no config file). Follow the token palette.

### 3. Make the motion excellent

Pick the matching recipe from `references/animation-patterns.md`:

- Pointer-driven 3D / glare → `useMotionValue` + `useSpring` + `useMotionTemplate`
- Magnetic / follow-cursor → spring-wrapped `x`/`y` motion values
- Count-up / progress → `animate()` + `useTransform` + `useInView`
- Enter/exit, stacks, toasts → `AnimatePresence` (+ `mode="popLayout"`/`layout`)
- Looping (marquee, shimmer, aurora) → `animate` prop with `repeat: Infinity`

Tune springs like the library does: snappy interactions use
`{ stiffness: 220–300, damping: 15–20 }`; soft settles use lower stiffness.

### 4. Register it in the orea registry

Add the component to `components/library/registry.tsx`. This is the step that
makes it show up on the site. Follow `references/registry-workflow.md` exactly:

1. Add the `import { PascalName } from "./kebab-name"`.
2. Append an `Entry` object to the `registry` array with `id`, `title`,
   `description`, `Component`, and a `code` template string.
3. The `code` string must be a faithful, standalone copy of the component's
   source (this is what users copy). Escape backticks and `${...}` as
   `\`` and `\${...}` inside the template literal.
4. Set `span: 2 | 3` only for wide demos (chat, command palette, marquee) and
   `pro: true` only if explicitly requested.

### 5. Verify

- The component compiles and renders centered in the preview tile.
- Toggling the card's code view shows source that matches the file.
- Motion runs at 60fps and settles (no perpetual repaint unless intentional).
- Reduced-motion users get a calm, non-jarring experience.

## Quality bar / self-check

Before declaring done, confirm every item:

- [ ] `"use client"` + single named export + zero required props
- [ ] Renders a complete, self-explanatory demo at preview size
- [ ] Dark palette + one accent, matches `design-tokens.md`
- [ ] Motion uses the library's Framer Motion patterns and spring feel
- [ ] Keyboard + ARIA for anything interactive
- [ ] `prefers-reduced-motion` respected for decorative motion
- [ ] Cleaned up all effects/timers/animation controls
- [ ] Registered in `registry.tsx` with a matching `code` string

## Reference files

- `references/design-tokens.md` — colors, radii, spacing, typography, preview sizing
- `references/animation-patterns.md` — copy-ready Framer Motion recipes
- `references/registry-workflow.md` — exact steps + `code` escaping rules
- `examples/component-template.tsx` — starting scaffold
