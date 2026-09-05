# Playtrix

Playtrix is a calm, local-first digital personal organiser for capturing commitments, organising tasks and projects, keeping waiting items and ideas visible, and reviewing what matters without turning everything into a task.

## Current product model

- **Today** — a bounded daily focus with an explicit “Enough for today” stopping condition.
- **Tasks** — first-class actionable commitments.
- **Projects** — outcomes kept separate from individual tasks.
- **Waiting** — dependencies that are not actionable yet.
- **Not Yet** — possibilities without obligation.
- **Tools** — a user-created directory of useful links.
- **Review** — a simple weekly clarity check.
- **Settings** — JSON export/import and local reset.

## Privacy and data

Playtrix v2 is local-first. Organiser data is stored in the browser using `localStorage` and is not synchronised to a Playtrix cloud service. Browser storage is convenient persistence, not a secure vault or guaranteed backup. Use **Settings → Export backup** before clearing browser data or moving device.

The public repository must contain no real user's private operational data, credentials, personal task records or private workspace identifiers. The organiser starts empty rather than shipping real-user examples.

## Files

- `index.html` — current secular application shell.
- `recovery.js` — current v2 local data model and organiser behaviour.
- `styles.css` — responsive visual system.
- `.github/workflows/deploy-pages.yml` — GitHub Pages deployment workflow.

The obsolete `app.js` prototype was removed from the current branch because it contained historic personal seed data and religious prototype content. Historical provenance remains available through Git version history and controlled project records.

## Product boundary

The current version does not claim cloud sync, accounts, encrypted storage, automatic backup, AI assistance or market validation.