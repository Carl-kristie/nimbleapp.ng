import { initializeApp } from "firebase/app";
import firebase from 'firebase/app';
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

import {getStorage} from "firebase/storage"
const firebaseConfig = {
  apiKey: "AIzaSyD4m6dt1T2O3HvR-FN8pZQytxQUKPvmxGU",
  authDomain: "nimble-chat-app.firebaseapp.com",
  projectId: "nimble-chat-app",
  storageBucket: "nimble-chat-app.appspot.com",
  messagingSenderId: "349995845939",
  appId: "1:349995845939:web:0293d1d4c256a6056cd646",
  measurementId: "G-T63D2PZ5Z6",
};



// Initialize Firebase

const app = initializeApp(firebaseConfig);
 export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()















const messaging = getMessaging();
export const requestForToken = () =>{
  return getToken(messaging, { vapidKey: "BKaZ9wRCilbQ8u341LEn7gey53bpT15LI3SpaDhDKuYL8Z1YZhG14SPzP_jTSG89hQbi8IUoTWk0R3sgO1S7Yao"})
    .then((currentToken) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        // Perform any other necessary action with the token
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload)
      resolve(payload);
    });
  });