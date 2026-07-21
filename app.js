const DATA_URL = "./data/map_site_data.json?v=20260719-whisperwake-lumen-groups-v001";
const CHECKLIST_URL = "./data/checklist_data.json?v=20260719-lumen-embers-v001";
const ITEMLOG_DATA_URL = "./data/itemlog_data.json?v=20260720-holo-gizmos-v002";
const ANIILOG_DATA_URL = "./data/aniilog_data.json?v=20260719-localization-v003";
const APP_VERSION = "v0.4.07";
const GITHUB_COMMITS_URL = "https://api.github.com/repos/donneeee/MinMax-Aniipedia/commits?sha=main&per_page=30";
const CHANGELOG_INTERNAL_MARKER_RE = /\[(?:skip changelog|internal)\]/i;
const CHANGELOG_PUBLIC_ENTRY_LIMIT = 12;
const ANIILOG_EXPANDED_GROUPS_STORAGE_KEY = "minmax-aniilog-expanded-groups-v1";
const TRACKING_TICK_MS = 1000;
const LOCAL_TRACKING_STORAGE_KEY = "minmax-map:tracking:v1";
const LOCAL_COMPLETION_STORAGE_KEY = "minmax-map:completed:v1";
const LOCAL_PREFERENCES_STORAGE_KEY = "minmax-map:preferences:v1";
const MIN_SCALE = 0.03;
const MAX_SCALE = 16;
const MAP_EDGE_MARGIN = 48;
const MAP_TILE_DETAIL_SCALE = 0.55;
const PIN_CANVAS_THRESHOLD = 450;
const CANVAS_HIT_CELL_SIZE = 128;
const REQUESTED_MAP_ID = new URLSearchParams(window.location.search).get("map");
const MOBILE_LAYOUT_QUERY = window.matchMedia("(max-width: 820px)");
// Reserved for temporarily suppressing incomplete physical reward sources.
const TEMPORARILY_HIDDEN_ITEM_IDS = new Set();
const ANIILOG_STAT_CONFIG = Object.freeze([
  { sourceLabel: "HP", label: "HP", id: "hp", color: "#ef6a5b", icon: "./assets/aniilog/stats/hp.png" },
  { sourceLabel: "Attack", label: "Attack", id: "attack", color: "#ffd166", icon: "./assets/aniilog/stats/attack.png" },
  { sourceLabel: "Magic Attack", label: "Magic Attack", id: "magic-attack", color: "#ec76c5", preference: "showMagicAttack" },
  { sourceLabel: "Break", label: "Break", id: "break", color: "#b678f4", icon: "./assets/aniilog/stats/break.png" },
  { sourceLabel: "Defense", label: "Defense", id: "defense", color: "#44c5d8", icon: "./assets/aniilog/stats/defense.png" },
  { sourceLabel: "Magic Defense", label: "Magic Defense", id: "magic-defense", color: "#6fa8ff", icon: "./assets/aniilog/stats/magic-defense.png" },
  { sourceLabel: "EP Regen", label: "Regen", id: "regen", color: "#65d36e", icon: "./assets/aniilog/stats/regen.png" },
]);
const ANIILOG_BADGE_ASSET_ROOT = "./assets/aniilog";
const CATALOG_ROLE_META = Object.freeze({
  DPS: { slug: "dps", icon: `${ANIILOG_BADGE_ASSET_ROOT}/class-dps.png`, color: "#e76561" },
  REGEN: { slug: "regen", icon: `${ANIILOG_BADGE_ASSET_ROOT}/class-regen.png`, color: "#58b7d9" },
  BREAK: { slug: "break", icon: `${ANIILOG_BADGE_ASSET_ROOT}/class-break.png`, color: "#ae7ee8" },
  HEALER: { slug: "healer", icon: `${ANIILOG_BADGE_ASSET_ROOT}/class-healer.png`, color: "#65c889" },
  SUPPORT: { slug: "support", icon: `${ANIILOG_BADGE_ASSET_ROOT}/class-support.png`, color: "#e47fae" },
  DEFENSE: { slug: "defense", icon: `${ANIILOG_BADGE_ASSET_ROOT}/class-defense.png`, color: "#d2aa54" },
});
const CATALOG_ELEMENT_META = Object.freeze({
  fire: { slug: "fire", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-fire.png`, color: "#e03d3d" },
  grass: { slug: "grass", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-grass.png`, color: "#43a061" },
  water: { slug: "water", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-water.png`, color: "#1e90ff" },
  rock: { slug: "rock", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-rock.png`, color: "#b8a278" },
  earth: { slug: "rock", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-rock.png`, color: "#b8a278" },
  electric: { slug: "electric", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-electric.png`, color: "#e2c10b" },
  electricity: { slug: "electric", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-electric.png`, color: "#e2c10b" },
  ice: { slug: "ice", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-ice.png`, color: "#58d0e8" },
  wind: { slug: "wind", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-wind.png`, color: "#58c7b1" },
  dark: { slug: "dark", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-dark.png`, color: "#7b4ca9" },
  shadow: { slug: "dark", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-dark.png`, color: "#7b4ca9" },
  holy: { slug: "holy", label: "Light", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-holy.png`, color: "#f6a93c" },
  light: { slug: "holy", label: "Light", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-holy.png`, color: "#f6a93c" },
  metal: { slug: "metal", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-metal.png`, color: "#708c9c" },
  poison: { slug: "poison", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-poison.png`, color: "#8d63b8" },
  psychic: { slug: "psychic", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-psychic.png`, color: "#ef65b0" },
  psychokinesis: { slug: "psychic", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-psychic.png`, color: "#ef65b0" },
  normal: { slug: "normal", icon: `${ANIILOG_BADGE_ASSET_ROOT}/element-normal.png`, color: "#9faaad" },
});
const CATALOG_HOMELAND_META = Object.freeze({
  1000: { ...CATALOG_ELEMENT_META.fire },
  1001: { ...CATALOG_ELEMENT_META.grass },
  1002: { ...CATALOG_ELEMENT_META.water },
  1003: { ...CATALOG_ELEMENT_META.rock },
  1004: { ...CATALOG_ELEMENT_META.electric },
  1005: { ...CATALOG_ELEMENT_META.ice },
  1006: { ...CATALOG_ELEMENT_META.wind },
  1007: { ...CATALOG_ELEMENT_META.dark },
  1008: { ...CATALOG_ELEMENT_META.holy },
  1100: { slug: "carry", icon: `${ANIILOG_BADGE_ASSET_ROOT}/homeland-carry.png`, color: "#6285cc" },
  1101: { slug: "artisanship", icon: `${ANIILOG_BADGE_ASSET_ROOT}/homeland-artisanship.png`, color: "#71b258" },
  1102: { slug: "leisure", icon: `${ANIILOG_BADGE_ASSET_ROOT}/homeland-leisure.png`, color: "#e77894" },
  1103: { slug: "incense-making", icon: `${ANIILOG_BADGE_ASSET_ROOT}/homeland-incense-making.png`, color: "#b579dc" },
});
const HOMELAND_ELEMENT_IDS = new Set(["1000", "1001", "1002", "1003", "1004", "1005", "1006", "1007", "1008"]);
const ANIILOG_SPECIAL_FORM_FILTERS = Object.freeze([
  { id: "rainbow", label: "Prismana" },
  { id: "umbrabow", label: "Umbrabow" },
  { id: "legendary", label: "Legendary" },
]);
const ANIILOG_EVOLUTION_STAGES = Object.freeze([
  { id: "lumin", label: "Lumin" },
  { id: "gamma", label: "Gamma" },
  { id: "nova", label: "Nova" },
]);
const THEME_COLOR_FIELDS = Object.freeze([
  { id: "background", label: "Page background", description: "The deepest page and map-workspace color." },
  { id: "backgroundAlt", label: "Background glow", description: "The secondary tone used in page gradients." },
  { id: "surface", label: "Surface", description: "Sidebar, dialogs, and main panel backgrounds." },
  { id: "surfaceRaised", label: "Raised surface", description: "Cards, inputs, and elevated controls." },
  { id: "border", label: "Borders", description: "Dividers, outlines, and inactive control edges." },
  { id: "text", label: "Primary text", description: "Headings and important interface text." },
  { id: "muted", label: "Muted text", description: "Descriptions, metadata, and secondary labels." },
  { id: "primary", label: "Primary accent", description: "Active navigation, focus rings, and primary actions." },
  { id: "secondary", label: "Ignited accent", description: "Hover states and the strong end of gradients." },
  { id: "highlight", label: "Highlight", description: "Badges, sparks, version text, and small callouts." },
]);
const THEME_PRESETS = Object.freeze({
  default: Object.freeze({
    id: "default",
    label: "Aniipedia",
    description: "The original cool mint and gold interface.",
    motif: "signal",
    icon: "",
    colors: Object.freeze({
      background: "#111316",
      backgroundAlt: "#181716",
      surface: "#1a1f22",
      surfaceRaised: "#22292d",
      border: "#384248",
      text: "#f4f1e9",
      muted: "#9faaad",
      primary: "#7fc6b2",
      secondary: "#4f9d8c",
      highlight: "#e8bf63",
    }),
  }),
  emberpup: Object.freeze({
    id: "emberpup",
    label: "Emberpup",
    description: "Coal-dark fur, glowing orange markings, and golden sparks.",
    motif: "paw",
    icon: "assets/icons/aniimo_10051_basic__10051_Emberpup_UI_PetHead_10051_Sprite_1694520572941008294.png",
    colors: Object.freeze({
      background: "#111218",
      backgroundAlt: "#2b1815",
      surface: "#1c1d27",
      surfaceRaised: "#292a36",
      border: "#4b4650",
      text: "#fff4e8",
      muted: "#bdb4b5",
      primary: "#ff742e",
      secondary: "#d9471d",
      highlight: "#ffc857",
    }),
  }),
  pawney: Object.freeze({
    id: "pawney",
    label: "Pawney",
    description: "Gunmetal armor, cobalt energy, and a sharp magenta glint.",
    motif: "armor",
    icon: "assets/icons/aniimo_10026_basic__10026_Helm_UI_PetHead_10026_Sprite_-7789980316388748766.png",
    colors: Object.freeze({
      background: "#0e1120",
      backgroundAlt: "#171b3a",
      surface: "#171b2d",
      surfaceRaised: "#232844",
      border: "#444d76",
      text: "#f5f4ff",
      muted: "#aeb3cf",
      primary: "#7a84f7",
      secondary: "#4d57bc",
      highlight: "#ee8bd4",
    }),
  }),
});
const DEFAULT_CUSTOM_THEME = Object.freeze({ ...THEME_PRESETS.emberpup.colors });
const DEFAULT_PREFERENCES = Object.freeze({
  showMagicAttack: false,
  language: "en",
  theme: "default",
  customTheme: DEFAULT_CUSTOM_THEME,
});
const COLORS = [
  "#7fc6b2",
  "#e8bf63",
  "#e56f5f",
  "#8eb8f4",
  "#b48fe8",
  "#73c66b",
  "#f294b1",
  "#75c7d8",
  "#d0b071",
  "#a6c46f",
  "#dd8c6d",
  "#6fac9f",
];

const state = {
  data: null,
  bootstrap: null,
  legacyDataset: null,
  mapDataCache: new Map(),
  mapLoadToken: 0,
  loadingMapId: null,
  mapLoadError: null,
  tileMapId: null,
  tileFrame: 0,
  viewportFitFrame: 0,
  viewportWidth: 0,
  viewportHeight: 0,
  viewportResizeObserver: null,
  visibleEntries: [],
  canvasEntries: [],
  canvasHitGrid: new Map(),
  iconImages: new Map(),
  canvasMode: false,
  hoveredCanvasIndex: null,
  canvasPointerHit: null,
  canvasFrame: 0,
  canvasIconLoadTimer: 0,
  domPins: new Map(),
  enabled: new Set(),
  disabledSpawnIds: new Set(),
  expandedMapGroups: new Set(),
  collapsedMiscGroups: new Set(),
  renderedMapGroups: new Map(),
  activeMapId: REQUESTED_MAP_ID || "country-of-time",
  activeLayer: "items",
  search: "",
  scale: 1,
  panX: 0,
  panY: 0,
  dragging: false,
  dragStart: null,
  activePointers: new Map(),
  pinch: null,
  suppressPinClickUntil: 0,
  selectedPin: null,
  selectedSpawnIndex: null,
  locatedSpawnIndex: null,
  mobileSelectionMinimized: true,
  sidebarView: "map",
  settingsOpen: false,
  settingsFocusReturn: null,
  settingsThemeDraft: null,
  settingsActiveTab: "general",
  changelogOpen: false,
  changelogFocusReturn: null,
  changelogLoadToken: 0,
  tracking: new Map(),
  completed: new Set(),
  checklistData: null,
  checklistLoadError: "",
  checklistCategory: "aniimo",
  luminChecklistTab: "ambers",
  checklistSearch: "",
  itemlogData: null,
  itemlogLoadError: "",
  itemlogLoadPromise: null,
  aniilogData: null,
  aniilogLoadError: "",
  aniilogLoadPromise: null,
  catalogSearch: {
    aniilog: "",
    itemlog: "",
  },
  catalogSort: {
    aniilog: "aniilog-number",
  },
  catalogIndexScroll: {
    aniilog: 0,
    itemlog: 0,
  },
  catalogSelection: {
    aniilog: "aniimo:1005100",
    itemlog: "item:4010132",
  },
  catalogCategory: {
    aniilog: "all",
    itemlog: "all",
  },
  itemlogFilters: {
    source: "all",
    park: "all",
    tier: "all",
  },
  aniilogFiltersOpen: false,
  aniilogFilterSectionsOpen: new Set(["classes"]),
  aniilogFilterScroll: 0,
  aniilogFilters: {
    classes: new Set(),
    elements: new Set(),
    homeland: new Set(),
    stages: new Set(),
    forms: new Set(),
    statRules: [],
    mobility: "any",
    exploration: "any",
    coreSkill: "any",
  },
  trackingTicker: 0,
  pendingTrackingIds: new Set(),
  pendingAniilogLocate: null,
  pendingBossLocate: null,
  pendingReset: false,
  localStorageError: "",
  preferences: defaultPreferences(),
};

const els = {
  mapMeta: document.querySelector("#mapMeta"),
  appVersion: document.querySelector("#appVersion"),
  workspaceTabs: document.querySelector("#workspaceTabs"),
  mapWorkspaceTab: document.querySelector("#mapWorkspaceTab"),
  trackingWorkspaceTab: document.querySelector("#trackingWorkspaceTab"),
  checklistWorkspaceTab: document.querySelector("#checklistWorkspaceTab"),
  aniilogWorkspaceTab: document.querySelector("#aniilogWorkspaceTab"),
  itemlogWorkspaceTab: document.querySelector("#itemlogWorkspaceTab"),
  settingsButton: document.querySelector("#settingsButton"),
  settingsOverlay: document.querySelector("#settingsOverlay"),
  settingsCloseButton: document.querySelector("#settingsCloseButton"),
  changelogOverlay: document.querySelector("#changelogOverlay"),
  changelogCloseButton: document.querySelector("#changelogCloseButton"),
  changelogContent: document.querySelector("#changelogContent"),
  mapWorkspace: document.querySelector("#mapWorkspace"),
  trackingWorkspace: document.querySelector("#trackingWorkspace"),
  checklistWorkspace: document.querySelector("#checklistWorkspace"),
  catalogWorkspace: document.querySelector("#catalogWorkspace"),
  catalogSidebarContent: document.querySelector("#catalogSidebarContent"),
  trackingCount: document.querySelector("#trackingCount"),
  trackingList: document.querySelector("#trackingList"),
  checklistCount: document.querySelector("#checklistCount"),
  checklistCategoryTabs: document.querySelector("#checklistCategoryTabs"),
  luminChecklistTabs: document.querySelector("#luminChecklistTabs"),
  checklistSearchInput: document.querySelector("#checklistSearchInput"),
  checklistList: document.querySelector("#checklistList"),
  settingsContent: document.querySelector("#settingsContent"),
  mapTabs: document.querySelector("#mapTabs"),
  searchInput: document.querySelector("#searchInput"),
  filterCount: document.querySelector("#filterCount"),
  layerTabs: document.querySelector("#layerTabs"),
  itemList: document.querySelector("#itemList"),
  selectionCatalogShortcut: document.querySelector("#selectionCatalogShortcut"),
  selectionDetail: document.querySelector("#selectionDetail"),
  mobileSelectionPanel: document.querySelector("#mobileSelectionPanel"),
  mobileSelectionCatalogShortcut: document.querySelector("#mobileSelectionCatalogShortcut"),
  mobileSelectionDetail: document.querySelector("#mobileSelectionDetail"),
  mobileSelectionToggle: document.querySelector("#mobileSelectionToggle"),
  mapPanel: document.querySelector(".map-panel"),
  mapSurface: document.querySelector("#mapSurface"),
  catalogPanel: document.querySelector("#catalogPanel"),
  mapViewport: document.querySelector("#mapViewport"),
  mapWorld: document.querySelector("#mapWorld"),
  mapTiles: document.querySelector("#mapTiles"),
  mapImage: document.querySelector("#mapImage"),
  pinLayer: document.querySelector("#pinLayer"),
  pinCanvas: document.querySelector("#pinCanvas"),
  pinTooltip: document.querySelector("#pinTooltip"),
  coordinateReadout: document.querySelector("#coordinateReadout"),
  selectAllButton: document.querySelector("#selectAllButton"),
  selectNoneButton: document.querySelector("#selectNoneButton"),
  zoomInButton: document.querySelector("#zoomInButton"),
  zoomOutButton: document.querySelector("#zoomOutButton"),
  fitButton: document.querySelector("#fitButton"),
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatNumber(value, digits = 1) {
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
  });
}

function formatCoordinate(value) {
  const number = Number(value);
  return Number.isFinite(number) ? String(Math.round(number)) : "";
}

function positiveInteger(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

function formatCountdown(seconds) {
  const total = Math.max(0, Math.ceil(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainder = total % 60;
  return [hours, minutes, remainder]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function formatRespawnDuration(seconds) {
  const total = positiveInteger(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainder = total % 60;
  const parts = [];
  if (hours) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  if (minutes) parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
  if (remainder) parts.push(`${remainder} second${remainder === 1 ? "" : "s"}`);
  return parts.join(" ") || "Unknown";
}

function formatLocalReadyTime(timestamp) {
  const readyAt = new Date(timestamp);
  if (Number.isNaN(readyAt.getTime())) return "Unknown";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(readyAt);
}

function trackingIdForSpawn(spawn) {
  const x = Number(spawn?.x);
  const y = Number(spawn?.y);
  return [
    spawn?.map_id,
    spawn?.scene_id,
    spawn?.item_id,
    Number.isFinite(x) ? x.toFixed(2) : "",
    Number.isFinite(y) ? y.toFixed(2) : "",
  ].join(":");
}

function respawnSecondsForSpawn(spawn, item) {
  return positiveInteger(spawn?.respawn_seconds) || positiveInteger(item?.respawn_seconds);
}

function respawnLabelForSpawn(spawn, item) {
  return String(spawn?.respawn_label || item?.respawn_label || "").trim()
    || formatRespawnDuration(respawnSecondsForSpawn(spawn, item));
}

function respawnSourceForSpawn(spawn) {
  return String(spawn?.respawn_source || "").trim();
}

function respawnEvidenceLabel(value) {
  const source = typeof value === "string" ? value : String(value?.respawn_source || "").trim();
  if (source === "live_observation_matches_static_config") return "Live-confirmed";
  if (source === "live_observation") return "Live-observed";
  return "Configured";
}

function respawnEvidenceTitle(value) {
  const source = typeof value === "string" ? value : String(value?.respawn_source || "").trim();
  if (source === "live_observation_matches_static_config") {
    return "A live coordinate-specific observation matched the current scene configuration.";
  }
  if (source === "live_observation") {
    return "A live coordinate-specific observation supplied this timer.";
  }
  return "This timer comes from the current scene spawner configuration. The live server controls the active respawn timestamp.";
}

function isTrackableOverworldItem(spawn, item) {
  return Boolean(
    spawn
    && spawn.marker_type === "collect_item"
    && respawnSourceForSpawn(spawn)
    && respawnSecondsForSpawn(spawn, item),
  );
}

function timestampFor(value) {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function normalizeTrackingEntry(value) {
  if (!value || typeof value !== "object") return null;
  const id = String(value.marker_id || value.id || "").trim();
  const itemId = String(value.item_id || "").trim();
  const mapId = String(value.map_id || "").trim();
  const respawnSeconds = positiveInteger(value.respawn_seconds);
  if (!id || !itemId || !mapId || !respawnSeconds) return null;

  const startedAt = timestampFor(value.started_at);
  return {
    id,
    map_id: mapId,
    map_label: String(value.map_label || mapId).trim(),
    scene_id: String(value.scene_id || "").trim(),
    item_id: itemId,
    display_name: String(value.display_name || itemId).trim(),
    icon: String(value.icon || "").trim(),
    coordinate_key: String(value.coordinate_key || "").trim(),
    x: Number(value.x),
    y: Number(value.y),
    area_name: String(value.area_name || "").trim(),
    respawn_seconds: respawnSeconds,
    respawn_label: String(value.respawn_label || "").trim(),
    respawn_source: String(value.respawn_source || "static_spawner_config").trim(),
    respawn_confidence: String(value.respawn_confidence || "config_backed").trim(),
    started_at: startedAt && startedAt > 0 ? new Date(startedAt).toISOString() : null,
  };
}

function colorForIndex(index) {
  return COLORS[index % COLORS.length];
}

function layerColor(layerId, index = 0) {
  if (layerId === "eggs") return "#d66af0";
  if (layerId === "aniimo") return "#6fc7e8";
  if (layerId === "teleports") return "#7bd5ff";
  if (layerId === "ambers") return "#f0b84f";
  if (layerId === "misc") return "#e8bf63";
  return colorForIndex(index);
}

const ITEM_TIER_COLORS = Object.freeze({
  grey: "#bcc5cc",
  blue: "#6bb8ff",
  purple: "#c18cff",
  gold: "#f0c765",
});

function itemTier(item) {
  if (!item || item.layer_id !== "items" || item.is_physical_reward_source) return "";

  switch (String(item.quality_label || "").trim().toLowerCase()) {
    case "common":
    case "gray":
    case "grey":
      return "grey";
    case "rare":
    case "blue":
      return "blue";
    case "epic":
    case "purple":
      return "purple";
    case "legendary":
    case "gold":
      return "gold";
    default:
      // Standard gatherables have no quality label in the source data and are the grey tier.
      return "grey";
  }
}

function itemColor(item, index = 0) {
  return ITEM_TIER_COLORS[itemTier(item)] || layerColor(item.layer_id, index);
}

function markerTypeLabel(type) {
  if (type === "elite_egg") return "Elite Egg";
  if (type === "alpha_egg") return "Alpha Egg";
  if (type === "aniimo_spawn") return "Aniimo";
  if (type === "teleport_bloom") return "Bloom";
  if (type === "teleport_sanctum") return "Sanctum";
  if (type === "teleport_branch") return "Branch";
  if (type === "teleport_outpost") return "Outpost";
  if (type === "teleport_nurture") return "Nurture";
  if (type === "teleport_vein_abundance") return "Vein Abundance";
  if (type === "lumin_amber") return "Lumen Ember";
  if (type === "lumin_marking") return "Lumen Marking";
  if (type === "quest_lumen_seed") return "Boss Clear";
  if (type === "lumin_event") return "Event Ember";
  if (type === "underground_entrance") return "Underground Entrance";
  if (type === "morphling_memory") return "Morphling Memory";
  if (type === "document_pickup") return "Document Pickup";
  if (type === "lighthouse_book") return "Book";
  if (type === "research_note") return "Research Note";
  if (type === "astra_transit") return "Astra Transit";
  if (type === "astra_district") return "Astra District";
  if (type === "astra_shop") return "Shop";
  if (type === "pathfinder_challenger") return "Pathfinder Challenge";
  if (type === "elite_pathfinder_challenger") return "Elite Pathfinder Challenge";
  if (type === "physical_reward_source") return "Overworld Reward";
  return "Collectable";
}

function isEggItem(item) {
  return Boolean(item?.is_elite_egg || item?.is_alpha_egg || item?.egg_kind);
}

function isEggMarker(spawn) {
  return spawn?.marker_type === "elite_egg" || spawn?.marker_type === "alpha_egg";
}

function eggKindForItem(item) {
  if (!item || !isEggItem(item)) return "";
  if (item.egg_kind === "elite" || item.is_elite_egg) return "elite";
  if (item.egg_kind === "alpha" || item.is_alpha_egg) return "alpha";
  return "";
}

function stripFormSuffix(value) {
  return String(value || "").replace(/\s+\([^()]+\)\s*$/, "");
}

function aniimoListName(item) {
  if (!item?.is_aniimo) return item?.display_name || "";
  if (item.special_type) return item.display_name || item.species_name || "";
  return item.species_name || stripFormSuffix(item.display_name);
}

function aniilogLabel(item) {
  if (item?.aniilog_number_label) return item.aniilog_number_label;
  const raw = item?.official_no || item?.aniilog_number;
  const number = Number.parseInt(String(raw || "").replace(/\D/g, ""), 10);
  return Number.isFinite(number) ? `#${String(number).padStart(3, "0")}` : "";
}

function aniimoListMeta(item) {
  return [aniilogLabel(item), item.form_label].filter(Boolean).join(" \u2022 ");
}

function numericSortValue(value) {
  const number = Number.parseInt(String(value ?? "").replace(/\D/g, ""), 10);
  return Number.isFinite(number) ? number : Number.MAX_SAFE_INTEGER;
}

function compareText(a, b) {
  return String(a || "").localeCompare(String(b || ""), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function aniimoSpeciesSortName(item) {
  return item.species_name || stripFormSuffix(item.display_name);
}

function aniimoFormSortRank(item) {
  if (item.form_label === "Basic") return 0;
  if (item.special_type) return 2;
  return 1;
}

function compareItems(a, b) {
  if (a.is_aniimo && b.is_aniimo) {
    const numberCompare = numericSortValue(a.aniilog_sort_number ?? a.aniilog_number ?? a.official_no ?? a.aniimo_id)
      - numericSortValue(b.aniilog_sort_number ?? b.aniilog_number ?? b.official_no ?? b.aniimo_id);
    if (numberCompare !== 0) return numberCompare;

    const nameCompare = compareText(aniimoSpeciesSortName(a), aniimoSpeciesSortName(b));
    if (nameCompare !== 0) return nameCompare;

    const formRankCompare = aniimoFormSortRank(a) - aniimoFormSortRank(b);
    if (formRankCompare !== 0) return formRankCompare;

    const formCompare = compareText(a.form_label, b.form_label);
    if (formCompare !== 0) return formCompare;
  }

  const explicitOrderA = Number.isFinite(Number(a.filter_sort_order)) ? Number(a.filter_sort_order) : Infinity;
  const explicitOrderB = Number.isFinite(Number(b.filter_sort_order)) ? Number(b.filter_sort_order) : Infinity;
  if (explicitOrderA !== explicitOrderB) return explicitOrderA - explicitOrderB;

  const nameCompare = compareText(a.display_name, b.display_name);
  if (nameCompare !== 0) return nameCompare;
  return compareText(a.item_id, b.item_id);
}

const MISC_GROUP_ORDER = [
  "Collectibles",
  "Chests",
  "Challenges",
  "Entrances",
  "Locations & Services",
  "Other",
];

function miscGroupForItem(item) {
  if (item?.misc_group) return item.misc_group;
  const type = String(item?.display_type_label || "").toLowerCase();
  if (String(item?.item_id || "").startsWith("misc:document_pickups:") || item?.item_id === "misc:morphling_memory") {
    return "Collectibles";
  }
  if (type === "chest") return "Chests";
  if (type.includes("challenge")) return "Challenges";
  if (type.includes("entrance")) return "Entrances";
  if (String(item?.item_id || "").startsWith("misc:astra:") || item?.region_name === "Astra") {
    return "Locations & Services";
  }
  return "Other";
}

function compareLayerItems(a, b, layerId) {
  if (layerId === "misc") {
    const groupA = miscGroupForItem(a);
    const groupB = miscGroupForItem(b);
    const rankA = MISC_GROUP_ORDER.indexOf(groupA);
    const rankB = MISC_GROUP_ORDER.indexOf(groupB);
    const safeRankA = rankA === -1 ? MISC_GROUP_ORDER.length : rankA;
    const safeRankB = rankB === -1 ? MISC_GROUP_ORDER.length : rankB;
    if (safeRankA !== safeRankB) return safeRankA - safeRankB;
    const groupCompare = compareText(groupA, groupB);
    if (groupCompare !== 0) return groupCompare;
  }
  return compareItems(a, b);
}

function currentMap() {
  if (!state.data) return null;
  return state.data.mapsById.get(state.activeMapId) || state.data.maps[0] || state.data.map;
}

function mapLabelForSpawn(spawn) {
  if (!state.data || !spawn) return "";
  return state.data.mapsById.get(spawn.map_id)?.label || "";
}

function cleanGeographicName(value, formLabel = "") {
  const formKey = String(formLabel || "").trim().toLocaleLowerCase();
  const seen = new Set();
  return String(value || "")
    .split(/\s*\/\s*/)
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !formKey || part.toLocaleLowerCase() !== formKey)
    .filter((part) => {
      const key = part.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(" / ");
}

function mapRegionForSpawn(spawn) {
  if (!state.data || !spawn) return "";
  const map = state.data.mapsById.get(spawn.map_id);
  return map?.region_label || map?.label || "";
}

function regionDetailValue(spawn) {
  if (!state.data || !spawn) return "";
  const map = state.data.mapsById.get(spawn.map_id);
  return spawn.region_name || map?.region_label || "";
}

function spawnOnActiveMap(spawn) {
  return Boolean(spawn) && spawn.map_id === state.activeMapId;
}

function activeMapItems() {
  if (!state.data) return [];
  const itemIds = state.data.itemIdsByMap.get(state.activeMapId) || new Set();
  return state.data.items.filter((item) => itemIds.has(item.item_id));
}

function activeMapSpawnEntries(itemId) {
  return (state.data.spawnsByItemId.get(itemId) || []).filter(({ spawn }) => spawnOnActiveMap(spawn));
}

function aniilogFormKey(value) {
  return String(value || "basic").trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function aniilogItemMatches(item, entry) {
  return Boolean(
    item?.is_aniimo
    && entry
    && String(item.aniimo_id || "") === String(entry.base_id || "")
    && aniilogFormKey(item.form_key) === aniilogFormKey(entry.form_key),
  );
}

function applyAniilogLocate(entry, finalAttempt = false) {
  const mapItems = activeMapItems();
  const matches = mapItems.filter((item) => aniilogItemMatches(item, entry));
  if (!matches.length) {
    if (finalAttempt) {
      state.pendingAniilogLocate = null;
      clearSelectionDetails("No confirmed spawn for this form is available on the selected map.");
    }
    return false;
  }

  mapItems.filter((item) => item.is_aniimo).forEach((item) => state.enabled.delete(item.item_id));
  matches.forEach((item) => state.enabled.add(item.item_id));
  state.activeLayer = "aniimo";
  state.search = "";
  els.searchInput.value = "";
  renderItems();
  refreshVisibility();

  const firstMatch = matches[0];
  const spawnEntry = activeMapSpawnEntries(firstMatch.item_id).find(({ spawn }) => spawnMatches(spawn))
    || activeMapSpawnEntries(firstMatch.item_id)[0];
  if (spawnEntry) {
    state.locatedSpawnIndex = spawnEntry.index;
    selectSpawn(spawnEntry.index);
    focusSpawn(spawnEntry.spawn);
  }
  state.pendingAniilogLocate = null;
  return true;
}

function applyPendingAniilogLocate(finalAttempt = false) {
  if (!state.pendingAniilogLocate) return false;
  return applyAniilogLocate(state.pendingAniilogLocate, finalAttempt);
}

function locateAniilogEntry(entry) {
  if (!entry || !Array.isArray(entry.map_ids) || !entry.map_ids.length) return;
  state.pendingAniilogLocate = entry;
  const mapId = entry.map_ids.includes(state.activeMapId)
    ? state.activeMapId
    : entry.map_ids.find((candidate) => state.data?.mapsById.has(candidate));
  if (!mapId) {
    state.pendingAniilogLocate = null;
    return;
  }
  setSidebarView("map");
  if (mapId !== state.activeMapId) {
    switchMap(mapId);
  }
  if (datasetForMap(mapId)) applyPendingAniilogLocate(true);
}

function applyBossLocate(boss, finalAttempt = false) {
  const item = activeMapItems().find((candidate) => (
    candidate.item_id === boss?.item_id
    && candidate.is_aniimo
    && String(candidate.special_type || "").toLowerCase() === String(boss?.tier || "").toLowerCase()
  ));
  if (!item) {
    if (finalAttempt) {
      state.pendingBossLocate = null;
      clearSelectionDetails("No confirmed map marker is available for this boss encounter.");
    }
    return false;
  }

  activeMapItems().filter((candidate) => candidate.is_aniimo).forEach((candidate) => {
    state.enabled.delete(candidate.item_id);
  });
  state.enabled.add(item.item_id);
  state.activeLayer = "aniimo";
  state.search = "";
  els.searchInput.value = "";
  renderItems();
  refreshVisibility();

  const spawnEntries = activeMapSpawnEntries(item.item_id);
  const spawnEntry = spawnEntries.find(({ spawn }) => (
    boss.coordinate_key && spawn.coordinate_key === boss.coordinate_key
  )) || spawnEntries.find(({ spawn }) => (
    Number.isFinite(Number(boss.x))
    && Number.isFinite(Number(boss.y))
    && Math.abs(Number(spawn.x) - Number(boss.x)) < 1
    && Math.abs(Number(spawn.y) - Number(boss.y)) < 1
  )) || spawnEntries[0];

  if (spawnEntry) {
    state.locatedSpawnIndex = spawnEntry.index;
    selectSpawn(spawnEntry.index);
    focusSpawn(spawnEntry.spawn);
  }
  state.pendingBossLocate = null;
  return true;
}

function applyPendingBossLocate(finalAttempt = false) {
  if (!state.pendingBossLocate) return false;
  return applyBossLocate(state.pendingBossLocate, finalAttempt);
}

function locateBossVariant(boss) {
  if (!boss?.map_id || !boss?.item_id) return;
  state.pendingBossLocate = boss;
  setSidebarView("map");
  if (boss.map_id !== state.activeMapId) {
    switchMap(boss.map_id);
  }
  if (datasetForMap(boss.map_id)) applyPendingBossLocate(true);
}

function areaDetailValue(spawn) {
  return cleanGeographicName(
    spawn.large_area_name || spawn.level_area_name || spawn.area_name || "",
    spawn.form_label,
  );
}

function trackingEntryForSpawn(spawn, item) {
  if (!isTrackableOverworldItem(spawn, item) || !item) return null;
  const map = state.data?.mapsById.get(spawn.map_id);
  return {
    id: trackingIdForSpawn(spawn),
    map_id: spawn.map_id,
    map_label: map?.label || spawn.map_id,
    scene_id: String(spawn.scene_id || ""),
    item_id: spawn.item_id,
    display_name: spawn.display_name || item.display_name || spawn.item_id,
    icon: item.icon || "",
    coordinate_key: spawn.coordinate_key || "",
    x: Number(spawn.x),
    y: Number(spawn.y),
    area_name: areaDetailValue(spawn),
    respawn_seconds: respawnSecondsForSpawn(spawn, item),
    respawn_label: respawnLabelForSpawn(spawn, item),
    respawn_source: respawnSourceForSpawn(spawn),
    respawn_confidence: String(spawn.respawn_confidence || "").trim(),
    started_at: null,
  };
}

function trackingReadyAt(entry) {
  const startedAt = timestampFor(entry?.started_at);
  return startedAt && startedAt > 0
    ? startedAt + positiveInteger(entry.respawn_seconds) * 1000
    : null;
}

function renderSyncCallout(title, message, action) {
  const callout = document.createElement("div");
  callout.className = "sync-callout";
  if (action?.danger) callout.classList.add("sync-error");

  const heading = document.createElement("strong");
  heading.textContent = title;
  const description = document.createElement("p");
  description.textContent = message;
  callout.append(heading, description);

  if (action?.label && typeof action.onClick === "function") {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    button.disabled = Boolean(action.disabled);
    button.addEventListener("click", action.onClick);
    callout.append(button);
  }
  return callout;
}

function refreshAccountViews() {
  renderTracking();
  renderChecklist();
  renderSettings();
  if (state.data && state.selectedSpawnIndex !== null) {
    selectSpawn(state.selectedSpawnIndex);
  }
}

function updateLocalStorageError(error) {
  state.localStorageError = error instanceof Error
    ? error.message
    : String(error || "Browser storage is unavailable.");
}

function normalizeThemeId(value, { allowCustom = true } = {}) {
  const id = String(value || "").trim().toLowerCase();
  if (Object.hasOwn(THEME_PRESETS, id)) return id;
  if (allowCustom && id === "custom") return id;
  return "default";
}

function normalizeHexColor(value, fallback) {
  const source = String(value || "").trim();
  const expanded = source.match(/^#([0-9a-f]{3})$/i)
    ? `#${source.slice(1).split("").map((part) => part + part).join("")}`
    : source;
  return /^#[0-9a-f]{6}$/i.test(expanded) ? expanded.toLowerCase() : fallback;
}

function normalizeThemeColors(value, fallback = DEFAULT_CUSTOM_THEME) {
  const source = value && typeof value === "object" ? value : {};
  return Object.fromEntries(THEME_COLOR_FIELDS.map((field) => [
    field.id,
    normalizeHexColor(source[field.id], fallback[field.id]),
  ]));
}

function defaultPreferences() {
  return {
    ...DEFAULT_PREFERENCES,
    customTheme: normalizeThemeColors(DEFAULT_CUSTOM_THEME),
  };
}

function hexColorRgb(value) {
  const normalized = normalizeHexColor(value, "#000000");
  return [1, 3, 5].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16));
}

function themeColorsFor(id, customColors = state.preferences.customTheme) {
  const themeId = normalizeThemeId(id);
  if (themeId === "custom") return normalizeThemeColors(customColors);
  return normalizeThemeColors(THEME_PRESETS[themeId].colors, THEME_PRESETS.default.colors);
}

function setThemeVariables(element, colors) {
  const normalized = normalizeThemeColors(colors, THEME_PRESETS.default.colors);
  const [backgroundR, backgroundG, backgroundB] = hexColorRgb(normalized.background);
  const [panelR, panelG, panelB] = hexColorRgb(normalized.surface);
  const [primaryR, primaryG, primaryB] = hexColorRgb(normalized.primary);
  const [highlightR, highlightG, highlightB] = hexColorRgb(normalized.highlight);
  const properties = {
    "--background": normalized.background,
    "--background-2": normalized.backgroundAlt,
    "--background-rgb": `${backgroundR}, ${backgroundG}, ${backgroundB}`,
    "--panel": normalized.surface,
    "--panel-2": normalized.surfaceRaised,
    "--line": normalized.border,
    "--text": normalized.text,
    "--muted": normalized.muted,
    "--accent": normalized.primary,
    "--accent-strong": normalized.secondary,
    "--accent-2": normalized.highlight,
    "--panel-rgb": `${panelR}, ${panelG}, ${panelB}`,
    "--accent-rgb": `${primaryR}, ${primaryG}, ${primaryB}`,
    "--accent-2-rgb": `${highlightR}, ${highlightG}, ${highlightB}`,
  };
  Object.entries(properties).forEach(([property, value]) => element.style.setProperty(property, value));
  return normalized;
}

function applyThemePreference() {
  const id = normalizeThemeId(state.preferences.theme);
  const colors = themeColorsFor(id, state.preferences.customTheme);
  state.preferences.theme = id;
  state.preferences.customTheme = normalizeThemeColors(state.preferences.customTheme);
  document.documentElement.dataset.theme = id;
  document.documentElement.dataset.themeMotif = id === "custom" ? "custom" : THEME_PRESETS[id].motif;
  setThemeVariables(document.documentElement, colors);
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.content = colors.surface;
}

function loadLocalTracking() {
  state.localStorageError = "";
  try {
    const rawTracking = window.localStorage.getItem(LOCAL_TRACKING_STORAGE_KEY);
    const rawCompleted = window.localStorage.getItem(LOCAL_COMPLETION_STORAGE_KEY);
    const rawPreferences = window.localStorage.getItem(LOCAL_PREFERENCES_STORAGE_KEY);
    const trackingEntries = rawTracking ? JSON.parse(rawTracking) : [];
    const completedEntries = rawCompleted ? JSON.parse(rawCompleted) : [];
    const preferences = rawPreferences ? JSON.parse(rawPreferences) : {};
    const normalizedTracking = Array.isArray(trackingEntries)
      ? trackingEntries.map(normalizeTrackingEntry).filter(Boolean)
      : [];
    state.tracking = new Map(normalizedTracking.map((entry) => [entry.id, entry]));
    state.completed = new Set(Array.isArray(completedEntries)
      ? completedEntries.map((entry) => String(entry || "").trim()).filter(Boolean)
      : []);
    state.preferences = {
      ...defaultPreferences(),
      showMagicAttack: Boolean(preferences?.showMagicAttack),
      language: window.AniipediaI18n.normalizeLocale(preferences?.language),
      theme: normalizeThemeId(preferences?.theme),
      customTheme: normalizeThemeColors(preferences?.customTheme),
    };
  } catch (error) {
    state.tracking = new Map();
    state.completed = new Set();
    state.preferences = defaultPreferences();
    updateLocalStorageError(error);
  }
}

function persistLocalTracking() {
  try {
    window.localStorage.setItem(
      LOCAL_TRACKING_STORAGE_KEY,
      JSON.stringify([...state.tracking.values()]),
    );
    window.localStorage.setItem(
      LOCAL_COMPLETION_STORAGE_KEY,
      JSON.stringify([...state.completed]),
    );
    window.localStorage.setItem(
      LOCAL_PREFERENCES_STORAGE_KEY,
      JSON.stringify(state.preferences),
    );
    state.localStorageError = "";
    return true;
  } catch (error) {
    updateLocalStorageError(error);
    return false;
  }
}

function clearLocalTracking() {
  try {
    window.localStorage.removeItem(LOCAL_TRACKING_STORAGE_KEY);
    window.localStorage.removeItem(LOCAL_COMPLETION_STORAGE_KEY);
    window.localStorage.removeItem(LOCAL_PREFERENCES_STORAGE_KEY);
    state.localStorageError = "";
    return true;
  } catch (error) {
    updateLocalStorageError(error);
    return false;
  }
}

function initializeLocalTracking() {
  loadLocalTracking();
  refreshAccountViews();
}

async function saveTrackingEntry(entry) {
  if (!entry) return;
  state.pendingTrackingIds.add(entry.id);
  renderTracking();
  try {
    const saved = normalizeTrackingEntry(entry);
    if (saved) state.tracking.set(saved.id, saved);
    persistLocalTracking();
  } finally {
    state.pendingTrackingIds.delete(entry.id);
    refreshAccountViews();
  }
}

async function addTrackingForSpawn(spawn, item) {
  const entry = trackingEntryForSpawn(spawn, item);
  if (!entry) return;
  const existing = state.tracking.get(entry.id);
  if (existing) entry.started_at = existing.started_at;
  await saveTrackingEntry(entry);
}

async function updateTrackingStarted(id, startedAt) {
  const entry = state.tracking.get(id);
  if (!entry) return;
  await saveTrackingEntry({ ...entry, started_at: startedAt });
}

async function removeTracking(id) {
  if (!state.tracking.has(id)) return;
  state.pendingTrackingIds.add(id);
  renderTracking();
  try {
    state.tracking.delete(id);
    persistLocalTracking();
  } finally {
    state.pendingTrackingIds.delete(id);
    refreshAccountViews();
  }
}

function resetLocalData() {
  if (state.pendingReset) return;
  if (!window.confirm("Reset all browser-saved timers and checklist progress on this device?")) return;
  state.pendingReset = true;
  renderSettings();
  try {
    state.tracking = new Map();
    state.completed = new Set();
    state.preferences = defaultPreferences();
    applyThemePreference();
    state.settingsThemeDraft = themeDraftFromPreferences();
    clearLocalTracking();
  } finally {
    state.pendingReset = false;
    refreshAccountViews();
  }
}

function compareTrackingEntries(a, b) {
  const aReadyAt = trackingReadyAt(a);
  const bReadyAt = trackingReadyAt(b);
  if (Boolean(aReadyAt) !== Boolean(bReadyAt)) return aReadyAt ? -1 : 1;
  if (aReadyAt && bReadyAt && aReadyAt !== bReadyAt) return aReadyAt - bReadyAt;
  const nameCompare = compareText(a.display_name, b.display_name);
  if (nameCompare !== 0) return nameCompare;
  return compareText(a.id, b.id);
}

function updateTrackingCountdowns() {
  if (state.sidebarView !== "tracking") return;
  const now = Date.now();
  els.trackingList.querySelectorAll("[data-tracking-id]").forEach((card) => {
    const entry = state.tracking.get(card.dataset.trackingId);
    const countdown = card.querySelector("[data-tracking-countdown]");
    if (!entry || !countdown || !entry.started_at) return;
    const remaining = Math.max(0, trackingReadyAt(entry) - now);
    card.classList.toggle("is-ready", remaining === 0);
    countdown.textContent = remaining ? `Respawns in ${formatCountdown(remaining / 1000)}` : "Ready now";
  });
}

function stopTrackingTicker() {
  if (!state.trackingTicker) return;
  window.clearInterval(state.trackingTicker);
  state.trackingTicker = 0;
}

function startTrackingTicker() {
  stopTrackingTicker();
  if (state.sidebarView !== "tracking") return;
  state.trackingTicker = window.setInterval(updateTrackingCountdowns, TRACKING_TICK_MS);
}

function renderTracking() {
  const entries = [...state.tracking.values()].sort(compareTrackingEntries);
  els.trackingCount.textContent = `${entries.length} tracked`;
  els.trackingList.textContent = "";

  if (state.localStorageError) {
    els.trackingList.append(renderSyncCallout(
      "Browser storage is unavailable",
      "Tracking changes will remain open only until this page is closed.",
      { label: "Retry browser storage", onClick: () => { loadLocalTracking(); refreshAccountViews(); }, danger: true },
    ));
  }
  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "tracking-empty";
    empty.textContent = "No items tracked";
    els.trackingList.append(empty);
    return;
  }

  const now = Date.now();
  const fragment = document.createDocumentFragment();
  entries.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "tracking-card";
    card.dataset.trackingId = entry.id;
    const pending = state.pendingTrackingIds.has(entry.id);

    const header = document.createElement("div");
    header.className = "tracking-card-header";
    header.append(makeIcon("tracking-icon", entry.icon));

    const title = document.createElement("div");
    title.className = "tracking-card-title";
    const name = document.createElement("strong");
    name.textContent = entry.display_name;
    name.title = entry.display_name;
    const location = document.createElement("small");
    location.textContent = [
      entry.map_label,
      entry.area_name,
      `X ${formatCoordinate(entry.x)}, Y ${formatCoordinate(entry.y)}`,
    ].filter(Boolean).join(" - ");
    location.title = location.textContent;
    title.append(name, location);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "tracking-remove";
    remove.textContent = "Remove";
    remove.title = "Remove from tracking";
    remove.disabled = pending;
    remove.addEventListener("click", () => removeTracking(entry.id));
    header.append(title, remove);

    const status = document.createElement("div");
    status.className = "tracking-status";
    const statusLabel = document.createElement("span");
    statusLabel.className = "tracking-status-label";
    const countdown = document.createElement("strong");
    countdown.className = "tracking-countdown";
    countdown.dataset.trackingCountdown = "";
    const readyAt = trackingReadyAt(entry);
    if (readyAt) {
      const readyDate = new Date(readyAt);
      const remaining = Math.max(0, readyAt - now);
      card.classList.toggle("is-ready", remaining === 0);
      statusLabel.textContent = `${respawnEvidenceLabel(entry)}: ready at ${formatLocalReadyTime(readyAt)}`;
      statusLabel.title = `${respawnEvidenceTitle(entry)} ${readyDate.toLocaleString()}`;
      countdown.textContent = remaining ? `Respawns in ${formatCountdown(remaining / 1000)}` : "Ready now";
    } else {
      statusLabel.textContent = `${respawnEvidenceLabel(entry)} respawn: ${entry.respawn_label || formatRespawnDuration(entry.respawn_seconds)}`;
      statusLabel.title = respawnEvidenceTitle(entry);
      countdown.textContent = "Not tracking";
    }
    status.append(statusLabel, countdown);

    const actions = document.createElement("div");
    actions.className = "tracking-actions";
    const action = document.createElement("button");
    action.type = "button";
    action.textContent = readyAt ? "Reset" : "Start Tracking";
    action.disabled = pending;
    action.addEventListener("click", () => {
      updateTrackingStarted(entry.id, readyAt ? null : new Date().toISOString());
    });
    actions.append(action);

    card.append(header, status, actions);
    fragment.append(card);
  });
  els.trackingList.append(fragment);
  updateTrackingCountdowns();
}

function themeDraftFromPreferences() {
  return {
    id: normalizeThemeId(state.preferences.theme),
    customColors: normalizeThemeColors(state.preferences.customTheme),
  };
}

function themeDraftMatchesPreferences(draft) {
  if (!draft || normalizeThemeId(draft.id) !== normalizeThemeId(state.preferences.theme)) return false;
  return THEME_COLOR_FIELDS.every((field) => (
    normalizeThemeColors(draft.customColors)[field.id] === normalizeThemeColors(state.preferences.customTheme)[field.id]
  ));
}

function themeDraftColors(draft) {
  return themeColorsFor(draft?.id, draft?.customColors);
}

function updateThemePreview(preview, draft) {
  if (!preview || !draft) return;
  const colors = setThemeVariables(preview, themeDraftColors(draft));
  const preset = draft.id === "custom" ? null : THEME_PRESETS[normalizeThemeId(draft.id)];
  preview.dataset.themePreview = draft.id;
  preview.dataset.themeMotif = preset?.motif || "custom";
  const name = preview.querySelector("[data-theme-preview-name]");
  if (name) name.textContent = preset?.label || "Custom";
  preview.querySelectorAll("[data-theme-preview-swatch]").forEach((swatch) => {
    const color = colors[swatch.dataset.themePreviewSwatch];
    if (color) swatch.style.background = color;
  });
}

function renderThemePreview(draft) {
  const preview = document.createElement("div");
  preview.className = "theme-preview";
  preview.setAttribute("aria-label", "Live theme preview");

  const header = document.createElement("div");
  header.className = "theme-preview-header";
  const heading = document.createElement("div");
  const eyebrow = document.createElement("small");
  eyebrow.textContent = "Live preview";
  const title = document.createElement("strong");
  title.dataset.themePreviewName = "";
  heading.append(eyebrow, title);
  const unchangedAssets = document.createElement("div");
  unchangedAssets.className = "theme-preview-assets";
  [THEME_PRESETS.emberpup, THEME_PRESETS.pawney].forEach((preset) => {
    const image = document.createElement("img");
    image.src = preset.icon;
    image.alt = `${preset.label} game asset (unchanged)`;
    image.title = "Game assets keep their original colors";
    unchangedAssets.append(image);
  });
  header.append(heading, unchangedAssets);

  const nav = document.createElement("div");
  nav.className = "theme-preview-nav";
  const motif = document.createElement("span");
  motif.className = "theme-preview-motif";
  motif.setAttribute("aria-hidden", "true");
  const navLabel = document.createElement("strong");
  navLabel.textContent = "Aniimo index";
  const active = document.createElement("span");
  active.className = "theme-preview-active";
  active.textContent = "Active";
  nav.append(motif, navLabel, active);

  const card = document.createElement("div");
  card.className = "theme-preview-card";
  const badge = document.createElement("span");
  badge.className = "theme-preview-badge";
  badge.textContent = "Highlight";
  const cardTitle = document.createElement("strong");
  cardTitle.textContent = "Raised card and border";
  const copy = document.createElement("p");
  copy.textContent = "Primary and muted text remain readable across every surface.";
  const divider = document.createElement("div");
  divider.className = "theme-preview-divider";
  const actions = document.createElement("div");
  actions.className = "theme-preview-actions";
  const primary = document.createElement("button");
  primary.type = "button";
  primary.textContent = "Primary action";
  primary.tabIndex = -1;
  const hovered = document.createElement("button");
  hovered.type = "button";
  hovered.className = "theme-preview-hover";
  hovered.textContent = "Hover state";
  hovered.tabIndex = -1;
  actions.append(primary, hovered);
  card.append(badge, cardTitle, copy, divider, actions);

  const swatches = document.createElement("div");
  swatches.className = "theme-preview-swatches";
  THEME_COLOR_FIELDS.forEach((field) => {
    const swatch = document.createElement("span");
    swatch.dataset.themePreviewSwatch = field.id;
    swatch.title = field.label;
    swatches.append(swatch);
  });
  const rarity = document.createElement("div");
  rarity.className = "theme-preview-rarity";
  const rarityLabel = document.createElement("small");
  rarityLabel.textContent = "Rarity glows stay unchanged";
  const rarityTiers = document.createElement("div");
  ["Grey", "Blue", "Purple", "Gold"].forEach((tier) => {
    const chip = document.createElement("span");
    chip.className = `theme-preview-rarity-chip theme-preview-rarity-chip--${tier.toLowerCase()}`;
    chip.textContent = tier;
    rarityTiers.append(chip);
  });
  rarity.append(rarityLabel, rarityTiers);
  preview.append(header, nav, card, swatches, rarity);
  updateThemePreview(preview, draft);
  return preview;
}

function renderThemeSettingsCard() {
  if (!state.settingsThemeDraft) state.settingsThemeDraft = themeDraftFromPreferences();
  const draft = state.settingsThemeDraft;
  const section = document.createElement("section");
  section.className = "settings-card settings-theme-card";

  const copy = document.createElement("div");
  copy.className = "settings-account";
  const title = document.createElement("strong");
  title.textContent = "Website theme";
  const detail = document.createElement("small");
  detail.textContent = "Preview UI colors and motifs here. Game artwork and rarity glows always keep their original colors.";
  copy.append(title, detail);

  const choices = document.createElement("div");
  choices.className = "theme-preset-grid";
  [...Object.values(THEME_PRESETS), { id: "custom", label: "Custom", description: "Build and save your own palette.", icon: "" }]
    .forEach((preset) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "theme-preset";
      button.dataset.themeChoice = preset.id;
      button.setAttribute("aria-pressed", String(draft.id === preset.id));
      if (preset.icon) {
        const image = document.createElement("img");
        image.src = preset.icon;
        image.alt = "";
        button.append(image);
      } else {
        const glyph = document.createElement("span");
        glyph.className = `theme-preset-glyph theme-preset-glyph--${preset.id}`;
        glyph.setAttribute("aria-hidden", "true");
        button.append(glyph);
      }
      const text = document.createElement("span");
      const name = document.createElement("strong");
      name.textContent = preset.label;
      const description = document.createElement("small");
      description.textContent = preset.description;
      text.append(name, description);
      button.append(text);
      button.addEventListener("click", () => {
        draft.id = preset.id;
        renderSettings();
      });
      choices.append(button);
    });

  const preview = renderThemePreview(draft);
  section.append(copy, choices, preview);

  if (draft.id === "custom") {
    const customHeader = document.createElement("div");
    customHeader.className = "theme-custom-heading";
    const customTitle = document.createElement("strong");
    customTitle.textContent = "Custom colors";
    const customHint = document.createElement("small");
    customHint.textContent = "Changes update the example above immediately and remain a draft until Apply theme.";
    customHeader.append(customTitle, customHint);

    const starters = document.createElement("div");
    starters.className = "theme-starter-actions";
    Object.values(THEME_PRESETS).forEach((preset) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `Start from ${preset.label}`;
      button.addEventListener("click", () => {
        draft.customColors = normalizeThemeColors(preset.colors);
        renderSettings();
      });
      starters.append(button);
    });

    const editor = document.createElement("div");
    editor.className = "theme-color-editor";
    THEME_COLOR_FIELDS.forEach((field) => {
      const row = document.createElement("label");
      row.className = "theme-color-field";
      const rowCopy = document.createElement("span");
      const fieldName = document.createElement("strong");
      fieldName.textContent = field.label;
      const fieldDescription = document.createElement("small");
      fieldDescription.textContent = field.description;
      rowCopy.append(fieldName, fieldDescription);
      const controls = document.createElement("span");
      controls.className = "theme-color-controls";
      const picker = document.createElement("input");
      picker.type = "color";
      picker.value = normalizeThemeColors(draft.customColors)[field.id];
      picker.setAttribute("aria-label", field.label);
      const value = document.createElement("input");
      value.type = "text";
      value.value = picker.value;
      value.maxLength = 7;
      value.spellcheck = false;
      value.dataset.i18nSkip = "";
      value.setAttribute("aria-label", `${field.label} hex color`);
      const update = (nextValue) => {
        const valid = /^#[0-9a-f]{6}$/i.test(nextValue);
        value.setAttribute("aria-invalid", String(!valid));
        if (!valid) return;
        const color = nextValue.toLowerCase();
        draft.customColors[field.id] = color;
        picker.value = color;
        value.value = color;
        updateThemePreview(preview, draft);
      };
      picker.addEventListener("input", () => update(picker.value));
      value.addEventListener("input", () => update(value.value.trim()));
      controls.append(picker, value);
      row.append(rowCopy, controls);
      editor.append(row);
    });
    section.append(customHeader, starters, editor);
  }

  const actions = document.createElement("div");
  actions.className = "theme-apply-actions";
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.textContent = "Reset preview";
  cancel.disabled = themeDraftMatchesPreferences(draft);
  cancel.addEventListener("click", () => {
    state.settingsThemeDraft = themeDraftFromPreferences();
    renderSettings();
  });
  const apply = document.createElement("button");
  apply.type = "button";
  apply.className = "theme-apply-button";
  apply.textContent = themeDraftMatchesPreferences(draft) ? "Theme applied" : "Apply theme";
  apply.disabled = themeDraftMatchesPreferences(draft);
  apply.addEventListener("click", () => {
    state.preferences.theme = normalizeThemeId(draft.id);
    state.preferences.customTheme = normalizeThemeColors(draft.customColors);
    persistLocalTracking();
    applyThemePreference();
    state.settingsThemeDraft = themeDraftFromPreferences();
    renderSettings();
  });
  actions.append(cancel, apply);
  section.append(actions);
  return section;
}

