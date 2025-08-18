// !_______________connection to firebase____________________
import { getAuth, } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { ref, get, update, set, getDatabase } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

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
const auth = getAuth();

// !____________fun to switch brtween tabs_____________________________

function showTab(tab) {

    document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('d-none'));
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));

    const target = document.getElementById(`tab-${tab}`);
    target.classList.remove('d-none');
    target.classList.add('active');
}

window.showTab = showTab;
// !___________Show modal message alert__________________

function showModal(message) {
    const msg = document.getElementById("customAlertMessage");
    msg.textContent = message;

    const modal = new bootstrap.Modal(document.getElementById("customAlert"));

    modal.show();
}

// !_____________________________________________________
var itemsinbody = document.getElementById('items-in-body');
var itemcategories = document.getElementById('dropdown-item-categories');
// !_________filter by category__________________

async function filterProducts(categ) {
    try {
        //  products from firebase
        const productsRef = ref(database, 'products');
        const products = await get(productsRef);
        const allProduct = products.val();

        itemsinbody.innerHTML = "";
        // loop on all product and check if category = selected categ
        for (const key in products.val()) {

            var { category, rate, image, name, price, NoOfPersons } = allProduct[key];
            if (category == categ || categ == "All Categories") {
                itemsinbody.innerHTML += `
        <div class="col-lg-3 col-md-4 col-sm-6">
        <div class="card h-100 bg-dark">
        <img src="${image}" class="card-img-top w-100">
        <div class="card-body d-flex flex-column">
            <h6 class="card-title text-light">${name}</h6>
            <h6 class = "text-light"> $ ${price}</h6>
            <div class="d-flex text-light">
            <img  style="width: 15px; height: 15px; margin-right:10px" src="images/Filled_star.png">
            <p class="pRate"> ${rate} (${NoOfPersons})</p>
            </div>
            <div class="d-flex gap-2 mt-auto">
            <button class="btn btn-outline-light " data-bs-toggle="modal" data-bs-target="#productModal" onclick="showDetails(this.value)" value ='${key}'" >View</button>
            <button class="btn btn-warning w-100 mt-auto" onclick="addtocurt(this.value)" value ='${key}'>Add to Cart</button>
            </div>
        </div>
    </div>`
            }
        }
    } catch (error) {
        console.error("Error ", error);
    }
}
window.filterProducts = filterProducts;

// !__________filterbySearch________________

async function filterbySearchProducts(nm) {
    try {
        // get peoducts from firebase and check if product name include search nm
        const productsRef = ref(database, 'products');
        const products = await get(productsRef);
        const allProduct = products.val();
        itemsinbody.innerHTML = "";

        for (const key in products.val()) {
            var { rate, image, name, price, NoOfPersons } = allProduct[key];
            if (name.toLowerCase().includes(nm.toLowerCase())) {
                itemsinbody.innerHTML += `
        <div class="col-lg-3 col-md-4 col-sm-6">
        <div class="card h-100 bg-dark">
        <img src="${image}" class="card-img-top w-100">
        <div class="card-body d-flex flex-column">
            <h6 class="card-title text-light">${name}</h6>
            <h6 class = "text-light"> $ ${price}</h6>
            <div class="d-flex text-light">
            <img  style="width: 15px; height: 15px; margin-right:10px" src="images/Filled_star.png">
            <p class="pRate"> ${rate} (${NoOfPersons})</p>
            </div>
            <div class="d-flex gap-2 mt-auto">
            <button class="btn btn-outline-light " data-bs-toggle="modal" data-bs-target="#productModal" onclick="showDetails(this.value)" value ='${key}'" >View</button>
            <button class="btn btn-warning w-100 mt-auto" onclick="addtocurt(this.value)" value ='${key}'>Add to Cart</button>
            </div>
        </div>
    </div>`
            }
        }

    } catch (error) {
        console.error(" Error ", error);
    }
}
window.filterbySearchProducts = filterbySearchProducts;

