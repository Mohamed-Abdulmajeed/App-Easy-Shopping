// !_______________connection to firebase____________________
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendEmailVerification,sendPasswordResetEmail  } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { ref, get, getDatabase,update } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

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
const database = getDatabase();

// !_________Show modal message__________________
function showModal(message) {
  const msg = document.getElementById("customAlertMessage");
  msg.textContent = message;

  const modal = new bootstrap.Modal(document.getElementById("customAlert"));
  modal.show();
}

function showVerifyModal() {
  const modal = new bootstrap.Modal(document.getElementById("verifyModal"));
  modal.show();
}

//  !_______btn_login____________

document.getElementById("loginBtn").addEventListener("click", login);

function login() {

  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      const user = userCredential.user;
      const userId = user.uid;
      const adminRef = ref(database, 'admins/' + userId);
      // check if the user is an admin
      get(adminRef).then((adminSnap) => {

        if (adminSnap.exists()) {

          showModal("Login Admin Success ", "success");
          setTimeout(() => {
            window.location.href = "homeAdmin.html";
          }, 2000);

        } else {

          const customerRef = ref(database, 'customers/' + userId);
          //check if the user is an customer
          get(customerRef).then(async (custSnap) => {
            if (custSnap.exists()) {

              const user = userCredential.user;
              await user.reload();
              if (!user.emailVerified) {
                showVerifyModal();
                return;
              }
              else {

                const customerRef = ref(database, "customers/" + user.uid);

                await update(customerRef, {
                  emailVerified: true
                });
                showModal("Login User Success ", "success");
                setTimeout(() => {
                  window.location.href = "homeUser.html";
                }, 2000);
              }

            } else {

              showModal(" User not found go to register", "danger");
            }
          });
        }

      });
    })
    .catch((error) => {
      console.log("Error during login:", error);
      showModal("Login failed: go to register ", "danger");
    });

}

// ____________________________

document.getElementById("resendBtn").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      await sendEmailVerification(user);
      const modalEl = document.getElementById("verifyModal");
      const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modal.hide();
      showModal("Verification email resent successfully!");
    } catch (error) {
      showModal(" Error: " + error.message);
    }
  }
});


///______________

document.getElementById("resetBtn").addEventListener("click", async () => {
  const email = document.getElementById("resetEmail").value.trim();

  if (!email) {
    showModal("Please enter your email address.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email, {
      url: "https://app-easy-shopping.vercel.app/login.html",
      handleCodeInApp: false,
    });

    showModal("Password reset email sent! Please check your inbox.");

    const modal = bootstrap.Modal.getInstance(document.getElementById("resetPasswordModal"));
    modal.hide();

  } catch (error) {
    const modal = bootstrap.Modal.getInstance(document.getElementById("resetPasswordModal"));
    modal.hide();
    showModal(" Error: " + error.message);
  }
});

