function renderSettingsTabs() {
  const tabs = document.createElement("div");
  tabs.className = "settings-tabs";
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("aria-label", "Settings sections");
  const options = [
    { id: "general", label: "General Settings" },
    { id: "themes", label: "Themes" },
  ];
  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.id = `settingsTab-${option.id}`;
    button.className = "settings-tab";
    button.dataset.settingsTab = option.id;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(state.settingsActiveTab === option.id));
    button.setAttribute("aria-controls", "settingsTabPanel");
    button.tabIndex = state.settingsActiveTab === option.id ? 0 : -1;
    button.textContent = option.label;
    button.addEventListener("click", () => {
      state.settingsActiveTab = option.id;
      renderSettings();
      els.settingsContent.closest(".settings-dialog")?.scrollTo({ top: 0 });
      els.settingsContent.querySelector(`[data-settings-tab="${option.id}"]`)?.focus();
    });
    button.addEventListener("keydown", (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = options[(index + direction + options.length) % options.length];
      state.settingsActiveTab = next.id;
      renderSettings();
      els.settingsContent.querySelector(`[data-settings-tab="${next.id}"]`)?.focus();
    });
    tabs.append(button);
  });
  return tabs;
}

function appendSettingsStorageError(container) {
  if (!state.localStorageError) return;
  container.append(renderSyncCallout(
    "Browser storage is unavailable",
    "The browser did not allow the map to save tracking data.",
    { label: "Retry browser storage", onClick: () => { loadLocalTracking(); refreshAccountViews(); }, danger: true },
  ));
}

function renderSettings() {
  els.settingsContent.textContent = "";
  if (!['general', 'themes'].includes(state.settingsActiveTab)) state.settingsActiveTab = "general";
  const tabs = renderSettingsTabs();
  const settingsPanel = document.createElement("div");
  settingsPanel.id = "settingsTabPanel";
  settingsPanel.className = "settings-tab-panel";
  settingsPanel.setAttribute("role", "tabpanel");
  settingsPanel.setAttribute("aria-labelledby", `settingsTab-${state.settingsActiveTab}`);
  els.settingsContent.append(tabs, settingsPanel);

  if (state.settingsActiveTab === "themes") {
    const themeCard = renderThemeSettingsCard();
    const themeActions = themeCard.querySelector(".theme-apply-actions");
    settingsPanel.append(themeCard);
    appendSettingsStorageError(settingsPanel);
    if (themeActions) {
      themeActions.classList.add("settings-theme-footer");
      els.settingsContent.append(themeActions);
    }
    return;
  }

  const languageCard = document.createElement("section");
  languageCard.className = "settings-card settings-language-card";
  const languageCopy = document.createElement("div");
  languageCopy.className = "settings-account";
  const languageTitle = document.createElement("strong");
  languageTitle.textContent = "Language";
  const languageDetail = document.createElement("small");
  languageDetail.textContent = "Game data and website interface";
  languageCopy.append(languageTitle, languageDetail);
  const languageLabel = document.createElement("label");
  languageLabel.className = "settings-language-field";
  const languageLabelText = document.createElement("span");
  languageLabelText.textContent = "Display language";
  const languageSelect = document.createElement("select");
  Object.entries(window.AniipediaI18n.languages).forEach(([locale, metadata]) => {
    const option = document.createElement("option");
    option.value = locale;
    option.textContent = metadata.label;
    option.dataset.i18nSkip = "";
    languageSelect.append(option);
  });
  languageSelect.value = state.preferences.language;
  languageSelect.addEventListener("change", () => {
    state.preferences.language = window.AniipediaI18n.normalizeLocale(languageSelect.value);
    persistLocalTracking();
    window.location.reload();
  });
  languageLabel.append(languageLabelText, languageSelect);
  const languageNote = document.createElement("small");
  languageNote.className = "settings-language-note";
  languageNote.textContent = "Language changes apply after the page reloads.";
  languageCard.append(languageCopy, languageLabel, languageNote);
  settingsPanel.append(languageCard);

  const account = document.createElement("div");
  account.className = "settings-card";
  const identity = document.createElement("div");
  identity.className = "settings-account";
  const name = document.createElement("strong");
  name.textContent = "This browser";
  const detail = document.createElement("small");
  detail.textContent = "Local tracking and checklist data";
  identity.append(name, detail);

  const stats = document.createElement("div");
  stats.className = "settings-stats";
  const timerStat = document.createElement("div");
  timerStat.className = "settings-stat";
  const timerValue = document.createElement("strong");
  timerValue.textContent = String(state.tracking.size);
  const timerLabel = document.createElement("span");
  timerLabel.textContent = "Tracked items";
  timerStat.append(timerValue, timerLabel);
  const completeStat = document.createElement("div");
  completeStat.className = "settings-stat";
  const completeValue = document.createElement("strong");
  completeValue.textContent = String(totalChecklistCompletions());
  const completeLabel = document.createElement("span");
  completeLabel.textContent = "Checklist entries";
  completeStat.append(completeValue, completeLabel);
  stats.append(timerStat, completeStat);

  const actions = document.createElement("div");
  actions.className = "settings-actions";
  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "settings-danger";
  reset.textContent = state.pendingReset ? "Resetting..." : "Reset browser data";
  reset.disabled = state.pendingReset;
  reset.addEventListener("click", resetLocalData);
  actions.append(reset);
  account.append(identity, stats, actions);
  settingsPanel.append(account);

  const aniilogDisplay = document.createElement("section");
  aniilogDisplay.className = "settings-card settings-display-card";
  const displayCopy = document.createElement("div");
  displayCopy.className = "settings-account";
  const displayTitle = document.createElement("strong");
  displayTitle.textContent = "Aniilog display";
  const displayDetail = document.createElement("small");
  displayDetail.textContent = "Choose whether legacy stats appear in Aniilog comparison bars.";
  displayCopy.append(displayTitle, displayDetail);

  const magicAttackToggle = document.createElement("label");
  magicAttackToggle.className = "settings-toggle";
  const magicAttackInput = document.createElement("input");
  magicAttackInput.type = "checkbox";
  magicAttackInput.checked = Boolean(state.preferences.showMagicAttack);
  magicAttackInput.addEventListener("change", () => {
    state.preferences.showMagicAttack = magicAttackInput.checked;
    if (!magicAttackInput.checked && state.catalogSort.aniilog === "magic-attack") {
      state.catalogSort.aniilog = "aniilog-number";
    }
    persistLocalTracking();
    renderSettings();
    if (state.sidebarView === "aniilog") renderCatalogPreview();
  });
  const magicAttackCopy = document.createElement("span");
  const magicAttackLabel = document.createElement("strong");
  magicAttackLabel.textContent = "Show Magic Attack";
  const magicAttackDescription = document.createElement("small");
  magicAttackDescription.textContent = "Hidden by default because Magic Attack is not currently used.";
  magicAttackCopy.append(magicAttackLabel, magicAttackDescription);
  magicAttackToggle.append(magicAttackInput, magicAttackCopy);
  aniilogDisplay.append(displayCopy, magicAttackToggle);
  settingsPanel.append(aniilogDisplay);
  appendSettingsStorageError(settingsPanel);
}

function openSettings() {
  if (state.settingsOpen) return;
  state.settingsOpen = true;
  state.settingsFocusReturn = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  state.settingsThemeDraft = themeDraftFromPreferences();
  renderSettings();
  els.settingsOverlay.hidden = false;
  els.settingsButton.setAttribute("aria-expanded", "true");
  window.requestAnimationFrame(() => els.settingsCloseButton.focus());
}

function closeSettings() {
  if (!state.settingsOpen) return;
  if (!themeDraftMatchesPreferences(state.settingsThemeDraft)) {
    const message = window.AniipediaI18n.translate(
      "You have unapplied theme changes. Close Settings and discard this draft?",
    );
    if (!window.confirm(message)) return;
  }
  state.settingsOpen = false;
  state.settingsThemeDraft = null;
  els.settingsOverlay.hidden = true;
  els.settingsButton.setAttribute("aria-expanded", "false");
  const focusTarget = state.settingsFocusReturn || els.settingsButton;
  state.settingsFocusReturn = null;
  focusTarget.focus();
}

function renderGitHubChangelog(commits) {
  const fragment = document.createDocumentFragment();
  const publicCommits = commits
    .filter((entry) => !CHANGELOG_INTERNAL_MARKER_RE.test(String(entry?.commit?.message || "")))
    .slice(0, CHANGELOG_PUBLIC_ENTRY_LIMIT);
  publicCommits.forEach((entry) => {
    const commit = entry?.commit || {};
    const subject = String(commit.message || "GitHub update").split(/\r?\n/, 1)[0];
    const sha = String(entry?.sha || "").slice(0, 7);
    const url = String(entry?.html_url || "");
    const dateValue = commit?.committer?.date || commit?.author?.date || "";
    const date = dateValue ? new Date(dateValue) : null;
    const article = document.createElement("article");
    article.className = "changelog-release";
    const header = document.createElement("header");
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = subject;
    link.title = "View this commit diff on GitHub";
    const time = document.createElement("time");
    if (date && !Number.isNaN(date.getTime())) {
      time.dateTime = date.toISOString();
      time.textContent = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
    }
    header.append(link, time);
    const metadata = document.createElement("p");
    metadata.className = "changelog-commit-sha";
    metadata.textContent = sha ? `Commit ${sha}` : "GitHub commit";
    article.append(header, metadata);
    fragment.append(article);
  });
  if (!publicCommits.length) {
    const empty = document.createElement("p");
    empty.textContent = "No published changes are available.";
    fragment.append(empty);
  }
  els.changelogContent.replaceChildren(fragment);
}

