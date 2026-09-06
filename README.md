# Moeen Sultan — Portfolio

A static site (plain HTML/CSS/JS, no build step). Files:

- `index.html` — all page content
- `styles.css` — all styling
- `script.js` — mobile nav + stat count-up animation
- `assets/headshot.jpg` — your photo

## Deploy to Vercel (easiest way, no GitHub needed)

1. Go to https://vercel.com and log in (or create a free account).
2. Click **Add New → Project**.
3. Choose **"Deploy without Git"** / drag-and-drop, and drag this whole folder in.
4. Vercel auto-detects it as a static site — click **Deploy**.
5. You'll get a live URL like `moeen-sultan.vercel.app` in under a minute.

## Deploy via GitHub (better for future updates)

1. Create a new GitHub repo, push these files to it.
2. In Vercel, **Add New → Project → Import Git Repository**, select the repo.
3. Leave build settings as default (no framework, no build command) — click **Deploy**.
4. Every future `git push` auto-redeploys.

## Deploy via Vercel CLI

```
npm i -g vercel
cd portfolio
vercel
```
Follow the prompts — it deploys the current folder as-is.

## What changed in this version

- Full rebuild following Ahmad's structure section-for-section: Hero → My Take → At a Glance → Selected Work → How I Work → CTA banner → About → Off The Clock → Stack → Perspective → Contact.
- 12 anonymized case studies now (added the 4 new ecommerce ones), each with its own vector icon.
- 3D particle-network animation in the hero (Three.js, loaded from a CDN — needs internet to render, which is fine once it's live on Vercel).
- Scroll-reveal animations throughout, plus a subtle 3D tilt on the case study cards when you hover them.
- Stats updated: $250K/mo, $15M+ total spend, 50+ brands, USA/Australia/Canada/UK called out by name, no "available for remote/international" line anywhere.
- Photo: I used your original high-res upload (not the second, lower-res crop) and zoomed it in with CSS — that keeps it sharp. If you'd rather I use the exact second image, say so and I'll swap it in, just know it'll look softer since it was a smaller file.

## Things to swap in later

- **Perspective section** — 6 placeholder titles, same as Ahmad's format. Replace with real posts whenever you write them.
- **Off The Clock section** — 6 empty gradient tiles as placeholders. Swap in real personal photos whenever you have them (this mirrors Ahmad's photo-dump section, which needs real photos to work).
- **Custom domain** — once deployed, add your own domain under Vercel's Project → Settings → Domains.
