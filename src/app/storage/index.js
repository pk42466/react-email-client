let db = null;
const store = "emails";
const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB ||
    window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction ||
    window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange ||
    window.webkitIDBKeyRange || window.msIDBKeyRange

if (!indexedDB) {
    window.console.log("Your browser doesn't support a stable version of IndexedDB.")
}

function connect(transactionName, cb) {
    const openRequest = indexedDB.open(transactionName, 2);
    openRequest.onupgradeneeded = function () {
        let db = openRequest.result;
        if (!db.objectStoreNames.contains(store)) { // if there's no "books" store
            db.createObjectStore(store, { keyPath: 'id', autoIncrement: true }); // create it
        }
        cb(db);
    };
    openRequest.onsuccess = function () {
        db = openRequest.result;
        db.onversionchange = function () {
            db.close();
            console.log("Database is outdated, please reload the page.")
        };
        cb(db);
    }
    openRequest.onerror = function (error) { throw (error); }
}
function add(db, data) {
    const transaction = db.transaction([store], "readwrite");
    const emails = transaction.objectStore(store);
    const request = emails.add(data);
    request.onerror = function (event) {
        console.log("Unable to add data");
    }
}


function getAll(db, cb) {
    const transaction = db.transaction([store], "readwrite");
    const emails = transaction.objectStore(store);
    const request = emails.getAll();
    request.onsuccess = function (event) {
        cb({ data: request.result });
    };

    request.onerror = function (event) {
        console.log("Unable to fetch data");
        cb({ data: [] })
    }
}

function read(objKey, cb) {
    const transaction = db.transaction([store]);
    const objectStore = transaction.objectStore(store);
    const request = objectStore.get(objKey);
    request.onerror = function (event) {
        cb({ data: [] })
    };

    request.onsuccess = function (event) {
        cb({ data: request.result });
    };
}


function remove(objKey, cb) {
    const request = db.transaction([store], "readwrite")
        .objectStore(store)
        .delete(objKey);
    request.onerror = function (event) {
        console.log("Unable to delete daa from database!");
        cb({ success: false });
    };
    request.onsuccess = function (event) {
        cb({ success: true })
    };
}

export default {
    connect, add, read, remove, getAll
}