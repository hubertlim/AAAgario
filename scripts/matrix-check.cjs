const { chromium } = require("playwright");

const modes = ["classic", "boss", "hunt", "swarm", "chain", "tiny"];
const maps = ["city", "desk", "kitchen", "arcade", "garden", "toy"];
const modifiers = ["none", "magnet", "panic", "gold", "shrink", "combo"];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("http://host.docker.internal:8080", { waitUntil: "networkidle" });

  async function runOnce({ mode = "classic", map = "city", modifier = "none" }) {
    await page.click(`[data-mode="${mode}"]`);
    await page.click(`[data-map="${map}"]`);
    await page.click(`[data-modifier="${modifier}"]`);
    await page.click("#start");
    await page.waitForTimeout(220);
    const state = await page.evaluate(() => ({
      hudHidden: document.querySelector("#hud").classList.contains("is-hidden"),
      runInfo: document.querySelector("#run-info").textContent,
      canvasWidth: document.querySelector("#game").width,
      canvasHeight: document.querySelector("#game").height,
    }));
    await page.click("#stop");
    await page.click("#main-menu");
    if (state.hudHidden || state.canvasWidth === 0 || state.canvasHeight === 0) {
      throw new Error(`Failed start for ${mode}/${map}/${modifier}`);
    }
    return state.runInfo;
  }

  const seen = [];
  for (const mode of modes) seen.push(await runOnce({ mode }));
  for (const map of maps) seen.push(await runOnce({ map }));
  for (const modifier of modifiers) seen.push(await runOnce({ modifier }));

  console.log(JSON.stringify({ checked: seen.length, seen, errors }, null, 2));
  await browser.close();

  if (errors.length > 0 || seen.length !== modes.length + maps.length + modifiers.length) {
    process.exitCode = 1;
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
