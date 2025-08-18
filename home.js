// !___________connection to firebase___________
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { ref, get,update, getDatabase } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

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

// !_______________get Element from html___________________

var itemsinbody = document.getElementById('items-in-body');
var itemcategories = document.getElementById('dropdown-item-categories');

// !_________filter by category____________________________

async function filterProducts(categ) {
try {
// _________get products from firebase _______
const productsRef = ref(database, 'products');
const products = await get(productsRef);
const allProduct = products.val();

itemsinbody.innerHTML = ""; 

for (const key in products.val()) {

    var { category, rate, image, name, price, NoOfPersons} = allProduct[key];
    //___________check if category match selected category__
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
            <button class="btn btn-warning w-100 mt-auto" onclick="window.location.href = 'login.html'">Add to Cart</button>
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

// !__________filter-by-Search________________

async function filterbySearchProducts(nm) {
try {
// _________get products from firebase _______

const productsRef = ref(database, 'products');
const products = await get(productsRef);
const allProduct = products.val();
itemsinbody.innerHTML = "";

for (const key in products.val()) {
    var { rate, image, name, price,NoOfPersons } = allProduct[key];

        //___________check if name of product include nm in search__

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
            <button class="btn btn-warning w-100 mt-auto" onclick="window.location.href = 'login.html'">Add to Cart</button>
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

// !__________getProducts_________________

async function getProducts() {
try {
itemcategories.innerHTML = `<li onclick='filterProducts("All Categories")'><a class="dropdown-item" href="#">All Categories</a></li>`;

const productsRef = ref(database, 'products');
const products = await get(productsRef);
const allProduct = products.val();

var arrCategories = [];
itemsinbody.innerHTML = "";
for (const key in products.val()) {

    var { category, image, name, price, rate,NoOfPersons } = allProduct[key];

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
            <button class="btn btn-warning w-100 mt-auto" onclick="window.location.href = 'login.html'">Add to Cart</button>
            </div>
        </div>
    </div>`
    // ____here check if category in arrCategories and 
    // add item Categories in dropdouwn li 
    // and o click call function=> (filterProducts)
    if (!arrCategories.includes(category)) {
        arrCategories.push(category);
        itemcategories.innerHTML += `<li onclick='filterProducts("${category}")'><a class="dropdown-item" href="#">${category}</a></li>`;
        }

    }

} catch (error) {
    console.error("Error :", error);
}

}
getProducts();  //call fun to run when page load
// !_______________slider_________________
const btnSlider = document.getElementById("btn-slides-to");
const imgSlider = document.getElementById("images-slider");

async function setSlider() {
try {
//   get offers from firebase
const offersRef = ref(database, 'offers');
const sliders = await get(offersRef);
const allslider = sliders.val();

imgSlider.innerHTML = "";
btnSlider.innerHTML = "";
var index =0;
//   loop on sliders to set images and btns
for (const key in sliders.val()) {
    var { image } = allslider[key];

    if (index == 0) {

    imgSlider.innerHTML += `
        <div class="carousel-item active">
            <div class="ratio ratio-16x9">
                <img src="${image}" class="img-fluid w-100 h-100 object-fit-cover">
            </div>
        </div>`;

    btnSlider.innerHTML += `<button data-bs-slide-to="0" data-bs-target="#myslider" class="active"></button>`
        
    } else if (index > 0) {

    imgSlider.innerHTML += `
        <div class="carousel-item">
            <div class="ratio ratio-16x9">
                <img src="${image}" class="img-fluid w-100 h-100 object-fit-cover">
            </div>
        </div>`;

    btnSlider.innerHTML += `<button data-bs-slide-to="${index}" data-bs-target="#myslider"></button>`

            }
        index++;
        }
}
catch (error) {
    console.error("error:", error);
}

}
setSlider();  //call fun to run when page load

// !______________btn-search_______________
 //  add event to btn search and call (filterbySearchProducts)
document.getElementById("btn-search").addEventListener("click", async () => {
    let valSearch = document.getElementById("input-search").value;
    // console.log(valSearch);
    
    filterbySearchProducts(valSearch);
});
// !____________showDetails__________________

let NoOfProduct;  // to sign product id when click on view btn 
// and to use it in fun clickImg
// _________________________________

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
    document.getElementById("stars").innerHTML= `
    <img src="images/empty_star.png" img-click="1" onclick="clickImg(this)">
    <img src="images/empty_star.png" img-click="2" onclick="clickImg(this)">
    <img src="images/empty_star.png" img-click="3" onclick="clickImg(this)">
    <img src="images/empty_star.png" img-click="4" onclick="clickImg(this)">
    <img src="images/empty_star.png" img-click="5" onclick="clickImg(this)">
    `;

// loop on products and check if key match val ->(if true) set values in model
    for (const key in products.val()) {
        var {description, image, name, price,rate,NoOfPersons } = allProduct[key];
        if (key == val) {
            inputname.innerHTML = `Product Name: ${name}`;
            inputprice.innerHTML = `Product Price: $ ${price}`;
            inputimageLink.src = image;
            inputdescription.innerHTML = description;
            inputrate.innerHTML= `${rate} (${NoOfPersons})`;
        }
    }


}
window.showDetails = showDetails;

// !______________clickImg________________

// this fun run when click on img star in model and update rate of product
async function clickImg(img) {

    var div = document.getElementById("stars");

    // get num of img-click from imgs
    var n = parseInt(img.getAttribute("img-click"));
    div.innerHTML = "";
    // loop from 1 to 5 to update stars in div in model
    for (let i = 1; i <= 5; i++) {
        if (i <= n) {
            div.innerHTML += `<img src="images/Filled_star.png" img-click="${i}"  onclick="clickImg(this)">`
        } else {
            div.innerHTML += `<img src="images/empty_star.png" img-click="${i}"  onclick="clickImg(this)">`
        }
    } 
//    get product from firebase and update rate and NoOfPersons
    const productsRefget = ref(database, 'products');
    const products = await get(productsRefget);
    const allProduct = products.val();

    const NoPerson = allProduct[NoOfProduct].NoOfPersons ;
    const sumrate = allProduct[NoOfProduct].rate * NoPerson;
    
    // calc new rate to set this in update
    let rate = Math.round((sumrate +n )/(NoPerson+1)*10)/10;
    // console.log(rate);
    
    let updatedData = {
        category:allProduct[NoOfProduct].category,
        name: allProduct[NoOfProduct].name,
        price: allProduct[NoOfProduct].price,
        image: allProduct[NoOfProduct].image,
        description: allProduct[NoOfProduct].description,
        quantity: allProduct[NoOfProduct].quantity,
        rate: rate,
        NoOfPersons: allProduct[NoOfProduct].NoOfPersons +1,
    };
    // console.log(updatedData)
    // update product in firebase
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
 