// !______________btn-search_______________
//get value from input search and call function filterbySearchProducts
document.getElementById("btn-search").addEventListener("click", async () => {
    const valSearch = document.getElementById("input-search").value;
    console.log(valSearch);

    filterbySearchProducts(valSearch);
});

// !__________getProducts_________________
// call this fun when load page to get all products from firebase and show them
// ans alse add all categories to dropdown

async function getProducts() {
    try {

        itemcategories.innerHTML = `<li onclick='filterProducts("All Categories")'><a class="dropdown-item" href="#">All Categories</a></li>`;

        const productsRef = ref(database, 'products');
        const products = await get(productsRef);
        const allProduct = products.val();

        var arrCategories = [];
        itemsinbody.innerHTML = "";
        // loop and set all product to itemsinbody
        for (const key in products.val()) {

            var { category, rate, image, name, price, NoOfPersons } = allProduct[key];

            itemsinbody.innerHTML += `
    <div class="col-lg-3 col-md-4 col-sm-6">
        <div class="card h-100 bg-dark">
        <img src="${image}" class="card-img-top w-100">
        <div class="card-body d-flex flex-column">
            <h6 class="card-title text-light">${name}</h6>
            <h6 class = "text-light"> $ ${price}</h6>
            <div class="d-flex text-light">
            <img  style="width: 15px; height: 15px; margin-right:10px" src="images/Filled_star.png">
            <p class="pRate"> ${rate} (${NoOfPersons})</p>
            </div>
            <div class="d-flex gap-2 mt-auto">
            <button class="btn btn-outline-light " data-bs-toggle="modal" data-bs-target="#productModal" onclick="showDetails(this.value)" value ='${key}'" >View</button>
            <button id="btncurt${key}" class="btn btn-warning w-100 mt-auto" onclick="addtocurt(this.value)" value ='${key}'>Add to Cart</button>
            </div>
        </div>
    </div>`
            // check if category is not in arrCategories then add it
            if (!arrCategories.includes(category)) {
                arrCategories.push(category);
                itemcategories.innerHTML += `<li onclick='filterProducts("${category}")'><a class="dropdown-item" href="#">${category}</a></li>`;
            }
        }

    } catch (error) {
        console.error("Error", error);
    }

}
getProducts();

// !__________clickImg____________________

// this function to click on img in model 
// and change the stars to filled or empty stars
// and update the rate in firebase
// and show the new rate in model
async function clickImg(img) {

    var div = document.getElementById("stars");
    var n = parseInt(img.getAttribute("img-click"));
    div.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= n) {
            div.innerHTML += `<img src="images/Filled_star.png" img-click="${i}"  onclick="clickImg(this)">`
        } else {
            div.innerHTML += `<img src="images/empty_star.png" img-click="${i}"  onclick="clickImg(this)">`
        }
    }
    // get product from firebase and update the rate and NoOfPersons
    const productsRefget = ref(database, 'products');
    const products = await get(productsRefget);
    const allProduct = products.val();

    const NoPerson = allProduct[NoOfProduct].NoOfPersons;
    const sumrate = allProduct[NoOfProduct].rate * NoPerson;
    // calc rate 
    let rate = Math.round((sumrate + n) / (NoPerson + 1) * 10) / 10;
    // console.log(rate);

    let updatedData = {
        category: allProduct[NoOfProduct].category,
        name: allProduct[NoOfProduct].name,
        price: allProduct[NoOfProduct].price,
        image: allProduct[NoOfProduct].image,
        description: allProduct[NoOfProduct].description,
        quantity: allProduct[NoOfProduct].quantity,
        rate: rate,
        NoOfPersons: allProduct[NoOfProduct].NoOfPersons + 1,
    };
    // console.log(updatedData)
    // update the product in firebase
    const productRef = ref(database, 'products/' + NoOfProduct);
    update(productRef, updatedData)
        .then(() => {
            getProducts();
        })
        .catch((error) => {
            console.error("Failed in Update", error);
        });
}
window.clickImg = clickImg;

