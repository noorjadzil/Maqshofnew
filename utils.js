import { APP_CONFIG } from "./config.js";

export function rupiah(angka) {
  return `${APP_CONFIG.currency} ${Number(angka || 0).toLocaleString("id-ID")}`;
}

export function todayDate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function currentMonth() {
  return todayDate().slice(0, 7);
}

export function makeId() {
  return Date.now() + "_" + Math.random().toString(16).slice(2);
}

export function bulanDariTanggal(tanggal) {
  return tanggal.slice(0, 7);
}
