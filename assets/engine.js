// ============================================================
// PLAYTRIX OS · CORE ENGINE
// Clock · Greeting · Themes · Favourites · Backup
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initClockAndDate();
  initGreeting();
  initThemeEngine();
  initConsole();
  initToolsFavourites();
  initBackupEngine();
  // Password page remains UI only for now – no lock enforcement yet.
});

// ------------------------------
// CLOCK & DATE
// ------------------------------

function initClockAndDate() {
  const timeEl = document.getElementById("pt-time");
  const dateEl = document.getElementById("pt-date");
  if (!timeEl || !dateEl) return;

  function update() {
    const now = new Date();

    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    const dateStr = now.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    timeEl.textContent = timeStr;
    dateEl.textContent = dateStr;
  }

  update();
  setInterval(update, 1000);
}

// ------------------------------
// GREETING
// ------------------------------

function initGreeting() {
  const el = document.getElementById("pt-greeting");
  if (!el) return;

  const now = new Date();
  const hour = now.getHours();
  const lang = (document.documentElement.lang || "en").toLowerCase();

  let text;

  if (lang.startsWith("ga")) {
    if (hour < 12) text = "Maidin mhaith";
    else if (hour < 18) text = "Tráthnóna maith";
    else text = "Tráthnóna dea";
  } else {
    if (hour < 12) text = "Good morning";
    else if (hour < 18) text = "Good afternoon";
    else text = "Good evening";
  }

  el.textContent = text;
}

// ------------------------------
// THEME ENGINE (DECADES)
// ------------------------------

const PT_THEMES = [
  "now",
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s"
];

const PT_THEME_LABELS = {
  now: "Now",
  "1950s": "1950s",
  "1960s": "1960s",
  "1970s": "1970s",
  "1980s": "1980s", // no (Neon) – 80s now = Golden Girls pastels
  "1990s": "1990s",
  "2000s": "2000s",
  "2010s": "2010s"
};

function initThemeEngine() {
  const root = document.documentElement;
  const btn = document.getElementById("pt-theme-toggle");
  if (!root || !btn) return;

  const pageDefault = root.getAttribute("data-theme") || "now";
  const saved = window.localStorage.getItem("ptTheme") || pageDefault;

  let currentTheme = PT_THEMES.includes(saved) ? saved : "now";
  applyTheme(root, btn, currentTheme);

  btn.addEventListener("click", () => {
    const idx = PT_THEMES.indexOf(currentTheme);
    const nextTheme = PT_THEMES[(idx + 1) % PT_THEMES.length] || PT_THEMES[0];
    currentTheme = nextTheme;
    window.localStorage.setItem("ptTheme", currentTheme);
    applyTheme(root, btn, currentTheme);
  });
}

function applyTheme(root, btn, themeKey) {
  root.setAttribute("data-theme", themeKey);
  const label = PT_THEME_LABELS[themeKey] || "Theme";
  btn.textContent = label;
}

// ------------------------------
// SIMPLE DATA HELPERS
// ------------------------------

function loadJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : parsed;
  } catch (e) {
    console.warn("PlayTriX loadJSON error for", key, e);
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("PlayTriX saveJSON error for", key, e);
  }
}

function makeId(prefix) {
  return (
    prefix +
    "_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).slice(2, 8)
  );
}

// ------------------------------
// CONSOLE (PILLARS + FAVOURITES)
// ------------------------------

const PT_KEY_CONSOLE_FAVS = "ptFav_console";

function initConsole() {
  const pillarsContainer = document.getElementById("pt-pillars");
  const favsContainer = document.getElementById("pt-favourites");

  if (pillarsContainer) {
    renderPillars(pillarsContainer);
  }

  if (favsContainer) {
    setupFavouritesSection(favsContainer, PT_KEY_CONSOLE_FAVS);
  }
}

