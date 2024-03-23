// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-socialmedia-42139.firebaseapp.com",
  projectId: "mern-socialmedia-42139",
  storageBucket: "mern-socialmedia-42139.appspot.com",
  messagingSenderId: "341258904019",
  appId: "1:341258904019:web:7dbb9b98d8adaafe280f26",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
