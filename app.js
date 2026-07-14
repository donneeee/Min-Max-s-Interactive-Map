const DATA_URL = "./data/map_site_data.json?v=20260713-streamed-maps-v020";
const APP_VERSION = "v0.3.20";
const MIN_SCALE = 0.03;
const MAX_SCALE = 16;
const MAP_EDGE_MARGIN = 48;
const MAP_TILE_DETAIL_SCALE = 0.55;
const PIN_CANVAS_THRESHOLD = 450;
const CANVAS_HIT_CELL_SIZE = 128;
const REQUESTED_MAP_ID = new URLSearchParams(window.location.search).get("map");
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
  visibleEntries: [],
  canvasEntries: [],
  canvasHitGrid: new Map(),
  iconImages: new Map(),
  canvasMode: false,
  hoveredCanvasIndex: null,
  canvasPointerHit: null,
  canvasFrame: 0,
  canvasIconLoadTimer: 0,
  enabled: new Set(),
  activeMapId: REQUESTED_MAP_ID || "country-of-time",
  activeLayer: "items",
  search: "",
  scale: 1,
  panX: 0,
  panY: 0,
  dragging: false,
  dragStart: null,
  selectedPin: null,
  selectedSpawnIndex: null,
};

const els = {
  mapMeta: document.querySelector("#mapMeta"),
  appVersion: document.querySelector("#appVersion"),
  mapTabs: document.querySelector("#mapTabs"),
  searchInput: document.querySelector("#searchInput"),
  filterCount: document.querySelector("#filterCount"),
  layerTabs: document.querySelector("#layerTabs"),
  itemList: document.querySelector("#itemList"),
  selectionDetail: document.querySelector("#selectionDetail"),
  mapPanel: document.querySelector(".map-panel"),
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

function markerTypeLabel(type) {
  if (type === "elite_egg") return "Elite Egg";
  if (type === "aniimo_spawn") return "Aniimo";
  if (type === "teleport_bloom") return "Bloom";
  if (type === "teleport_sanctum") return "Sanctum";
  if (type === "teleport_branch") return "Branch";
  if (type === "teleport_outpost") return "Outpost";
  if (type === "teleport_nurture") return "Nurture";
  if (type === "teleport_vein_abundance") return "Vein Abundance";
  if (type === "lumin_amber") return "Lumin Amber";
  if (type === "underground_entrance") return "Underground Entrance";
  if (type === "morphling_memory") return "Morphling Memory";
  if (type === "lighthouse_book") return "Book";
  if (type === "research_note") return "Research Note";
  if (type === "astra_transit") return "Astra Transit";
  if (type === "astra_district") return "Astra District";
  if (type === "astra_shop") return "Shop";
  if (type === "pathfinder_challenger") return "Pathfinder Challenge";
  if (type === "elite_pathfinder_challenger") return "Elite Pathfinder Challenge";
  return "Collectable";
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

function currentMap() {
  if (!state.data) return null;
  return state.data.mapsById.get(state.activeMapId) || state.data.maps[0] || state.data.map;
}

function mapLabelForSpawn(spawn) {
  if (!state.data || !spawn) return "";
  return state.data.mapsById.get(spawn.map_id)?.label || "";
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

function areaDetailValue(spawn) {
  return spawn.area_name || spawn.large_area_name || spawn.level_area_name || spawn.area_inferred_name || spawn.region_name || "";
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

function setPinMapPosition(pin, spawn) {
  if (!spawn?.normalized) return;
  const map = currentMap();
  pin.style.setProperty("--pin-x", String(spawn.normalized.x * map.width));
  pin.style.setProperty("--pin-y", String(spawn.normalized.y * map.height));
}

function applyTransform() {
  stabilizeViewport();
  els.mapWorld.style.transform = `matrix(${state.scale}, 0, 0, ${state.scale}, ${state.panX}, ${state.panY})`;
  els.mapWorld.style.setProperty("--pin-inverse-scale", String(1 / state.scale));
  scheduleMapTileDetail();
  if (state.canvasMode) scheduleCanvasRender();
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
  if (!state.data) return;
  const rect = els.mapViewport.getBoundingClientRect();
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
  parts.forEach((part) => {
    if (Array.isArray(part)) {
      part.forEach((value) => {
        if (value !== null && value !== undefined) values.push(value);
      });
    } else if (part !== null && part !== undefined) {
      values.push(part);
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
  return item.search_text.includes(state.search);
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
    item.book_names,
    item.layer_id,
    item.inventory_label,
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
    spawn.marker_type,
    spawn.layer_id,
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
  const item = state.data.itemsById.get(spawn.item_id);
  if (!itemPassesFilters(item)) return false;
  if (!state.search) return true;
  return item.search_text.includes(state.search) || spawn.search_text.includes(state.search);
}

function visibleSpawnEntries() {
  const entries = [];
  for (const itemId of state.enabled) {
    const item = state.data.itemsById.get(itemId);
    if (!itemPassesFilters(item)) continue;
    const itemSpawns = activeMapSpawnEntries(itemId);
    const itemMatchesSearch = !state.search || item.search_text.includes(state.search);
    itemSpawns.forEach((entry) => {
      if (!state.search || itemMatchesSearch || entry.spawn.search_text.includes(state.search)) {
        entries.push(entry);
      }
    });
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

function refreshVisibility() {
  const visibleEntries = visibleSpawnEntries();
  state.visibleEntries = visibleEntries;
  renderPins(visibleEntries);

  for (const row of els.itemList.querySelectorAll(".item-row")) {
    const item = state.data.itemsById.get(row.dataset.itemId);
    row.classList.toggle("enabled", state.enabled.has(item.item_id));
    row.hidden = !itemMatches(item);
    row.setAttribute("aria-pressed", String(state.enabled.has(item.item_id)));
  }

  for (const section of els.itemList.querySelectorAll(".layer-panel")) {
    const rows = [...section.querySelectorAll(".item-row")];
    const visibleRows = rows.filter((row) => !row.hidden).length;
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
  const mapItems = activeMapItems();
  const layers = state.data.layers?.length
    ? state.data.layers
    : [{ id: "items", label: "Items" }, { id: "aniimo", label: "Aniimo" }, { id: "eggs", label: "Eggs" }];
  const layersWithItems = layers.filter((layer) => mapItems.some((item) => item.layer_id === layer.id));
  if (!layersWithItems.some((layer) => layer.id === state.activeLayer)) {
    state.activeLayer = layersWithItems[0]?.id || "";
  }

  layersWithItems.forEach((layer) => {
    const layerItems = mapItems.filter((item) => item.layer_id === layer.id);

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
      state.activeLayer = layer.id;
      refreshVisibility();
    });
    tab.addEventListener("dblclick", (event) => {
      event.preventDefault();
      state.activeLayer = layer.id;
      const selectableItems = layerItems.filter((item) => itemPassesFilters(item));
      const allSelected = selectableItems.length > 0
        && selectableItems.every((item) => state.enabled.has(item.item_id));
      selectableItems.forEach((item) => {
        if (allSelected) {
          state.enabled.delete(item.item_id);
        } else {
          state.enabled.add(item.item_id);
        }
      });
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

    layerItems.forEach((item) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = [
      "item-row",
      state.enabled.has(item.item_id) ? "enabled" : "",
      item.is_elite_egg ? "elite-egg" : "",
      item.is_aniimo ? "aniimo-row" : "",
      item.is_elite_egg && !item.spawn_count ? "unplaced" : "",
    ].filter(Boolean).join(" ");
    row.dataset.itemId = item.item_id;
    row.setAttribute("aria-pressed", String(state.enabled.has(item.item_id)));
    row.addEventListener("mousedown", preventControlFocus);
    row.addEventListener("click", (event) => {
      event.preventDefault();
      if (state.enabled.has(item.item_id)) {
        state.enabled.delete(item.item_id);
      } else {
        state.enabled.add(item.item_id);
      }
      refreshVisibility();
    });

    const icon = makeIcon("item-icon", item.icon);

    const text = document.createElement("span");
    text.className = "item-text";
    const strong = document.createElement("strong");
    strong.textContent = item.is_aniimo ? aniimoListName(item) : item.display_name;
    const small = document.createElement("small");
    const smallParts = item.subtitle
      ? [item.subtitle]
      : item.is_aniimo
        ? [aniimoListMeta(item)]
        : item.is_elite_egg
          ? [item.region_name || item.area_name || item.display_type_label]
          : [item.display_type_label, item.region_name];
    small.textContent = smallParts.filter(Boolean).join(" - ");
    strong.title = strong.textContent;
    small.title = small.textContent;
    text.append(strong, small);

    const count = document.createElement("span");
    count.className = "item-count";
    const mapSpawnCount = activeMapSpawnEntries(item.item_id).length;
    count.textContent = item.is_elite_egg && !mapSpawnCount ? "No pin" : mapSpawnCount;

      row.append(icon, text, count);
      section.append(row);
    });

    els.itemList.append(section);
  });
}

function pinClassName(spawn) {
  return [
    "pin",
    spawn.marker_type === "elite_egg" ? "pin-elite-egg" : "",
    spawn.marker_type === "aniimo_spawn" ? "pin-aniimo-spawn" : "",
    spawn.layer_id === "teleports" ? "pin-teleport" : "",
    spawn.layer_id === "ambers" ? "pin-amber" : "",
    spawn.marker_type === "underground_entrance" ? "pin-underground" : "",
    spawn.is_underground ? "pin-underground-marker" : "",
  ]
    .filter(Boolean)
    .join(" ");
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
  setPinMapPosition(pin, spawn);
  pin.setAttribute(
    "aria-label",
    `${spawn.display_name} ${spawn.area_name || spawn.region_name || ""} ${formatCoordinate(spawn.x)} ${formatCoordinate(spawn.y)}${spawn.is_underground ? " underground" : ""}`,
  );

  const icon = makeIcon("pin-icon", item.icon);
  const undergroundBadge = spawn.is_underground && state.data.underground_badge_icon
    ? makeIcon("pin-underground-badge", state.data.underground_badge_icon)
    : null;
  const pinBody = document.createElement("span");
  pinBody.className = "pin-body";
  const label = document.createElement("span");
  label.className = "pin-label";
  const areaLabel = spawn.area_name || spawn.region_name;
  const labelName = areaLabel ? `${spawn.display_name} (${areaLabel})` : spawn.display_name;
  label.textContent = `${labelName} ${Math.round(spawn.x)}, ${Math.round(spawn.y)}`;
  pinBody.append(icon);
  if (undergroundBadge) pinBody.append(undergroundBadge);
  pinBody.append(label);
  pin.append(pinBody);
  pin.tabIndex = -1;
  pin.addEventListener("mousedown", preventControlFocus);
  pin.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
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
  if (spawn.marker_type === "elite_egg") return 34;
  if (spawn.marker_type === "underground_entrance") return 28;
  return 32;
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
  const hitRadius = 22 / state.scale;
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
  const areaLabel = spawn.area_name || spawn.region_name;
  const labelName = areaLabel ? `${spawn.display_name} (${areaLabel})` : spawn.display_name;
  els.pinTooltip.textContent = `${labelName} ${Math.round(spawn.x)}, ${Math.round(spawn.y)}`;
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
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(viewport.width));
  const height = Math.max(1, Math.round(viewport.height));
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
    const icon = canvasIcon(item?.icon);
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
    if (pin) fragment.append(pin);
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
  const pin = els.pinLayer.querySelector(`[data-spawn-index="${index}"]`);
  if (pin) pin.classList.add("selected");
  state.selectedPin = pin;
  if (state.canvasMode) scheduleCanvasRender();
  els.selectionDetail.className = "selection";
  els.selectionDetail.innerHTML = "";

  const title = document.createElement("div");
  title.className = "selection-title";
  const icon = makeIcon("", item.icon);
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
    areaDetailValue(spawn) || mapLabelForSpawn(spawn) || markerTypeLabel(spawn.marker_type),
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
  const rows = [
    ["Type", typeLabel],
    ["X", formatCoordinate(spawn.x), formatCoordinate(spawn.x)],
    ["Y", formatCoordinate(spawn.y), formatCoordinate(spawn.y)],
    ["Height", formatNumber(spawn.height_y, 2)],
  ];
  const areaValue = areaDetailValue(spawn);
  if (areaValue) rows.push(["Area", areaValue]);
  if (spawn.form_label || item.form_label) rows.push(["Form", spawn.form_label || item.form_label]);
  const regionValue = spawn.region_name || mapLabelForSpawn(spawn);
  if (regionValue && regionValue !== areaValue && !areaValue.includes(regionValue)) {
    rows.push(["Region", regionValue]);
  }
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

  const locate = document.createElement("button");
  locate.type = "button";
  locate.textContent = "Locate";
  locate.addEventListener("click", () => focusSpawn(spawn));
  els.selectionDetail.append(title, grid, locate);
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
  data.items = Array.isArray(data.items) ? data.items : [];
  data.spawns = Array.isArray(data.spawns) ? data.spawns : [];
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
    item.layer_id = item.layer_id || (item.is_elite_egg ? "eggs" : "items");
  });
  data.items.sort(compareItems);
  data.items.forEach((item, index) => {
    item.layer_id = item.layer_id || (item.is_elite_egg ? "eggs" : "items");
    item.color = layerColor(item.layer_id, index);
    item.search_text = itemSearchText(item);
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
    els.selectionDetail.className = "selection empty";
    els.selectionDetail.textContent = "The map loaded, but its marker data could not be loaded.";
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

function updateMapMeta() {
  const map = currentMap();
  const counts = map.counts || state.data.counts || {};
  const parts = [
    `${counts.spawns || 0} markers`,
    `${counts.collectable_items || 0} items`,
    `${counts.aniimo || 0} Aniimo`,
    `${counts.elite_eggs || 0} eggs`,
    `${counts.teleports || 0} teleports`,
    `${counts.ambers || 0} ambers`,
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
  els.selectionDetail.className = "selection empty";
  els.selectionDetail.textContent = "No marker selected";
  els.coordinateReadout.textContent = "X 0, Y 0";
  const map = currentMap();
  renderMapBase();
  els.mapWorld.style.width = `${map.width}px`;
  els.mapWorld.style.height = `${map.height}px`;
  renderItems();
  refreshVisibility();
  updateMapMeta();
  fitMap();
  if (!dataset) scheduleMapDataLoad(mapId, loadToken);
}

function bindEvents() {
  window.addEventListener("scroll", resetDocumentScroll, { passive: true });
  els.mapViewport.addEventListener("scroll", resetMapScroll, { passive: true });
  els.searchInput.addEventListener("input", () => {
    state.search = normalizedSearch(els.searchInput.value);
    refreshVisibility();
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
    activeMapItems().forEach((item) => state.enabled.add(item.item_id));
    refreshVisibility();
  });
  els.selectNoneButton.addEventListener("click", () => {
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
  els.mapViewport.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".pin")) return;
    const canvasHit = findCanvasHit(event.clientX, event.clientY);
    if (canvasHit) {
      state.canvasPointerHit = {
        index: canvasHit.index,
        x: event.clientX,
        y: event.clientY,
      };
      els.mapViewport.setPointerCapture(event.pointerId);
      return;
    }
    state.dragging = true;
    state.dragStart = {
      x: event.clientX,
      y: event.clientY,
      panX: state.panX,
      panY: state.panY,
    };
    els.mapViewport.classList.add("dragging");
    els.mapViewport.setPointerCapture(event.pointerId);
  });
  els.mapViewport.addEventListener("pointermove", (event) => {
    updateCoordinateReadout(event);
    updateCanvasHover(event);
    if (!state.dragging) return;
    state.panX = state.dragStart.panX + event.clientX - state.dragStart.x;
    state.panY = state.dragStart.panY + event.clientY - state.dragStart.y;
    clampPan();
    applyTransform();
  });
  els.mapViewport.addEventListener("pointerup", (event) => {
    if (state.canvasPointerHit) {
      const candidate = state.canvasPointerHit;
      state.canvasPointerHit = null;
      if (els.mapViewport.hasPointerCapture(event.pointerId)) {
        els.mapViewport.releasePointerCapture(event.pointerId);
      }
      if (Math.hypot(event.clientX - candidate.x, event.clientY - candidate.y) < 8) {
        selectSpawn(candidate.index);
      }
      return;
    }
    state.dragging = false;
    els.mapViewport.classList.remove("dragging");
    els.mapViewport.releasePointerCapture(event.pointerId);
  });
  els.mapViewport.addEventListener("pointerleave", () => {
    state.dragging = false;
    els.mapViewport.classList.remove("dragging");
    if (state.hoveredCanvasIndex !== null) {
      state.hoveredCanvasIndex = null;
      scheduleCanvasRender();
    }
    hideCanvasTooltip();
  });
  window.addEventListener("resize", fitMap);
}

async function init() {
  bindEvents();
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
  els.appVersion.textContent = APP_VERSION;
  renderMapTabs();
  switchMap(state.activeMapId);
}

init().catch((error) => {
  els.mapMeta.textContent = "Load failed";
  els.selectionDetail.textContent = error.message;
  console.error(error);
});