function renderPillars(container) {
  const defaultPillars = [
    {
      id: "personal",
      icon: "🏡",
      label: "Personal",
      meta: "Home, health, routines"
    },
    {
      id: "work",
      icon: "💼",
      label: "Work",
      meta: "Job, projects, admin"
    },
    {
      id: "civic",
      icon: "🏛️",
      label: "Civic",
      meta: "Community, parish, society"
    },
    {
      id: "creative",
      icon: "🎨",
      label: "Creative",
      meta: "Writing, art, ideas"
    },
    {
      id: "systems",
      icon: "🛠️",
      label: "Systems",
      meta: "PlayTriX, tools, config"
    }
  ];

  container.innerHTML = "";
  defaultPillars.forEach((pillar) => {
    const tile = document.createElement("article");
    tile.className = "pt-tile";
    tile.dataset.pillarId = pillar.id;

    const icon = document.createElement("div");
    icon.className = "pt-tile-icon";
    icon.textContent = pillar.icon;

    const label = document.createElement("div");
    label.className = "pt-tile-label";
    label.textContent = pillar.label;

    const meta = document.createElement("div");
    meta.className = "pt-tile-meta";
    meta.textContent = pillar.meta;

    tile.appendChild(icon);
    tile.appendChild(label);
    tile.appendChild(meta);
    container.appendChild(tile);
  });
}

// ------------------------------
// FAVOURITES (CONSOLE + TOOLS)
// ------------------------------

function setupFavouritesSection(container, storageKey) {
  const existing = loadJSON(storageKey, []);
  renderFavourites(container, existing, storageKey);
  enableFavouritesDnD(container, storageKey);
}

function renderFavourites(container, favs, storageKey) {
  container.innerHTML = "";

  // Existing favourites
  favs.forEach((fav) => {
    const tile = createFavouriteTile(fav, storageKey, container);
    container.appendChild(tile);
  });

  // Add tile
  const addTile = document.createElement("article");
  addTile.className = "pt-tile";
  addTile.dataset.role = "fav-add";

  const label = document.createElement("div");
  label.className = "pt-tile-label";
  label.textContent = "Add favourite";

  const meta = document.createElement("div");
  meta.className = "pt-tile-meta";
  meta.textContent = "Click to add a site, folder, app or document link.";

  addTile.appendChild(label);
  addTile.appendChild(meta);

  addTile.addEventListener("click", () => {
    addFavouriteFlow(storageKey, container);
  });

  container.appendChild(addTile);

  // If no favourites yet, put a short note tile
  if (!favs || favs.length === 0) {
    const helpTile = document.createElement("article");
    helpTile.className = "pt-tile";
    helpTile.dataset.role = "fav-help";

    const hl = document.createElement("div");
    hl.className = "pt-tile-label";
    hl.textContent = "No favourites yet";

    const hm = document.createElement("div");
    hm.className = "pt-tile-meta";
    hm.textContent =
      "Use “Add favourite” to store the links you use most – email, cloud folders, recipes, dashboards.";

    helpTile.appendChild(hl);
    helpTile.appendChild(hm);

    container.insertBefore(helpTile, addTile);
  }
}

function createFavouriteTile(fav, storageKey, container) {
  const tile = document.createElement("article");
  tile.className = "pt-tile";
  tile.dataset.role = "fav-tile";
  tile.dataset.key = fav.id;
  tile.draggable = true;

  const label = document.createElement("div");
  label.className = "pt-tile-label";
  label.textContent = fav.label || "Favourite";

  const meta = document.createElement("div");
  meta.className = "pt-tile-meta";
  meta.textContent = fav.meta || fav.url || "";

  tile.appendChild(label);
  tile.appendChild(meta);

  // Left click → open link
  tile.addEventListener("click", (e) => {
    // Ignore clicks while dragging
    if (tile.classList.contains("pt-dragging")) return;
    if (!fav.url) return;
    window.open(fav.url, "_blank", "noopener,noreferrer");
  });

  // Right-click → edit / delete
  tile.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    const action = window.prompt(
      "Type:\n- edit  → rename / change link\n- delete → remove this tile\nAnything else to cancel."
    );
    if (!action) return;

    const lc = action.trim().toLowerCase();
    if (lc === "delete") {
      if (!window.confirm(`Remove "${fav.label}"?`)) return;
      const favs = loadJSON(storageKey, []);
      const updated = favs.filter((x) => x.id !== fav.id);
      saveJSON(storageKey, updated);
      renderFavourites(container, updated, storageKey);
      enableFavouritesDnD(container, storageKey);
    } else if (lc === "edit") {
      const newLabel = window.prompt("New name for this tile:", fav.label) || fav.label;
      const newUrl =
        window.prompt("New link (URL) for this tile:", fav.url || "") || fav.url || "";

      const newMeta =
        window.prompt(
          "Short note (optional – appears under the name):",
          fav.meta || ""
        ) || fav.meta || "";

      const favs = loadJSON(storageKey, []);
      const idx = favs.findIndex((x) => x.id === fav.id);
      if (idx !== -1) {
        favs[idx] = { ...favs[idx], label: newLabel, url: newUrl, meta: newMeta };
        saveJSON(storageKey, favs);
        renderFavourites(container, favs, storageKey);
        enableFavouritesDnD(container, storageKey);
      }
    }
  });

  // Drag behaviour wired in enableFavouritesDnD()
  return tile;
}

