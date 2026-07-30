# Registry workflow

A component only appears on the orea site once it is registered in
`components/library/registry.tsx`. Every entry has two representations that MUST
stay in sync:

1. The real imported component (rendered in the preview tile).
2. A `code` string (the source users copy when they flip the card).

## The Entry type

```ts
export type Entry = {
  id: string          // kebab-case, unique, used as React key
  title: string       // short label, e.g. "3D tilt"
  description: string // one-line, e.g. "3D pointer tilt with cursor glare"
  pro?: boolean        // adds a "Pro" badge — only if explicitly requested
  span?: 2 | 3         // wide tiles for rich demos; omit for normal 1-col
  Component: ComponentType
  code: string
}
```

## Steps to add a component

1. **Create the file** `components/library/<kebab-name>.tsx` with a single named
   export (see `examples/component-template.tsx`).

2. **Import it** at the top of `registry.tsx`, grouped with the other imports:
   ```ts
   import { PascalName } from "./kebab-name"
   ```

3. **Append an entry** to the `registry` array:
   ```ts
   {
     id: "kebab-name",
     title: "Short title",
     description: "One concise line describing the effect",
     Component: PascalName,
     code: `"use client"

   import { ... } from "framer-motion"

   export function PascalName() {
     // ...full standalone source...
   }`,
   },
   ```

4. **Keep `code` faithful.** The string should be a complete, paste-ready copy of
   the component source — same imports, same body. Users paste this directly into
   their project, so it must run on its own.

## Escaping inside the `code` template literal (important)

The `code` value is a JS template literal (backticks). Any backticks or `${...}`
that appear **inside the component source** must be escaped so they don't break
the outer literal:

- Literal backtick → `` \` ``
- Template interpolation used by the component → `\${...}`

Example (from the tilt card's `useMotionTemplate`):

```ts
code: `// ...
const glare = useMotionTemplate\`radial-gradient(circle at \${glareX}% \${glareY}%, rgba(255,255,255,0.28), transparent 55%)\`
// ...`
```

If the component contains no backticks/interpolation, no escaping is needed.

## Choosing span

- Default (omit `span`): compact demos — buttons, toggles, single cards, text.
- `span: 2`: medium-rich demos that need horizontal room (segmented control,
  carousel, search).
- `span: 3`: full-width rich demos (mock chat, command palette, marquee, aurora).

## After registering

- Confirm the import path and name match the file exactly.
- Confirm the preview renders centered and the flipped code view matches the file.
- Keep the array ordering sensible (group related components), but ordering is
  not functionally significant.
