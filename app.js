const GRID_ROWS = 8;
const GRID_COLUMNS = 6;
const ICON_PLAY_ANIM_MS = 420;

const BPM_MIN = 60;
const BPM_MAX = 180;
const BPM_DEFAULT = 126;

const INTRO_EXPAND_DELAY = 900;
const INTRO_END_DELAY = 1850;
const INVENTORY_REVEAL_DELAY = 2300;

const CATEGORY_ACCENTS = {
  Beat: "#9fa9ff",
  Hat: "#8ce8cf",
  Horn: "#ffc66d",
  Melody: "#f59fc2",
  Sounds: "#9fdc8e"
};

const SOUND_LIBRARY = [
  {
    id: "beat-click",
    label: "Click Button",
    category: "Beat",
    path: "/Selection_sounds_clean/Beat/Click Button 2.wav",
    shape: "dome",
    animation: "wiggle",
    coreDesign: true
  },
  {
    id: "beat-door",
    label: "Door Closing",
    category: "Beat",
    path: "/Selection_sounds_clean/Beat/door_closing.wav",
    shape: "doubleDome",
    animation: "bounceup",
    coreDesign: true
  },
  {
    id: "beat-open",
    label: "All Doors Opening",
    category: "Beat",
    path: "/Selection_sounds_clean/Beat/all doors opening  2.wav",
    shape: "curve",
    animation: "sway",
    coreDesign: true
  },
  {
    id: "beat-seatbelt",
    label: "Safety Seatbelt",
    category: "Beat",
    path: "/Selection_sounds_clean/Beat/safety moment setabelt 3.wav",
    shape: "bigArc",
    animation: "quarterspin",
    coreDesign: true
  },
  {
    id: "hat-interior",
    label: "Interior Plastic",
    category: "Hat",
    path: "/Selection_sounds_clean/hat/interior asm plastic on plastic 2.wav",
    shape: "triangle",
    animation: "jumpcut",
    coreDesign: true
  },
  {
    id: "hat-exterior",
    label: "Exterior Plastic",
    category: "Hat",
    path: "/Selection_sounds_clean/hat/exterior asmr plastic on plastic 2.wav",
    shape: "circle",
    animation: "orbit",
    coreDesign: true
  },
  {
    id: "hat-storage",
    label: "Front Seat Storage",
    category: "Hat",
    path: "/Selection_sounds_clean/hat/front seat storage  2.wav",
    shape: "dot",
    animation: "twinkle",
    coreDesign: true
  },
  {
    id: "hat-headrest",
    label: "Headrest",
    category: "Hat",
    path: "/Selection_sounds_clean/hat/headrest  2.wav",
    shape: "pill",
    animation: "stretch",
    coreDesign: true
  },
  {
    id: "horn-main",
    label: "Horn",
    category: "Horn",
    path: "/Selection_sounds_clean/horn/horn 2.wav",
    shape: "diamond",
    animation: "shake",
    coreDesign: true
  },
  {
    id: "melody-call",
    label: "Incoming Call",
    category: "Melody",
    path: "/Selection_sounds_clean/melody/Incoming Call H1.wav",
    shape: "square",
    animation: "stomp",
    coreDesign: true
  },
  {
    id: "melody-adas-deactivate",
    label: "ADAS Deactivate",
    category: "Melody",
    path: "/Selection_sounds_clean/melody/ADAS Deactivate Simplified v2.wav",
    shape: "dome",
    animation: "flutter",
    coreDesign: true
  },
  {
    id: "ambient-frunk",
    label: "Frunk",
    category: "Sounds",
    path: "/Selection_sounds_clean/sounds/frunk  2.wav",
    shape: "notch",
    animation: "pendulum",
    coreDesign: true
  },
  {
    id: "melody-adas-activate",
    label: "ADAS Activate",
    category: "Melody",
    path: "/Selection_sounds_clean/melody/ADAS Activate Simplified v2.wav",
    shape: "arch",
    animation: "glide"
  },
  {
    id: "melody-malfunction",
    label: "ADAS Malfunction",
    category: "Melody",
    path: "/Selection_sounds_clean/melody/ADAS Malfunction Alarm A.wav",
    shape: "crescent",
    animation: "pulseflip"
  },
  {
    id: "melody-slw",
    label: "Speed Limit Alert",
    category: "Melody",
    path: "/Selection_sounds_clean/melody/ADAS SLW Speed Limit Alert_89.wav",
    shape: "quarter",
    animation: "nod"
  },
  {
    id: "melody-avas",
    label: "AVAS CDP",
    category: "Melody",
    path: "/Selection_sounds_clean/melody/AVAS CDP Simplified.wav",
    shape: "domeSplit",
    animation: "swirl"
  },
  {
    id: "melody-middle-high",
    label: "Middle To High",
    category: "Melody",
    path: "/Selection_sounds_clean/melody/MiddleToHigh2 ON.wav",
    shape: "curve",
    animation: "popspin"
  },
  {
    id: "melody-warning-lvl2",
    label: "Warning LVL2",
    category: "Melody",
    path: "/Selection_sounds_clean/melody/Warning LVL2 A (was D).wav",
    shape: "bigArc",
    animation: "floatlift"
  },
  {
    id: "melody-warning-lvl4",
    label: "Warning LVL4",
    category: "Melody",
    path: "/Selection_sounds_clean/melody/Warning LVL4 A Faster.wav",
    shape: "triangle",
    animation: "tremor"
  },
  {
    id: "melody-indicator",
    label: "Indicator Reading",
    category: "Melody",
    path: "/Selection_sounds_clean/melody/indicator reading lamp hazzard lamp  2.wav",
    shape: "pill",
    animation: "arcwave"
  },
  {
    id: "ambient-park",
    label: "Park Load Outside",
    category: "Sounds",
    path: "/Selection_sounds_clean/sounds/park lode outside  2.wav",
    shape: "circle",
    animation: "skewstep"
  }
];