function addFavouriteFlow(storageKey, container) {
  const label = window.prompt("Name for this favourite (e.g. Email, Recipes, Parish site):");
  if (!label) return;

  const url = window.prompt("Paste the link (URL) to open when you click it:");
  if (!url) return;

  const meta =
    window.prompt(
      "Optional: short description or hint (e.g. OneDrive, Google Docs, Photo album):"
    ) || "";

  const newFav = {
    id: makeId("fav"),
    label: label.trim(),
    url: url.trim(),
    meta: meta.trim()
  };

  const favs = loadJSON(storageKey, []);
  favs.push(newFav);
  saveJSON(storageKey, favs);
  renderFavourites(container, favs, storageKey);
  enableFavouritesDnD(container, storageKey);
}

function enableFavouritesDnD(container, storageKey) {
  const tiles = container.querySelectorAll('.pt-tile[data-role="fav-tile"]');

  tiles.forEach((tile) => {
    tile.addEventListener("dragstart", () => {
      tile.classList.add("pt-dragging");
    });

    tile.addEventListener("dragend", () => {
      tile.classList.remove("pt-dragging");
      // Save new order when drag ends
      persistFavOrder(container, storageKey);
    });
  });

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragging = container.querySelector(".pt-dragging");
    if (!dragging) return;

    const afterElement = getDragAfterElement(container, e.clientY);
    if (afterElement == null) {
      // Insert before the add tile / help tile
      const addTile = container.querySelector('[data-role="fav-add"]');
      container.insertBefore(dragging, addTile);
    } else {
      container.insertBefore(dragging, afterElement);
    }
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll('.pt-tile[data-role="fav-tile"]:not(.pt-dragging)')
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY, element: null }
  ).element;
}

function persistFavOrder(container, storageKey) {
  const favTiles = container.querySelectorAll('.pt-tile[data-role="fav-tile"]');
  const current = loadJSON(storageKey, []);
  const ordered = [];

  favTiles.forEach((tile) => {
    const key = tile.dataset.key;
    const found = current.find((x) => x.id === key);
    if (found) {
      ordered.push(found);
    }
  });

  if (ordered.length === current.length) {
    saveJSON(storageKey, ordered);
  }
}

// ------------------------------
// TOOLS PAGE FAVOURITES
// ------------------------------

function initToolsFavourites() {
  // Favourite websites row
  const favContainer = document.getElementById("pt-tools-favourites");
  if (favContainer) {
    setupFavouritesSection(favContainer, PT_KEY_TOOLS_FAVS);
  }

  // Custom tool groups row
  const groupsContainer = document.getElementById("pt-tool-groups-custom");
  if (groupsContainer) {
    setupFavouritesSection(groupsContainer, PT_KEY_TOOL_GROUPS);
  }
}




// ------------------------------
// BACKUP ENGINE
// ------------------------------
//
// This uses the backup tiles on Settings:
// - "Export setup"
// - "Import setup"
// - "Copy backup as text"
// - "Restore from text"
//
// It backs up only what actually matters right now:
// - theme
// - console favourites
// - tools favourites
// ------------------------------

