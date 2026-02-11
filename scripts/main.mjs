import { applyCustomToolsConfig, MODULE_ID, refreshActorSheets, repairCustomToolData } from "./custom-tools.mjs";
import { registerSettings } from "./settings.mjs";

Hooks.once("init", () => {
  registerSettings();
});

Hooks.once("ready", () => {
  if ( game.system?.id !== "dnd5e" ) {
    console.warn(`[${MODULE_ID}] Disabled because the active game system is not dnd5e.`);
    return;
  }

  applyCustomToolsConfig();
  void repairCustomToolData().then(() => refreshActorSheets());
});