async function loadGitHubChangelog() {
  const token = ++state.changelogLoadToken;
  els.changelogContent.textContent = "Loading GitHub changes...";
  try {
    const response = await fetch(GITHUB_COMMITS_URL, {
      cache: "no-store",
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const commits = await response.json();
    if (token !== state.changelogLoadToken) return;
    if (!Array.isArray(commits) || !commits.length) throw new Error("No commits were returned");
    renderGitHubChangelog(commits);
  } catch (error) {
    if (token !== state.changelogLoadToken) return;
    els.changelogContent.textContent = "The changelog is unavailable right now. You can still view all changes on GitHub.";
    els.changelogContent.classList.add("changelog-error");
  }
}

function openChangelog() {
  if (state.changelogOpen) return;
  state.changelogOpen = true;
  state.changelogFocusReturn = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  els.changelogOverlay.hidden = false;
  els.appVersion.setAttribute("aria-expanded", "true");
  els.changelogContent.classList.remove("changelog-error");
  void loadGitHubChangelog();
  window.requestAnimationFrame(() => els.changelogCloseButton.focus());
}

function closeChangelog() {
  if (!state.changelogOpen) return;
  state.changelogOpen = false;
  state.changelogLoadToken += 1;
  els.changelogOverlay.hidden = true;
  els.appVersion.setAttribute("aria-expanded", "false");
  const focusTarget = state.changelogFocusReturn || els.appVersion;
  state.changelogFocusReturn = null;
  focusTarget.focus();
}

function isCatalogView(view = state.sidebarView) {
  return view === "aniilog" || view === "itemlog";
}

const ANIILOG_CLASS_ORDER = Object.freeze(["DPS", "REGEN", "BREAK", "HEALER", "SUPPORT"]);

function ensureAniilogData() {
  if (state.aniilogData) return Promise.resolve(state.aniilogData);
  if (state.aniilogLoadPromise) return state.aniilogLoadPromise;

  state.aniilogLoadPromise = fetch(ANIILOG_DATA_URL)
    .then(async (response) => {
      if (!response.ok) throw new Error(`Could not load ${ANIILOG_DATA_URL}`);
      const payload = await response.json();
      if (!Array.isArray(payload?.entries) || !payload?.totals) {
        throw new Error("Aniilog data has an invalid format");
      }
      window.AniipediaI18n.registerDisplay(payload.localizations);
      state.aniilogData = payload;
      state.aniilogLoadError = "";
      return payload;
    })
    .catch((error) => {
      state.aniilogData = null;
      state.aniilogLoadError = error instanceof Error ? error.message : String(error);
      return null;
    })
    .finally(() => {
      state.aniilogLoadPromise = null;
      if (state.sidebarView === "aniilog") renderCatalogPreview();
    });

  return state.aniilogLoadPromise;
}

function preloadAniilogData() {
  void ensureAniilogData().catch(() => {});
}

function ensureItemlogData() {
  if (state.itemlogData) return Promise.resolve(state.itemlogData);
  if (state.itemlogLoadPromise) return state.itemlogLoadPromise;

  state.itemlogLoadPromise = fetch(ITEMLOG_DATA_URL)
    .then(async (response) => {
      if (!response.ok) throw new Error(`Could not load ${ITEMLOG_DATA_URL}`);
      const payload = await response.json();
      if (!Array.isArray(payload?.entries) || !Array.isArray(payload?.categories) || !payload?.totals) {
        throw new Error("Item-log data has an invalid format");
      }
      state.itemlogData = payload;
      state.itemlogLoadError = "";
      return payload;
    })
    .catch((error) => {
      state.itemlogData = null;
      state.itemlogLoadError = error instanceof Error ? error.message : String(error);
      return null;
    })
    .finally(() => {
      state.itemlogLoadPromise = null;
      if (state.itemlogData && state.data) updateMapMeta();
      if (state.sidebarView === "itemlog") renderCatalogPreview();
    });

  return state.itemlogLoadPromise;
}

function allCatalogEntriesForView(view = state.sidebarView) {
  if (view === "aniilog") {
    return Array.isArray(state.aniilogData?.entries) ? state.aniilogData.entries : [];
  }
  if (view === "itemlog") {
    return Array.isArray(state.itemlogData?.entries) ? state.itemlogData.entries : [];
  }
  return [];
}

function catalogLoadErrorForView(view = state.sidebarView) {
  return view === "aniilog" ? state.aniilogLoadError : state.itemlogLoadError;
}

function catalogSearchForView(view = state.sidebarView) {
  return String(state.catalogSearch[view] || "");
}

function catalogCategoryForEntry(entry, view = state.sidebarView) {
  if (view === "aniilog") {
    return String(entry?.role || "Other").trim() || "Other";
  }
  return String(entry?.catalog_category || entry?.type || "Other").trim() || "Other";
}

function catalogCategoriesForView(view = state.sidebarView) {
  if (!isCatalogView(view)) return [];
  if (view === "itemlog" && Array.isArray(state.itemlogData?.categories)) {
    return ["all", ...state.itemlogData.categories.map((category) => category?.id).filter(Boolean)];
  }
  const entries = allCatalogEntriesForView(view);
  const categories = [...new Set(entries.map((entry) => catalogCategoryForEntry(entry, view)))].sort(compareText);
  if (view === "aniilog") {
    const configuredClasses = ANIILOG_CLASS_ORDER.filter((role) => categories.includes(role));
    const remainingClasses = categories.filter((role) => !configuredClasses.includes(role));
    return ["all", ...configuredClasses, ...remainingClasses];
  }
  return ["all", ...categories];
}

function itemlogExpeditionSources(entry) {
  return Array.isArray(entry?.rv_expedition_sources) ? entry.rv_expedition_sources : [];
}

const ITEMLOG_CATEGORY_COLLECTIONS = [
  {
    id: "collection:carried-items-and-runes",
    label: "Carried Items & Runes",
    categories: ["Carried Item", "Carried Item - Rune"],
  },
];
const ITEMLOG_SOURCE_METHOD_PREFIX = "method:";

function itemlogObtainMethods(entry) {
  return Array.isArray(entry?.obtain_methods) ? entry.obtain_methods : [];
}

function itemlogCategoryCollection(category) {
  return ITEMLOG_CATEGORY_COLLECTIONS.find((collection) => collection.id === category) || null;
}

function itemlogEntryMatchesCategory(entry, category) {
  if (category === "all") return true;
  const collection = itemlogCategoryCollection(category);
  const entryCategory = catalogCategoryForEntry(entry, "itemlog");
  return collection
    ? collection.categories.includes(entryCategory)
    : entryCategory === category;
}

function itemlogCategoryCount(category, entries = allCatalogEntriesForView("itemlog")) {
  return entries.filter((entry) => itemlogEntryMatchesCategory(entry, category)).length;
}

function itemlogMethodSourceId(label) {
  return `${ITEMLOG_SOURCE_METHOD_PREFIX}${String(label || "").trim()}`;
}

function itemlogMethodLabelFromSourceId(sourceId) {
  const value = String(sourceId || "");
  return value.startsWith(ITEMLOG_SOURCE_METHOD_PREFIX)
    ? value.slice(ITEMLOG_SOURCE_METHOD_PREFIX.length)
    : "";
}

function itemlogMethodSourceOptions(entries = allCatalogEntriesForView("itemlog")) {
  const methods = new Map();
  entries.forEach((entry) => {
    const entryMethods = new Map();
    itemlogObtainMethods(entry).forEach((method) => {
      const label = String(method?.label || "").trim();
      const key = label.toLowerCase();
      if (!label || key === "rv park expedition" || key === "rv park expeditions") return;
      if (!entryMethods.has(key)) entryMethods.set(key, label);
    });
    entryMethods.forEach((label, key) => {
      const existing = methods.get(key);
      if (existing) existing.count += 1;
      else methods.set(key, { id: itemlogMethodSourceId(label), label, count: 1 });
    });
  });
  return [...methods.values()].sort((left, right) => compareText(left.label, right.label));
}

function itemlogEntryMatchesFilters(entry) {
  const selectedSource = state.itemlogFilters.source;
  if (selectedSource === "all") return true;
  if (selectedSource === "rv-expedition") {
    const park = state.itemlogFilters.park;
    const tier = state.itemlogFilters.tier;
    return itemlogExpeditionSources(entry).some((source) => (
      (park === "all" || source?.park === park)
      && (tier === "all" || String(source?.duration_hours) === tier)
    ));
  }
  const selectedMethod = itemlogMethodLabelFromSourceId(selectedSource).toLowerCase();
  if (!selectedMethod) return false;
  return itemlogObtainMethods(entry).some((method) => (
    String(method?.label || "").trim().toLowerCase() === selectedMethod
  ));
}

function catalogEntriesForView(view = state.sidebarView) {
  let entries = allCatalogEntriesForView(view);
  if (view === "aniilog") {
    entries = entries.filter(aniilogEntryMatchesFilters);
  } else if (isCatalogView(view)) {
    const category = state.catalogCategory[view] || "all";
    entries = view === "itemlog"
      ? entries.filter((entry) => itemlogEntryMatchesCategory(entry, category))
      : entries.filter((entry) => category === "all" || catalogCategoryForEntry(entry, view) === category);
    if (view === "itemlog") entries = entries.filter(itemlogEntryMatchesFilters);
  }
  const query = catalogSearchForView(view).trim().toLowerCase();
  if (query) {
    const terms = query.split(/\s+/).filter(Boolean);
    entries = entries.filter((entry) => {
      const text = catalogEntrySearchText(entry);
      return terms.every((term) => text.includes(term));
    });
  }
  if (view === "aniilog") return sortAniilogEntries(entries);
  if (view === "itemlog") {
    return [...entries].sort((left, right) => (
      compareText(left?.name, right?.name)
      || compareText(left?.variant_label, right?.variant_label)
      || compareText(left?.quality, right?.quality)
      || compareText(left?.id, right?.id)
    ));
  }
  return entries;
}

function aniilogSortOptions() {
  return [
    { id: "aniilog-number", label: "Aniilog number" },
    {
      ...ANIILOG_BASE_STAT_TOTAL_OPTION,
      label: `${ANIILOG_BASE_STAT_TOTAL_OPTION.label} (high to low)`,
    },
    ...visibleAniilogStatConfig().map((stat) => ({
      id: stat.id,
      label: `${stat.label} (high to low)`,
      sourceLabel: stat.sourceLabel,
    })),
  ];
}

function aniilogSortOption() {
  const activeId = state.catalogSort.aniilog || "aniilog-number";
  return aniilogSortOptions().find((option) => option.id === activeId)
    || { id: "aniilog-number", label: "Aniilog number" };
}

function aniilogStatValue(entry, sourceLabel) {
  const value = (entry?.stats || []).find((stat) => stat.label === sourceLabel)?.value;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function aniilogSortValue(entry, sort) {
  if (sort?.id === ANIILOG_BASE_STAT_TOTAL_OPTION.id) return aniilogBaseStatTotal(entry);
  return sort?.sourceLabel ? aniilogStatValue(entry, sort.sourceLabel) : null;
}

function compareAniilogEntries(left, right) {
  const leftSpecialSort = Number(left?.special_sort);
  const rightSpecialSort = Number(right?.special_sort);
  const leftIsSpecial = Number.isFinite(leftSpecialSort);
  const rightIsSpecial = Number.isFinite(rightSpecialSort);
  if (leftIsSpecial && rightIsSpecial && leftSpecialSort !== rightSpecialSort) {
    return leftSpecialSort - rightSpecialSort;
  }
  if (leftIsSpecial !== rightIsSpecial) return leftIsSpecial ? 1 : -1;
  const numberDifference = numericSortValue(left?.aniilog_number) - numericSortValue(right?.aniilog_number);
  if (numberDifference !== 0) return numberDifference;
  const nameDifference = compareText(left?.name, right?.name);
  if (nameDifference !== 0) return nameDifference;
  return compareText(left?.form_label, right?.form_label);
}

function sortAniilogEntries(entries) {
  const sort = aniilogSortOption();
  const sorted = [...entries];
  if (sort.id === "aniilog-number") return sorted.sort(compareAniilogEntries);

  return sorted.sort((left, right) => {
    const leftValue = aniilogSortValue(left, sort);
    const rightValue = aniilogSortValue(right, sort);
    if (leftValue === null && rightValue !== null) return 1;
    if (rightValue === null && leftValue !== null) return -1;
    if (leftValue !== null && rightValue !== null && rightValue !== leftValue) {
      return rightValue - leftValue;
    }
    return compareAniilogEntries(left, right);
  });
}

function catalogAbilitySearchTerms(abilities) {
  if (!Array.isArray(abilities)) return [];
  return abilities.flatMap((ability) => {
    const combat = ability?.combat && typeof ability.combat === "object" ? ability.combat : {};
    return [
      ability?.name,
      ability?.description,
      ability?.group,
      ability?.power,
      ability?.consume,
      combat.category,
      ...(Array.isArray(combat.types) ? combat.types : []),
      combat.element,
      catalogElementLabel(combat.element),
      combat.might,
      combat.ep_cost,
      combat.break_power,
      combat.cooldown,
    ];
  });
}

function catalogEntrySearchText(entry) {
  return searchText([
    entry?.name,
    entry?.aniilog_number,
    entry?.form_label,
    entry?.classification,
    entry?.role,
    entry?.type,
    entry?.inventory,
    entry?.source,
    entry?.catalog_category,
    entry?.quality,
    entry?.description,
    entry?.variant_label,
    entry?.hatch_outcomes,
    entry?.detail_facts?.flatMap((fact) => [fact?.label, fact?.value]),
    entry?.obtain_methods?.flatMap((method) => [method?.label, method?.detail]),
    entry?.rv_expedition_sources?.flatMap((source) => [
      source?.park,
      source?.mode,
      source?.reward_kind,
      source?.duration_hours ? `${source.duration_hours}h` : "",
    ]),
    entry?.carried_effects?.base_attributes,
    entry?.carried_effects?.core_effects,
    entry?.carried_effects?.advanced_effects?.flatMap((effect) => effect?.effects),
    entry?.elements?.flatMap((element) => [element?.name, catalogElementLabel(element)]),
    entry?.stats?.flatMap((stat) => [stat?.label, stat?.value]),
    catalogAbilitySearchTerms(entry?.skills),
    catalogAbilitySearchTerms(entry?.ultimates),
    catalogAbilitySearchTerms(entry?.traits),
    catalogAbilitySearchTerms(entry?.mobility_skills),
    entry?.exploration?.flatMap((ability) => [ability?.name, ability?.description, ability?.level]),
    entry?.homeland?.flatMap((ability) => [
      ability?.name,
      catalogElementLabel(ability?.name),
      ability?.description,
      ability?.level,
    ]),
    aniilogEvolutionStage(entry)?.label,
    entry?.locations?.flatMap((location) => [location?.map_label, location?.areas]),
    entry?.spawn_requirements,
  ]);
}

function normalizeFilterKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function aniilogFilterSet(name) {
  const filters = state.aniilogFilters || {};
  if (!(filters[name] instanceof Set)) {
    filters[name] = new Set(Array.isArray(filters[name]) ? filters[name] : []);
  }
  return filters[name];
}

function aniilogFilterSectionSet() {
  if (!(state.aniilogFilterSectionsOpen instanceof Set)) {
    state.aniilogFilterSectionsOpen = new Set(Array.isArray(state.aniilogFilterSectionsOpen)
      ? state.aniilogFilterSectionsOpen
      : ["classes"]);
  }
  return state.aniilogFilterSectionsOpen;
}

function aniilogStatRules() {
  const filters = state.aniilogFilters || {};
  if (!Array.isArray(filters.statRules)) filters.statRules = [];
  return filters.statRules;
}

function hasActiveAniilogFilters() {
  const filters = state.aniilogFilters || {};
  return ["classes", "elements", "homeland", "stages", "forms"].some((name) => aniilogFilterSet(name).size)
    || aniilogStatRules().length > 0
    || (filters.mobility && filters.mobility !== "any")
    || (filters.exploration && filters.exploration !== "any")
    || (filters.coreSkill && filters.coreSkill !== "any");
}

function resetAniilogFilters() {
  ["classes", "elements", "homeland", "stages", "forms"].forEach((name) => aniilogFilterSet(name).clear());
  state.aniilogFilters.statRules = [];
  state.aniilogFilters.mobility = "any";
  state.aniilogFilters.exploration = "any";
  state.aniilogFilters.coreSkill = "any";
  updateAniilogFilterResults();
}

function toggleAniilogFilter(name, id) {
  const set = aniilogFilterSet(name);
  if (set.has(id)) {
    set.delete(id);
  } else {
    set.add(id);
  }
  updateAniilogFilterResults();
}

function addAniilogFilter(name, id) {
  if (!id) return;
  const set = aniilogFilterSet(name);
  if (set.has(id)) return;
  set.add(id);
  updateAniilogFilterResults();
}

function addAniilogTierFilter(name, id) {
  if (!id) return;
  const set = aniilogFilterSet(name);
  const separator = id.lastIndexOf(":");
  const baseId = separator === -1 ? id : id.slice(0, separator);
  const tier = separator === -1 ? "any" : id.slice(separator + 1);
  [...set].forEach((activeId) => {
    if (activeId === `${baseId}:any` || (tier === "any" && activeId.startsWith(`${baseId}:`))) {
      set.delete(activeId);
    }
  });
  if (!set.has(id)) set.add(id);
  updateAniilogFilterResults();
}

function setAniilogScalarFilter(name, value) {
  state.aniilogFilters[name] = value;
  updateAniilogFilterResults();
}

function addAniilogStatRule(statId, comparator, rawValue) {
  const value = Number(rawValue);
  if (!statId || rawValue === "" || !Number.isFinite(value)) return;
  const normalizedComparator = new Set([">", "=", "<"]).has(comparator) ? comparator : ">";
  const rules = aniilogStatRules();
  if (rules.some((rule) => (
    rule.statId === statId
    && rule.comparator === normalizedComparator
    && Number(rule.value) === value
  ))) return;
  rules.push({ statId, comparator: normalizedComparator, value });
  updateAniilogFilterResults();
}

function removeAniilogStatRule(index) {
  const rules = aniilogStatRules();
  if (index < 0 || index >= rules.length) return;
  rules.splice(index, 1);
  updateAniilogFilterResults();
}

function toggleAniilogFilterSection(id) {
  const openSections = aniilogFilterSectionSet();
  if (openSections.has(id)) {
    openSections.delete(id);
  } else {
    openSections.add(id);
  }
  renderCatalogPreview();
}

function updateAniilogFilterResults() {
  state.catalogIndexScroll.aniilog = 0;
  const visibleEntries = catalogEntriesForView("aniilog");
  if (!visibleEntries.some((entry) => entry.id === state.catalogSelection.aniilog)) {
    state.catalogSelection.aniilog = visibleEntries[0]?.id || "";
  }
  renderCatalogPreview();
}

function aniilogEvolutionStage(entry) {
  const existing = entry?.evolution_stage;
  if (existing?.id || existing?.label) {
    const label = existing.label || existing.id;
    return { id: normalizeFilterKey(existing.id || label), label };
  }
  const evolution = entry?.evolution && typeof entry.evolution === "object" ? entry.evolution : {};
  const hasFrom = Array.isArray(evolution.from) && evolution.from.length > 0;
  const hasTo = Array.isArray(evolution.to) && evolution.to.length > 0;
  if (!hasFrom && hasTo) return { id: "lumin", label: "Lumin" };
  if (hasFrom && hasTo) return { id: "gamma", label: "Gamma" };
  if (hasFrom && !hasTo) return { id: "nova", label: "Nova" };
  return null;
}

function aniilogElementOption(element) {
  const meta = catalogElementMeta(element);
  const label = catalogElementLabel(element);
  const level = Number(element?.level) || 0;
  return {
    id: `${meta.slug}:${level}`,
    label: level ? `${label} ${level}` : label,
    meta,
    level,
  };
}

function isElementalHomelandAbility(ability) {
  return HOMELAND_ELEMENT_IDS.has(String(ability?.id || ""));
}

function aniilogHomelandOption(ability) {
  const meta = catalogHomelandMeta(ability);
  const label = ability?.name || meta.label || meta.slug || "Home ability";
  const level = Number(ability?.level) || 0;
  return {
    id: `${normalizeFilterKey(label)}:${level}`,
    label: level ? `${label} ${level}` : label,
    meta,
    level,
  };
}

function aniilogSkillFilterId(skill) {
  return `skill:${normalizeFilterKey(skill?.name)}`;
}

function aniilogSkillFilterOption(skill) {
  return {
    id: aniilogSkillFilterId(skill),
    label: skill?.name || "Unknown skill",
  };
}

function sortedOptionValues(map) {
  return [...map.values()].sort((left, right) => compareText(left.label, right.label));
}

function groupedAniilogTierOptions(options) {
  const groups = new Map();
  options.forEach((option) => {
    const separator = option.id.lastIndexOf(":");
    const id = separator === -1 ? option.id : option.id.slice(0, separator);
    if (!groups.has(id)) {
      groups.set(id, {
        id,
        label: option.level ? option.label.replace(/\s+\d+$/, "") : option.label,
        meta: option.meta,
        levels: [],
      });
    }
    if (option.level && !groups.get(id).levels.includes(option.level)) {
      groups.get(id).levels.push(option.level);
    }
  });
  return [...groups.values()]
    .map((group) => ({ ...group, levels: group.levels.sort((left, right) => left - right) }))
    .sort((left, right) => compareText(left.label, right.label));
}

function aniilogTierFilterMatches(filters, option) {
  const separator = option.id.lastIndexOf(":");
  const baseId = separator === -1 ? option.id : option.id.slice(0, separator);
  return filters.has(option.id) || filters.has(`${baseId}:any`);
}

function collectAniilogFilterOptions(entries) {
  const classes = new Map();
  const elements = new Map();
  const homeland = new Map();
  const mobility = new Map();
  const exploration = new Map();
  const stages = new Map(ANIILOG_EVOLUTION_STAGES.map((stage) => [stage.id, stage]));

  entries.forEach((entry) => {
    const role = String(entry?.role || "").trim();
    if (role) {
      const id = normalizeFilterKey(role);
      classes.set(id, { id, label: role, meta: catalogRoleMeta(role), role });
    }
    (entry?.elements || []).forEach((element) => {
      const option = aniilogElementOption(element);
      elements.set(option.id, option);
    });
    (entry?.homeland || []).filter((ability) => !isElementalHomelandAbility(ability)).forEach((ability) => {
      const option = aniilogHomelandOption(ability);
      homeland.set(option.id, option);
    });
    (entry?.mobility_skills || []).forEach((skill) => {
      const option = aniilogSkillFilterOption(skill);
      if (option.id !== "skill:") mobility.set(option.id, option);
    });
    (entry?.exploration || []).forEach((skill) => {
      const option = aniilogSkillFilterOption(skill);
      if (option.id !== "skill:") exploration.set(option.id, option);
    });
  });

  const classOptions = [...classes.values()].sort((left, right) => {
    const leftIndex = ANIILOG_CLASS_ORDER.indexOf(left.role);
    const rightIndex = ANIILOG_CLASS_ORDER.indexOf(right.role);
    if (leftIndex !== -1 || rightIndex !== -1) {
      return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex);
    }
    return compareText(left.label, right.label);
  });

  return {
    classes: classOptions,
    elements: sortedOptionValues(elements),
    homeland: sortedOptionValues(homeland),
    mobility: sortedOptionValues(mobility),
    exploration: sortedOptionValues(exploration),
    stages: ANIILOG_EVOLUTION_STAGES.filter((stage) => stages.has(stage.id)),
  };
}

function aniilogSkillFilterMatches(skills, filterValue) {
  const skillsList = Array.isArray(skills) ? skills : [];
  if (!filterValue || filterValue === "any") return true;
  if (filterValue === "has") return skillsList.length > 0;
  if (filterValue === "none") return skillsList.length === 0;
  if (filterValue.startsWith("skill:")) {
    return skillsList.some((skill) => aniilogSkillFilterId(skill) === filterValue);
  }
  return true;
}

const ANIILOG_BASE_STAT_TOTAL_OPTION = {
  sourceLabel: null,
  label: "Base stat total",
  id: "base-stat-total",
};

const ANIILOG_BASE_STAT_IDS = new Set([
  "hp",
  "attack",
  "break",
  "defense",
  "magic-defense",
  "regen",
]);

function aniilogBaseStatTotal(entry) {
  return visibleAniilogStatConfig()
    .filter((stat) => ANIILOG_BASE_STAT_IDS.has(stat.id))
    .reduce((total, stat) => total + (aniilogStatValue(entry, stat.sourceLabel) ?? 0), 0);
}

function aniilogEntryMatchesFilters(entry) {
  const filters = state.aniilogFilters || {};
  const classFilters = aniilogFilterSet("classes");
  if (classFilters.size && !classFilters.has(normalizeFilterKey(entry?.role))) return false;

  const elementFilters = aniilogFilterSet("elements");
  if (elementFilters.size && !(entry?.elements || []).some((element) => aniilogTierFilterMatches(elementFilters, aniilogElementOption(element)))) {
    return false;
  }

  const homelandFilters = aniilogFilterSet("homeland");
  if (homelandFilters.size && !(entry?.homeland || [])
    .filter((ability) => !isElementalHomelandAbility(ability))
    .some((ability) => aniilogTierFilterMatches(homelandFilters, aniilogHomelandOption(ability)))) {
    return false;
  }

  const stageFilters = aniilogFilterSet("stages");
  if (stageFilters.size) {
    const stage = aniilogEvolutionStage(entry);
    if (!stage || !stageFilters.has(stage.id)) return false;
  }

  const formFilters = aniilogFilterSet("forms");
  const formKey = normalizeFilterKey(entry?.form_key || entry?.form_label);
  if (formFilters.size && !formFilters.has(formKey)) return false;

  for (const rule of aniilogStatRules()) {
    const stat = rule.statId === ANIILOG_BASE_STAT_TOTAL_OPTION.id
      ? ANIILOG_BASE_STAT_TOTAL_OPTION
      : ANIILOG_STAT_CONFIG.find((option) => option.id === rule.statId);
    const threshold = Number(rule.value);
    if (!stat || !Number.isFinite(threshold)) continue;
    const value = stat.id === ANIILOG_BASE_STAT_TOTAL_OPTION.id
      ? aniilogBaseStatTotal(entry)
      : aniilogStatValue(entry, stat.sourceLabel);
    if (value === null) return false;
    if (rule.comparator === "<" && !(value < threshold)) return false;
    if (rule.comparator === "=" && value !== threshold) return false;
    if (rule.comparator !== "<" && rule.comparator !== "=" && !(value > threshold)) return false;
  }

  if (!aniilogSkillFilterMatches(entry?.mobility_skills, filters.mobility)) return false;
  if (!aniilogSkillFilterMatches(entry?.exploration, filters.exploration)) return false;

  const hasCoreSkill = (entry?.skills || []).some((skill) => Boolean(skill?.core));
  if (filters.coreSkill === "has" && !hasCoreSkill) return false;
  if (filters.coreSkill === "none" && hasCoreSkill) return false;

  return true;
}

function appendCatalogFact(grid, label, value) {
  if (value === null || value === undefined || value === "") return;
  const fact = document.createElement("div");
  fact.className = "catalog-fact";
  const term = document.createElement("dt");
  term.textContent = label;
  const description = document.createElement("dd");
  description.textContent = String(value);
  fact.append(term, description);
  grid.append(fact);
}

function visibleAniilogStatConfig() {
  return ANIILOG_STAT_CONFIG.filter((stat) => !stat.preference || state.preferences[stat.preference]);
}

function aniilogStatRanges(entries) {
  const ranges = new Map();
  ANIILOG_STAT_CONFIG.forEach((stat) => {
    const values = entries
      .map((entry) => (entry.stats || []).find((candidate) => candidate.label === stat.sourceLabel)?.value)
      .map(Number)
      .filter(Number.isFinite);
    if (!values.length) return;
    ranges.set(stat.sourceLabel, {
      min: Math.min(...values),
      max: Math.max(...values),
    });
  });
  return ranges;
}

function normalizedAniilogStatFill(value, range) {
  if (!Number.isFinite(value) || !range) return 0;
  if (range.max <= range.min) return 100;
  const normalized = clamp((value - range.min) / (range.max - range.min), 0, 1);
  return 12 + normalized * 88;
}

function renderAniilogStatComparison(entry) {
  const stats = document.createElement("div");
  stats.className = "catalog-stat-comparison";
  const values = new Map((entry.stats || []).map((stat) => [stat.label, Number(stat.value)]));
  const ranges = aniilogStatRanges(state.aniilogData?.entries || [entry]);

  visibleAniilogStatConfig().forEach((stat) => {
    const value = values.get(stat.sourceLabel);
    const range = ranges.get(stat.sourceLabel);
    const card = document.createElement("section");
    card.className = `catalog-stat-card catalog-stat-card--${stat.id}`;
    card.style.setProperty("--catalog-stat-color", stat.color);

    const label = document.createElement("h4");
    label.className = "catalog-stat-heading";
    if (stat.icon) {
      const icon = document.createElement("img");
      icon.className = "catalog-stat-icon";
      icon.src = stat.icon;
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");
      label.append(icon);
    }
    const labelText = document.createElement("span");
    labelText.textContent = stat.label;
    label.append(labelText);
    const numericValue = document.createElement("strong");
    numericValue.className = "catalog-stat-value";
    numericValue.textContent = Number.isFinite(value) ? formatNumber(value, 0) : "-";
    const track = document.createElement("div");
    track.className = "catalog-stat-bar";
    track.setAttribute("role", "img");
    const fill = document.createElement("span");
    const fillPercent = normalizedAniilogStatFill(value, range);
    fill.style.width = `${fillPercent}%`;
    track.setAttribute(
      "aria-label",
      range && Number.isFinite(value)
        ? `${stat.label}: ${formatNumber(value, 0)}. Dataset range ${formatNumber(range.min, 0)} to ${formatNumber(range.max, 0)}.`
        : `${stat.label}: no data.`,
    );
    track.append(fill);
    const scale = document.createElement("small");
    scale.className = "catalog-stat-range";
    scale.textContent = range
      ? `${formatNumber(range.min, 0)} - ${formatNumber(range.max, 0)}`
      : "No dataset range";
    card.append(label, numericValue, track, scale);
    stats.append(card);
  });

  return stats;
}

function createCatalogSection(title) {
  const section = document.createElement("section");
  section.className = "catalog-section";
  const heading = document.createElement("h3");
  heading.textContent = title;
  section.append(heading);
  return section;
}

const CATALOG_INDEX_ROW_HEIGHT = 72;
const CATALOG_INDEX_OVERSCAN = 6;

function createCatalogIndexRow(entry, selectedId, view, virtualIndex) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "catalog-index-row";
  const isVirtual = Number.isInteger(virtualIndex);
  if (isVirtual) button.classList.add("catalog-index-row--virtual");
  if (view === "itemlog") {
    button.classList.add(
      "catalog-index-row--tiered",
      `catalog-index-row--tier-${catalogItemTier(entry.quality)}`,
    );
  }
  const selected = entry.id === selectedId;
  button.setAttribute("aria-pressed", String(selected));
  button.dataset.catalogEntryId = entry.id;
  if (isVirtual) button.style.transform = `translateY(${virtualIndex * CATALOG_INDEX_ROW_HEIGHT}px)`;

  const icon = makeIcon("catalog-index-icon", entry.icon);
  const copy = document.createElement("span");
  copy.className = "catalog-index-copy";
  const name = document.createElement("strong");
  name.textContent = entry.name;
  const meta = document.createElement("small");
  if (view === "aniilog") {
    const sort = aniilogSortOption();
    const statValue = aniilogSortValue(entry, sort);
    meta.textContent = [
      `${entry.aniilog_number || "Special"} - ${entry.form_label || "Basic"}`,
      statValue === null ? "" : `${sort.label.replace(" (high to low)", "")} ${formatNumber(statValue, 0)}`,
    ].filter(Boolean).join(" - ");
  } else {
    const defaultSubtitle = entry.list_subtitle
      || [entry.type || "Item", entry.quality].filter(Boolean).join(" - ");
    meta.textContent = entry.variant_label || defaultSubtitle;
    if (entry.variant_label && defaultSubtitle) {
      meta.title = `${defaultSubtitle} - ${entry.variant_label}`;
    }
  }
  copy.append(name, meta);
  button.append(icon, copy);
  button.addEventListener("click", () => {
    state.catalogSelection[view] = entry.id;
    renderCatalogPreview();
  });
  return button;
}

function renderCatalogIndex(entries, selectedId, view, title) {
  const index = document.createElement("nav");
  index.className = "catalog-index";
  index.setAttribute("aria-label", `${title} entries`);

  const virtualList = document.createElement("div");
  virtualList.className = "catalog-index-virtual";
  virtualList.style.height = `${Math.max(entries.length * CATALOG_INDEX_ROW_HEIGHT, CATALOG_INDEX_ROW_HEIGHT)}px`;
  index.append(virtualList);

  let animationFrame = 0;
  const refreshVisibleRows = () => {
    animationFrame = 0;
    const viewportHeight = index.clientHeight || 400;
    const start = Math.max(0, Math.floor(index.scrollTop / CATALOG_INDEX_ROW_HEIGHT) - CATALOG_INDEX_OVERSCAN);
    const end = Math.min(
      entries.length,
      Math.ceil((index.scrollTop + viewportHeight) / CATALOG_INDEX_ROW_HEIGHT) + CATALOG_INDEX_OVERSCAN,
    );
    const fragment = document.createDocumentFragment();
    for (let rowIndex = start; rowIndex < end; rowIndex += 1) {
      fragment.append(createCatalogIndexRow(entries[rowIndex], selectedId, view, rowIndex));
    }
    virtualList.replaceChildren(fragment);
  };

  index.refreshVirtualRows = refreshVisibleRows;
  index.addEventListener("scroll", () => {
    if (!animationFrame) animationFrame = window.requestAnimationFrame(refreshVisibleRows);
  }, { passive: true });
  window.requestAnimationFrame(refreshVisibleRows);

  return index;
}

function renderCatalogSearch(view, existingLabel = null) {
  const existingInput = existingLabel?.querySelector(".catalog-search");
  if (existingInput && existingLabel.dataset.catalogView === view) {
    existingInput.value = catalogSearchForView(view);
    return existingLabel;
  }

  const label = document.createElement("label");
  label.className = "catalog-search-label";
  label.dataset.catalogView = view;
  label.textContent = "Search";
  const input = document.createElement("input");
  input.className = "catalog-search";
  input.type = "search";
  input.autocomplete = "off";
  input.value = catalogSearchForView(view);
  input.placeholder = view === "aniilog" ? "Aniimo, form, skill, or effect" : "Item, type, or source";
  input.addEventListener("input", () => {
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;
    state.catalogSearch[view] = input.value;
    state.catalogIndexScroll[view] = 0;
    renderCatalogPreview({ preserveSearchInput: true });
    const nextInput = els.catalogSidebarContent.querySelector(`.catalog-search-label[data-catalog-view="${view}"] .catalog-search`);
    if (!nextInput) return;
    nextInput.focus({ preventScroll: true });
    if (selectionStart !== null && selectionEnd !== null) {
      nextInput.setSelectionRange(selectionStart, selectionEnd);
    }
  });
  label.append(input);
  return label;
}

function renderAniilogSortControl() {
  const label = document.createElement("label");
  label.className = "catalog-sort-label";
  label.textContent = "Sort";
  const select = document.createElement("select");
  select.className = "catalog-sort-select";
  select.setAttribute("aria-label", "Sort Aniimo results");
  const options = aniilogSortOptions();
  const activeSort = aniilogSortOption().id;
  options.forEach((option) => {
    const element = document.createElement("option");
    element.value = option.id;
    element.textContent = option.label;
    element.selected = option.id === activeSort;
    select.append(element);
  });
  select.addEventListener("change", () => {
    state.catalogSort.aniilog = select.value;
    state.catalogIndexScroll.aniilog = 0;
    const visibleEntries = catalogEntriesForView("aniilog");
    if (!visibleEntries.some((entry) => entry.id === state.catalogSelection.aniilog)) {
      state.catalogSelection.aniilog = visibleEntries[0]?.id || "";
    }
    renderCatalogPreview();
  });
  label.append(select);
  return label;
}

function renderAniilogActiveRule(group, option) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "aniilog-filter-rule";
  button.setAttribute("aria-label", `Remove ${option.label} filter`);
  if (option.meta?.color) button.style.setProperty("--aniilog-filter-color", option.meta.color);
  if (option.meta?.icon) {
    const icon = document.createElement("img");
    icon.className = "aniilog-filter-rule-icon";
    icon.src = option.meta.icon;
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    button.append(icon);
  }
  const text = document.createElement("span");
  text.textContent = option.label;
  const remove = document.createElement("span");
  remove.className = "aniilog-filter-rule-remove";
  remove.textContent = "x";
  remove.setAttribute("aria-hidden", "true");
  button.append(text, remove);
  button.addEventListener("click", () => toggleAniilogFilter(group, option.id));
  return button;
}

function renderAniilogFilterSection(id, title, children, activeCount = 0) {
  const section = document.createElement("section");
  section.className = "aniilog-filter-section";
  const open = aniilogFilterSectionSet().has(id);
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "aniilog-filter-section-toggle";
  toggle.setAttribute("aria-expanded", String(open));
  toggle.addEventListener("click", () => toggleAniilogFilterSection(id));

  const label = document.createElement("span");
  label.className = "aniilog-filter-section-title";
  label.textContent = title;
  const count = document.createElement("span");
  count.className = "aniilog-filter-section-count";
  count.textContent = activeCount ? String(activeCount) : "";
  const symbol = document.createElement("span");
  symbol.className = "aniilog-filter-section-symbol";
  symbol.classList.toggle("is-open", open);
  symbol.setAttribute("aria-hidden", "true");
  toggle.append(label, count, symbol);
  section.append(toggle);

  if (open) {
    const body = document.createElement("div");
    body.className = "aniilog-filter-section-body";
    body.append(...children);
    section.append(body);
  }
  return section;
}

function renderAniilogActiveRules(group, options) {
  const active = aniilogFilterSet(group);
  const optionMap = new Map(options.map((option) => [option.id, option]));
  const container = document.createElement("div");
  container.className = "aniilog-filter-active-rules";
  [...active].forEach((id) => {
    const option = optionMap.get(id);
    if (option) container.append(renderAniilogActiveRule(group, option));
  });
  return container;
}

function renderAniilogSimpleRuleBuilder(group, options, placeholder) {
  const wrapper = document.createElement("div");
  wrapper.className = "aniilog-filter-builder";
  const row = document.createElement("div");
  row.className = "aniilog-filter-add-row aniilog-filter-add-row--simple";
  const select = document.createElement("select");
  select.className = "aniilog-filter-select";
  select.setAttribute("aria-label", placeholder);
  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = placeholder;
  select.append(placeholderOption);
  options.forEach((option) => {
    const item = document.createElement("option");
    item.value = option.id;
    item.textContent = option.label;
    select.append(item);
  });
  const add = document.createElement("button");
  add.type = "button";
  add.className = "aniilog-filter-add";
  add.textContent = "Add";
  add.disabled = true;
  select.addEventListener("change", () => { add.disabled = !select.value; });
  add.addEventListener("click", () => addAniilogFilter(group, select.value));
  row.append(select, add);
  wrapper.append(row, renderAniilogActiveRules(group, options));
  return wrapper;
}

function aniilogTierRuleOptions(groups) {
  const options = [];
  groups.forEach((group) => {
    options.push({ id: `${group.id}:any`, label: `${group.label} - any tier`, meta: group.meta });
    group.levels.forEach((level) => {
      options.push({ id: `${group.id}:${level}`, label: `${group.label} - tier ${level}`, meta: group.meta });
    });
  });
  return options;
}

function renderAniilogTierRuleBuilder(group, options, placeholder) {
  const groups = groupedAniilogTierOptions(options);
  const wrapper = document.createElement("div");
  wrapper.className = "aniilog-filter-builder";
  const row = document.createElement("div");
  row.className = "aniilog-filter-add-row";
  const typeSelect = document.createElement("select");
  typeSelect.className = "aniilog-filter-select";
  typeSelect.setAttribute("aria-label", placeholder);
  const typePlaceholder = document.createElement("option");
  typePlaceholder.value = "";
  typePlaceholder.textContent = placeholder;
  typeSelect.append(typePlaceholder);
  groups.forEach((groupOption) => {
    const item = document.createElement("option");
    item.value = groupOption.id;
    item.textContent = groupOption.label;
    typeSelect.append(item);
  });

  const tierSelect = document.createElement("select");
  tierSelect.className = "aniilog-filter-select";
  tierSelect.setAttribute("aria-label", "Tier");
  tierSelect.disabled = true;
  const add = document.createElement("button");
  add.type = "button";
  add.className = "aniilog-filter-add";
  add.textContent = "Add";
  add.disabled = true;

  const populateTiers = () => {
    tierSelect.replaceChildren();
    const selectedGroup = groups.find((groupOption) => groupOption.id === typeSelect.value);
    if (!selectedGroup) {
      tierSelect.disabled = true;
      add.disabled = true;
      return;
    }
    const anyTier = document.createElement("option");
    anyTier.value = "any";
    anyTier.textContent = "Any tier";
    tierSelect.append(anyTier);
    selectedGroup.levels.forEach((level) => {
      const item = document.createElement("option");
      item.value = String(level);
      item.textContent = `Tier ${level}`;
      tierSelect.append(item);
    });
    tierSelect.disabled = false;
    add.disabled = false;
  };
  typeSelect.addEventListener("change", populateTiers);
  add.addEventListener("click", () => {
    if (typeSelect.value) addAniilogTierFilter(group, `${typeSelect.value}:${tierSelect.value || "any"}`);
  });
  row.append(typeSelect, tierSelect, add);
  wrapper.append(row, renderAniilogActiveRules(group, aniilogTierRuleOptions(groups)));
  return wrapper;
}

function renderAniilogSkillSelect(name, labelText, options, labels = {}) {
  const label = document.createElement("label");
  label.className = "catalog-sort-label";
  label.textContent = labelText;
  const select = document.createElement("select");
  select.className = "aniilog-filter-select";
  select.value = state.aniilogFilters[name] || "any";
  [
    { id: "any", label: "Any" },
    { id: "has", label: labels.has || "Has any" },
    { id: "none", label: labels.none || "None" },
    ...options,
  ].forEach((option) => {
    const item = document.createElement("option");
    item.value = option.id;
    item.textContent = option.label;
    item.selected = item.value === select.value;
    select.append(item);
  });
  select.addEventListener("change", () => setAniilogScalarFilter(name, select.value));
  label.append(select);
  return label;
}

