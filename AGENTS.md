# Chhelebela Score - rules for coding agents

## What this is

A Bangla-first, mobile-first tick-and-score nostalgia web app about Bangladeshi 90s/2000s childhood. Free hosting on Vercel. No backend, no login, no database.

## Stack (add no dependency unless a task allows it; vitest is already allowed)

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 (CSS-first: tokens are in the `@theme` block of `src/app/globals.css`, there is no tailwind.config), motion (import from `"motion/react"`), canvas-confetti and html-to-image (installed). Alias `@/*` maps to `src/*`.

## Existing code (read before editing)

- `src/app/layout.tsx`: html `lang="bn"`, fonts Hind Siliguri (`--font-hind`) and Baloo Da 2 (`--font-baloo`).
- `src/app/page.tsx`: finished landing page, client component inside `MotionConfig reducedMotion="user"`. Its CTA links to `/quiz`. Never change its look.
- `src/app/globals.css`: colour tokens night, paper, hotpink, parrot, marigold, teal, vermilion, purple, orange; font-display = Baloo; classes `.paper`, `.sticker-cut`, `.tv-glare`, `.tv-scan`.
- `src/components/shared/`: TvFrame (props children, channel, delay; HTML screen over an SVG TV; two real `<button>` knobs, channel and volume; different SVG on mobile and on md+), StickerButton (children, tone, onClick, href, className), Objects (Sticker, Cassette, EidCard, Marbles), RickshawArch (RickshawArch, PetalBand), ColorBars.
- `src/data/items.ts`, `src/lib/scoring.ts`, `src/lib/storage.ts`: finished logic layer with tests. Treat it as the single source of truth for scoring. Never duplicate scoring logic in components.
- `src/app/quiz/page.tsx`: placeholder until the quiz is built.

## Visual language

Cream paper background, navy text, 3-4px navy outlines, hard offset shadows such as `shadow-[6px_6px_0_#15152d]`, rickshaw colours as accents, Baloo for headings. New screens must look like the landing page. No new fonts.

## Hard rules

1. Do not change the landing page's appearance.
2. All user-facing text is Bangla with Bangla digits (০-৯), except the landing subtitle `"A journey through our childhood memories."`, the `"CH"` TV label, and the brand names `"WhatsApp"` and `"Facebook"`.
3. Never read localStorage during render; read it in an effect after mount.
4. Respect reduced motion (skip confetti and count-up animations when the user prefers it).
5. Files with hooks, motion or browser APIs start with `"use client"`. A route that needs Next metadata is a server component that renders a client component.
6. Typed code, no `any`, small files, nothing outside the task.
7. Before finishing any task run: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build` and show the output.
8. Start every task by reading the relevant files and giving a plan of at most 15 lines.
9. Out of scope for the first launch: login, database, leaderboard, multiplayer, result image generation, analytics, AI-generated questions.

## Product amendments (binding; they WIN over any task text that conflicts)

1. **Scoring meaning.** Each item is yes, skip or untouched. The denominator is every item in the DONE channels except skipped ones; untouched items count as "not experienced". Example: 10 items, 4 yes, 2 skip, 4 untouched gives 4/8 = 50%.
2. **Skip wording.** The skip control and the skipped-card label are both `"প্রযোজ্য নয়"`. This REPLACES `"আমার ছিল না"` and `"বাদ"` wherever an older prompt uses them.
3. **Instruction line shown above the cards of every channel, exactly:** `"যেগুলো তোমার সঙ্গে মেলে, টিক দাও। বাদ দিতে চাইলে 'প্রযোজ্য নয়' নির্বাচন করো।"` Also show a small note under it: `"টিক না দিলে সেটা 'ছিল না' হিসেবে ধরা হবে।"`
4. **Finishing a channel** (the `"পরের চ্যানেল"` button, or finishing the last channel). If any item in that channel is untouched, first show an in-app dialog (not `window.confirm`): it is styled like the app, traps focus, closes with Escape, and sits above the sticky bar. It says, with Bangla digits:
   - `"তুমি {yes}টি স্মৃতিতে টিক দিয়েছ।"`
   - `"আরও {untouched}টি প্রশ্নের উত্তর দেওয়া হয়নি।"`
   - `"এভাবেই শেষ করবে?"`
   Buttons: `"আরও দেখি"` (stay and move focus to the first untouched card) and `"হ্যাঁ, শেষ করো"` (mark the channel done and continue). If nothing is untouched, skip the dialog. Re-opening a done channel keeps it done.
5. **TV knob.** The channel knob in `TvFrame` is already a real `<button>` with an aria-label. Keep it that way (no click handlers on the SVG). Add an optional `onChannelKnob` prop, make the accessible name include the current channel (for example `"চ্যানেল বদলাও, এখন চ্যানেল ০২"`), keep native Enter/Space activation, the visible focus ring and the spin animation. The TV must look identical.
6. **Mobile sticky action bar.** It is fixed or sticky at the bottom only below the md breakpoint, with a paper background and a top border. The page content gets bottom padding of at least the bar height plus 1rem so the last card is never hidden. Use `padding-bottom: max(0.75rem, env(safe-area-inset-bottom))` for gesture-navigation phones. From md upward the bar is part of the normal flow, not sticky.
7. **Era.** `eraNeutral` items count only toward the overall and per-channel scores. The result screen shows the era chip only when an era label exists, with this note next to it: `"এটা মজার তুলনা - তোমার জন্মসাল প্রমাণ করে না।"` Always show the disclaimer `"এটা শুধুই মজার স্কোর - কোনো বৈজ্ঞানিক পরীক্ষা নয়।"` on the result.
8. **layout.tsx.** Do not change it, with one exception: the metadata task may edit ONLY the exported `metadata` object (add metadataBase, openGraph, twitter). Never touch the fonts, the html lang or the body.
9. Cards never show era or setting labels.
10. Storage keeps key `"chhelebela-score:v1"`. Only bump the version if the stored shape changes, and then write a migration.
11. **Bangla integrity:** never rewrite or retype an existing Bangla string; copy it exactly. After editing any file with Bangla text, run the Bangla audit again and report any string that looks different from before.