const SHAPE_SVGS = {
  dome: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M6 64a44 44 0 0 1 88 0H6Z" />
    </svg>
  `,
  domeSplit: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M6 58a44 44 0 0 1 88 0H6Z" />
      <path d="M6 92a44 44 0 0 1 44-44 44 44 0 0 1 44 44H6Z" opacity="0.9" />
    </svg>
  `,
  doubleDome: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M6 40a32 32 0 0 1 64 0H6Z" />
      <path d="M30 92a32 32 0 0 1 64-0.1H30Z" />
    </svg>
  `,
  curve: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M8 8h46c22 0 40 18 40 40v44H8V8Zm44 16H24v52h54c0-17.7-8.7-30.2-26-52Z" />
    </svg>
  `,
  triangle: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M10 86V10h76L10 86Z" />
    </svg>
  `,
  circle: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="33" />
    </svg>
  `,
  pill: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <rect x="33" y="10" width="34" height="80" rx="17" />
    </svg>
  `,
  dot: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="12" />
    </svg>
  `,
  diamond: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 8 92 50 50 92 8 50Z" />
    </svg>
  `,
  square: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <rect x="12" y="12" width="76" height="76" />
    </svg>
  `,
  quarter: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 8a42 42 0 0 1 42 42v42H50V8Z" />
    </svg>
  `,
  bigArc: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M100 100V0C45 0 0 45 0 100H100Z" />
    </svg>
  `,
  crescent: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M78 50c0 19-13 34-30 34S18 69 18 50s13-34 30-34c4.7 0 9.3 1 13.2 2.8C46 22.4 35 35 35 50s11 27.6 26.2 31.2A31.3 31.3 0 0 0 78 50Z" />
    </svg>
  `,
  arch: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M8 58a42 42 0 1 1 84 0H8Zm14 0h56a28 28 0 0 0-56 0Z" />
    </svg>
  `,
  notch: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M6 92a44 44 0 0 1 88 0H6Zm27 0a17 17 0 0 1 34 0H33Z" />
    </svg>
  `
};

const inventoryGrid = document.querySelector("#inventoryGrid");
const stageGrid = document.querySelector("#stageGrid");
const statusLine = document.querySelector("#statusLine");
const playSceneButton = document.querySelector("#playSceneBtn");
const clearGridButton = document.querySelector("#clearGridBtn");
const clearAllButton = document.querySelector("#clearAllBtn");
const skipIntroButton = document.querySelector("#skipIntro");
const globalScaleInput = document.querySelector("#globalScale");
const globalScaleValue = document.querySelector("#globalScaleValue");
const bpmInput = document.querySelector("#bpmControl");
const bpmValue = document.querySelector("#bpmValue");

const soundsById = new Map(
  SOUND_LIBRARY.map((sound) => [
    sound.id,
    {
      ...sound,
      url: encodeURI(sound.path)
    }
  ])
);

const audioPool = new Map(
  SOUND_LIBRARY.map((sound) => {
    const baseAudio = new Audio(encodeURI(sound.path));
    baseAudio.preload = "auto";
    return [sound.id, baseAudio];
  })
);

const state = {
  grid: Array.from({ length: GRID_ROWS * GRID_COLUMNS }, () => null),
  previewSoundId: null,
  globalScale: 1,
  bpm: BPM_DEFAULT,
  introTimers: [],
  playbackTimers: [],
  transportTimer: null,
  transportStep: 0,
  activeRow: null,
  playingIconTimers: new Map()
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function setStatus(message) {
  if (statusLine) {
    statusLine.textContent = message;
  }
}

function queueIntroStep(callback, delay) {
  const timer = window.setTimeout(callback, delay);
  state.introTimers.push(timer);
}

function clearIntroTimers() {
  state.introTimers.forEach((timer) => window.clearTimeout(timer));
  state.introTimers = [];
}

function clearPlaybackTimers() {
  state.playbackTimers.forEach((timer) => window.clearTimeout(timer));
  state.playbackTimers = [];
}

function hasPlacedSounds() {
  return state.grid.some((entry) => Boolean(entry));
}

function getBeatMs() {
  return Math.round(60000 / state.bpm);
}

function setBpmDisplay() {
  if (bpmValue) {
    bpmValue.textContent = `${state.bpm} BPM`;
  }
  if (bpmInput && Number(bpmInput.value) !== state.bpm) {
    bpmInput.value = String(state.bpm);
  }
}

function highlightActiveRow(row) {
  stageGrid
    .querySelectorAll(".stage-cell.is-row-active")
    .forEach((cell) => cell.classList.remove("is-row-active"));

  if (!Number.isInteger(row)) {
    return;
  }

  stageGrid
    .querySelectorAll(`.stage-cell[data-row="${row}"]`)
    .forEach((cell) => cell.classList.add("is-row-active"));
}

function ensureTransportRunning() {
  if (state.transportTimer !== null) {
    return;
  }

  state.transportTimer = window.setInterval(runTransportStep, getBeatMs());
}

function refreshTransportClock() {
  if (state.transportTimer === null) {
    return;
  }

  window.clearInterval(state.transportTimer);
  state.transportTimer = window.setInterval(runTransportStep, getBeatMs());
}

function stopTransport() {
  if (state.transportTimer !== null) {
    window.clearInterval(state.transportTimer);
    state.transportTimer = null;
  }

  state.transportStep = 0;
  state.activeRow = null;
  highlightActiveRow(null);
}

function syncTransport() {
  if (hasPlacedSounds()) {
    ensureTransportRunning();
  } else {
    stopTransport();
  }
}

function markGridIconPlaying(index) {
  const tile = stageGrid.querySelector(`.placed-tile[data-index="${index}"]`);
  if (!tile) {
    return;
  }

  tile.classList.remove("is-playing");
  void tile.offsetWidth;
  tile.classList.add("is-playing");

  const previousTimer = state.playingIconTimers.get(index);
  if (previousTimer) {
    window.clearTimeout(previousTimer);
  }

  const timer = window.setTimeout(() => {
    tile.classList.remove("is-playing");
    state.playingIconTimers.delete(index);
  }, ICON_PLAY_ANIM_MS);

  state.playingIconTimers.set(index, timer);
}

function cloneVoice(soundId) {
  const baseAudio = audioPool.get(soundId);
  if (!baseAudio) {
    return null;
  }

  const voice = baseAudio.cloneNode();
  voice.volume = 0.93;
  voice.currentTime = 0;
  return voice;
}

function playSound(soundId) {
  const sound = soundsById.get(soundId);
  if (!sound) {
    return;
  }

  const voice = cloneVoice(soundId);
  if (!voice) {
    return;
  }

  voice.play().catch(() => {});
  return sound.label;
}

function runTransportStep() {
  const currentRow = state.transportStep;
  const rowStart = currentRow * GRID_COLUMNS;
  const rowEnd = rowStart + GRID_COLUMNS;

  for (let index = rowStart; index < rowEnd; index += 1) {
    const item = state.grid[index];
    if (!item) {
      continue;
    }

    playSound(item.soundId);
    markGridIconPlaying(index);
  }

  state.activeRow = currentRow;
  highlightActiveRow(state.activeRow);
  state.transportStep = (state.transportStep + 1) % GRID_ROWS;
}

function getDragPayload(dataTransfer) {
  const raw =
    dataTransfer.getData("application/firefly-sound") ||
    dataTransfer.getData("text/plain") ||
    "";

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}


function startResize(event, index) {
  const cellItem = state.grid[index];
  if (!cellItem) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const originX = event.clientX;
  const originY = event.clientY;
  const startScale = cellItem.scale;

  const onMove = (moveEvent) => {
    const delta = (moveEvent.clientX - originX - (moveEvent.clientY - originY)) / 170;
    cellItem.scale = clamp(startScale + delta, 0.55, 2.25);
    renderStage();
  };

  const onUp = () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    setStatus("Icon size updated with the resize dot.");
  };

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
}

function handleDrop(payload, targetIndex) {
  if (!payload) {
    return;
  }

  if (payload.type === "inventory") {
    if (!soundsById.has(payload.soundId)) {
      return;
    }

    state.grid[targetIndex] = {
      soundId: payload.soundId,
      scale: 1
    };

    const sound = soundsById.get(payload.soundId);
    setStatus(`${sound.label} dropped. It is now part of the sequencer loop.`);
    playSound(payload.soundId);
    renderStage();
    markGridIconPlaying(targetIndex);
    syncTransport();
    return;
  }

  if (payload.type === "placed") {
    const fromIndex = Number(payload.fromIndex);
    if (!Number.isInteger(fromIndex)) {
      return;
    }

    if (fromIndex === targetIndex) {
      return;
    }

    const fromItem = state.grid[fromIndex];
    if (!fromItem) {
      return;
    }

    const targetItem = state.grid[targetIndex];
    state.grid[targetIndex] = fromItem;
    state.grid[fromIndex] = targetItem || null;

    setStatus("Sound icon moved to a new grid cell.");
    playSound(fromItem.soundId);
    renderStage();
    markGridIconPlaying(targetIndex);
    syncTransport();
  }
}

function createStageCell(index) {
  const row = Math.floor(index / GRID_COLUMNS);
  const col = index % GRID_COLUMNS;

  const cell = document.createElement("div");
  cell.className = "stage-cell";
  cell.dataset.index = String(index);
  cell.dataset.row = String(row);
  cell.dataset.col = String(col);

  cell.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  cell.addEventListener("dragenter", () => {
    cell.classList.add("is-drag-over");
  });

  cell.addEventListener("dragleave", () => {
    cell.classList.remove("is-drag-over");
  });

  cell.addEventListener("drop", (event) => {
    event.preventDefault();
    cell.classList.remove("is-drag-over");
    const payload = getDragPayload(event.dataTransfer);
    handleDrop(payload, index);
  });

  const item = state.grid[index];
  if (!item) {
    return cell;
  }

  const sound = soundsById.get(item.soundId);
  if (!sound) {
    return cell;
  }

  const tile = document.createElement("article");
  tile.className = "placed-tile";
  tile.draggable = true;
  tile.dataset.index = String(index);
  tile.dataset.shape = sound.shape;
  tile.style.setProperty("--play-anim", sound.animation || "wiggle");
  tile.title = `${sound.label} (${sound.category})`;

  tile.addEventListener("dragstart", (event) => {
    const payload = JSON.stringify({ type: "placed", fromIndex: index, soundId: item.soundId });
    event.dataTransfer.setData("application/firefly-sound", payload);
    event.dataTransfer.setData("text/plain", payload);
    event.dataTransfer.effectAllowed = "move";
    tile.classList.add("is-dragging");
  });

  tile.addEventListener("dragend", () => {
    tile.classList.remove("is-dragging");
  });

  const glyph = document.createElement("div");
  glyph.className = "placed-glyph";
  glyph.style.setProperty("--local-scale", item.scale.toFixed(3));
  glyph.innerHTML = SHAPE_SVGS[sound.shape] || SHAPE_SVGS.square;

  const resizeDot = document.createElement("button");
  resizeDot.type = "button";
  resizeDot.className = "resize-dot";
  resizeDot.dataset.index = String(index);
  resizeDot.setAttribute("aria-label", "Resize icon");
  resizeDot.addEventListener("pointerdown", (event) => startResize(event, index));

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-btn";
  deleteButton.dataset.index = String(index);
  deleteButton.setAttribute("aria-label", "Delete sound from grid");
  deleteButton.textContent = "×";

  tile.append(glyph, resizeDot, deleteButton);
  cell.append(tile);

  return cell;
}

function renderStage() {
  stageGrid.style.setProperty("--global-scale", state.globalScale.toFixed(3));
  stageGrid.textContent = "";

  for (let index = 0; index < state.grid.length; index += 1) {
    stageGrid.append(createStageCell(index));
  }

  highlightActiveRow(state.activeRow);
}

function createInventoryCard(sound, index) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "inventory-card";
  card.style.setProperty("--i", String(index));
  card.style.setProperty("--accent", CATEGORY_ACCENTS[sound.category] || "#b7b2df");
  card.dataset.soundId = sound.id;
  card.dataset.shape = sound.shape;
  card.draggable = true;
  card.title = `${sound.label} (${sound.category})`;

  if (sound.coreDesign) {
    card.classList.add("is-core");
  } else {
    card.classList.add("is-expanded");
  }

  if (state.previewSoundId === sound.id) {
    card.classList.add("is-previewing");
  }

  card.addEventListener("click", () => {
    state.previewSoundId = sound.id;
    renderInventory();
    playSound(sound.id);
    setStatus(`Preview: ${sound.label}`);
  });

  card.addEventListener("dragstart", (event) => {
    const payload = JSON.stringify({ type: "inventory", soundId: sound.id });
    event.dataTransfer.setData("application/firefly-sound", payload);
    event.dataTransfer.setData("text/plain", payload);
    event.dataTransfer.effectAllowed = "copy";
    card.classList.add("is-dragging");
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("is-dragging");
  });

  const symbol = document.createElement("span");
  symbol.className = "inventory-symbol";
  symbol.innerHTML = SHAPE_SVGS[sound.shape] || SHAPE_SVGS.square;

  card.append(symbol);

  if (!sound.coreDesign) {
    const meta = document.createElement("span");
    meta.className = "inventory-meta";

    const category = document.createElement("span");
    category.className = "inventory-category";
    category.textContent = sound.category;

    const label = document.createElement("span");
    label.className = "inventory-label";
    label.textContent = sound.label;

    meta.append(category, label);
    card.append(meta);
  }

  return card;
}

function renderInventory() {
  inventoryGrid.textContent = "";

  SOUND_LIBRARY.forEach((sound, index) => {
    inventoryGrid.append(createInventoryCard(sound, index));
  });
}

function playScene() {
  clearPlaybackTimers();

  const placedEntries = state.grid
    .map((entry, index) => ({ entry, index }))
    .filter((item) => Boolean(item.entry));

  if (placedEntries.length === 0) {
    setStatus("Place at least one sound icon in the grid first.");
    return;
  }

  placedEntries.forEach(({ entry, index }) => {
    const offset = (index % GRID_COLUMNS) * 120;
    const timer = window.setTimeout(() => {
      playSound(entry.soundId);
      markGridIconPlaying(index);
    }, offset);

    state.playbackTimers.push(timer);
  });

  setStatus(`Playing scene with ${placedEntries.length} placed sound${placedEntries.length > 1 ? "s" : ""}.`);
}

function clearGrid() {
  clearPlaybackTimers();
  state.playingIconTimers.forEach((timer) => window.clearTimeout(timer));
  state.playingIconTimers.clear();
  state.grid = Array.from({ length: GRID_ROWS * GRID_COLUMNS }, () => null);
  stopTransport();
  renderStage();
  setStatus("Grid cleared. Drag new sounds from the inventory.");
}

function finalizeIntroNow() {
  clearIntroTimers();
  document.body.classList.remove("phase-intro", "phase-expanding");
  document.body.classList.add("phase-sampler", "inventory-open");
  setStatus("Inventory ready. Click sounds to preview, then drag them to the grid.");
}

function startIntroTimeline() {
  queueIntroStep(() => {
    document.body.classList.add("phase-expanding");
  }, INTRO_EXPAND_DELAY);

  queueIntroStep(() => {
    document.body.classList.remove("phase-intro", "phase-expanding");
    document.body.classList.add("phase-sampler");
    setStatus("Sampler loaded. Inventory is sliding in.");
  }, INTRO_END_DELAY);

  queueIntroStep(() => {
    document.body.classList.add("inventory-open");
    setStatus("Inventory ready. Click a sound to preview, then drag it to the 8x6 grid.");
  }, INVENTORY_REVEAL_DELAY);
}

stageGrid.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-btn");
  if (deleteButton) {
    event.stopPropagation();
    const index = Number(deleteButton.dataset.index);
    if (!Number.isInteger(index)) {
      return;
    }
    const existing = state.grid[index];
    if (!existing) {
      return;
    }
    const sound = soundsById.get(existing.soundId);
    state.grid[index] = null;
    renderStage();
    setStatus(`${sound ? sound.label : "Sound"} removed from the grid.`);
    syncTransport();
    return;
  }

  if (event.target.closest(".resize-dot")) {
    return;
  }

  const tile = event.target.closest(".placed-tile");
  if (!tile) {
    return;
  }

  const index = Number(tile.dataset.index);
  const item = state.grid[index];
  if (!item) {
    return;
  }

  playSound(item.soundId);
  markGridIconPlaying(index);
});

if (playSceneButton) {
  playSceneButton.addEventListener("click", playScene);
}

if (clearGridButton) {
  clearGridButton.addEventListener("click", clearGrid);
}

if (clearAllButton) {
  clearAllButton.addEventListener("click", clearGrid);
}

if (skipIntroButton) {
  skipIntroButton.addEventListener("click", finalizeIntroNow);
}

if (globalScaleInput) {
  globalScaleInput.addEventListener("input", (event) => {
    const value = Number(event.target.value);
    state.globalScale = clamp(value, 0.7, 1.8);
    if (globalScaleValue) {
      globalScaleValue.textContent = `${Math.round(state.globalScale * 100)}%`;
    }
    renderStage();
    setStatus(`Grid icon scale set to ${Math.round(state.globalScale * 100)}%.`);
  });
}

if (bpmInput) {
  bpmInput.addEventListener("input", (event) => {
    const value = clamp(Number(event.target.value), BPM_MIN, BPM_MAX);
    state.bpm = Math.round(value);
    setBpmDisplay();
    refreshTransportClock();
    setStatus(`BPM set to ${state.bpm}.`);
  });
}

setBpmDisplay();
renderInventory();
renderStage();
startIntroTimeline();
