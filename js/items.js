import { getAll, putData, deleteData } from "./db.js";

export const DEFAULT_ITEMS = [
  { kategori: "Bubur", nama: "Bubur Ori", harga: 7000, urutan: 1, aktif: true },
  { kategori: "Bubur", nama: "Bubur Cakwe", harga: 12000, urutan: 2, aktif: true },
  { kategori: "Bubur", nama: "Bubur Telur", harga: 12000, urutan: 3, aktif: true },
  { kategori: "Bubur", nama: "Bubur Ayam Suwir", harga: 15000, urutan: 4, aktif: true },
  { kategori: "Bubur", nama: "Bubur Abon", harga: 17000, urutan: 5, aktif: true },
  { kategori: "Extra Topping", nama: "Cakwe", harga: 2000, urutan: 10, aktif: true },
  { kategori: "Extra Topping", nama: "Ayam Suwir", harga: 3000, urutan: 11, aktif: true },
  { kategori: "Extra Topping", nama: "Abon", harga: 5000, urutan: 12, aktif: true },
  { kategori: "Minuman / Lainnya", nama: "Puyuh", harga: 3000, urutan: 20, aktif: true },
  { kategori: "Minuman / Lainnya", nama: "Cleo", harga: 1000, urutan: 21, aktif: true },
  { kategori: "Minuman / Lainnya", nama: "Es Teh", harga: 3000, urutan: 22, aktif: true },
  { kategori: "Stok Perlengkapan", nama: "Paper Bowl", harga: 0, urutan: 30, aktif: true },
  { kategori: "Stok Perlengkapan", nama: "Sendok", harga: 0, urutan: 31, aktif: true }
];

export async function seedItemsIfEmpty() {
  const items = await getAll("items");
  if (items.length > 0) return;

  for (const item of DEFAULT_ITEMS) {
    await putData("items", item);
  }
}

export async function getItems() {
  const items = await getAll("items");
  return items
    .filter(item => item.aktif !== false)
    .sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
}

export async function saveItem(item) {
  return putData("items", {
    ...item,
    harga: Number(item.harga || 0),
    urutan: Number(item.urutan || 0),
    aktif: item.aktif !== false
  });
}

export async function removeItem(id) {
  return deleteData("items", Number(id));
}

export function groupByKategori(items) {
  return items.reduce((acc, item) => {
    if (!acc[item.kategori]) acc[item.kategori] = [];
    acc[item.kategori].push(item);
    return acc;
  }, {});
}
