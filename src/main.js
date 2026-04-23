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
const swatchButtons = [...document.querySelectorAll(".swatch")];
const markButtons = [...document.querySelectorAll(".mark")];
const playerNameInput = document.querySelector("#player-name");
const massLabel = document.querySelector("#mass");
const rankLabel = document.querySelector("#rank");
const timeLabel = document.querySelector("#time");
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
const state = {
  mode: "menu",
  selectedMinutes: 3,
  timeLeft: 180,
  lastTime: 0,
  camera: { x: WORLD.width / 2, y: WORLD.height / 2, zoom: 1 },
  pointer: { active: false, x: 0, y: 0 },
  keys: new Set(),
  player: null,
  foods: [],
  props: [],
  bots: [],
  particles: [],
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

function createCell(x, y, mass, color, name, isPlayer = false) {
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
    angle: random(0, TAU),
    mood: random(0, 1),
    alive: true,
    mark: isPlayer ? state.custom.mark : "orbit",
  };
}

function makeFood() {
  return {
    x: random(80, WORLD.width - 80),
    y: random(80, WORLD.height - 80),
    r: random(3.5, 7),
    mass: random(0.8, 2.4),
    color: [COLORS.mint, COLORS.blue, COLORS.gold, COLORS.red][Math.floor(random(0, 4))],
    pulse: random(0, TAU),
  };
}

function makeProp() {
  const kind = [
    { name: "cone", mass: 9, r: 13, sides: 3, color: COLORS.gold },
    { name: "sign", mass: 18, r: 18, sides: 4, color: COLORS.blue },
    { name: "cart", mass: 35, r: 24, sides: 4, color: COLORS.mint },
    { name: "tower", mass: 70, r: 34, sides: 6, color: COLORS.violet },
    { name: "block", mass: 120, r: 46, sides: 4, color: COLORS.red },
  ][Math.floor(random(0, 5))];
  return {
    ...kind,
    x: random(120, WORLD.width - 120),
    y: random(120, WORLD.height - 120),
    angle: random(0, TAU),
    wobble: random(0, TAU),
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
  state.player = createCell(
    WORLD.width / 2,
    WORLD.height / 2,
    16,
    state.custom.color,
    playerName,
    true,
  );
  state.foods = Array.from({ length: 520 }, makeFood);
  state.props = Array.from({ length: 115 }, makeProp);
  state.bots = Array.from({ length: 15 }, (_, index) => {
    const point = botSpawnPoint();
    return createCell(
      point.x,
      point.y,
      random(12, 85),
      [COLORS.mint, COLORS.blue, COLORS.gold, COLORS.violet][index % 4],
      `AI ${index + 1}`,
    );
  });
  state.particles = [];
  state.timeLeft = state.selectedMinutes * 60;
  state.chain = 0;
  state.bestChain = 0;
  state.chainTimer = 0;
  state.shake = 0;
  state.paused = false;
  state.camera.x = state.player.x;
  state.camera.y = state.player.y;
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
    : "Round over. The best runs chain tiny pickups into bigger objects before hunting rivals.";
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

function collect(cell, target, mass, color, count) {
  addMass(cell, mass);
  if (cell.isPlayer) {
    state.chain += 1;
    state.bestChain = Math.max(state.bestChain, state.chain);
    state.chainTimer = 1.35;
    state.shake = Math.min(8, state.shake + 1.6);
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

  const speed = clamp(270 - player.radius * 1.22, 95, 245);
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
  for (const bot of state.bots) {
    if (!bot.alive) continue;
    bot.angle += dt * (0.5 + bot.mood);
    let steerX = Math.cos(bot.angle) * 0.25;
    let steerY = Math.sin(bot.angle) * 0.25;
    const player = state.player;
    const playerD = Math.max(1, distance(bot, player));

    if (playerD < 620) {
      const dx = player.x - bot.x;
      const dy = player.y - bot.y;
      const sign = bot.mass > player.mass * 1.08 ? 1.15 : -1.4;
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

    const mag = Math.hypot(steerX, steerY) || 1;
    const speed = clamp(240 - bot.radius * 1.15, 75, 220);
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
    const canEat = state.player.mass > prop.mass * 0.75;
    if (canEat && distance(state.player, prop) < state.player.radius - prop.r * 0.1) {
      collect(state.player, prop, prop.mass * 0.45, prop.color, 12);
      state.props[i] = makeProp();
    }
  }

  const actors = [state.player, ...state.bots.filter((bot) => bot.alive)];
  for (let i = 0; i < actors.length; i += 1) {
    for (let j = i + 1; j < actors.length; j += 1) {
      const a = actors[i];
      const b = actors[j];
      const d = distance(a, b);
      const big = a.mass > b.mass ? a : b;
      const small = big === a ? b : a;
      if (big.mass > small.mass * 1.12 && d < big.radius - small.radius * 0.28) {
        collect(big, small, small.mass * 0.72, small.color, 20);
        if (small.isPlayer) {
          endGame(true);
          return;
        }
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

  const player = state.player;
  const targetZoom = clamp(1.25 - player.radius / 270, 0.52, 1.05);
  state.camera.x += (player.x - state.camera.x) * Math.min(1, dt * 5);
  state.camera.y += (player.y - state.camera.y) * Math.min(1, dt * 5);
  state.camera.zoom += (targetZoom - state.camera.zoom) * Math.min(1, dt * 3);
  updateHud();
}

function updateHud() {
  const masses = [state.player.mass, ...state.bots.map((bot) => bot.mass)].sort((a, b) => b - a);
  const rank = masses.findIndex((mass) => mass <= state.player.mass) + 1;
  massLabel.textContent = Math.round(state.player.mass).toString();
  rankLabel.textContent = `${rank}/${masses.length}`;
  const minutes = Math.floor(state.timeLeft / 60).toString().padStart(2, "0");
  const seconds = Math.floor(state.timeLeft % 60).toString().padStart(2, "0");
  timeLabel.textContent = `${minutes}:${seconds}`;
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
  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  beginWorld();
  ctx.strokeStyle = "rgba(29, 33, 29, 0.08)";
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
  const canEat = state.player.mass > prop.mass * 0.75;
  const alpha = canEat ? 0.95 : 0.36;
  const wobble = Math.sin(now * 0.002 + prop.wobble) * 0.05;
  ctx.save();
  ctx.translate(prop.x, prop.y);
  ctx.rotate(prop.angle + wobble);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = prop.color;
  ctx.lineWidth = 3 / state.camera.zoom;
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
  for (const food of state.foods) if (inView(food, 50)) drawFood(food, now);
  for (const prop of state.props) if (inView(prop, 90)) drawProp(prop, now);
  for (const bot of state.bots) if (inView(bot, 160)) drawCell(bot, now);
  drawCell(state.player || { x: WORLD.width / 2, y: WORLD.height / 2, radius: 25, color: COLORS.red, mood: 0, name: "YOU" }, now);
  drawParticles();
  endWorld();
  drawTouchGuide();

  if (state.mode === "playing" && state.chain > 2) {
    ctx.fillStyle = COLORS.ink;
    ctx.font = "700 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${state.chain} chain`, window.innerWidth / 2, window.innerHeight - 34);
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
