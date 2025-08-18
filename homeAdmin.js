// !_______________connection to firebase____________________
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { ref, get, remove, update, push, set, getDatabase } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

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
const auth = getAuth(app);

// !____________fun to switch brtween tabs_____________________________

function showTab(tab) {

    document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('d-none'));
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));

    const target = document.getElementById(`tab-${tab}`);
    target.classList.remove('d-none');
    target.classList.add('active');
}

window.showTab = showTab;
// !___________Show modal message__________________

function showModal(message) {
    const msg = document.getElementById("customAlertMessage");
    msg.textContent = message;

    const modal = new bootstrap.Modal(document.getElementById("customAlert"));
    modal.show();
}

// !_____function to confirm Delete_model________________

function confirmDelete() {
    return new Promise((resolve) => {

        document.getElementById("customConfirmMessage").innerText =
            "Are you sure you want to delete this product?";

        const modalElement = document.getElementById("customConfirm");
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        document.getElementById("confirmYes").onclick = function () {
            modal.hide();
            resolve(true);
        };

        document.getElementById("confirmNo").onclick = function () {
            modal.hide();
            resolve(false);
        };
    });
}

// !_____________________________________________________

var itemsinbody = document.getElementById('items-in-body');
var itemcategories = document.getElementById('dropdown-item-categories');

// !_________filter by category__________________

async function filterProducts(categ) {
    try {

        showTab('items');
        // Get all products from Firebase
        const productsRef = ref(database, 'products');
        const products = await get(productsRef);
        const allProduct = products.val();
        itemsinbody.innerHTML = "";
        // loop on all products and filter by category
        // if category is All Categories show all products 
        // if category is not All Categories show products that match the category

        for (const key in products.val()) {
            var { category, image, name, price, rate, NoOfPersons } = allProduct[key];

            if (category == categ || categ == "All Categories") {
                itemsinbody.innerHTML += `
            <div class="col-lg-3 col-md-6 col-sm-12">
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
            <button class="btn btn-info w-50 mt-auto text-light" data-bs-toggle="modal" data-bs-target="#updateProductModal" onclick="editItem (this.value)" value ='${key}'>Edit</button>
            <button class="btn btn-danger w-50 mt-auto" onclick="deleteItem (this.value)" value ='${key}'>Delete</button>
            </div>
        </div>
    </div>
</div>`
            }
        }

    } catch (error) {
        console.error(error);
    }
}
window.filterProducts = filterProducts;

