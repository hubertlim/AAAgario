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
    const stopVisible = document.querySelector("#stop").getBoundingClientRect().height > 0;
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
      stopVisible,
      sample: Array.from(sample),
      mass: document.querySelector("#mass").textContent,
      time: document.querySelector("#time").textContent,
    };
  });
  await page.click("#stop");

  const afterStop = await page.evaluate(() => ({
    menuHidden: document.querySelector("#menu").classList.contains("is-hidden"),
    hudHidden: document.querySelector("#hud").classList.contains("is-hidden"),
    name: document.querySelector("#player-name").value,
    activeColor: document.querySelector(".swatch.is-active")?.dataset.color,
    activeMark: document.querySelector(".mark.is-active")?.dataset.mark,
  }));

  console.log(JSON.stringify({ result, afterStop, errors }, null, 2));
  await browser.close();

  const sampledPaper =
    result.sample[0] === 247 && result.sample[1] === 244 && result.sample[2] === 234;
  if (
    errors.length > 0 ||
    result.hudHidden ||
    !result.stopVisible ||
    afterStop.menuHidden ||
    !afterStop.hudHidden ||
    afterStop.name !== "NOVA" ||
    afterStop.activeColor !== "#2774a9" ||
    afterStop.activeMark !== "spark" ||
    result.canvasWidth === 0 ||
    result.canvasHeight === 0 ||
    sampledPaper
  ) {
    process.exitCode = 1;
  }
})();
