export const MODULE_ID = "custom-5e-tools";

export const CATEGORY_DEFINITIONS = Object.freeze([
  {
    id: "art",
    settingKey: "artCsv",
    label: "DND5E.ToolArtisans",
    ability: "int"
  },
  {
    id: "game",
    settingKey: "gameCsv",
    label: "DND5E.ToolGamingSet",
    ability: "wis"
  },
  {
    id: "music",
    settingKey: "musicCsv",
    label: "DND5E.ToolMusicalInstrument",
    ability: "cha"
  },
  {
    id: "vehicle",
    settingKey: "vehicleCsv",
    label: "DND5E.ToolVehicle",
    ability: "dex"
  },
  {
    id: "other",
    settingKey: "otherCsv",
    label: "CUSTOM5ETOOLS.CategoryOther",
    ability: "int"
  }
]);

const CUSTOM_TOOL_PREFIX = "c5t_";
const CUSTOM_REFERENCE_PREFIX = "__custom5e__";
const VALID_PROFICIENCY_VALUES = new Set([0, 0.5, 1, 2]);

/**
 * Apply custom tool categories and entries to dnd5e CONFIG.
 */
export function applyCustomToolsConfig() {
  if ( game.system?.id !== "dnd5e" ) return;

  const dnd5eConfig = CONFIG.DND5E;
  if ( !dnd5eConfig?.tools || !dnd5eConfig?.toolProficiencies ) return;

  removePreviousCustomTools(dnd5eConfig);

  for ( const category of CATEGORY_DEFINITIONS ) {
    const entries = getCategoryEntries(category);
    for ( const entry of entries ) {
      if ( category.id === "other" ) {
        // Leave these as top-level entries so dnd5e groups them into the existing "Other" section.
        dnd5eConfig.toolProficiencies[entry.key] = entry.label;
      } else {
        const categoryConfig = ensureCategoryConfig(dnd5eConfig, category);
        if ( !categoryConfig ) continue;
        categoryConfig.children[entry.key] = { label: entry.label };
      }

      dnd5eConfig.tools[entry.key] = {
        ability: category.ability,
        // Synthetic ID so dnd5e does not index this key as a base compendium tool.
        id: `${CUSTOM_REFERENCE_PREFIX}${entry.key}`
      };
    }
  }
}

/**
 * Re-render open actor sheets so updated tool options appear immediately.
 */
export function refreshActorSheets() {
  for ( const app of Object.values(ui.windows ?? {}) ) {
    const actor = app?.actor ?? app?.document ?? app?.object;
    if ( actor?.documentName !== "Actor" ) continue;
    if ( !["character", "npc"].includes(actor.type) ) continue;

    try {
      app.render({ force: true });
    } catch (_error) {
      try {
        app.render(true);
      } catch (_fallbackError) {
        // No-op if the app cannot be re-rendered from this context.
      }
    }
  }
}

/**
 * Repair malformed custom tool entries that may have been created by earlier module versions.
 */
export async function repairCustomToolData() {
  if ( game.system?.id !== "dnd5e" ) return;

  const validAbilities = new Set(Object.keys(CONFIG.DND5E.abilities ?? {}));
  for ( const actor of game.actors?.contents ?? [] ) {
    if ( !["character", "npc"].includes(actor.type) ) continue;

    const updates = {};
    const tools = actor.system?._source?.tools ?? {};
    for ( const [key, data] of Object.entries(tools) ) {
      if ( !key.startsWith(CUSTOM_TOOL_PREFIX) ) continue;

      // Remove stale keys that are no longer configured.
      if ( !CONFIG.DND5E.tools[key] ) {
        updates[`system.tools.-=${key}`] = null;
        continue;
      }

      const numericValue = Number(data?.value);
      if ( !VALID_PROFICIENCY_VALUES.has(numericValue) ) {
        updates[`system.tools.${key}.value`] = 0;
      }

      const defaultAbility = CONFIG.DND5E.tools[key]?.ability ?? "int";
      if ( !validAbilities.has(data?.ability) ) {
        updates[`system.tools.${key}.ability`] = defaultAbility;
      }

      if ( (typeof data?.bonuses?.check) !== "string" ) {
        updates[`system.tools.${key}.bonuses.check`] = "";
      }
    }

    if ( Object.keys(updates).length ) {
      try {
        await actor.update(updates);
      } catch (error) {
        console.error(`[${MODULE_ID}] Failed to repair custom tool data for actor ${actor.id}.`, error);
      }
    }
  }
}

