const DB_NAME = "maqshof_db";
const DB_VERSION = 1;

let dbPromise = null;

export function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains("items")) {
        const items = db.createObjectStore("items", { keyPath: "id", autoIncrement: true });
        items.createIndex("kategori", "kategori");
        items.createIndex("urutan", "urutan");
      }

      if (!db.objectStoreNames.contains("laporan")) {
        const laporan = db.createObjectStore("laporan", { keyPath: "id" });
        laporan.createIndex("tanggal", "tanggal", { unique: false });
        laporan.createIndex("bulan", "bulan", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

export async function getAll(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.getAll();

    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function putData(storeName, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.put(data);

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteData(storeName, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.delete(id);

    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

export async function clearStore(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.clear();

    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

export async function getLaporanByTanggal(tanggal) {
  const semua = await getAll("laporan");
  return semua.filter(item => item.tanggal === tanggal);
}

export async function getLaporanByBulan(bulan) {
  const semua = await getAll("laporan");
  return semua.filter(item => item.bulan === bulan);
}

export async function deleteLaporanByTanggal(tanggal) {
  const list = await getLaporanByTanggal(tanggal);
  for (const item of list) {
    await deleteData("laporan", item.id);
  }
  return list.length;
}

export async function deleteLaporanByBulan(bulan) {
  const list = await getLaporanByBulan(bulan);
  for (const item of list) {
    await deleteData("laporan", item.id);
  }
  return list.length;
}
