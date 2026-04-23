# AAAgario

A single-player browser arcade prototype inspired by the readable growth loop of Agar.io and the short-session object routing of Hole.io.

## Two Game Ideas

1. **Cell Rush: Neon Petri City**  
   The implemented prototype. You are a living cell moving through a clean line-art arena. Eat pellets, absorb smaller AI cells, and unlock larger city-like objects as you grow. Rounds last 3, 5, or 10 minutes, with a focus on fast starts, smooth pointer movement, and readable risk.

2. **Gravity Bloom: Living Hole Garden**  
   A calmer variant where the player is a soft gravitational bloom that pulls in tiny objects automatically when nearby. The AAA feeling would come from layered animation, object chains, and satisfying collapses instead of heavy controls: move, route, collect, and trigger short environmental cascades.

## Design Notes

- **Agar.io loop:** start tiny, collect pellets, eat smaller rivals, avoid larger rivals, grow slower as mass increases.
- **Hole.io loop:** short timed runs, growth thresholds unlock bigger world objects, optimal routing matters.
- **Browser performance:** a single canvas, viewport culling, respawned object pools, simple vector drawing, no database, no network calls after load.
- **Controls:** drag or point anywhere on desktop/mobile; WASD and arrow keys also work. Movement is velocity based, so it feels smooth instead of twitchy.
- **UI:** thin line-art HUD, large touch targets, minimal menus, no clutter once play begins.

## Run With Docker

```powershell
docker compose up --build
```

Then open:

```text
http://localhost:8080
```

## Files

- `index.html` - SPA shell.
- `src/styles.css` - responsive line-art UI.
- `src/main.js` - game simulation, rendering, controls, AI, and state.
- `Dockerfile` - static nginx image.
- `nginx.conf` - SPA-friendly static server config.