// !__________filter by Search_____________________
// This function filters products based on the search input
// it retrieves all products from Firebase, checks if
// the product name includes the search term, and displays matching products
// in the itemsinbody element.
// It also updates the itemsinbody innerHTML with the filtered products.
async function filterbySearchProducts(nm) {
    try {

        showTab('items');
        const productsRef = ref(database, 'products');
        const products = await get(productsRef);
        const allProduct = products.val();
        itemsinbody.innerHTML = "";

        for (const key in products.val()) {
            var { rate, NoOfPersons, image, name, price, } = allProduct[key];

            if (name.toLowerCase().includes(nm.toLowerCase())) {
                itemsinbody.innerHTML += `
            <div class="col-lg-3 col-md-6 col-sm-12">
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
            <button class="btn btn-info w-50 mt-auto text-light" data-bs-toggle="modal" data-bs-target="#updateProductModal" onclick="editItem (this.value)" value ='${key}'>Edit</button>
            <button class="btn btn-danger w-50 mt-auto" onclick="deleteItem (this.value)" value ='${key}'>Delete</button>
            </div>
        </div>
    </div> 
</div>`
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}
window.filterbySearchProducts = filterbySearchProducts;

// !__________get All Products_________________
// This function retrieves all products from Firebase and displays them in
// the itemsinbody element.
// It also populates the itemcategories dropdown with unique product categories.

async function getProducts() {
    try {
        const productsRef = ref(database, 'products');
        const products = await get(productsRef);
        const allProduct = products.val();

        var arrCategories = [];
        itemsinbody.innerHTML = "";
        itemcategories.innerHTML = `<li onclick='filterProducts("All Categories")'><a class="dropdown-item" href="#">All Categories</a></li>`;

        for (const key in products.val()) {
            var { category, description, image, name, price, rate, NoOfPersons } = allProduct[key];

            itemsinbody.innerHTML += `
            <div class="col-lg-3 col-md-6 col-sm-12">
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
            <button class="btn btn-info w-50 mt-auto text-light" data-bs-toggle="modal" data-bs-target="#updateProductModal" onclick="editItem (this.value)" value ='${key}'>Edit</button>
            <button class="btn btn-danger w-50 mt-auto" onclick="deleteItem (this.value)" value ='${key}'>Delete</button>
            </div>
        </div>
    </div>
</div>`
            // Check if the category is already in the array
            // If not, add it to the array and the dropdown
            //onclick to filter products by category
            if (!arrCategories.includes(category)) {
                arrCategories.push(category);
                itemcategories.innerHTML += `<li onclick='filterProducts("${category}")'><a class="dropdown-item" href="#">${category}</a></li>`;
            }
        }

    } catch (error) {
        console.error(error);
    }
}
getProducts();
// !______________btn-search_______________
// This action when the search button is clicked.
// call function filterbySearchProducts

document.getElementById("btn-search").addEventListener("click", async () => {
    const valSearch = document.getElementById("input-search").value;
    console.log(valSearch);

    await filterbySearchProducts(valSearch);
});

// !___________fun Delete___________________
// This function deletes a product from Firebase after confirming the action.
// It uses the confirmDelete function to show a confirmation modal.
// If the user confirms, it removes the product from the database and updates the product list.
async function deleteItem(val) {

    const confirmed = await confirmDelete();

    if (!confirmed) {
        return;
    }

    const productRef = ref(database, 'products/' + val);

    remove(productRef)
        .then(() => {
            showModal("Product deleted successfully");
            getProducts();
        })
        .catch((error) => {
            console.error(" Error deleting product: ", error);
        });
}
window.deleteItem = deleteItem;

// !_____________fun_edit___________________
// This function set a product's details from Firebase and 
//set values in the update product form in model updateProductModal
// It uses the product key (val) to fetch the product data and fill in the form

let keyOfItem;

async function editItem(val) {

    keyOfItem = val;
    // Get the product data from Firebase
    const productsRef = ref(database, 'products');
    const products = await get(productsRef);
    const allProduct = products.val();

    // Get the input fields in the update product form
    const inputcategory = document.getElementById("categoryupdate");
    const inputname = document.getElementById("nameupdate");
    const inputprice = document.getElementById("priceupdate");
    const inputquantity = document.getElementById("quantityupdate");
    const inputimageLink = document.getElementById("imgupdate");
    const inputdescription = document.getElementById("descriptionupdate");
    const inputrate = document.getElementById("rateupdate");

    // loop and check if the key matches the product key
    // if it matches, set the input fields with the product data
    for (const key in products.val()) {
        var { category, description, image, name, price, quantity, rate } = allProduct[key];
        if (key == val) {
            inputcategory.value = category;
            inputname.value = name;
            inputprice.value = price;
            inputquantity.value = quantity;
            inputimageLink.value = image;
            inputdescription.value = description;
            inputrate.value = rate;
        }
    }


}
window.editItem = editItem;

// !_____________btn update___________________
// when click on update product button in the updateProductModal
// it will get the values from the input fields 
// and update the product in Firebase

document.getElementById('updateProductBtn').addEventListener("click", async () => {

    //get value from elements input in model update
    const category = document.getElementById("categoryupdate").value.trim();
    const name = document.getElementById("nameupdate").value.trim();
    const price = parseFloat(document.getElementById("priceupdate").value);
    const quantity = parseInt(document.getElementById("quantityupdate").value);
    const img = document.getElementById("imgupdate").value.trim();
    const description = document.getElementById("descriptionupdate").value.trim();
    const rate = parseFloat(document.getElementById("rateupdate").value);

    if (!category || !name || isNaN(price) || isNaN(quantity) || !img || !description || isNaN(rate) || rate < 0 || rate > 5) {
        //hide th model to show model message 
        const modalEl = document.getElementById("updateProductModal");
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();

        showModal("Please fill all fields correctly.");
        return;
    }
    // get the product data from Firebase
    const productsRefget = ref(database, 'products');
    const products = await get(productsRefget);
    const allProduct = products.val();
    let NoOfPersons;
    if (allProduct[keyOfItem].NoOfPersons == undefined) {
        NoOfPersons = 1;
    }
    else {
        NoOfPersons = allProduct[keyOfItem].NoOfPersons
    }


    let updatedData = {
        category: category,
        name: name,
        price: price,
        image: img,
        description: description,
        quantity: quantity,
        rate: rate,
        NoOfPersons: NoOfPersons,
    };
    // Update the product in Firebase
    const productRef = ref(database, 'products/' + keyOfItem);
    update(productRef, updatedData)
        .then(() => {
            showModal('Update Successfuly');
            getProducts();
            document.getElementById("productFormupdate").reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('updateProductModal'));
            modal.hide();
        })
        .catch((error) => {
            console.error("Failed in Update", error);
        });

})


// !____________get orders__________________
// This function get all orders from Firebase and displays them in the "all-orders" element
// It get the order details, including customer information, payment method, shopping address, and items

async function getOrders() {
    try {
        document.getElementById("all-orders").innerHTML = "";

        // Get all orders from Firebase
        const ordersRef = ref(database, 'orders');
        const orders = await get(ordersRef);
        const allOrders = orders.val();
        let statusItem = '<p class="mb-1">Status: <span class="badge bg-secondary">Pinding</span></p>';
        const keys = Object.keys(allOrders);

        // Loop through each order and display its details
        // The order details include customer information, payment method, shopping address, and items
        // The items in order are displayed in a collapse list 
        for (let i = keys.length - 1; i >= 0; i--) {
            const key = keys[i];
            let allitem = '';
            var { datetime, total_bill, status, items, customer_id, paymentMethod, shopping_address, shopping_phone } = allOrders[key];

            // fun getcustomer to get customer data from Firebase
            let customer = await getcustomer(customer_id);

            // this will be used to display customer information in the order details       
            allitem += `
                <tr class="text-center text-light bg-dark">
                <td class="text-light">Order ID: ${key}</td>
                <td class="text-light">Name : ${customer.name}</td>
                <td class="text-light">Payment : ${paymentMethod}</td>
                <td class="text-light">Address : ${shopping_address}</td>
                <td class="text-light">Phone : ${shopping_phone}</td>
                </tr>
    `

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
            else if (status == "pending") {
                statusItem = `<p class="mb-1">Status: <span class="badge bg-secondary">Pinding</span></p>`;
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
                </tr>`
            }

//this element in order tab 
document.getElementById("all-orders").innerHTML += `

<div class="list-group-item p-3">
    <div class="d-flex justify-content-between align-items-center flex-wrap">
        <div>
        <h6 class="mb-1">Order #${key}</h6>
        <p class="mb-1 text-muted">Date: ${datetime}</p>
        <div>${statusItem}</div> 
        </div>
        <div class="d-flex gap-2">
    <button class="btn btn-primary btn-sm" onclick='updateStatus("${key}","confirmed")'>confirm</button>
    <button class="btn btn-success btn-sm" onclick='updateStatus("${key}","completed")'>complete</button>
    <button class="btn btn-danger btn-sm"  onclick='updateStatus("${key}","cancelled")'> cancel</button>
    <button class="btn btn-warning btn-sm" onclick='updateStatus("${key}","shipped")'>shipped</button>
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

    } catch (error) {
        console.error(error);
    }
}
getOrders();
// !______________________________________
// This function return customer data from Firebase based on the customer ID
async function getcustomer(Id) {
    try {
        const dbRef = ref(database, `customers/${Id}`);
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log("No data available");
            return null;
        }
    } catch (error) {
        console.error(error);
    }
}
// !________________updateStatus__________
// This function updates the status of an order in Firebase
// It takes the order key and the new status as parameters
// this fun run when the user clicks on the confirm, complete, cancel, or shipped button in the order tab
async function updateStatus(key, status) {

    try {
        console.log(status);

        await update(ref(database, `orders/${key}`), { status: status });

        getOrders();

        showModal(`Order ${key} updated successfully`);
    } catch (error) {
        console.error("Error updating order:", error);
    }
}
window.updateStatus = updateStatus;

//!___________getAllCustomers__________________
// This function get all customers from Firebase and displays them in the customers table
// in tab customer
async function getAllCustomers() {
    let body = document.getElementById("customersTableBody");
    try {

        //get all customers from Firebase
        const customersRef = ref(database, 'customers');
        const customers = await get(customersRef);
        const allcustomers = customers.val();
        const keys = Object.keys(allcustomers);
        for (let i = keys.length - 1; i >= 0; i--) {
            const key = keys[i];
            var { address, email, name, phone } = allcustomers[key];

// add customer data to the customers table body
body.innerHTML += `
<tr>
    <td>${name}</td>
    <td>${address}</td>
    <td>${phone}</td>
    <td>${email}</td>
</tr>
`;

}

    } catch (error) {
        console.error(error);
    }
}
getAllCustomers();

// !_______________getAllAdmins_______________________
// This function get all admins from Firebase and displays them in the admins table

async function getAllAdmins() {
    let body = document.getElementById("adminsTableBody");
    try {
        body.innerHTML = '';
        const adminsRef = ref(database, 'admins');
        const admins = await get(adminsRef);
        const alladmins = admins.val();
        const keys = Object.keys(alladmins);
        for (let i = keys.length - 1; i >= 0; i--) {
            const key = keys[i];
            var { email, username } = alladmins[key];
            body.innerHTML += `
<tr>
    <td>${username}</td>
    <td>${email}</td>
</tr>
`;

        }

    } catch (error) {
        console.error(error);
    }
}
getAllAdmins();

//! ___________btn add admin_____________________
// this btn when clicked, it will get the values from the input fields in tab admin
// and add the admin to Firebase

document.getElementById("addAdmin").addEventListener("click", async () => {
    const email = document.getElementById("input-email").value.trim();
    const password = document.getElementById("input-password").value.trim();
    const username = document.getElementById("input-name").value.trim();
// check if email, password, and username are not empty
    if (!email || !password || !username) {
        showModal("Please fill all fields.❗❗❗");
        return;
    }
// validate email, password, and username using regex
    const rgxEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/
    const rgxPass = /^[a-zA-Z0-9]{6,10}$/
    const rgxName = /^[A-Za-z]{3,}( [A-Za-z]{3,})+$/
    if (!rgxEmail.test(email) || !rgxPass.test(password) || !rgxName.test(username)) {
        showModal("Please fill all fields with correct data.❗❗❗.");
        return;
    }

    try {

        // Create a new user admin with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // set the admin data in Firebase
        await set(ref(database, "admins/" + userId), {
            email: email,
            username: username,
            role: 'admin',
        });

        showModal("Admin Added successfully");
        getAllAdmins();

    } catch (error) {
        console.log(error);

        showModal("Registration failed: " + error.message);
    }
});

// !__________get All slides_________________
// This function get all slides (offers) from Firebase and displays them 
// in the sliders section

async function getslides() {
    let sliders = document.getElementById("sliders");
    try {
        // Get all offers from Firebase
        const offersRef = ref(database, 'offers');
        const offers = await get(offersRef);
        const alloffers = offers.val();

        sliders.innerHTML = "";

        // set all slides in the sliders section
        for (const key in offers.val()) {
            var { image } = alloffers[key];

            sliders.innerHTML +=
                `<div class="col-lg-4 col-md-6 col-sm-12 ">
    <div class="card h-100">
        <img src="${image}" class="card-img-top mt-2">
        <div class="card-body d-flex flex-column justify-content-center align-items-center">
            <button class="btn btn-danger w-50 mt-auto" onclick="deleteSlide (this.value)" value ='${key}'>Delete</button>
        </div>
    </div>
</div>`
        }

    } catch (error) {
        console.error(error);
    }

}
getslides();

//! ________deleteSlide_________
// This function deletes a slide (offer) from Firebase after 
// confirming the action
async function deleteSlide(val) {
    const confirmed = await confirmDelete();

    // If the user does not confirm, exit the function
    if (!confirmed) {
        return;
    }

    const slidesRef = ref(database, 'offers/' + val);

    // Remove the slide from Firebase
    remove(slidesRef)
        .then(() => {
            showModal("Slide deleted successfully");
            getslides();
        })
        .catch((error) => {
            console.error(" Error deleting Slide: ", error);
        });
}

window.deleteSlide = deleteSlide;

// !_____________btn Add slide_____________________
// This button when clicked, it will get the image link from the input field in tab slides
// and add the slide (offer) to Firebase

document.getElementById('btn-add-slide').addEventListener("click", async () => {
    let img = document.getElementById('imageslide').value;
    
    // Check if the image link is empty
    if (img == null || img == "") {
        showModal("Enter image link!");
        console.log(img);

        return;
    }
    let setData = {
        image: img,
    };

    // set new id for the new slide
    const itemsRef = ref(database, 'offers');
    const snapshot = await get(itemsRef);
    let newId = 1;
    if (snapshot.exists()) {
        const allKeys = Object.keys(snapshot.val());
        const numericKeys = allKeys.map(k => Number(k)).filter(k => !isNaN(k));
        newId = Math.max(...numericKeys) + 1;
    }

    // Add the new slide to Firebase
    await set(ref(database, `offers/${newId}`), setData);
    showModal("Image Added Successfully!");
    getslides();
})

// !______________saveProductBtn_________________
// This button when clicked, it will get the values from the input fields in tab items
// and add the product to Firebase

document.getElementById("saveProductBtn").addEventListener("click", async () => {
    try {
        // Get values from input fields in the product form
        const category = document.getElementById("category").value.trim();
        const name = document.getElementById("name").value.trim();
        const price = parseFloat(document.getElementById("price").value);
        const quantity = parseInt(document.getElementById("quantity").value);
        const img = document.getElementById("img").value.trim();
        const description = document.getElementById("description").value.trim();
        const rate = parseFloat(document.getElementById("rate").value);

        // Validate the input fields
        // Check if all fields are filled correctly
        if (!category || !name || isNaN(price) || isNaN(quantity) || !img || !description || isNaN(rate) || rate < 0 || rate > 5) {
            //hide th model to show model message 
            const modalEl = document.getElementById("addProductModal");
            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.hide();
            showModal("Please fill all fields correctly.");
            return;
        }

        let setData = {
            category: document.getElementById("category").value.trim(),
            name: document.getElementById("name").value.trim(),
            price: parseFloat(document.getElementById("price").value),
            image: document.getElementById("img").value.trim(),
            description: document.getElementById("description").value.trim(),
            quantity: parseInt(document.getElementById("quantity").value),
            rate: parseFloat(document.getElementById("rate").value),
            NoOfPersons: 1
        };
        // set product to firebase
        const newProductRef = push(ref(database, "products"));
        await set(newProductRef, setData);

        showModal("Product Added Successfully!");
        getProducts();
        document.getElementById("productForm").reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        modal.hide();
    } catch (error) {
        console.error("Error adding product:", error)
        showModal("Failed to add product!");

    }
});




