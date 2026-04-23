const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("http://host.docker.internal:8080", { waitUntil: "networkidle" });
  await page.fill("#player-name", "NOVA");
  await page.click('[data-color="#2774a9"]');
  await page.click('[data-mark="spark"]');
  await page.click("#start");
  await page.waitForTimeout(800);

  const result = await page.evaluate(() => {
    const canvas = document.querySelector("#game");
    const hudHidden = document.querySelector("#hud").classList.contains("is-hidden");
    const pauseButtonCount = document.querySelectorAll("#pause").length;
    const stopVisible = document.querySelector("#stop").getBoundingClientRect().height > 0;
    const stopText = document.querySelector("#stop").textContent.trim();
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
    };
  });
  await page.click("#stop");

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
  await page.click("#resume");

  const afterResume = await page.evaluate(async () => {
    const before = document.querySelector("#time").textContent;
    await new Promise((resolve) => setTimeout(resolve, 1100));
    return {
      pauseHidden: document.querySelector("#pause-menu").classList.contains("is-hidden"),
      hudHidden: document.querySelector("#hud").classList.contains("is-hidden"),
      timeAdvanced: before !== document.querySelector("#time").textContent,
    };
  });

  await page.click("#stop");
  await page.click("#main-menu");

  const afterMenu = await page.evaluate(() => ({
    menuHidden: document.querySelector("#menu").classList.contains("is-hidden"),
    pauseHidden: document.querySelector("#pause-menu").classList.contains("is-hidden"),
    hudHidden: document.querySelector("#hud").classList.contains("is-hidden"),
    name: document.querySelector("#player-name").value,
    activeColor: document.querySelector(".swatch.is-active")?.dataset.color,
    activeMark: document.querySelector(".mark.is-active")?.dataset.mark,
  }));

  console.log(JSON.stringify({ result, afterStop, afterResume, afterMenu, errors }, null, 2));
  await browser.close();

  const sampledPaper =
    result.sample[0] === 247 && result.sample[1] === 244 && result.sample[2] === 234;
  if (
    errors.length > 0 ||
    result.hudHidden ||
    result.pauseButtonCount !== 0 ||
    !result.stopVisible ||
    result.stopText !== "Stop" ||
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
    result.canvasWidth === 0 ||
    result.canvasHeight === 0 ||
    sampledPaper
  ) {
    process.exitCode = 1;
  }
})();
