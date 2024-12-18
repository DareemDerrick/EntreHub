import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, onSnapshot,
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  updateDoc
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
    addDoc(colRef, {
      name: addUserForm.name.value,
      campus: addUserForm.campus.value,
      school: addUserForm.school.value,
      dOfBirth: addUserForm.dOfBirth.value,
      createdAt: serverTimestamp()
    })
      .then(() => {
      addUserForm.reset()
      })
    }
  })
})

// adding business docs
document.addEventListener('DOMContentLoaded', (event) => {
  document.body.addEventListener('submit', (e) => {
    if (e.target.matches('.add-b')){
      e.preventDefault()
      addDoc(colRef, {
        businessname: addUserForm.businessname.value,
        name: addUserForm.name.value,
        campus: addUserForm.campus.value,
        school: addUserForm.school.value,
        dOfBirth: addUserForm.dOfBirth.value,
        email: addUserForm.email.value,
        createdAt: serverTimestamp()
      })
        .then(() => {
        addUserForm.reset()
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

  // signing business users up
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

// updating auth changes
onAuthStateChanged(auth, (user) => {
  console.log('user status changed: ', user)
  renderAuthButton(user);
})

// Function to render user profile
function renderUserProfile(user) {
docRef.get()
.then((doc) => {
    if (doc.exists) {
        const userData = doc(db, 'users');

        document.getElementById('name').innerText = userData.name || 'No Name Provided';
        document.getElementById('bio').innerText = userData.bio || 'No Bio Available';
        document.getElementById('email').innerText = userData.email || 'No Email Provided';
        document.getElementById('contact').innerText = userData.contact || 'No Phone Number Provided';
        document.getElementById('campus').innerText = userData.campus || 'No Phone Campus Provided';
        document.getElementById('school').innerText = userData.school || 'No Phone School Provided';
        document.getElementById('linkedin').innerText = userData.linkedin || 'No LinkedIn Profile';
        document.getElementById('linkedin').href = userData.linkedin || '#';
    } else {
      console.error('No such document!');
      document.getElementById('name').innerText = 'User Not Found';
    }
  })
  .catch((error) => {
      console.error('Error fetching user data:', error);
      document.getElementById('user-name').innerText = 'Error Loading Profile';
  });
}

// Check authentication state and render profile if the user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    renderUserProfile(user.uid);
  } else {
    window.location.href = 'login.html'; // Redirect to login if not authenticated
  }
});
