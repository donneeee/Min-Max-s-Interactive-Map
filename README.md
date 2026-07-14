# MinMax's Map

Interactive static map for Aniimo world markers.

Version: `v0.3.22`

## What Is Included

- Separate map scenes for Idyll, Whisperwake Isles, Astra, and The Lost Islets.
- Filterable marker layers for items, Aniimo, eggs, teleports, ambers, and misc markers.
- A small startup manifest at `data/map_site_data.json`, with marker data loaded per map from `data/maps/`.
- WebP map previews for first paint and GPU-safe detail tiles for zoomed-in views.
- Static assets under `assets/`, so the site can be hosted without a build step.
- Discord-synced respawn tracking for verified overworld collectible nodes.

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

## Discord Sync Setup

The map and filters work without a backend. Tracking is disabled until Discord
sync is configured through Supabase.

1. Create a Supabase project and run
   `supabase/migrations/20260714_discord_sync.sql` in its SQL editor.
2. In Supabase Authentication, enable the Discord provider and add the Discord
   application credentials there. Do not put the Discord client secret in this
   repository.
3. In the Discord Developer Portal, add the Supabase callback URL shown in the
   Discord provider setup, usually `https://<project-ref>.supabase.co/auth/v1/callback`.
4. Add the deployed map URL, such as `https://minmax.aniimo.io/`, to the
   Supabase Auth redirect URL allow list.
5. Fill in `app-config.js` with the Supabase project URL and publishable key.
   The key is intended for browser use; row-level security in the included
   migration protects each account's rows.

`app-config.local.js` and `.env` files are ignored so local credentials and
development settings cannot be committed accidentally.

## Coordinate Convention

- Website `x` = scene position axis `1`.
- Website `y` = scene position axis `3`.
- Scene position axis `2` is exported as `height_y`.
