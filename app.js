const firebase = require('firebase/app');
const admin = require('firebase-admin');
require('firebase/database');
const express = require('express'); // Express web server framework
const handlebars = require('express-handlebars');
const session = require('express-session')
const cors = require('cors');
const cookieParser = require('cookie-parser');

if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const port = process.env.PORT || 3000;
const app = express();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT
};

admin.initializeApp({
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT
  })
});
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// // Require the routes
const home = require('./docs/routes/home');
const addPolls = require('./docs/routes/addPolls');
const polls = require('./docs/routes/polls');
const error = require('./docs/routes/error');

// Assign handlebars as the view engine
app.set('view engine', 'hbs');
app.set('views', __dirname + '/docs/views')
app.engine('hbs', handlebars({
  extname: 'hbs',
  defaultLayout: 'main',
  helpers: require('./docs/config/handlebarsHelpers')
}))

app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(session({
    secret: 'pollerrr-secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: 'auto' }
  }))
  .use('/', home)
  .use('/create-poll', addPolls)
  .use('/polls', polls)
  // Always keep last
  .use('*', error)

console.log(`Listening on ${port}`);
app.listen(port);
