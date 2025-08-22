// -- connection to firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { ref, get, set ,update, getDatabase } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC2Nyp-pyciUk1CHWHTKFHig_WRTqJW7JQ",
    authDomain: "e-commerce-c2793.firebaseapp.com",
    databaseURL: "https://e-commerce-c2793-default-rtdb.firebaseio.com",
    projectId: "e-commerce-c2793",
    storageBucket: "e-commerce-c2793.firebasestorage.app",
    messagingSenderId: "829927988714",
    appId: "1:829927988714:web:0cb505a2508dc3acf22693",
    measurementId: "G-7VLV8DZYZ5"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
// !_____________showModal________
function showModal(message) {
    const msg = document.getElementById("customAlertMessage");
    msg.textContent = message;

    const modal = new bootstrap.Modal(document.getElementById("customAlert"));
    modal.show();
}
// !-________________________

// get order data from localStorage
const orderData = JSON.parse(localStorage.getItem("orderData"));
// console.log(orderData);

document.getElementById("TotalInvoice").value = " $ "+ orderData.total_bill;


//  add event listener to the buy button
// when click on it, it will add the order to firebase
document.getElementById("btn-buy").addEventListener("click", async ()=>{

let name = document.getElementById("input-name").value;
let card = document.getElementById("input-card").value;
let enddate = document.getElementById("input-endDate").value;
let cvv = document.getElementById("input-cvv").value;
let rgxcard = /^[0-9]{16}$/;
let rgxcvv = /^[0-9]{3}$/;
let rgxdate = /^[0-9]{2}\/[0-9]{2}$/;

// validate the inputs
if (!name || !rgxcard.test(card) || !rgxcvv.test(cvv) || !rgxdate.test(enddate)) {
    showModal("Please fill all fields with correct data.❗❗❗.");
    return;
}


let setData = {
customer_id: orderData.customer_id,
datetime: new Date().toLocaleString('en-GB'),
shopping_address: orderData.shopping_address,
shopping_phone: orderData.shopping_phone,
status: "pending",
total_bill:orderData.total_bill ,
paymentMethod:"Online",
items:orderData.items,
};


const itemsRef = ref(database, 'orders');
const snapshot = await get(itemsRef);
// Generate a new ID for the order
let newId = 1;
if (snapshot.exists()) {
    const allKeys = Object.keys(snapshot.val());
    const numericKeys = allKeys.map(k => Number(k)).filter(k => !isNaN(k));
    newId = Math.max(...numericKeys) + 1;
}

// Set the new order data in the database
await set(ref(database, `orders/${newId}`), setData);

for (let i = 0; i <orderData.items.length; i++) {
    await update(
        ref(database, `products/${orderData.items[i].keyItem}`),
        { quantity: orderData.items[i].quantity-orderData.items[i].count }
    );
}

showModal("Order Added Successfully!");
setTimeout(() => {
        window.location.href = "homeUser.html";
    }, 2000); 
});

// console.log(orderData.items.length);
// console.log(orderData.items);
// console.log(orderData.items[1].keyItem);
// console.log(orderData.items[1].count);
// console.log(orderData.items[1].quantity);

