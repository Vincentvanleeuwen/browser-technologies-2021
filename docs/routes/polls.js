const router = require('express').Router();
const firebase = require('firebase/app');
require('firebase/database');

const globalRef = firebase.database().ref()
globalRef.on('value', function (snap) {
  let polls = snap.val()
  let pollKeys = Object.keys(polls)
  pollKeys.forEach(poll => {

    router.get(`/${poll}`, (req, res) => {
      res.render('polls', {
        layout: 'main',
        pollTitle: poll
      });
    })

    router.get(`/${poll}/add-poll`, (req, res) => {
      res.render('newPoll', {
        layout: 'main',
        pollTitle: poll
      });
    })


  })
})


module.exports = router
