# Prathveesh Naik — Portfolio

A hero-driven personal portfolio with a light, minimal, antigravity-inspired aesthetic.
Built with plain **HTML + CSS + vanilla JS** — no build step, no dependencies.

## Features
- Animated hero (staggered title reveal, drifting gradient blobs, grid overlay)
- Scroll-reveal sections via `IntersectionObserver`
- Magnetic buttons, cursor-follow glow, scroll-progress bar, sticky nav
- Fully responsive + respects `prefers-reduced-motion`
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (labels)

## Structure
```
index.html        # all content + markup
css/styles.css    # design tokens + layout + animations
js/main.js        # interactions
assets/           # profile.jpg (your headshot), favicon, etc.
.nojekyll         # disables Jekyll on GitHub Pages
```

## Add your photo
Drop a square headshot at `assets/profile.jpg`. Until then a gradient "PN" placeholder shows automatically.

## Run locally
```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages
This site is best hosted at your user repo so it serves at the root URL:

```bash
git init
git add -A
git commit -m "Portfolio site"
git branch -M main
# create the repo (named <username>.github.io to serve at the root):
gh repo create prathvikricks.github.io --public --source=. --remote=origin --push
```

Then: **Repo → Settings → Pages → Source: Deploy from a branch → `main` / `root`.**

Live at: `https://prathvikricks.github.io/`

> If `prathvikricks.github.io` already exists, create a repo named `portfolio` instead — it'll serve at `https://prathvikricks.github.io/portfolio/`.

## Editing content
All text lives in `index.html`. Update sections directly; colors and fonts are CSS variables at the top of `css/styles.css`.