// !_____________showDetails_____________

let NoOfProduct;  // to sign product id when click on view btn 
// and to use it in fun clickImg

// this fun run when click on btn view in card
// it will show details of product in model
// and set stars to rate product
// when click on star call (clickImg) fun
async function showDetails(val) {
    NoOfProduct = val;
    const productsRef = ref(database, 'products');
    const products = await get(productsRef);
    const allProduct = products.val();

    // this element from model

    const inputname = document.getElementById("productName");
    const inputprice = document.getElementById("productPrice");
    const inputimageLink = document.getElementById("imgproduct");
    const inputdescription = document.getElementById("productDescription");
    const inputrate = document.getElementById("productRate");

    // when click on an img call fun clickImg
    document.getElementById("stars").innerHTML = `
    <img src="images/empty_star.png" img-click="1" onclick="clickImg(this)">
    <img src="images/empty_star.png" img-click="2" onclick="clickImg(this)">
    <img src="images/empty_star.png" img-click="3" onclick="clickImg(this)">
    <img src="images/empty_star.png" img-click="4" onclick="clickImg(this)">
    <img src="images/empty_star.png" img-click="5" onclick="clickImg(this)">
    `;

    // loop on products and check if key match val ->(if true) set values in model

    for (const key in products.val()) {
        var { description, image, name, price, rate, NoOfPersons } = allProduct[key];
        if (key == val) {
            inputname.innerHTML = `Product Name: ${name}`;
            inputprice.innerHTML = `Product Price: $ ${price}`;
            inputimageLink.src = image;
            inputdescription.innerHTML = description;
            inputrate.innerHTML = `${rate} (${NoOfPersons})`;
        }
    }


}
window.showDetails = showDetails;

// !_____________addtocurt_________________

let arrAllCurt = [];
let total = 0;

// this fun run when click on btn add to cart in card
// and when click on btn buy in model showDetails
async function addtocurt(keyItem) {
    try {
        // get products from firebase and check if keyItem match product key
        //if true then add product to arrAllCurt
        //and show toast message added to cart

        const productsRef = ref(database, 'products');
        const products = await get(productsRef);
        const allProduct = products.val();
        total = 0;

        for (const key in products.val()) {
            var { name, price, } = allProduct[key];
            var count = 1;
            var totalp = price
            if (key == keyItem) {
                arrAllCurt.push({ name, price, count, totalp, keyItem });
                // show toast message added to cart
                const toastEl = document.getElementById('cartToast');
                const toast = new bootstrap.Toast(toastEl, { delay: 1000 });
                toast.show();
                document.getElementById("NoCart").innerHTML = arrAllCurt.length;

            }
        }
        let btn = document.getElementById(`btncurt${keyItem}`);
        btn.classList.remove("btn-warning");
        btn.classList.add("btn-success");
        btn.innerText = "✔ Added";
        btn.disabled = true;


    } catch (error) {
        console.error(" Error ", error);
    }

}
window.addtocurt = addtocurt;

// !____addEventListener_to_btn-bay-fromModel_____

document.getElementById("btn-bay-fromModel").addEventListener("click", async () => {
    //call function addtocurt with NoOfProduct
    addtocurt(NoOfProduct);
    //hide th model after add to cart
    const modalEl = document.getElementById("productModal");
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.hide();
});


