# Repository Guidelines

## Project Structure & Module Organization
- `module.json`: Foundry manifest (id `playerStatus`), versioning, deps.
- `scripts/`: ES modules loaded by Foundry (`playerstatus.js`, `afkStatus.mjs`, `writtingStatus.mjs`).
- `languages/`: i18n resources (`en.json`, `de.json`, `fr.json`).
- `img/`: module assets (e.g., `afk_icon.webp`).
- `.github/`: CI and release automation (if any).

## Build, Test, and Development Commands
- Build: none. Code ships as plain ES modules referenced in `module.json`.
- Run locally: symlink or copy this folder into your Foundry `Data/modules/playerStatus`, then start Foundry and enable the module.
  - Example (Linux/macOS): `ln -s $(pwd) ~/FoundryVTT/Data/modules/playerStatus`
- Packaging: bump `version` in `module.json` and create a zip of the repo root for release. Ensure `manifest` and `download` URLs point to the new tag.

## Coding Style & Naming Conventions
- JavaScript (ESM): use `const`/`let`, trailing semicolons, 4‑space indent.
- File/class naming: PascalCase classes (`AfkStatus`, `WrittingStatus`), kebab/flat file names as in `scripts/`.
- Settings and keys: keep `static moduleName = "playerStatus"` and existing key names (`afk`, `typing`).
- Localization: add keys to all files in `languages/`. Prefer concise keys like `PLAYER-STATUS.afk.*`.

## Testing Guidelines
- Manual verification in Foundry VTT (compat: min 10, verified 12.331).
  - Enable dependency `playerListStatus` (required in `module.json`).
  - Validate: AFK toggle button, `/afk [reason]` and `/back` chat commands, typing indicator timeout and icon position.
- No automated tests in repo; keep changes small and test across GM/player users.

## Commit & Pull Request Guidelines
- Commits: short imperative subject; reference issues/PRs when relevant (e.g., `[#59] Verify for 12.331`).
- PRs: include summary, linked issue, steps to reproduce/verify, and screenshots/GIFs of UI changes (player list icons, chat behavior).
- Versioning: update `module.json` version and compatibility fields as part of release PRs.
- Internationalization: update all `languages/*.json` and note additions in PR description.

## Security & Configuration Tips
- Avoid direct DOM selectors outside Foundry elements used here (e.g., `#chat-message`).
- Respect user/world scope for settings; default to non‑destructive behavior.
