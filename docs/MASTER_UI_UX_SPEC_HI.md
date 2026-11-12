# UPS INFINITY — Master UI/UX Specification
Developer credit: **Developed by Umesh Prakash Singh**

## Product design principles
- Mobile-first, responsive, keyboard-accessible, low-clutter production workspace.
- Keep creator controls visible; advanced controls progressively disclosed.
- Never communicate a provider feature as available unless its backend capability is configured and health-checked.
- AUTO recommends and fills; MANUAL exposes every supported control; HYBRID preserves user inputs and suggests only missing values.
- User must be able to review and approve before irreversible actions, paid generation, publishing, deletion or export.

## Colour system
- Background: `#080D18`
- Sidebar: `#070D18`
- Main panel: `#101A2B`
- Raised panel: `#142139`
- Primary accent: `#55D9E8`
- Secondary accent: `#688CFF`
- Premium highlight: `#F2C66D`
- Success: `#61D6A4`
- Main text: `#EDF4FF`
- Muted text: `#93A4BD`
Use semantic colors consistently; do not rely on color alone to communicate state.

## Typography scale
- Micro-label / eyebrow: 11–12px; never use for essential instructions.
- Secondary/helper: 12–13px.
- Body and form labels: 14–16px.
- Inputs: minimum 16px to prevent mobile browser zoom.
- Buttons/navigation: 13–15px, minimum 44px touch height.
- Card headings: 18–22px.
- Page headings: 26–36px using responsive clamp.
- Hindi: Noto Sans Devanagari; Latin: Inter with system fallback.
Essential text must remain readable at 200% zoom and on 320px-wide screens.

## Animation policy
- Animate only state changes, progress, focus, navigation and meaningful previews.
- Avoid continuously animated text, flashing, auto-scrolling or distracting decorative loops.
- Respect `prefers-reduced-motion`.
- Never animate critical legal, pricing, safety, status or long-form reading text.
- Use short transitions (120–220ms) for interface feedback; progress animation must have a textual status.
- Provide pause/stop for any long-running preview or playback.

## Mobile layout
- One-column forms below 640px.
- Cards collapse to one column at 420px where content requires it.
- Sidebar becomes an accessible drawer with close control and focus management.
- Primary actions full-width on narrow screens.
- No horizontal overflow; controls retain 44px target height.
- Preserve safe areas and do not place controls behind system navigation.

## Desktop layout
- Persistent sidebar; main workspace max width around 1700px.
- Use 2–4 column grids only when content remains readable.
- Keep primary action and project status visible without hiding the working canvas.

## Card types
1. Status card: current state, last updated, action.
2. Engine card: capability, readiness, provider requirement.
3. Project card: thumbnail, title, type, last modified, status.
4. Workflow step card: input, output, validation, approval.
5. QA card: test name, PASS/FAIL/NOT TESTED, evidence, timestamp.
6. Provider card: provider, connection state, quota/latency, credential status (never reveal secret).
7. Timeline/scene card: timecode, assets, continuity references, approval.

## UX states required for every async action
Idle → Loading → Success / Partial / Error / Cancelled. Include retry guidance and never show false success.
