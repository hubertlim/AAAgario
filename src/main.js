const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d", { alpha: false });

const menu = document.querySelector("#menu");
const hud = document.querySelector("#hud");
const pauseMenu = document.querySelector("#pause-menu");
const summary = document.querySelector("#summary");
const startButton = document.querySelector("#start");
const againButton = document.querySelector("#again");
const stopButton = document.querySelector("#stop");
const resumeButton = document.querySelector("#resume");
const restartButton = document.querySelector("#restart");
const mainMenuButton = document.querySelector("#main-menu");
const summaryMenuButton = document.querySelector("#summary-menu");
const durationButtons = [...document.querySelectorAll(".duration")];
const modeButtons = [...document.querySelectorAll(".mode-choice")];
const mapButtons = [...document.querySelectorAll(".map-choice")];
const modifierButtons = [...document.querySelectorAll(".modifier-choice")];
const powerupButtons = [...document.querySelectorAll(".powerup-choice")];
const surpriseButton = document.querySelector("#surprise");
const modeSelect = document.querySelector("#mode-select");
const mapSelect = document.querySelector("#map-select");
const modifierSelect = document.querySelector("#modifier-select");
const runGroup = document.querySelector(".option-group-run");
const styleGroup = document.querySelector(".option-group-style");
const swatchButtons = [...document.querySelectorAll(".swatch")];
const markButtons = [...document.querySelectorAll(".mark")];
const playerNameInput = document.querySelector("#player-name");
const runSummaryLabel = document.querySelector("#run-summary");
const styleSummaryLabel = document.querySelector("#style-summary");
const massLabel = document.querySelector("#mass");
const rankLabel = document.querySelector("#rank");
const timeLabel = document.querySelector("#time");
const runInfoLabel = document.querySelector("#run-info");
const boostCard = document.querySelector("#boost-card");
const boostStatusLabel = document.querySelector("#boost-status");
const resultTitle = document.querySelector("#result-title");
const resultCopy = document.querySelector("#result-copy");
const finalMass = document.querySelector("#final-mass");
const finalChain = document.querySelector("#final-chain");

const TAU = Math.PI * 2;
const WORLD = { width: 4400, height: 4400 };
const COLORS = {
  paper: "#f7f4ea",
  ink: "#1d211d",
  red: "#df3f2d",
  mint: "#1d9a78",
  blue: "#2774a9",
  gold: "#c99821",
  violet: "#7556a8",
};
const COLOR_NAMES = {
  "#df3f2d": "Red",
  "#1d9a78": "Mint",
  "#2774a9": "Blue",
  "#c99821": "Gold",
};
const MARK_NAMES = {
  orbit: "Orbit",
  spark: "Spark",
  core: "Core",
};
const POWERUP_CONFIG = {
  speed: {
    name: "Boost",
    color: "#31a7c7",
    accent: "#d9fbff",
    duration: 8,
    stackBonus: 0.16,
    maxStacks: 4,
    fieldMax: 3,
    spawnWindow: [6, 8],
    respawnWindow: [17, 24],
    fieldLife: 18,
    eventChainStep: 10,
  },
};
const MAPS = {
  city: {
    name: "City",
    paper: "#dfe7ec",
    border: "#22313e",
    grid: "rgba(34, 49, 62, 0.1)",
    food: [COLORS.mint, COLORS.blue, COLORS.gold, COLORS.red],
    props: [
      { name: "cone", mass: 9, r: 13, sides: 3, color: "#ef9f2d" },
      { name: "sign", mass: 18, r: 18, sides: 4, color: "#2d83bc" },
      { name: "cart", mass: 35, r: 24, sides: 4, color: "#188a6a" },
      { name: "tower", mass: 70, r: 34, sides: 6, color: "#5d6f87" },
      { name: "block", mass: 120, r: 46, sides: 4, color: "#394856" },
    ],
  },
  desk: {
    name: "Desk",
    paper: "#f4ecd8",
    border: "#51483d",
    grid: "rgba(81, 72, 61, 0.08)",
    food: ["#3d8b6f", "#d84b3d", "#b18b20", "#555c68"],
    props: [
      { name: "clip", mass: 8, r: 12, sides: 5, color: "#555c68" },
      { name: "coin", mass: 16, r: 17, sides: 12, color: "#b18b20" },
      { name: "key", mass: 31, r: 23, sides: 4, color: "#3d8b6f" },
      { name: "mug", mass: 64, r: 34, sides: 8, color: "#d84b3d" },
      { name: "laptop", mass: 118, r: 48, sides: 4, color: "#282d31" },
    ],
  },
  kitchen: {
    name: "Kitchen",
    paper: "#fff1d6",
    border: "#6a5338",
    grid: "rgba(106, 83, 56, 0.1)",
    food: ["#d94937", "#6c9d39", "#c99022", "#2b82a3"],
    props: [
      { name: "berry", mass: 7, r: 11, sides: 9, color: "#d94937" },
      { name: "spoon", mass: 20, r: 19, sides: 4, color: "#7d858a" },
      { name: "plate", mass: 38, r: 25, sides: 12, color: "#2b82a3" },
      { name: "pan", mass: 78, r: 36, sides: 8, color: "#282d31" },
      { name: "cake", mass: 128, r: 48, sides: 6, color: "#9f6c2d" },
    ],
  },
  arcade: {
    name: "Arcade",
    paper: "#171522",
    border: "#ece5ff",
    grid: "rgba(236, 229, 255, 0.08)",
    food: ["#e83f6f", "#31a7c7", "#f0b429", "#7556a8"],
    props: [
      { name: "ticket", mass: 8, r: 13, sides: 4, color: "#e83f6f" },
      { name: "token", mass: 17, r: 18, sides: 10, color: "#f0b429" },
      { name: "button", mass: 32, r: 23, sides: 8, color: "#31a7c7" },
      { name: "stick", mass: 68, r: 34, sides: 5, color: "#7556a8" },
      { name: "cabinet", mass: 125, r: 47, sides: 4, color: "#2f2252" },
    ],
  },
  garden: {
    name: "Garden",
    paper: "#dff1df",
    border: "#24583a",
    grid: "rgba(36, 88, 58, 0.08)",
    food: ["#2f9b62", "#8fbb3f", "#d85f4a", "#7b5da8"],
    props: [
      { name: "spore", mass: 7, r: 11, sides: 8, color: "#7b5da8" },
      { name: "leaf", mass: 18, r: 18, sides: 5, color: "#2f9b62" },
      { name: "bug", mass: 34, r: 24, sides: 6, color: "#d85f4a" },
      { name: "mush", mass: 72, r: 35, sides: 8, color: "#8fbb3f" },
      { name: "flower", mass: 122, r: 48, sides: 9, color: "#c99821" },
    ],
  },
  toy: {
    name: "Toy",
    paper: "#e5f0fb",
    border: "#26455f",
    grid: "rgba(38, 69, 95, 0.08)",
    food: ["#df3f2d", "#1d9a78", "#2774a9", "#c99821"],
    props: [
      { name: "block", mass: 8, r: 13, sides: 4, color: "#df3f2d" },
      { name: "die", mass: 18, r: 18, sides: 4, color: "#2774a9" },
      { name: "car", mass: 36, r: 25, sides: 4, color: "#1d9a78" },
      { name: "hero", mass: 76, r: 36, sides: 5, color: "#c99821" },
      { name: "castle", mass: 130, r: 50, sides: 6, color: "#7556a8" },
    ],
  },
};
const MODES = {
  classic: { name: "Rush", copy: "Grow as large as possible before time runs out." },
  boss: { name: "Boss", copy: "Avoid the giant cell until you are big enough to eat it." },
  hunt: { name: "Hunt", copy: "Eat the marked object chain for bonus mass." },
  swarm: { name: "Swarm", copy: "Bots become bolder every minute." },
  chain: { name: "Chain", copy: "Keep eating to extend the timer." },
  tiny: { name: "Tiny", copy: "Move fast, stay small longer, and dodge heavy threats." },
};
const MODIFIERS = {
  none: { name: "Clean" },
  magnet: { name: "Magnet" },
  panic: { name: "Panic" },
  gold: { name: "Gold" },
  shrink: { name: "Storm" },
  combo: { name: "Combo" },
};
const BOT_PERSONAS = [
  { key: "bully", name: "Bully", color: COLORS.red },
  { key: "coward", name: "Coward", color: COLORS.blue },
  { key: "snacker", name: "Snacker", color: COLORS.gold },
  { key: "revenge", name: "Revenge", color: COLORS.violet },
  { key: "wobbler", name: "Wobbler", color: COLORS.mint },
];
const state = {
  mode: "menu",
  selectedMinutes: 3,
  selectedMode: "classic",
  selectedMap: "city",
  selectedModifier: "none",
  selectedPowerups: true,
  activeMode: "classic",
  activeMap: "city",
  activeModifier: "none",
  activePowerups: true,
  timeLeft: 180,
  roundLength: 180,
  lastTime: 0,
  camera: { x: WORLD.width / 2, y: WORLD.height / 2, zoom: 1 },
  pointer: { active: false, x: 0, y: 0 },
  keys: new Set(),
  player: null,
  foods: [],
  props: [],
  bots: [],
  particles: [],
  popups: [],
  landmarks: [],
  hazards: [],
  powerups: [],
  boss: null,
  huntTargets: [],
  huntIndex: 0,
  comboIndex: 0,
  magnetTimer: 0,
  speedStacks: [],
  powerupSpawnTimer: 0,
  nextPowerupChain: 0,
  goldTimer: 0,
  goldCooldown: 0,
  modeNotice: "",
  noticeTimer: 0,
  chain: 0,
  bestChain: 0,
  chainTimer: 0,
  shake: 0,
  paused: false,
  animationId: 0,
  custom: {
    name: "YOU",
    color: COLORS.red,
    mark: "orbit",
  },
};

