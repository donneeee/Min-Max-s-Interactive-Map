const SHARE_LIFETIME_SECONDS = 3 * 60 * 60;
const MAX_REQUEST_BYTES = 1_500_000;
const MAX_GROUPS = 5_000;
const MAX_SPAWN_IDS = 20_000;
const SHARE_CODE_LENGTH = 8;
const SHARE_CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const SHARE_CODE_PATTERN = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{8}$/;

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}

function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS || "https://donneeee.github.io")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsHeaders(request, env) {
  const origin = request.headers.get("origin") || "";
  const allowLocal = /^http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/.test(origin);
  const allowed = allowLocal || allowedOrigins(env).includes(origin);
  return allowed
    ? {
        "access-control-allow-origin": origin,
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-allow-headers": "content-type",
        "access-control-max-age": "86400",
        vary: "Origin",
      }
    : { vary: "Origin" };
}

function requestOriginAllowed(request, env) {
  const origin = request.headers.get("origin") || "";
  return /^http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/.test(origin)
    || allowedOrigins(env).includes(origin);
}

function normalizeMapSelection(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const mapId = String(value.m || "").trim();
  if (!mapId || mapId.length > 100 || !Array.isArray(value.g) || !value.g.length) return null;

  let spawnIdCount = 0;
  const groups = value.g.slice(0, MAX_GROUPS).flatMap((group) => {
    if (!Array.isArray(group) || group.length < 1 || group.length > 3) return [];
    const itemId = String(group[0] ?? "").trim();
    if (!itemId || itemId.length > 100) return [];
    if (group.length === 1) return [[itemId]];
    if (group[1] !== "s" && group[1] !== "x") return [];
    if (!Array.isArray(group[2])) return [];
    const spawnIds = [];
    for (const rawId of group[2]) {
      if (spawnIdCount >= MAX_SPAWN_IDS) return [];
      const spawnId = String(rawId || "");
      if (!spawnId || spawnId.length > 500) return [];
      spawnIds.push(spawnId);
      spawnIdCount += 1;
    }
    return [[itemId, group[1], spawnIds]];
  });

  if (!groups.length || groups.length !== value.g.length) return null;
  return { m: mapId, g: groups };
}

function clampNumber(value, minimum, maximum, fallback = minimum) {
  const number = Number(value);
  return Math.min(maximum, Math.max(minimum, Number.isFinite(number) ? Math.round(number) : fallback));
}

function limitedString(value, maximum = 128) {
  return String(value || "").slice(0, maximum);
}

function normalizeTeamSelection(value) {
  if (value?.t !== "team" || Number(value?.v) !== 1 || !Array.isArray(value.members)) return null;
  const potentialKeys = ["HP", "Attack", "Defense", "EP Regen", "Magic Defense", "Break"];
  const members = value.members.slice(0, 4).map((member) => {
    const potentials = Object.fromEntries(potentialKeys.map((key) => [
      key,
      clampNumber(member?.potentials?.[key], 0, 24, 0),
    ]));
    const runes = Array.isArray(member?.runes)
      ? member.runes.slice(0, 6).map((rune) => ({
        position: clampNumber(rune?.position, 1, 6, 1),
        itemId: limitedString(rune?.itemId),
        rolls: Array.isArray(rune?.rolls)
          ? rune.rolls.slice(0, 3).map((roll) => ({
            attributeId: limitedString(roll?.attributeId),
            mode: roll?.mode === "minimum" ? "minimum" : "perfect",
          }))
          : [],
      }))
      : [];
    return {
      aniimoId: limitedString(member?.aniimoId),
      level: clampNumber(member?.level, 1, 60, 60),
      stage: clampNumber(member?.stage, 1, 7, 7),
      activeSkills: Array.isArray(member?.activeSkills)
        ? member.activeSkills.slice(0, 2).map((skill) => limitedString(skill, 256))
        : ["", ""],
      switchSkill: limitedString(member?.switchSkill, 256),
      personalities: Array.isArray(member?.personalities)
        ? member.personalities.slice(0, 4).map((trait) => limitedString(trait, 64))
        : [],
      potentials,
      awakeningBonus: clampNumber(member?.awakeningBonus, 0, 24, 0),
      carriedItemId: limitedString(member?.carriedItemId),
      runes,
    };
  });
  if (!members.length) return null;
  const scenarioToggles = value.scenarioToggles && typeof value.scenarioToggles === "object"
    && !Array.isArray(value.scenarioToggles)
    ? Object.fromEntries(Object.entries(value.scenarioToggles)
      .slice(0, 500)
      .map(([key, enabled]) => [limitedString(key, 256), Boolean(enabled)]))
    : {};
  return {
    t: "team",
    v: 1,
    mode: value.mode === "coop" ? "coop" : "standard",
    activeSlot: clampNumber(value.activeSlot, 0, 3, 0),
    members,
    scenarioToggles,
  };
}

