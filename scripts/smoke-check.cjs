const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 483, height: 654 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("http://host.docker.internal:8080", { waitUntil: "networkidle" });
  const menuLayout = await page.evaluate(() => {
    const panel = document.querySelector("#menu .panel").getBoundingClientRect();
    return {
      top: panel.top,
      bottom: panel.bottom,
      height: panel.height,
      viewportHeight: window.innerHeight,
      fits: panel.top >= 0 && panel.bottom <= window.innerHeight,
    };
  });
  await page.evaluate(() => {
    document.querySelector(".option-group-run").open = true;
  });
  await page.selectOption("#mode-select", "boss");
  await page.selectOption("#map-select", "arcade");
  await page.selectOption("#modifier-select", "gold");
  await page.click('[data-powerups="off"]');
  await page.click('[data-powerups="on"]');
  await page.evaluate(() => {
    document.querySelector(".option-group-style").open = true;
  });
  await page.fill("#player-name", "NOVA");
  await page.click('[data-color="#2774a9"]');
  await page.click('[data-mark="spark"]');
  await page.click("#start");
  await page.waitForTimeout(1500);

  const result = await page.evaluate(() => {
    const canvas = document.querySelector("#game");
    const hudHidden = document.querySelector("#hud").classList.contains("is-hidden");
    const pauseButtonCount = document.querySelectorAll("#pause").length;
    const stopVisible = document.querySelector("#stop").getBoundingClientRect().height > 0;
    const stopText = document.querySelector("#stop").textContent.trim();
    const boostCard = document.querySelector("#boost-card");
    const context = canvas.getContext("2d");
    const sample = context.getImageData(
      Math.floor(canvas.width / 2),
      Math.floor(canvas.height / 2),
      1,
      1,
    ).data;

    return {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      hudHidden,
      pauseButtonCount,
      stopVisible,
      stopText,
      sample: Array.from(sample),
      mass: document.querySelector("#mass").textContent,
      time: document.querySelector("#time").textContent,
      runInfo: document.querySelector("#run-info").textContent,
      boostHidden: boostCard.classList.contains("is-hidden"),
      boostText: document.querySelector("#boost-status").textContent.trim(),
    };
  });
  await page.evaluate(() => {
    document.querySelector("#stop").click();
  });

  const afterStop = await page.evaluate(async () => {
    const before = document.querySelector("#time").textContent;
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      menuHidden: document.querySelector("#menu").classList.contains("is-hidden"),
      pauseHidden: document.querySelector("#pause-menu").classList.contains("is-hidden"),
      hudHidden: document.querySelector("#hud").classList.contains("is-hidden"),
      timeHeld: before === document.querySelector("#time").textContent,
    };
  });
  await page.evaluate(() => {
    document.querySelector("#resume").click();
  });

  const afterResume = await page.evaluate(async () => {
    const before = document.querySelector("#time").textContent;
    await new Promise((resolve) => setTimeout(resolve, 1100));
    return {
      pauseHidden: document.querySelector("#pause-menu").classList.contains("is-hidden"),
      hudHidden: document.querySelector("#hud").classList.contains("is-hidden"),
      timeAdvanced: before !== document.querySelector("#time").textContent,
    };
  });

  await page.evaluate(() => {
    document.querySelector("#stop").click();
  });
  await page.waitForTimeout(80);
  await page.evaluate(() => {
    document.querySelector("#main-menu").click();
  });

  const afterMenu = await page.evaluate(() => ({
    menuHidden: document.querySelector("#menu").classList.contains("is-hidden"),
    pauseHidden: document.querySelector("#pause-menu").classList.contains("is-hidden"),
    hudHidden: document.querySelector("#hud").classList.contains("is-hidden"),
    name: document.querySelector("#player-name").value,
    activeColor: document.querySelector(".swatch.is-active")?.dataset.color,
    activeMark: document.querySelector(".mark.is-active")?.dataset.mark,
    activeMode: document.querySelector(".mode-choice.is-active")?.dataset.mode,
    activeMap: document.querySelector(".map-choice.is-active")?.dataset.map,
    activeModifier: document.querySelector(".modifier-choice.is-active")?.dataset.modifier,
    activePowerups: document.querySelector(".powerup-choice.is-active")?.dataset.powerups,
  }));

  await page.evaluate(() => {
    document.querySelector(".option-group-run").open = true;
  });
  await page.click('[data-powerups="off"]');
  await page.click("#start");
  await page.waitForTimeout(500);

  const noPowerupsRun = await page.evaluate(() => ({
    boostHidden: document.querySelector("#boost-card").classList.contains("is-hidden"),
  }));

  const slimPage = await browser.newPage({
    viewport: { width: 330, height: 654 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  slimPage.on("pageerror", (error) => errors.push(error.message));
  await slimPage.goto("http://host.docker.internal:8080", { waitUntil: "networkidle" });
  const slimMenu = await slimPage.evaluate(() => {
    const panel = document.querySelector("#menu .panel").getBoundingClientRect();
    return {
      top: panel.top,
      left: panel.left,
      right: panel.right,
      bottom: panel.bottom,
      width: panel.width,
      height: panel.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      fits:
        panel.top >= 0 &&
        panel.left >= 0 &&
        panel.right <= window.innerWidth &&
        panel.bottom <= window.innerHeight,
    };
  });
  await slimPage.click("#start");
  await slimPage.waitForTimeout(250);
  await slimPage.evaluate(() => {
    document.querySelector("#stop").click();
  });
  await slimPage.waitForTimeout(80);
  const slimPause = await slimPage.evaluate(() => {
    const panel = document.querySelector("#pause-menu .panel").getBoundingClientRect();
    const hud = document.querySelector("#hud").getBoundingClientRect();
    return {
      top: panel.top,
      left: panel.left,
      right: panel.right,
      bottom: panel.bottom,
      width: panel.width,
      height: panel.height,
      hudBottom: hud.bottom,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      fits:
        panel.top >= 0 &&
        panel.left >= 0 &&
        panel.right <= window.innerWidth &&
        panel.bottom <= window.innerHeight,
    };
  });
  await slimPage.close();

  console.log(
    JSON.stringify(
      { menuLayout, result, afterStop, afterResume, afterMenu, noPowerupsRun, slimMenu, slimPause, errors },
      null,
      2,
    ),
  );
  await browser.close();

  const sampledPaper =
    result.sample[0] === 247 && result.sample[1] === 244 && result.sample[2] === 234;
  if (
    errors.length > 0 ||
    !menuLayout.fits ||
    result.hudHidden ||
    result.pauseButtonCount !== 0 ||
    !result.stopVisible ||
    result.stopText !== "Stop" ||
    result.runInfo !== "Boss" ||
    result.boostHidden ||
    !["Field 1", "Field 2", "Field 3", "Soon", "Seeding"].includes(result.boostText) ||
    !afterStop.menuHidden ||
    afterStop.pauseHidden ||
    afterStop.hudHidden ||
    !afterStop.timeHeld ||
    !afterResume.pauseHidden ||
    afterResume.hudHidden ||
    !afterResume.timeAdvanced ||
    afterMenu.menuHidden ||
    !afterMenu.pauseHidden ||
    !afterMenu.hudHidden ||
    afterMenu.name !== "NOVA" ||
    afterMenu.activeColor !== "#2774a9" ||
    afterMenu.activeMark !== "spark" ||
    afterMenu.activeMode !== "boss" ||
    afterMenu.activeMap !== "arcade" ||
    afterMenu.activeModifier !== "gold" ||
    afterMenu.activePowerups !== "on" ||
    !noPowerupsRun.boostHidden ||
    !slimMenu.fits ||
    !slimPause.fits ||
    result.canvasWidth === 0 ||
    result.canvasHeight === 0 ||
    sampledPaper
  ) {
    process.exitCode = 1;
  }
})();
