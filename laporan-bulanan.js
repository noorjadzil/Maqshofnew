import { getLaporanByBulan, deleteLaporanByBulan } from "./db.js";
import { currentMonth, rupiah } from "./utils.js";

export async function renderLaporanBulanan() {
  const root = document.getElementById("tab-bulanan");
  root.innerHTML = `
    <div class="card">
      <h2>Laporan Bulanan</h2>
      <label>Pilih Bulan</label>
      <input type="month" id="bulanLaporan" value="${currentMonth()}">
      <button class="primary" id="btnMuatBulanan">Tampilkan</button>
      <button class="red" id="btnHapusBulanan">Hapus Data Bulan Ini</button>
    </div>

    <div id="hasilBulanan"></div>
  `;

  document.getElementById("btnMuatBulanan").addEventListener("click", loadBulanan);
  document.getElementById("bulanLaporan").addEventListener("change", loadBulanan);
  document.getElementById("btnHapusBulanan").addEventListener("click", hapusBulanan);

  await loadBulanan();
}

async function loadBulanan() {
  const bulan = document.getElementById("bulanLaporan").value;
  const list = await getLaporanByBulan(bulan);
  const hasil = document.getElementById("hasilBulanan");

  if (!list.length) {
    hasil.innerHTML = `<div class="card empty">Belum ada laporan pada bulan ini.</div>`;
    return;
  }

  const rekap = {};

  list.forEach(laporan => {
    laporan.items.forEach(item => {
      const key = `${item.kategori}__${item.nama}`;
      if (!rekap[key]) {
        rekap[key] = {
          kategori: item.kategori,
          nama: item.nama,
          harga: Number(item.harga || 0),
          jumlah: 0,
          total: 0
        };
      }

      rekap[key].jumlah += Number(item.jumlah || 0);
      rekap[key].total += Number(item.total || 0);
    });
  });

  const rows = Object.values(rekap)
    .filter(item => item.jumlah > 0)
    .map(item => `
      <tr>
        <td class="left">${item.nama}</td>
        <td>${item.kategori}</td>
        <td>${item.jumlah}</td>
        <td>${rupiah(item.harga)}</td>
        <td>${rupiah(item.total)}</td>
      </tr>
    `).join("");

  const grandTotal = list.reduce((sum, item) => sum + Number(item.total || 0), 0);

  hasil.innerHTML = `
    <div class="card">
      <h2>Rekap Bulan ${bulan}</h2>
      <p><span class="badge">${list.length} laporan</span></p>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Kategori</th>
              <th>Total Jumlah</th>
              <th>Harga</th>
              <th>Total Uang</th>
            </tr>
          </thead>
          <tbody>${rows || `<tr><td colspan="5">Tidak ada item terisi</td></tr>`}</tbody>
        </table>
      </div>

      <h3>Total Semua: ${rupiah(grandTotal)}</h3>
    </div>
  `;
}

async function hapusBulanan() {
  const bulan = document.getElementById("bulanLaporan").value;
  if (!confirm(`Hapus semua laporan bulan ${bulan}? Item setting tidak ikut terhapus.`)) return;

  const jumlah = await deleteLaporanByBulan(bulan);
  alert(`${jumlah} laporan berhasil dihapus`);
  await loadBulanan();
}