function random(min, max) {
  return min + Math.random() * (max - min);
}

function pick(items) {
  return items[Math.floor(random(0, items.length))];
}

function isCompactMenuViewport() {
  return window.innerWidth <= 540 || window.innerHeight <= 760;
}

function syncMenuDisclosureLayout() {
  const compact = isCompactMenuViewport();
  runGroup.open = !compact;
  styleGroup.open = !compact;
}

function syncMenuSummaries() {
  runSummaryLabel.textContent = `${MODES[state.selectedMode].name} / ${MAPS[state.selectedMap].name} / ${
    MODIFIERS[state.selectedModifier].name
  } / ${state.selectedPowerups ? "Boosts" : "Pure"}`;
  const playerName = playerNameInput.value.trim().toUpperCase().slice(0, 8) || "YOU";
  styleSummaryLabel.textContent = `${playerName} / ${COLOR_NAMES[state.custom.color] || "Red"} / ${
    MARK_NAMES[state.custom.mark] || "Orbit"
  }`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function radiusFromMass(mass) {
  return 10 + Math.sqrt(mass) * 3.8;
}

function makeFood() {
  const map = MAPS[state.activeMap] || MAPS.city;
  return {
    x: random(80, WORLD.width - 80),
    y: random(80, WORLD.height - 80),
    r: random(3.5, 7),
    mass: random(0.8, 2.4),
    color: pick(map.food),
    pulse: random(0, TAU),
  };
}

function makeProp() {
  const map = MAPS[state.activeMap] || MAPS.city;
  const kind = pick(map.props);
  return {
    ...kind,
    x: random(120, WORLD.width - 120),
    y: random(120, WORLD.height - 120),
    angle: random(0, TAU),
    wobble: random(0, TAU),
    eaten: false,
    flash: 0,
    gold: false,
  };
}

function makeHazard() {
  return {
    x: random(420, WORLD.width - 420),
    y: random(420, WORLD.height - 420),
    r: random(170, 280),
    pulse: random(0, TAU),
  };
}

function powerupSpawnPoint(anchor = null) {
  if (anchor) {
    for (let i = 0; i < 14; i += 1) {
      const angle = random(0, TAU);
      const distanceFromAnchor = random(180, 320);
      const x = clamp(anchor.x + Math.cos(angle) * distanceFromAnchor, 110, WORLD.width - 110);
      const y = clamp(anchor.y + Math.sin(angle) * distanceFromAnchor, 110, WORLD.height - 110);
      if (Math.hypot(x - state.player.x, y - state.player.y) > state.player.radius + 70) return { x, y };
    }
  }
  return {
    x: random(120, WORLD.width - 120),
    y: random(120, WORLD.height - 120),
  };
}

function makePowerup(kind = "speed", anchor = null) {
  const point = powerupSpawnPoint(anchor);
  return {
    kind,
    x: point.x,
    y: point.y,
    r: 18,
    angle: random(0, TAU),
    spin: random(-1.4, 1.4),
    pulse: random(0, TAU),
    life: POWERUP_CONFIG[kind].fieldLife,
  };
}

function spawnPowerup(kind = "speed", anchor = null) {
  if (!state.activePowerups) return false;
  const config = POWERUP_CONFIG[kind];
  if (!config || state.powerups.length >= config.fieldMax) return false;
  state.powerups.push(makePowerup(kind, anchor));
  return true;
}

function pushSpeedStack() {
  const config = POWERUP_CONFIG.speed;
  if (state.speedStacks.length < config.maxStacks) {
    state.speedStacks.push(config.duration);
    return state.speedStacks.length;
  }
  let shortestIndex = 0;
  for (let i = 1; i < state.speedStacks.length; i += 1) {
    if (state.speedStacks[i] < state.speedStacks[shortestIndex]) shortestIndex = i;
  }
  state.speedStacks[shortestIndex] = Math.max(state.speedStacks[shortestIndex], config.duration);
  return state.speedStacks.length;
}

function maybeSpawnEventPowerup(target) {
  if (!state.activePowerups) return;
  while (state.chain >= state.nextPowerupChain) {
    if (spawnPowerup("speed", target)) popup("BOOST DROP", target.x, target.y - 18, POWERUP_CONFIG.speed.color);
    state.nextPowerupChain += POWERUP_CONFIG.speed.eventChainStep;
  }
}

function makeLandmarks(mapKey) {
  const layout = {
    city: [
      { type: "block", x: 760, y: 760, w: 460, h: 320, color: "#4f6f88" },
      { type: "block", x: 3150, y: 760, w: 520, h: 350, color: "#63798d" },
      { type: "block", x: 860, y: 3150, w: 540, h: 380, color: "#506172" },
      { type: "roundabout", x: 2200, y: 2200, r: 360, color: "#cf6f30" },
      { type: "park", x: 3060, y: 3100, w: 620, h: 430, color: "#4f9772" },
    ],
    desk: [
      { type: "notebook", x: 900, y: 820, w: 880, h: 620, color: COLORS.blue },
      { type: "sticky", x: 3100, y: 850, w: 500, h: 420, color: COLORS.gold },
      { type: "keyboard", x: 2200, y: 3100, w: 1400, h: 520, color: COLORS.ink },
      { type: "coffee", x: 3260, y: 2500, r: 250, color: "#8c6a44" },
      { type: "pen", x: 1100, y: 2950, w: 1120, h: 120, color: COLORS.red },
    ],
    kitchen: [
      { type: "counter", x: 800, y: 760, w: 1100, h: 420, color: "#7ea8b7" },
      { type: "cutting", x: 3120, y: 900, w: 720, h: 520, color: "#a56e38" },
      { type: "stove", x: 1180, y: 3060, w: 820, h: 620, color: "#3d464c" },
      { type: "sink", x: 3220, y: 3060, w: 900, h: 540, color: "#6a97ab" },
      { type: "table", x: 2250, y: 2100, w: 940, h: 700, color: "#8b6438" },
    ],
    arcade: [
      { type: "lane", x: 820, y: 850, w: 720, h: 980, color: "#e83f6f" },
      { type: "lane", x: 3300, y: 860, w: 740, h: 980, color: "#31a7c7" },
      { type: "cabinet", x: 980, y: 3180, w: 680, h: 700, color: "#7556a8" },
      { type: "cabinet", x: 3230, y: 3140, w: 700, h: 760, color: "#f0b429" },
      { type: "token-ring", x: 2200, y: 2200, r: 390, color: "#f0b429" },
    ],
    garden: [
      { type: "pond", x: 950, y: 820, w: 820, h: 520, color: "#5f92b3" },
      { type: "bed", x: 3180, y: 880, w: 850, h: 560, color: "#a9664d" },
      { type: "tree", x: 1040, y: 3180, r: 320, color: "#3a8754" },
      { type: "vine", x: 2180, y: 2140, w: 1900, h: 1180, color: "#5c9c66" },
      { type: "bed", x: 3260, y: 3160, w: 820, h: 560, color: "#b2893b" },
    ],
    toy: [
      { type: "rug", x: 2200, y: 2200, w: 1900, h: 1450, color: COLORS.red },
      { type: "track", x: 1040, y: 940, w: 1050, h: 720, color: COLORS.blue },
      { type: "blocks", x: 3230, y: 1040, w: 820, h: 660, color: COLORS.gold },
      { type: "castle-landmark", x: 1040, y: 3230, w: 820, h: 680, color: COLORS.violet },
      { type: "dice-landmark", x: 3260, y: 3220, w: 700, h: 700, color: COLORS.mint },
    ],
  };
  return layout[mapKey] || layout.city;
}

function botSpawnPoint() {
  let point = { x: random(240, WORLD.width - 240), y: random(240, WORLD.height - 240) };
  for (let i = 0; i < 40; i += 1) {
    point = { x: random(240, WORLD.width - 240), y: random(240, WORLD.height - 240) };
    if (Math.hypot(point.x - WORLD.width / 2, point.y - WORLD.height / 2) > 760) break;
  }
  return point;
}

function resetGame() {
  const playerName = state.custom.name.trim().toUpperCase() || "YOU";
  state.activeMode = state.selectedMode;
  state.activeMap = state.selectedMap;
  state.activeModifier = state.selectedModifier;
  state.activePowerups = state.selectedPowerups;
  state.roundLength = state.selectedMinutes * 60;
  if (state.activeMode === "chain") state.roundLength = Math.min(state.roundLength, 120);
  state.player = createCell(
    WORLD.width / 2,
    WORLD.height / 2,
    state.activeMode === "tiny" ? 8 : 16,
    state.custom.color,
    playerName,
    true,
  );
  state.foods = Array.from({ length: 520 }, makeFood);
  state.props = Array.from({ length: 115 }, makeProp);
  state.bots = Array.from({ length: 15 }, (_, index) => {
    const point = botSpawnPoint();
    const persona = BOT_PERSONAS[index % BOT_PERSONAS.length];
    return createCell(
      point.x,
      point.y,
      state.activeMode === "tiny" ? random(8, 64) : random(12, 85),
      persona.color,
      persona.name,
      false,
      persona.key,
    );
  });
  state.boss =
    state.activeMode === "boss"
      ? createCell(WORLD.width * 0.24, WORLD.height * 0.28, 210, COLORS.violet, "BOSS")
      : null;
  state.particles = [];
  state.popups = [];
  state.landmarks = makeLandmarks(state.activeMap);
  state.hazards = state.activeModifier === "shrink" ? Array.from({ length: 4 }, makeHazard) : [];
  state.powerups = [];
  state.timeLeft = state.roundLength;
  state.chain = 0;
  state.bestChain = 0;
  state.chainTimer = 0;
  state.shake = 0;
  state.paused = false;
  state.huntTargets =
    state.activeMode === "hunt" || state.activeModifier === "combo"
      ? (MAPS[state.activeMap] || MAPS.city).props.slice(0, 3).map((prop) => prop.name)
      : [];
  state.huntIndex = 0;
  state.comboIndex = 0;
  state.magnetTimer = 0;
  state.speedStacks = [];
  state.powerupSpawnTimer = state.activePowerups
    ? random(...POWERUP_CONFIG.speed.spawnWindow)
    : Infinity;
  state.nextPowerupChain = POWERUP_CONFIG.speed.eventChainStep;
  state.goldTimer = state.activeModifier === "gold" ? 12 : 0;
  state.goldCooldown = 16;
  state.modeNotice = `${MODES[state.activeMode].name} / ${MAPS[state.activeMap].name} / ${
    MODIFIERS[state.activeModifier].name
  }`;
  state.noticeTimer = 3;
  state.camera.x = state.player.x;
  state.camera.y = state.player.y;
  seedGoldProps();
}

function createCell(x, y, mass, color, name, isPlayer = false, persona = "snacker") {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    mass,
    radius: radiusFromMass(mass),
    color,
    name,
    isPlayer,
    persona,
    revengeTimer: 0,
    angle: random(0, TAU),
    mood: random(0, 1),
    alive: true,
    mark: isPlayer ? state.custom.mark : "orbit",
  };
}

