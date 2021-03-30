const messaging = firebase.messaging();
const notisElem = document.querySelector('.notisElem');

if (!("Notification" in window)) {
  alert("This browser does not support desktop notification");
}

// Let's check whether notification permissions have already been granted
else if (Notification.permission === "granted") {
  // If it's okay let's create a notification
  console.log('Permission granted')
  const notification = new Notification("Hi! You will be notified when a poll is activated");
}

// Otherwise, we need to ask the user for permission
else if (Notification.permission !== "denied") {
  Notification.requestPermission().then( permission => {
    // If the user accepts, let's create a notification
    if (permission === "granted") {
      const notification = new Notification("Hi! You will be notified when a poll is activated");
    }
  });
}

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
messaging
.getToken({vapidKey: 'BGBWBKYjaQdJic_twf3FnVUh9UBOKe8QnaIRgij2OM74CCt9fyFm_Psi9IikIn-ELjN4svtWwQCGsph93fq2cZc' })
.then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    console.log('currentToken',currentToken)
    // ...
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => { console.log('An error occurred while retrieving token. ', err) });


let enableForegroundNotification = true;

messaging
.onMessage(payload => {
  console.log("Message received. ", payload);
  notisElem.innerHTML = payload.notification.body;

  if(enableForegroundNotification) {
    const {title, ...options} = JSON.parse(payload.data.notification);
    navigator.serviceWorker.getRegistrations().then(registration => {
      registration[0]
        .showNotification(title, options)
        .then(r => console.log('notifcationShow', r))
        .catch(e => console.log(e));
    });
  }
});

