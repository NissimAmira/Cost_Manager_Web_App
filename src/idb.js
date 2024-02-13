class CostsDB {
  constructor() {
    this.db = null;
  }

  async openCostsDB(dbName, version) {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        resolve(db);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve(db);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });

    return db;
  }

  async addCost(db, cost) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['costs'], 'readwrite');
      const objectStore = transaction.objectStore('costs');
      const request = objectStore.add(cost);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  async getCostsByMonthYear(month, year) {
    const db = await this.db;
    const tx = db.transaction('costs', 'readonly');
    const store = tx.objectStore('costs');
    const costs = [];

    return new Promise((resolve, reject) => {
      store.openCursor().onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          const cost = cursor.value;
          const costDate = new Date(cost.date); 
          if (costDate.getMonth() + 1 === month && costDate.getFullYear() === year) {
            costs.push(cost);
          }
          cursor.continue();
        } else {
          resolve(costs); 
        }
      };
      store.openCursor().onerror = function (event) {
        reject('Failed to retrieve costs: ', event.target.error);
      };
    });
  }

  async clearAllCosts() {
    const db = await this.db;
    const tx = db.transaction('costs', 'readwrite');
    const store = tx.objectStore('costs');
    return new Promise((resolve, reject) => {
      const request = store.clear(); 
      request.onsuccess = () => resolve('All costs cleared.');
      request.onerror = (e) => reject('Error clearing costs: ', e.target.error);
    });
  }
}

const idb = new CostsDB();

window.idb = idb;
