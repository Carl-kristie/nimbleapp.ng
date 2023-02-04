import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage"
const firebaseConfig = {
  apiKey: "AIzaSyD4m6dt1T2O3HvR-FN8pZQytxQUKPvmxGU",
  authDomain: "nimble-chat-app.firebaseapp.com",
  projectId: "nimble-chat-app",
  storageBucket: "nimble-chat-app.appspot.com",
  messagingSenderId: "349995845939",
  appId: "1:349995845939:web:0293d1d4c256a6056cd646",
  measurementId: "G-T63D2PZ5Z6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()