(() => {
  "use strict";

  const ANIILOG_URL = "./data/aniilog_data.json?v=20260721-skill-behavior-v001";
  const ITEMLOG_URL = "./data/itemlog_data.json?v=20260721-item-enrichment-v001";
  const MECHANICS_URL = "./data/team_builder_mechanics.json?v=20260723-reviewed-v001";
  const STORAGE_KEY = "minmax-aniipedia:team-builder:v1";
  const TEAM_SHARE_PARAM = "team";
  const TEAM_SHARE_VERSION = 1;
  const SHORT_SHARE_CODE_PATTERN = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{8}$/;
  const SHARE_API_URL = String(window.ANIIPEDIA_CONFIG?.shareApiUrl || "").replace(/\/+$/, "");
  const INITIAL_URL_PARAMS = new URLSearchParams(window.location.search);
  const REQUESTED_TEAM_SHARE_ID = SHORT_SHARE_CODE_PATTERN.test(INITIAL_URL_PARAMS.get(TEAM_SHARE_PARAM) || "")
    ? INITIAL_URL_PARAMS.get(TEAM_SHARE_PARAM)
    : "";
  const TEAM_SIZE = 4;
  const MAX_ACTIVE_SKILLS = 2;
  const MIN_ANIIMO_LEVEL = 1;
  const MAX_ANIIMO_LEVEL = 60;
  const MAX_POTENTIAL_PER_STAT = 24;
  const MAX_AWAKENING_BONUS = 24;
  const POTENTIAL_MILESTONE_SIZE = 5;
  const POTENTIAL_MILESTONE_BONUS = 0.06;
  const BUFF_PATTERN = /\b(increas|boost|amplif|bonus|restore|shield|resist|siphon|damage dealt|critical|break efficiency|invincible)/i;
  const STAT_ORDER = ["HP", "Attack", "Magic Attack", "Break", "Defense", "Magic Defense", "EP Regen"];
  const STAT_ALIASES = Object.freeze({
    HP: "HP",
    ATK: "Attack",
    Attack: "Attack",
    "Magic Attack": "Magic Attack",
    BREAK: "Break",
    Break: "Break",
    "P.DEF": "Defense",
    Defense: "Defense",
    "M.DEF": "Magic Defense",
    "Magic Defense": "Magic Defense",
    REGEN: "EP Regen",
    Regen: "EP Regen",
    "EP Regen": "EP Regen",
  });
  const LEVEL_STAT_CURVES = Object.freeze({
    HP: Object.freeze({ offset: 20, divisor: 120, scale: 20.4 }),
    Attack: Object.freeze({ offset: 0, divisor: 90, scale: 0.51 }),
    "Magic Attack": Object.freeze({ offset: 0, divisor: 90, scale: 0.51 }),
    Break: Object.freeze({ offset: 0, divisor: 80, scale: 0.51 }),
    Defense: Object.freeze({ offset: 0, divisor: 120, scale: 1.02 }),
    "Magic Defense": Object.freeze({ offset: 0, divisor: 120, scale: 1.02 }),
    "EP Regen": Object.freeze({ offset: 0, divisor: 50, scale: 0.51 }),
  });
  const POTENTIAL_STATS = Object.freeze([
    Object.freeze({ key: "HP", label: "HP" }),
    Object.freeze({ key: "Attack", label: "ATK" }),
    Object.freeze({ key: "Defense", label: "P.DEF" }),
    Object.freeze({ key: "EP Regen", label: "REGEN" }),
    Object.freeze({ key: "Magic Defense", label: "M.DEF" }),
    Object.freeze({ key: "Break", label: "BREAK" }),
  ]);
  const PERSONALITY_OPTIONS = Object.freeze([
    Object.freeze({
      id: "clingy",
      label: "Clingy",
      effects: Object.freeze([
        Object.freeze({ label: "Attack", value: 0.02 }),
        Object.freeze({ label: "Break", value: 0.05 }),
      ]),
    }),
    Object.freeze({
      id: "instinctive",
      label: "Instinctive",
      effects: Object.freeze([Object.freeze({ label: "EP Regen", value: 0.05 })]),
    }),
    Object.freeze({
      id: "practical",
      label: "Practical",
      effects: Object.freeze([Object.freeze({ label: "Damage Amp", value: 0.04 })]),
    }),
    Object.freeze({
      id: "perspicacious",
      label: "Perspicacious",
      effects: Object.freeze([Object.freeze({ label: "Critical Rate", value: 0.04 })]),
    }),
    Object.freeze({
      id: "aloof",
      label: "Aloof",
      effects: Object.freeze([Object.freeze({ label: "Defense", value: 0.06 })]),
    }),
    Object.freeze({
      id: "faithful",
      label: "Faithful",
      effects: Object.freeze([Object.freeze({ label: "Magic Defense", value: 0.06 })]),
    }),
    Object.freeze({
      id: "obedient",
      label: "Obedient",
      effects: Object.freeze([Object.freeze({ label: "HP", value: 0.04 })]),
    }),
    Object.freeze({
      id: "spontaneous",
      label: "Spontaneous",
      effects: Object.freeze([Object.freeze({ label: "Damage Reduction", value: 0.04 })]),
    }),
  ]);
  const MAX_PERSONALITY_TRAITS = 4;

  let sidebar = null;
  let panel = null;
  let aniilog = null;
  let itemlog = null;
  let mechanics = null;
  let loadPromise = null;
  let loadError = "";
  let requestedTeamShareLoaded = false;
  let shareBusy = false;
  let shareStatus = "";
  let model = loadModel();

  function defaultMember() {
    return {
      aniimoId: "",
      level: MAX_ANIIMO_LEVEL,
      stage: 7,
      activeSkills: ["", ""],
      switchSkill: "",
      personalities: [],
      potentials: Object.fromEntries(POTENTIAL_STATS.map((stat) => [stat.key, 0])),
      awakeningBonus: 0,
      carriedItemId: "",
      runes: {},
    };
  }

  function defaultModel() {
    return {
      mode: "standard",
      activeSlot: 0,
      members: Array.from({ length: TEAM_SIZE }, defaultMember),
      scenarioToggles: {},
    };
  }

  function normalizeMember(value) {
    const base = defaultMember();
    const activeSkills = Array.isArray(value?.activeSkills)
      ? value.activeSkills.slice(0, MAX_ACTIVE_SKILLS).map((skill) => String(skill || ""))
      : base.activeSkills;
    while (activeSkills.length < MAX_ACTIVE_SKILLS) activeSkills.push("");
    const personalities = Array.isArray(value?.personalities)
      ? [...new Set(value.personalities.map((trait) => String(trait || "")).filter(Boolean))]
        .filter((trait) => PERSONALITY_OPTIONS.some((option) => option.id === trait))
        .slice(0, MAX_PERSONALITY_TRAITS)
      : [];
    const potentials = Object.fromEntries(POTENTIAL_STATS.map((stat) => {
      const amount = Number(value?.potentials?.[stat.key]);
      return [stat.key, Math.min(MAX_POTENTIAL_PER_STAT, Math.max(0, Number.isFinite(amount) ? Math.round(amount) : 0))];
    }));
    return {
      ...base,
      aniimoId: String(value?.aniimoId || ""),
      level: Math.min(MAX_ANIIMO_LEVEL, Math.max(MIN_ANIIMO_LEVEL, Math.round(Number(value?.level) || MAX_ANIIMO_LEVEL))),
      stage: Math.min(7, Math.max(1, Number(value?.stage) || 7)),
      activeSkills,
      switchSkill: String(value?.switchSkill || ""),
      personalities,
      potentials,
      awakeningBonus: Math.min(
        MAX_AWAKENING_BONUS,
        Math.max(0, Math.round(Number(value?.awakeningBonus) || 0)),
      ),
      carriedItemId: String(value?.carriedItemId || ""),
      runes: value?.runes && typeof value.runes === "object" ? value.runes : {},
    };
  }

  function loadModel() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
      return normalizeModel(saved);
    } catch {
      return defaultModel();
    }
  }

  function normalizeRunes(value) {
    if (Array.isArray(value)) {
      return Object.fromEntries(value.slice(0, 6).flatMap((slot) => {
        const position = String(slot?.position || "");
        if (!position) return [];
        return [[position, {
          itemId: String(slot?.itemId || ""),
          rolls: Array.isArray(slot?.rolls)
            ? slot.rolls.slice(0, 3).map((roll) => ({
              attributeId: String(roll?.attributeId || ""),
              mode: roll?.mode === "minimum" ? "minimum" : "perfect",
            }))
            : [],
        }]];
      }));
    }
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function normalizeModel(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return defaultModel();
    const members = Array.isArray(value.members)
      ? value.members.slice(0, TEAM_SIZE).map((member) => normalizeMember({
        ...member,
        runes: normalizeRunes(member?.runes),
      }))
      : [];
    while (members.length < TEAM_SIZE) members.push(defaultMember());
    const scenarioToggles = value.scenarioToggles && typeof value.scenarioToggles === "object"
      && !Array.isArray(value.scenarioToggles)
      ? Object.fromEntries(Object.entries(value.scenarioToggles)
        .slice(0, 500)
        .map(([key, enabled]) => [String(key), Boolean(enabled)]))
      : {};
    return {
      mode: value.mode === "coop" ? "coop" : "standard",
      activeSlot: Math.min(TEAM_SIZE - 1, Math.max(0, Number(value.activeSlot) || 0)),
      members,
      scenarioToggles,
    };
  }

  function persist() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(model));
    } catch {
      // The builder remains usable for the current visit if storage is unavailable.
    }
  }

  function teamShareSelection() {
    return {
      t: "team",
      v: TEAM_SHARE_VERSION,
      mode: model.mode,
      activeSlot: model.activeSlot,
      members: model.members.map((member) => ({
        aniimoId: member.aniimoId,
        level: member.level,
        stage: member.stage,
        activeSkills: member.activeSkills,
        switchSkill: member.switchSkill,
        personalities: member.personalities,
        potentials: member.potentials,
        awakeningBonus: member.awakeningBonus,
        carriedItemId: member.carriedItemId,
        runes: Object.entries(member.runes || {}).map(([position, selection]) => ({
          position,
          itemId: String(selection?.itemId || ""),
          rolls: Array.isArray(selection?.rolls)
            ? selection.rolls.map((roll) => ({
              attributeId: String(roll?.attributeId || ""),
              mode: roll?.mode === "minimum" ? "minimum" : "perfect",
            }))
            : [],
        })),
      })),
      scenarioToggles: model.scenarioToggles,
    };
  }

  async function copyText(value) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const input = document.createElement("textarea");
    input.value = value;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }

  async function shareTeam() {
    if (shareBusy) return;
    if (!SHARE_API_URL) {
      shareStatus = "Team sharing is not configured.";
      render();
      return;
    }
    shareBusy = true;
    shareStatus = "Creating share link…";
    render();
    try {
      const response = await fetch(`${SHARE_API_URL}/v1/shares`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ version: TEAM_SHARE_VERSION, selection: teamShareSelection() }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !SHORT_SHARE_CODE_PATTERN.test(body?.id || "")) {
        throw new Error(body?.error || "Could not create the team link");
      }
      const url = new URL(window.location.href);
      url.search = "";
      url.searchParams.set(TEAM_SHARE_PARAM, body.id);
      url.hash = "";
      await copyText(url.toString());
      shareStatus = "Team link copied.";
    } catch (error) {
      shareStatus = error instanceof Error ? error.message : String(error);
    } finally {
      shareBusy = false;
      render();
    }
  }

  async function loadRequestedTeamShare() {
    if (requestedTeamShareLoaded || !REQUESTED_TEAM_SHARE_ID) return;
    requestedTeamShareLoaded = true;
    if (!SHARE_API_URL) {
      shareStatus = "This team link cannot be loaded because sharing is not configured.";
      return;
    }
    try {
      const response = await fetch(`${SHARE_API_URL}/v1/shares/${REQUESTED_TEAM_SHARE_ID}`, {
        headers: { accept: "application/json" },
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body?.error || "Could not load the shared team");
      if (body?.selection?.t !== "team" || Number(body.selection.v) !== TEAM_SHARE_VERSION) {
        throw new Error("Shared team data is invalid");
      }
      model = normalizeModel(body.selection);
      persist();
      shareStatus = "Shared team loaded.";
    } catch (error) {
      shareStatus = error instanceof Error ? error.message : String(error);
    }
  }

  function translate(value) {
    return window.AniipediaI18n?.translate(value) || String(value || "");
  }

  function el(tag, className = "", text = "") {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== "") node.textContent = text;
    return node;
  }

  function button(text, className, onClick) {
    const node = el("button", className, text);
    node.type = "button";
    node.addEventListener("click", onClick);
    return node;
  }

  function selectControl(labelText, options, value, onChange, className = "") {
    const label = el("label", `team-field ${className}`.trim());
    const caption = el("span", "team-field-label", labelText);
    const select = el("select", "team-select");
    options.forEach((option) => {
      const item = document.createElement("option");
      item.value = option.value;
      item.textContent = option.label;
      item.disabled = Boolean(option.disabled);
      item.selected = String(option.value) === String(value || "");
      select.append(item);
    });
    select.addEventListener("change", () => onChange(select.value));
    label.append(caption, select);
    return label;
  }

  function numberControl(labelText, value, minimum, maximum, onChange, className = "") {
    const label = el("label", `team-field ${className}`.trim());
    const caption = el("span", "team-field-label", labelText);
    const input = el("input", "team-number-input");
    input.type = "number";
    input.min = String(minimum);
    input.max = String(maximum);
    input.step = "1";
    input.inputMode = "numeric";
    input.value = String(value);
    input.addEventListener("change", () => {
      const next = Math.min(maximum, Math.max(minimum, Math.round(Number(input.value) || 0)));
      input.value = String(next);
      onChange(next);
    });
    label.append(caption, input);
    return label;
  }

  function naturalCompare(left, right) {
    return String(left || "").localeCompare(String(right || ""), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }

  function aniimoEntries() {
    return Array.isArray(aniilog?.entries) ? aniilog.entries : [];
  }

  function carriedItems() {
    return (itemlog?.entries || [])
      .filter((entry) => entry?.catalog_category === "Carried Item" && entry?.rune_socket_layout)
      .sort((left, right) => naturalCompare(left.name, right.name) || naturalCompare(left.quality, right.quality));
  }

  function runeItems() {
    return (itemlog?.entries || [])
      .filter((entry) => entry?.rune_details)
      .sort((left, right) => {
        const qualityDifference = Number(left?.rune_details?.tier?.quality || 0) - Number(right?.rune_details?.tier?.quality || 0);
        return qualityDifference || naturalCompare(left.name, right.name);
      });
  }

  function aniimoFor(member) {
    return aniimoEntries().find((entry) => entry.id === member?.aniimoId) || null;
  }

  function carriedItemFor(member) {
    return carriedItems().find((entry) => entry.id === member?.carriedItemId) || null;
  }

  function skillKey(skill) {
    return String(skill?.localization_uids?.name || skill?.name || "");
  }

  function combatSkills(entry) {
    return (entry?.skills || []).filter((skill) => skill?.group === "Combat");
  }

  function coreSkills(entry) {
    return combatSkills(entry).filter((skill) => skill?.core);
  }

  function skillFor(entry, key) {
    return combatSkills(entry).find((skill) => skillKey(skill) === String(key || "")) || null;
  }

  function mechanicsFor(entry, skill, section = "skills") {
    const formId = String(entry?.form_id || entry?.id || "").replace(/^aniimo:/, "");
    const name = String(skill?.name || "");
    if (!formId || !name) return null;
    return mechanics?.entries?.[`${formId}|${section}|${name}`] || null;
  }

  function personalityFor(id) {
    return PERSONALITY_OPTIONS.find((option) => option.id === String(id || "")) || null;
  }

  function localizedAniimoLabel(entry) {
    if (!entry) return translate("Empty slot");
    const name = translate(entry.name);
    const form = translate(entry.form_label || "Basic");
    return `${name} — ${form}`;
  }

  function aniimoOptions() {
    return [
      { value: "", label: translate("Choose an Aniimo") },
      ...aniimoEntries()
        .slice()
        .sort((left, right) => naturalCompare(left.name, right.name) || naturalCompare(left.form_label, right.form_label))
        .map((entry) => ({ value: entry.id, label: localizedAniimoLabel(entry) })),
    ];
  }

  function resetMemberLoadout(member, entry) {
    const skills = combatSkills(entry);
    const nonCore = skills.filter((skill) => !skill.core);
    const defaults = [...nonCore, ...skills].slice(0, MAX_ACTIVE_SKILLS).map(skillKey);
    while (defaults.length < MAX_ACTIVE_SKILLS) defaults.push("");
    member.activeSkills = defaults;
    member.switchSkill = coreSkills(entry)
      .map(skillKey)
      .find((key) => !defaults.includes(key)) || "";
    member.personalities = [];
    member.level = MAX_ANIIMO_LEVEL;
    member.stage = 7;
    member.carriedItemId = "";
    member.runes = {};
  }

  function validateMember(member) {
    const entry = aniimoFor(member);
    if (!entry) {
      Object.assign(member, defaultMember(), { aniimoId: member.aniimoId });
      return;
    }
    const keys = new Set(combatSkills(entry).map(skillKey));
    const seen = new Set();
    member.activeSkills = member.activeSkills.map((key) => {
      if (!keys.has(key) || seen.has(key)) return "";
      seen.add(key);
      return key;
    });
    const allowedSwitch = new Set(coreSkills(entry).map(skillKey));
    if (!allowedSwitch.has(member.switchSkill) || seen.has(member.switchSkill)) member.switchSkill = "";
    member.stage = Math.min(member.stage, maxStageForLevel(member.level));
    const item = carriedItemFor(member);
    if (!item) {
      member.carriedItemId = "";
      member.runes = {};
    }
  }

  async function ensureData() {
    if (aniilog && itemlog && mechanics) return;
    if (loadPromise) return loadPromise;
    loadPromise = Promise.all([
      fetch(ANIILOG_URL).then((response) => {
        if (!response.ok) throw new Error("Could not load Aniimo data");
        return response.json();
      }),
      fetch(ITEMLOG_URL).then((response) => {
        if (!response.ok) throw new Error("Could not load item data");
        return response.json();
      }),
      fetch(MECHANICS_URL).then((response) => {
        if (!response.ok) throw new Error("Could not load reviewed skill mechanics");
        return response.json();
      }),
    ]).then(([aniimoPayload, itemPayload, mechanicsPayload]) => {
      if (
        !Array.isArray(aniimoPayload?.entries)
        || !Array.isArray(itemPayload?.entries)
        || !mechanicsPayload?.entries
        || typeof mechanicsPayload.entries !== "object"
      ) {
        throw new Error("Team Builder data has an invalid format");
      }
      aniilog = aniimoPayload;
      itemlog = itemPayload;
      mechanics = mechanicsPayload;
      window.AniipediaI18n?.registerDisplay(aniilog.localizations);
      model.members.forEach(validateMember);
      loadError = "";
    }).catch((error) => {
      loadError = error instanceof Error ? error.message : String(error);
    }).finally(() => {
      loadPromise = null;
    });
    return loadPromise;
  }

  function setMode(mode) {
    model.mode = mode === "coop" ? "coop" : "standard";
    persist();
    render();
  }

  function renderModeSwitch(compact = false) {
    const group = el("div", compact ? "team-mode-switch team-mode-switch--compact" : "team-mode-switch");
    group.setAttribute("role", "tablist");
    [
      { id: "standard", label: "Standard" },
      { id: "coop", label: "Co-op" },
    ].forEach((mode) => {
      const control = button(mode.label, "team-mode-button", () => setMode(mode.id));
      control.setAttribute("aria-selected", String(model.mode === mode.id));
      control.setAttribute("role", "tab");
      group.append(control);
    });
    return group;
  }

  function slotRole(index) {
    if (model.mode !== "coop") return `${translate("Team slot")} ${index + 1}`;
    return index === 0 ? translate("Main Aniimo") : `${translate("Core skill ally")} ${index}`;
  }

  function renderSidebarSlot(member, index) {
    const entry = aniimoFor(member);
    const card = el("article", "team-sidebar-slot");
    if (model.activeSlot === index) card.classList.add("is-active");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", String(model.activeSlot === index));
    const activate = () => {
      model.activeSlot = index;
      persist();
      render();
    };
    card.addEventListener("click", activate);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      activate();
    });

    const header = el("div", "team-sidebar-slot-header");
    const role = el("span", "team-sidebar-slot-role", slotRole(index));
    const stage = el(
      "span",
      "team-sidebar-slot-stage",
      entry ? `${translate("Level")} ${member.level} · ${translate("Tier")} ${member.stage}` : "",
    );
    header.append(role, stage);

    const identity = el("div", "team-sidebar-slot-identity");
    if (entry?.icon) {
      const image = el("img", "team-sidebar-slot-icon");
      image.src = entry.icon;
      image.alt = "";
      identity.append(image);
    } else {
      identity.append(el("span", "team-sidebar-slot-icon team-sidebar-slot-icon--empty", String(index + 1)));
    }
    const copy = el("div", "team-sidebar-slot-copy");
    copy.append(
      el("strong", "", entry ? translate(entry.name) : translate("Empty slot")),
      el("small", "", entry ? translate(entry.form_label || "Basic") : translate("Choose an Aniimo below")),
    );
    identity.append(copy);

    const select = el("select", "team-sidebar-select");
    aniimoOptions().forEach((option) => {
      const item = document.createElement("option");
      item.value = option.value;
      item.textContent = option.label;
      item.selected = option.value === member.aniimoId;
      select.append(item);
    });
    select.setAttribute("aria-label", slotRole(index));
    select.addEventListener("click", (event) => event.stopPropagation());
    select.addEventListener("change", (event) => {
      event.stopPropagation();
      member.aniimoId = select.value;
      resetMemberLoadout(member, aniimoFor(member));
      model.activeSlot = index;
      persist();
      render();
    });
    card.append(header, identity, select);
    return card;
  }

  function renderSidebar() {
    sidebar.textContent = "";
    const heading = el("div", "team-sidebar-heading");
    heading.append(el("h2", "", "Team Builder"));
    const reset = button("Clear", "team-clear-button", () => {
      if (!window.confirm(translate("Clear this saved team?"))) return;
      model = defaultModel();
      persist();
      render();
    });
    heading.append(reset);
    sidebar.append(heading, renderModeSwitch(true));
    const description = el(
      "p",
      "team-sidebar-description",
      model.mode === "coop"
        ? "Control one main Aniimo and bring the Core skills of three allies."
        : "Build a four-Aniimo team with two active skills and an optional Core switch-skill each.",
    );
    sidebar.append(description);
    const slots = el("div", "team-sidebar-slots");
    model.members.forEach((member, index) => slots.append(renderSidebarSlot(member, index)));
    const shareWrap = el("div", "team-share-wrap");
    const shareButton = button(shareBusy ? "Creating share link…" : "Share team", "team-share-button", shareTeam);
    shareButton.disabled = shareBusy;
    shareWrap.append(shareButton);
    if (shareStatus) shareWrap.append(el("p", "team-share-status", shareStatus));
    sidebar.append(slots, shareWrap);
  }

  function renderTeamOverview() {
    const section = el("section", "team-overview");
    const heading = el("div", "team-section-heading");
    heading.append(el("div", "", "Team overview"), el("small", "", model.mode === "coop" ? "1 main + 3 Core allies" : "Up to 4 Aniimo"));
    section.append(heading);
    const grid = el("div", "team-overview-grid");
    model.members.forEach((member, index) => {
      const entry = aniimoFor(member);
      const card = button("", "team-overview-card", () => {
        model.activeSlot = index;
        persist();
        render();
      });
      if (model.activeSlot === index) card.classList.add("is-active");
      if (entry?.icon) {
        const image = el("img", "team-overview-icon");
        image.src = entry.icon;
        image.alt = "";
        card.append(image);
      } else {
        card.append(el("span", "team-overview-icon team-overview-icon--empty", "+"));
      }
      const copy = el("span", "team-overview-copy");
      copy.append(
        el("small", "", slotRole(index)),
        el("strong", "", entry ? translate(entry.name) : translate("Empty slot")),
        el("span", "", entry ? translate(entry.form_label || "Basic") : translate("Select a team member")),
      );
      card.append(copy);
      grid.append(card);
    });
    section.append(grid);
    return section;
  }

  function renderSkillLoadout(member, entry, supportOnly) {
    const section = el("section", "team-config-section");
    const heading = el("div", "team-section-heading");
    heading.append(el("div", "", supportOnly ? "Co-op Core access" : "Skill loadout"));
    section.append(heading);
    const skills = combatSkills(entry);
    const cores = coreSkills(entry);

    if (supportOnly) {
      if (!cores.length) {
        section.append(el("p", "team-empty-copy", "This Aniimo has no Core skill in the current data."));
        return section;
      }
      cores.forEach((skill) => section.append(renderSkillSummary(skill, "Core skill", entry)));
      return section;
    }

    const grid = el("div", "team-field-grid");
    for (let position = 0; position < MAX_ACTIVE_SKILLS; position += 1) {
      const otherPosition = position === 0 ? 1 : 0;
      const options = [
        { value: "", label: "Choose a skill" },
        ...skills.map((skill) => ({
          value: skillKey(skill),
          label: `${skill.core ? `${translate("Core")} · ` : ""}${translate(skill.name)}`,
          disabled: member.activeSkills[otherPosition] === skillKey(skill),
        })),
      ];
      grid.append(selectControl(`${translate("Active skill")} ${position + 1}`, options, member.activeSkills[position], (value) => {
        member.activeSkills[position] = value;
        if (member.switchSkill === value) member.switchSkill = "";
        validateMember(member);
        persist();
        render();
      }));
    }
    const availableCore = cores.filter((skill) => !member.activeSkills.includes(skillKey(skill)));
    const switchOptions = [
      { value: "", label: cores.length ? "No switch-skill" : "No Core skill available" },
      ...availableCore.map((skill) => ({ value: skillKey(skill), label: translate(skill.name) })),
    ];
    grid.append(selectControl("Switch-skill (Core)", switchOptions, member.switchSkill, (value) => {
      member.switchSkill = value;
      validateMember(member);
      persist();
      render();
    }, "team-field--wide"));
    section.append(grid);

    const selected = [...member.activeSkills, member.switchSkill]
      .filter(Boolean)
      .map((key) => skillFor(entry, key))
      .filter(Boolean);
    if (selected.length) {
      const cards = el("div", "team-skill-cards");
      selected.forEach((skill) => cards.append(renderSkillSummary(
        skill,
        member.switchSkill === skillKey(skill) ? "Switch-skill" : "Active",
        entry,
      )));
      section.append(cards);
    }
    return section;
  }

  function coefficientDisplay(coefficient) {
    const values = Array.isArray(coefficient?.values)
      ? coefficient.values.map(Number).filter(Number.isFinite)
      : [];
    if (!values.length) return "";
    const format = (value) => coefficient.display === "percent"
      ? formatValue(value, true)
      : `${formatValue(value, false)}x`;
    return [...new Set(values)].map(format).join(" / ");
  }

  function renderReviewedMechanics(entry, skill) {
    const reviewed = mechanicsFor(entry, skill);
    const section = el("div", "team-skill-mechanics");
    if (!reviewed) {
      section.append(el(
        "p",
        "team-skill-caveat",
        "No reviewed execution record is linked to this skill yet. The game description remains available below.",
      ));
      return section;
    }

    const tags = el("div", "team-skill-mechanics-tags");
    (reviewed.roles || []).forEach((role) => tags.append(el("span", "team-pill", role)));
    (reviewed.targets || []).forEach((target) => tags.append(el("span", "team-pill team-pill--scope", target)));
    if (tags.childElementCount) section.append(tags);

    const summaries = el("ul", "team-skill-mechanics-summary");
    (reviewed.summaries || []).forEach((summary) => summaries.append(el("li", "", summary)));
    if (summaries.childElementCount) section.append(summaries);

    if ((reviewed.operations || []).length) {
      const operations = el("div", "team-skill-operations");
      operations.append(el("strong", "", "Execution operations"));
      (reviewed.operations || []).forEach((operation) => {
        const counts = [...new Set(operation.counts || [])].join(" / ");
        operations.append(el(
          "span",
          "team-skill-operation",
          counts ? `${operation.label}: ${counts}` : operation.label,
        ));
      });
      section.append(operations);
    }

    if ((reviewed.coefficients || []).length) {
      const coefficients = el("dl", "team-skill-coefficients");
      (reviewed.coefficients || []).forEach((coefficient) => {
        const value = coefficientDisplay(coefficient);
        if (!value) return;
        coefficients.append(el("dt", "", coefficient.label), el("dd", "", value));
      });
      if (coefficients.childElementCount) section.append(coefficients);
    }

    if (Number(reviewed.variant_count) > 1) {
      section.append(el(
        "p",
        "team-skill-variant-note",
        `${reviewed.variant_count} execution variants are linked to this display skill. Values above include every confirmed variant.`,
      ));
    }
    return section;
  }

  function renderSkillSummary(skill, slotLabel, entry) {
    const card = el("article", "team-skill-summary");
    if (skill?.icon) {
      const icon = el("img", "team-skill-icon");
      icon.src = skill.icon;
      icon.alt = "";
      card.append(icon);
    }
    const copy = el("div", "team-skill-copy");
    const top = el("div", "team-skill-top");
    top.append(el("strong", "", translate(skill?.name || "Skill")), el("span", "team-pill", slotLabel));
    copy.append(top);
    const meta = [
      Number.isFinite(Number(skill?.combat?.might)) ? `${translate("Might")} ${skill.combat.might}` : "",
      Number.isFinite(Number(skill?.combat?.ep_cost)) ? `${translate("EP Cost")} ${skill.combat.ep_cost}` : "",
      Number.isFinite(Number(skill?.combat?.cooldown)) ? `${translate("Cooldown")} ${skill.combat.cooldown}s` : "",
    ].filter(Boolean).join(" · ");
    copy.append(el("small", "", meta));
    if (skill?.behavior?.team_role) {
      const scope = Array.isArray(skill.behavior.target_scope)
        ? skill.behavior.target_scope.join(" + ")
        : "";
      copy.append(el(
        "small",
        "team-skill-behavior",
        [skill.behavior.team_role, scope].filter(Boolean).join(" · "),
      ));
    }
    copy.append(renderReviewedMechanics(entry, skill));
    if (skill?.description) {
      const description = el("details", "team-skill-description");
      description.append(
        el("summary", "", "Game description"),
        el("p", "", translate(skill.description)),
      );
      copy.append(description);
    }
    card.append(copy);
    return card;
  }

  function renderMemberIdentity(member, entry, index) {
    const section = el("section", "team-member-identity");
    if (entry?.icon) {
      const image = el("img", "team-member-icon");
      image.src = entry.icon;
      image.alt = "";
      section.append(image);
    }
    const copy = el("div", "team-member-copy");
    copy.append(
      el("p", "team-eyebrow", slotRole(index)),
      el("h2", "", translate(entry.name)),
      el("p", "team-member-meta", `${translate(entry.form_label || "Basic")} · ${translate(entry.role || "Other")}`),
    );
    section.append(copy);
    const controls = el("div", "team-progression-fields");
    const levelOptions = Array.from({ length: MAX_ANIIMO_LEVEL }, (_, offset) => ({
      value: String(offset + MIN_ANIIMO_LEVEL),
      label: `${translate("Level")} ${offset + MIN_ANIIMO_LEVEL}`,
    }));
    controls.append(selectControl(translate("Aniimo level"), levelOptions, String(member.level), (value) => {
      member.level = Number(value);
      member.stage = Math.min(member.stage, maxStageForLevel(member.level));
      persist();
      render();
    }, "team-level-field"));
    const maxStage = maxStageForLevel(member.level);
    const stageOptions = progressionStages()
      .filter((stage) => Number(stage.stage) <= maxStage)
      .map((stage) => ({
        value: String(stage.stage),
        label: stage.level_gate
          ? `${translate("Tier")} ${stage.stage} · ${translate("Level")} ${stage.level_gate}`
          : `${translate("Tier")} ${stage.stage}`,
      }));
    controls.append(selectControl(translate("Resonance Training"), stageOptions, String(member.stage), (value) => {
      member.stage = Number(value);
      persist();
      render();
    }, "team-stage-field"));
    section.append(controls);
    return section;
  }

  function renderProgressionConfiguration(member) {
    const section = el("section", "team-config-section team-progression-config");
    const heading = el("div", "team-section-heading");
    heading.append(
      el("div", "", "Potential & personality"),
      el("small", "", "Enter the values shown around the Aniimo stat card"),
    );
    section.append(heading);

    const potentialGrid = el("div", "team-potential-grid");
    POTENTIAL_STATS.forEach((stat) => {
      potentialGrid.append(numberControl(
        stat.label,
        member.potentials?.[stat.key] || 0,
        0,
        MAX_POTENTIAL_PER_STAT,
        (value) => {
          member.potentials[stat.key] = value;
          persist();
          render();
        },
        "team-potential-field",
      ));
    });
    section.append(potentialGrid);
    section.append(numberControl(
      "Awakening bonus to all Potentials",
      member.awakeningBonus || 0,
      0,
      MAX_AWAKENING_BONUS,
      (value) => {
        member.awakeningBonus = value;
        persist();
        render();
      },
      "team-awakening-field",
    ));

    const personalityHeading = el("div", "team-subsection-heading");
    personalityHeading.append(
      el("strong", "", "Personality combat bonuses"),
      el("small", "", `${member.personalities.length} / ${MAX_PERSONALITY_TRAITS}`),
    );
    section.append(personalityHeading);
    const personalityGrid = el("div", "team-personality-grid");
    PERSONALITY_OPTIONS.forEach((option) => {
      const selected = member.personalities.includes(option.id);
      const choice = el("label", "team-personality-option");
      if (selected) choice.classList.add("is-selected");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = selected;
      input.disabled = !selected && member.personalities.length >= MAX_PERSONALITY_TRAITS;
      input.addEventListener("change", () => {
        if (input.checked) {
          member.personalities = [...member.personalities, option.id].slice(0, MAX_PERSONALITY_TRAITS);
        } else {
          member.personalities = member.personalities.filter((trait) => trait !== option.id);
        }
        persist();
        render();
      });
      const effects = option.effects.map((effect) => (
        `${translate(effect.label)} +${formatValue(effect.value, true)}`
      )).join(", ");
      const copy = el("span", "team-personality-copy");
      copy.append(el("strong", "", option.label), el("small", "", effects));
      choice.append(input, copy);
      personalityGrid.append(choice);
    });
    section.append(personalityGrid);
    return section;
  }

  function renderEquipment(member) {
    const section = el("section", "team-config-section");
    const heading = el("div", "team-section-heading");
    heading.append(el("div", "", "Carried item & runes"));
    section.append(heading);
    const options = [
      { value: "", label: "No carried item" },
      ...carriedItems().map((entry) => ({
        value: entry.id,
        label: `${translate(entry.name)} · ${translate(entry.quality || "")}`,
      })),
    ];
    section.append(selectControl("Carried item", options, member.carriedItemId, (value) => {
      member.carriedItemId = value;
      member.runes = {};
      persist();
      render();
    }));
    const item = carriedItemFor(member);
    if (!item) return section;

    const effects = el("div", "team-equipment-effects");
    (item.carried_effects?.base_attributes || []).forEach((effect) => effects.append(el("span", "team-pill team-pill--stat", effect)));
    (item.carried_effects?.core_effects || []).forEach((effect) => effects.append(el("span", "team-pill", `${translate("Core")}: ${translate(effect)}`)));
    (item.carried_effects?.advanced_effects || []).forEach((effect) => effects.append(el("span", "team-pill", `${translate("Advanced")}: ${translate(effect)}`)));
    if (effects.childElementCount) section.append(effects);

    const sockets = el("div", "team-rune-sockets");
    const availableSlots = (item.rune_socket_layout?.slots || []).filter((slot) => slot.available_at_this_rarity);
    availableSlots.forEach((slot) => sockets.append(renderRuneSocket(member, slot)));
    if (availableSlots.length) section.append(sockets);
    return section;
  }

  function renderRuneSocket(member, slot) {
    const card = el("article", "team-rune-socket");
    const shapes = new Set((slot.options || []).map((option) => option.id));
    const compatible = runeItems().filter((entry) => shapes.has(entry?.rune_details?.shape?.id));
    const selection = member.runes[String(slot.position)] || { itemId: "", rolls: [] };
    const header = el("div", "team-rune-socket-header");
    header.append(
      el("strong", "", `${translate("Slot")} ${slot.position}`),
      el("span", "team-pill", (slot.options || []).map((option) => `${translate(option.label)} · ${translate(option.role)}`).join(" / ")),
    );
    card.append(header);
    const runeSelect = el("select", "team-select");
    [{ value: "", label: "No rune" }, ...compatible.map((entry) => ({
      value: entry.id,
      label: `${translate(entry.name)} · ${translate(entry.quality)}`,
    }))].forEach((option) => {
      const item = document.createElement("option");
      item.value = option.value;
      item.textContent = option.label;
      item.selected = option.value === selection.itemId;
      runeSelect.append(item);
    });
    runeSelect.addEventListener("change", () => {
      member.runes[String(slot.position)] = { itemId: runeSelect.value, rolls: [] };
      persist();
      render();
    });
    card.append(runeSelect);
    const rune = compatible.find((entry) => entry.id === selection.itemId);
    if (!rune) return card;
    const main = (rune.rune_details?.main_stats || []).map((stat) => `${translate(stat.label)} +${stat.value_label}`).join(" · ");
    card.append(el("p", "team-rune-main", `${translate("Main stat")}: ${main}`));

    const lineCount = Number(rune.rune_details?.secondary_lines || 0);
    for (let index = 0; index < lineCount; index += 1) {
      const current = selection.rolls?.[index] || { attributeId: "", mode: "perfect" };
      const row = el("div", "team-rune-roll-row");
      const rollSelect = el("select", "team-select");
      const used = new Set((selection.rolls || []).filter((_, rollIndex) => rollIndex !== index).map((roll) => String(roll.attributeId)));
      [{ attribute_id: "", label: "No secondary roll", range_label: "" }, ...(rune.rune_details?.secondary_rolls || [])]
        .forEach((roll) => {
          const option = document.createElement("option");
          option.value = String(roll.attribute_id || "");
          option.textContent = roll.attribute_id ? `${translate(roll.label)} · ${roll.range_label}` : roll.label;
          option.disabled = used.has(option.value);
          option.selected = option.value === String(current.attributeId || "");
          rollSelect.append(option);
        });
      rollSelect.setAttribute("aria-label", `${translate("Secondary roll")} ${index + 1}`);
      rollSelect.addEventListener("change", () => {
        selection.rolls ||= [];
        selection.rolls[index] = { attributeId: rollSelect.value, mode: current.mode || "perfect" };
        member.runes[String(slot.position)] = selection;
        persist();
        render();
      });
      const valueMode = el("select", "team-select team-roll-mode");
      [
        { value: "minimum", label: "Minimum" },
        { value: "perfect", label: "Perfect" },
      ].forEach((mode) => {
        const option = document.createElement("option");
        option.value = mode.value;
        option.textContent = mode.label;
        option.selected = mode.value === current.mode;
        valueMode.append(option);
      });
      valueMode.disabled = !current.attributeId;
      valueMode.addEventListener("change", () => {
        selection.rolls ||= [];
        selection.rolls[index] = { attributeId: current.attributeId, mode: valueMode.value };
        member.runes[String(slot.position)] = selection;
        persist();
        render();
      });
      row.append(rollSelect, valueMode);
      card.append(row);
    }
    return card;
  }

  function progressionStages() {
    return Array.isArray(aniilog?.aniimo_progression?.stages)
      ? aniilog.aniimo_progression.stages
      : [];
  }

  function maxStageForLevel(level) {
    const aniimoLevel = Math.min(MAX_ANIIMO_LEVEL, Math.max(MIN_ANIIMO_LEVEL, Number(level) || MAX_ANIIMO_LEVEL));
    return progressionStages().reduce((maximum, stage) => {
      const gate = Number(stage.level_gate || MIN_ANIIMO_LEVEL);
      return gate <= aniimoLevel ? Math.max(maximum, Number(stage.stage) || 1) : maximum;
    }, 1);
  }

  function progressionForStage(stageNumber) {
    const stages = progressionStages();
    const eligible = stages.filter((stage) => Number(stage.stage) <= stageNumber);
    const training = eligible.slice().reverse().find((stage) => Array.isArray(stage.training_steps) && stage.training_steps.length);
    return {
      trainingSteps: training?.training_steps || [],
      bonuses: eligible.map((stage) => stage.stage_bonus).filter(Boolean),
    };
  }

  function addFlat(target, label, value, source) {
    const stat = STAT_ALIASES[label];
    const number = Number(value);
    if (!stat || !Number.isFinite(number)) return false;
    target.flat[stat] = (target.flat[stat] || 0) + number;
    target.sources.push({ stat, value: number, source, layer: "flat" });
    return true;
  }

  function addPostFlat(target, label, value, source) {
    const stat = STAT_ALIASES[label];
    const number = Number(value);
    if (!stat || !Number.isFinite(number)) return false;
    target.postFlat[stat] = (target.postFlat[stat] || 0) + number;
    target.sources.push({ stat, value: number, source, layer: "post-flat" });
    return true;
  }

  function addModifier(target, label, value, isPercent, source) {
    const number = Number(value);
    if (!Number.isFinite(number)) return;
    if (label === "Six Aptitude Stats") {
      target.advanced[label] = (target.advanced[label] || 0) + number;
      return;
    }
    if (!isPercent && addFlat(target, label, value, source)) return;
    const stat = STAT_ALIASES[label];
    if (isPercent && stat) {
      target.percent[stat] = (target.percent[stat] || 0) + number;
      target.sources.push({ stat, value: number, source, layer: "percent" });
      return;
    }
    const key = String(label || "Modifier");
    target.advanced[key] = (target.advanced[key] || 0) + number;
  }

  function projectLevelStat(label, listedValue, level) {
    const curve = LEVEL_STAT_CURVES[label];
    const rating = Number(listedValue);
    const aniimoLevel = Number(level);
    if (!curve || !Number.isFinite(rating) || !Number.isFinite(aniimoLevel)) return rating || 0;
    const levelTerm = (4 * aniimoLevel) + 35;
    return Math.floor(((rating + curve.offset) / curve.divisor) * levelTerm * curve.scale);
  }

  function addLevelBasedCarriedEffects(result, member, carried) {
    (carried?.carried_effects?.core_effects || []).forEach((effect) => {
      const match = String(effect).match(/additional\s+(\d+(?:\.\d+)?)\s+(.+?)\s+for each\s+Level\b/i);
      if (!match) return;
      addPostFlat(result, match[2].trim(), Number(match[1]) * member.level, `${translate(carried.name)} · ${translate("Level scaling")}`);
    });
  }

  function applyTierBonuses(result, bonuses) {
    const groups = [
      { pattern: /^ATK\/BREAK\/HP\s*\+([0-9.]+)(%)?$/i, stats: ["Attack", "Break", "HP"] },
      { pattern: /^REGEN\/P\.?DEF\/M\.?DEF\s*\+([0-9.]+)(%)?$/i, stats: ["EP Regen", "Defense", "Magic Defense"] },
    ];
    bonuses.forEach((bonus) => {
      const potential = String(bonus).match(/^Six Potentials\s*\+([0-9.]+)$/i);
      if (potential) {
        addModifier(result, "Six Aptitude Stats", Number(potential[1]), false, "Tier bonus");
        return;
      }
      for (const group of groups) {
        const match = String(bonus).match(group.pattern);
        if (!match) continue;
        const isPercent = Boolean(match[2]);
        const value = Number(match[1]) / (isPercent ? 100 : 1);
        group.stats.forEach((stat) => addModifier(result, stat, value, isPercent, "Tier bonus"));
        break;
      }
    });
  }

  function applyPotentialBonuses(result, member) {
    const globalBonus = Number(member.awakeningBonus || 0)
      + Number(result.advanced["Six Aptitude Stats"] || 0);
    POTENTIAL_STATS.forEach((stat) => {
      const effective = Number(member.potentials?.[stat.key] || 0) + globalBonus;
      result.effectivePotentials[stat.key] = effective;
      const percent = Math.floor(effective / POTENTIAL_MILESTONE_SIZE) * POTENTIAL_MILESTONE_BONUS;
      if (percent) addModifier(result, stat.key, percent, true, "Potential");
    });
  }

  function applyPersonalityBonuses(result, member) {
    (member.personalities || []).forEach((id) => {
      const option = PERSONALITY_OPTIONS.find((candidate) => candidate.id === id);
      option?.effects.forEach((effect) => {
        addModifier(result, effect.label, effect.value, true, `Personality: ${option.label}`);
      });
    });
  }

  function memberStats(member, entry) {
    const result = {
      listed: {},
      base: {},
      flat: {},
      postFlat: {},
      percent: {},
      advanced: {},
      effectivePotentials: {},
      sources: [],
      bonuses: [],
    };
    (entry?.stats || []).forEach((stat) => {
      result.listed[stat.label] = Number(stat.value || 0);
      result.base[stat.label] = projectLevelStat(stat.label, stat.value, member.level);
    });
    const progression = progressionForStage(member.stage);
    progression.trainingSteps.forEach((step) => {
      (step.stat_gains || []).forEach((gain) => addFlat(result, gain.label, gain.value, `${translate("Training level")} ${step.level}`));
    });
    result.bonuses = progression.bonuses;
    applyTierBonuses(result, result.bonuses);

    const carried = carriedItemFor(member);
    (carried?.carried_effects?.base_attributes || []).forEach((effect) => {
      const match = String(effect).match(/^(.+?)\s*([+-]\d+(?:\.\d+)?)(%)?$/);
      if (!match) return;
      addModifier(result, match[1].trim(), Number(match[2]) / (match[3] ? 100 : 1), Boolean(match[3]), translate(carried.name));
    });
    addLevelBasedCarriedEffects(result, member, carried);
    Object.values(member.runes || {}).forEach((selection) => {
      const rune = runeItems().find((entry) => entry.id === selection?.itemId);
      if (!rune) return;
      (rune.rune_details?.main_stats || []).forEach((stat) => {
        addModifier(result, stat.label, stat.value, stat.is_percent, translate(rune.name));
      });
      (selection.rolls || []).forEach((chosen) => {
        const roll = (rune.rune_details?.secondary_rolls || [])
          .find((candidate) => String(candidate.attribute_id) === String(chosen.attributeId));
        if (!roll) return;
        const value = chosen.mode === "minimum" ? roll.minimum : roll.maximum;
        addModifier(result, roll.label, value, roll.is_percent, `${translate(rune.name)} · ${translate("Secondary roll")}`);
      });
    });
    applyPotentialBonuses(result, member);
    applyPersonalityBonuses(result, member);
    return result;
  }

  function renderStats(member, entry) {
    const section = el("section", "team-config-section team-stats-section");
    const heading = el("div", "team-section-heading");
    heading.append(
      el("div", "", translate("Projected build stats")),
      el("small", "", `${translate("Level")} ${member.level} · ${translate("Tier")} ${member.stage}`),
    );
    section.append(heading);
    const stats = memberStats(member, entry);
    const grid = el("div", "team-stat-grid");
    STAT_ORDER.forEach((label) => {
      if (!Object.hasOwn(stats.base, label)) return;
      const base = Number(stats.base[label] || 0);
      const added = Number(stats.flat[label] || 0);
      const percent = Number(stats.percent[label] || 0);
      const post = Number(stats.postFlat[label] || 0);
      const total = (base + added) * (1 + percent) + post;
      const breakdown = [
        formatValue(base, false),
        added ? `+ ${formatValue(added, false)}` : "",
        percent ? `× ${formatValue(1 + percent, false)}` : "",
        post ? `+ ${formatValue(post, false)}` : "",
      ].filter(Boolean).join(" ");
      const card = el("article", "team-stat-card");
      card.append(
        el("span", "team-stat-label", translate(label === "EP Regen" ? "Regen" : label)),
        el("strong", "", formatValue(total, false)),
        el("small", "", added || percent || post ? breakdown : translate("Base value")),
      );
      grid.append(card);
    });
    section.append(grid);
    if (Object.keys(stats.percent).length) {
      const modifiers = el("div", "team-modifier-list");
      Object.entries(stats.percent).forEach(([label, value]) => {
        modifiers.append(el("span", "team-pill team-pill--stat", `${translate(label)} +${formatValue(value, true)}`));
      });
      section.append(modifiers);
    }
    if (stats.bonuses.length) {
      const bonuses = el("div", "team-stage-bonuses");
      bonuses.append(el("strong", "", "Tier bonuses"));
      stats.bonuses.forEach((bonus) => bonuses.append(el("span", "team-pill", bonus)));
      section.append(bonuses);
    }
    const potentials = el("div", "team-potential-summary");
    potentials.append(el("strong", "", "Effective Potentials"));
    POTENTIAL_STATS.forEach((stat) => {
      potentials.append(el(
        "span",
        "team-pill",
        `${stat.label} ${formatValue(stats.effectivePotentials[stat.key], false)}`,
      ));
    });
    section.append(potentials);
    section.append(el(
      "p",
      "team-data-note",
      translate("Projected totals use the verified layer order: level-scaled base and flat training or rune values, additive tier, Potential, and Personality percentages, then per-level carried-item additions. Conditional combat effects and unsupported modifiers remain separate."),
    ));
    return section;
  }

  function formatValue(value, percent) {
    const number = Number(value || 0);
    const display = Number.isInteger(number) ? String(number) : number.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    return percent ? `${(number * 100).toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}%` : display;
  }

  function effectCandidates() {
    const effects = [];
    model.members.forEach((member, index) => {
      const entry = aniimoFor(member);
      if (!entry) return;
      const append = (kind, name, description, activation, behavior = null) => {
        if (!description) return;
        const support = behavior?.main_dps_support || "";
        const appliesToSelectedDps = support === "yes"
          || support === "conditional"
          || (support === "self_only" && index === model.activeSlot);
        if (behavior && !appliesToSelectedDps) return;
        if (!behavior && !BUFF_PATTERN.test(description)) return;
        const id = `${index}:${kind}:${name}`;
        effects.push({
          id,
          slot: index,
          source: translate(entry.name),
          kind,
          name: translate(name),
          description: translate(description),
          activation: behavior?.activation || activation,
          teamRole: behavior?.team_role || "Conditional effect",
          supportNote: behavior?.main_dps_note || "Apply only when the listed effect is active.",
          verification: behavior?.verification_label || "Listed item effect",
        });
      };
      (entry.traits || []).forEach((trait) => append("Trait", trait.name, trait.description, "Passive", trait.behavior));
      if (model.mode === "coop" && index > 0) {
        coreSkills(entry).forEach((skill) => append("Core skill", skill.name, skill.description, "Active", skill.behavior));
      } else {
        [...member.activeSkills, member.switchSkill]
          .filter(Boolean)
          .map((key) => skillFor(entry, key))
          .filter(Boolean)
          .forEach((skill) => append(
            skill.core ? "Core skill" : "Skill",
            skill.name,
            skill.description,
            "Active",
            skill.behavior,
          ));
        (entry.ultimates || []).forEach((skill) => append(
          "Ultimate",
          skill.name,
          skill.description,
          "Active",
          skill.behavior,
        ));
      }
      const carried = carriedItemFor(member);
      (carried?.carried_effects?.core_effects || []).forEach((description, effectIndex) => append("Carried item", carried.name, description, `Core effect ${effectIndex + 1}`));
      (carried?.carried_effects?.advanced_effects || []).forEach((description, effectIndex) => append("Carried item", carried.name, description, `Advanced effect ${effectIndex + 1}`));
    });
    return effects;
  }

  function renderScenario() {
    const section = el("section", "team-scenario");
    const heading = el("div", "team-section-heading");
    const effects = effectCandidates();
    const enabledCount = effects.filter((effect) => model.scenarioToggles[effect.id]).length;
    heading.append(el("div", "", "Team synergy scenario"), el("small", "", `${enabledCount} active`));
    section.append(heading);
    section.append(el(
      "p",
      "team-section-copy",
      "Toggle the buffs and conditional effects that apply to the situation you want to model.",
    ));
    if (!effects.length) {
      section.append(el("p", "team-empty-copy", "Choose team members and skills to reveal supported synergy effects."));
    } else {
      const list = el("div", "team-synergy-list");
      effects.forEach((effect) => {
        const label = el("label", "team-synergy-card");
        if (model.scenarioToggles[effect.id]) label.classList.add("is-enabled");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = Boolean(model.scenarioToggles[effect.id]);
        input.addEventListener("change", () => {
          model.scenarioToggles[effect.id] = input.checked;
          persist();
          render();
        });
        const copy = el("span", "team-synergy-copy");
        const title = el("span", "team-synergy-title");
        title.append(el("strong", "", effect.name), el("small", "", `${effect.source} · ${translate(effect.activation)}`));
        copy.append(
          title,
          el("span", "team-synergy-scope", `${effect.teamRole} · ${effect.verification}`),
          el("span", "team-synergy-description", effect.description),
          el("span", "team-synergy-note", effect.supportNote),
        );
        label.append(input, copy);
        list.append(label);
      });
      section.append(list);
    }

    const damage = el("div", "team-damage-preview");
    damage.append(
      el("p", "team-eyebrow", "Sample damage"),
      el("strong", "", "Combat profile ready"),
      el("p", "", "Attack, skill Might, rune rolls, carried-item effects, and enabled team buffs are preserved in this build. A damage number will be added after the combat formula and enemy mitigation model are verified."),
    );
    section.append(damage);
    return section;
  }

  function renderMemberConfiguration(member, index) {
    const entry = aniimoFor(member);
    if (!entry) {
      const empty = el("section", "team-builder-empty");
      empty.append(el("strong", "", "Choose an Aniimo for this slot"), el("p", "", "Use the team controls on the left to start configuring this position."));
      return empty;
    }
    const wrapper = el("div", "team-member-configuration");
    wrapper.append(renderMemberIdentity(member, entry, index));
    const columns = el("div", "team-builder-columns");
    const config = el("div", "team-builder-main-column");
    const supportOnly = model.mode === "coop" && index > 0;
    config.append(renderSkillLoadout(member, entry, supportOnly), renderProgressionConfiguration(member));
    if (!supportOnly) config.append(renderEquipment(member));
    config.append(renderStats(member, entry));
    columns.append(config, renderScenario());
    wrapper.append(columns);
    return wrapper;
  }

  function renderPanel() {
    panel.textContent = "";
    const header = el("header", "team-builder-header");
    const copy = el("div", "");
    copy.append(
      el("h1", "", "Team Builder"),
      el("p", "", model.mode === "coop"
        ? "Configure one controlled Aniimo and the three Core skills supplied by your personal team."
        : "Configure four Aniimo, their skill loadouts, progression, carried items, runes, and team effects."),
    );
    header.append(copy, renderModeSwitch());
    panel.append(header, renderTeamOverview(), renderMemberConfiguration(model.members[model.activeSlot], model.activeSlot));
  }

  function renderLoading() {
    if (!sidebar || !panel) return;
    sidebar.textContent = "";
    panel.textContent = "";
    sidebar.append(el("p", "team-loading", loadError || "Loading Team Builder…"));
    panel.append(el("p", "team-loading", loadError || "Loading Team Builder…"));
  }

  function render() {
    if (!sidebar || !panel) return;
    if (!aniilog || !itemlog) {
      renderLoading();
      return;
    }
    model.members.forEach(validateMember);
    renderSidebar();
    renderPanel();
    window.AniipediaI18n?.translateTree(sidebar);
    window.AniipediaI18n?.translateTree(panel);
  }

  function mount(elements) {
    sidebar = elements?.sidebar || null;
    panel = elements?.panel || null;
    renderLoading();
  }

  async function show() {
    renderLoading();
    await ensureData();
    await loadRequestedTeamShare();
    render();
  }

  window.AniipediaTeamBuilder = Object.freeze({ mount, show });
})();
