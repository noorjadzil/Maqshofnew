import { APP_CONFIG } from "./config.js";
import { rupiah } from "./utils.js";

export function buatTeksWA(laporan) {
  let teks = `*LAPORAN ${APP_CONFIG.appName}*\n`;
  teks += `Tanggal: ${laporan.tanggal}\n\n`;

  const kategoriMap = {};
  laporan.items.forEach(item => {
    if (!kategoriMap[item.kategori]) kategoriMap[item.kategori] = [];
    kategoriMap[item.kategori].push(item);
  });

  Object.keys(kategoriMap).forEach(kategori => {
    teks += `*${kategori.toUpperCase()}*\n`;
    kategoriMap[kategori].forEach(item => {
      if (Number(item.jumlah || 0) > 0) {
        teks += `${item.nama} x${item.jumlah}`;
        if (Number(item.harga || 0) > 0) teks += ` = ${rupiah(item.total)}`;
        teks += `\n`;
      }
    });
    teks += `\n`;
  });

  teks += `*TOTAL: ${rupiah(laporan.total)}*`;

  if (laporan.catatan) {
    teks += `\n\nCatatan:\n${laporan.catatan}`;
  }

  return teks;
}

export function kirimWA(laporan) {
  const teks = buatTeksWA(laporan);
  const number = APP_CONFIG.waNumber;
  const url = number
    ? `https://wa.me/${number}?text=${encodeURIComponent(teks)}`
    : `https://wa.me/?text=${encodeURIComponent(teks)}`;

  window.open(url, "_blank");
}