function seedGoldProps() {
  if (state.activeModifier !== "gold") return;
  for (const prop of state.props) prop.gold = false;
  for (let i = 0; i < 8; i += 1) {
    const prop = pick(state.props);
    prop.gold = true;
    prop.color = COLORS.gold;
    prop.flash = 1;
  }
}

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function startGame() {
  state.custom.name = playerNameInput.value.trim().toUpperCase().slice(0, 8) || "YOU";
  playerNameInput.value = state.custom.name;
  syncMenuSummaries();
  resetGame();
  state.mode = "playing";
  menu.classList.add("is-hidden");
  pauseMenu.classList.add("is-hidden");
  summary.classList.add("is-hidden");
  hud.classList.remove("is-hidden");
  updateHud();
}

function openPauseMenu() {
  if (state.mode !== "playing") return;
  state.paused = true;
  state.pointer.active = false;
  pauseMenu.classList.remove("is-hidden");
}

function resumeGame() {
  if (state.mode !== "playing") return;
  state.paused = false;
  pauseMenu.classList.add("is-hidden");
}

function showMainMenu() {
  state.mode = "menu";
  state.paused = false;
  state.pointer.active = false;
  resetGame();
  menu.classList.remove("is-hidden");
  pauseMenu.classList.add("is-hidden");
  hud.classList.add("is-hidden");
  summary.classList.add("is-hidden");
}

function endGame(wasEaten = false) {
  state.mode = "summary";
  hud.classList.add("is-hidden");
  pauseMenu.classList.add("is-hidden");
  summary.classList.remove("is-hidden");
  finalMass.textContent = Math.round(state.player.mass).toString();
  finalChain.textContent = state.bestChain.toString();
  resultTitle.textContent = wasEaten ? "Absorbed" : "Clean sweep";
  resultCopy.textContent = wasEaten
    ? "A larger rival caught you. Route around heavy cells until you can turn the table."
    : `${MODES[state.activeMode].name} on ${MAPS[state.activeMap].name} with ${
        MODIFIERS[state.activeModifier].name
      }. The best runs chain tiny pickups into bigger objects before hunting rivals.`;
}

function addMass(cell, mass) {
  cell.mass += mass;
  cell.radius = radiusFromMass(cell.mass);
}

function burst(x, y, color, count, force = 1) {
  for (let i = 0; i < count; i += 1) {
    const angle = random(0, TAU);
    const speed = random(45, 150) * force;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: random(0.22, 0.55),
      maxLife: 0.55,
      color,
      r: random(2, 5),
    });
  }
}

function popup(text, x, y, color = COLORS.ink) {
  state.popups.push({ text, x, y, vy: -28, life: 1.1, color });
}

function collect(cell, target, mass, color, count) {
  addMass(cell, mass);
  if (cell.isPlayer) {
    state.chain += 1;
    state.bestChain = Math.max(state.bestChain, state.chain);
    state.chainTimer = 1.35;
    state.shake = Math.min(8, state.shake + 1.6);
    if (state.activeMode === "chain") state.timeLeft = Math.min(state.roundLength, state.timeLeft + 0.8);
    if (state.activeModifier === "magnet" && state.chain >= 20) {
      state.magnetTimer = 5;
      popup("MAGNET", target.x, target.y, COLORS.blue);
    }
    maybeSpawnEventPowerup(target);
  }
  burst(target.x, target.y, color, count);
}

function screenToWorld(x, y) {
  const zoom = state.camera.zoom;
  return {
    x: state.camera.x + (x - window.innerWidth / 2) / zoom,
    y: state.camera.y + (y - window.innerHeight / 2) / zoom,
  };
}