function initBackupEngine() {
  const isSettingsPage =
    document.location.pathname.toLowerCase().includes("settings");
  if (!isSettingsPage) return;

  const tiles = document.querySelectorAll(".pt-section .pt-tile");
  if (!tiles.length) return;

  tiles.forEach((tile) => {
    const labelEl = tile.querySelector(".pt-tile-label");
    if (!labelEl) return;
    const label = (labelEl.textContent || "").trim().toLowerCase();

    if (label === "export setup") {
      tile.style.cursor = "pointer";
      tile.addEventListener("click", handleExportSetup);
    } else if (label === "import setup") {
      tile.style.cursor = "pointer";
      tile.addEventListener("click", handleImportSetup);
    } else if (label === "copy backup as text") {
      tile.style.cursor = "pointer";
      tile.addEventListener("click", handleCopyBackupText);
    } else if (label === "restore from text") {
      tile.style.cursor = "pointer";
      tile.addEventListener("click", handleRestoreFromText);
    }
  });
}

function getFullState() {
  const theme = window.localStorage.getItem("ptTheme") || "now";
  const consoleFavs = loadJSON(PT_KEY_CONSOLE_FAVS, []);
  const toolsFavs = loadJSON(PT_KEY_TOOLS_FAVS, []);

  return {
    version: 1,
    savedAt: new Date().toISOString(),
    theme,
    consoleFavs,
    toolsFavs
  };
}

function applyFullState(state) {
  if (!state || typeof state !== "object") return;

  if (state.theme && PT_THEMES.includes(state.theme)) {
    window.localStorage.setItem("ptTheme", state.theme);
    document.documentElement.setAttribute("data-theme", state.theme);
  }

  if (Array.isArray(state.consoleFavs)) {
    saveJSON(PT_KEY_CONSOLE_FAVS, state.consoleFavs);
  }

  if (Array.isArray(state.toolsFavs)) {
    saveJSON(PT_KEY_TOOLS_FAVS, state.toolsFavs);
  }

  // Re-render if we’re actually on those pages
  const consoleFavsContainer = document.getElementById("pt-favourites");
  if (consoleFavsContainer) {
    renderFavourites(consoleFavsContainer, loadJSON(PT_KEY_CONSOLE_FAVS, []), PT_KEY_CONSOLE_FAVS);
    enableFavouritesDnD(consoleFavsContainer, PT_KEY_CONSOLE_FAVS);
  }

  const toolsFavsContainer = document.getElementById("pt-tools-favourites");
  if (toolsFavsContainer) {
    renderFavourites(toolsFavsContainer, loadJSON(PT_KEY_TOOLS_FAVS, []), PT_KEY_TOOLS_FAVS);
    enableFavouritesDnD(toolsFavsContainer, PT_KEY_TOOLS_FAVS);
  }
}

// ---- Backup handlers ----

function handleExportSetup() {
  const state = getFullState();
  const json = JSON.stringify(state, null, 2);

  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  const ts = new Date();
  const stamp = [
    ts.getFullYear(),
    String(ts.getMonth() + 1).padStart(2, "0"),
    String(ts.getDate()).padStart(2, "0")
  ].join("");

  a.href = url;
  a.download = `PlayTriX-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert("PlayTriX backup exported as a file. Keep it somewhere safe.");
}

function handleImportSetup() {
  const text = window.prompt(
    "Paste the contents of a PlayTriX backup file here. (Open the .json file in a text editor, select all, copy, then paste.)"
  );
  if (!text) return;

  try {
    const parsed = JSON.parse(text);
    applyFullState(parsed);
    alert("PlayTriX setup restored from pasted JSON.");
  } catch (e) {
    console.error("PlayTriX import error", e);
    alert("That didn’t look like valid PlayTriX backup JSON.");
  }
}

function handleCopyBackupText() {
  const state = getFullState();
  const json = JSON.stringify(state);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(json)
      .then(() => {
        alert("Backup text copied to clipboard. Paste it into your notes app or somewhere safe.");
      })
      .catch(() => {
        fallbackCopyBackup(json);
      });
  } else {
    fallbackCopyBackup(json);
  }
}

function fallbackCopyBackup(json) {
  window.prompt(
    "Your browser doesn’t allow automatic copying. Select and copy this text manually, then paste it somewhere safe:",
    json
  );
}

function handleRestoreFromText() {
  const text = window.prompt(
    "Paste the backup text you previously copied here to restore your PlayTriX setup:"
  );
  if (!text) return;

  try {
    const parsed = JSON.parse(text);
    applyFullState(parsed);
    alert("PlayTriX setup restored from backup text.");
  } catch (e) {
    console.error("PlayTriX restore-from-text error", e);
    alert("That didn’t look like valid PlayTriX backup text.");
  }
}