//!___ addEventListener to btn-buy(Place order) to set oder in firebase
document.getElementById("btn-buy-item").addEventListener("click", async () => {

    const shopAddress = document.getElementById("shpping-address").value;

    const shopPhone = document.getElementById("shpping-phone").value;
    const rgxPhone = /^01(0|1|2|5)[0-9]{8}$/;
    // console.log(shopAddress);
    // console.log(shopPhone);
    // console.log(total);

    if (!shopAddress || !rgxPhone.test(shopPhone) || total == 0) {
        //hide th model to show model message 
        const modalEl = document.getElementById("cartModal");
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();
        showModal("Please fill all fields with correct data.❗❗❗.");
        return;
    }

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;


    let setData = {
        customer_id: auth.currentUser.uid,
        datetime: new Date().toLocaleString('en-GB'),
        shopping_address: shopAddress,
        shopping_phone: shopPhone,
        status: "pending",
        total_bill: total,
        paymentMethod: paymentMethod,
        items: arrAllCurt,
    };
    // check if payment method online then 
    // set order data in localStorage and go to payment page
    //else set order data in firebase
    if (paymentMethod == "Online") {
        localStorage.setItem("orderData", JSON.stringify(setData));
        window.location.href = "payment.html";
        return;
    }


    const itemsRef = ref(database, 'orders');
    const snapshot = await get(itemsRef);
    // create a new order id
    let newId = 1;
    if (snapshot.exists()) {
        const allKeys = Object.keys(snapshot.val());
        const numericKeys = allKeys.map(k => Number(k)).filter(k => !isNaN(k));
        newId = Math.max(...numericKeys) + 1;
    }

    // set order data in firebase
    await set(ref(database, `orders/${newId}`), setData);
    const modalEl = document.getElementById("cartModal");
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.hide();
    getOrders();
    showModal("Order Added Successfully!");
    arrAllCurt = [];
    total = 0;
    document.getElementById("NoCart").innerHTML = arrAllCurt.length;

});

// !____________get-orders_to order_tab________________

//this function to get all orders of user from firebase
//and show them in order tab
async function getOrders() {
    try {

        //get orders from firebase
        //and loop on all orders 
        //and check if customer id match current user id
        const ordersRef = ref(database, 'orders');
        const orders = await get(ordersRef);
        const allOrders = orders.val();
        let statusItem = '<p class="mb-1">Status: <span class="badge bg-secondary">Pinding</span></p>';

        for (const key in orders.val()) {
            let allitem = '';
            var { datetime, total_bill, status, items, customer_id } = allOrders[key];
            if (customer_id == auth.currentUser.uid) {
                statusItem = '<p class="mb-1">Status: <span class="badge bg-secondary">Pinding</span></p>';

                //check if status from order is(confirmed,completed ,cancelled,shipped,pinding)
                //and set statusItem to show in order tab
                if (status == "confirmed") {
                    statusItem = `<p class="mb-1">Status: <span class="badge bg-primary">Confirmed</span></p>`;
                }
                else if (status == "completed") {
                    statusItem = `<p class="mb-1">Status: <span class="badge bg-success">Completed</span></p>`;
                }
                else if (status == "cancelled") {
                    statusItem = `<p class="mb-1">Status: <span class="badge bg-danger">cancelled</span></p>`;
                }
                else if (status == "shipped") {
                    statusItem = `<p class="mb-1">Status: <span class="badge bg-warning">Shipped </span></p>`;
                }
                else if (status == "pinding") {
                    statusItem = `<p class="mb-1">Status: <span class="badge bg-secondary">Pinding </span></p>`;
                }

                //loop on items in order and set them to all item
                for (const key in items) {
                    allitem += `
                
                <tr>
                <td class="text-dark">#${parseInt(key) + 1}</td>
                <td class="text-danger">${items[key].name}</td>
                <td class="text-primary">Price: $ ${items[key].price}</td>
                <td class="text-danger">Count: ${items[key].count}</td>
                <td class="text-success">Total Price: $ ${items[key].totalp}</td> 
                </tr>
                
                `;
                }
                //this element in order tab 
                document.getElementById("all-orders").innerHTML += `

<div class="list-group-item p-3">
    <div class="d-flex justify-content-between align-items-center flex-wrap">
    <div>
        <h6 class="mb-1">Order #${key}</h6>
        <p class="mb-1 text-muted">Date: ${datetime}</p>
        ${statusItem}
    </div>
    <div class="text-end">
        <p class="mb-1 fw-bold">Total: $ ${total_bill}</p>
        
        <button class="btn btn-outline-primary btn-sm" 
                data-bs-toggle="collapse" 
                data-bs-target="#orderDetails${key}">
        View Details
        </button>
    </div>
    </div>
    
    <div class="collapse mt-3" id="orderDetails${key}">
    <div class="table-responsive">
    <table class="table table-bordered table-hover table-striped align-middle text-center shadow rounded">
    <tbody>
        ${allitem}
    </tbody>
    </table>
    </div>
    </div>
</div>

`

            }
        }

    } catch (error) {
        console.error(error);
    }
}

