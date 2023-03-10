// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyD4m6dt1T2O3HvR-FN8pZQytxQUKPvmxGU",
    authDomain: "nimble-chat-app.firebaseapp.com",
    projectId: "nimble-chat-app",
    storageBucket: "nimble-chat-app.appspot.com",
    messagingSenderId: "349995845939",
    appId: "1:349995845939:web:0293d1d4c256a6056cd646",
    measurementId: "G-T63D2PZ5Z6"
  };
  

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
 // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});