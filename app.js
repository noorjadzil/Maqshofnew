import { APP_CONFIG } from "./config.js";
import { seedItemsIfEmpty } from "./items.js";
import { renderInput } from "./input.js";
import { renderLaporanHarian } from "./laporan-harian.js";
import { renderLaporanBulanan } from "./laporan-bulanan.js";
import { renderSetting } from "./setting.js";

document.getElementById("appTitle").textContent = APP_CONFIG.appName;
document.getElementById("appSubtitle").textContent = APP_CONFIG.subtitle;

const renderers = {
  input: renderInput,
  harian: renderLaporanHarian,
  bulanan: renderLaporanBulanan,
  setting: renderSetting
};

async function init() {
  await seedItemsIfEmpty();
  setupTabs();
  await renderInput();
}

function setupTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const tab = btn.dataset.tab;

      document.querySelectorAll(".tab-btn").forEach(x => x.classList.remove("active"));
      document.querySelectorAll(".tab-page").forEach(x => x.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(`tab-${tab}`).classList.add("active");

      if (renderers[tab]) {
        await renderers[tab]();
      }
    });
  });
}

init();