function renderAniilogStatFilter() {
  const wrapper = document.createElement("div");
  wrapper.className = "aniilog-filter-builder";
  const row = document.createElement("div");
  row.className = "aniilog-filter-add-row aniilog-stat-filter-add-row";

  const statSelect = document.createElement("select");
  statSelect.className = "aniilog-filter-select";
  statSelect.setAttribute("aria-label", "Base stat");
  const anyOption = document.createElement("option");
  anyOption.value = "";
  anyOption.textContent = "Choose a base stat";
  statSelect.append(anyOption);
  [ANIILOG_BASE_STAT_TOTAL_OPTION, ...visibleAniilogStatConfig()].forEach((stat) => {
    const option = document.createElement("option");
    option.value = stat.id;
    option.textContent = stat.label;
    statSelect.append(option);
  });

  const comparator = document.createElement("select");
  comparator.className = "aniilog-filter-select";
  comparator.setAttribute("aria-label", "Stat comparison");
  [
    { value: ">", label: ">" },
    { value: "=", label: "=" },
    { value: "<", label: "<" },
  ].forEach(({ value: comparatorValue, label }) => {
    const option = document.createElement("option");
    option.value = comparatorValue;
    option.textContent = label;
    comparator.append(option);
  });

  const value = document.createElement("input");
  value.className = "aniilog-filter-input";
  value.type = "number";
  value.inputMode = "numeric";
  value.placeholder = "Value";
  value.setAttribute("aria-label", "Stat value");

  const add = document.createElement("button");
  add.type = "button";
  add.className = "aniilog-filter-add";
  add.textContent = "Add";
  add.setAttribute("aria-label", "Add base stat rule");
  add.disabled = true;

  const refreshAddState = () => {
    add.disabled = !statSelect.value || value.value === "" || !Number.isFinite(Number(value.value));
  };
  const submit = () => {
    if (add.disabled) return;
    addAniilogStatRule(statSelect.value, comparator.value, value.value);
  };
  statSelect.addEventListener("change", refreshAddState);
  value.addEventListener("input", refreshAddState);
  value.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    submit();
  });
  add.addEventListener("click", submit);

  const activeRules = document.createElement("div");
  activeRules.className = "aniilog-filter-active-rules";
  aniilogStatRules().forEach((rule, index) => {
    const stat = rule.statId === ANIILOG_BASE_STAT_TOTAL_OPTION.id
      ? ANIILOG_BASE_STAT_TOTAL_OPTION
      : ANIILOG_STAT_CONFIG.find((option) => option.id === rule.statId);
    const label = `${stat?.label || rule.statId} ${rule.comparator || ">"} ${formatNumber(Number(rule.value), 0)}`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "aniilog-filter-rule";
    button.setAttribute("aria-label", `Remove ${label} filter`);
    const text = document.createElement("span");
    text.textContent = label;
    const remove = document.createElement("span");
    remove.className = "aniilog-filter-rule-remove";
    remove.textContent = "x";
    remove.setAttribute("aria-hidden", "true");
    button.append(text, remove);
    button.addEventListener("click", () => removeAniilogStatRule(index));
    activeRules.append(button);
  });

  row.append(statSelect, comparator, value, add);
  wrapper.append(row, activeRules);
  return wrapper;
}

function renderAniilogFilters(allEntries) {
  if (!state.aniilogFiltersOpen) return null;
  const options = collectAniilogFilterOptions(allEntries);
  const panel = document.createElement("div");
  panel.className = "aniilog-filter-panel";

  if (options.classes.length) {
    panel.append(renderAniilogFilterSection("classes", "Classes", [
      renderAniilogSimpleRuleBuilder("classes", options.classes, "Choose a class"),
    ], aniilogFilterSet("classes").size));
  }
  if (options.elements.length) {
    panel.append(renderAniilogFilterSection("elements", "Elements", [
      renderAniilogTierRuleBuilder("elements", options.elements, "Choose an element"),
    ], aniilogFilterSet("elements").size));
  }
  if (options.homeland.length) {
    panel.append(renderAniilogFilterSection("homeland", "Homeland abilities", [
      renderAniilogTierRuleBuilder("homeland", options.homeland, "Choose an ability"),
    ], aniilogFilterSet("homeland").size));
  }
  panel.append(renderAniilogFilterSection("stages", "Evolution stage", [
    renderAniilogSimpleRuleBuilder("stages", options.stages, "Choose a stage"),
  ], aniilogFilterSet("stages").size));
  panel.append(renderAniilogFilterSection("forms", "Special forms", [
    renderAniilogSimpleRuleBuilder("forms", ANIILOG_SPECIAL_FORM_FILTERS, "Choose a form"),
  ], aniilogFilterSet("forms").size));
  panel.append(renderAniilogFilterSection("stats", "Base stat", [renderAniilogStatFilter()],
    aniilogStatRules().length));
  const skillFilterCount = ["mobility", "exploration", "coreSkill"]
    .filter((name) => state.aniilogFilters[name] && state.aniilogFilters[name] !== "any").length;
  panel.append(renderAniilogFilterSection("skills", "Skills", [
    renderAniilogSkillSelect("mobility", "Mobility skill", options.mobility),
    renderAniilogSkillSelect("exploration", "Exploration skill", options.exploration),
    renderAniilogSkillSelect("coreSkill", "Core skill", [], {
      has: "Has a core skill",
      none: "No core skill",
    }),
  ], skillFilterCount));

  if (hasActiveAniilogFilters()) {
    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "aniilog-filter-clear";
    clear.textContent = "Clear filters";
    clear.addEventListener("click", resetAniilogFilters);
    panel.append(clear);
  }

  panel.addEventListener("scroll", () => {
    state.aniilogFilterScroll = panel.scrollTop;
  }, { passive: true });
  requestAnimationFrame(() => {
    panel.scrollTop = Number(state.aniilogFilterScroll) || 0;
  });

  return panel;
}

function renderCatalogCategoryToolbar(view) {
  if (!isCatalogView(view)) return null;
  if (view === "aniilog") return renderAniilogFilters(allCatalogEntriesForView(view));
  const group = document.createElement("section");
  group.className = "catalog-category-group";
  const label = document.createElement("p");
  label.className = "catalog-category-label";
  label.textContent = view === "aniilog" ? "Class" : "Category";
  const activeCategory = state.catalogCategory[view] || "all";
  const categories = catalogCategoriesForView(view);

  if (view === "itemlog") {
    const refreshItemlogFilters = () => {
      state.catalogIndexScroll[view] = 0;
      const visibleEntries = catalogEntriesForView(view);
      if (!visibleEntries.some((entry) => entry.id === state.catalogSelection[view])) {
        state.catalogSelection[view] = visibleEntries[0]?.id || "";
      }
      renderCatalogPreview();
    };
    const select = document.createElement("select");
    select.className = "catalog-category-select";
    select.setAttribute("aria-label", "Item categories");
    const counts = new Map((state.itemlogData?.categories || []).map((category) => [category?.id, category?.count]));
    const allEntries = allCatalogEntriesForView(view);
    const appendCategoryOption = (parent, category, optionLabel = category) => {
      const option = document.createElement("option");
      option.value = category;
      option.selected = category === activeCategory;
      const count = category === "all"
        ? allEntries.length
        : (itemlogCategoryCollection(category) ? itemlogCategoryCount(category, allEntries) : counts.get(category));
      option.textContent = category === "all"
        ? `All categories (${formatNumber(count)})`
        : `${optionLabel} (${formatNumber(count)})`;
      parent.append(option);
    };
    appendCategoryOption(select, "all");

    const quickCategories = document.createElement("optgroup");
    quickCategories.label = "Quick collections";
    ITEMLOG_CATEGORY_COLLECTIONS.forEach((collection) => {
      appendCategoryOption(quickCategories, collection.id, collection.label);
    });
    appendCategoryOption(quickCategories, "Carried Item", "Carried Items");
    appendCategoryOption(quickCategories, "Carried Item - Rune", "Runes");
    appendCategoryOption(quickCategories, "Holo-Battle Gizmo", "Holo-Battle Gizmos");
    select.append(quickCategories);

    const allCategories = document.createElement("optgroup");
    allCategories.label = "All categories";
    categories
      .filter((category) => !["all", "Carried Item", "Carried Item - Rune", "Holo-Battle Gizmo"].includes(category))
      .forEach((category) => appendCategoryOption(allCategories, category));
    select.append(allCategories);
    select.addEventListener("change", () => {
      state.catalogCategory[view] = select.value;
      refreshItemlogFilters();
    });
    group.append(label, select);

    const sourceLabel = document.createElement("p");
    sourceLabel.className = "catalog-category-label catalog-category-label--source";
    sourceLabel.textContent = "Source";
    const sourceSelect = document.createElement("select");
    sourceSelect.className = "catalog-category-select";
    sourceSelect.setAttribute("aria-label", "Item source");
    const appendSourceOption = (parent, source) => {
      const option = document.createElement("option");
      option.value = source.id;
      option.textContent = `${source.label} (${formatNumber(source.count)})`;
      option.selected = state.itemlogFilters.source === source.id;
      parent.append(option);
    };
    appendSourceOption(sourceSelect, { id: "all", label: "All sources", count: allEntries.length });

    const featuredSources = document.createElement("optgroup");
    featuredSources.label = "Featured sources";
    appendSourceOption(featuredSources, {
      id: "rv-expedition",
      label: "RV Park Expeditions",
      count: allEntries.filter((entry) => itemlogExpeditionSources(entry).length > 0).length,
    });
    sourceSelect.append(featuredSources);

    const acquisitionSources = document.createElement("optgroup");
    acquisitionSources.label = "Acquisition sources";
    itemlogMethodSourceOptions(allEntries).forEach((source) => appendSourceOption(acquisitionSources, source));
    sourceSelect.append(acquisitionSources);
    sourceSelect.addEventListener("change", () => {
      state.itemlogFilters.source = sourceSelect.value;
      if (sourceSelect.value !== "rv-expedition") {
        state.itemlogFilters.park = "all";
        state.itemlogFilters.tier = "all";
      }
      refreshItemlogFilters();
    });
    group.append(sourceLabel, sourceSelect);

    if (state.itemlogFilters.source === "rv-expedition") {
      const parkLabel = document.createElement("p");
      parkLabel.className = "catalog-category-label";
      parkLabel.textContent = "RV Park";
      const parkSelect = document.createElement("select");
      parkSelect.className = "catalog-category-select";
      parkSelect.setAttribute("aria-label", "RV Park");
      ["all", ...(state.itemlogData?.rv_expedition_filters?.parks || [])].forEach((park) => {
        const option = document.createElement("option");
        option.value = park;
        option.textContent = park === "all" ? "All RV Parks" : park;
        option.selected = state.itemlogFilters.park === park;
        parkSelect.append(option);
      });
      parkSelect.addEventListener("change", () => {
        state.itemlogFilters.park = parkSelect.value;
        refreshItemlogFilters();
      });

      const tierLabel = document.createElement("p");
      tierLabel.className = "catalog-category-label";
      tierLabel.textContent = "Expedition tier";
      const tierSelect = document.createElement("select");
      tierSelect.className = "catalog-category-select";
      tierSelect.setAttribute("aria-label", "Expedition tier");
      const tierOptions = [
        { duration_hours: "all", mode: "All tiers" },
        ...(state.itemlogData?.rv_expedition_filters?.tiers || []),
      ];
      tierOptions.forEach((tier) => {
        const value = String(tier.duration_hours);
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value === "all" ? tier.mode : `${value}h ${tier.mode}`;
        option.selected = state.itemlogFilters.tier === value;
        tierSelect.append(option);
      });
      tierSelect.addEventListener("change", () => {
        state.itemlogFilters.tier = tierSelect.value;
        refreshItemlogFilters();
      });
      group.append(parkLabel, parkSelect, tierLabel, tierSelect);
    }
    return group;
  }

  const toolbar = document.createElement("nav");
  toolbar.className = "catalog-category-toolbar";
  toolbar.setAttribute("aria-label", "Aniimo classes");

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "catalog-category-button";
    if (category === "all") {
      button.textContent = "All";
    } else {
      const roleMeta = catalogRoleMeta(category);
      const icon = document.createElement("img");
      icon.className = "catalog-category-button-icon";
      icon.src = roleMeta.icon;
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");
      button.style.setProperty("--catalog-role-color", roleMeta.color);
      button.append(icon, document.createTextNode(category));
    }
    button.setAttribute("aria-pressed", String(category === activeCategory));
    button.addEventListener("click", () => {
      state.catalogCategory[view] = category;
      state.catalogIndexScroll[view] = 0;
      const visibleEntries = catalogEntriesForView(view);
      if (!visibleEntries.some((entry) => entry.id === state.catalogSelection[view])) {
        state.catalogSelection[view] = visibleEntries[0]?.id || "";
      }
      renderCatalogPreview();
    });
    toolbar.append(button);
  });

  group.append(label, toolbar);
  return group;
}

function elementClassName(element) {
  return catalogElementMeta(element).slug;
}

function catalogElementMeta(element) {
  const name = typeof element === "string" ? element : element?.name;
  const key = String(name || "unknown").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return CATALOG_ELEMENT_META[key] || { slug: key || "unknown", icon: "", color: "#9faaad" };
}

function catalogElementLabel(element) {
  const name = typeof element === "string" ? element : element?.name;
  return catalogElementMeta(element).label || name || "Unknown";
}

function catalogRoleMeta(role) {
  const key = String(role || "").trim().toUpperCase();
  return CATALOG_ROLE_META[key] || { slug: key.toLowerCase() || "unknown", icon: "", color: "#7fc6b2" };
}

function catalogHomelandMeta(entry) {
  return CATALOG_HOMELAND_META[String(entry?.id || "")] || catalogElementMeta(entry?.name);
}

function createCatalogTag(text, className = "", meta = null) {
  const tag = document.createElement("span");
  tag.className = `catalog-tag ${className}`.trim();
  if (meta?.color) tag.style.setProperty("--catalog-tag-color", meta.color);
  if (meta?.icon) {
    const icon = document.createElement("img");
    icon.className = "catalog-tag-icon";
    icon.src = meta.icon;
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    tag.append(icon);
  }
  const label = document.createElement("span");
  label.textContent = text;
  tag.append(label);
  return tag;
}

function renderCatalogLevels(title, entries, emptyText = "No ability data available.", options = {}) {
  const section = createCatalogSection(title);
  if (options.compact) section.classList.add("catalog-section--compact");
  if (!Array.isArray(entries) || !entries.length) {
    const empty = document.createElement("p");
    empty.className = "catalog-empty-detail";
    empty.textContent = emptyText;
    section.append(empty);
    return section;
  }
  const levels = document.createElement("div");
  levels.className = `catalog-level-grid${options.compact ? " catalog-level-grid--compact" : ""}`;
  entries.forEach((entry) => {
    const card = document.createElement("div");
    card.className = "catalog-level-card";
    const name = document.createElement("strong");
    name.textContent = entry.name;
    const level = document.createElement("span");
    level.textContent = entry.level ? `Level ${entry.level}` : "Available";
    card.append(name, level);
    levels.append(card);
  });
  section.append(levels);
  return section;
}

function renderCatalogHomelandLevels(entries) {
  const section = createCatalogSection("Homeland abilities");
  section.classList.add("catalog-section--compact", "catalog-homeland-section");
  if (!Array.isArray(entries) || !entries.length) {
    const empty = document.createElement("p");
    empty.className = "catalog-empty-detail";
    empty.textContent = "No Homeland ability is listed for this form.";
    section.append(empty);
    return section;
  }

  const levels = document.createElement("div");
  levels.className = "catalog-level-grid catalog-level-grid--compact catalog-homeland-grid";
  entries.forEach((entry) => {
    const meta = catalogHomelandMeta(entry);
    const card = document.createElement("div");
    card.className = `catalog-level-card catalog-homeland-card homeland-${meta.slug}`;
    card.style.setProperty("--catalog-homeland-color", meta.color);
    if (entry.description) card.title = entry.description;

    const iconShell = document.createElement("span");
    iconShell.className = "catalog-homeland-icon-shell";
    if (meta.icon) {
      const icon = document.createElement("img");
      icon.className = "catalog-homeland-icon";
      icon.src = meta.icon;
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");
      iconShell.append(icon);
    }

    const name = document.createElement("strong");
    name.textContent = catalogElementLabel(entry.name);
    const level = document.createElement("span");
    level.className = "catalog-homeland-level";
    level.textContent = entry.level ? `Level ${entry.level}` : "Available";
    card.append(iconShell, name, level);
    levels.append(card);
  });
  section.append(levels);
  return section;
}

function appendCatalogAbilityFact(container, label, value, suffix = "", modifier = "") {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return;
  const fact = document.createElement("div");
  fact.className = `catalog-ability-fact${modifier ? ` catalog-ability-fact--${modifier}` : ""}`;
  const term = document.createElement("span");
  term.textContent = label;
  const detail = document.createElement("strong");
  detail.textContent = `${formatNumber(numericValue, 2)}${suffix}`;
  fact.append(term, detail);
  container.append(fact);
}

function renderCatalogAbilitySection(title, abilities, emptyText = "No data available.") {
  const section = createCatalogSection(title);
  const compact = title === "Ultimate" || title === "Trait" || title === "Mobility skills";
  if (compact) section.classList.add("catalog-section--compact");
  if (!Array.isArray(abilities) || !abilities.length) {
    const empty = document.createElement("p");
    empty.className = "catalog-empty-detail";
    empty.textContent = emptyText;
    section.append(empty);
    return section;
  }
  const grid = document.createElement("div");
  grid.className = `catalog-ability-grid${compact ? " catalog-ability-grid--compact" : ""}`;
  const orderedAbilities = title === "Combat skills"
    ? abilities
      .map((ability, index) => ({ ability, index }))
      .sort((left, right) => Number(Boolean(right.ability?.core)) - Number(Boolean(left.ability?.core))
        || left.index - right.index)
      .map(({ ability }) => ability)
    : abilities;
  orderedAbilities.forEach((ability) => {
    const card = document.createElement("article");
    card.className = "catalog-ability-card";
    const icon = makeIcon("catalog-ability-icon", ability.icon);
    icon.alt = `${ability.name} icon`;
    const copy = document.createElement("div");
    copy.className = "catalog-ability-copy";
    card.append(copy);
    let showUpgrade = false;

    const renderVariant = () => {
      const displayed = showUpgrade && ability.upgrade
        ? { ...ability, ...ability.upgrade, core: ability.core }
        : ability;
      card.classList.toggle("catalog-ability-card--upgradeable", Boolean(ability.upgrade));
      card.classList.toggle("catalog-ability-card--upgraded", Boolean(showUpgrade && ability.upgrade));
      copy.replaceChildren();
      icon.src = displayed.icon || ability.icon || "";
      icon.alt = `${displayed.name || ability.name || "Ability"} icon`;

      const header = document.createElement("div");
      header.className = "catalog-ability-header";
      const headerCopy = document.createElement("div");
      headerCopy.className = "catalog-ability-header-copy";
      header.append(icon, headerCopy);
      copy.append(header);

      const heading = document.createElement("div");
      heading.className = "catalog-ability-heading";
      const name = document.createElement("strong");
      name.textContent = displayed.name || "Ability";
      heading.append(name);
      if (displayed.core) {
        const coreBadge = document.createElement("span");
        coreBadge.className = "catalog-core-skill-badge";
        coreBadge.title = "S Core Skill";
        const coreIcon = document.createElement("img");
        coreIcon.src = "./assets/aniilog/skills/core-skill.png";
        coreIcon.alt = "";
        coreIcon.setAttribute("aria-hidden", "true");
        const coreLabel = document.createElement("span");
        coreLabel.textContent = "Core";
        coreBadge.append(coreIcon, coreLabel);
        heading.append(coreBadge);
      }
      headerCopy.append(heading);

      if (ability.upgrade) {
        const levelButton = document.createElement("button");
        levelButton.type = "button";
        levelButton.className = "catalog-skill-level-button";
        levelButton.textContent = showUpgrade ? "Lv. 2" : "Lv. 1";
        levelButton.setAttribute(
          "aria-label",
          `${ability.name || "Core skill"}: show ${showUpgrade ? "Level 1" : "Level 2"}`,
        );
        levelButton.setAttribute("aria-pressed", String(showUpgrade));
        levelButton.addEventListener("click", () => {
          showUpgrade = !showUpgrade;
          renderVariant();
        });
        header.append(levelButton);
      }

      const combat = displayed.combat && typeof displayed.combat === "object" ? displayed.combat : null;
      if (combat) {
        const badges = document.createElement("div");
        badges.className = "catalog-ability-badges";
        const addBadge = (label, type, color = "", iconSrc = "") => {
          if (!label) return;
          const badge = document.createElement("span");
          badge.className = `catalog-ability-badge catalog-ability-badge--${type}`;
          if (color) badge.style.setProperty("--catalog-ability-element-color", color);
          if (iconSrc) {
            const badgeIcon = document.createElement("img");
            badgeIcon.className = "catalog-ability-badge-icon";
            badgeIcon.src = iconSrc;
            badgeIcon.alt = "";
            badgeIcon.setAttribute("aria-hidden", "true");
            badge.append(badgeIcon);
          }
          const text = document.createElement("span");
          text.textContent = label;
          badge.append(text);
          badges.append(badge);
        };
        const categoryKey = String(combat.category || "").trim().toLowerCase();
        const categoryLabel = categoryKey === "magic" ? "Magical" : combat.category;
        const categoryType = categoryKey === "magic" ? "category-magical" : `category-${categoryKey || "other"}`;
        addBadge(categoryLabel, categoryType);
        (Array.isArray(combat.types) ? combat.types : []).forEach((type) => addBadge(type, "type"));
        const elementMeta = catalogElementMeta(combat.element);
        addBadge(catalogElementLabel(combat.element), "element", combat.element_color || elementMeta.color, elementMeta.icon);
        if (badges.childElementCount) headerCopy.append(badges);

        const facts = document.createElement("div");
        facts.className = "catalog-ability-facts";
        appendCatalogAbilityFact(facts, "Might", combat.might);
        appendCatalogAbilityFact(facts, "EP Cost", combat.ep_cost);
        appendCatalogAbilityFact(facts, "BREAK", Number(combat.break_power) * 100, "%");
        appendCatalogAbilityFact(facts, "Cooldown", combat.cooldown, "s", "cooldown");
        if (facts.childElementCount) copy.append(facts);
      }
      if (displayed.description) {
        const description = document.createElement("p");
        description.textContent = displayed.description;
        copy.append(description);
      }
      if (Array.isArray(displayed.unlock_forms) && displayed.unlock_forms.length) {
        const requirement = document.createElement("div");
        requirement.className = "catalog-skill-unlock";
        const unlockIcons = document.createElement("span");
        unlockIcons.className = "catalog-skill-unlock-icons";
        displayed.unlock_forms.forEach((form) => {
          const formIcon = makeIcon("catalog-skill-unlock-icon", form.icon);
          formIcon.alt = "";
          formIcon.setAttribute("aria-hidden", "true");
          unlockIcons.append(formIcon);
        });
        const labels = displayed.unlock_forms.map((form) => `${form.name} (${form.form_label})`);
        const requirementText = document.createElement("span");
        requirementText.textContent = `Unlock by obtaining ${labels.join(" and ")}`;
        requirement.append(unlockIcons, requirementText);
        copy.append(requirement);
      }
      if (!combat) {
        const meta = [];
        if (displayed.group && displayed.group !== "Ultimate") meta.push(displayed.group);
        if (displayed.power) meta.push(`Might ${displayed.power}`);
        if (displayed.consume) meta.push(`EP Cost ${displayed.consume}`);
        if (meta.length) {
          const detail = document.createElement("small");
          detail.textContent = meta.join(" - ");
          copy.append(detail);
        }
      }
    };
    renderVariant();
    grid.append(card);
  });
  section.append(grid);
  return section;
}

function renderCatalogLocations(entry) {
  const section = createCatalogSection("Known locations");
  section.classList.add("catalog-location-section");
  if (!Array.isArray(entry.locations) || !entry.locations.length) {
    const empty = document.createElement("p");
    empty.className = "catalog-empty-detail";
    empty.textContent = "No overworld location is currently confirmed for this form.";
    section.append(empty);
    return section;
  }
  const list = document.createElement("div");
  list.className = "catalog-location-list";
  entry.locations.forEach((location) => {
    const areaNames = [...new Set((location.areas || []).filter(Boolean))];
    const locationEntry = document.createElement(areaNames.length ? "details" : "article");
    locationEntry.className = "catalog-location-entry";
    const summary = document.createElement(areaNames.length ? "summary" : "div");
    summary.className = "catalog-location-summary";
    const name = document.createElement("strong");
    name.className = "catalog-location-name";
    name.textContent = location.map_label;
    name.title = location.map_label;
    const meta = document.createElement("span");
    meta.className = "catalog-location-meta";
    const habitatText = areaNames.length
      ? ` \u00b7 ${formatNumber(areaNames.length)} habitat${areaNames.length === 1 ? "" : "s"}`
      : "";
    meta.textContent = `${formatNumber(location.count)} spawn${location.count === 1 ? "" : "s"}${habitatText}`;
    summary.append(name, meta);
    locationEntry.append(summary);

    if (areaNames.length) {
      const areas = document.createElement("ul");
      areas.className = "catalog-location-chip-list";
      areas.setAttribute("aria-label", `${location.map_label} habitat areas`);
      areaNames.forEach((areaName) => {
        const chip = document.createElement("li");
        chip.className = "catalog-location-chip";
        chip.textContent = areaName;
        chip.title = areaName;
        areas.append(chip);
      });
      locationEntry.append(areas);
    }
    list.append(locationEntry);
  });
  section.append(list);
  return section;
}

