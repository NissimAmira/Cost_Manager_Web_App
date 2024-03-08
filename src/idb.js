//Nissim Amira 307831388
//Yarin Ben-Moshe 314939885

export default class CostsDB {
    Constructor() {
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

        const processedCost = {
            sum: cost.sum || 0, // Default to 0 if sum is not provided
            category: cost.category || 'OTHER', // Default to 'OTHER' if category is not provided
            description: cost.description || 'No description', // Default to 'No description' if not provided
            date: cost.date || new Date().toISOString().split('T')[0], // Default to current date if not provided
        };

        const transaction = this.db.transaction('costs', 'readwrite');
        const store = transaction.objectStore('costs');
        return new Promise((resolve, reject) => {
            const request = store.add(processedCost);
            request.onsuccess = () => resolve(true); // Return true for success
            request.onerror = () => reject(false); // Return false or throw an error on failure
        });
    }


    async getCostsByMonthYear(month, year) {

        if (!this.db) {
            throw new Error("Database not initialized");
        }

        const db = await this.db;
        const transaction = db.transaction('costs', 'readonly'); //create readonly transaction instance with the db
        const store = transaction.objectStore('costs');
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

    async deleteCostById(id) {
        if (!this.db) {
            throw new Error("Database not initialized");
        }

        const db = await this.db;
        const transaction = db.transaction('costs', 'readwrite');
        const store = transaction.objectStore('costs');
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve(true);
            request.onerror = (e) => reject('Error deleting cost', e.target.error);
        })
    }
}
export const idb = new CostsDB();
window.idb = idb;
