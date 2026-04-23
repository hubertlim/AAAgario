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
  await page.click("#start");
  await page.waitForTimeout(800);

  const result = await page.evaluate(() => {
    const canvas = document.querySelector("#game");
    const hudHidden = document.querySelector("#hud").classList.contains("is-hidden");
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
      sample: Array.from(sample),
      mass: document.querySelector("#mass").textContent,
      time: document.querySelector("#time").textContent,
    };
  });

  console.log(JSON.stringify({ result, errors }, null, 2));
  await browser.close();

  const sampledPaper =
    result.sample[0] === 247 && result.sample[1] === 244 && result.sample[2] === 234;
  if (
    errors.length > 0 ||
    result.hudHidden ||
    result.canvasWidth === 0 ||
    result.canvasHeight === 0 ||
    sampledPaper
  ) {
    process.exitCode = 1;
  }
})();
