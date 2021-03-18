const router = require('express').Router();
const firebase = require('firebase/app');
require('firebase/database');

router.post('/', (req, res) => {
  const globalRef = firebase.database().ref(`${req.body.name}`)
  globalRef.push({
    id: 1
  })
  res.redirect(`/polls/${req.body.name}`)
});

module.exports = router;
