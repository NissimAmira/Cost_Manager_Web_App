class CostsDB {
    constructor() {
        this.db = null;
    }

    async openCostsDB(name, version) {
        if (this.db) {
            return this; // If already initialized, return the DB instance
        }

        this.db = await new Promise((resolve, reject) => {
            const request = indexedDB.open(name, version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('costs')) {
                    db.createObjectStore('costs', { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject('IndexedDB error: ' + event.target.errorCode);
        });
        return this;
    }

    async addCost(cost) {
        if (!this.db) {
            throw new Error("Database not initialized");
        }
        const tx = this.db.transaction('costs', 'readwrite');
        const store = tx.objectStore('costs');
        return new Promise((resolve, reject) => {
            const request = store.add(cost);
            request.onsuccess = () => resolve(true); // Return true for success
            request.onerror = () => reject(false); // Return false or throw an error on failure
        });
    }

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
                    const costDate = new Date(cost.date);
                    if (costDate.getMonth() + 1 === month && costDate.getFullYear() === year) {
                        costs.push(cost);
                    }
                    cursor.continue();
                } else {
                    resolve(costs);
                }
            };
            store.openCursor().onerror = function(event) {
                reject('Failed to retrieve costs: ', event.target.error);
            };
        });
    }

    async clearAllCosts() {
        const db = await this.db;
        const tx = db.transaction('costs', 'readwrite');
        const store = tx.objectStore('costs');
        return new Promise((resolve, reject) => {
            const request = store.clear(); // Clears all data in the 'costs' object store
            request.onsuccess = () => resolve('All costs cleared.');
            request.onerror = (e) => reject('Error clearing costs: ', e.target.error);
        });
    }

}

export const idb = new CostsDB();
window.idb = idb;