function openAniilogRecord(entryId) {
  state.catalogSelection.aniilog = entryId;
  state.catalogSearch.aniilog = "";
  renderCatalogPreview();
  window.requestAnimationFrame(() => {
    els.catalogPanel.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function createEvolutionNode(node, label, isCurrent = false) {
  const card = document.createElement("article");
  card.className = `catalog-evolution-node${isCurrent ? " is-current" : ""}`;
  const labelNode = document.createElement("p");
  labelNode.className = "catalog-evolution-label";
  labelNode.textContent = label;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "catalog-evolution-link";
  const icon = makeIcon("catalog-evolution-icon", node.icon);
  icon.alt = `${node.name} icon`;
  const copy = document.createElement("span");
  const name = document.createElement("strong");
  name.textContent = node.name;
  const form = document.createElement("small");
  form.textContent = node.form_label || "Basic";
  copy.append(name, form);
  button.append(icon, copy);
  button.addEventListener("click", () => openAniilogRecord(node.id));
  card.append(labelNode, button);
  if (Array.isArray(node.requirements) && node.requirements.length) {
    const requirements = document.createElement("ul");
    requirements.className = "catalog-evolution-requirements";
    node.requirements.forEach((requirement) => {
      const row = document.createElement("li");
      row.textContent = requirement;
      requirements.append(row);
    });
    card.append(requirements);
  }
  return card;
}

function renderCatalogEvolution(entry) {
  const parents = entry.evolution?.from || [];
  const targets = entry.evolution?.to || [];
  if (!parents.length && !targets.length) return null;
  const section = createCatalogSection("Evolution");
  section.classList.add("catalog-evolution-section");
  const flow = document.createElement("div");
  flow.className = "catalog-evolution-flow";
  parents.forEach((parent) => flow.append(createEvolutionNode(parent, "Evolved from")));
  if (parents.length) {
    const arrow = document.createElement("span");
    arrow.className = "catalog-evolution-arrow";
    arrow.textContent = "\u2192";
    flow.append(arrow);
  }
  flow.append(createEvolutionNode(entry, "Current form", true));
  if (targets.length) {
    const arrow = document.createElement("span");
    arrow.className = "catalog-evolution-arrow";
    arrow.textContent = "\u2192";
    flow.append(arrow);
  }
  targets.forEach((target) => flow.append(createEvolutionNode(target, "Can evolve to")));
  section.append(flow);
  return section;
}

function createProgressionMaterialChip(material, quantity, qualifier = "") {
  const chip = document.createElement("span");
  chip.className = "catalog-progression-material-chip";
  const icon = makeIcon("catalog-progression-material-icon", material?.icon);
  icon.alt = material?.name ? `${material.name} icon` : "Progression material icon";
  const copy = document.createElement("span");
  const name = document.createElement("strong");
  name.textContent = material?.name || "Unknown material";
  const amount = document.createElement("small");
  amount.textContent = `${qualifier}${qualifier ? " " : ""}x${quantity ?? 1}`;
  copy.append(name, amount);
  chip.append(icon, copy);
  return chip;
}

function renderProgressionCosts(costs, materials) {
  const list = document.createElement("div");
  list.className = "catalog-progression-costs";
  (Array.isArray(costs) ? costs : []).forEach((cost) => {
    const material = cost.item || materials?.[cost.slot];
    if (!material) return;
    const group = document.createElement("span");
    group.className = "catalog-progression-cost-group";
    group.append(createProgressionMaterialChip(material, cost.quantity));
    if (cost.slot === "stage" && materials?.stage_alternative) {
      const separator = document.createElement("span");
      separator.className = "catalog-progression-cost-alternative";
      separator.textContent = "or";
      group.append(
        separator,
        createProgressionMaterialChip(materials.stage_alternative, cost.quantity, "substitute"),
      );
    }
    list.append(group);
  });
  return list;
}

function renderAniimoProgression(entry, progression) {
  const stages = Array.isArray(progression?.stages) ? progression.stages : [];
  const materials = entry.progression_materials;
  if (!stages.length || !materials?.stage || !materials?.training) return null;

  const section = createCatalogSection("Aniimo Progression");
  section.classList.add("catalog-progression-section");
  const intro = document.createElement("div");
  intro.className = "catalog-progression-intro";
  const system = document.createElement("strong");
  system.textContent = progression.system || "Resonance Training";
  const summary = document.createElement("span");
  summary.textContent = `${progression.max_stage || stages.length} stages with level gates, stage bonuses, and per-level training costs.`;
  intro.append(system, summary);

  const legend = document.createElement("div");
  legend.className = "catalog-progression-materials";
  const materialRoles = [
    ["Stage material", materials.stage],
    ["Training material", materials.training],
    ["Stage substitute", materials.stage_alternative],
  ];
  materialRoles.forEach(([label, material]) => {
    if (!material) return;
    const card = document.createElement("article");
    card.className = "catalog-progression-material";
    const icon = makeIcon("catalog-progression-material-icon", material.icon);
    icon.alt = `${material.name} icon`;
    const copy = document.createElement("div");
    const role = document.createElement("small");
    role.textContent = label;
    const name = document.createElement("strong");
    name.textContent = material.name;
    copy.append(role, name);
    card.append(icon, copy);
    legend.append(card);
  });

  const stageList = document.createElement("div");
  stageList.className = "catalog-progression-stages";
  stages.forEach((stage) => {
    const details = document.createElement("details");
    details.className = "catalog-progression-stage";
    if (stage.stage === 1) details.open = true;
    const stageSummary = document.createElement("summary");
    const number = document.createElement("span");
    number.className = "catalog-progression-stage-number";
    number.textContent = String(stage.stage);
    const copy = document.createElement("span");
    copy.className = "catalog-progression-stage-copy";
    const title = document.createElement("strong");
    title.textContent = `Tier ${stage.stage}`;
    const condition = document.createElement("small");
    condition.textContent = stage.condition || (stage.stage === 1 ? "Starting tier" : "No level gate");
    copy.append(title, condition);
    stageSummary.append(number, copy);
    if (stage.stage_bonus) {
      const bonus = document.createElement("span");
      bonus.className = "catalog-progression-stage-bonus";
      bonus.textContent = stage.stage_bonus;
      stageSummary.append(bonus);
    }
    details.append(stageSummary);

    const body = document.createElement("div");
    body.className = "catalog-progression-stage-body";
    if (Array.isArray(stage.advance_costs) && stage.advance_costs.length) {
      const advance = document.createElement("div");
      advance.className = "catalog-progression-advance";
      const label = document.createElement("h5");
      label.textContent = `Advance to Tier ${stage.stage}`;
      advance.append(label, renderProgressionCosts(stage.advance_costs, materials));
      body.append(advance);
    }

    const trainingSteps = Array.isArray(stage.training_steps) ? stage.training_steps : [];
    if (trainingSteps.length) {
      const training = document.createElement("div");
      training.className = "catalog-progression-training";
      const label = document.createElement("h5");
      label.textContent = "Training levels";
      const rows = document.createElement("div");
      rows.className = "catalog-progression-training-rows";
      trainingSteps.forEach((step) => {
        const row = document.createElement("article");
        row.className = "catalog-progression-training-row";
        const level = document.createElement("strong");
        level.textContent = `Level ${step.level}`;
        const gains = document.createElement("span");
        const statGains = Array.isArray(step.stat_gains) ? step.stat_gains : [];
        gains.textContent = statGains.length
          ? statGains.map((gain) => `${gain.label} +${gain.value}`).join(" · ")
          : "Configured stat gain";
        row.append(level, gains, renderProgressionCosts(step.costs, materials));
        rows.append(row);
      });
      training.append(label, rows);
      body.append(training);
    } else {
      const maximum = document.createElement("p");
      maximum.className = "catalog-progression-maximum";
      maximum.textContent = "Maximum resonance tier.";
      body.append(maximum);
    }
    details.append(body);
    stageList.append(details);
  });

  section.append(intro, legend, stageList);
  return section;
}

function makeResearchTopicIcon(kind) {
  const icon = document.createElement("span");
  icon.className = `catalog-research-topic-icon is-${kind || "research"}`;
  icon.setAttribute("aria-hidden", "true");
  const paths = {
    combat: '<path d="M5 4l6 6m8-6l-6 6M4 20l5-5m11 5l-5-5"/><path d="M4 3l4 1 9 9-4 4-9-9zM20 3l-4 1-4 4"/>',
    catch: '<path d="M12 3l8 5v8l-8 5-8-5V8z"/><circle cx="12" cy="12" r="3"/>',
    evolve: '<path d="M5 19V9m0 0l-3 3m3-3l3 3M12 19V5m0 0L9 8m3-3l3 3M19 19v-7m0 0l-3 3m3-3l3 3"/>',
    cultivate: '<path d="M12 21v-9m0 2c-5 0-8-3-8-7 5 0 8 3 8 7zm0 3c5 0 8-3 8-7-5 0-8 3-8 7z"/>',
    research: '<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L21 21"/>',
  };
  icon.innerHTML = `<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">${paths[kind] || paths.research}</svg>`;
  return icon;
}

function renderAniimoResearch(entry, researchData) {
  const researchId = String(entry.research_id || entry.form_id || "");
  const definition = researchData?.definitions?.[researchId];
  const topics = Array.isArray(definition?.topics) ? definition.topics : [];
  if (!topics.length) return null;

  const section = createCatalogSection("Aniimo Research");
  section.classList.add("catalog-research-section");
  const intro = document.createElement("div");
  intro.className = "catalog-research-intro";
  const summary = document.createElement("span");
  summary.textContent = `${topics.length} research topics`;
  const points = document.createElement("strong");
  points.textContent = `${definition.total_research_points || 0} total research points`;
  intro.append(summary, points);

  const topicList = document.createElement("div");
  topicList.className = "catalog-research-topics";
  topics.forEach((topic) => {
    const card = document.createElement("article");
    card.className = "catalog-research-topic";
    const icon = makeResearchTopicIcon(topic.icon_kind);
    const content = document.createElement("div");
    content.className = "catalog-research-topic-content";
    const heading = document.createElement("strong");
    heading.className = "catalog-research-topic-title";
    heading.textContent = topic.label || "Research topic";
    const milestones = document.createElement("div");
    milestones.className = "catalog-research-milestones";
    (topic.milestones || []).forEach((milestone) => {
      const chip = document.createElement("span");
      chip.className = "catalog-research-milestone";
      const threshold = document.createElement("b");
      threshold.textContent = String(milestone.required ?? "-");
      const rewardPoints = document.createElement("span");
      rewardPoints.textContent = `+${milestone.research_points ?? 0}`;
      chip.append(threshold, rewardPoints);
      milestones.append(chip);

      if (milestone.bonus?.item) {
        const bonus = document.createElement("span");
        bonus.className = "catalog-research-bonus";
        const bonusIcon = makeIcon("catalog-research-bonus-icon", milestone.bonus.item.icon);
        bonusIcon.alt = `${milestone.bonus.item.name} icon`;
        const bonusName = document.createElement("span");
        bonusName.textContent = `${milestone.bonus.item.name} x${milestone.bonus.quantity ?? 1}`;
        bonus.append(bonusIcon, bonusName);
        milestones.append(bonus);
      }
    });
    content.append(heading, milestones);
    card.append(icon, content);
    topicList.append(card);
  });

  section.append(intro, topicList);
  const levelRewards = Array.isArray(definition.level_rewards) ? definition.level_rewards : [];
  if (levelRewards.length) {
    const rewards = document.createElement("div");
    rewards.className = "catalog-research-level-rewards";
    const label = document.createElement("strong");
    label.textContent = "Research level rewards";
    const rewardList = document.createElement("div");
    levelRewards.forEach((reward) => {
      const chip = document.createElement("span");
      chip.textContent = `Lv. ${reward.level} · ${reward.label} +${reward.quantity ?? 1}`;
      rewardList.append(chip);
    });
    rewards.append(label, rewardList);
    section.append(rewards);
  }
  return section;
}

function renderBossRewardTier(tier) {
  const block = document.createElement("section");
  block.className = "catalog-boss-tier";

  if (tier.label) {
    const label = document.createElement("h5");
    label.className = "catalog-boss-tier-label";
    label.textContent = tier.label;
    block.append(label);
  }

  const drops = Array.isArray(tier.drops) ? tier.drops : [];
  if (!drops.length) {
    const empty = document.createElement("p");
    empty.className = "catalog-empty-detail";
    empty.textContent = "No repeatable reward entries are configured for this tier.";
    block.append(empty);
    return block;
  }

  const grid = document.createElement("div");
  grid.className = "catalog-boss-drop-grid";
  drops.forEach((drop) => {
    const reward = document.createElement("article");
    reward.className = "catalog-boss-drop";
    const icon = makeIcon("catalog-boss-drop-icon", drop.icon);
    icon.alt = drop.name ? `${drop.name} icon` : "Reward icon";
    const copy = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = drop.name || "Unknown reward";
    const quantity = document.createElement("span");
    quantity.textContent = `x${drop.quantity ?? 1}`;
    copy.append(name, quantity);
    reward.append(icon, copy);
    grid.append(reward);
  });
  block.append(grid);
  return block;
}

function renderAniilogBossVariants(bossVariants) {
  if (!Array.isArray(bossVariants) || !bossVariants.length) return null;

  const section = createCatalogSection("Boss variants");
  const note = document.createElement("p");
  note.className = "catalog-boss-section-note";
  note.textContent = "Repeatable encounter rewards only. First-clear rewards are intentionally excluded.";
  const grid = document.createElement("div");
  grid.className = "catalog-boss-grid";

  bossVariants.forEach((boss) => {
    const card = document.createElement("article");
    card.className = "catalog-boss-variant";
    const header = document.createElement("header");
    header.className = "catalog-boss-header";
    const icon = makeIcon("catalog-boss-icon", boss.icon);
    icon.alt = `${boss.name || boss.tier || "Boss"} icon`;
    const copy = document.createElement("div");
    const eyebrow = document.createElement("p");
    eyebrow.className = "catalog-boss-eyebrow";
    eyebrow.textContent = `${boss.tier || "Boss"} encounter`;
    const name = document.createElement("h4");
    name.textContent = boss.name || "Boss variant";
    const meta = document.createElement("div");
    meta.className = "catalog-boss-meta";
    const location = [boss.map_label, boss.area_name].filter(Boolean).join(" - ");
    if (location) {
      const locationItem = document.createElement("span");
      locationItem.textContent = location;
      meta.append(locationItem);
    }
    if (Number(boss.refresh_seconds) > 0) {
      const refresh = document.createElement("span");
      refresh.textContent = `Refresh: ${boss.refresh_seconds} sec`;
      meta.append(refresh);
    }
    copy.append(eyebrow, name, meta);
    const locate = document.createElement("button");
    locate.type = "button";
    locate.className = "catalog-locate-button catalog-boss-locate-button";
    locate.textContent = "Locate on Map";
    locate.disabled = !boss.map_id || !boss.item_id;
    locate.addEventListener("click", () => locateBossVariant(boss));
    header.append(icon, copy, locate);
    card.append(header);

    const rewardTiers = Array.isArray(boss.reward_tiers) ? boss.reward_tiers : [];
    if (!rewardTiers.length) {
      const empty = document.createElement("p");
      empty.className = "catalog-empty-detail";
      empty.textContent = "Repeatable reward data is not currently available for this encounter.";
      card.append(empty);
    } else {
      const rewards = document.createElement("div");
      rewards.className = "catalog-boss-rewards";
      const heading = document.createElement("p");
      heading.className = "catalog-boss-reward-heading";
      heading.textContent = "Repeatable drops";
      rewards.append(heading, renderBossRewardTier(rewardTiers[0]));
      card.append(rewards);

      if (rewardTiers.length > 1) {
        const details = document.createElement("details");
        details.className = "catalog-boss-tier-details";
        const summary = document.createElement("summary");
        summary.textContent = `View all ${rewardTiers.length} configured reward tiers`;
        const tierList = document.createElement("div");
        tierList.className = "catalog-boss-tier-list";
        rewardTiers.slice(1).forEach((tier) => tierList.append(renderBossRewardTier(tier)));
        details.append(summary, tierList);
        card.append(details);
      }
    }

    grid.append(card);
  });

  section.append(note, grid);
  return section;
}

function renderAniilogCatalogRecord(entry) {
  const record = document.createElement("article");
  record.className = "catalog-record catalog-aniilog-record";

  const identity = document.createElement("header");
  identity.className = "catalog-identity";
  const icon = makeIcon("catalog-hero-icon", entry.icon);
  icon.alt = `${entry.name} ${entry.form_label} form icon`;
  const copy = document.createElement("div");
  const number = document.createElement("p");
  number.className = "catalog-eyebrow";
  number.textContent = `${entry.aniilog_number || "Special"} - ${entry.form_label || "Basic"}`;
  const name = document.createElement("h2");
  name.textContent = entry.name;
  const tags = document.createElement("div");
  tags.className = "catalog-tags";
  if (entry.role) {
    const roleMeta = catalogRoleMeta(entry.role);
    tags.append(createCatalogTag(`Class: ${entry.role}`, `catalog-role-tag role-${roleMeta.slug}`, roleMeta));
  }
  (entry.elements || []).forEach((element) => {
    const elementMeta = catalogElementMeta(element);
    tags.append(createCatalogTag(`Type: ${catalogElementLabel(element)} ${element.level}`, `catalog-element-tag element-${elementClassName(element)}`, elementMeta));
  });
  copy.append(number, name, tags);
  identity.append(icon, copy);
  const actions = document.createElement("div");
  actions.className = "catalog-identity-actions";
  const locate = document.createElement("button");
  locate.type = "button";
  locate.className = "catalog-locate-button";
  locate.textContent = "Locate on Map";
  locate.disabled = !Array.isArray(entry.map_ids) || !entry.map_ids.length;
  locate.addEventListener("click", () => locateAniilogEntry(entry));
  actions.append(locate);
  identity.append(actions);
  record.append(identity);

  if (entry.description) {
    const description = document.createElement("p");
    description.className = "catalog-description";
    description.textContent = entry.description;
    record.append(description);
  }

  const statSection = createCatalogSection(`Base stats · Total ${aniilogBaseStatTotal(entry)}`);
  statSection.append(renderAniilogStatComparison(entry));
  record.append(statSection);

  record.append(renderCatalogAbilitySection("Combat skills", entry.skills, "No combat skill data is currently available."));
  const utilityGrid = document.createElement("div");
  utilityGrid.className = "catalog-utility-grid";
  utilityGrid.append(
    renderCatalogAbilitySection("Ultimate", entry.ultimates, "No Ultimate ability is currently listed for this form."),
    renderCatalogAbilitySection("Trait", entry.traits, "No Trait is currently listed for this form."),
    renderCatalogAbilitySection("Mobility skills", entry.mobility_skills, "No Mobility skill is currently listed for this form."),
    renderCatalogLevels("Exploration", entry.exploration, "None", { compact: true }),
    renderCatalogHomelandLevels(entry.homeland),
  );
  record.append(utilityGrid);

  if (entry.spawn_requirements?.length) {
    const requirements = createCatalogSection("Spawn requirements");
    const list = document.createElement("ul");
    list.className = "catalog-requirement-list";
    entry.spawn_requirements.forEach((requirement) => {
      const row = document.createElement("li");
      row.textContent = requirement;
      list.append(row);
    });
    requirements.append(list);
    record.append(requirements);
  }

  record.append(renderCatalogLocations(entry));
  const bossVariants = renderAniilogBossVariants(entry.boss_variants);
  if (bossVariants) record.append(bossVariants);
  const evolution = renderCatalogEvolution(entry);
  if (evolution) record.append(evolution);
  const progression = renderAniimoProgression(entry, state.aniilogData?.aniimo_progression);
  const research = renderAniimoResearch(entry, state.aniilogData?.aniimo_research);
  if (progression || research) {
    const lowerGrid = document.createElement("div");
    lowerGrid.className = "catalog-progression-research-grid";
    if (progression) lowerGrid.append(progression);
    if (research) lowerGrid.append(research);
    record.append(lowerGrid);
  }
  return record;
}

function qualityClassName(quality) {
  return String(quality || "normal").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "normal";
}

function catalogItemTier(quality) {
  switch (qualityClassName(quality)) {
    case "legendary":
    case "gold":
      return "gold";
    case "epic":
    case "purple":
      return "purple";
    case "rare":
    case "blue":
      return "blue";
    case "uncommon":
      return "green";
    case "prismatic":
      return "prismatic";
    default:
      return "grey";
  }
}

function renderItemLogRequirements(requirements) {
  const usableRequirements = Array.isArray(requirements)
    ? requirements.filter((requirement) => requirement && (requirement.label || requirement.detail))
    : [];
  if (!usableRequirements.length) return null;

  const section = createCatalogSection("Requirements");
  const list = document.createElement("div");
  list.className = "catalog-requirements-list";
  usableRequirements.forEach((requirement) => {
    const row = document.createElement("div");
    row.className = "catalog-requirement-row";
    const label = document.createElement("strong");
    label.textContent = requirement?.label || "Requirement";
    row.append(label);
    if (requirement?.detail) {
      const detail = document.createElement("p");
      detail.textContent = requirement.detail;
      row.append(detail);
    }
    list.append(row);
  });
  section.append(list);
  return section;
}

function renderItemLogObtainMethods(methods) {
  const usableMethods = Array.isArray(methods)
    ? methods.filter((method) => method && (method.label || method.detail))
    : [];
  if (!usableMethods.length) return null;

  const section = createCatalogSection("How to obtain");
  const list = document.createElement("div");
  list.className = "catalog-obtain-list";
  usableMethods.forEach((method) => {
    const row = document.createElement("div");
    row.className = "catalog-obtain-row";
    const label = document.createElement("strong");
    label.textContent = method?.label || "Source method";
    row.append(label);
    if (method?.detail) {
      const detail = document.createElement("p");
      detail.textContent = method.detail;
      row.append(detail);
    }
    list.append(row);
  });
  section.append(list);
  return section;
}

function visibleRvExpeditionSources(entry) {
  const sources = itemlogExpeditionSources(entry);
  if (state.itemlogFilters.source !== "rv-expedition") return sources;
  return sources.filter((source) => (
    (state.itemlogFilters.park === "all" || source?.park === state.itemlogFilters.park)
    && (state.itemlogFilters.tier === "all" || String(source?.duration_hours) === state.itemlogFilters.tier)
  ));
}

function renderRvExpeditionSources(entry) {
  const sources = visibleRvExpeditionSources(entry);
  if (!sources.length) return null;

  const section = createCatalogSection("RV Park expeditions");
  const list = document.createElement("div");
  list.className = "catalog-expedition-list";
  sources.forEach((source) => {
    const row = document.createElement("div");
    row.className = "catalog-expedition-row";

    const park = document.createElement("strong");
    park.textContent = source.park;
    const trip = document.createElement("span");
    trip.className = "catalog-expedition-trip";
    trip.textContent = `${source.duration_hours}h ${source.mode}`;
    const kind = document.createElement("span");
    kind.className = "catalog-expedition-kind";
    kind.textContent = source.reward_component || source.reward_kind;
    const confidenceLabels = {
      "client-confirmed": "Client data",
      "in-game-observed": "Observed in game",
      "tier-rule-inferred": "Tier-rule inference",
    };
    const confidenceLabel = confidenceLabels[source.confidence];
    if (confidenceLabel) {
      const confidence = document.createElement("small");
      confidence.className = `catalog-expedition-confidence is-${source.confidence}`;
      confidence.textContent = confidenceLabel;
      kind.append(confidence);
    }
    const quantity = document.createElement("span");
    quantity.className = "catalog-expedition-quantity";
    quantity.textContent = Number.isFinite(Number(source.quantity_min))
      && Number.isFinite(Number(source.quantity_max))
      ? `x${formatNumber(source.quantity_min)}–${formatNumber(source.quantity_max)}`
      : "Possible reward";
    row.append(park, trip, kind, quantity);
    list.append(row);
  });
  section.append(list);
  return section;
}

function appendCarriedEffectRow(list, label, effects, unlockLevel = 0) {
  const values = Array.isArray(effects) ? effects.filter(Boolean) : [];
  if (!values.length) return false;

  const row = document.createElement("div");
  row.className = "catalog-carried-effect";
  const heading = document.createElement("div");
  heading.className = "catalog-carried-effect-heading";
  const title = document.createElement("strong");
  title.textContent = label;
  heading.append(title);
  if (unlockLevel) {
    const unlock = document.createElement("span");
    unlock.textContent = `Enhance +${unlockLevel}`;
    heading.append(unlock);
  }
  row.append(heading);
  const text = document.createElement("p");
  text.textContent = values.join(" ");
  row.append(text);
  list.append(row);
  return true;
}

function renderCarriedItemEffects(carriedEffects) {
  if (!carriedEffects) return null;
  const section = createCatalogSection("Carried item effects");
  const list = document.createElement("div");
  list.className = "catalog-carried-effects";
  appendCarriedEffectRow(list, "Base attributes", carriedEffects.base_attributes);
  appendCarriedEffectRow(list, "Core effect", carriedEffects.core_effects);
  const advancedEffects = Array.isArray(carriedEffects.advanced_effects) ? carriedEffects.advanced_effects : [];
  advancedEffects.forEach((advanced, effectIndex) => {
    appendCarriedEffectRow(
      list,
      `Advanced effect ${effectIndex === 0 ? "I" : "II"}`,
      advanced?.effects,
      Number(advanced?.unlock_level) || 0,
    );
  });
  if (!list.childElementCount) return null;
  section.append(list);
  return section;
}

function makeRuneShapeMark(shape, extraClass = "") {
  const mark = document.createElement("span");
  const shapeId = String(shape?.id || "unknown");
  mark.className = `catalog-rune-shape catalog-rune-shape--${shapeId}${extraClass ? ` ${extraClass}` : ""}`;
  mark.setAttribute("aria-hidden", "true");
  return mark;
}

function runeCountLabel(count) {
  const minimum = Number(count?.minimum) || 0;
  const maximum = Number(count?.maximum) || 0;
  return minimum === maximum ? String(minimum) : `${minimum}–${maximum}`;
}

function appendRuneRollPool(container, shape, title = "Possible secondary rolls") {
  if (!shape || !Array.isArray(shape.secondary_rolls) || !shape.secondary_rolls.length) return;
  const card = document.createElement("article");
  card.className = `catalog-rune-pool catalog-rune-pool--${shape.id}`;
  const heading = document.createElement("header");
  const identity = document.createElement("div");
  identity.className = "catalog-rune-pool-identity";
  identity.append(makeRuneShapeMark(shape));
  const headingCopy = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = `${shape.label} · ${shape.role}`;
  const main = document.createElement("small");
  const mainStats = (shape.main_stats || []).filter(Boolean);
  main.textContent = mainStats.length ? `Main: ${mainStats.join(" / ")}` : "";
  headingCopy.append(name);
  if (main.textContent) headingCopy.append(main);
  identity.append(headingCopy);
  const label = document.createElement("span");
  label.textContent = title;
  heading.append(identity, label);

  const rolls = document.createElement("div");
  rolls.className = "catalog-rune-rolls";
  shape.secondary_rolls.forEach((roll) => {
    const chip = document.createElement("span");
    const rollClass = roll.roll_class === "rare" ? "rare" : "standard";
    chip.classList.add(`is-${rollClass}`);
    const availableNames = Array.isArray(roll.available_on?.rune_names)
      ? roll.available_on.rune_names.filter(Boolean)
      : [];
    const titleParts = [roll.description || ""];
    if (availableNames.length) titleParts.push(`Available on: ${availableNames.join(", ")}`);
    if (titleParts.some(Boolean)) chip.title = titleParts.filter(Boolean).join("\n");
    if (rollClass === "rare") {
      const rarity = document.createElement("small");
      rarity.className = "catalog-rune-roll-rarity";
      rarity.textContent = "Rare";
      chip.append(rarity);
    }
    const rollName = document.createElement("strong");
    rollName.textContent = roll.label;
    const range = document.createElement("span");
    range.textContent = roll.range_label;
    chip.append(rollName, range);
    if (availableNames.length) {
      const availability = document.createElement("small");
      availability.className = "catalog-rune-roll-availability";
      const runeCount = Number(roll.available_on?.rune_count) || availableNames.length;
      availability.textContent = `${formatNumber(runeCount)} Rune${runeCount === 1 ? "" : "s"}`;
      chip.append(availability);
    }
    rolls.append(chip);
  });
  card.append(heading, rolls);
  container.append(card);
}

function renderCarriedItemRuneLayout(layout, runeReference) {
  if (!layout || !Array.isArray(layout.slots) || !layout.slots.length) return null;
  const section = createCatalogSection("Rune slots");
  section.classList.add("catalog-rune-section");

  const intro = document.createElement("div");
  intro.className = "catalog-rune-layout-intro";
  const summary = document.createElement("strong");
  summary.textContent = `${formatNumber(layout.available_socket_count || 0)} sockets at max +${formatNumber(layout.max_enhancement || 0)}`;
  const explanation = document.createElement("span");
  explanation.textContent = "Fixed slots are tied to this item. Any-shape slots roll separately on each copy.";
  intro.append(summary, explanation);

  const slots = document.createElement("div");
  slots.className = "catalog-rune-slots";
  layout.slots.forEach((slot) => {
    const card = document.createElement("article");
    card.className = `catalog-rune-slot is-${slot.kind || "unknown"}${slot.available_at_this_rarity ? "" : " is-unavailable"}`;
    const slotNumber = document.createElement("span");
    slotNumber.className = "catalog-rune-slot-number";
    slotNumber.textContent = `Slot ${slot.position}`;

    const marks = document.createElement("div");
    marks.className = "catalog-rune-slot-marks";
    const options = Array.isArray(slot.options) ? slot.options : [];
    options.forEach((shape) => marks.append(makeRuneShapeMark(shape, "is-small")));
    if (!marks.childElementCount) {
      const unavailableMark = document.createElement("span");
      unavailableMark.className = "catalog-rune-slot-lock";
      unavailableMark.textContent = "×";
      marks.append(unavailableMark);
    }

    const shapeLabel = document.createElement("strong");
    shapeLabel.textContent = slot.kind === "random"
      ? "Any shape"
      : (options[0]?.label || "Unavailable");
    const unlock = document.createElement("small");
    unlock.textContent = slot.available_at_this_rarity
      ? `Unlock +${slot.unlock_level}`
      : "Not available at this rarity";
    card.append(slotNumber, marks, shapeLabel, unlock);
    slots.append(card);
  });

  const countList = document.createElement("div");
  countList.className = "catalog-rune-counts";
  Object.values(layout.possible_shape_counts || {}).forEach((count) => {
    const chip = document.createElement("span");
    const shape = (runeReference?.shapes || []).find((candidate) => candidate?.label === count?.label);
    if (shape) chip.append(makeRuneShapeMark(shape, "is-tiny"));
    const label = document.createElement("span");
    label.textContent = `${count.label} ${runeCountLabel(count)}`;
    chip.append(label);
    countList.append(chip);
  });

  const details = document.createElement("details");
  details.className = "catalog-rune-reference";
  const detailsSummary = document.createElement("summary");
  detailsSummary.textContent = "Compatible Rune rolls";
  const poolGrid = document.createElement("div");
  poolGrid.className = "catalog-rune-pools";
  const usedShapeIds = new Set(
    layout.slots
      .filter((slot) => slot?.available_at_this_rarity)
      .flatMap((slot) => (slot.options || []).map((shape) => shape.id)),
  );
  (runeReference?.shapes || []).forEach((shape) => {
    if (usedShapeIds.has(shape.id)) appendRuneRollPool(poolGrid, shape);
  });
  const note = document.createElement("p");
  note.className = "catalog-rune-note";
  note.textContent = "This is the union of rolls available across compatible Runes. Values can differ by Rune type and tier; hover a roll for its Rune list, or open a Rune entry for its exact pool.";
  details.append(detailsSummary, poolGrid, note);

  section.append(intro, slots, countList, details);
  return section;
}

function renderRuneDetails(runeDetails, runeReference) {
  if (!runeDetails) return null;
  const section = createCatalogSection("Rune roll data");
  section.classList.add("catalog-rune-section");
  const facts = document.createElement("dl");
  facts.className = "catalog-facts catalog-rune-facts";
  appendCatalogFact(facts, "Shape", `${runeDetails.shape?.label || ""} · ${runeDetails.shape?.role || ""}`);
  appendCatalogFact(
    facts,
    "Main stat",
    (runeDetails.main_stats || []).map((stat) => `${stat.label} +${stat.value_label}`).join(", "),
  );
  appendCatalogFact(facts, "Rune Energy", formatNumber(runeDetails.energy || 0));
  appendCatalogFact(facts, "Secondary attributes", formatNumber(runeDetails.secondary_lines || 0));
  appendCatalogFact(facts, "Base CP", formatNumber(runeDetails.cp || 0));
  appendCatalogFact(facts, "Possible rolls", formatNumber((runeDetails.secondary_rolls || []).length));

  const poolGrid = document.createElement("div");
  poolGrid.className = "catalog-rune-pools";
  const shape = (runeReference?.shapes || []).find((candidate) => candidate?.id === runeDetails.shape?.id);
  const exactRolls = Array.isArray(runeDetails.secondary_rolls) ? runeDetails.secondary_rolls : [];
  if (shape && exactRolls.length) {
    appendRuneRollPool(
      poolGrid,
      { ...shape, main_stats: [], secondary_rolls: exactRolls },
      "Exact possible rolls",
    );
  }
  const note = document.createElement("p");
  note.className = "catalog-rune-note";
  note.textContent = runeDetails.roll_rule_summary
    ? `Configured range: ${runeDetails.roll_rule_summary}. The number of secondary lines is shown above.`
    : "Only rolls tied to this Rune are listed here; fixed rare lines are marked.";
  section.append(facts, poolGrid, note);
  return section;
}

function renderHoloBattleGizmoProgression(gizmo) {
  const stages = Array.isArray(gizmo?.stages) ? gizmo.stages : [];
  const alphaProgression = gizmo?.alpha_progression;
  if (stages.length < 2 && !alphaProgression) return null;

  const section = createCatalogSection("Holo-Battle progression");
  section.classList.add("catalog-gizmo-section");

  const intro = document.createElement("div");
  intro.className = "catalog-gizmo-intro";
  const classification = document.createElement("strong");
  classification.textContent = [gizmo?.series_name, gizmo?.classification || "Core Gizmo"]
    .filter(Boolean)
    .join(" · ");
  const note = document.createElement("span");
  note.textContent = stages.length > 1
    ? "Duplicate pickups upgrade the active Gizmo one layer at a time."
    : "This Gizmo has one active layer.";
  intro.append(classification, note);

  const stageList = document.createElement("div");
  stageList.className = "catalog-gizmo-stages";
  stages.forEach((stage, index) => {
    const stageCard = document.createElement("article");
    stageCard.className = "catalog-gizmo-stage";
    if (index === stages.length - 1) stageCard.classList.add("is-final");

    const header = document.createElement("header");
    const layer = document.createElement("span");
    layer.className = "catalog-gizmo-layer";
    layer.textContent = String(index + 1);
    const title = document.createElement("h4");
    title.textContent = stage?.name || `Layer ${index + 1}`;
    header.append(layer, title);

    const effects = document.createElement("ul");
    (Array.isArray(stage?.effects) ? stage.effects : []).forEach((effect) => {
      if (!effect) return;
      const item = document.createElement("li");
      item.textContent = effect;
      effects.append(item);
    });
    stageCard.append(header, effects);
    stageList.append(stageCard);
  });

  section.append(intro, stageList);

  if (alphaProgression) {
    const alpha = document.createElement("section");
    alpha.className = "catalog-gizmo-alpha";

    const alphaHeader = document.createElement("header");
    const alphaTitle = document.createElement("h4");
    alphaTitle.textContent = "Series Rogue Skill";
    const alphaSubtitle = document.createElement("span");
    alphaSubtitle.textContent = `${gizmo?.series_name || "Series"} progression · ${alphaProgression.alpha_aniimo || "Alpha transformation"}`;
    alphaHeader.append(alphaTitle, alphaSubtitle);

    const levels = document.createElement("div");
    levels.className = "catalog-gizmo-alpha-levels";
    (Array.isArray(alphaProgression.levels) ? alphaProgression.levels : []).forEach((level) => {
      const card = document.createElement("article");
      card.className = "catalog-gizmo-alpha-level";
      const point = document.createElement("strong");
      point.textContent = `${formatNumber(level?.points || 0)} points`;
      const unlock = document.createElement("span");
      unlock.textContent = level?.unlock || "Series reward";
      card.append(point, unlock);
      levels.append(card);
    });

    const modifierHeader = document.createElement("div");
    modifierHeader.className = "catalog-gizmo-modifier-header";
    const modifierTitle = document.createElement("strong");
    modifierTitle.textContent = "Series modifier pool";
    const modifierNote = document.createElement("span");
    modifierNote.textContent = alphaProgression.modifier_order || "Modifier order may vary.";
    modifierHeader.append(modifierTitle, modifierNote);

    const modifiers = document.createElement("div");
    modifiers.className = "catalog-gizmo-modifiers";
    (Array.isArray(alphaProgression.modifiers) ? alphaProgression.modifiers : []).forEach((modifier) => {
      const card = document.createElement("article");
      card.className = "catalog-gizmo-modifier";
      const title = document.createElement("h5");
      title.textContent = modifier?.name || "Series modifier";
      const description = document.createElement("p");
      description.textContent = modifier?.description || "";
      card.append(title, description);
      modifiers.append(card);
    });

    alpha.append(alphaHeader, levels, modifierHeader, modifiers);
    section.append(alpha);
  }
  return section;
}

function renderItemLogCatalogRecord(entry) {
  const record = document.createElement("article");
  record.className = "catalog-record catalog-itemlog-record";

  const identity = document.createElement("header");
  identity.className = "catalog-identity";
  const icon = makeIcon("catalog-hero-icon", entry.icon);
  icon.alt = `${entry.name} icon`;
  const copy = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "catalog-eyebrow";
  eyebrow.textContent = entry.catalog_category || entry.type || "Item";
  const name = document.createElement("h2");
  name.textContent = entry.name;
  const subtitle = document.createElement("p");
  subtitle.className = "catalog-subtitle";
  subtitle.textContent = entry.inventory || "";
  copy.append(eyebrow, name, subtitle);
  identity.append(icon, copy);
  if (entry.quality) {
    const quality = document.createElement("span");
    quality.className = `catalog-quality catalog-quality--${qualityClassName(entry.quality)}`;
    quality.textContent = entry.quality_display || entry.quality;
    identity.append(quality);
  }
  record.append(identity);

  if (entry.description) {
    const description = document.createElement("p");
    description.className = "catalog-description";
    description.textContent = entry.description;
    record.append(description);
  }

  const details = createCatalogSection("Item details");
  const facts = document.createElement("dl");
  facts.className = "catalog-facts";
  const detailFacts = Array.isArray(entry.detail_facts) && entry.detail_facts.length
    ? entry.detail_facts
    : [
      { label: "Category", value: entry.catalog_category || entry.type },
      { label: "Inventory", value: entry.inventory },
      { label: "Quality", value: entry.quality },
      { label: "Overworld nodes", value: entry.overworld_spawn_count ? formatNumber(entry.overworld_spawn_count) : "" },
      { label: "Known maps", value: Array.isArray(entry.spawn_maps) ? entry.spawn_maps.join(", ") : "" },
    ];
  detailFacts.forEach((fact) => appendCatalogFact(facts, fact?.label, fact?.value));
  if (facts.childElementCount) {
    details.append(facts);
    record.append(details);
  }

  const gizmoProgression = renderHoloBattleGizmoProgression(entry.holo_battle_gizmo);
  if (gizmoProgression) record.append(gizmoProgression);
  const requirements = renderItemLogRequirements(entry.requirements);
  if (requirements) record.append(requirements);
  const expeditionSources = renderRvExpeditionSources(entry);
  if (expeditionSources) record.append(expeditionSources);
  const obtainMethods = renderItemLogObtainMethods(
    Array.isArray(entry.obtain_methods)
      ? entry.obtain_methods.filter((method) => method?.label !== "RV Park Expedition")
      : [],
  );
  if (obtainMethods) record.append(obtainMethods);
  const carriedEffects = renderCarriedItemEffects(entry.carried_effects);
  if (carriedEffects) record.append(carriedEffects);
  const runeSocketLayout = renderCarriedItemRuneLayout(
    entry.rune_socket_layout,
    state.itemlogData?.rune_reference,
  );
  if (runeSocketLayout) record.append(runeSocketLayout);
  const runeDetails = renderRuneDetails(entry.rune_details, state.itemlogData?.rune_reference);
  if (runeDetails) record.append(runeDetails);

  return record;
}

function getAniilogExpandedGroups() {
  if (state.aniilogExpandedGroups instanceof Set) return state.aniilogExpandedGroups;

  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem(ANIILOG_EXPANDED_GROUPS_STORAGE_KEY) || "[]");
  } catch {
    saved = [];
  }

  state.aniilogExpandedGroups = new Set(
    Array.isArray(saved) ? saved.filter((value) => typeof value === "string") : []
  );
  return state.aniilogExpandedGroups;
}

function persistAniilogExpandedGroups(expandedGroups) {
  try {
    localStorage.setItem(
      ANIILOG_EXPANDED_GROUPS_STORAGE_KEY,
      JSON.stringify([...expandedGroups])
    );
  } catch {
    // Local storage can be unavailable in private browsing modes.
  }
}

function getAniilogEntryName(entry) {
  return String(entry?.name || entry?.displayName || entry?.title || "").trim();
}

function getAniilogEntryForm(entry) {
  const direct = String(entry?.form || entry?.formName || entry?.variant || "").trim();
  if (direct) return direct;

  return String(entry?.subtitle || "")
    .replace(/^#\d+\s*[-\u2022]\s*/u, "")
    .trim();
}

function getAniilogEntryNumber(entry) {
  const direct = String(
    entry?.aniilogNumber
      || entry?.aniilogNo
      || entry?.aniilog_number
      || entry?.number
      || ""
  ).trim();
  if (direct) return direct.replace(/^#/, "");
  return String(entry?.subtitle || "").match(/#?(\d{1,3})/)?.[1] || "";
}

function getAniilogGroupKey(entry) {
  const number = getAniilogEntryNumber(entry).toLowerCase();
  const name = getAniilogEntryName(entry)
    .replace(/\s+\([^)]+\)$/u, "")
    .trim()
    .toLowerCase();
  return `${number || "unknown"}::${name || String(entry?.id || "")}`;
}

function isAniilogBasicForm(entry) {
  const form = getAniilogEntryForm(entry);
  return /^(basic|basic form)$/i.test(form)
    || /\((?:basic|basic form)\)$/i.test(getAniilogEntryName(entry));
}

function renderAniilogGroupedIndex(entries, selectedId) {
  const index = document.createElement("div");
  index.className = "catalog-index catalog-grouped-index";
  const groups = new Map();

  entries.forEach((entry) => {
    const key = getAniilogGroupKey(entry);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  });

  const expandedGroups = getAniilogExpandedGroups();
  groups.forEach((groupEntries, groupKey) => {
    const baseEntry = groupEntries.find(isAniilogBasicForm) || groupEntries[0];
    const childEntries = groupEntries.filter((entry) => entry !== baseEntry);
    const group = document.createElement("section");
    group.className = "catalog-form-group";
    group.dataset.aniilogGroup = groupKey;

    const base = document.createElement("div");
    base.className = "catalog-form-base";
    const baseRow = createCatalogIndexRow(baseEntry, selectedId, "aniilog", null);
    base.append(baseRow);
    group.append(base);

    if (childEntries.length) {
      const expanded = expandedGroups.has(groupKey);
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "catalog-form-toggle";
      toggle.setAttribute(
        "aria-label",
        `${expanded ? "Collapse" : "Expand"} ${getAniilogEntryName(baseEntry)} forms`
      );
      toggle.setAttribute("aria-expanded", String(expanded));
      toggle.textContent = expanded ? "-" : "+";
      toggle.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (expandedGroups.has(groupKey)) expandedGroups.delete(groupKey);
        else expandedGroups.add(groupKey);
        persistAniilogExpandedGroups(expandedGroups);
        renderCatalogPreview();
      });
      base.append(toggle);

      if (expanded) {
        const children = document.createElement("div");
        children.className = "catalog-form-children";
        childEntries.forEach((childEntry) => {
          const child = createCatalogIndexRow(childEntry, selectedId, "aniilog", null);
          child.classList.add("catalog-form-child");
          children.append(child);
        });
        group.append(children);
      }
    }

    index.append(group);
  });

  return index;
}

function renderCatalogSidebar(view, title, allEntries, entries, selectedId, statusMessage = "", allowControls = true, options = {}) {
  const fragment = document.createDocumentFragment();
  let index = null;
  const savedScrollTop = Number(state.catalogIndexScroll[view]) || 0;
  const existingSearchLabel = options.preserveSearchInput
    ? els.catalogSidebarContent.querySelector(`.catalog-search-label[data-catalog-view="${view}"]`)
    : null;
  const existingSearchInput = existingSearchLabel?.querySelector(".catalog-search");
  const shouldRestoreSearchFocus = document.activeElement === existingSearchInput;
  const heading = document.createElement("div");
  heading.className = "panel-heading catalog-sidebar-heading";
  const name = document.createElement("h2");
  name.textContent = title;
  const count = document.createElement("span");
  count.className = "filter-count";
  count.textContent = allowControls
    ? `${entries.length} / ${allEntries.length}`
    : (statusMessage.startsWith("Loading") ? "Loading" : "Unavailable");
  const headingActions = document.createElement("div");
  headingActions.className = "catalog-heading-actions";
  headingActions.append(count);
  if (view === "aniilog" && allowControls) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "catalog-filter-toggle";
    const toggleSymbol = document.createElement("span");
    toggleSymbol.className = "catalog-filter-toggle-symbol";
    toggleSymbol.classList.toggle("is-open", state.aniilogFiltersOpen);
    toggleSymbol.setAttribute("aria-hidden", "true");
    toggle.append(toggleSymbol);
    toggle.setAttribute("aria-label", state.aniilogFiltersOpen ? "Collapse filters" : "Expand filters");
    toggle.setAttribute("aria-expanded", String(state.aniilogFiltersOpen));
    toggle.addEventListener("click", () => {
      state.aniilogFiltersOpen = !state.aniilogFiltersOpen;
      renderCatalogPreview();
    });
    headingActions.append(toggle);
  }
  heading.append(name, headingActions);
  fragment.append(heading);

  if (allowControls) {
    const categoryToolbar = renderCatalogCategoryToolbar(view);
    if (categoryToolbar) fragment.append(categoryToolbar);
    if (view === "aniilog") fragment.append(renderAniilogSortControl());
    fragment.append(renderCatalogSearch(view, existingSearchLabel));
  }

  if (entries.length) {
    const hasAniilogSearch = Boolean(
      view === "aniilog" && String(state.catalogSearch?.aniilog || "").trim()
    );
    const shouldGroupAniilog = view === "aniilog"
      && !hasAniilogSearch
      && entries.length === allEntries.length;
    index = shouldGroupAniilog
      ? renderAniilogGroupedIndex(entries, selectedId)
      : renderCatalogIndex(entries, selectedId, view, title);
    index.dataset.catalogView = view;
    index.addEventListener("scroll", () => {
      state.catalogIndexScroll[view] = index.scrollTop;
    }, { passive: true });
    fragment.append(index);
  } else {
    const empty = document.createElement("p");
    empty.className = "catalog-empty catalog-sidebar-empty";
    empty.textContent = statusMessage || "No catalogue entries are available.";
    fragment.append(empty);
  }

  els.catalogSidebarContent.replaceChildren(fragment);
  if (shouldRestoreSearchFocus && existingSearchInput?.isConnected) {
    existingSearchInput.focus({ preventScroll: true });
  }
  if (index && savedScrollTop) {
    window.requestAnimationFrame(() => {
      if (!index.isConnected) return;
      index.scrollTop = savedScrollTop;
      index.refreshVirtualRows?.();
    });
  }
}