function updatePlayer(dt) {
  const player = state.player;
  let targetVx = 0;
  let targetVy = 0;
  const keyX = (state.keys.has("ArrowRight") || state.keys.has("KeyD") ? 1 : 0) -
    (state.keys.has("ArrowLeft") || state.keys.has("KeyA") ? 1 : 0);
  const keyY = (state.keys.has("ArrowDown") || state.keys.has("KeyS") ? 1 : 0) -
    (state.keys.has("ArrowUp") || state.keys.has("KeyW") ? 1 : 0);

  if (keyX || keyY) {
    const mag = Math.hypot(keyX, keyY) || 1;
    targetVx = keyX / mag;
    targetVy = keyY / mag;
  } else if (state.pointer.active) {
    const world = screenToWorld(state.pointer.x, state.pointer.y);
    const dx = world.x - player.x;
    const dy = world.y - player.y;
    const mag = Math.hypot(dx, dy);
    if (mag > 10) {
      const power = clamp(mag / 220, 0, 1);
      targetVx = (dx / mag) * power;
      targetVy = (dy / mag) * power;
    }
  }

  const tinyBoost = state.activeMode === "tiny" ? 42 : 0;
  const boostMultiplier = 1 + Math.min(state.speedStacks.length, POWERUP_CONFIG.speed.maxStacks) * POWERUP_CONFIG.speed.stackBonus;
  const baseSpeed = clamp(270 - player.radius * 1.22 + tinyBoost, 95, 285);
  const speed = clamp(baseSpeed * boostMultiplier, 95, 435);
  player.vx += (targetVx * speed - player.vx) * Math.min(1, dt * 9);
  player.vy += (targetVy * speed - player.vy) * Math.min(1, dt * 9);
  player.x = clamp(player.x + player.vx * dt, player.radius, WORLD.width - player.radius);
  player.y = clamp(player.y + player.vy * dt, player.radius, WORLD.height - player.radius);
}

function nearestFood(cell) {
  let best = null;
  let bestD = Infinity;
  for (const food of state.foods) {
    const d = (food.x - cell.x) ** 2 + (food.y - cell.y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = food;
    }
  }
  return best;
}

function updateBots(dt) {
  const bots = state.boss ? [...state.bots, state.boss] : state.bots;
  for (const bot of bots) {
    if (!bot.alive) continue;
    const boss = bot === state.boss;
    bot.angle += dt * (boss ? 0.18 : 0.5 + bot.mood);
    let steerX = Math.cos(bot.angle) * 0.25;
    let steerY = Math.sin(bot.angle) * 0.25;
    const player = state.player;
    const playerD = Math.max(1, distance(bot, player));

    if (boss && playerD < 900) {
      const dx = player.x - bot.x;
      const dy = player.y - bot.y;
      const sign = bot.mass > player.mass * 1.03 ? 1.05 : -0.8;
      steerX += (dx / playerD) * sign;
      steerY += (dy / playerD) * sign;
    } else if (playerD < 620) {
      const dx = player.x - bot.x;
      const dy = player.y - bot.y;
      let sign = bot.mass > player.mass * 1.08 ? 1.15 : -1.4;
      if (bot.persona === "bully") sign = bot.mass > player.mass * 0.78 ? 1.35 : -1.1;
      if (bot.persona === "coward") sign = -1.6;
      if (bot.persona === "snacker") sign *= 0.45;
      if (bot.persona === "revenge" && bot.revengeTimer > 0) sign = 1.55;
      if (state.activeModifier === "panic") sign = player.mass > bot.mass ? -1.8 : 1.45;
      if (state.activeMode === "swarm") sign += Math.max(0, 1 - state.timeLeft / state.roundLength) * 0.9;
      steerX += (dx / playerD) * sign;
      steerY += (dy / playerD) * sign;
    } else {
      const food = nearestFood(bot);
      if (food) {
        const d = distance(bot, food) || 1;
        steerX += ((food.x - bot.x) / d) * 0.7;
        steerY += ((food.y - bot.y) / d) * 0.7;
      }
    }

    if (bot.persona === "wobbler") {
      steerX += Math.sin(performance.now() * 0.004 + bot.mood * 9) * 0.85;
      steerY += Math.cos(performance.now() * 0.003 + bot.mood * 7) * 0.85;
    }
    if (bot.revengeTimer > 0) bot.revengeTimer -= dt;
    const mag = Math.hypot(steerX, steerY) || 1;
    const speed = clamp((boss ? 190 : 240) - bot.radius * 1.15, boss ? 55 : 75, boss ? 150 : 230);
    bot.vx += ((steerX / mag) * speed - bot.vx) * Math.min(1, dt * 4);
    bot.vy += ((steerY / mag) * speed - bot.vy) * Math.min(1, dt * 4);
    bot.x = clamp(bot.x + bot.vx * dt, bot.radius, WORLD.width - bot.radius);
    bot.y = clamp(bot.y + bot.vy * dt, bot.radius, WORLD.height - bot.radius);
  }
}

function updateCollections() {
  const eatFood = (cell) => {
    for (let i = state.foods.length - 1; i >= 0; i -= 1) {
      const food = state.foods[i];
      if (distance(cell, food) < cell.radius - food.r * 0.25) {
        collect(cell, food, food.mass, food.color, cell.isPlayer ? 5 : 1);
        state.foods[i] = makeFood();
      }
    }
  };

  eatFood(state.player);
  for (const bot of state.bots) eatFood(bot);

  for (let i = state.props.length - 1; i >= 0; i -= 1) {
    const prop = state.props[i];
    const canEat = state.player.mass > prop.mass * (state.activeMode === "tiny" ? 1.2 : 0.75);
    if (canEat && distance(state.player, prop) < state.player.radius - prop.r * 0.1) {
      let massGain = prop.mass * 0.45;
      if (prop.gold) {
        massGain *= 2.8;
        popup("GOLD", prop.x, prop.y, COLORS.gold);
      }
      if (state.activeMode === "hunt" && prop.name === state.huntTargets[state.huntIndex]) {
        massGain *= 2.1;
        state.huntIndex = (state.huntIndex + 1) % state.huntTargets.length;
        popup("HUNT", prop.x, prop.y, COLORS.blue);
      }
      if (state.activeModifier === "combo") {
        const expected = state.huntTargets[state.comboIndex];
        if (prop.name === expected) {
          massGain *= 1.7 + state.comboIndex * 0.35;
          state.comboIndex = (state.comboIndex + 1) % state.huntTargets.length;
          popup("COMBO", prop.x, prop.y, COLORS.mint);
        } else {
          state.comboIndex = 0;
        }
      }
      prop.flash = 1;
      collect(state.player, prop, massGain, prop.color, prop.gold ? 24 : 12);
      state.props[i] = makeProp();
    }
  }

  const actors = [state.player, ...state.bots.filter((bot) => bot.alive)];
  if (state.boss) actors.push(state.boss);
  for (let i = 0; i < actors.length; i += 1) {
    for (let j = i + 1; j < actors.length; j += 1) {
      const a = actors[i];
      const b = actors[j];
      const d = distance(a, b);
      const big = a.mass > b.mass ? a : b;
      const small = big === a ? b : a;
      if (big.mass > small.mass * 1.12 && d < big.radius - small.radius * 0.28) {
        collect(big, small, small.mass * 0.72, small.color, 20);
        if (small === state.boss) {
          popup("BOSS DOWN", small.x, small.y, COLORS.violet);
          state.boss = null;
          state.shake = 8;
          continue;
        }
        if (small.isPlayer) {
          endGame(true);
          return;
        }
        if (small.persona === "revenge") small.revengeTimer = 10;
        small.x = random(240, WORLD.width - 240);
        small.y = random(240, WORLD.height - 240);
        small.mass = random(14, 45);
        small.radius = radiusFromMass(small.mass);
        small.vx = 0;
        small.vy = 0;
      }
    }
  }
}

function updateParticles(dt) {
  for (let i = state.particles.length - 1; i >= 0; i -= 1) {
    const p = state.particles[i];
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 1 - dt * 4;
    p.vy *= 1 - dt * 4;
    if (p.life <= 0) state.particles.splice(i, 1);
  }
}