getOrders();


// !________________btncart______________________

document.getElementById("btncart").addEventListener("click", () => {
    refreshCurd();

});
// ------------------
// this function run when click on btn-cart
//and it will show all items in cart on model-cart
function refreshCurd() {

    total = 0;
    // console.log(arrAllCurt);
    // this element (in tbody of table ) in model- cart
    document.getElementById("cartItems").innerHTML = "";

    // loop on all items in arrAllCurt 
    // and set them to cartItems
    //and calc total price
    arrAllCurt.forEach((item, index) => {

        total += parseFloat(item.totalp);
        // in tr add(index ,item.name,item.count,item.price,item.totalprice)
        //before item.count add btn to minus-> this btn run function minusCount
        //after item.count add btn to plus-> this btn run function plusCount
        document.getElementById("cartItems").innerHTML += `
<tr>
    <td><span class ="text-danger">#${index + 1}- </span>
    <span class ="text-dark">${item.name}</span></td>
    <td class="text-center">
        <button onclick="minusCout(${index})" class="btn btn-sm btn-outline-secondary me-1 ">
        <i class="bi bi-dash"></i>
        </button>
        <span class="fw-bold">${item.count}</span>
        <button onclick="plusCout(${index})" class="btn btn-sm btn-outline-secondary ms-1 ">
        <i class="bi bi-plus"></i>
        </button>
    </td> 
    <td>$${item.price}</td>
    <td>$${item.totalp}</td>
    <td>
        <button onclick="removeItem(${index})"  class="btn btn-sm btn-outline-danger"><i
            class="bi bi-trash"></i></button>
    </td>
</tr>
`

    })
    //set total price & set NoCurt to element NoCart
    document.getElementById("totalPrice").innerHTML = ` $ ${total}`;
    document.getElementById("NoCart").innerHTML = arrAllCurt.length;

}

window.refreshCurd = refreshCurd;

// !_________minusCout__________________
// this function run when click on btn minus in cart
function minusCout(ind) {
    // console.log(ind);

    if (arrAllCurt[ind].count != 1) {
        arrAllCurt[ind].count--;
    }
    arrAllCurt[ind].totalp = arrAllCurt[ind].count * arrAllCurt[ind].price;
    refreshCurd();
}
window.minusCout = minusCout;
// !________plusCout___________________
// this function run when click on btn plus in cart
function plusCout(ind) {

    if (arrAllCurt[ind].count != 100) {
        arrAllCurt[ind].count++;
    }
    arrAllCurt[ind].totalp = arrAllCurt[ind].count * arrAllCurt[ind].price;
    refreshCurd();
}
window.plusCout = plusCout;
// !_______________________________
// this function run when click on btn remove in cart in model
// it will remove item from arrAllCurt 
function removeItem(ind) {
    // console.log(arrAllCurt[ind].keyItem);
    // get btncurt and back to btn (add to curt)
    let btn = document.getElementById(`btncurt${arrAllCurt[ind].keyItem}`);
    btn.classList.remove("btn-success");
    btn.classList.add("btn-warning");
    btn.innerText = "Add to Cart";
    btn.disabled = false;
    // remove item from arrAllCurt  
    arrAllCurt.splice(ind, 1);
    refreshCurd();
}
window.removeItem = removeItem;

