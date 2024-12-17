import { initializeApp } from "firebase/app"
import{ 
    getFirestore, collection, getDocs,
    addDoc, deleteDoc, doc
} from 'firebase/firestore'

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
};

  //initialize firebase app
  initializeApp(firebaseConfig)

  //initialize services
  const db = getFirestore()

  //collection reference
  const colRef = collection(db, 'users')

  //get collection data
  getDocs(colRef)
  .then((snapshot)=> {
    let users = []
    snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id })
    })
    console.log(users)
  })
  .catch(err => {
    console.log(err.message)
  })

  //adding users
  const addUserForm = document.querySelector('.add')
  addUserForm.addEventListener('submit', (e) => {
    e.preventDefault()
    addDoc(colRef, {
        name: addUserForm.name.value,
        email: addUserForm.email.value,
        campus: addUserForm.campus.value,
        dOfBirth: addUserForm.dOfBirth.value,
        school: addUserForm.school.value,
        password: addUserForm.password.value,
    })
    .then(() => {
        addUserForm.reset()
    })
  })

  //deleting users
  const deleteUserForm = document.querySelector('.delete')
  deleteUserForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'users', deleteUserForm.id.value)

    deleteDoc(docRef)
    .then(() => {
        deleteUserForm.reset()
    })
  })