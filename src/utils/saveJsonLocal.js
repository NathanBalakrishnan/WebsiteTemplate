// Native IndexedDB – no external libraries
const DB_NAME = 'FileHandleDB';
const STORE_NAME = 'handles';
const DB_VERSION = 1;

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
  return dbPromise;
}

const handleCache = new Map();

async function getHandleFromDB(storageKey) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const get = store.get(storageKey);
    get.onsuccess = () => resolve(get.result);
    get.onerror = () => reject(get.error);
  });
}

async function saveHandleToDB(storageKey, handle) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const put = store.put(handle, storageKey);
    put.onsuccess = () => resolve();
    put.onerror = () => reject(put.error);
  });
}

async function deleteHandleFromDB(storageKey) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const del = store.delete(storageKey);
    del.onsuccess = () => resolve();
    del.onerror = () => reject(del.error);
  });
}

/**
 * Save JSON to a local file.
 * @param {object} data        - The JSON object to save.
 * @param {string} fileName    - Suggested file name (e.g. "user_123_template_2.json").
 * @param {string} storageKey  - Unique key for IndexedDB (e.g. "user_123_template_2").
 */
export async function saveJsonLocal(data, fileName = 'file.json', storageKey = 'default') {
  const json = JSON.stringify(data, null, 2);
  if (!('showSaveFilePicker' in window)) {
    // Fallback download
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  }
  try {
    let fileHandle = handleCache.get(storageKey);
    if (!fileHandle) {
      fileHandle = await getHandleFromDB(storageKey);
      if (fileHandle) {
        try {
          await fileHandle.getFile(); // validate
          handleCache.set(storageKey, fileHandle);
          console.log(`📁 Restored handle for ${storageKey}`);
        } catch {
          fileHandle = null;
        }
      }
    }
    if (!fileHandle) {
      fileHandle = await window.showSaveFilePicker({
        suggestedName: fileName,
        startIn: 'documents',
        types: [{ description: 'JSON File', accept: { 'application/json': ['.json'] } }],
      });
      await saveHandleToDB(storageKey, fileHandle);
      handleCache.set(storageKey, fileHandle);
      console.log(`📁 New handle saved for ${storageKey}`);
    }
    const writable = await fileHandle.createWritable();
    await writable.write(json);
    await writable.close();
    console.log(`✅ Saved to ${fileHandle.name} (key: ${storageKey})`);
    return true;
  } catch (err) {
    if (err.name !== 'AbortError') console.error(err);
    handleCache.delete(storageKey);
    return false;
  }
}

/**
 * Load JSON from the file associated with a storage key.
 */
export async function loadJsonLocal(storageKey = 'default') {
  if (!('showSaveFilePicker' in window)) return null;
  try {
    const fileHandle = await getHandleFromDB(storageKey);
    if (!fileHandle) {
      console.log(`⚠️ No handle for ${storageKey}`);
      return null;
    }
    let file;
    try {
      file = await fileHandle.getFile();
    } catch {
      console.log(`⚠️ Handle invalid for ${storageKey}, removing...`);
      await deleteHandleFromDB(storageKey);
      return null;
    }
    const text = await file.text();
    const data = JSON.parse(text);
    console.log(`📂 Loaded from ${fileHandle.name} (key: ${storageKey})`);
    return data;
  } catch (err) {
    console.error(`Load error for ${storageKey}:`, err);
    return null;
  }
}

/**
 * Reset (delete) stored handle for a key.
 */
export async function resetHandle(storageKey) {
  await deleteHandleFromDB(storageKey);
  handleCache.delete(storageKey);
}