function normalizeSelection(value) {
  return value?.t === "team" ? normalizeTeamSelection(value) : normalizeMapSelection(value);
}

function randomShareCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(SHARE_CODE_LENGTH));
  let code = "";
  for (const byte of bytes) code += SHARE_CODE_ALPHABET[byte % SHARE_CODE_ALPHABET.length];
  return code;
}

async function createShare(request, env) {
  const cors = corsHeaders(request, env);
  if (!requestOriginAllowed(request, env)) {
    return jsonResponse({ error: "Origin is not allowed" }, 403, cors);
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return jsonResponse({ error: "Selection is too large" }, 413, cors);
  }

  const requestText = await request.text();
  if (new TextEncoder().encode(requestText).byteLength > MAX_REQUEST_BYTES) {
    return jsonResponse({ error: "Selection is too large" }, 413, cors);
  }

  let body;
  try {
    body = JSON.parse(requestText);
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON" }, 400, cors);
  }
  if (body?.version !== 1) {
    return jsonResponse({ error: "Unsupported share format" }, 400, cors);
  }
  const selection = normalizeSelection(body.selection);
  if (!selection) {
    return jsonResponse({ error: "Shared selection is invalid" }, 400, cors);
  }

  const payload = JSON.stringify(selection);
  const now = Math.floor(Date.now() / 1000);
  const permanent = selection.t === "team";
  const expiresAt = permanent ? 0 : now + SHARE_LIFETIME_SECONDS;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const id = randomShareCode();
    try {
      await env.DB.prepare(
        "INSERT INTO pin_shares (id, payload, created_at, expires_at) VALUES (?, ?, ?, ?)",
      ).bind(id, payload, now, expiresAt).run();
      return jsonResponse({ id, expiresAt: permanent ? null : expiresAt }, 201, cors);
    } catch (error) {
      if (!String(error?.message || error).toLowerCase().includes("unique")) throw error;
    }
  }
  return jsonResponse({ error: "Could not allocate a share code" }, 503, cors);
}

async function readShare(request, env, id) {
  const cors = corsHeaders(request, env);
  if (!SHARE_CODE_PATTERN.test(id)) return jsonResponse({ error: "Share not found" }, 404, cors);
  const row = await env.DB.prepare(
    "SELECT payload, expires_at AS expiresAt FROM pin_shares WHERE id = ? LIMIT 1",
  ).bind(id).first();
  if (!row) return jsonResponse({ error: "Share not found" }, 404, cors);

  const now = Math.floor(Date.now() / 1000);
  if (Number(row.expiresAt) > 0 && Number(row.expiresAt) <= now) {
    await env.DB.prepare("DELETE FROM pin_shares WHERE id = ?").bind(id).run();
    return jsonResponse({ error: "Share expired" }, 410, cors);
  }

  let selection;
  try {
    selection = JSON.parse(row.payload);
  } catch {
    return jsonResponse({ error: "Share data is invalid" }, 500, cors);
  }
  return jsonResponse({ selection, expiresAt: Number(row.expiresAt) || null }, 200, cors);
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const cors = corsHeaders(request, env);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (url.pathname === "/health" && request.method === "GET") {
    return jsonResponse({
      ok: true,
      mapLifetimeSeconds: SHARE_LIFETIME_SECONDS,
      teamLifetimeSeconds: null,
    }, 200, cors);
  }
  if (url.pathname === "/v1/shares" && request.method === "POST") return createShare(request, env);
  const shareMatch = url.pathname.match(/^\/v1\/shares\/([^/]+)$/);
  if (shareMatch && request.method === "GET") return readShare(request, env, shareMatch[1]);
  return jsonResponse({ error: "Not found" }, 404, cors);
}

export default {
  fetch(request, env) {
    return handleRequest(request, env).catch((error) => {
      console.error("share-service request failed", error);
      return jsonResponse({ error: "Service temporarily unavailable" }, 503, corsHeaders(request, env));
    });
  },

  async scheduled(_controller, env) {
    const now = Math.floor(Date.now() / 1000);
    await env.DB.prepare(
      "DELETE FROM pin_shares WHERE id IN (SELECT id FROM pin_shares WHERE expires_at > 0 AND expires_at <= ? LIMIT 5000)",
    ).bind(now).run();
  },
};
