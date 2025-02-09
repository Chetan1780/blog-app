// Import the functions you need from the SDKs you need
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import { initializeApp } from "firebase/app";
import { getEnv } from './getEnv';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:getEnv('VITE_FIREBASE_API'),
  authDomain: "blog-app-406c7.firebaseapp.com",
  projectId: "blog-app-406c7",
  storageBucket: "blog-app-406c7.firebasestorage.app",
  messagingSenderId: "288239093954",
  appId: "1:288239093954:web:363eca2cca272dd211535b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {auth,provider};