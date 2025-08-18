// !___________connection to firebase___________

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,sendEmailVerification  } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { ref, set, getDatabase } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

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
const auth = getAuth(app);
const database = getDatabase(app);

// !_________Show modal message__________________
function showModal(message) {
    const msg = document.getElementById("customAlertMessage");
    msg.textContent = message;

    const modal = new bootstrap.Modal(document.getElementById("customAlert"));
    modal.show();
}
// !____________btn_Register_____________________

document.getElementById("registerBtn").addEventListener("click", async () => {

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();
const username = document.getElementById("username").value.trim();
const phone = document.getElementById("phone").value.trim();
const address = document.getElementById("address").value.trim();

if (!email || !password || !username || !phone || !address) {
    showModal("Please fill all fields.❗❗❗");
    return;
}

const rgxEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
const rgxPass = /^.{6,}$/;
const rgxPhone = /^01(0|1|2|5)[0-9]{8}$/;
const rgxName = /^[A-Za-z]{3,}( [A-Za-z]{3,})+$/;

if (!rgxEmail.test(email) || !rgxPass.test(password) || !rgxPhone.test(phone) || !rgxName.test(username)) {
    showModal("Please fill all fields with correct data.❗❗❗.");
    return;
    }

try {

const userCredential = await createUserWithEmailAndPassword(auth, email, password);
const userId = userCredential.user.uid;
const user = userCredential.user;

// Send email verification
await sendEmailVerification(user);

        // Save data in Firestore
await set(ref(database, "customers/"+ userId), {
        address:address,
        email: email,
        name: username,
        phone: phone,
        role: 'customer',
        emailVerified: false,
});

    showModal("Your account has been created. Please check your email to activate it");
    // setTimeout(() => {
    //     window.location.href = "homeUser.html";
    // }, 2000); 

    } catch (error) {
        console.log(error);
        
        showModal("Registration failed: " + error.message);
    }
});

