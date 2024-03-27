// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-socialmedia-b6969.firebaseapp.com",
  projectId: "mern-socialmedia-b6969",
  storageBucket: "mern-socialmedia-b6969.appspot.com",
  messagingSenderId: "857206035694",
  appId: "1:857206035694:web:c161d981de08c20446cfff",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