function updatePopups(dt) {
  for (let i = state.popups.length - 1; i >= 0; i -= 1) {
    const p = state.popups[i];
    p.life -= dt;
    p.y += p.vy * dt;
    if (p.life <= 0) state.popups.splice(i, 1);
  }
}

function updatePowerups(dt) {
  if (!state.activePowerups) return;

  for (let i = state.speedStacks.length - 1; i >= 0; i -= 1) {
    state.speedStacks[i] -= dt;
    if (state.speedStacks[i] <= 0) state.speedStacks.splice(i, 1);
  }

  state.powerupSpawnTimer -= dt;
  if (state.powerupSpawnTimer <= 0) {
    spawnPowerup("speed");
    state.powerupSpawnTimer = random(...POWERUP_CONFIG.speed.respawnWindow);
  }

  for (let i = state.powerups.length - 1; i >= 0; i -= 1) {
    const powerup = state.powerups[i];
    powerup.life -= dt;
    powerup.angle += dt * powerup.spin;
    powerup.pulse += dt * 2.4;
    if (powerup.life <= 0) {
      state.powerups.splice(i, 1);
      continue;
    }
    if (distance(state.player, powerup) < state.player.radius + powerup.r * 0.72) {
      const stacks = pushSpeedStack();
      burst(powerup.x, powerup.y, POWERUP_CONFIG.speed.color, 18, 1.25);
      popup(`BOOST x${stacks}`, powerup.x, powerup.y - 10, POWERUP_CONFIG.speed.color);
      state.shake = Math.min(8, state.shake + 1.2);
      state.powerups.splice(i, 1);
    }
  }
}

function updateModifiers(dt) {
  if (state.noticeTimer > 0) state.noticeTimer -= dt;
  if (state.magnetTimer > 0) {
    state.magnetTimer -= dt;
    for (const food of state.foods) {
      const d = distance(food, state.player);
      if (d > 1 && d < state.player.radius + 260) {
        const pull = (1 - d / (state.player.radius + 260)) * 460 * dt;
        food.x += ((state.player.x - food.x) / d) * pull;
        food.y += ((state.player.y - food.y) / d) * pull;
      }
    }
  }
  if (state.activeModifier === "gold") {
    state.goldTimer -= dt;
    state.goldCooldown -= dt;
    if (state.goldTimer <= 0) {
      for (const prop of state.props) prop.gold = false;
    }
    if (state.goldCooldown <= 0) {
      state.goldTimer = 9;
      state.goldCooldown = 22;
      seedGoldProps();
      popup("GOLD RUSH", state.player.x, state.player.y - state.player.radius, COLORS.gold);
    }
  }
  if (state.activeModifier === "shrink") {
    for (const hazard of state.hazards) {
      hazard.pulse += dt;
      const d = distance(hazard, state.player);
      if (d < hazard.r + state.player.radius * 0.35) {
        state.player.mass = Math.max(6, state.player.mass - dt * 5.2);
        state.player.radius = radiusFromMass(state.player.mass);
      }
    }
  }
}

function update(dt) {
  if (state.mode !== "playing" || state.paused) return;
  state.timeLeft -= dt;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    endGame(false);
    return;
  }
  state.chainTimer -= dt;
  if (state.chainTimer <= 0) state.chain = 0;
  state.shake = Math.max(0, state.shake - dt * 12);

  updatePlayer(dt);
  updateBots(dt);
  updateCollections();
  updateParticles(dt);
  updatePopups(dt);
  updatePowerups(dt);
  updateModifiers(dt);

  const player = state.player;
  const targetZoom = clamp(1.25 - player.radius / 270, 0.52, 1.05);
  state.camera.x += (player.x - state.camera.x) * Math.min(1, dt * 5);
  state.camera.y += (player.y - state.camera.y) * Math.min(1, dt * 5);
  state.camera.zoom += (targetZoom - state.camera.zoom) * Math.min(1, dt * 3);
  updateHud();
}

function updateHud() {
  const masses = [
    state.player.mass,
    ...state.bots.map((bot) => bot.mass),
    ...(state.boss ? [state.boss.mass] : []),
  ].sort((a, b) => b - a);
  const rank = masses.findIndex((mass) => mass <= state.player.mass) + 1;
  massLabel.textContent = Math.round(state.player.mass).toString();
  rankLabel.textContent = `${rank}/${masses.length}`;
  const minutes = Math.floor(state.timeLeft / 60).toString().padStart(2, "0");
  const seconds = Math.floor(state.timeLeft % 60).toString().padStart(2, "0");
  timeLabel.textContent = `${minutes}:${seconds}`;
  if (state.activeMode === "hunt" && state.huntTargets.length) {
    runInfoLabel.textContent = state.huntTargets[state.huntIndex];
  } else if (state.activeModifier === "combo" && state.huntTargets.length) {
    runInfoLabel.textContent = `${state.comboIndex + 1}/${state.huntTargets.length}`;
  } else {
    runInfoLabel.textContent = MODES[state.activeMode].name;
  }

  boostCard.classList.toggle("is-hidden", !state.activePowerups);
  boostCard.classList.toggle("is-live", state.speedStacks.length > 0);
  if (!state.activePowerups) return;
  if (state.speedStacks.length > 0) {
    boostStatusLabel.textContent = `x${state.speedStacks.length} ${Math.ceil(Math.max(...state.speedStacks))}s`;
  } else if (state.powerups.length > 0) {
    boostStatusLabel.textContent = `Field ${state.powerups.length}`;
  } else if (state.powerupSpawnTimer < 2.5) {
    boostStatusLabel.textContent = "Soon";
  } else {
    boostStatusLabel.textContent = "Seeding";
  }
}

function beginWorld() {
  const shakeX = random(-state.shake, state.shake);
  const shakeY = random(-state.shake, state.shake);
  ctx.save();
  ctx.translate(window.innerWidth / 2 + shakeX, window.innerHeight / 2 + shakeY);
  ctx.scale(state.camera.zoom, state.camera.zoom);
  ctx.translate(-state.camera.x, -state.camera.y);
}

function endWorld() {
  ctx.restore();
}

function viewBounds(pad = 0) {
  const halfW = window.innerWidth / state.camera.zoom / 2 + pad;
  const halfH = window.innerHeight / state.camera.zoom / 2 + pad;
  return {
    left: state.camera.x - halfW,
    right: state.camera.x + halfW,
    top: state.camera.y - halfH,
    bottom: state.camera.y + halfH,
  };
}

function drawGrid() {
  const map = MAPS[state.activeMap] || MAPS.city;
  ctx.fillStyle = map.paper;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  beginWorld();
  ctx.strokeStyle = map.grid;
  ctx.lineWidth = 1 / state.camera.zoom;
  const step = 110;
  const left = Math.floor((state.camera.x - window.innerWidth / state.camera.zoom) / step) * step;
  const right = state.camera.x + window.innerWidth / state.camera.zoom;
  const top = Math.floor((state.camera.y - window.innerHeight / state.camera.zoom) / step) * step;
  const bottom = state.camera.y + window.innerHeight / state.camera.zoom;
  ctx.beginPath();
  for (let x = left; x <= right; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, WORLD.height);
  }
  for (let y = top; y <= bottom; y += step) {
    ctx.moveTo(0, y);
    ctx.lineTo(WORLD.width, y);
  }
  ctx.stroke();
  ctx.strokeStyle = map.border || COLORS.ink;
  ctx.lineWidth = 4 / state.camera.zoom;
  ctx.strokeRect(0, 0, WORLD.width, WORLD.height);
  endWorld();
}

function inView(item, pad = 120) {
  const bounds = viewBounds(pad);
  return item.x > bounds.left && item.x < bounds.right && item.y > bounds.top && item.y < bounds.bottom;
}

function drawFood(food, now) {
  const r = food.r + Math.sin(now * 0.004 + food.pulse) * 1.2;
  ctx.beginPath();
  ctx.arc(food.x, food.y, r, 0, TAU);
  ctx.fillStyle = food.color;
  ctx.fill();
}

