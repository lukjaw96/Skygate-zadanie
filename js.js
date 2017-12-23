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
            price = price + counter;
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



var Grandma = new Producer('grandma', 0, 5, 1, 0);
document.querySelector(".grandma").addEventListener("click", function () {
    Grandma.onProducerClick();
}, false);
 

var Factory = new Producer('factory', 0, 20, 10, 0);
document.querySelector(".factory").addEventListener("click", function () {
    Factory.onProducerClick();
}, false);


var Cursor = new Producer('cursor', 0, 3, 0.1, 0);
document.querySelector(".cursor").addEventListener("click", function () {
    Cursor.onProducerClick();
}, false);

var Mine = new Producer('mine', 0, 10, 8, 0);
document.querySelector(".mine").addEventListener("click", function () {
    Mine.onProducerClick();
}, false);


var producersArray = [Cursor, Grandma, Factory, Mine];

var arrayStartPrice = [];
for (var i = 0; i < producersArray.length; i++) {
    arrayStartPrice[i] = producersArray[i].getPrice();
}; 

for (var i = 0; i < producersArray.length; i++) {
    document.querySelector('.' + producersArray[i].getName() + '-price').innerHTML = arrayStartPrice[i];
}; 

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
var db;
    
var open = indexedDB.open("Database", 1);
open.onupgradeneeded = function() {
    db = open.result;
    var storeCookies = db.createObjectStore("cookies", {keyPath: "id"});

    var storeProducers = db.createObjectStore("producers", {keyPath: "id"});
};

open.onsuccess = function() {
    db = open.result;
}


function insertData() {
    var transactionCookies = db.transaction("cookies", "readwrite");
    var storeCookies = transactionCookies.objectStore("cookies");

    storeCookies.put({id: 1, counterCookie: document.querySelector(".counter-cookie").innerHTML, cookiesPerSecond: document.querySelector(".cookies-per-second").innerHTML, });

    var transactionProducers = db.transaction("producers", "readwrite");
    var storeProducers = transactionProducers.objectStore("producers");

    for (var i = 1; i < producersArray.length + 1; i++) {

        storeProducers.put({id: i, Counter: producersArray[i-1].getCounter(), Price: producersArray[i-1].getPrice(), CookiesPerSecond: producersArray[i-1].getCookiesPerSecond(),
                            Name: producersArray[i-1].getName(),
        });
    };
};

document.querySelector(".insert").addEventListener("click", function () {
    insertData();
}, false);

function outputData() {
    var transactionCookies = db.transaction("cookies", "readwrite");
    var storeCookies = transactionCookies.objectStore("cookies");

    getInformation = storeCookies.get(1);

    getInformation.onsuccess = function() {
        counterCookie = parseInt(getInformation.result.counterCookie, 10);
        cookiesPerSecondAll = parseFloat(getInformation.result.cookiesPerSecond);
    };

    var transactionProducers = db.transaction("producers", "readwrite");
    var storeProducers = transactionProducers.objectStore("producers");

    storeProducers.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {        
            producersArray[cursor.key - 1].setCounter(parseInt(cursor.value.Counter, 10));
            producersArray[cursor.key - 1].setPrice(parseInt(cursor.value.Price, 10));
            producersArray[cursor.key - 1].setCookiesPerSecond(parseFloat(cursor.value.CookiesPerSecond));

            var tmpName = cursor.value.Name;

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
    var transactionCookies = db.transaction("cookies", "readwrite");
    var storeCookies = transactionCookies.objectStore("cookies");

    storeCookies.put({id: 1, counterCookie: 0, cookiesPerSecond: 0, });

    var transactionProducers = db.transaction("producers", "readwrite");
    var storeProducers = transactionProducers.objectStore("producers");

    for (var i = 1; i < producersArray.length + 1; i++) {
        storeProducers.put({id: i, Counter: 0, Price: arrayStartPrice[i-1], CookiesPerSecond: 0,
                            Name: producersArray[i-1].getName(),
        });
    };
    outputData();
};

document.querySelector(".delete").addEventListener("click", function () {
    deleteData();
}, false);