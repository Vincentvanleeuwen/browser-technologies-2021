const router = require('express').Router();
const firebase = require('firebase/app');
require('firebase/database');

// Prevent items from duplicating
let count = 0;
const globalRef = firebase.database().ref('polls/')
globalRef.on('value', function (snap) {
  let polls = snap.val()
  let pollKeys = Object.keys(polls)
  pollKeys.forEach(poll => {

    router.get(`/${poll}`, (req, res) => {
      const pollRef = firebase.database().ref('polls/').child(`${poll}`)

      pollRef.on('value', (snap) => {
        console.log('get', snap.val());

        res.render('polls', {
          layout: 'main',
          pollTitle: poll,
          polls: snap.val()
        });
      })

    })

    router.get(`/${poll}/add-poll`, (req, res) => {
      count = 0;
      res.render('newPoll', {
        layout: 'main',
        pollTitle: poll
      });
    })

    router.post(`/${poll}/add-poll`, (req, res) => {
      console.log('Post body', req.body)


      const pollRef = firebase.database().ref('polls/').child(`${poll}`)

      if(count === 0) {
        pollRef.push({
          pollAnswer: {
            type: req.body.answer,
            values: ['A: ' + req.body.answerA, 'B: ' + req.body.answerB]
          },
          pollQuestion: req.body.pollQuestion,
          pollStatus: req.body.pollStatus === 'on'
        })
      }

      count = 1;

      pollRef.on('value', (snap) => {
        console.log('render polls', snap.val());

        res.render('polls', {
          layout: 'main',
          pollTitle: poll,
          polls: snap.val()
        });
      })

    })
  })
})


module.exports = router