function drawPowerup(powerup, now) {
  const config = POWERUP_CONFIG[powerup.kind];
  const pulse = Math.sin(now * 0.006 + powerup.pulse);
  ctx.save();
  ctx.translate(powerup.x, powerup.y);
  ctx.rotate(powerup.angle);
  ctx.globalAlpha = clamp(powerup.life / 2.2, 0.32, 1);
  ctx.strokeStyle = config.color;
  ctx.fillStyle = `${config.accent}26`;
  ctx.lineWidth = 3.4 / state.camera.zoom;
  ctx.beginPath();
  ctx.arc(0, 0, powerup.r + 10 + pulse * 3, 0, TAU);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, powerup.r, 0, TAU);
  ctx.fill();
  ctx.stroke();
  ctx.lineWidth = 4 / state.camera.zoom;
  ctx.beginPath();
  ctx.moveTo(-7, 4);
  ctx.lineTo(0, -6);
  ctx.lineTo(7, 4);
  ctx.moveTo(-7, 13);
  ctx.lineTo(0, 3);
  ctx.lineTo(7, 13);
  ctx.stroke();
  ctx.restore();
}

function lineWidth(size = 2) {
  return size / state.camera.zoom;
}

function drawPanelRect(x, y, w, h, color, fillAlpha = 0.05) {
  ctx.fillStyle = `${color}16`;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth(3);
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - h / 2, w, h, 18);
  ctx.fill();
  ctx.stroke();
}

