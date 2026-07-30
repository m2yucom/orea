# Design tokens & visual language

The orea look is **dark, quiet, and premium**: near-black neutral surfaces, hair-thin
light borders, soft rounding, and a single cool accent. Copy these exact values so new
components look native.

## Color palette

Use Tailwind neutral + white-alpha, with a single blue accent. Never introduce a second
strong hue (no purple/violet, no rainbow) unless the user explicitly asks.

| Role | Classes | Notes |
| --- | --- | --- |
| Page / deep surface | `bg-neutral-950`, `bg-background` | Behind everything |
| Card / raised surface | `bg-neutral-900`, `bg-card/60` | Component body |
| Gradient surface | `bg-gradient-to-br from-neutral-800 to-neutral-900` | Tilt/spotlight cards |
| Border (default) | `border border-white/10` | Hairline separation |
| Border (faint) | `border-white/[0.06]` | Card outer frame |
| Primary text | `text-neutral-50`, `text-neutral-100` | Headings / values |
| Secondary text | `text-neutral-400` | Descriptions |
| Muted text | `text-neutral-500` | Labels / captions |
| Accent | `text-blue-400`, `bg-blue-500`, `bg-blue-500/20` | One accent only |
| Inverted button | `bg-white text-neutral-900` | High-contrast CTA |
| Positive | `text-green-400` | Success / confirm |

Glare / highlight overlays use raw white alpha inside gradients, e.g.
`rgba(255,255,255,0.28)` fading to `transparent`.

## Radius

Rounded and soft. Match by element size:

- Small controls (icon buttons, chips): `rounded-lg` / `rounded-md`
- Inputs / inner panels: `rounded-xl` / `rounded-2xl`
- Component bodies / cards: `rounded-2xl`
- Outer frames / large surfaces: `rounded-3xl`
- Pills / fully round CTAs: `rounded-full`

## Typography

Font is Geist (sans) / Geist Mono (mono), applied via `font-sans` / `font-mono`.

- Big value / hero number: `text-4xl font-bold tracking-tight` (`tabular-nums` for numbers)
- Section heading: `text-2xl sm:text-3xl font-semibold tracking-tight`
- Card title: `text-sm font-medium text-neutral-100`
- Body / description: `text-sm leading-relaxed text-neutral-400`
- Label / caption: `text-xs` or `text-[11px]` `text-neutral-500`
- Code: `font-mono text-[11px] leading-relaxed`

Use `text-balance` on headings and `text-pretty` on paragraphs.

## Spacing & layout

- Use the Tailwind scale (`p-2`, `p-4`, `p-5`, `gap-1`, `gap-3`, `gap-5`) — avoid arbitrary px.
- Use flexbox for most layouts (`flex items-center justify-center`), grid only for 2D.
- Use `gap-*` for spacing between siblings; never mix margin + gap on one element.

## Preview sizing (critical)

Each component is shown inside a `h-64` tile, centered. Size the demo so it looks
intentional and doesn't overflow:

- Card-like demos: `h-44 w-72` (the canonical tile card size)
- Buttons / toggles / chips: intrinsic size, centered
- Text demos: constrain width (`max-w-xs`) and center
- Wide/rich demos (chat, command palette, marquee): design for a 2- or 3-column
  span and set `span: 2` or `span: 3` in the registry entry
- Never render full-width page sections or anything taller than the tile

## Iconography

- Use `lucide-react` icons only. Sizes `h-4 w-4` (16) or `h-5 w-5` (20).
- Never use emoji as icons.
- Keep icons monochrome, tinted with the text/accent tokens above.
