# MinMax's Map

Interactive static map for Aniimo world markers.

Version: `v0.3.20`

## What Is Included

- Separate map scenes for Idyll, Whisperwake Isles, Astra, and The Lost Islets.
- Filterable marker layers for items, Aniimo, eggs, teleports, ambers, and misc markers.
- A small startup manifest at `data/map_site_data.json`, with marker data loaded per map from `data/maps/`.
- WebP map previews for first paint and GPU-safe detail tiles for zoomed-in views.
- Static assets under `assets/`, so the site can be hosted without a build step.

## Run Locally

From this folder:

```powershell
python -m http.server 5173
```

Then open:

```text
http://127.0.0.1:5173/
```

## Deploy To GitHub Pages

This folder is ready to be used as its own GitHub repository.

1. Push the repository to GitHub.
2. In the GitHub repository settings, enable Pages with `GitHub Actions` as the source.
3. Pushes to `main` will publish through `.github/workflows/deploy-pages.yml`.

## Coordinate Convention

- Website `x` = scene position axis `1`.
- Website `y` = scene position axis `3`.
- Scene position axis `2` is exported as `height_y`.
