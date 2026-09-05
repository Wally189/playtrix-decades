# Playtrix

Playtrix is a calm browser-local personal organiser for capturing commitments, organising tasks and projects, keeping waiting items and ideas visible, storing reference notes, and deciding what is enough for today.

## Current product model

- **Today** — bounded daily focus with an explicit **Enough for today** stopping condition and deliberate end-of-day disposition.
- **Inbox** — unprocessed captures that can be clarified later.
- **Tasks** — actionable commitments with optional project, due date and review date.
- **Projects** — outcomes with purpose, current position, next action, dependencies, review trigger and **Enough for now**.
- **Waiting** — dependencies with optional project and follow-up/review dates.
- **Notes** — retrievable reference information that is not an action.
- **Not Yet** — possibilities without obligation, including promotion to task/project when deliberately chosen.
- **Tools** — a user-created directory of http/https links.
- **Review** — a weekly clarity check that surfaces unprocessed, stale or incomplete states.
- **Settings** — version information plus JSON export/import and local reset.

## Privacy and data

Playtrix stores organiser data in the browser using `localStorage`. It does **not** currently provide a Playtrix cloud account, cross-device sync, encrypted vault storage or guaranteed backup. Clearing browser/site data can remove organiser data. Use **Settings → Export backup** before clearing browser data or changing device.

The application validates current backups before import, limits import size, and can migrate the previous `playtrix.organiser.v2` data model into the current v3 model. It does not automatically import older prototype storage keys because those earlier prototypes contained owner-specific fixture data that cannot be reliably distinguished from genuine user-created content.

The public current branch must contain no real user's private operational data, credentials, personal task records or private workspace identifiers. The organiser starts empty.

## Files

- `index.html` — current secular application shell.
- `recovery.js` — current v3 browser-local data model and organiser behaviour.
- `styles.css` — responsive and keyboard-focus visual system.
- `.github/workflows/deploy-pages.yml` — GitHub Pages deployment workflow.

The obsolete personalised prototype is not part of current `main`. Git history remains historical provenance and is not the current product runtime.

## Product boundary

The current build does not claim market validation, productivity or wellbeing outcomes, cloud sync, accounts, automatic remote backup, AI assistance, collaboration or enterprise workflow functionality.
