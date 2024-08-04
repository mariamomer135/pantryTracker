// Import the functions you need from the SDKs you need
import {initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBajcoiVfPyTZSpQvomKbrpg9DaHkupIns",
  authDomain: "inventory-management-2d47f.firebaseapp.com",
  projectId: "inventory-management-2d47f",
  storageBucket: "inventory-management-2d47f.appspot.com",
  messagingSenderId: "1036749948520",
  appId: "1:1036749948520:web:8e722e97742970817a1ddd",
  measurementId: "G-8SK1LHEL65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export{firestore}