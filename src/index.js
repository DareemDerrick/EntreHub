import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, onSnapshot,
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  updateDoc, getDoc, setDoc
} from 'firebase/firestore'
import {
  getAuth,
  createUserWithEmailAndPassword, 
  signOut, signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJPiS0tPi38tc_zLatJF2Fcl16CGAf1Qc",
  authDomain: "entrehub-6dcb5.firebaseapp.com",
  databaseURL: "https://entrehub-6dcb5-default-rtdb.firebaseio.com",
  projectId: "entrehub-6dcb5",
  storageBucket: "entrehub-6dcb5.firebasestorage.app",
  messagingSenderId: "685069813136",
  appId: "1:685069813136:web:afcfe0ecb6e8e86d861f15",
  measurementId: "G-Y8CDSZY7GS"
}

// init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()

// collection ref
const colRef = collection(db, 'users')

// queries
const q = query(colRef, where("name", "==", "John Doe"), orderBy('createdAt'))

// realtime collection data
onSnapshot(colRef, (snapshot) => {
  let users = []
  snapshot.docs.forEach(doc => {
    users.push({ ...doc.data(), id: doc.id })
  })
  console.log(users)
})

// adding user docs
document.addEventListener('DOMContentLoaded', (event) => {
document.body.addEventListener('submit', (e) => {
  if (e.target.matches('.add')){
    e.preventDefault()
      const name = document.getElementById('name').value;
      const campus = document.getElementById('campus').value;
      const school = document.getElementById('school').value;
      const dOfBirth = document.getElementById('dOfBirth').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      createUserWithEmailAndPassword(auth, email, password)
      .then(cred => {
        const user = cred.user;
        const userData = {
          email: email,
          name: name  
        };
        console.log('user created:', cred.user)
        localStorage.setItem('loggedInUserId', user.uid);
        const docRef = doc(db, 'users', user.uid);
        setDoc(docRef, userData)
        .then(() => {
          window.location.href = 'itemBrowser.html';
        })
        .catch(err => {
          console.log(err.message)
        });
      })
      .catch(err => {
        console.log(err.message)
        const errMsg = error.code;
        if(errMsg == 'auth/email-already-in-use'){
          alert('Email address already exists!')
        } else {
          alert('Unable to create user')
        }
      })
    }
  })
})


//deleting docs
document.addEventListener('DOMContentLoaded', (event) => {
document.body.addEventListener('submit', (e) => {
  if (e.target.matches('.delete')){
    e.preventDefault()

    const docRef = doc(db, 'users', deleteUserForm.id.value)
  
    deleteDoc(docRef)
      .then(() => {
        deleteUserForm.reset()
      })
    }
  })
})

// fetching a single document (& realtime)
// const docRef = doc(db, 'users', 'gGu4P9x0ZHK9SspA1d9j')

// onSnapshot(docRef, (doc) => {
//  console.log(doc.data(), doc.id)
// })

// updating a document
document.addEventListener('DOMContentLoaded', (event) => {
  document.body.addEventListener('submit', (e) => {
    if (e.target.matches('.update')){
      e.preventDefault()
      let docRef = doc(db, 'users', updateForm.id.value)
  
      updateDoc(docRef, {
        name: 'updated name'
      })
      .then(() => {
        updateForm.reset()
      })
    }
  })
})

// signing users up
document.addEventListener('DOMContentLoaded', (event) => {
  document.body.addEventListener('submit', (e) => {
    if (e.target.matches('.signup')){
    e.preventDefault()

    const email = e.target.email.value
    const password = e.target.password.value

    createUserWithEmailAndPassword(auth, email, password)
      .then(cred => {
        console.log('user created:', cred.user)
        e.target.reset()
      })
      .catch(err => {
        console.log(err.message)
      })
    }
  })
})

document.addEventListener('DOMContentLoaded', (event) => {
  document.body.addEventListener('submit', (e) => {
    if (e.target.matches('.signup-b')){
    e.preventDefault()

    const email = e.target.email.value
    const password = e.target.password.value

    createUserWithEmailAndPassword(auth, email, password)
      .then(cred => {
        console.log('user created:', cred.user)
        e.target.reset()
      })
      .catch(err => {
        console.log(err.message)
      })
    }
  })

  // log in and out
document.body.addEventListener('click', (e) => { 
  if (e.target.matches('.logout')) { 
    e.preventDefault()
    signOut(auth) 
    .then(() => { 
      console.log('You have been signed out'); 
    }) 
    .catch((err) => { 
      console.log(err.message); 
    })
  } 
})

const loginForm = document.querySelector('.login')
document.body.addEventListener('submit', (e) => { 
  if (e.target.matches('.login')) { 
    e.preventDefault(); 
    const email = e.target.email.value; 
    const password = e.target.password.value; 
    signInWithEmailAndPassword(auth, email, password) 
    .then((cred) => { 
      console.log('user logged in: ', cred.user); 
      const user = cred.user;
      localStorage.setItem('loggedInUserId', user.uid);
      window.location.href = 'itemBrowser.html'; // Redirect to browser after login
    }) 
    .catch((err) => { 
      console.log(err.message); 
    })
  } 
})
})

// Function to render the login/logout button based on auth state
function renderAuthButton(user) {
  const authButtonContainer = document.getElementById('auth-button-container')
  if(!authButtonContainer){
    console.warn("auth container not found on this page")
    return
  }
  if (user) {
    // If the user is logged in, show a Logout button
    authButtonContainer.innerHTML = 
      `<span class="me-3 text-light">Hello, ${user.email}</span>
      <button class="btn btn-danger" id="logout">Logout</button>`;
    // Add event listener for logout
    document.getElementById('logout').addEventListener('click', () => {
      signOut(auth).then(() => {
        window.location.reload(); // Reload the page after logout
        window.location.href = 'homepage.html'; // Redirect to homepage after logout
      }).catch((error) => {
        console.error('Logout Error:', error);
      })
    })
  } else {
    // If the user is not logged in, show a Login button
    authButtonContainer.innerHTML = `<a href="login.html" class="btn btn-primary">Login</a>`;
  }
}    


document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, (user) => {
    renderAuthButton(user);
  });
});

// Function to render user profile based on Firestore data
// Listen for auth state changes and render the profile when authenticated
document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
      const docRef = doc(db, "users", loggedInUserId);
      console.log('loggedInUserId: ', loggedInUserId);
      getDoc(docRef)
      .then((docSnap) => {
        if(docSnap.exists()){
          const userData = docSnap.data();
          document.getElementById('loggedUserName').innerText = userData.name;
          document.getElementById('loggedUserEmail').innerText = userData.email;
        } else {
          // No user is signed in, redirect to login page
          console.log("No document found matching id")
        }
      })
      .catch((err) => {
        console.log("Error getting document", err);
      })
    } else {
      console.log("User id not found in local storage")
    } 
  });
});