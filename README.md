# Custom 5e Tools (`custom-5e-tools`)

This Foundry VTT module adds configurable custom tool proficiencies for the dnd5e system.

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
"/Users/nicholasmcdowell/Library/Application Support/FoundryVTT/Data/modules/custom-5e-tools"
```

Command explanation:
- `ln -sfn` creates or replaces a symbolic link (a filesystem shortcut).
- Risk: this replaces the existing link or folder at exactly `.../modules/custom-5e-tools`.

3. Start Foundry and open your dnd5e world.
4. Go to **Game Settings -> Manage Modules** and enable **Custom 5e Tools**.
5. Go to **Game Settings -> Configure Settings**, fill in any of the five comma-separated fields, then save.
6. Open a character sheet, open the tool proficiency configuration, and select your custom tools.

## GitHub Distribution

- Repository URL:
  - https://github.com/CaptainCurso/Tools-Proficiency-5e
- Manifest URL (for Foundry install):
  - https://raw.githubusercontent.com/CaptainCurso/Tools-Proficiency-5e/main/module.json
- Release ZIP URL (for Foundry install/update):
  - https://github.com/CaptainCurso/Tools-Proficiency-5e/releases/latest/download/custom-5e-tools.zip

### Release Steps

1. Ensure `module.json` version is updated.
2. Create a zip where `module.json` is at the root of the archive:

```bash
cd "/Users/nicholasmcdowell/Documents/Codex Projects/Tools Proficiency 5e"
zip -r custom-5e-tools.zip module.json scripts lang README.md LICENSE CHANGELOG.md
```

Command explanation:
- `zip -r` recursively archives the listed files and folders.
- Risk: overwrites `custom-5e-tools.zip` if it already exists in this folder.

3. Create a GitHub release tag like `v1.0.3`.
4. Upload `custom-5e-tools.zip` as a release asset.
5. Keep the asset filename exactly `custom-5e-tools.zip` so the `download` URL remains stable.

## Notes

- v1 intentionally does not add NPC-specific tool selection UI.
- Settings are world-level and GM-restricted.
- Renaming/removing tools in settings uses simple regeneration; actors may need to re-select renamed tools.
- Module startup includes a repair pass for malformed `c5t_` tool data from earlier versions.
