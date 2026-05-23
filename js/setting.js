import { getItems, saveItem, removeItem } from "./items.js";

export async function renderSetting() {
  const root = document.getElementById("tab-setting");
  root.innerHTML = `
    <div class="card">
      <h2>Tambah / Edit Item</h2>

      <input type="hidden" id="settingId">

      <label>Kategori / Macam</label>
      <input type="text" id="settingKategori" placeholder="Contoh: Bubur, Extra Topping, Minuman">

      <label>Nama Item</label>
      <input type="text" id="settingNama" placeholder="Contoh: Bubur Ori">

      <div class="row">
        <div>
          <label>Harga</label>
          <input type="number" id="settingHarga" value="0">
        </div>
        <div>
          <label>Urutan</label>
          <input type="number" id="settingUrutan" value="1">
        </div>
      </div>

      <button class="primary" id="btnSimpanItem">Simpan Item</button>
      <button class="gray" id="btnResetItem">Kosongkan Form</button>
    </div>

    <div class="card">
      <h2>Daftar Item</h2>
      <div id="daftarSetting"></div>
    </div>
  `;

  document.getElementById("btnSimpanItem").addEventListener("click", simpanItemSetting);
  document.getElementById("btnResetItem").addEventListener("click", resetForm);

  await loadDaftarSetting();
}

async function loadDaftarSetting() {
  const list = await getItems();
  const wrap = document.getElementById("daftarSetting");

  if (!list.length) {
    wrap.innerHTML = `<div class="empty">Belum ada item.</div>`;
    return;
  }

  wrap.innerHTML = list.map(item => `
    <div class="setting-row">
      <div>
        <b>${item.nama}</b>
        <div class="small">${item.kategori} • Urutan ${item.urutan || 0}</div>
      </div>
      <div>
        <span class="badge">Rp ${Number(item.harga || 0).toLocaleString("id-ID")}</span>
      </div>
      <div>
        <button class="yellow" data-edit="${item.id}">Edit</button>
        <button class="red" data-delete="${item.id}">Hapus</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const item = list.find(x => x.id === Number(btn.dataset.edit));
      isiForm(item);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.dataset.delete);
      const item = list.find(x => x.id === id);
      if (!confirm(`Hapus item "${item.nama}"?`)) return;
      await removeItem(id);
      await loadDaftarSetting();
    });
  });
}

function isiForm(item) {
  document.getElementById("settingId").value = item.id || "";
  document.getElementById("settingKategori").value = item.kategori || "";
  document.getElementById("settingNama").value = item.nama || "";
  document.getElementById("settingHarga").value = item.harga || 0;
  document.getElementById("settingUrutan").value = item.urutan || 0;
}

function resetForm() {
  document.getElementById("settingId").value = "";
  document.getElementById("settingKategori").value = "";
  document.getElementById("settingNama").value = "";
  document.getElementById("settingHarga").value = 0;
  document.getElementById("settingUrutan").value = 1;
}

async function simpanItemSetting() {
  const id = document.getElementById("settingId").value;
  const kategori = document.getElementById("settingKategori").value.trim();
  const nama = document.getElementById("settingNama").value.trim();
  const harga = Number(document.getElementById("settingHarga").value || 0);
  const urutan = Number(document.getElementById("settingUrutan").value || 0);

  if (!kategori || !nama) {
    alert("Kategori dan nama item wajib diisi");
    return;
  }

  await saveItem({
    ...(id ? { id: Number(id) } : {}),
    kategori,
    nama,
    harga,
    urutan,
    aktif: true
  });

  alert("Item berhasil disimpan");
  resetForm();
  await loadDaftarSetting();
}
