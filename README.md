# Tools Proficiency 5e (`tools-proficiency-5e`)

Tools Proficiency 5e adds configurable custom tool proficiencies for the dnd5e system.

## What It Does

- Adds 5 world settings in **Configure Settings**:
  - Artisan's Tools (Custom)
  - Gaming Sets (Custom)
  - Musical Instruments (Custom)
  - Vehicles (Custom)
  - Other Tools (Custom)
- Each setting accepts a comma-separated list.
- Each value becomes a selectable tool proficiency on **character** sheets in the dnd5e Tools selector.
- Values in **Other Tools (Custom)** are grouped into dnd5e's existing **Other** tools section (with tools like Thieves' Tools and Disguise Kit).
- The module re-applies settings and refreshes open actor sheets when settings change.

## Default Ability Mapping

- `art` -> `int`
- `game` -> `wis`
- `music` -> `cha`
- `vehicle` -> `dex`
- `other` -> `int`

## Folder Paths

- Module source folder:
  - `/Users/nicholasmcdowell/Documents/Codex Projects/Tools Proficiency 5e`
- Foundry Data modules folder:
  - `/Users/nicholasmcdowell/Library/Application Support/FoundryVTT/Data/modules`

## Setup Steps

1. Ensure Foundry is installed at:
   - `/Applications/Foundry Virtual Tabletop.app`
2. Link this project folder into Foundry modules:

```bash
ln -sfn "/Users/nicholasmcdowell/Documents/Codex Projects/Tools Proficiency 5e" \
"/Users/nicholasmcdowell/Library/Application Support/FoundryVTT/Data/modules/tools-proficiency-5e"
```

Command explanation:
- `ln -sfn` creates or replaces a symbolic link (a filesystem shortcut).
- Risk: this replaces the existing link or folder at exactly `.../modules/tools-proficiency-5e`.

3. Start Foundry and open your dnd5e world.
4. Go to **Game Settings -> Manage Modules** and enable **Tools Proficiency 5e**.
5. Go to **Game Settings -> Configure Settings**, fill in any of the five comma-separated fields, then save.
6. Open a character sheet, open the tool proficiency configuration, and select your custom tools.

## GitHub Distribution

- Repository URL:
  - https://github.com/CaptainCurso/Tools-Proficiency-5e
- Manifest URL (for Foundry install):
  - https://raw.githubusercontent.com/CaptainCurso/Tools-Proficiency-5e/main/module.json
- Release ZIP URL (for Foundry install/update):
  - https://github.com/CaptainCurso/Tools-Proficiency-5e/releases/latest/download/tools-proficiency-5e.zip

### Release Steps

1. Ensure `module.json` version is updated.
2. Create a zip where `module.json` is at the root of the archive:

```bash
cd "/Users/nicholasmcdowell/Documents/Codex Projects/Tools Proficiency 5e"
zip -r tools-proficiency-5e.zip module.json scripts lang README.md LICENSE CHANGELOG.md
```

Command explanation:
- `zip -r` recursively archives the listed files and folders.
- Risk: overwrites `tools-proficiency-5e.zip` if it already exists in this folder.

3. Create a GitHub release tag like `v1.0.3`.
4. Upload `tools-proficiency-5e.zip` as a release asset.
5. Keep the asset filename exactly `tools-proficiency-5e.zip` so the `download` URL remains stable.

## Notes

- v1 intentionally does not add NPC-specific tool selection UI.
- Settings are world-level and GM-restricted.
- Renaming/removing tools in settings uses simple regeneration; actors may need to re-select renamed tools.
- Module startup includes a repair pass for malformed `c5t_` tool data from earlier versions.
