import { getLaporanByTanggal, deleteLaporanByTanggal } from "./db.js";
import { todayDate, rupiah } from "./utils.js";
import { kirimWA } from "./wa.js";

let currentList = [];

export async function renderLaporanHarian() {
  const root = document.getElementById("tab-harian");
  root.innerHTML = `
    <div class="card">
      <h2>Laporan Harian</h2>
      <label>Pilih Tanggal</label>
      <input type="date" id="tanggalHarian" value="${todayDate()}">
      <button class="primary" id="btnMuatHarian">Tampilkan</button>
      <button class="red" id="btnHapusHarian">Hapus Data Tanggal Ini</button>
    </div>

    <div id="hasilHarian"></div>
  `;

  document.getElementById("btnMuatHarian").addEventListener("click", loadHarian);
  document.getElementById("tanggalHarian").addEventListener("change", loadHarian);
  document.getElementById("btnHapusHarian").addEventListener("click", hapusHarian);

  await loadHarian();
}

async function loadHarian() {
  const tanggal = document.getElementById("tanggalHarian").value;
  currentList = await getLaporanByTanggal(tanggal);

  const hasil = document.getElementById("hasilHarian");

  if (!currentList.length) {
    hasil.innerHTML = `<div class="card empty">Belum ada laporan pada tanggal ini.</div>`;
    return;
  }

  hasil.innerHTML = currentList.map((laporan, index) => {
    const rows = laporan.items
      .filter(item => Number(item.jumlah || 0) > 0)
      .map(item => `
        <tr>
          <td class="left">${item.nama}</td>
          <td>${item.kategori}</td>
          <td>${item.jumlah}</td>
          <td>${rupiah(item.harga)}</td>
          <td>${rupiah(item.total)}</td>
        </tr>
      `).join("");

    return `
      <div class="card">
        <h2>${laporan.tanggal}</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Kategori</th>
                <th>Jumlah</th>
                <th>Harga</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>${rows || `<tr><td colspan="5">Tidak ada item terisi</td></tr>`}</tbody>
          </table>
        </div>
        <h3>Total: ${rupiah(laporan.total)}</h3>
        ${laporan.catatan ? `<p><b>Catatan:</b> ${laporan.catatan}</p>` : ""}
        <button class="green" data-wa="${index}">Kirim WhatsApp</button>
      </div>
    `;
  }).join("");

  document.querySelectorAll("[data-wa]").forEach(btn => {
    btn.addEventListener("click", () => {
      kirimWA(currentList[Number(btn.dataset.wa)]);
    });
  });
}

async function hapusHarian() {
  const tanggal = document.getElementById("tanggalHarian").value;
  if (!confirm(`Hapus semua laporan tanggal ${tanggal}?`)) return;

  const jumlah = await deleteLaporanByTanggal(tanggal);
  alert(`${jumlah} laporan berhasil dihapus`);
  await loadHarian();
}
