// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC522JHfHub6GGzt8dor2YaN0ndW_Y_4uM",
  authDomain: "csci5408fall2023.firebaseapp.com",
  projectId: "csci5408fall2023",
  storageBucket: "csci5408fall2023.appspot.com",
  messagingSenderId: "674650913254",
  appId: "1:674650913254:web:96e7d459988337b12bbe27"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export default app;