function drawMapPattern(now) {
  const map = state.activeMap;
  const bounds = viewBounds(180);
  ctx.save();
  ctx.lineWidth = lineWidth(2);
  if (map === "city") {
    ctx.fillStyle = "rgba(29, 33, 29, 0.055)";
    for (let x = 520; x < WORLD.width; x += 820) ctx.fillRect(x - 46, 0, 92, WORLD.height);
    for (let y = 520; y < WORLD.height; y += 820) ctx.fillRect(0, y - 46, WORLD.width, 92);
    ctx.strokeStyle = "rgba(29, 33, 29, 0.18)";
    ctx.setLineDash([36, 34]);
    ctx.beginPath();
    for (let x = 520; x < WORLD.width; x += 820) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, WORLD.height);
    }
    for (let y = 520; y < WORLD.height; y += 820) {
      ctx.moveTo(0, y);
      ctx.lineTo(WORLD.width, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (map === "desk") {
    ctx.strokeStyle = "rgba(39, 116, 169, 0.14)";
    ctx.beginPath();
    for (let y = Math.floor(bounds.top / 92) * 92; y < bounds.bottom; y += 92) {
      ctx.moveTo(bounds.left, y);
      ctx.lineTo(bounds.right, y);
    }
    ctx.stroke();
    ctx.strokeStyle = "rgba(223, 63, 45, 0.16)";
    ctx.beginPath();
    for (let x = 360; x < WORLD.width; x += 1120) {
      ctx.moveTo(x, bounds.top);
      ctx.lineTo(x, bounds.bottom);
    }
    ctx.stroke();
  } else if (map === "kitchen") {
    ctx.strokeStyle = "rgba(74, 54, 30, 0.14)";
    ctx.beginPath();
    const tile = 280;
    for (let x = Math.floor(bounds.left / tile) * tile; x < bounds.right; x += tile) {
      ctx.moveTo(x, bounds.top);
      ctx.lineTo(x, bounds.bottom);
    }
    for (let y = Math.floor(bounds.top / tile) * tile; y < bounds.bottom; y += tile) {
      ctx.moveTo(bounds.left, y);
      ctx.lineTo(bounds.right, y);
    }
    ctx.stroke();
  } else if (map === "arcade") {
    ctx.strokeStyle = "rgba(117, 86, 168, 0.18)";
    ctx.lineWidth = lineWidth(5);
    ctx.beginPath();
    for (let x = -WORLD.height; x < WORLD.width; x += 420) {
      ctx.moveTo(x, WORLD.height);
      ctx.lineTo(x + WORLD.height, 0);
    }
    ctx.stroke();
    ctx.strokeStyle = "rgba(232, 63, 111, 0.14)";
    ctx.lineWidth = lineWidth(2);
    ctx.beginPath();
    for (let x = 0; x < WORLD.width; x += 700) {
      ctx.moveTo(x, bounds.top);
      ctx.lineTo(x + Math.sin(now * 0.001) * 60, bounds.bottom);
    }
    ctx.stroke();
  } else if (map === "garden") {
    ctx.strokeStyle = "rgba(47, 155, 98, 0.2)";
    ctx.lineWidth = lineWidth(4);
    for (let y = 460; y < WORLD.height; y += 620) {
      ctx.beginPath();
      ctx.moveTo(bounds.left, y);
      for (let x = bounds.left; x < bounds.right; x += 260) {
        ctx.quadraticCurveTo(x + 130, y + Math.sin(x * 0.006 + now * 0.001) * 80, x + 260, y);
      }
      ctx.stroke();
    }
  } else if (map === "toy") {
    ctx.strokeStyle = "rgba(29, 33, 29, 0.12)";
    ctx.lineWidth = lineWidth(7);
    ctx.beginPath();
    for (let y = 640; y < WORLD.height; y += 900) {
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(900, y - 260, 1550, y + 260, 2400, y);
      ctx.bezierCurveTo(3160, y - 220, 3720, y + 180, WORLD.width, y - 40);
    }
    ctx.stroke();
    ctx.strokeStyle = "rgba(201, 152, 33, 0.18)";
    ctx.lineWidth = lineWidth(3);
    ctx.strokeRect(540, 540, WORLD.width - 1080, WORLD.height - 1080);
  }
  ctx.restore();
}

function drawLandmark(item, now) {
  if (!inView(item, Math.max(item.w || item.r || 0, item.h || item.r || 0) + 180)) return;
  ctx.save();
  ctx.globalAlpha = 0.72;
  if (item.type === "block") {
    drawPanelRect(item.x, item.y, item.w, item.h, item.color);
    ctx.strokeStyle = item.color;
    ctx.lineWidth = lineWidth(2);
    for (let i = -1; i <= 1; i += 1) {
      ctx.strokeRect(item.x - item.w / 2 + 80 + i * 120, item.y - item.h / 2 + 70, 58, 58);
    }
  } else if (item.type === "roundabout") {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = lineWidth(5);
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.r, 0, TAU);
    ctx.arc(item.x, item.y, item.r * 0.45, 0, TAU);
    ctx.stroke();
  } else if (item.type === "park" || item.type === "bed") {
    drawPanelRect(item.x, item.y, item.w, item.h, item.color);
    ctx.strokeStyle = item.color;
    ctx.lineWidth = lineWidth(2);
    for (let i = 0; i < 6; i += 1) {
      const px = item.x - item.w / 2 + 80 + i * (item.w - 160) / 5;
      ctx.beginPath();
      ctx.arc(px, item.y + Math.sin(i) * 70, 28, 0, TAU);
      ctx.stroke();
    }
  } else if (item.type === "notebook") {
    drawPanelRect(item.x, item.y, item.w, item.h, item.color);
    ctx.strokeStyle = item.color;
    ctx.lineWidth = lineWidth(1.5);
    for (let y = item.y - item.h / 2 + 80; y < item.y + item.h / 2 - 40; y += 70) {
      ctx.beginPath();
      ctx.moveTo(item.x - item.w / 2 + 80, y);
      ctx.lineTo(item.x + item.w / 2 - 70, y);
      ctx.stroke();
    }
  } else if (item.type === "sticky") {
    drawPanelRect(item.x, item.y, item.w, item.h, item.color, 0.08);
    ctx.beginPath();
    ctx.moveTo(item.x + item.w / 2 - 90, item.y - item.h / 2);
    ctx.lineTo(item.x + item.w / 2, item.y - item.h / 2 + 90);
    ctx.stroke();
  } else if (item.type === "keyboard") {
    drawPanelRect(item.x, item.y, item.w, item.h, item.color);
    ctx.strokeStyle = item.color;
    for (let x = item.x - item.w / 2 + 80; x < item.x + item.w / 2 - 80; x += 120) {
      for (let y = item.y - item.h / 2 + 90; y < item.y + item.h / 2 - 70; y += 110) {
        ctx.strokeRect(x, y, 72, 54);
      }
    }
  } else if (item.type === "coffee" || item.type === "token-ring") {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = lineWidth(5);
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.r, 0, TAU);
    ctx.arc(item.x, item.y, item.r * 0.62, 0, TAU);
    ctx.stroke();
  } else if (item.type === "pen") {
    ctx.translate(item.x, item.y);
    ctx.rotate(-0.22);
    drawPanelRect(0, 0, item.w, item.h, item.color);
    ctx.strokeStyle = item.color;
    ctx.beginPath();
    ctx.moveTo(item.w / 2, 0);
    ctx.lineTo(item.w / 2 + 130, -item.h / 2);
    ctx.lineTo(item.w / 2 + 130, item.h / 2);
    ctx.closePath();
    ctx.stroke();
  } else if (item.type === "counter" || item.type === "cutting" || item.type === "table") {
    drawPanelRect(item.x, item.y, item.w, item.h, item.color);
    ctx.strokeStyle = item.color;
    ctx.beginPath();
    ctx.moveTo(item.x - item.w / 2 + 70, item.y);
    ctx.lineTo(item.x + item.w / 2 - 70, item.y);
    ctx.moveTo(item.x, item.y - item.h / 2 + 60);
    ctx.lineTo(item.x, item.y + item.h / 2 - 60);
    ctx.stroke();
  } else if (item.type === "stove") {
    drawPanelRect(item.x, item.y, item.w, item.h, item.color);
    ctx.strokeStyle = item.color;
    for (const dx of [-170, 170]) for (const dy of [-120, 120]) {
      ctx.beginPath();
      ctx.arc(item.x + dx, item.y + dy, 82, 0, TAU);
      ctx.arc(item.x + dx, item.y + dy, 42, 0, TAU);
      ctx.stroke();
    }
  } else if (item.type === "sink" || item.type === "pond") {
    drawPanelRect(item.x, item.y, item.w, item.h, item.color);
    ctx.strokeStyle = item.color;
    ctx.beginPath();
    ctx.ellipse(item.x, item.y, item.w * 0.34, item.h * 0.28, 0, 0, TAU);
    ctx.stroke();
  } else if (item.type === "lane" || item.type === "cabinet") {
    drawPanelRect(item.x, item.y, item.w, item.h, item.color);
    ctx.strokeStyle = item.color;
    ctx.lineWidth = lineWidth(4);
    ctx.beginPath();
    ctx.moveTo(item.x - item.w / 2 + 80, item.y - item.h / 2 + 90);
    ctx.lineTo(item.x + item.w / 2 - 80, item.y + item.h / 2 - 90);
    ctx.moveTo(item.x + item.w / 2 - 80, item.y - item.h / 2 + 90);
    ctx.lineTo(item.x - item.w / 2 + 80, item.y + item.h / 2 - 90);
    ctx.stroke();
  } else if (item.type === "tree") {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = lineWidth(5);
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.r, 0, TAU);
    ctx.arc(item.x - 130, item.y + 80, item.r * 0.42, 0, TAU);
    ctx.arc(item.x + 120, item.y - 90, item.r * 0.38, 0, TAU);
    ctx.stroke();
  } else if (item.type === "vine") {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = lineWidth(6);
    ctx.beginPath();
    ctx.moveTo(item.x - item.w / 2, item.y);
    ctx.bezierCurveTo(item.x - 450, item.y - item.h / 2, item.x + 450, item.y + item.h / 2, item.x + item.w / 2, item.y);
    ctx.stroke();
    for (let i = 0; i < 8; i += 1) {
      const lx = item.x - item.w / 2 + i * item.w / 7;
      ctx.beginPath();
      ctx.ellipse(lx, item.y + Math.sin(i + now * 0.001) * 180, 55, 24, i, 0, TAU);
      ctx.stroke();
    }
  } else if (item.type === "rug") {
    drawPanelRect(item.x, item.y, item.w, item.h, item.color);
    ctx.strokeStyle = item.color;
    ctx.strokeRect(item.x - item.w / 2 + 120, item.y - item.h / 2 + 120, item.w - 240, item.h - 240);
  } else if (item.type === "track") {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = lineWidth(7);
    ctx.beginPath();
    ctx.ellipse(item.x, item.y, item.w / 2, item.h / 2, 0.18, 0, TAU);
    ctx.ellipse(item.x, item.y, item.w / 2 - 120, item.h / 2 - 100, 0.18, 0, TAU);
    ctx.stroke();
  } else if (item.type === "blocks") {
    for (let i = 0; i < 6; i += 1) {
      const bx = item.x - item.w / 2 + 90 + (i % 3) * 250;
      const by = item.y - item.h / 2 + 90 + Math.floor(i / 3) * 240;
      drawPanelRect(bx, by, 180, 150, [COLORS.red, COLORS.blue, COLORS.gold][i % 3]);
    }
  } else if (item.type === "castle-landmark" || item.type === "dice-landmark") {
    drawPanelRect(item.x, item.y, item.w, item.h, item.color);
    ctx.strokeStyle = item.color;
    for (let i = -1; i <= 1; i += 1) {
      ctx.strokeRect(item.x + i * 160 - 55, item.y - item.h / 2 - 80, 110, 120);
    }
    if (item.type === "dice-landmark") {
      for (const dx of [-130, 130]) for (const dy of [-130, 130]) {
        ctx.beginPath();
        ctx.arc(item.x + dx, item.y + dy, 26, 0, TAU);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawMapIdentity(now) {
  drawMapPattern(now);
  for (const landmark of state.landmarks) drawLandmark(landmark, now);
}

function drawProp(prop, now) {
  const canEat = state.player.mass > prop.mass * (state.activeMode === "tiny" ? 1.2 : 0.75);
  const huntTarget =
    (state.activeMode === "hunt" && prop.name === state.huntTargets[state.huntIndex]) ||
    (state.activeModifier === "combo" && prop.name === state.huntTargets[state.comboIndex]);
  const alpha = canEat ? 0.95 : 0.36;
  const wobble = Math.sin(now * 0.002 + prop.wobble) * (huntTarget || prop.gold ? 0.16 : 0.05);
  ctx.save();
  ctx.translate(prop.x, prop.y);
  ctx.rotate(prop.angle + wobble);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = prop.gold ? COLORS.gold : prop.color;
  ctx.lineWidth = (prop.gold || huntTarget ? 5 : 3) / state.camera.zoom;
  ctx.beginPath();
  for (let i = 0; i < prop.sides; i += 1) {
    const angle = -Math.PI / 2 + (i / prop.sides) * TAU;
    const x = Math.cos(angle) * prop.r;
    const y = Math.sin(angle) * prop.r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  if (prop.gold || huntTarget) {
    ctx.beginPath();
    ctx.arc(0, 0, prop.r + 9 + Math.sin(now * 0.008) * 3, 0, TAU);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  if (!canEat) {
    ctx.fillStyle = COLORS.ink;
    ctx.font = `${Math.max(10, 12 / state.camera.zoom)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(Math.ceil(prop.mass * 0.75), 0, 4);
  }
  ctx.restore();
}

function drawCell(cell, now) {
  const pulse = Math.sin(now * 0.005 + cell.mood * TAU) * 1.5;
  ctx.save();
  ctx.translate(cell.x, cell.y);
  ctx.strokeStyle = cell.color;
  ctx.fillStyle = cell.isPlayer ? "rgba(223, 63, 45, 0.08)" : "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = (cell.isPlayer ? 5 : 3) / state.camera.zoom;
  ctx.beginPath();
  ctx.arc(0, 0, cell.radius + pulse, 0, TAU);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = COLORS.ink;
  ctx.globalAlpha = 0.22;
  ctx.lineWidth = 1.5 / state.camera.zoom;
  if (cell.isPlayer && cell.mark === "spark") {
    const markSize = Math.max(8, cell.radius * 0.48);
    ctx.beginPath();
    ctx.moveTo(-markSize, 0);
    ctx.lineTo(markSize, 0);
    ctx.moveTo(0, -markSize);
    ctx.lineTo(0, markSize);
    ctx.stroke();
  } else if (cell.isPlayer && cell.mark === "core") {
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(5, cell.radius * 0.24), 0, TAU);
    ctx.fillStyle = COLORS.ink;
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(5, cell.radius * 0.48), 0, TAU);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  if (cell.radius > 22) {
    ctx.fillStyle = COLORS.ink;
    ctx.font = `${clamp(cell.radius * 0.28, 10, 19)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(cell.name, 0, 0);
  }
  ctx.restore();
}

function drawParticles() {
  for (const p of state.particles) {
    const alpha = clamp(p.life / p.maxLife, 0, 1);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * alpha, 0, TAU);
    ctx.fillStyle = p.color;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawHazards(now) {
  if (!state.hazards.length) return;
  ctx.save();
  ctx.strokeStyle = "rgba(223, 63, 45, 0.55)";
  ctx.fillStyle = "rgba(223, 63, 45, 0.08)";
  ctx.lineWidth = 3 / state.camera.zoom;
  for (const hazard of state.hazards) {
    const pulse = Math.sin(now * 0.004 + hazard.pulse) * 10;
    ctx.beginPath();
    ctx.arc(hazard.x, hazard.y, hazard.r + pulse, 0, TAU);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawPopups() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${Math.max(14, 18 / state.camera.zoom)}px sans-serif`;
  for (const p of state.popups) {
    ctx.globalAlpha = clamp(p.life, 0, 1);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawTouchGuide() {
  if (!state.pointer.active || state.mode !== "playing") return;
  const world = screenToWorld(state.pointer.x, state.pointer.y);
  const player = state.player;
  beginWorld();
  ctx.strokeStyle = "rgba(29, 33, 29, 0.28)";
  ctx.lineWidth = 2 / state.camera.zoom;
  ctx.setLineDash([10 / state.camera.zoom, 9 / state.camera.zoom]);
  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(world.x, world.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(world.x, world.y, 16 / state.camera.zoom, 0, TAU);
  ctx.stroke();
  endWorld();
}

function render(now = 0) {
  drawGrid();
  beginWorld();
  drawMapIdentity(now);
  drawHazards(now);
  for (const food of state.foods) if (inView(food, 50)) drawFood(food, now);
  for (const powerup of state.powerups) if (inView(powerup, 90)) drawPowerup(powerup, now);
  for (const prop of state.props) if (inView(prop, 90)) drawProp(prop, now);
  for (const bot of state.bots) if (inView(bot, 160)) drawCell(bot, now);
  if (state.boss && inView(state.boss, 260)) drawCell(state.boss, now);
  drawCell(state.player || { x: WORLD.width / 2, y: WORLD.height / 2, radius: 25, color: COLORS.red, mood: 0, name: "YOU" }, now);
  drawParticles();
  drawPopups();
  endWorld();
  drawTouchGuide();

  if (state.mode === "playing" && state.chain > 2) {
    ctx.fillStyle = COLORS.ink;
    ctx.font = "700 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${state.chain} chain`, window.innerWidth / 2, window.innerHeight - 34);
  }
  if (state.mode === "playing" && state.noticeTimer > 0) {
    ctx.fillStyle = COLORS.ink;
    ctx.font = "800 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(state.modeNotice, window.innerWidth / 2, 92);
  }
  if (state.mode === "playing" && state.activeModifier === "magnet" && state.magnetTimer > 0) {
    ctx.fillStyle = COLORS.blue;
    ctx.font = "800 15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Magnet ${Math.ceil(state.magnetTimer)}`, window.innerWidth / 2, window.innerHeight - 58);
  }
  if (state.mode === "playing" && state.speedStacks.length > 0) {
    ctx.fillStyle = POWERUP_CONFIG.speed.color;
    ctx.font = "800 15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      `Boost x${state.speedStacks.length} ${Math.ceil(Math.max(...state.speedStacks))}s`,
      window.innerWidth / 2,
      window.innerHeight - 80,
    );
  }
}

function loop(now) {
  const dt = Math.min(0.033, (now - state.lastTime) / 1000 || 0);
  state.lastTime = now;
  update(dt);
  render(now);
  state.animationId = requestAnimationFrame(loop);
}

durationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedMinutes = Number(button.dataset.minutes);
    durationButtons.forEach((item) => item.classList.toggle("is-active", item === button));
  });
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedMode = button.dataset.mode;
    modeButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    modeSelect.value = state.selectedMode;
    syncMenuSummaries();
  });
});

mapButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedMap = button.dataset.map;
    mapButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    mapSelect.value = state.selectedMap;
    state.activeMap = state.selectedMap;
    syncMenuSummaries();
  });
});

modifierButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedModifier = button.dataset.modifier;
    modifierButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    modifierSelect.value = state.selectedModifier;
    syncMenuSummaries();
  });
});

powerupButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedPowerups = button.dataset.powerups === "on";
    powerupButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    syncMenuSummaries();
  });
});

modeSelect.addEventListener("change", () => {
  state.selectedMode = modeSelect.value;
  modeButtons.forEach((item) =>
    item.classList.toggle("is-active", item.dataset.mode === state.selectedMode),
  );
  syncMenuSummaries();
});

mapSelect.addEventListener("change", () => {
  state.selectedMap = mapSelect.value;
  state.activeMap = state.selectedMap;
  mapButtons.forEach((item) =>
    item.classList.toggle("is-active", item.dataset.map === state.selectedMap),
  );
  syncMenuSummaries();
});

modifierSelect.addEventListener("change", () => {
  state.selectedModifier = modifierSelect.value;
  modifierButtons.forEach((item) =>
    item.classList.toggle("is-active", item.dataset.modifier === state.selectedModifier),
  );
  syncMenuSummaries();
});

surpriseButton.addEventListener("click", () => {
  const mode = pick(Object.keys(MODES));
  const map = pick(Object.keys(MAPS));
  const modifier = pick(Object.keys(MODIFIERS));
  state.selectedMode = mode;
  state.selectedMap = map;
  state.selectedModifier = modifier;
  modeSelect.value = mode;
  mapSelect.value = map;
  modifierSelect.value = modifier;
  modeButtons.forEach((item) => item.classList.toggle("is-active", item.dataset.mode === mode));
  mapButtons.forEach((item) => item.classList.toggle("is-active", item.dataset.map === map));
  modifierButtons.forEach((item) =>
    item.classList.toggle("is-active", item.dataset.modifier === modifier),
  );
  syncMenuSummaries();
  startGame();
});

swatchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.custom.color = button.dataset.color;
    swatchButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    if (state.mode === "menu" && state.player) state.player.color = state.custom.color;
    syncMenuSummaries();
  });
});

markButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.custom.mark = button.dataset.mark;
    markButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    if (state.mode === "menu" && state.player) state.player.mark = state.custom.mark;
    syncMenuSummaries();
  });
});

playerNameInput.addEventListener("input", syncMenuSummaries);

startButton.addEventListener("click", startGame);
againButton.addEventListener("click", startGame);
stopButton.addEventListener("click", openPauseMenu);
resumeButton.addEventListener("click", resumeGame);
restartButton.addEventListener("click", startGame);
mainMenuButton.addEventListener("click", showMainMenu);
summaryMenuButton.addEventListener("click", showMainMenu);

window.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button")) return;
  state.pointer.active = true;
  state.pointer.x = event.clientX;
  state.pointer.y = event.clientY;
});

window.addEventListener("pointermove", (event) => {
  state.pointer.x = event.clientX;
  state.pointer.y = event.clientY;
});

window.addEventListener("pointerup", () => {
  state.pointer.active = false;
});

window.addEventListener("pointercancel", () => {
  state.pointer.active = false;
});

window.addEventListener("keydown", (event) => {
  state.keys.add(event.code);
  if (event.code === "Space" && state.mode === "playing") {
    if (state.paused) resumeGame();
    else openPauseMenu();
  }
});

window.addEventListener("keyup", (event) => {
  state.keys.delete(event.code);
});

window.addEventListener("resize", resize);
window.addEventListener("resize", syncMenuDisclosureLayout);

resize();
syncMenuDisclosureLayout();
syncMenuSummaries();
resetGame();
render();
state.animationId = requestAnimationFrame(loop);