function renderCatalogPreview(options = {}) {
  if (!isCatalogView()) return;
  const view = state.sidebarView;
  const title = view === "aniilog" ? "Aniilog" : "Item-log";
  const sidebarTitle = view === "aniilog" ? "Filters" : "Items";
  const currentIndex = els.catalogSidebarContent.querySelector(".catalog-index");
  if (currentIndex?.dataset.catalogView === view) state.catalogIndexScroll[view] = currentIndex.scrollTop;
  els.catalogPanel.textContent = "";
  els.catalogPanel.setAttribute("aria-label", `${title} catalogue`);

  const heading = document.createElement("header");
  heading.className = "catalog-heading";
  const headingCopy = document.createElement("div");
  const name = document.createElement("h1");
  name.textContent = title;
  const subtitle = document.createElement("p");
  subtitle.textContent = view === "aniilog" ? "Loading form data" : "Loading item data";
  headingCopy.append(name, subtitle);
  const badge = document.createElement("span");
  badge.className = "catalog-preview-badge";
  badge.textContent = "Source data";
  heading.append(headingCopy, badge);
  els.catalogPanel.append(heading);

  const loadError = catalogLoadErrorForView(view);
  if (loadError) {
    renderCatalogSidebar(view, sidebarTitle, [], [], "", "Catalogue data could not be loaded.", false);
    const message = document.createElement("p");
    message.className = "catalog-empty";
    message.textContent = view === "aniilog"
      ? "Aniilog data could not be loaded."
      : "Item-log data could not be loaded.";
    els.catalogPanel.append(message);
    return;
  }

  if (view === "aniilog" && !state.aniilogData) {
    renderCatalogSidebar(view, sidebarTitle, [], [], "", "Loading source-backed Aniimo data.", false);
    const message = document.createElement("p");
    message.className = "catalog-empty";
    message.textContent = "Loading Aniilog forms and source-backed abilities.";
    els.catalogPanel.append(message);
    void ensureAniilogData();
    return;
  }

  if (view === "itemlog" && !state.itemlogData) {
    renderCatalogSidebar(view, sidebarTitle, [], [], "", "Loading source-backed Item-log data.", false);
    const message = document.createElement("p");
    message.className = "catalog-empty";
    message.textContent = "Loading named game items, source art, effects, and acquisition methods.";
    els.catalogPanel.append(message);
    void ensureItemlogData();
    return;
  }

  const allEntries = allCatalogEntriesForView(view);
  const entries = catalogEntriesForView(view);
  if (view === "aniilog" && state.aniilogData?.totals) {
    const totals = state.aniilogData.totals;
    subtitle.textContent = `${formatNumber(totals.forms)} current forms + ${formatNumber(totals.special_forms)} special forms`;
  } else if (view === "itemlog" && allEntries.length) {
    const totals = state.itemlogData?.totals;
    subtitle.textContent = `${formatNumber(entries.length)} of ${formatNumber(totals?.named_items || allEntries.length)} named game items`;
  }
  if (!entries.length) {
    const entryLabel = view === "aniilog" ? "Aniimo" : "Item";
    const noResultsFromFilters = view === "aniilog" && hasActiveAniilogFilters();
    const noResultsMessage = noResultsFromFilters
      ? "Those filters are too specific. Try fewer filters or a different combination."
      : (catalogSearchForView(view) ? `No ${entryLabel} entries match that search.` : "No catalogue records are available.");
    renderCatalogSidebar(
      view,
      sidebarTitle,
      allEntries,
      entries,
      "",
      noResultsMessage,
      true,
      options,
    );
    const message = document.createElement("p");
    message.className = "catalog-empty";
    message.textContent = noResultsMessage;
    els.catalogPanel.append(message);
    return;
  }

  const selected = entries.find((entry) => entry.id === state.catalogSelection[view]) || entries[0];
  state.catalogSelection[view] = selected.id;
  renderCatalogSidebar(view, sidebarTitle, allEntries, entries, selected.id, "", true, options);
  els.catalogPanel.append(view === "aniilog" ? renderAniilogCatalogRecord(selected) : renderItemLogCatalogRecord(selected));
}

function checklistEntriesForCategory(category = state.checklistCategory) {
  if (!Array.isArray(state.checklistData?.entries)) return [];
  return state.checklistData.entries.filter((entry) => entry?.category === category);
}

const LUMIN_CHECKLIST_TABS = Object.freeze([
  { id: "ambers", label: "Ambers", kind: "lumin_amber", sourceType: "overworld" },
  { id: "sanctums", label: "Sanctums", kind: "lumin_sanctum", sourceType: "sanctum" },
  { id: "markings", label: "Markings", kind: "lumin_amber", sourceType: "lumin_marking" },
  { id: "boss-clears", label: "Bosses", kind: "lumin_amber", sourceType: "quest" },
  { id: "event-embers", label: "Events", kind: "lumin_amber", sourceType: "event" },
]);

function luminChecklistEntries(tabId = state.luminChecklistTab) {
  const tab = LUMIN_CHECKLIST_TABS.find((candidate) => candidate.id === tabId)
    || LUMIN_CHECKLIST_TABS[0];
  return checklistEntriesForCategory("ambers").filter((entry) => (
    entry?.kind === tab.kind && entry?.source_type === tab.sourceType
  ));
}

function checklistEntriesForActiveTab() {
  return state.checklistCategory === "ambers"
    ? luminChecklistEntries()
    : checklistEntriesForCategory();
}

function checklistSpecialEntries() {
  return Array.isArray(state.checklistData?.special_entries)
    ? state.checklistData.special_entries
    : [];
}

function checklistCompletionStateIds(entries) {
  const ids = new Set();
  entries.forEach((entry) => {
    (entry?.completion_states || []).forEach((completionState) => {
      const id = String(completionState?.id || "").trim();
      if (id) ids.add(id);
    });
  });
  return ids;
}

function completedChecklistCount(entries = [
  ...checklistEntriesForCategory("aniimo"),
  ...checklistEntriesForCategory("ambers"),
  ...checklistSpecialEntries(),
]) {
  const stateIds = checklistCompletionStateIds(entries);
  return [...stateIds].filter((id) => state.completed.has(id)).length;
}

function checklistCompletionStateQuantity(completionState) {
  const value = Number(completionState?.quantity ?? 1);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 1;
}

function checklistProgress(entries) {
  const useRewardQuantities = entries.some((entry) => entry?.category === "ambers");
  const seen = new Set();
  let completed = 0;
  let total = 0;
  entries.forEach((entry) => {
    (entry?.completion_states || []).forEach((completionState) => {
      const id = String(completionState?.id || "").trim();
      if (!id || seen.has(id)) return;
      seen.add(id);
      const quantity = useRewardQuantities ? checklistCompletionStateQuantity(completionState) : 1;
      total += quantity;
      if (state.completed.has(id)) completed += quantity;
    });
  });
  return { completed, total };
}

function totalChecklistCompletions() {
  if (!state.checklistData) return state.completed.size;
  return completedChecklistCount();
}

function checklistEntryMatches(entry) {
  if (!state.checklistSearch) return true;
  return searchText([
    entry?.id,
    entry?.name,
    entry?.form_label,
    entry?.aniilog_number,
    entry?.source_label,
    entry?.map_label,
    entry?.area_name,
    entry?.coordinate_key,
    entry?.classification,
    entry?.detail,
    entry?.completion_states?.map((completionState) => completionState?.label),
  ]).includes(state.checklistSearch);
}

const LUMIN_COMPLETION_MARKER_TYPES = new Set(["lumin_amber", "lumin_marking", "teleport_sanctum", "quest_lumen_seed", "lumin_event"]);
const LUMIN_CHECKLIST_ENTRY_KINDS = new Set(["lumin_amber", "lumin_sanctum"]);

function isLuminCompletionSpawn(spawn) {
  return Boolean(spawn) && LUMIN_COMPLETION_MARKER_TYPES.has(spawn.marker_type);
}

function isLuminChecklistEntry(entry) {
  return LUMIN_CHECKLIST_ENTRY_KINDS.has(entry?.kind);
}

function luminSourceTypeForSpawn(spawn) {
  if (spawn?.marker_type === "lumin_amber") return "overworld";
  if (spawn?.marker_type === "lumin_marking") return "lumin_marking";
  if (spawn?.marker_type === "teleport_sanctum") return "sanctum";
  if (spawn?.marker_type === "quest_lumen_seed") return "quest";
  if (spawn?.marker_type === "lumin_event") return "event";
  return "";
}

function luminCompletionIdForSpawn(spawn) {
  if (!isLuminCompletionSpawn(spawn)) return "";
  const explicitCompletionId = String(spawn?.completion_id || "").trim();
  if (explicitCompletionId) return explicitCompletionId;
  const sourceType = luminSourceTypeForSpawn(spawn);
  const mapId = String(spawn.map_id || "").trim();
  const sceneId = String(spawn.scene_id || "").trim();
  const coordinateKey = String(spawn.coordinate_key || "").trim();
  if (!mapId || !sceneId || !coordinateKey) return "";
  return `amber:${sourceType}:${mapId}:${sceneId}:${coordinateKey}:collected`;
}

function luminCompletionIdForChecklistEntry(entry) {
  const completionState = (entry?.completion_states || []).find((candidate) => (
    String(candidate?.id || "").endsWith(":collected")
  ));
  return String(completionState?.id || "").trim();
}

function createPinCompletionBadge() {
  const badge = document.createElement("span");
  badge.className = "pin-completion-badge";
  badge.setAttribute("aria-hidden", "true");
  badge.textContent = "\u2713";
  return badge;
}

function syncPinCompletionBadge(pin, spawn) {
  const completionId = luminCompletionIdForSpawn(spawn);
  if (!completionId) return;
  const completed = state.completed.has(completionId);
  pin.classList.toggle("pin-completed", completed);
  const existingBadge = pin.querySelector(".pin-completion-badge");
  if (completed && !existingBadge) {
    pin.querySelector(".pin-body")?.append(createPinCompletionBadge());
  } else if (!completed && existingBadge) {
    existingBadge.remove();
  }
}

function syncLuminCompletionPins() {
  if (state.canvasMode) {
    scheduleCanvasRender();
    return;
  }
  els.pinLayer.querySelectorAll(".pin[data-spawn-index]").forEach((pin) => {
    const index = Number(pin.dataset.spawnIndex);
    const spawn = state.data?.spawns[index];
    if (isLuminCompletionSpawn(spawn)) syncPinCompletionBadge(pin, spawn);
  });
}

function refreshLuminCompletionViews() {
  syncLuminCompletionPins();
  renderChecklist();
  renderSettings();
}

function waitForActiveMapDataset(mapId, timeoutMs = 6000) {
  return new Promise((resolve, reject) => {
    const deadline = window.performance.now() + timeoutMs;
    const check = () => {
      if (state.activeMapId !== mapId) {
        reject(new Error("Map changed before the marker could be located."));
        return;
      }
      if (state.mapLoadError) {
        reject(state.mapLoadError);
        return;
      }
      if (!state.loadingMapId) {
        resolve();
        return;
      }
      if (window.performance.now() >= deadline) {
        reject(new Error("Timed out while loading map markers."));
        return;
      }
      window.setTimeout(check, 40);
    };
    check();
  });
}

async function locateChecklistLuminEntry(entry) {
  const completionId = luminCompletionIdForChecklistEntry(entry);
  const mapId = String(entry?.map_id || "").trim();
  if (!completionId || !mapId || !state.data?.mapsById.has(mapId)) return;

  if (state.activeMapId !== mapId) switchMap(mapId);

  try {
    await waitForActiveMapDataset(mapId);
  } catch (error) {
    console.error("Could not locate Lumen checklist entry.", error);
    return;
  }

  const index = state.data.spawns.findIndex((spawn) => (
    luminCompletionIdForSpawn(spawn) === completionId
  ));
  if (index < 0) {
    console.warn("No map marker matched the Lumen checklist entry.", entry.id);
    return;
  }

  const spawn = state.data.spawns[index];
  state.locatedSpawnIndex = index;
  refreshVisibility();
  selectSpawn(index);
  focusSpawn(spawn);
}

function updateChecklistCompletion(entry, completionState, checked) {
  const completionId = String(completionState?.id || "").trim();
  if (!completionId) return;

  if (checked && entry?.choice_group) {
    checklistSpecialEntries().forEach((candidate) => {
      if (candidate?.id === entry.id || candidate?.choice_group !== entry.choice_group) return;
      (candidate.completion_states || []).forEach((candidateState) => {
        const candidateId = String(candidateState?.id || "").trim();
        if (candidateId) state.completed.delete(candidateId);
      });
    });
  }

  if (checked) {
    state.completed.add(completionId);
  } else {
    state.completed.delete(completionId);
  }
  persistLocalTracking();
  if (isLuminChecklistEntry(entry)) {
    refreshLuminCompletionViews();
  } else {
    renderChecklist();
    renderSettings();
  }
}

function checklistMetaText(entry) {
  if (entry?.kind === "aniimo_form") {
    return [entry.aniilog_number, entry.form_label].filter(Boolean).join(" - ");
  }
  if (entry?.kind === "aniimo_special") {
    const label = entry.classification === "starter_choice" ? "Starter choice" : "Temporary evolution";
    return [label, entry.detail].filter(Boolean).join(" - ");
  }
  if (entry?.source_type === "overworld") {
    return [
      entry?.source_label,
      entry?.map_label,
      entry?.coordinate_key,
    ].filter(Boolean).join(" - ");
  }
  if (entry?.source_type === "quest_reward") {
    return [entry?.source_label, entry?.quest_name].filter(Boolean).join(" - ");
  }
  if (entry?.source_type === "quest") {
    return [
      entry?.source_label,
      entry?.map_label,
      entry?.area_name,
      entry?.coordinate_key,
    ].filter(Boolean).join(" - ");
  }
  return [
    entry?.source_label,
    entry?.map_label,
    entry?.area_name,
    entry?.coordinate_key,
  ].filter(Boolean).join(" - ");
}

function renderChecklistRow(entry) {
  const row = document.createElement("article");
  row.className = "checklist-row";
  if (entry?.kind === "aniimo_special") row.classList.add("checklist-special-row");
  if (isLuminChecklistEntry(entry)) row.classList.add("checklist-lumin-row");
  row.dataset.checklistEntryId = entry.id;

  row.append(makeIcon("checklist-icon", entry.icon));
  const content = document.createElement("div");
  content.className = "checklist-text";
  const name = document.createElement("strong");
  name.textContent = entry.name || "Unnamed entry";
  name.title = name.textContent;
  const meta = document.createElement("small");
  meta.textContent = checklistMetaText(entry);
  meta.title = meta.textContent;
  content.append(name, meta);
  row.append(content);

  const states = document.createElement("div");
  states.className = "checklist-states";
  (entry.completion_states || []).forEach((completionState) => {
    const control = document.createElement("label");
    control.className = "checklist-toggle";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = state.completed.has(completionState.id);
    input.setAttribute("aria-label", `${completionState.label} ${entry.name}`);
    input.addEventListener("change", () => {
      updateChecklistCompletion(entry, completionState, input.checked);
    });
    const label = document.createElement("span");
    label.textContent = completionState.label;
    control.append(input, label);
    states.append(control);
  });
  if (isLuminChecklistEntry(entry) && entry?.map_id && luminCompletionIdForChecklistEntry(entry)) {
    const locate = document.createElement("button");
    locate.type = "button";
    locate.className = "checklist-locate";
    locate.textContent = "Locate";
    locate.addEventListener("click", () => {
      void locateChecklistLuminEntry(entry);
    });
    states.append(locate);
  }
  row.append(states);
  return row;
}

function renderChecklistSpecialSection() {
  const visibleEntries = checklistSpecialEntries().filter(checklistEntryMatches);
  if (!visibleEntries.length) return null;

  const allSpecialEntries = checklistSpecialEntries();
  const starterEntries = allSpecialEntries.filter((entry) => entry.classification === "starter_choice");
  const temporaryEntries = allSpecialEntries.filter((entry) => entry.classification === "temporary_evolution");
  const selectedStarters = completedChecklistCount(starterEntries);
  const seenTemporary = completedChecklistCount(temporaryEntries);

  const section = document.createElement("section");
  section.className = "checklist-special-section";
  const heading = document.createElement("div");
  heading.className = "checklist-section-heading";
  const title = document.createElement("strong");
  title.textContent = "Special statistics";
  const total = document.createElement("span");
  total.textContent = "Outside 414 total";
  heading.append(title, total);
  const detail = document.createElement("p");
  detail.textContent = `Choose either Lunara or Helion: ${selectedStarters} / 1. Skill evolutions seen: ${seenTemporary} / ${temporaryEntries.length}.`;
  const rows = document.createElement("div");
  rows.className = "checklist-section-rows";
  visibleEntries.forEach((entry) => rows.append(renderChecklistRow(entry)));
  section.append(heading, detail, rows);
  return section;
}

function renderLuminChecklistTabs() {
  els.luminChecklistTabs.textContent = "";
  const availableTabs = LUMIN_CHECKLIST_TABS.filter((tab) => luminChecklistEntries(tab.id).length);
  if (!availableTabs.some((tab) => tab.id === state.luminChecklistTab)) {
    state.luminChecklistTab = availableTabs[0]?.id || LUMIN_CHECKLIST_TABS[0].id;
  }
  availableTabs.forEach((tab) => {
    const entries = luminChecklistEntries(tab.id);
    const progress = checklistProgress(entries);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lumin-checklist-tab";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(state.luminChecklistTab === tab.id));
    button.tabIndex = state.luminChecklistTab === tab.id ? 0 : -1;
    button.addEventListener("click", () => {
      state.luminChecklistTab = tab.id;
      renderChecklist();
    });
    const label = document.createElement("span");
    label.textContent = tab.label;
    const count = document.createElement("small");
    count.textContent = `${progress.completed} / ${progress.total}`;
    button.append(label, count);
    els.luminChecklistTabs.append(button);
  });
  els.luminChecklistTabs.hidden = availableTabs.length === 0;
}

function renderChecklist() {
  els.checklistCategoryTabs.textContent = "";
  els.luminChecklistTabs.textContent = "";
  els.luminChecklistTabs.hidden = true;
  els.checklistList.textContent = "";

  if (!state.checklistData) {
    els.checklistCount.textContent = state.checklistLoadError ? "Unavailable" : "Loading";
    const message = document.createElement("div");
    message.className = "checklist-empty";
    message.textContent = state.checklistLoadError || "Loading checklist data...";
    els.checklistList.append(message);
    return;
  }

  const categories = Array.isArray(state.checklistData.categories) ? state.checklistData.categories : [];
  if (!categories.some((category) => category?.id === state.checklistCategory)) {
    state.checklistCategory = categories[0]?.id || "aniimo";
  }

  categories.forEach((category) => {
    const entries = checklistEntriesForCategory(category.id);
    const progress = checklistProgress(entries);
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "checklist-category-tab checklist-main-tab";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", String(state.checklistCategory === category.id));
    tab.tabIndex = state.checklistCategory === category.id ? 0 : -1;
    tab.addEventListener("click", () => {
      state.checklistCategory = category.id;
      renderChecklist();
    });
    const label = document.createElement("span");
    label.textContent = category.label || category.id;
    const count = document.createElement("small");
    count.textContent = `${progress.completed} / ${progress.total}`;
    tab.append(label, count);
    els.checklistCategoryTabs.append(tab);
  });

  if (state.checklistCategory === "ambers") renderLuminChecklistTabs();

  const entries = checklistEntriesForActiveTab();
  const progress = checklistProgress(entries);
  els.checklistCount.textContent = `${progress.completed} / ${progress.total}`;
  const visibleEntries = entries.filter(checklistEntryMatches);
  const fragment = document.createDocumentFragment();
  let renderedSections = 0;
  if (state.checklistCategory === "aniimo") {
    const specialSection = renderChecklistSpecialSection();
    if (specialSection) {
      fragment.append(specialSection);
      renderedSections += 1;
    }
  }
  if (visibleEntries.length) {
    const section = document.createElement("section");
    section.className = "checklist-section";
    const rows = document.createElement("div");
    rows.className = "checklist-section-rows";
    visibleEntries.forEach((entry) => rows.append(renderChecklistRow(entry)));
    section.append(rows);
    fragment.append(section);
    renderedSections += 1;
  }
  if (!renderedSections) {
    const empty = document.createElement("div");
    empty.className = "checklist-empty";
    empty.textContent = state.checklistSearch ? "No matching checklist entries" : "No checklist entries available";
    fragment.append(empty);
  }
  els.checklistList.append(fragment);
}

function updateWorkspaceTabs() {
  const workspaces = {
    map: { tab: els.mapWorkspaceTab, panel: els.mapWorkspace },
    tracking: { tab: els.trackingWorkspaceTab, panel: els.trackingWorkspace },
    checklist: { tab: els.checklistWorkspaceTab, panel: els.checklistWorkspace },
    aniilog: { tab: els.aniilogWorkspaceTab },
    itemlog: { tab: els.itemlogWorkspaceTab },
  };
  Object.entries(workspaces).forEach(([view, workspace]) => {
    const selected = state.sidebarView === view;
    workspace.tab.setAttribute("aria-selected", String(selected));
    workspace.tab.tabIndex = selected ? 0 : -1;
    if (workspace.panel) workspace.panel.hidden = !selected;
  });

  const catalogView = isCatalogView();
  els.catalogWorkspace.hidden = !catalogView;
  if (catalogView) {
    els.catalogWorkspace.setAttribute(
      "aria-labelledby",
      state.sidebarView === "aniilog" ? "aniilogWorkspaceTab" : "itemlogWorkspaceTab",
    );
  }
  els.mapSurface.hidden = catalogView;
  els.catalogPanel.hidden = !catalogView;
  els.mapPanel.classList.toggle("catalog-active", catalogView);
  document.body.classList.toggle("catalog-view-active", catalogView);
  if (catalogView) renderCatalogPreview();
}

function setSidebarView(view) {
  const previousView = state.sidebarView;
  const nextView = ["map", "tracking", "checklist", "aniilog", "itemlog"].includes(view) ? view : "map";
  state.sidebarView = nextView;
  if (nextView === "aniilog") void ensureAniilogData();
  updateWorkspaceTabs();
  refreshSelectionDetails();
  updateMobileSelectionPanel();
  if (nextView === "tracking") {
    renderTracking();
    startTrackingTicker();
  } else {
    stopTrackingTicker();
    if (nextView === "checklist") renderChecklist();
  }
  if (isCatalogView(nextView)) return;
  stabilizeViewport();
  if (isCatalogView(previousView)) {
    window.requestAnimationFrame(() => {
      if (!isCatalogView()) fitMap();
    });
  }
}

function fallbackCopyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.append(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  textarea.remove();
  return copied;
}

function resetDocumentScroll() {
  if (MOBILE_LAYOUT_QUERY.matches) return;
  const scrollingElement = document.scrollingElement || document.documentElement;
  if (window.scrollX || window.scrollY) {
    window.scrollTo(0, 0);
  }
  [scrollingElement, document.documentElement, document.body].forEach((element) => {
    if (!element) return;
    if (element.scrollLeft) element.scrollLeft = 0;
    if (element.scrollTop) element.scrollTop = 0;
  });
}

function stabilizeViewport() {
  resetDocumentScroll();
  resetMapScroll();
}

function mapViewportSizeChanged(rect) {
  return Math.abs(rect.width - state.viewportWidth) > 1
    || Math.abs(rect.height - state.viewportHeight) > 1;
}

function scheduleMapViewportFit() {
  if (isCatalogView()) return;
  if (state.viewportFitFrame) return;
  state.viewportFitFrame = window.requestAnimationFrame(() => {
    state.viewportFitFrame = 0;
    if (!state.data) return;
    const rect = els.mapViewport.getBoundingClientRect();
    if (!mapViewportSizeChanged(rect)) return;
    fitMap();
  });
}

function preventControlFocus(event) {
  event.preventDefault();
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the old clipboard path.
  }
  return fallbackCopyText(text);
}

async function copyDetailValue(element, value) {
  const copied = await copyText(value);
  if (!copied) return;
  window.clearTimeout(element.copyResetTimer);
  element.dataset.value = value;
  element.textContent = "Copied";
  element.classList.add("copied");
  element.copyResetTimer = window.setTimeout(() => {
    element.classList.add("returning");
    window.setTimeout(() => {
      element.textContent = element.dataset.value || value;
      element.classList.remove("copied", "returning");
    }, 130);
  }, 650);
}

function renderMapBase() {
  const map = currentMap();
  if (!map) return;
  els.mapTiles.textContent = "";
  els.mapTiles.hidden = true;
  els.mapTiles.dataset.signature = "";
  state.tileMapId = map.id;
  els.mapImage.hidden = false;
  els.mapImage.alt = `${map.label} map`;
  delete els.mapImage.dataset.usedFallback;
  els.mapImage.src = map.image;
  els.mapImage.onerror = () => {
    if (currentMap()?.id !== map.id) return;
    if (!map.fallback_image || els.mapImage.dataset.usedFallback === map.id) return;
    els.mapImage.dataset.usedFallback = map.id;
    els.mapImage.src = map.fallback_image;
  };
  scheduleMapTileDetail();
}

function updateMobileSelectionPanel() {
  const isMobile = MOBILE_LAYOUT_QUERY.matches;
  const minimized = isMobile && state.mobileSelectionMinimized;
  const hasSelection = state.selectedSpawnIndex !== null;
  els.mobileSelectionPanel.hidden = !isMobile || !hasSelection;
  els.mobileSelectionPanel.classList.toggle("is-minimized", minimized);
  els.mobileSelectionToggle.textContent = minimized ? "+" : "-";
  els.mobileSelectionToggle.setAttribute("aria-expanded", String(!minimized));
  const label = minimized ? "Expand selection" : "Minimize selection";
  els.mobileSelectionToggle.setAttribute("aria-label", label);
  els.mobileSelectionToggle.title = label;
}

function setMobileSelectionMinimized(minimized) {
  state.mobileSelectionMinimized = Boolean(minimized);
  updateMobileSelectionPanel();
}

function clearSelectionDetails(message) {
  [els.selectionDetail, els.mobileSelectionDetail].forEach((detail) => {
    detail.className = "selection empty";
    detail.textContent = message;
  });
  updateSelectionCatalogShortcuts(null, null);
}

function selectionCatalogKind(item) {
  if (item?.is_aniimo) return "aniilog";
  const itemId = String(item?.item_id || "");
  if (/^\d+$/.test(itemId)) return "itemlog";
  if (/^(?:alpha_egg:\d+|elite_egg_area:\d+)$/.test(itemId)) return "itemlog";
  return "";
}

function updateSelectionCatalogShortcuts(spawn, item) {
  const view = spawn && item ? selectionCatalogKind(item) : "";
  const label = view === "aniilog" ? "Open in Aniilog" : "Open in Item-log";
  [els.selectionCatalogShortcut, els.mobileSelectionCatalogShortcut].forEach((button) => {
    if (!button) return;
    button.hidden = !view;
    button.disabled = false;
    button.dataset.catalogView = view;
    button.textContent = view ? label : "";
    button.setAttribute("aria-label", view ? label : "");
    button.title = view ? label : "";
  });
}

function setSelectionCatalogShortcutBusy(busy) {
  [els.selectionCatalogShortcut, els.mobileSelectionCatalogShortcut].forEach((button) => {
    if (!button || button.hidden) return;
    button.disabled = Boolean(busy);
  });
}

function resolveAniilogEntryForSelection(item, entries) {
  const aniimoId = String(item?.aniimo_id || "");
  const speciesName = String(item?.species_name || "").trim();
  const formKey = aniilogFormKey(item?.form_key);
  const baseIds = new Set([aniimoId]);
  if (/^\d{7}$/.test(aniimoId)) baseIds.add(aniimoId.slice(0, 5));

  return entries.find((entry) => (
    baseIds.has(String(entry?.base_id || ""))
    && aniilogFormKey(entry?.form_key) === formKey
  )) || entries.find((entry) => String(entry?.form_id || "") === aniimoId)
    || entries.find((entry) => (
      baseIds.has(String(entry?.base_id || ""))
      && aniilogFormKey(entry?.form_key) === "basic"
    )) || entries.find((entry) => (
      speciesName
      && String(entry?.name || "").trim().toLowerCase() === speciesName.toLowerCase()
      && aniilogFormKey(entry?.form_key) === "basic"
    )) || null;
}

function normalizedEggLocation(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/\bwoods\b/g, "wood")
    .replace(/\bfields\b/g, "field")
    .replace(/[^a-z0-9]+/g, "");
}

function resolveItemlogEntryForSelection(spawn, item, entries) {
  const itemId = String(item?.item_id || "");
  const alphaEggId = itemId.match(/^alpha_egg:(\d+)$/)?.[1] || "";
  const directId = /^\d+$/.test(itemId)
    ? `item:${itemId}`
    : (alphaEggId ? `item:${alphaEggId}` : "");
  if (directId) {
    const direct = entries.find((entry) => entry?.id === directId);
    if (direct) return direct;
  }

  if (itemId.startsWith("elite_egg_area:")) {
    const spawnLocations = [
      spawn?.large_area_name,
      spawn?.level_area_name,
      spawn?.area_name,
    ].map(normalizedEggLocation).filter(Boolean);
    const itemLocations = (Array.isArray(item?.area_names) ? item.area_names : [])
      .map(normalizedEggLocation)
      .filter(Boolean);
    const matchesLocation = (locations) => entries.find((entry) => (
      entry?.name === "Elite Egg"
      && locations.includes(normalizedEggLocation(entry?.egg_location))
    ));
    return matchesLocation(spawnLocations) || matchesLocation(itemLocations) || null;
  }
  return null;
}

function clearCatalogFiltersForShortcut(view) {
  state.catalogSearch[view] = "";
  state.catalogCategory[view] = "all";
  if (view === "aniilog") {
    ["classes", "elements", "homeland", "stages", "forms"].forEach((name) => aniilogFilterSet(name).clear());
    state.aniilogFilters.statRules = [];
    state.aniilogFilters.mobility = "any";
    state.aniilogFilters.exploration = "any";
    state.aniilogFilters.coreSkill = "any";
  } else {
    state.itemlogFilters.source = "all";
    state.itemlogFilters.park = "all";
    state.itemlogFilters.tier = "all";
  }
}

