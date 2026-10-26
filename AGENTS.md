# Theme Template Agent Guide

## Overview

This repository contains a child theme for the WordPress **Hello Elementor** parent theme. The child theme provides opinionated asset bundling (Webpack + Sass + Babel) and a handful of front-end enhancements (scroll indicator, header behaviour, dark mode toggles, etc.). PHP glue code in `functions.php` enqueues compiled assets and exposes a couple of utility shortcodes / filters.

## Getting Around

- `functions.php` – WordPress hooks for enqueueing assets, utility shortcodes, MIME tweaks, and body class helpers.
- `style.css` – Required WordPress theme header metadata; the actual styles come from the compiled bundle.
- `assets/` – Source files for the build pipeline.
  - `sass/` – Sass entry points organised by `base`, `layout`, `components`, `vendors`, and `pages` namespaces (imported via `main.scss`).
  - `js/` – ES module entry point (`index.js`) that pulls in global behaviours from `global/` and triggers Sass compilation.
  - `dist/` – Compiled production assets output by Webpack.
  - `fonts/`, `vendor/` – Static assets copied or referenced by the build.
- `webpack.config.js` + `package.json` – Build pipeline configuration and available npm scripts.

## Typical Tasks

1. **Install dependencies**: `npm install`
2. **Start a development build**: `npm run webpack`
3. **Create a production build**: `npm run build`

## Coding Guidelines

- Keep PHP additions lightweight—prefer hooking into existing WordPress filters/actions rather than modifying parent theme files.
- Update `assets/js/index.js` and `assets/sass/main.scss` when introducing new global behaviours or styles so they are included in the bundle.
- When adding page-specific assets, ensure `assets/dist` contains matching `css/<slug>.css` and optional `js/<slug>.js` files; `child_enqueue()` auto-loads them based on the WordPress page slug.
- Defer non-critical scripts by default; only add handles to the `$deny_prefixes` list in `functions.php` when a script must remain synchronous.
- Use the `eventRegistry` helpers for scroll/resize/load listeners to avoid jank.

## Next Steps for Agents

If you are here to extend or audit the theme:

- Review `functions.php` for enqueue logic and performance hooks before altering asset structure.
- Inspect `assets/js/global/functions/` to understand current UX behaviour modules.
- Coordinate Sass structure updates with the module imports in `assets/sass/main.scss`.
- Run `npm run build` before committing to keep `assets/dist/` in sync with source changes.
- There is no test for this topic, the `npm run test` command returns nothing, so there is no point in doing it.

When in doubt, prefer composable, documented additions so future agents can follow along quickly.
