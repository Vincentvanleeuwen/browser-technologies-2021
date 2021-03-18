const firebase = require('firebase/app');
require('firebase/database');
const express = require('express'); // Express web server framework
const handlebars = require('express-handlebars');

const cors = require('cors');
const cookieParser = require('cookie-parser');

if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const port = process.env.PORT || 3000;


const app = express();

const firebaseConfig = {
  apiKey: "AIzaSyCYh5eAY97Umv7z1SsqOaD4Kax8JVkHz9c",
  authDomain: "poller-3def1.firebaseapp.com",
  databaseURL: "https://poller-3def1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "poller-3def1",
  storageBucket: "poller-3def1.appspot.com",
  messagingSenderId: "361512679720",
  appId: "1:361512679720:web:0cab0e67a7454442d6f81d",
  measurementId: "G-7NHRRMFQS1"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// // Require the routes
const home = require('./docs/routes/home');
const addPolls = require('./docs/routes/addPolls');
const polls = require('./docs/routes/polls');
const error = require('./docs/routes/error');
// const callback = require('./docs/routes/callback');
// const create = require('./docs/routes/create');


// Assign handlebars as the view engine
app.set('view engine', 'hbs');
app.set('views', __dirname + '/docs/views')
app.engine('hbs', handlebars({
  extname: 'hbs',
  defaultLayout: 'main',
}))

app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/', home)
  .use('/create-poll', addPolls)
  .use('/polls', polls)
  // Always keep last
  .use('*', error)


console.log(`Listening on ${port}`);
app.listen(port);
