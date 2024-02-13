class CostsDB {
    constructor() {
        this.db = null;
    }

    async openCostsDB(name, version) {
        this.db = await new Promise((resolve, reject) => {
            const request = indexedDB.open(name, version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('costs')) {
                    db.createObjectStore('costs', { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject('IndexedDB error: ' + event.target.error.message);
        });
        return this;
    }

    async addCost(cost) {
        const tx = this.db.transaction('costs', 'readwrite');
        const store = tx.objectStore('costs');
        return new Promise((resolve, reject) => {
            const request = store.add(cost);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(false);
        });
    }

    // Add this method to the CostsDB class in src/idb.js

    async getCostsByMonthYear(month, year) {
        const db = await this.db;
        const tx = db.transaction('costs', 'readonly');
        const store = tx.objectStore('costs');
        const costs = [];

        return new Promise((resolve, reject) => {
            store.openCursor().onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    const cost = cursor.value;
                    const costDate = new Date(cost.date); // Assuming 'date' is a stored property
                    if (costDate.getMonth() + 1 === month && costDate.getFullYear() === year) {
                        costs.push(cost);
                    }
                    cursor.continue();
                } else {
                    resolve(costs); // Resolve the promise with the fetched costs
                }
            };
            store.openCursor().onerror = function(event) {
                reject('Failed to retrieve costs: ', event.target.error);
            };
        });
    }

}

export const idb = new CostsDB();