async function openSelectedMarkerCatalogEntry() {
  const spawn = Number.isInteger(state.selectedSpawnIndex)
    ? state.data?.spawns[state.selectedSpawnIndex]
    : null;
  const item = spawn ? state.data?.itemsById.get(spawn.item_id) : null;
  const view = selectionCatalogKind(item);
  if (!spawn || !item || !view) return;

  setSelectionCatalogShortcutBusy(true);
  const payload = view === "aniilog" ? await ensureAniilogData() : await ensureItemlogData();
  const entries = Array.isArray(payload?.entries) ? payload.entries : [];
  const entry = view === "aniilog"
    ? resolveAniilogEntryForSelection(item, entries)
    : resolveItemlogEntryForSelection(spawn, item, entries);
  if (!entry) {
    updateSelectionCatalogShortcuts(spawn, null);
    return;
  }

  clearCatalogFiltersForShortcut(view);
  state.catalogSelection[view] = entry.id;
  const orderedEntries = catalogEntriesForView(view);
  const entryIndex = orderedEntries.findIndex((candidate) => candidate.id === entry.id);
  state.catalogIndexScroll[view] = Math.max(0, entryIndex * CATALOG_INDEX_ROW_HEIGHT - CATALOG_INDEX_ROW_HEIGHT);
  setSidebarView(view);
  window.requestAnimationFrame(() => {
    els.catalogPanel.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function scheduleMapTileDetail() {
  if (state.tileFrame) return;
  state.tileFrame = window.requestAnimationFrame(() => {
    state.tileFrame = 0;
    renderMapTileDetail();
  });
}

function renderMapTileDetail() {
  const map = currentMap();
  if (!map || state.tileMapId !== map.id) return;
  const tiles = map.tiles || [];
  if (!tiles.length || state.scale < MAP_TILE_DETAIL_SCALE) {
    els.mapTiles.hidden = true;
    return;
  }

  const viewport = els.mapViewport.getBoundingClientRect();
  const margin = 384;
  const left = (-state.panX) / state.scale - margin;
  const top = (-state.panY) / state.scale - margin;
  const right = (viewport.width - state.panX) / state.scale + margin;
  const bottom = (viewport.height - state.panY) / state.scale + margin;
  const visibleTiles = tiles.filter((tile) => (
    tile.left < right
    && tile.left + tile.width > left
    && tile.top < bottom
    && tile.top + tile.height > top
  ));
  const signature = `${map.id}:${visibleTiles.map((tile) => `${tile.left},${tile.top}`).join("|")}`;
  if (els.mapTiles.dataset.signature === signature) {
    els.mapTiles.hidden = false;
    return;
  }

  const fragment = document.createDocumentFragment();
  visibleTiles.forEach((tile) => {
    const image = document.createElement("img");
    image.className = "map-tile";
    image.alt = "";
    image.decoding = "async";
    image.draggable = false;
    image.loading = "eager";
    image.src = tile.image;
    image.style.left = `${tile.left}px`;
    image.style.top = `${tile.top}px`;
    image.style.width = `${tile.width}px`;
    image.style.height = `${tile.height}px`;
    fragment.append(image);
  });
  els.mapTiles.replaceChildren(fragment);
  els.mapTiles.dataset.signature = signature;
  els.mapTiles.hidden = false;
}

function resetMapScroll() {
  [els.mapPanel, els.mapViewport].forEach((element) => {
    if (!element) return;
    if (element.scrollLeft) element.scrollLeft = 0;
    if (element.scrollTop) element.scrollTop = 0;
  });
}

function currentMapView() {
  return {
    scale: state.scale,
    panX: state.panX,
    panY: state.panY,
  };
}

function restoreMapView(view) {
  state.scale = view.scale;
  state.panX = view.panX;
  state.panY = view.panY;
  stabilizeViewport();
  applyTransform();
}

function pinHitSize() {
  return MOBILE_LAYOUT_QUERY.matches ? 46 : 44;
}

function setPinScreenPosition(pin, spawn) {
  if (!spawn?.normalized) return;
  const map = currentMap();
  const hitSize = pinHitSize();
  const x = spawn.normalized.x * map.width * state.scale + state.panX - hitSize / 2;
  const y = spawn.normalized.y * map.height * state.scale + state.panY - hitSize / 2;
  pin.style.left = `${Math.round(x)}px`;
  pin.style.top = `${Math.round(y)}px`;
}

function syncDomPinPositions() {
  if (state.canvasMode) return;
  state.visibleEntries.forEach(({ spawn, index }) => {
    const pin = state.domPins.get(index);
    if (pin) setPinScreenPosition(pin, spawn);
  });
}

function applyTransform() {
  stabilizeViewport();
  els.mapWorld.style.transform = `matrix(${state.scale}, 0, 0, ${state.scale}, ${state.panX}, ${state.panY})`;
  scheduleMapTileDetail();
  if (state.canvasMode) {
    scheduleCanvasRender();
  } else {
    syncDomPinPositions();
  }
}

function mapFitScale(rect = els.mapViewport.getBoundingClientRect()) {
  const map = currentMap();
  const width = map.width;
  const height = map.height;
  const padding = rect.width < 700 ? 24 : 56;
  return Math.min((rect.width - padding * 2) / width, (rect.height - padding * 2) / height);
}

function clampPan() {
  if (!state.data) return;
  const rect = els.mapViewport.getBoundingClientRect();
  const map = currentMap();
  const scaledWidth = map.width * state.scale;
  const scaledHeight = map.height * state.scale;

  if (scaledWidth <= rect.width) {
    state.panX = (rect.width - scaledWidth) / 2;
  } else {
    state.panX = clamp(state.panX, rect.width - scaledWidth - MAP_EDGE_MARGIN, MAP_EDGE_MARGIN);
  }

  if (scaledHeight <= rect.height) {
    state.panY = (rect.height - scaledHeight) / 2;
  } else {
    state.panY = clamp(state.panY, rect.height - scaledHeight - MAP_EDGE_MARGIN, MAP_EDGE_MARGIN);
  }
}

function fitMap() {
  if (!state.data || isCatalogView()) return;
  const rect = els.mapViewport.getBoundingClientRect();
  state.viewportWidth = rect.width;
  state.viewportHeight = rect.height;
  const map = currentMap();
  const width = map.width;
  const height = map.height;
  state.scale = clamp(mapFitScale(rect), MIN_SCALE, MAX_SCALE);
  state.panX = (rect.width - width * state.scale) / 2;
  state.panY = (rect.height - height * state.scale) / 2;
  applyTransform();
}

function zoomAt(clientX, clientY, nextScale) {
  const rect = els.mapViewport.getBoundingClientRect();
  const oldScale = state.scale;
  const mapX = (clientX - rect.left - state.panX) / oldScale;
  const mapY = (clientY - rect.top - state.panY) / oldScale;
  state.scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
  state.panX = clientX - rect.left - mapX * state.scale;
  state.panY = clientY - rect.top - mapY * state.scale;
  clampPan();
  applyTransform();
}

function eventTargetsPin(event) {
  return event.target instanceof Element && Boolean(event.target.closest(".pin"));
}

function rememberActivePointer(event, fromPin = false) {
  const current = state.activePointers.get(event.pointerId);
  const pointer = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    pointerType: event.pointerType,
    fromPin: current?.fromPin ?? fromPin,
  };
  state.activePointers.set(event.pointerId, pointer);
  return pointer;
}

function activePointerPair() {
  const pointers = [...state.activePointers.values()];
  if (pointers.length < 2) return null;
  return [pointers[0], pointers[1]];
}

function pointerDistance(first, second) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function pointerMidpoint(first, second) {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  };
}

function stopMapDrag() {
  state.dragging = false;
  state.dragStart = null;
  els.mapViewport.classList.remove("dragging");
}

function startMapDrag(pointer) {
  if (!pointer || pointer.fromPin) return;
  state.dragging = true;
  state.dragStart = {
    pointerId: pointer.id,
    x: pointer.x,
    y: pointer.y,
    panX: state.panX,
    panY: state.panY,
  };
  els.mapViewport.classList.add("dragging");
}

function beginPinch() {
  const pair = activePointerPair();
  if (!pair) return false;
  const [first, second] = pair;
  const distance = pointerDistance(first, second);
  if (distance <= 0) return false;
  const midpoint = pointerMidpoint(first, second);
  const anchor = screenToImagePoint(midpoint.x, midpoint.y);
  state.pinch = {
    pointerIds: [first.id, second.id],
    distance,
    scale: state.scale,
    anchor,
  };
  state.canvasPointerHit = null;
  state.suppressPinClickUntil = window.performance.now() + 320;
  stopMapDrag();
  hideCanvasTooltip();
  return true;
}

function pinchPointers() {
  if (!state.pinch) return null;
  const [firstId, secondId] = state.pinch.pointerIds;
  const first = state.activePointers.get(firstId);
  const second = state.activePointers.get(secondId);
  return first && second ? [first, second] : null;
}

function updatePinch() {
  const pair = pinchPointers();
  if (!pair || !state.pinch) return false;
  const [first, second] = pair;
  const distance = pointerDistance(first, second);
  if (distance <= 0) return true;
  const midpoint = pointerMidpoint(first, second);
  const rect = els.mapViewport.getBoundingClientRect();
  state.scale = clamp(state.pinch.scale * (distance / state.pinch.distance), MIN_SCALE, MAX_SCALE);
  state.panX = midpoint.x - rect.left - state.pinch.anchor.x * state.scale;
  state.panY = midpoint.y - rect.top - state.pinch.anchor.y * state.scale;
  clampPan();
  applyTransform();
  return true;
}

function releasePointerCapture(event) {
  if (els.mapViewport.hasPointerCapture(event.pointerId)) {
    els.mapViewport.releasePointerCapture(event.pointerId);
  }
}

function finishPointerInteraction(event, cancelled = false) {
  const pointer = state.activePointers.get(event.pointerId);
  const wasPinching = Boolean(state.pinch?.pointerIds.includes(event.pointerId));
  const canvasCandidate = state.canvasPointerHit?.pointerId === event.pointerId
    ? state.canvasPointerHit
    : null;
  state.activePointers.delete(event.pointerId);
  releasePointerCapture(event);

  if (state.activePointers.size >= 2) {
    beginPinch();
    return;
  }

  if (wasPinching) {
    state.pinch = null;
    state.canvasPointerHit = null;
    state.suppressPinClickUntil = window.performance.now() + 240;
    stopMapDrag();
    const [remainingPointer] = state.activePointers.values();
    if (!cancelled && remainingPointer) startMapDrag(remainingPointer);
    return;
  }

  if (canvasCandidate) {
    state.canvasPointerHit = null;
    if (!cancelled && Math.hypot(event.clientX - canvasCandidate.x, event.clientY - canvasCandidate.y) < 8) {
      selectSpawn(canvasCandidate.index);
    }
    return;
  }

  if (state.dragStart?.pointerId === event.pointerId || pointer) {
    stopMapDrag();
  }
}

function screenToImagePoint(clientX, clientY) {
  const rect = els.mapViewport.getBoundingClientRect();
  return {
    x: (clientX - rect.left - state.panX) / state.scale,
    y: (clientY - rect.top - state.panY) / state.scale,
  };
}

function imagePointToMap(point) {
  const map = currentMap();
  const transform = map.transform;
  const pointA = transform.point_a_position;
  const pointB = transform.point_b_position;
  const mapA = transform.map_a_position;
  const mapB = transform.map_b_position;
  const offset = transform.map_offset_ui || { x: 0, y: 0 };
  const localX = (point.x - mapA.x - offset.x) / (mapB.x - mapA.x);
  const localY = (-point.y - mapA.y - offset.y) / (mapB.y - mapA.y);
  return {
    x: pointA.x + localX * (pointB.x - pointA.x),
    y: pointA.y + localY * (pointB.y - pointA.y),
  };
}

function updateCoordinateReadout(event) {
  if (!state.data) return;
  const point = screenToImagePoint(event.clientX, event.clientY);
  const map = imagePointToMap(point);
  els.coordinateReadout.textContent = `X ${formatCoordinate(map.x)}, Y ${formatCoordinate(map.y)}`;
}

function normalizedSearch(value) {
  return value.trim().toLowerCase();
}

function searchText(parts) {
  const values = [];
  const append = (value) => {
    if (value !== null && value !== undefined) {
      values.push(window.AniipediaI18n.searchAlias(value));
    }
  };
  parts.forEach((part) => {
    if (Array.isArray(part)) {
      part.forEach(append);
    } else {
      append(part);
    }
  });
  return values.join(" ").toLowerCase();
}

function makeIcon(className, source) {
  const icon = document.createElement("img");
  icon.className = className;
  icon.alt = "";
  icon.draggable = false;
  if (source) {
    icon.src = source;
    icon.addEventListener("error", () => {
      icon.removeAttribute("src");
      icon.classList.add("icon-missing");
    }, { once: true });
  } else {
    icon.classList.add("icon-missing");
  }
  return icon;
}

function itemPassesFilters(item) {
  if (!item) return false;
  return (state.data.itemIdsByMap.get(state.activeMapId) || new Set()).has(item.item_id);
}

function itemMatches(item) {
  if (!itemPassesFilters(item)) return false;
  if (!state.search) return true;
  return item.search_text.includes(state.search)
    || activeMapSpawnEntries(item.item_id).some(({ spawn }) => spawn.search_text.includes(state.search));
}

function itemSearchText(item) {
  return searchText([
    item.item_id,
    item.display_id,
    item.aniimo_id,
    item.species_name,
    item.aniilog_number,
    item.aniilog_number_label,
    item.official_no,
    aniimoListName(item),
    item.form_key,
    item.form_name,
    item.form_label,
    item.display_name,
    item.subtitle,
    item.list_subtitle,
    item.egg_location,
    item.spawn_maps,
    item.book_names,
    item.marker_names,
    item.document_groups,
    item.document_uids,
    item.misc_group,
    item.layer_id,
    item.inventory_label,
    item.reward_label,
    item.respawn_status,
    item.display_type_label,
    item.teleport_type,
    item.region_name,
    item.area_names,
    item.area_uids,
    item.source_item_ids,
    item.egg_item_ids,
    item.area_uid,
    item.area_name,
    item.description,
    item.coordinate_status,
    item.bonus_id,
    item.scene_object_id,
    item.pet_prototype_id,
    item.pet_prototype_ids,
    item.id_in_types,
  ]);
}

function itemDirectSearchText(item) {
  return searchText([
    item.item_id,
    item.display_name,
    item.subtitle,
    item.layer_id,
    item.inventory_label,
    item.display_type_label,
    item.misc_group,
  ]);
}

function spawnSearchText(spawn) {
  return searchText([
    spawn.item_id,
    spawn.source_item_id,
    spawn.aniimo_id,
    spawn.species_name,
    spawn.form_key,
    spawn.form_name,
    spawn.form_label,
    spawn.display_name,
    spawn.document_group,
    spawn.document_uid,
    spawn.marker_type,
    spawn.layer_id,
    spawn.reward_label,
    spawn.respawn_status,
    spawn.teleport_type,
    spawn.region_name,
    spawn.area_uid,
    spawn.area_name,
    spawn.large_area_id,
    spawn.large_area_name,
    spawn.level_area_config_id,
    spawn.level_area_name,
    spawn.area_inferred_name,
    spawn.coordinate_key,
    spawn.id_in_type,
    spawn.pet_prototype_id,
    spawn.x,
    spawn.y,
  ]);
}

function spawnMatches(spawn) {
  if (!spawnOnActiveMap(spawn)) return false;
  if (!state.enabled.has(spawn.item_id)) return false;
  if (state.disabledSpawnIds.has(spawnSelectionId(spawn))) return false;
  const item = state.data.itemsById.get(spawn.item_id);
  if (!itemPassesFilters(item)) return false;
  if (!state.search) return true;
  return item.search_text.includes(state.search) || spawn.search_text.includes(state.search);
}

function clearLocatedSpawn() {
  state.locatedSpawnIndex = null;
}

function locatedSpawnEntry() {
  if (!Number.isInteger(state.locatedSpawnIndex)) return null;
  const spawn = state.data?.spawns[state.locatedSpawnIndex];
  if (!spawn || !spawnOnActiveMap(spawn)) {
    clearLocatedSpawn();
    return null;
  }
  return { spawn, index: state.locatedSpawnIndex };
}

function spawnSelectionId(spawn) {
  return [spawn.map_id, spawn.item_id, spawn.coordinate_key, spawn.display_name].join("::");
}

function itemSelectionState(itemId) {
  const entries = activeMapSpawnEntries(itemId);
  const enabled = state.enabled.has(itemId);
  const selected = enabled
    ? entries.filter((entry) => !state.disabledSpawnIds.has(spawnSelectionId(entry.spawn))).length
    : 0;
  return { entries, enabled, selected, total: entries.length };
}

function setItemSelection(itemId, selectAll) {
  const entries = activeMapSpawnEntries(itemId);
  entries.forEach((entry) => state.disabledSpawnIds.delete(spawnSelectionId(entry.spawn)));
  if (selectAll) state.enabled.add(itemId);
  else state.enabled.delete(itemId);
}

function toggleWholeItem(itemId) {
  const selection = itemSelectionState(itemId);
  setItemSelection(itemId, selection.selected < selection.total || !selection.enabled);
}

function toggleIndividualSpawn(entry) {
  const { spawn } = entry;
  const selection = itemSelectionState(spawn.item_id);
  const selectedId = spawnSelectionId(spawn);
  const currentlySelected = selection.enabled && !state.disabledSpawnIds.has(selectedId);

  if (!selection.enabled) {
    state.enabled.add(spawn.item_id);
    selection.entries.forEach((sibling) => {
      const siblingId = spawnSelectionId(sibling.spawn);
      if (siblingId !== selectedId) state.disabledSpawnIds.add(siblingId);
    });
    state.disabledSpawnIds.delete(selectedId);
    return;
  }

  if (currentlySelected) state.disabledSpawnIds.add(selectedId);
  else state.disabledSpawnIds.delete(selectedId);

  const remaining = selection.entries.filter((sibling) => (
    !state.disabledSpawnIds.has(spawnSelectionId(sibling.spawn))
  )).length;
  if (remaining === 0) setItemSelection(spawn.item_id, false);
}

function deselectIndividualSpawn(entry) {
  const { spawn, index } = entry;
  clearLocatedSpawn();
  state.hoveredCanvasIndex = null;
  hideCanvasTooltip();
  if (state.enabled.has(spawn.item_id)) {
    state.disabledSpawnIds.add(spawnSelectionId(spawn));
    const remaining = activeMapSpawnEntries(spawn.item_id).filter((sibling) => (
      !state.disabledSpawnIds.has(spawnSelectionId(sibling.spawn))
    )).length;
    if (remaining === 0) setItemSelection(spawn.item_id, false);
  }
  if (state.selectedSpawnIndex === index) {
    state.selectedSpawnIndex = null;
    state.selectedPin = null;
    state.mobileSelectionMinimized = true;
    clearSelectionDetails("No marker selected");
    updateMobileSelectionPanel();
  }
  refreshVisibility();
}

function visibleSpawnEntries() {
  const entries = [];
  for (const itemId of state.enabled) {
    const item = state.data.itemsById.get(itemId);
    if (!itemPassesFilters(item)) continue;
    const itemSpawns = activeMapSpawnEntries(itemId);
    const directSearchText = item.item_id.startsWith("misc:document_pickups:")
      ? item.direct_search_text
      : item.search_text;
    const itemMatchesSearch = !state.search || directSearchText.includes(state.search);
    itemSpawns.forEach((entry) => {
      if (
        !state.disabledSpawnIds.has(spawnSelectionId(entry.spawn))
        && (!state.search || itemMatchesSearch || entry.spawn.search_text.includes(state.search))
      ) {
        entries.push(entry);
      }
    });
  }
  const locatedEntry = locatedSpawnEntry();
  if (locatedEntry && !entries.some((entry) => entry.index === locatedEntry.index)) {
    entries.push(locatedEntry);
  }
  entries.sort((a, b) => a.index - b.index);
  return entries;
}

function updateFilterCount() {
  if (!els.filterCount || !state.data) return;
  const activeItems = activeMapItems().filter((item) => item.layer_id === state.activeLayer);
  const selectedCount = activeItems.filter((item) => state.enabled.has(item.item_id)).length;
  els.filterCount.textContent = `${selectedCount} / ${activeItems.length}`;
}

function itemRowSubtitle(item) {
  if (item.teleport_type === "nurture" || item.teleport_type === "vein_abundance") {
    return item.display_type_label || item.display_name;
  }
  const parts = item.subtitle
    ? [item.subtitle]
    : item.is_aniimo
      ? [aniimoListMeta(item)]
      : isEggItem(item)
        ? [item.region_name || item.area_name || item.display_type_label]
        : [item.display_type_label, item.region_name];
  return parts.filter(Boolean).join(" - ");
}

function itemRowName(item) {
  if (item.is_aniimo) return aniimoListName(item);
  if (item.teleport_type === "nurture" || item.teleport_type === "vein_abundance") {
    const spawn = activeMapSpawnEntries(item.item_id)[0]?.spawn;
    return areaDetailValue(spawn)
      || item.area_names?.find(Boolean)
      || item.region_name
      || item.display_name;
  }
  if (item.teleport_type === "bloom" || item.teleport_type === "sanctum") {
    const localizedName = window.AniipediaI18n.translate(item.display_name);
    return localizedName
      .replace(/^[^:：·・•]+[:：·・•]\s*/, "")
      .replace(/^[^-–—]+\s+[-–—]\s+/, "");
  }
  return item.display_name;
}

function uniqueIconSources(values) {
  return [...new Set(values.filter(Boolean))];
}

function createStackedItemIcon(sources) {
  const uniqueSources = uniqueIconSources(sources);
  if (uniqueSources.length < 2) return makeIcon("item-icon", uniqueSources[0] || "");
  const stack = document.createElement("span");
  stack.className = "item-icon-stack";
  uniqueSources.slice(0, 2).forEach((source) => {
    stack.append(makeIcon("item-icon-stacked", source));
  });
  return stack;
}

function itemIconVisual(item, expandable) {
  if (!expandable) return makeIcon("item-icon", item.icon);
  const spawnIcons = activeMapSpawnEntries(item.item_id).map(({ spawn }) => spawn.icon);
  const sources = uniqueIconSources(spawnIcons);
  return createStackedItemIcon(sources.length ? sources : [item.icon]);
}

function groupIconVisual(items) {
  return createStackedItemIcon(items.flatMap((item) => {
    const spawnIcons = uniqueIconSources(activeMapSpawnEntries(item.item_id).map(({ spawn }) => spawn.icon));
    return spawnIcons.length ? spawnIcons : [item.icon];
  }));
}

function collapseMapGroup(groupKey) {
  state.expandedMapGroups.delete(groupKey);
  renderItems();
  refreshVisibility();
  window.requestAnimationFrame(() => {
    const selector = `[data-map-group-key="${CSS.escape(groupKey)}"], [data-item-id="${CSS.escape(groupKey)}"]`;
    els.itemList.querySelector(selector)?.focus();
  });
}

function createMapChildrenContainer(groupKey, label) {
  const wrapper = document.createElement("div");
  wrapper.className = "map-item-children";
  const rail = document.createElement("button");
  rail.type = "button";
  rail.className = "map-group-collapse-rail";
  rail.setAttribute("aria-label", `Collapse ${label}`);
  rail.title = "Click the thread line to collapse";
  rail.addEventListener("mousedown", preventControlFocus);
  rail.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    collapseMapGroup(groupKey);
  });
  const list = document.createElement("div");
  list.className = "map-item-children-list";
  wrapper.append(rail, list);
  return { wrapper, list };
}

function itemHasSpawnChildren(item) {
  const count = activeMapSpawnEntries(item.item_id).length;
  return count > 1 || (Boolean(item.expand_spawns) && count > 0);
}

function createMapItemRow(item, { child = false, expandable = false } = {}) {
  const tier = itemTier(item);
  const row = document.createElement(expandable ? "div" : "button");
  if (expandable) {
    row.tabIndex = 0;
    row.setAttribute("role", "button");
  } else {
    row.type = "button";
  }
  row.className = [
    "item-row",
    child ? "map-group-child-row" : "",
    item.is_elite_egg ? "elite-egg" : "",
    item.is_alpha_egg ? "alpha-egg" : "",
    item.is_aniimo ? "aniimo-row" : "",
    tier ? `item-tier-${tier}` : "",
    isEggItem(item) && !item.spawn_count ? "unplaced" : "",
  ].filter(Boolean).join(" ");
  row.dataset.itemId = item.item_id;
  if (item.layer_id === "misc") row.dataset.miscGroup = miscGroupForItem(item);
  row.addEventListener("mousedown", preventControlFocus);
  row.addEventListener("click", (event) => {
    event.preventDefault();
    clearLocatedSpawn();
    toggleWholeItem(item.item_id);
    refreshVisibility();
  });
  if (expandable) {
    row.addEventListener("keydown", (event) => {
      if (event.target !== row || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      toggleWholeItem(item.item_id);
      refreshVisibility();
    });
  }

  const icon = itemIconVisual(item, expandable);
  const text = document.createElement("span");
  text.className = "item-text";
  const strong = document.createElement("strong");
  strong.textContent = itemRowName(item);
  const small = document.createElement("small");
  small.textContent = itemRowSubtitle(item);
  strong.title = strong.textContent;
  small.title = small.textContent;
  text.append(strong, small);

  const actions = document.createElement("span");
  actions.className = "item-row-actions";
  const count = document.createElement("span");
  count.className = "item-count";
  count.dataset.itemSelectionCount = "";
  actions.append(count);

  if (expandable) {
    const expanded = state.expandedMapGroups.has(item.item_id);
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "map-group-toggle";
    toggle.textContent = expanded ? "-" : "+";
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.setAttribute("aria-label", `${expanded ? "Collapse" : "Expand"} ${item.display_name}`);
    toggle.addEventListener("mousedown", preventControlFocus);
    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (expanded) state.expandedMapGroups.delete(item.item_id);
      else state.expandedMapGroups.add(item.item_id);
      renderItems();
      refreshVisibility();
    });
    actions.append(toggle);
  }

  row.append(icon, text, actions);
  return row;
}

function duplicateSpawnSequence(spawn, siblings = [], siblingIndex = 0) {
  const matchingNames = siblings.filter((entry) => entry.spawn.display_name === spawn.display_name);
  if (matchingNames.length < 2) return "";
  const duplicateIndex = matchingNames.findIndex((entry) => entry.index === siblings[siblingIndex]?.index);
  return String(Math.max(0, duplicateIndex) + 1);
}

function localizedSpawnTitle(spawn) {
  return window.AniipediaI18n.translateUid(spawn.display_name_uid, String(spawn.display_name || ""));
}

function localizedTitleSuffix(title) {
  const text = String(title || "").trim();
  const punctuated = text.match(/^[^:\uFF1A\u00B7\u30FB\u2022]+[:\uFF1A\u00B7\u30FB\u2022]\s*(.+)$/);
  if (punctuated) return punctuated[1].trim();
  const dashed = text.match(/^[^-\u2013\u2014]+\s+[-\u2013\u2014]\s+(.+)$/);
  return dashed ? dashed[1].trim() : "";
}

function compactBossClearTitle(spawn) {
  const rawTitle = String(spawn.display_name || "").replace(/^Boss Clear:\s*/i, "");
  const match = rawTitle.match(/^(?:(Alpha|Omega)\s+Aniimo|Aniimo\s+(Alpha|Omega)):\s*(.+)$/i);
  if (!match) return window.AniipediaI18n.translate(rawTitle);
  const tier = match[1] || match[2];
  return `${window.AniipediaI18n.translate(tier)} ${window.AniipediaI18n.translate(match[3])}`;
}

function luminEventFamilyLabel(spawn) {
  const sourceType = String(spawn.reward_source_type || "").toLowerCase();
  return window.AniipediaI18n.translate(
    sourceType === "runaway_amber" ? "Runaway Amber" : "Lumin Collection",
  );
}

function spawnChildDisplayParts(spawn, siblings = [], siblingIndex = 0) {
  const sequence = duplicateSpawnSequence(spawn, siblings, siblingIndex);
  if (spawn.marker_type === "quest_lumen_seed") {
    return { name: compactBossClearTitle(spawn), sequence, typeLabel: "" };
  }
  if (spawn.marker_type === "lumin_event") {
    const localizedTitle = localizedSpawnTitle(spawn);
    const suffix = localizedTitleSuffix(localizedTitle);
    return {
      name: suffix || localizedTitle,
      sequence,
      typeLabel: suffix ? luminEventFamilyLabel(spawn) : "",
    };
  }
  if (spawn.marker_type === "lumin_marking") {
    const localizedTitle = localizedSpawnTitle(spawn);
    const suffix = localizedTitleSuffix(localizedTitle);
    return {
      name: suffix || localizedTitle,
      sequence,
      typeLabel: suffix ? window.AniipediaI18n.translate("Lumen Marking") : "",
    };
  }
  if (spawn.marker_type === "lumin_amber") {
    return {
      name: window.AniipediaI18n.translate("Lumen Ember"),
      sequence,
      typeLabel: "",
    };
  }
  if (spawn.marker_type !== "document_pickup") {
    return { name: localizedSpawnTitle(spawn), sequence, typeLabel: "" };
  }
  const title = String(spawn.display_name || "");
  const parenthetical = title.match(/\((?:Part\s+)?([IVX]+|\d+)\)$/i);
  if (parenthetical) return { name: `Note ${parenthetical[1]}`, sequence: "", typeLabel: "" };
  const trailing = title.match(/(?:Research|Tale)\s+([IVX]+|\d+)$/i);
  return { name: trailing ? `Note ${trailing[1]}` : title, sequence: "", typeLabel: "" };
}

function createSpawnChildRow(entry, siblings = [], siblingIndex = 0) {
  const { spawn, index } = entry;
  const item = state.data.itemsById.get(spawn.item_id);
  const row = document.createElement("button");
  row.type = "button";
  row.className = "item-spawn-child-row";
  row.dataset.spawnIndex = String(index);
  row.addEventListener("mousedown", preventControlFocus);
  row.addEventListener("click", (event) => {
    event.preventDefault();
    clearLocatedSpawn();
    toggleIndividualSpawn(entry);
    refreshVisibility();
  });

  const icon = makeIcon("item-icon", spawn.icon || item?.icon);
  const text = document.createElement("span");
  text.className = "item-text";
  const strong = document.createElement("strong");
  const display = spawnChildDisplayParts(spawn, siblings, siblingIndex);
  strong.append(document.createTextNode(display.name));
  if (display.sequence) {
    const sequence = document.createElement("span");
    sequence.textContent = ` ${display.sequence}`;
    strong.append(sequence);
  }
  strong.title = spawn.display_name;
  const small = document.createElement("small");
  const area = areaDetailValue(spawn) || mapRegionForSpawn(spawn);
  small.textContent = [display.typeLabel, area].filter(Boolean).join(" \u2022 ");
  small.title = `${spawn.display_name} - ${small.textContent}`;
  text.append(strong, small);
  row.append(icon, text);
  return row;
}

function appendMapItemWithChildren(container, item, { child = false, allowExpansion = true } = {}) {
  const entries = activeMapSpawnEntries(item.item_id);
  const expandable = allowExpansion && itemHasSpawnChildren(item);
  container.append(createMapItemRow(item, { child, expandable }));
  if (!expandable || !state.expandedMapGroups.has(item.item_id)) return;
  const { wrapper, list } = createMapChildrenContainer(item.item_id, item.display_name);
  entries.forEach((entry, index) => list.append(createSpawnChildRow(entry, entries, index)));
  container.append(wrapper);
}

function mapItemsFullySelected(items) {
  return items.every((item) => {
    const selection = itemSelectionState(item.item_id);
    return selection.total > 0 && selection.selected === selection.total;
  });
}

function renderMapCollectionGroup(section, { groupKey, label, items, className = "" }) {
  if (!items.length) return;
  const expanded = state.expandedMapGroups.has(groupKey);
  const group = document.createElement("section");
  group.className = ["map-item-group", className].filter(Boolean).join(" ");
  group.dataset.mapGroupKey = groupKey;

  const parent = document.createElement("div");
  parent.className = ["map-group-row", className].filter(Boolean).join(" ");
  parent.dataset.mapGroupKey = groupKey;
  parent.tabIndex = 0;
  parent.setAttribute("role", "button");
  const toggleSelection = () => {
    clearLocatedSpawn();
    const selectAll = !mapItemsFullySelected(items);
    items.forEach((item) => setItemSelection(item.item_id, selectAll));
    refreshVisibility();
  };
  parent.addEventListener("mousedown", preventControlFocus);
  parent.addEventListener("click", (event) => {
    event.preventDefault();
    toggleSelection();
  });
  parent.addEventListener("keydown", (event) => {
    if (event.target !== parent || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    toggleSelection();
  });

  const icon = groupIconVisual(items);
  const text = document.createElement("span");
  text.className = "item-text";
  const strong = document.createElement("strong");
  strong.textContent = label;
  const small = document.createElement("small");
  const total = items.reduce((sum, item) => sum + activeMapSpawnEntries(item.item_id).length, 0);
  small.textContent = `${total} locations`;
  text.append(strong, small);
  const actions = document.createElement("span");
  actions.className = "item-row-actions";
  const count = document.createElement("span");
  count.className = "item-count";
  count.dataset.groupSelectionCount = "";
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "map-group-toggle";
  toggle.textContent = expanded ? "-" : "+";
  toggle.setAttribute("aria-expanded", String(expanded));
  toggle.setAttribute("aria-label", `${expanded ? "Collapse" : "Expand"} ${label}`);
  toggle.addEventListener("mousedown", preventControlFocus);
  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (expanded) collapseMapGroup(groupKey);
    else {
      state.expandedMapGroups.add(groupKey);
      renderItems();
      refreshVisibility();
    }
  });
  actions.append(count, toggle);
  parent.append(icon, text, actions);
  group.append(parent);

  if (expanded) {
    const { wrapper, list } = createMapChildrenContainer(groupKey, label);
    items.forEach((item) => appendMapItemWithChildren(list, item, { child: true }));
    group.append(wrapper);
  }
  section.append(group);
  state.renderedMapGroups.set(groupKey, { group, parent, items, label, count });
}

const TELEPORT_GROUPS = [
  { id: "bloom", label: "Blooms" },
  { id: "sanctum", label: "Sanctums" },
  { id: "branch", label: "Branches" },
  { id: "outpost", label: "Outposts" },
  { id: "nurture", label: "Nurture Sites" },
  { id: "vein_abundance", label: "Vein Abundance Sites" },
];

const EGG_GROUPS = [
  { id: "elite", label: "Elite Eggs", className: "elite-egg" },
  { id: "alpha", label: "Alpha Eggs", className: "alpha-egg" },
];

function renderEggGroups(section, layerItems) {
  EGG_GROUPS.forEach(({ id, label, className }) => {
    const items = layerItems.filter((item) => eggKindForItem(item) === id);
    renderMapCollectionGroup(section, {
      groupKey: `egg-group:${id}`,
      label,
      items,
      className,
    });
  });
}

function createMiscGroupSection(label) {
  const collapsed = state.collapsedMiscGroups.has(label);
  const wrapper = document.createElement("section");
  wrapper.className = "misc-group-section";
  wrapper.dataset.miscGroup = label;

  const heading = document.createElement("button");
  heading.type = "button";
  heading.className = "misc-group-heading";
  heading.dataset.miscGroup = label;
  heading.setAttribute("aria-label", label);
  heading.setAttribute("aria-expanded", String(!collapsed));
  heading.addEventListener("mousedown", preventControlFocus);

  const marker = document.createElement("span");
  marker.className = "misc-group-heading-marker";
  marker.textContent = collapsed ? "+" : "−";
  const title = document.createElement("span");
  title.className = "misc-group-heading-title";
  title.textContent = label;
  heading.append(marker, title);

  const content = document.createElement("div");
  content.className = "misc-group-content";
  content.hidden = collapsed;

  heading.addEventListener("click", (event) => {
    event.preventDefault();
    const nextCollapsed = !state.collapsedMiscGroups.has(label);
    if (nextCollapsed) state.collapsedMiscGroups.add(label);
    else state.collapsedMiscGroups.delete(label);
    content.hidden = nextCollapsed;
    marker.textContent = nextCollapsed ? "+" : "−";
    heading.setAttribute("aria-expanded", String(!nextCollapsed));
  });

  wrapper.append(heading, content);
  return { wrapper, content };
}

function renderTeleportGroups(section, layerItems) {
  TELEPORT_GROUPS.forEach(({ id, label }) => {
    const items = layerItems.filter((item) => item.teleport_type === id);
    renderMapCollectionGroup(section, {
      groupKey: `teleport-group:${id}`,
      label,
      items,
    });
  });
}

function refreshGroupedItemControls() {
  for (const row of els.itemList.querySelectorAll(".item-row")) {
    const item = state.data.itemsById.get(row.dataset.itemId);
    if (!item) continue;
    const selection = itemSelectionState(item.item_id);
    const full = selection.total > 0 && selection.selected === selection.total;
    const partial = selection.selected > 0 && !full;
    row.classList.toggle("enabled", full);
    row.classList.toggle("partially-enabled", partial);
    row.setAttribute("aria-pressed", partial ? "mixed" : String(full));
    const count = row.querySelector("[data-item-selection-count]");
    if (count) {
      count.textContent = partial
        ? `${selection.selected}/${selection.total}`
        : isEggItem(item) && !selection.total ? "No pin" : selection.total;
    }
  }

  for (const row of els.itemList.querySelectorAll(".item-spawn-child-row")) {
    const index = Number(row.dataset.spawnIndex);
    const spawn = state.data.spawns[index];
    const selected = spawn
      && state.enabled.has(spawn.item_id)
      && !state.disabledSpawnIds.has(spawnSelectionId(spawn));
    row.classList.toggle("enabled", Boolean(selected));
    row.setAttribute("aria-pressed", String(Boolean(selected)));
    if (spawn && state.search) {
      const item = state.data.itemsById.get(spawn.item_id);
      const parentMatches = item?.direct_search_text.includes(state.search);
      row.hidden = !parentMatches && !spawn.search_text.includes(state.search);
    } else {
      row.hidden = false;
    }
  }

  state.renderedMapGroups.forEach(({ group, parent, items, label, count }) => {
    const selections = items.map((item) => itemSelectionState(item.item_id));
    const total = selections.reduce((sum, selection) => sum + selection.total, 0);
    const selected = selections.reduce((sum, selection) => sum + selection.selected, 0);
    const full = total > 0 && selected === total;
    const partial = selected > 0 && !full;
    parent.classList.toggle("enabled", full);
    parent.classList.toggle("partially-enabled", partial);
    parent.setAttribute("aria-pressed", partial ? "mixed" : String(full));
    count.textContent = partial ? `${selected}/${total}` : total;
    const matches = !state.search
      || searchText([label]).includes(state.search)
      || items.some((item) => itemMatches(item));
    group.hidden = !matches;
  });
}

function refreshVisibility() {
  const visibleEntries = visibleSpawnEntries();
  state.visibleEntries = visibleEntries;
  renderPins(visibleEntries);

  for (const row of els.itemList.querySelectorAll(".item-row")) {
    const item = state.data.itemsById.get(row.dataset.itemId);
    row.hidden = !itemMatches(item);
  }
  refreshGroupedItemControls();

  for (const group of els.itemList.querySelectorAll(".misc-group-section")) {
    const visibleGroupRows = [...group.querySelectorAll(".item-row, .map-group-row")].some((row) => (
      !row.hidden && !row.closest(".map-item-group")?.hidden
    ));
    group.hidden = !visibleGroupRows;
  }

  for (const section of els.itemList.querySelectorAll(".layer-panel")) {
    const rows = [...section.querySelectorAll(".item-row, .map-group-row")];
    const visibleRows = rows.filter((row) => (
      !row.hidden && !row.closest(".map-item-group")?.hidden
    )).length;
    const tab = els.layerTabs.querySelector(`[data-layer-id="${section.dataset.layerId}"]`);
    section.hidden = section.dataset.layerId !== state.activeLayer;
    if (tab) {
      tab.hidden = Boolean(state.search) && visibleRows === 0;
      tab.setAttribute("aria-selected", String(section.dataset.layerId === state.activeLayer));
      tab.tabIndex = section.dataset.layerId === state.activeLayer ? 0 : -1;
    }
  }

  const activeTab = els.layerTabs.querySelector(`.layer-tab[data-layer-id="${state.activeLayer}"]`);
  if (activeTab?.hidden) {
    const nextTab = [...els.layerTabs.querySelectorAll(".layer-tab")].find((tab) => !tab.hidden);
    if (nextTab) {
      state.activeLayer = nextTab.dataset.layerId;
      refreshVisibility();
      return;
    }
  }

  updateFilterCount();
  stabilizeViewport();
}

function renderItems() {
  els.layerTabs.textContent = "";
  els.itemList.textContent = "";
  state.renderedMapGroups.clear();
  const mapItems = activeMapItems();
  const layers = state.data.layers?.length
    ? state.data.layers
    : [{ id: "items", label: "Items" }, { id: "aniimo", label: "Aniimo" }, { id: "eggs", label: "Eggs" }];
  const layersWithItems = layers.filter((layer) => mapItems.some((item) => item.layer_id === layer.id));
  if (!layersWithItems.some((layer) => layer.id === state.activeLayer)) {
    state.activeLayer = layersWithItems[0]?.id || "";
  }

  layersWithItems.forEach((layer) => {
    const layerItems = mapItems
      .filter((item) => item.layer_id === layer.id)
      .sort((a, b) => compareLayerItems(a, b, layer.id));

    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "layer-tab";
    tab.dataset.layerId = layer.id;
    tab.id = `layer-tab-${layer.id}`;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", `layer-panel-${layer.id}`);
    tab.setAttribute("aria-selected", String(layer.id === state.activeLayer));
    tab.tabIndex = layer.id === state.activeLayer ? 0 : -1;
    tab.addEventListener("click", () => {
      clearLocatedSpawn();
      state.activeLayer = layer.id;
      refreshVisibility();
    });
    tab.addEventListener("dblclick", (event) => {
      event.preventDefault();
      clearLocatedSpawn();
      state.activeLayer = layer.id;
      const selectableItems = layerItems.filter((item) => itemMatches(item));
      selectableItems.forEach((item) => setItemSelection(item.item_id, true));
      refreshVisibility();
    });
    const tabLabel = document.createElement("span");
    tabLabel.textContent = layer.label;
    tab.append(tabLabel);
    els.layerTabs.append(tab);

    const section = document.createElement("section");
    section.className = "layer-panel";
    section.dataset.layerId = layer.id;
    section.id = `layer-panel-${layer.id}`;
    section.setAttribute("role", "tabpanel");
    section.setAttribute("aria-labelledby", tab.id);
    section.hidden = layer.id !== state.activeLayer;

    if (layer.id === "eggs") {
      renderEggGroups(section, layerItems);
      els.itemList.append(section);
      return;
    }

    if (layer.id === "teleports") {
      renderTeleportGroups(section, layerItems);
      els.itemList.append(section);
      return;
    }

    const groupedItemIds = new Set();
    if (layer.id === "ambers") {
      const blessedItems = layerItems.filter((item) => item.form_label === "Blessed");
      blessedItems.forEach((item) => groupedItemIds.add(item.item_id));
      renderMapCollectionGroup(section, {
        groupKey: "amber-group:blessed-aniimo",
        label: "Blessed Aniimo",
        items: blessedItems,
      });
    }

    let previousMiscGroup = "";
    let miscGroupContent = null;
    layerItems.forEach((item) => {
      if (groupedItemIds.has(item.item_id)) return;
      if (layer.id === "misc") {
        const miscGroup = miscGroupForItem(item);
        if (miscGroup !== previousMiscGroup) {
          const groupSection = createMiscGroupSection(miscGroup);
          section.append(groupSection.wrapper);
          miscGroupContent = groupSection.content;
          previousMiscGroup = miscGroup;
        }
      }

      appendMapItemWithChildren(miscGroupContent || section, item, {
        allowExpansion: layer.id !== "aniimo",
      });
    });

    els.itemList.append(section);
  });
}

