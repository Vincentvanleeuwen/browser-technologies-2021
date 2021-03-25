importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-messaging.js');

firebase.initializeApp({
  messagingSenderId: '361512679720',
  projectId: "poller-3def1",
  appId: "1:361512679720:web:0cab0e67a7454442d6f81d",
  apiKey: "AIzaSyCYh5eAY97Umv7z1SsqOaD4Kax8JVkHz9c",
});

firebase.messaging().onBackgroundMessage(payload => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/#",
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});
