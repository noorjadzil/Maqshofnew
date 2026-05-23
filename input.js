import { getItems, groupByKategori } from "./items.js";
import { putData, getLaporanByTanggal } from "./db.js";
import { rupiah, todayDate, makeId, bulanDariTanggal } from "./utils.js";
import { kirimWA } from "./wa.js";

let lastLaporan = null;

export async function renderInput() {
  const root = document.getElementById("tab-input");
  const items = await getItems();

  root.innerHTML = `
    <div class="card">
      <div class="section-title">
        <h2>Input Laporan</h2>
        <span class="badge">Baru</span>
      </div>
      <label>Tanggal</label>
      <input type="date" id="inputTanggal" value="${todayDate()}">

      <label>Catatan</label>
      <textarea id="inputCatatan" placeholder="Catatan tambahan..."></textarea>
    </div>

    <div class="card">
      <h2>Daftar Item</h2>
      <div id="inputItems"></div>
    </div>

    <div class="card">
      <h2>Total</h2>
      <div class="total-box" id="inputTotal">Rp 0</div>
      <div class="action-grid">
        <button class="primary" id="btnSimpanInput">Simpan Laporan</button>
        <button class="green" id="btnKirimInput">Kirim WhatsApp</button>
      </div>
      <p class="small">Data tersimpan offline di HP/browser menggunakan IndexedDB.</p>
    </div>
  `;

  renderItemInputs(items);

  document.getElementById("inputTanggal").addEventListener("change", muatDataTanggal);
  document.getElementById("btnSimpanInput").addEventListener("click", simpanInput);
  document.getElementById("btnKirimInput").addEventListener("click", async () => {
    const laporan = buatLaporan();
    kirimWA(laporan);
  });

  await muatDataTanggal();
}

function renderItemInputs(items) {
  const wrap = document.getElementById("inputItems");
  const grouped = groupByKategori(items);
  wrap.innerHTML = "";

  Object.keys(grouped).forEach(kategori => {
    wrap.innerHTML += `<div class="category-title">${kategori}</div>`;

    grouped[kategori].forEach(item => {
      wrap.innerHTML += `
        <div class="item-row">
          <div>
            <label>${item.nama}</label>
            <div class="small">${item.harga ? rupiah(item.harga) : "Tanpa harga"}</div>
          </div>
          <div>
            <label>Jumlah</label>
            <input type="number" min="0" class="input-jumlah" data-id="${item.id}" data-kategori="${item.kategori}" data-nama="${item.nama}" data-harga="${item.harga}" value="0">
          </div>
          <div>
            <label>Total</label>
            <div class="badge" id="total_${item.id}">Rp 0</div>
          </div>
        </div>
      `;
    });
  });

  document.querySelectorAll(".input-jumlah").forEach(input => {
    input.addEventListener("input", hitungInput);
  });
}

function hitungInput() {
  let total = 0;
  document.querySelectorAll(".input-jumlah").forEach(input => {
    const jumlah = Number(input.value || 0);
    const harga = Number(input.dataset.harga || 0);
    const subtotal = jumlah * harga;
    total += subtotal;

    const totalEl = document.getElementById(`total_${input.dataset.id}`);
    if (totalEl) totalEl.textContent = rupiah(subtotal);
  });

  document.getElementById("inputTotal").textContent = rupiah(total);
}

function bersihkanForm() {
  document.getElementById("inputCatatan").value = "";
  document.querySelectorAll(".input-jumlah").forEach(input => input.value = 0);
  hitungInput();
}

async function muatDataTanggal() {
  bersihkanForm();

  const tanggal = document.getElementById("inputTanggal").value;
  const list = await getLaporanByTanggal(tanggal);
  if (!list.length) return;

  const laporan = list[list.length - 1];
  lastLaporan = laporan;

  document.getElementById("inputCatatan").value = laporan.catatan || "";

  laporan.items?.forEach(item => {
    const input = document.querySelector(`.input-jumlah[data-id="${item.itemId}"]`);
    if (input) input.value = item.jumlah || 0;
  });

  hitungInput();
}

function buatLaporan() {
  const tanggal = document.getElementById("inputTanggal").value;
  const items = [];

  document.querySelectorAll(".input-jumlah").forEach(input => {
    const jumlah = Number(input.value || 0);
    const harga = Number(input.dataset.harga || 0);
    items.push({
      itemId: Number(input.dataset.id),
      kategori: input.dataset.kategori,
      nama: input.dataset.nama,
      harga,
      jumlah,
      total: jumlah * harga
    });
  });

  const total = items.reduce((sum, item) => sum + item.total, 0);

  return {
    id: lastLaporan?.tanggal === tanggal ? lastLaporan.id : makeId(),
    tanggal,
    bulan: bulanDariTanggal(tanggal),
    catatan: document.getElementById("inputCatatan").value,
    items,
    total,
    dibuatPada: lastLaporan?.dibuatPada || new Date().toISOString(),
    diubahPada: new Date().toISOString()
  };
}

async function simpanInput() {
  const laporan = buatLaporan();
  await putData("laporan", laporan);
  lastLaporan = laporan;
  alert("Laporan berhasil disimpan");
}