function pinClassName(spawn) {
  return [
    "pin",
    spawn.marker_type === "elite_egg" ? "pin-elite-egg" : "",
    spawn.marker_type === "alpha_egg" ? "pin-alpha-egg" : "",
    spawn.marker_type === "aniimo_spawn" ? "pin-aniimo-spawn" : "",
    spawn.layer_id === "teleports" ? "pin-teleport" : "",
    spawn.layer_id === "ambers" ? "pin-amber" : "",
    spawn.marker_type === "underground_entrance" ? "pin-underground" : "",
    spawn.marker_type === "physical_reward_source" ? "pin-physical-reward-source" : "",
    spawn.is_underground ? "pin-underground-marker" : "",
    state.completed.has(luminCompletionIdForSpawn(spawn)) ? "pin-completed" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function availabilityLabelForSpawn(spawn) {
  return typeof spawn?.availability?.label === "string" ? spawn.availability.label : "";
}

function createMarkerPin(entry) {
  const { spawn, index } = entry;
  const item = state.data.itemsById.get(spawn.item_id);
  if (!item) return null;
  const pin = document.createElement("button");
  pin.type = "button";
  pin.className = pinClassName(spawn);
  pin.dataset.spawnIndex = String(index);
  pin.style.setProperty("--pin-color", item.color);
  setPinScreenPosition(pin, spawn);
  pin.setAttribute(
    "aria-label",
    `${spawn.display_name} ${areaDetailValue(spawn) || mapRegionForSpawn(spawn) || regionDetailValue(spawn)} ${formatCoordinate(spawn.x)} ${formatCoordinate(spawn.y)}${spawn.is_underground ? " underground" : ""}${availabilityLabelForSpawn(spawn) ? ` ${availabilityLabelForSpawn(spawn)}` : ""}`,
  );

  const icon = makeIcon("pin-icon", spawn.icon || item.icon);
  const undergroundBadge = spawn.is_underground && state.data.underground_badge_icon
    ? makeIcon("pin-underground-badge", state.data.underground_badge_icon)
    : null;
  const pinBody = document.createElement("span");
  pinBody.className = "pin-body";
  const label = document.createElement("span");
  label.className = "pin-label";
  const areaLabel = areaDetailValue(spawn) || mapRegionForSpawn(spawn) || regionDetailValue(spawn);
  const labelName = areaLabel ? `${spawn.display_name} (${areaLabel})` : spawn.display_name;
  const availabilityLabel = availabilityLabelForSpawn(spawn);
  label.textContent = `${labelName} ${Math.round(spawn.x)}, ${Math.round(spawn.y)}${availabilityLabel ? ` - ${availabilityLabel}` : ""}`;
  pinBody.append(icon);
  if (undergroundBadge) pinBody.append(undergroundBadge);
  if (state.completed.has(luminCompletionIdForSpawn(spawn))) {
    pinBody.append(createPinCompletionBadge());
  }
  pin.append(pinBody, label);
  pin.tabIndex = -1;
  pin.addEventListener("mousedown", preventControlFocus);
  pin.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    // Pointer activation is finalized by the viewport after pointer capture.
    // Keep this handler for keyboard and assistive-technology activation only.
    if (event.detail !== 0) return;
    if (window.performance.now() < state.suppressPinClickUntil) return;
    const view = currentMapView();
    selectSpawn(index);
    restoreMapView(view);
  });
  if (state.selectedSpawnIndex === index) {
    pin.classList.add("selected");
    state.selectedPin = pin;
  }
  return pin;
}

function pinSizeFor(spawn) {
  const baseSize = MOBILE_LAYOUT_QUERY.matches ? 26 : 30;
  if (isEggMarker(spawn)) return baseSize + 2;
  if (spawn.marker_type === "underground_entrance") return baseSize - 4;
  if (spawn.marker_type === "physical_reward_source") return baseSize + 2;
  return baseSize;
}

function canvasIcon(source) {
  if (!source) return null;
  let image = state.iconImages.get(source);
  if (!image) {
    image = new Image();
    image.decoding = "async";
    image.addEventListener("load", scheduleCanvasIconRefresh);
    image.src = source;
    state.iconImages.set(source, image);
  }
  return image.complete && image.naturalWidth ? image : null;
}

function scheduleCanvasIconRefresh() {
  if (state.canvasIconLoadTimer) return;
  state.canvasIconLoadTimer = window.setTimeout(() => {
    state.canvasIconLoadTimer = 0;
    scheduleCanvasRender();
  }, 120);
}

function buildCanvasHitGrid(entries) {
  const map = currentMap();
  const grid = new Map();
  entries.forEach((entry) => {
    const { spawn } = entry;
    if (!spawn.normalized) return;
    const x = spawn.normalized.x * map.width;
    const y = spawn.normalized.y * map.height;
    const key = `${Math.floor(x / CANVAS_HIT_CELL_SIZE)}:${Math.floor(y / CANVAS_HIT_CELL_SIZE)}`;
    const bucket = grid.get(key) || [];
    bucket.push({ entry, x, y });
    grid.set(key, bucket);
  });
  state.canvasHitGrid = grid;
}

function findCanvasHit(clientX, clientY) {
  if (!state.canvasMode) return null;
  const point = screenToImagePoint(clientX, clientY);
  const hitRadius = pinHitSize() / 2 / state.scale;
  const cellRadius = Math.ceil(hitRadius / CANVAS_HIT_CELL_SIZE);
  const minCellX = Math.floor(point.x / CANVAS_HIT_CELL_SIZE) - cellRadius;
  const maxCellX = Math.floor(point.x / CANVAS_HIT_CELL_SIZE) + cellRadius;
  const minCellY = Math.floor(point.y / CANVAS_HIT_CELL_SIZE) - cellRadius;
  const maxCellY = Math.floor(point.y / CANVAS_HIT_CELL_SIZE) + cellRadius;
  const maxDistance = hitRadius * hitRadius;
  let closest = null;
  let closestDistance = maxDistance;

  for (let cellY = minCellY; cellY <= maxCellY; cellY += 1) {
    for (let cellX = minCellX; cellX <= maxCellX; cellX += 1) {
      const bucket = state.canvasHitGrid.get(`${cellX}:${cellY}`) || [];
      bucket.forEach((candidate) => {
        const dx = point.x - candidate.x;
        const dy = point.y - candidate.y;
        const distance = dx * dx + dy * dy;
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = candidate.entry;
        }
      });
    }
  }
  return closest;
}

function hideCanvasTooltip() {
  els.pinTooltip.hidden = true;
}

function updateCanvasHover(event) {
  if (!state.canvasMode) {
    hideCanvasTooltip();
    return;
  }
  const hit = findCanvasHit(event.clientX, event.clientY);
  const nextIndex = hit?.index ?? null;
  if (nextIndex !== state.hoveredCanvasIndex) {
    state.hoveredCanvasIndex = nextIndex;
    scheduleCanvasRender();
  }
  if (!hit) {
    hideCanvasTooltip();
    return;
  }

  const rect = els.mapViewport.getBoundingClientRect();
  const { spawn } = hit;
  const areaLabel = areaDetailValue(spawn) || mapRegionForSpawn(spawn) || regionDetailValue(spawn);
  const labelName = areaLabel ? `${spawn.display_name} (${areaLabel})` : spawn.display_name;
  const availabilityLabel = availabilityLabelForSpawn(spawn);
  els.pinTooltip.textContent = `${labelName} ${Math.round(spawn.x)}, ${Math.round(spawn.y)}${availabilityLabel ? ` - ${availabilityLabel}` : ""}`;
  els.pinTooltip.style.left = `${clamp(event.clientX - rect.left + 14, 4, Math.max(4, rect.width - 220))}px`;
  els.pinTooltip.style.top = `${clamp(event.clientY - rect.top + 14, 4, Math.max(4, rect.height - 46))}px`;
  els.pinTooltip.hidden = false;
}

function scheduleCanvasRender() {
  if (!state.canvasMode || state.canvasFrame) return;
  state.canvasFrame = window.requestAnimationFrame(() => {
    state.canvasFrame = 0;
    renderCanvasPins();
  });
}

function renderCanvasPins() {
  if (!state.canvasMode) return;
  const canvas = els.pinCanvas;
  const viewport = els.mapViewport.getBoundingClientRect();
  const width = Math.max(1, Math.round(viewport.width));
  const height = Math.max(1, Math.round(viewport.height));
  const pixelBudget = 12_000_000;
  const pixelRatio = Math.min(
    window.devicePixelRatio || 1,
    3,
    Math.max(1, Math.sqrt(pixelBudget / (width * height))),
  );
  const pixelWidth = Math.round(width * pixelRatio);
  const pixelHeight = Math.round(height * pixelRatio);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  canvas.hidden = false;
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.imageSmoothingQuality = "high";
  context.clearRect(0, 0, width, height);

  const map = currentMap();
  const screenPadding = 28;
  state.canvasEntries.forEach((entry) => {
    const { spawn, index } = entry;
    if (!spawn.normalized) return;
    const x = spawn.normalized.x * map.width * state.scale + state.panX;
    const y = spawn.normalized.y * map.height * state.scale + state.panY;
    const size = pinSizeFor(spawn);
    if (x < -screenPadding || x > width + screenPadding || y < -screenPadding || y > height + screenPadding) return;

    const item = state.data.itemsById.get(spawn.item_id);
    const icon = canvasIcon(spawn.icon || item?.icon);
    if (icon) {
      context.drawImage(icon, x - size / 2, y - size / 2, size, size);
    } else {
      context.beginPath();
      context.fillStyle = item?.color || "#7fc6b2";
      context.arc(x, y, Math.max(6, size / 3), 0, Math.PI * 2);
      context.fill();
    }

    if (spawn.is_underground && state.data.underground_badge_icon) {
      const badge = canvasIcon(state.data.underground_badge_icon);
      if (badge) context.drawImage(badge, x + size / 2 - 16, y - size / 2 - 4, 18, 18);
    }
    if (state.completed.has(luminCompletionIdForSpawn(spawn))) {
      const badgeRadius = Math.max(5, Math.min(6.5, size * 0.2));
      const badgeX = x + size * 0.34;
      const badgeY = y + size * 0.34;
      context.save();
      context.beginPath();
      context.fillStyle = "#2c8c75";
      context.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "rgba(224, 255, 246, 0.95)";
      context.lineWidth = 1;
      context.stroke();
      context.beginPath();
      context.strokeStyle = "#ffffff";
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = 1.6;
      context.moveTo(badgeX - badgeRadius * 0.45, badgeY);
      context.lineTo(badgeX - badgeRadius * 0.1, badgeY + badgeRadius * 0.32);
      context.lineTo(badgeX + badgeRadius * 0.48, badgeY - badgeRadius * 0.36);
      context.stroke();
      context.restore();
    }
    if (index === state.selectedSpawnIndex || index === state.hoveredCanvasIndex) {
      context.beginPath();
      context.strokeStyle = index === state.selectedSpawnIndex ? "#f6f9ff" : "rgba(246, 249, 255, 0.72)";
      context.lineWidth = index === state.selectedSpawnIndex ? 2.5 : 1.5;
      context.arc(x, y, size / 2 + 3, 0, Math.PI * 2);
      context.stroke();
    }
  });
}

function renderPins(entries) {
  state.selectedPin = null;
  state.domPins.clear();
  if (entries.length > PIN_CANVAS_THRESHOLD) {
    state.canvasMode = true;
    state.canvasEntries = entries;
    buildCanvasHitGrid(entries);
    els.pinLayer.replaceChildren();
    els.pinLayer.hidden = true;
    els.pinCanvas.hidden = false;
    scheduleCanvasRender();
    return;
  }

  state.canvasMode = false;
  state.canvasEntries = [];
  state.canvasHitGrid = new Map();
  state.hoveredCanvasIndex = null;
  hideCanvasTooltip();
  els.pinCanvas.hidden = true;
  els.pinLayer.hidden = false;
  const fragment = document.createDocumentFragment();
  entries.forEach((entry) => {
    const pin = createMarkerPin(entry);
    if (pin) {
      state.domPins.set(entry.index, pin);
      fragment.append(pin);
    }
  });
  els.pinLayer.replaceChildren(fragment);
}

function selectSpawn(index) {
  const spawn = state.data.spawns[index];
  if (!spawn) return;
  const item = state.data.itemsById.get(spawn.item_id);
  if (!item) return;
  if (state.selectedPin) {
    state.selectedPin.classList.remove("selected");
  }
  state.selectedSpawnIndex = index;
  const pin = state.domPins.get(index) || null;
  if (pin) pin.classList.add("selected");
  state.selectedPin = pin;
  if (state.canvasMode) scheduleCanvasRender();
  renderSelectionDetail(els.selectionDetail, spawn, item);
  renderSelectionDetail(els.mobileSelectionDetail, spawn, item);
  updateSelectionCatalogShortcuts(spawn, item);
  setMobileSelectionMinimized(false);
}

function refreshSelectionDetails() {
  if (!Number.isInteger(state.selectedSpawnIndex)) return;
  const spawn = state.data?.spawns[state.selectedSpawnIndex];
  const item = spawn ? state.data.itemsById.get(spawn.item_id) : null;
  if (!spawn || !item) return;
  renderSelectionDetail(els.selectionDetail, spawn, item);
  renderSelectionDetail(els.mobileSelectionDetail, spawn, item);
  updateSelectionCatalogShortcuts(spawn, item);
}

function renderSelectionDetail(detail, spawn, item) {
  detail.className = "selection";
  detail.replaceChildren();

  const title = document.createElement("div");
  title.className = "selection-title";
  const icon = makeIcon("", spawn.icon || item.icon);
  const titleText = document.createElement("div");
  const strong = document.createElement("strong");
  strong.className = "selection-name copyable-detail";
  strong.textContent = spawn.display_name;
  strong.tabIndex = 0;
  strong.setAttribute("role", "button");
  strong.setAttribute("aria-label", `Copy name ${spawn.display_name}`);
  strong.title = "Copy name";
  strong.addEventListener("click", () => copyDetailValue(strong, spawn.display_name));
  strong.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    copyDetailValue(strong, spawn.display_name);
  });
  const small = document.createElement("small");
  small.className = "selection-subtitle";
  const subtitle = [
    spawn.form_label,
    areaDetailValue(spawn) || mapRegionForSpawn(spawn) || markerTypeLabel(spawn.marker_type),
  ].filter(Boolean).join(" - ");
  if (subtitle) {
    const subtitleText = document.createElement("span");
    subtitleText.className = "selection-subtitle-text";
    subtitleText.textContent = spawn.is_underground ? `${subtitle},` : subtitle;
    small.append(subtitleText);
  }
  if (spawn.is_underground) {
    const underground = document.createElement("span");
    underground.className = "selection-underground";
    if (state.data.underground_badge_icon) {
      underground.append(makeIcon("selection-underground-icon", state.data.underground_badge_icon));
    }
    underground.append(document.createTextNode("Underground"));
    small.append(underground);
  }
  titleText.append(strong, small);
  title.append(icon, titleText);

  const grid = document.createElement("div");
  grid.className = "detail-grid";
  const typeLabel = spawn.display_type_label || item.display_type_label || markerTypeLabel(spawn.marker_type);
  const trackable = isTrackableOverworldItem(spawn, item);
  const areaValue = areaDetailValue(spawn);
  const formValue = spawn.form_label || item.form_label;
  const regionValue = regionDetailValue(spawn);
  const rows = [
    ["Type", typeLabel],
    spawn.document_group ? ["Series", spawn.document_group] : null,
    formValue ? ["Form", formValue] : null,
    ["X", formatCoordinate(spawn.x), formatCoordinate(spawn.x)],
    ["Y", formatCoordinate(spawn.y), formatCoordinate(spawn.y)],
    ["Height", formatNumber(spawn.height_y, 2)],
    areaValue ? ["Area", areaValue] : null,
    regionValue ? ["Region", regionValue] : null,
  ].filter((row) => row && row[1]);
  rows.forEach(([label, value, copyValue]) => {
    const left = document.createElement("span");
    left.textContent = label;
    const right = document.createElement("span");
    right.className = "detail-value";
    right.textContent = value || "";
    if (copyValue) {
      right.classList.add("copyable-detail");
      right.tabIndex = 0;
      right.setAttribute("role", "button");
      right.setAttribute("aria-label", `Copy ${label} coordinate ${copyValue}`);
      right.title = `Copy ${label}`;
      right.addEventListener("click", () => copyDetailValue(right, copyValue));
      right.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        copyDetailValue(right, copyValue);
      });
    }
    grid.append(left, right);
  });

  detail.append(title, grid);
  if (state.sidebarView !== "map") {
    const locate = document.createElement("button");
    locate.type = "button";
    locate.textContent = "Locate";
    locate.addEventListener("click", () => focusSpawn(spawn));
    detail.append(locate);
  }

  if (trackable) {
    const trackingId = trackingIdForSpawn(spawn);
    const track = document.createElement("button");
    track.type = "button";
    track.className = "track-selection-button";
    if (state.tracking.has(trackingId)) {
      track.textContent = "Open Tracking";
      track.addEventListener("click", () => setSidebarView("tracking"));
    } else {
      track.textContent = "Track Respawn";
      track.addEventListener("click", () => {
        addTrackingForSpawn(spawn, item);
      });
    }
    detail.append(track);
  }
}

function focusSpawn(spawn) {
  const rect = els.mapViewport.getBoundingClientRect();
  const locateScale = clamp(mapFitScale(rect) * 3.5, MIN_SCALE, 0.55);
  const map = currentMap();
  state.scale = Math.max(state.scale, locateScale);
  state.panX = rect.width / 2 - spawn.normalized.x * map.width * state.scale;
  state.panY = rect.height / 2 - spawn.normalized.y * map.height * state.scale;
  clampPan();
  applyTransform();
}

function prepareData(data) {
  const sourceItems = Array.isArray(data.items) ? data.items : [];
  const sourceSpawns = Array.isArray(data.spawns) ? data.spawns : [];
  data.hiddenCounts = {
    items: sourceItems.filter((item) => TEMPORARILY_HIDDEN_ITEM_IDS.has(item.item_id)).length,
    spawns: sourceSpawns.filter((spawn) => TEMPORARILY_HIDDEN_ITEM_IDS.has(spawn.item_id)).length,
  };
  data.items = sourceItems.filter((item) => !TEMPORARILY_HIDDEN_ITEM_IDS.has(item.item_id));
  data.spawns = sourceSpawns.filter((spawn) => !TEMPORARILY_HIDDEN_ITEM_IDS.has(spawn.item_id));
  data.maps = Array.isArray(data.maps) && data.maps.length ? data.maps : [data.map];
  data.maps.forEach((map, index) => {
    map.id = map.id || (index === 0 ? "country-of-time" : `map-${index + 1}`);
    map.label = map.label || map.id;
  });
  data.mapsById = new Map(data.maps.map((map) => [map.id, map]));
  data.map = data.maps[0];
  if (!data.mapsById.has(state.activeMapId)) {
    state.activeMapId = data.maps[0].id;
  }
  data.itemsById = new Map();
  data.spawnsByItemId = new Map();
  data.itemIdsByMap = new Map(data.maps.map((map) => [map.id, new Set()]));
  data.items.forEach((item) => {
    item.layer_id = item.layer_id || (isEggItem(item) ? "eggs" : "items");
  });
  data.items.sort(compareItems);
  data.items.forEach((item, index) => {
    item.layer_id = item.layer_id || (isEggItem(item) ? "eggs" : "items");
    item.color = itemColor(item, index);
    item.search_text = itemSearchText(item);
    item.direct_search_text = itemDirectSearchText(item);
    data.itemsById.set(item.item_id, item);
  });
  data.spawns.sort((a, b) => {
    const nameCompare = a.display_name.localeCompare(b.display_name);
    if (nameCompare !== 0) return nameCompare;
    return a.coordinate_key.localeCompare(b.coordinate_key);
  });
  data.spawns.forEach((spawn, index) => {
    spawn.map_id = spawn.map_id || data.map.id;
    spawn.search_text = spawnSearchText(spawn);
    if (!data.spawnsByItemId.has(spawn.item_id)) {
      data.spawnsByItemId.set(spawn.item_id, []);
    }
    data.spawnsByItemId.get(spawn.item_id).push({ spawn, index });
    if (!data.itemIdsByMap.has(spawn.map_id)) {
      data.itemIdsByMap.set(spawn.map_id, new Set());
    }
    data.itemIdsByMap.get(spawn.map_id).add(spawn.item_id);
  });
  return data;
}

function datasetForMap(mapId) {
  const cached = state.mapDataCache.get(mapId);
  if (cached) return cached;
  if (!state.legacyDataset) return null;

  const spawns = state.legacyDataset.spawns.filter((spawn) => spawn.map_id === mapId);
  const itemIds = new Set(spawns.map((spawn) => spawn.item_id));
  return {
    items: state.legacyDataset.items.filter((item) => itemIds.has(item.item_id)),
    spawns,
  };
}

function useMapDataset(mapId, dataset) {
  if (!state.bootstrap || state.activeMapId !== mapId) return;
  state.data = prepareData({
    ...state.bootstrap,
    items: dataset?.items || [],
    spawns: dataset?.spawns || [],
  });
  renderItems();
  refreshVisibility();
  updateMapMeta();
  applyPendingAniilogLocate(true);
  applyPendingBossLocate(true);
}

async function loadMapData(mapId, token) {
  const cached = datasetForMap(mapId);
  if (cached) {
    if (token === state.mapLoadToken && mapId === state.activeMapId) {
      state.loadingMapId = null;
      useMapDataset(mapId, cached);
    }
    return;
  }

  const map = state.data?.mapsById.get(mapId);
  if (!map?.data_url) return;
  state.loadingMapId = mapId;
  state.mapLoadError = null;
  updateMapMeta();

  try {
    const response = await fetch(map.data_url);
    if (!response.ok) throw new Error(`Could not load marker data for ${map.label}`);
    const dataset = await response.json();
    state.mapDataCache.set(mapId, dataset);
    if (token !== state.mapLoadToken || mapId !== state.activeMapId) return;
    state.loadingMapId = null;
    useMapDataset(mapId, dataset);
  } catch (error) {
    if (token !== state.mapLoadToken || mapId !== state.activeMapId) return;
    state.loadingMapId = null;
    state.mapLoadError = error;
    updateMapMeta();
    clearSelectionDetails("The map loaded, but its marker data could not be loaded.");
    console.error(error);
  }
}

function updateMapTabs() {
  els.mapTabs.querySelectorAll(".map-tab").forEach((tab) => {
    const selected = tab.dataset.mapId === state.activeMapId;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
}

function renderMapTabs() {
  const fragment = document.createDocumentFragment();
  state.data.maps.forEach((map) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "map-tab";
    tab.setAttribute("role", "tab");
    tab.dataset.mapId = map.id;
    tab.textContent = map.label;
    tab.addEventListener("click", () => switchMap(map.id));
    fragment.append(tab);
  });
  els.mapTabs.replaceChildren(fragment);
  updateMapTabs();
}

function headerCatalogCount(key, fallback) {
  if (key === "items") {
    const publicItemCount = Number(state.itemlogData?.totals?.named_items);
    if (Number.isFinite(publicItemCount) && publicItemCount >= 0) return Math.round(publicItemCount);
  }
  const value = Number(state.data?.catalog_counts?.[key]);
  return Number.isFinite(value) && value >= 0 ? Math.round(value) : fallback;
}

function updateMapMeta() {
  const map = currentMap();
  const counts = map.counts || state.data.counts || {};
  const hiddenCounts = state.data?.hiddenCounts || { items: 0, spawns: 0 };
  const parts = [
    `${Math.max(0, (counts.spawns || 0) - hiddenCounts.spawns)} markers`,
    `${headerCatalogCount("items", Math.max(0, (counts.collectable_items || 0) - hiddenCounts.items))} items`,
    `${headerCatalogCount("aniimo", counts.aniimo || 0)} Aniimo`,
    `${headerCatalogCount("eggs", counts.eggs ?? counts.elite_eggs ?? 0)} eggs`,
    `${counts.teleports || 0} teleports`,
    `${headerCatalogCount("lumens", counts.ambers || 0)} Lumens`,
    `${counts.misc || 0} misc`,
  ];
  if (state.loadingMapId === map.id) parts.push("Loading markers");
  if (state.mapLoadError) parts.push("Marker data unavailable");
  els.mapMeta.textContent = parts.join(" - ");
}

function scheduleMapDataLoad(mapId, token) {
  let queued = false;
  const load = () => {
    if (token !== state.mapLoadToken || mapId !== state.activeMapId) return;
    void loadMapData(mapId, token);
  };
  const queueAfterFirstPaint = () => {
    if (queued || token !== state.mapLoadToken || mapId !== state.activeMapId) return;
    queued = true;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(load, { timeout: 750 });
        } else {
          window.setTimeout(load, 150);
        }
      });
    });
  };

  if (els.mapImage.complete && els.mapImage.naturalWidth) {
    queueAfterFirstPaint();
  } else {
    els.mapImage.addEventListener("load", queueAfterFirstPaint, { once: true });
    // Preserve marker availability if a preview fails or is unusually slow.
    window.setTimeout(queueAfterFirstPaint, 2500);
  }
}

function switchMap(mapId) {
  if (!state.data.mapsById.has(mapId)) return;
  const loadToken = ++state.mapLoadToken;
  state.activeMapId = mapId;
  state.mapLoadError = null;
  const dataset = datasetForMap(mapId);
  state.loadingMapId = dataset ? null : mapId;
  state.data = prepareData({
    ...state.bootstrap,
    items: dataset?.items || [],
    spawns: dataset?.spawns || [],
  });
  updateMapTabs();
  const url = new URL(window.location.href);
  if (mapId === state.data.maps[0].id) {
    url.searchParams.delete("map");
  } else {
    url.searchParams.set("map", mapId);
  }
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  state.selectedPin = null;
  state.selectedSpawnIndex = null;
  clearLocatedSpawn();
  clearSelectionDetails("No marker selected");
  setMobileSelectionMinimized(true);
  els.coordinateReadout.textContent = "X 0, Y 0";
  const map = currentMap();
  renderMapBase();
  els.mapWorld.style.width = `${map.width}px`;
  els.mapWorld.style.height = `${map.height}px`;
  renderItems();
  refreshVisibility();
  updateMapMeta();
  fitMap();
  if (dataset) {
    applyPendingAniilogLocate(true);
    applyPendingBossLocate(true);
  }
  if (!dataset) scheduleMapDataLoad(mapId, loadToken);
}

function bindEvents() {
  window.addEventListener("scroll", resetDocumentScroll, { passive: true });
  els.mapViewport.addEventListener("scroll", resetMapScroll, { passive: true });
  els.mobileSelectionToggle.addEventListener("click", () => {
    setMobileSelectionMinimized(!state.mobileSelectionMinimized);
  });
  els.selectionCatalogShortcut.addEventListener("click", openSelectedMarkerCatalogEntry);
  els.mobileSelectionCatalogShortcut.addEventListener("click", openSelectedMarkerCatalogEntry);
  MOBILE_LAYOUT_QUERY.addEventListener("change", () => {
    if (state.selectedSpawnIndex === null) state.mobileSelectionMinimized = true;
    updateMobileSelectionPanel();
    window.requestAnimationFrame(fitMap);
  });
  els.mapWorkspaceTab.addEventListener("click", () => setSidebarView("map"));
  els.trackingWorkspaceTab.addEventListener("click", () => setSidebarView("tracking"));
  els.checklistWorkspaceTab.addEventListener("click", () => setSidebarView("checklist"));
  els.aniilogWorkspaceTab.addEventListener("click", () => setSidebarView("aniilog"));
  els.itemlogWorkspaceTab.addEventListener("click", () => setSidebarView("itemlog"));
  els.appVersion.addEventListener("click", openChangelog);
  els.settingsButton.addEventListener("click", openSettings);
  els.settingsCloseButton.addEventListener("click", closeSettings);
  els.settingsOverlay.addEventListener("click", (event) => {
    if (event.target === els.settingsOverlay) closeSettings();
  });
  els.changelogCloseButton.addEventListener("click", closeChangelog);
  els.changelogOverlay.addEventListener("click", (event) => {
    if (event.target === els.changelogOverlay) closeChangelog();
  });
  els.workspaceTabs.addEventListener("keydown", (event) => {
    if (!new Set(["ArrowLeft", "ArrowRight", "Home", "End"]).has(event.key)) return;
    const tabs = [...els.workspaceTabs.querySelectorAll(".workspace-tab")];
    const currentIndex = Math.max(0, tabs.findIndex((tab) => tab.dataset.workspaceView === state.sidebarView));
    let nextIndex = currentIndex;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    event.preventDefault();
    setSidebarView(tabs[nextIndex].dataset.workspaceView);
    tabs[nextIndex].focus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.settingsOpen) closeSettings();
    if (event.key === "Escape" && state.changelogOpen) closeChangelog();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateTrackingCountdowns();
  });
  els.searchInput.addEventListener("input", () => {
    clearLocatedSpawn();
    state.search = normalizedSearch(els.searchInput.value);
    renderItems();
    refreshVisibility();
  });
  els.checklistSearchInput.addEventListener("input", () => {
    state.checklistSearch = normalizedSearch(els.checklistSearchInput.value);
    renderChecklist();
  });
  els.mapTabs.addEventListener("keydown", (event) => {
    if (!new Set(["ArrowLeft", "ArrowRight", "Home", "End"]).has(event.key)) return;
    const tabs = [...els.mapTabs.querySelectorAll(".map-tab")];
    const currentIndex = tabs.findIndex((tab) => tab.dataset.mapId === state.activeMapId);
    let nextIndex = currentIndex;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    event.preventDefault();
    const nextTab = tabs[nextIndex];
    if (nextTab) {
      switchMap(nextTab.dataset.mapId);
      nextTab.focus();
    }
  });
  els.selectAllButton.addEventListener("click", () => {
    clearLocatedSpawn();
    activeMapItems().forEach((item) => setItemSelection(item.item_id, true));
    refreshVisibility();
  });
  els.selectNoneButton.addEventListener("click", () => {
    clearLocatedSpawn();
    state.enabled.clear();
    refreshVisibility();
  });
  els.zoomInButton.addEventListener("click", () => {
    const rect = els.mapViewport.getBoundingClientRect();
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, state.scale * 1.25);
  });
  els.zoomOutButton.addEventListener("click", () => {
    const rect = els.mapViewport.getBoundingClientRect();
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, state.scale / 1.25);
  });
  els.fitButton.addEventListener("click", fitMap);
  els.mapViewport.addEventListener("wheel", (event) => {
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.12 : 0.88;
    zoomAt(event.clientX, event.clientY, state.scale * factor);
  }, { passive: false });
  els.mapViewport.addEventListener("contextmenu", (event) => {
    const pin = event.target instanceof Element ? event.target.closest(".pin") : null;
    const pinIndex = Number(pin?.dataset.spawnIndex);
    const entry = Number.isInteger(pinIndex)
      ? { spawn: state.data?.spawns[pinIndex], index: pinIndex }
      : findCanvasHit(event.clientX, event.clientY);
    if (!entry?.spawn) return;
    event.preventDefault();
    event.stopPropagation();
    deselectIndividualSpawn(entry);
  });
  els.mapViewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const pointer = rememberActivePointer(event, eventTargetsPin(event));
    els.mapViewport.setPointerCapture(event.pointerId);

    if (state.activePointers.size >= 2) {
      if (beginPinch()) event.preventDefault();
      return;
    }

    if (pointer.fromPin) {
      const pin = event.target instanceof Element ? event.target.closest(".pin") : null;
      const index = Number(pin?.dataset.spawnIndex);
      if (Number.isInteger(index)) {
        state.canvasPointerHit = {
          pointerId: event.pointerId,
          index,
          x: event.clientX,
          y: event.clientY,
        };
      }
      return;
    }
    const canvasHit = findCanvasHit(event.clientX, event.clientY);
    if (canvasHit) {
      state.canvasPointerHit = {
        pointerId: event.pointerId,
        index: canvasHit.index,
        x: event.clientX,
        y: event.clientY,
      };
      return;
    }
    startMapDrag(pointer);
  });
  els.mapViewport.addEventListener("pointermove", (event) => {
    if (state.activePointers.has(event.pointerId)) rememberActivePointer(event);
    updateCoordinateReadout(event);

    if (state.pinch && updatePinch()) {
      event.preventDefault();
      return;
    }

    if (event.pointerType === "mouse" && !state.dragging) updateCanvasHover(event);
    if (!state.dragging || state.dragStart?.pointerId !== event.pointerId) return;
    state.panX = state.dragStart.panX + event.clientX - state.dragStart.x;
    state.panY = state.dragStart.panY + event.clientY - state.dragStart.y;
    clampPan();
    applyTransform();
  });
  els.mapViewport.addEventListener("pointerup", (event) => {
    if (!state.activePointers.has(event.pointerId)) return;
    rememberActivePointer(event);
    finishPointerInteraction(event);
  });
  els.mapViewport.addEventListener("pointercancel", (event) => {
    if (!state.activePointers.has(event.pointerId)) return;
    finishPointerInteraction(event, true);
  });
  els.mapViewport.addEventListener("lostpointercapture", (event) => {
    if (!state.activePointers.has(event.pointerId)) return;
    finishPointerInteraction(event, true);
  });
  els.mapViewport.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "mouse" || state.dragging || state.pinch) return;
    if (state.hoveredCanvasIndex !== null) {
      state.hoveredCanvasIndex = null;
      scheduleCanvasRender();
    }
    hideCanvasTooltip();
  });
  if ("ResizeObserver" in window) {
    state.viewportResizeObserver = new ResizeObserver(scheduleMapViewportFit);
    state.viewportResizeObserver.observe(els.mapViewport);
  }
  window.addEventListener("resize", scheduleMapViewportFit, { passive: true });
  const refreshPinGeometry = () => {
    if (state.data) applyTransform();
  };
  if (typeof MOBILE_LAYOUT_QUERY.addEventListener === "function") {
    MOBILE_LAYOUT_QUERY.addEventListener("change", refreshPinGeometry);
  } else if (typeof MOBILE_LAYOUT_QUERY.addListener === "function") {
    MOBILE_LAYOUT_QUERY.addListener(refreshPinGeometry);
  }
}

async function init() {
  loadLocalTracking();
  applyThemePreference();
  try {
    await window.AniipediaI18n.load(state.preferences.language);
  } catch (error) {
    console.error(error);
    state.preferences.language = "en";
    await window.AniipediaI18n.load("en");
  }
  window.AniipediaI18n.start();
  bindEvents();
  const checklistRequest = fetch(CHECKLIST_URL)
    .then(async (response) => {
      if (!response.ok) throw new Error(`Could not load ${CHECKLIST_URL}`);
      const checklist = await response.json();
      if (!Array.isArray(checklist?.entries) || !Array.isArray(checklist?.categories)) {
        throw new Error("Checklist data has an invalid format");
      }
      state.checklistData = checklist;
      state.checklistLoadError = "";
    })
    .catch((error) => {
      state.checklistData = null;
      state.checklistLoadError = error instanceof Error ? error.message : String(error);
    });
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Could not load ${DATA_URL}`);
  }
  const loaded = await response.json();
  if (Array.isArray(loaded.items) || Array.isArray(loaded.spawns)) {
    state.legacyDataset = {
      items: Array.isArray(loaded.items) ? loaded.items : [],
      spawns: Array.isArray(loaded.spawns) ? loaded.spawns : [],
    };
  }
  state.bootstrap = {
    ...loaded,
    items: [],
    spawns: [],
  };
  state.data = prepareData(state.bootstrap);
  await checklistRequest;
  els.appVersion.textContent = APP_VERSION;
  updateWorkspaceTabs();
  updateMobileSelectionPanel();
  renderTracking();
  renderChecklist();
  renderSettings();
  renderMapTabs();
  switchMap(state.activeMapId);
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(preloadAniilogData, { timeout: 1500 });
  } else {
    window.setTimeout(preloadAniilogData, 400);
  }
}

init().catch((error) => {
  els.mapMeta.textContent = "Load failed";
  clearSelectionDetails(error.message);
  console.error(error);
});