/**
 * Remove keys injected by this module so re-apply is idempotent.
 * @param {object} dnd5eConfig
 */
function removePreviousCustomTools(dnd5eConfig) {
  for ( const key of Object.keys(dnd5eConfig.tools) ) {
    if ( key.startsWith(CUSTOM_TOOL_PREFIX) ) delete dnd5eConfig.tools[key];
  }

  for ( const [categoryKey, categoryData] of Object.entries(dnd5eConfig.toolProficiencies) ) {
    if ( categoryKey.startsWith(CUSTOM_TOOL_PREFIX) ) {
      delete dnd5eConfig.toolProficiencies[categoryKey];
      continue;
    }
    if ( (categoryKey === "other") && isLegacyModuleOtherCategory(categoryData) ) {
      delete dnd5eConfig.toolProficiencies[categoryKey];
      continue;
    }

    if ( (typeof categoryData !== "object") || !categoryData?.children ) continue;
    for ( const childKey of Object.keys(categoryData.children) ) {
      if ( childKey.startsWith(CUSTOM_TOOL_PREFIX) ) delete categoryData.children[childKey];
    }
  }
}

/**
 * Detect a legacy "other" category created by older module versions.
 * @param {unknown} categoryData
 * @returns {boolean}
 */
function isLegacyModuleOtherCategory(categoryData) {
  if ( (typeof categoryData !== "object") || !categoryData?.children ) return false;
  const childKeys = Object.keys(categoryData.children);
  if ( childKeys.some(key => !key.startsWith(CUSTOM_TOOL_PREFIX)) ) return false;

  const knownOtherLabels = new Set([
    "other",
    game.i18n.localize("DND5E.ProficiencyOther").toLocaleLowerCase(),
    game.i18n.localize("CUSTOM5ETOOLS.CategoryOther").toLocaleLowerCase()
  ]);
  const label = (categoryData.label ?? "").toString().toLocaleLowerCase();
  return !label || knownOtherLabels.has(label);
}

/**
 * Ensure this category exists and has a child map.
 * @param {object} dnd5eConfig
 * @param {object} category
 * @returns {object|null}
 */
function ensureCategoryConfig(dnd5eConfig, category) {
  const proficiencies = dnd5eConfig.toolProficiencies;
  const categoryLabel = game.i18n.localize(category.label);
  let categoryConfig = proficiencies[category.id];

  if ( !categoryConfig ) {
    categoryConfig = {
      label: categoryLabel,
      children: {}
    };
    proficiencies[category.id] = categoryConfig;
    return categoryConfig;
  }

  if ( typeof categoryConfig !== "object" ) {
    categoryConfig = {
      label: categoryConfig,
      children: {}
    };
    proficiencies[category.id] = categoryConfig;
    return categoryConfig;
  }

  categoryConfig.label ??= categoryLabel;
  categoryConfig.children ??= {};
  return categoryConfig;
}

/**
 * Build custom tools for one category from its comma-separated setting.
 * @param {object} category
 * @returns {Array<{ key: string, label: string }>}
 */
function getCategoryEntries(category) {
  const rawValue = game.settings.get(MODULE_ID, category.settingKey) ?? "";
  const labels = parseCsvList(rawValue);

  const entries = [];
  const usedKeys = new Set();

  for ( const label of labels ) {
    const baseSlug = slugify(label) || "tool";
    let key = `${CUSTOM_TOOL_PREFIX}${category.id}_${baseSlug}`;
    let suffix = 2;

    while ( usedKeys.has(key) ) {
      key = `${CUSTOM_TOOL_PREFIX}${category.id}_${baseSlug}_${suffix}`;
      suffix += 1;
    }

    usedKeys.add(key);
    entries.push({ key, label });
  }

  return entries;
}

/**
 * Parse and normalize a comma-separated list of names.
 * @param {string} csvText
 * @returns {string[]}
 */
function parseCsvList(csvText) {
  if ( typeof csvText !== "string" ) return [];

  const result = [];
  const seen = new Set();

  for ( const rawPart of csvText.split(",") ) {
    const label = rawPart.trim();
    if ( !label ) continue;

    const dedupeKey = label.toLocaleLowerCase();
    if ( seen.has(dedupeKey) ) continue;

    seen.add(dedupeKey);
    result.push(label);
  }

  return result;
}

/**
 * Convert an arbitrary display label into a safe key suffix.
 * @param {string} value
 * @returns {string}
 */
function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    // Use underscore-only keys to avoid form path parsing issues with hyphens.
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_{2,}/g, "_");
}
