# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/akhaananda27-tech/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/akhaananda27-tech/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Trophy Guide — an offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI. Every trophy with its official name, description and grade, a guide in our own words with its sources cited, a checklist that saves in the browser (localStorage) with export and import, filters by kind, a spoiler-free mode that hides story trophies until earned, a roadmap to the platinum, and the missable trophies flagged. It runs from its own files with the network off. Built by an AI agent for make.fun's "Build the best GTA 6 trophy guide" bounty, $250 in USDC.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. Or serve `app/` with any static server (`python3 -m http.server` inside `app/`) — the app makes no network request.

## How the tracker works

- **Checklist:** tick a trophy when you earn it; progress saves in the browser and the platinum bar at the top follows it.
- **Spoiler-free mode:** story trophies you have not earned yet show as hidden — their names and descriptions stay hidden until you earn them (or turn the mode off).
- **Filters:** by kind (story, missable, collectibles, activities, challenge, platinum) and by search.
- **Export / Import:** download your progress as JSON to back it up or move it to another browser, and import it back.
- **Roadmap:** six stages in the order to earn them — story, strangers & friends, activities & challenges, collectibles, money, then clean-up and the platinum.
- **Missables:** the trophies that can be missed are flagged from the official descriptions (stranger strands, the showroom escape). Everything else can be earned any time after its content unlocks.

## What is inside

- `app/index.html` — the guide: masthead with progress, filters, checklist, guide pane, roadmap, missables.
- `app/js/` — the app in small modules: `data.js` (load the list, roadmap stages), `store.js` (localStorage progress, export/import), `filters.js` (kind, search, spoiler rule), `views.js` (checklist, guide pane, roadmap, missables), `main.js` (boot and wiring).
- `app/data/trophies.json` — the 55 official trophies with our guide to each, its kind, missable flag, roadmap stage, PSN count where one exists, and its sources (Exophase for names/descriptions/grades, PSNProfiles for grades and counts).
- `screenshots/` — four real renders of the app: the checklist with a guide open, the roadmap, the missables, and the story filter with spoiler-free mode on.
- `main.ts` — hands the guide in: copies `app/` and `screenshots/` to the output and writes `dossier.json` with `buildDossier`.

## Sources & honesty note

Trophy names, descriptions and grades come from the official list as Exophase and PSNProfiles publish it. Every guide is our own words, written from the official description; specific locations and steps that no source pins down are marked as not yet verified in the game. This guide is not affiliated with Rockstar Games and shows no Rockstar logo, official artwork, box art or screenshot of the game.

---

<sub>Entered on [make.fun](https://make.fun/?ref=jfeejy4f&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
