import {
  applyCustomToolsConfig,
  CATEGORY_DEFINITIONS,
  MODULE_ID,
  refreshActorSheets,
  repairCustomToolData
} from "./custom-tools.mjs";

/**
 * Register world-level settings for comma-separated custom tool names.
 */
export function registerSettings() {
  for ( const category of CATEGORY_DEFINITIONS ) {
    game.settings.register(MODULE_ID, category.settingKey, {
      name: `CUSTOM5ETOOLS.Settings.${category.settingKey}.Name`,
      hint: `CUSTOM5ETOOLS.Settings.${category.settingKey}.Hint`,
      scope: "world",
      config: true,
      restricted: true,
      type: String,
      default: "",
      onChange: () => {
        if ( !game.ready ) return;
        applyCustomToolsConfig();
        void repairCustomToolData().then(() => refreshActorSheets());
      }
    });
  }
}
