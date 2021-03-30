const router = require('express').Router()
const firebase = require('firebase/app')
require('firebase/database')
const { makeUrlSafe } = require('../helpers/makeUrlSafe')

router.post('/', (req, res) => {

  const pollRef = firebase.database().ref('poll-list/').child(`${req.body.name}`)

  pollRef.set({pollName: req.body.name}).then(() => console.log('created playlist')).catch(err => console.log(err))
  res.redirect(`/polls/${makeUrlSafe(req.body.name)}`)
});

module.exports = router;
