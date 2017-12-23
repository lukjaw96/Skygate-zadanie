function checkIfIntegerAndDisplay(number) {
    number = parseFloat(number.toFixed(2));
    if( number === parseInt(number, 10) ) {
        return number;    
    }
    else {
        return Math.floor(number);     
    };
};

function Producer(name, counter, price, modFactor, cookiesPerSecond) {
    this.name = name;
    this.counter = counter;
    this.price = price;
    this.mod = modFactor;
    this.cookiesPerSecond = cookiesPerSecond;

    this.onProducerClick = function () {
        if (counterCookie >= price) {
            counterCookie = counterCookie - price;
            cookiesPerSecondAll = cookiesPerSecondAll + modFactor;
            counter = counter + 1;            
            price = Math.ceil(price + 0.15*price);
            cookiesPerSecond = cookiesPerSecond + modFactor;
            document.querySelector('.' + name + '-count').innerHTML = counter;
            document.querySelector('.' + name + '-price').innerHTML = price;
            cookiesPerSecond = parseFloat(cookiesPerSecond.toFixed(2));
            document.querySelector('.' + name + '-per-second').innerHTML = cookiesPerSecond;
            document.querySelector(".counter-cookie").innerHTML = checkIfIntegerAndDisplay(counterCookie);
        };
    };

    this.getCounter = function () {
        return counter;
    };

    this.getName = function () {
        return name;
    };

    this.getPrice = function () {
        return price;
    };

    this.getCookiesPerSecond = function () {
        return cookiesPerSecond;
    };

    this.setCounter = function (parameter) {
        counter = parameter;
    };

    this.setPrice = function (parameter) {
        price = parameter;
    };

    this.setCookiesPerSecond = function (parameter) {
        cookiesPerSecond = parameter;
    };
};

let counterCookie = 0;
let cookiesPerSecondAll = 0;

document.querySelector(".cookie").addEventListener("click", function () {
    counterCookie++;
    document.querySelector(".counter-cookie").innerHTML = checkIfIntegerAndDisplay(counterCookie);
}, false);

textUpdate = window.setInterval(function () {
   document.querySelector(".counter-cookie").innerHTML = checkIfIntegerAndDisplay(counterCookie);
   cookiesPerSecondAll = parseFloat(cookiesPerSecondAll.toFixed(2));
   document.querySelector(".cookies-per-second").innerHTML = cookiesPerSecondAll;
}, 1);

function clickOfProducers() {
    counterCookie = counterCookie + cookiesPerSecondAll/10;
    document.querySelector(".counter-cookie").innerHTML = checkIfIntegerAndDisplay(counterCookie);
}

producerClick = window.setInterval(clickOfProducers, 100);

//it is possible to add another producer, create new producer, addEventListener, insert producer into producersArray and add another li in html document

const Cursor = new Producer('cursor', 0, 15, 0.1, 0);
document.querySelector(".cursor").addEventListener("click", function () {
    Cursor.onProducerClick();
}, false);

const Grandma = new Producer('grandma', 0, 100, 1, 0);
document.querySelector(".grandma").addEventListener("click", function () {
    Grandma.onProducerClick();
}, false);

const Farm = new Producer('farm', 0, 1100, 8, 0);
document.querySelector(".farm").addEventListener("click", function () {
    Farm.onProducerClick();
}, false);

const Mine = new Producer('mine', 0, 12000, 47, 0);
document.querySelector(".mine").addEventListener("click", function () {
    Mine.onProducerClick();
}, false); 

const Factory = new Producer('factory', 0, 130000, 260, 0);
document.querySelector(".factory").addEventListener("click", function () {
    Factory.onProducerClick();
}, false);

const producersArray = [Cursor, Grandma, Farm, Mine, Factory];

const arrayStartPrice = [];
for (let i = 0; i < producersArray.length; i++) {
    arrayStartPrice[i] = producersArray[i].getPrice();
}; 

for (let i = 0; i < producersArray.length; i++) {
    document.querySelector('.' + producersArray[i].getName() + '-price').innerHTML = arrayStartPrice[i];
}; 

const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
let db;
    
const open = indexedDB.open("Database", 1);
open.onupgradeneeded = function() {
    db = open.result;
    let storeCookies = db.createObjectStore("cookies", {keyPath: "id"});

    let storeProducers = db.createObjectStore("producers", {keyPath: "id"});
};

open.onsuccess = function() {
    db = open.result;
    outputData();
}


function insertData() {
    const transactionCookies = db.transaction("cookies", "readwrite");
    const storeCookies = transactionCookies.objectStore("cookies");

    storeCookies.put({id: 1, counterCookie: document.querySelector(".counter-cookie").innerHTML, cookiesPerSecond: document.querySelector(".cookies-per-second").innerHTML, });

    const transactionProducers = db.transaction("producers", "readwrite");
    const storeProducers = transactionProducers.objectStore("producers");

    for (let i = 1; i < producersArray.length + 1; i++) {

        storeProducers.put({id: i, Counter: producersArray[i-1].getCounter(), Price: producersArray[i-1].getPrice(), CookiesPerSecond: producersArray[i-1].getCookiesPerSecond(),
                            Name: producersArray[i-1].getName(),
        });
    };
};

document.querySelector(".insert").addEventListener("click", function () {
    insertData();
}, false);

autoInsert = window.setInterval(insertData, 5000);

function outputData() {
    const transactionCookies = db.transaction("cookies", "readwrite");
    const storeCookies = transactionCookies.objectStore("cookies");

    getInformation = storeCookies.get(1);

    getInformation.onsuccess = function() {
        counterCookie = parseInt(getInformation.result.counterCookie, 10);
        cookiesPerSecondAll = parseFloat(getInformation.result.cookiesPerSecond);
    };

    const transactionProducers = db.transaction("producers", "readwrite");
    const storeProducers = transactionProducers.objectStore("producers");

    storeProducers.openCursor().onsuccess = function(event) {
        let cursor = event.target.result;
        if (cursor) {        
            producersArray[cursor.key - 1].setCounter(parseInt(cursor.value.Counter, 10));
            producersArray[cursor.key - 1].setPrice(parseInt(cursor.value.Price, 10));
            producersArray[cursor.key - 1].setCookiesPerSecond(parseFloat(cursor.value.CookiesPerSecond));

            let tmpName = cursor.value.Name;

            document.querySelector('.' + tmpName + '-count').innerHTML = parseInt(cursor.value.Counter, 10);
            document.querySelector('.' + tmpName + '-price').innerHTML = parseInt(cursor.value.Price, 10);
            document.querySelector('.' + tmpName + '-per-second').innerHTML = parseFloat(cursor.value.CookiesPerSecond);
  
            cursor.continue();
        };       
    };
};

document.querySelector(".output").addEventListener("click", function () {
    outputData();
}, false);

function deleteData() {
    const transactionCookies = db.transaction("cookies", "readwrite");
    const storeCookies = transactionCookies.objectStore("cookies");

    storeCookies.put({id: 1, counterCookie: 0, cookiesPerSecond: 0, });

    const transactionProducers = db.transaction("producers", "readwrite");
    const storeProducers = transactionProducers.objectStore("producers");

    for (let i = 1; i < producersArray.length + 1; i++) {
        storeProducers.put({id: i, Counter: 0, Price: arrayStartPrice[i-1], CookiesPerSecond: 0,
                            Name: producersArray[i-1].getName(),
        });
    };
    outputData();
};

document.querySelector(".delete").addEventListener("click", function () {
    deleteData();
}, false);


document.querySelector(".god-mode").addEventListener("click", function () {
    counterCookie = counterCookie + 1000000;
}, false);
