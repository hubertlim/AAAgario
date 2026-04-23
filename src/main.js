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
const surpriseButton = document.querySelector("#surprise");
const modeSelect = document.querySelector("#mode-select");
const mapSelect = document.querySelector("#map-select");
const modifierSelect = document.querySelector("#modifier-select");
const swatchButtons = [...document.querySelectorAll(".swatch")];
const markButtons = [...document.querySelectorAll(".mark")];
const playerNameInput = document.querySelector("#player-name");
const massLabel = document.querySelector("#mass");
const rankLabel = document.querySelector("#rank");
const timeLabel = document.querySelector("#time");
const runInfoLabel = document.querySelector("#run-info");
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
const MAPS = {
  city: {
    name: "City",
    paper: "#f7f4ea",
    grid: "rgba(29, 33, 29, 0.08)",
    food: [COLORS.mint, COLORS.blue, COLORS.gold, COLORS.red],
    props: [
      { name: "cone", mass: 9, r: 13, sides: 3, color: COLORS.gold },
      { name: "sign", mass: 18, r: 18, sides: 4, color: COLORS.blue },
      { name: "cart", mass: 35, r: 24, sides: 4, color: COLORS.mint },
      { name: "tower", mass: 70, r: 34, sides: 6, color: COLORS.violet },
      { name: "block", mass: 120, r: 46, sides: 4, color: COLORS.red },
    ],
  },
  desk: {
    name: "Desk",
    paper: "#f4f0e5",
    grid: "rgba(65, 62, 50, 0.08)",
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
    paper: "#fff5e5",
    grid: "rgba(74, 54, 30, 0.08)",
    food: ["#d94937", "#6c9d39", "#c99022", "#2b82a3"],
    props: [
      { name: "berry", mass: 7, r: 11, sides: 9, color: "#d94937" },
      { name: "spoon", mass: 20, r: 19, sides: 4, color: "#7d858a" },
      { name: "plate", mass: 38, r: 25, sides: 12, color: "#2b82a3" },
      { name: "pan", mass: 78, r: 36, sides: 8, color: "#282d31" },
      { name: "cake", mass: 128, r: 48, sides: 6, color: "#c99022" },
    ],
  },
  arcade: {
    name: "Arcade",
    paper: "#f4f2fb",
    grid: "rgba(47, 34, 82, 0.08)",
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
    paper: "#eff7e8",
    grid: "rgba(30, 79, 49, 0.08)",
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
    paper: "#f7f4ea",
    grid: "rgba(29, 33, 29, 0.07)",
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
  activeMode: "classic",
  activeMap: "city",
  activeModifier: "none",
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
  hazards: [],
  boss: null,
  huntTargets: [],
  huntIndex: 0,
  comboIndex: 0,
  magnetTimer: 0,
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
  state.hazards = state.activeModifier === "shrink" ? Array.from({ length: 4 }, makeHazard) : [];
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
  resetGame();
  state.mode = "playing";
  menu.classList.add("is-hidden");
  pauseMenu.classList.add("is-hidden");
  summary.classList.add("is-hidden");
  hud.classList.remove("is-hidden");
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
  const speed = clamp(270 - player.radius * 1.22 + tinyBoost, 95, 285);
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
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 4 / state.camera.zoom;
  ctx.strokeRect(0, 0, WORLD.width, WORLD.height);
  endWorld();
}

function inView(item, pad = 120) {
  const halfW = window.innerWidth / state.camera.zoom / 2 + pad;
  const halfH = window.innerHeight / state.camera.zoom / 2 + pad;
  return (
    item.x > state.camera.x - halfW &&
    item.x < state.camera.x + halfW &&
    item.y > state.camera.y - halfH &&
    item.y < state.camera.y + halfH
  );
}

function drawFood(food, now) {
  const r = food.r + Math.sin(now * 0.004 + food.pulse) * 1.2;
  ctx.beginPath();
  ctx.arc(food.x, food.y, r, 0, TAU);
  ctx.fillStyle = food.color;
  ctx.fill();
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
  drawHazards(now);
  for (const food of state.foods) if (inView(food, 50)) drawFood(food, now);
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
  });
});

mapButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedMap = button.dataset.map;
    mapButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    mapSelect.value = state.selectedMap;
    state.activeMap = state.selectedMap;
  });
});

modifierButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedModifier = button.dataset.modifier;
    modifierButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    modifierSelect.value = state.selectedModifier;
  });
});

modeSelect.addEventListener("change", () => {
  state.selectedMode = modeSelect.value;
  modeButtons.forEach((item) =>
    item.classList.toggle("is-active", item.dataset.mode === state.selectedMode),
  );
});

mapSelect.addEventListener("change", () => {
  state.selectedMap = mapSelect.value;
  state.activeMap = state.selectedMap;
  mapButtons.forEach((item) =>
    item.classList.toggle("is-active", item.dataset.map === state.selectedMap),
  );
});

modifierSelect.addEventListener("change", () => {
  state.selectedModifier = modifierSelect.value;
  modifierButtons.forEach((item) =>
    item.classList.toggle("is-active", item.dataset.modifier === state.selectedModifier),
  );
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
  startGame();
});

swatchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.custom.color = button.dataset.color;
    swatchButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    if (state.mode === "menu" && state.player) state.player.color = state.custom.color;
  });
});

markButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.custom.mark = button.dataset.mark;
    markButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    if (state.mode === "menu" && state.player) state.player.mark = state.custom.mark;
  });
});

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

resize();
resetGame();
render();
state.animationId = requestAnimationFrame(loop);
