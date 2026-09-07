# Moeen Sultan, Portfolio (v5)

A static site (plain HTML/CSS/JS, no build step). Files:

- `index.html` all page content
- `styles.css` all styling
- `script.js` hero + banner 3D animation, scroll reveals, stat counters, card tilt, mobile nav
- `assets/case-studies/` the 12 themed case-study photos (see below)
- `assets/headshot-cutout.png` and `assets/headshot.jpg` your real photo, included in this version

## What changed in this pass

- **Off The Clock section removed** entirely, per your request.
- **More 3D**: the tilt effect (mouse-driven perspective tilt) now also applies to the At a Glance stats, the How I Work pillars, every Stack tool badge, and the Perspective notes — not just the case-study cards. The CTA banner ("Let's build a growth engine worth keeping") also got its own lightweight drifting-particle background, a lighter sibling to the hero's particle network.
- **Tool logos fixed**: Databox, VWO, Microsoft Clarity, GoHighLevel, and Ubersuggest weren't on Simple Icons' library, so they were falling back to plain initial badges. They now pull their real logos from Clearbit's public logo API, with the same initial-badge fallback if that ever fails to load.
- **Font**: swapped in General Sans (via Fontshare) for headings, plus uppercase + tight tracking on the major section headings, to get closer to the look on `cosmoinc.co`. I couldn't pull the exact typeface Ahmad's site ships — a plain fetch of that page doesn't expose the CSS/font files, only the content — so this is a close visual match rather than a byte-for-byte one. If you (or he) can check DevTools → Computed → font-family on that site, send me the name and I'll swap it in exactly.
- **Perspective section**: all 6 notes now have a body paragraph under the heading, not just the heading.
- **Contact section**: rebuilt to match the "Let's talk" layout you sent — label / value / arrow rows with dividers, for Email, LinkedIn, Instagram, and WhatsApp.
- **Case study photos**: all 12 cards now have a themed photo banner (previously just a small icon on a plain gradient). Photos came from what you sent, matched by industry:
  - Real Estate → aerial neighborhood shot
  - SaaS (land-intelligence platform) → the site-qualification map screenshot (this one's a literal match — it reads like an actual land-intelligence dashboard)
  - Mental Health Clinic → the therapy-session photo
  - Men's Healthcare Clinic → the couple photo
  - Fitness Pre-Sale → the gym couple (squats/high-five)
  - Staffing Marketplace → the bartender photo (hospitality staffing is a common niche for these marketplaces)
  - Ecommerce, 5 Countries (outdoor-living brand) → the patio umbrella shot
  - Salon Chain → the barbershop photo
  - Florist → the flower shop storefront
  - Ecommerce (Food, honey brand) → the dark moody honey-jar shot
  - Ecommerce (Apparel, hat brand) → the vintage hat-shop flatlay
  - Skincare → the cosmetics-bottles-in-greenery shot

  Each photo was desaturated, darkened, and tinted with that card's accent color (amber/cyan/violet/rose) so they read as part of the dark theme rather than bright stock photos dropped on top of it — this is what generated the files in `assets/case-studies/`. A few of the images you sent went unused where another one fit its card better or was simply the stronger shot (e.g., there were three gym photos and two honey photos — I picked one of each). Let me know if you'd rather swap any of the picks.

- **Fixed a real bug while in there**: icons were silently disappearing (rendering at zero width) anywhere they sat inside a flex-centered container — that's why "Let's talk →" next to Selected Work never showed its arrow, and it would have hit the new case-card badges and contact arrows too. One-line CSS fix (`flex-shrink: 0` on `.icon`), now works everywhere.

## Things to still swap in

- **Perspective section** — the 6 notes now have real placeholder-free body copy in your voice, but they're still written by me standing in for you. Swap in your real takes whenever you want.
- **Custom domain** — add under Vercel's Project → Settings → Domains, once deployed.

## Deploy to Vercel (easiest way, no GitHub needed)

1. Go to https://vercel.com and log in.
2. Click "Add New" then "Project".
3. Choose "Deploy without Git" and drag this whole folder in (after adding your headshot files back).
4. Vercel auto-detects it as a static site, click "Deploy".
5. You'll get a live URL in under a minute.

## Deploy via GitHub

1. Create a new GitHub repo, push these files to it.
2. In Vercel, "Add New" then "Project" then "Import Git Repository", select the repo.
3. Leave build settings as default, click "Deploy".
4. Every future push auto-redeploys.

## Deploy via Vercel CLI

```
npm i -g vercel
cd portfolio
vercel
```
