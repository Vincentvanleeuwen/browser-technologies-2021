const router = require('express').Router();
const firebase = require('firebase/app');
require('firebase/database');

// Prevent items from duplicating
let count = 0;

const globalRef = firebase.database().ref('polls/')
globalRef.on('value', function (snap) {
  let polls = snap.val()
  if(!polls) {
    return
  }
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
      // Prevent items from duplicating
      count = 0;
      res.render('newPoll', {
        layout: 'main',
        pollTitle: poll
      });
    })

    router.post(`/${poll}/add-poll`, (req, res) => {
      console.log('Post body', req.body)

      let values;

      if(req.body.answer === 'open-text') {
        values = count
      } else if(req.body.answer === 'open-number') {
        values = count
      } else {
        values = [
          'A: ' + req.body.answerA,
          'B: ' + req.body.answerB,
          req.body.answerC ? 'C: ' + req.body.answerC : null,
          req.body.answerD ? 'D: ' + req.body.answerD : null,
          req.body.answerE ? 'E: ' + req.body.answerE : null
        ]
      }

      const pollRef = firebase.database().ref('polls/').child(`${poll}`)

      // Prevent items from duplicating
      if(count === 0) {
        pollRef.push({
          pollAnswer: {
            type: req.body.answer,
            values: values
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
    router.get(`/${poll}/active`, (req, res) => {
      const pollRef = firebase.database().ref('polls/').child(`${poll}`)
      console.log(poll);
      pollRef.on('value', (snap) => {
        console.log('get', snap.val());

        res.render('playPoll', {
          layout: 'main',
          pollTitle: poll,
          polls: snap.val()
        });
      })

    })

  })
})


module.exports = router
