const router = require('express').Router();
const firebase = require('firebase/app');
require('firebase/database');
const admin = require('firebase-admin');
const { makeUrlSafe } = require('../helpers/makeUrlSafe')
// Prevent items from duplicating
let count = 0;

const globalRef = firebase.database().ref('poll-list/')
globalRef.on('value', function (snap) {
  let polls = snap.val()
  if(!polls) {
    return
  }
  let pollKeys = Object.keys(polls)

  pollKeys.forEach(poll => {

    router.get(`/${makeUrlSafe(poll)}`, (req, res) => {

      const pollRef = firebase.database().ref('poll-list').child(`${poll}/polls`).orderByChild('position')

      pollRef.once('value').then(snap => {

        const newPolls = []

        snap.forEach(shot => {
          newPolls.push({...shot.val(), id: shot.key})
        })

        res.render('polls', {
          layout: 'main',
          pollTitle: poll,
          polls: newPolls
        });
      }).catch(err => console.log(err))

    })

    router.get(`/${makeUrlSafe(poll)}/add-poll`, (req, res) => {
      // Prevent items from duplicating
      count = 0;
      res.render('newPoll', {
        layout: 'main',
        pollTitle: poll
      });
    })

    router.post(`/${makeUrlSafe(poll)}/add-poll`, (req, res) => {

      let values;
      let valuesAmount;
      let valuesArray = [];

      if(req.body.answer === 'open-text') {
        values = count
      } else if(req.body.answer === 'open-number') {
        values = count
      } else {
        values = [
          req.body.answerA,
          req.body.answerB,
          req.body.answerC ? req.body.answerC : null,
          req.body.answerD ? req.body.answerD : null,
          req.body.answerE ? req.body.answerE : null
        ]
        valuesAmount = values.filter(value => value !== null).length

        for(let i = 0; i < valuesAmount; i++) {
          valuesArray.push(0)
        }
      }

      const pollRef = firebase.database().ref('poll-list').child(`${poll}/polls`)

      pollRef.once('value', (snap) => {
        // Prevent items from duplicating
        let position;
        if(snap.val() === null) {
          position = 1;
        } else {
          position = Object.keys(snap.val()).length + 1
        }
        if(count === 0) {
          pollRef.push({
            pollAnswer: {
              type: req.body.answer,
              values: values
            },
            pollQuestion: req.body.pollQuestion,
            pollStatus: req.body.pollStatus === 'on',
            pollResults: valuesArray,
            position: position
          })
        }

        count = 1;

      }).then(() => {
        res.redirect(`/polls/${makeUrlSafe(poll)}`)
      }).catch(err => console.log(err))
    })

    router.get(`/${makeUrlSafe(poll)}/activate-poll/:key`, (req, res) => {
      const pollRef = firebase.database().ref('poll-list/').child(`${poll}/polls`)
      const pollChildRef = pollRef.child(`${req.params.key}`)
      let pollStatus
      pollChildRef.on('value', (snap) => {
        pollStatus = snap.val().pollStatus
      })
      pollChildRef.update({
        'pollStatus': !pollStatus
      }).then(() => console.log('Succesfully Updated')).catch(err => console.warn(err))

      pollChildRef.once('value').then(snap => {

        if(snap.val().pollStatus === true) {

          // Create a Push Message
          let message = {
            notification: {
              title: poll,
              body: snap.val().pollQuestion
            },
            topic: makeUrlSafe(poll)
          };

          // Send a message to devices subscribed to the provided topic.
          admin.messaging().send(message)
            .then((response) => {
              // Response is a message ID string.
              console.log('Successfully sent message:', response);
            })
            .catch((error) => {
              console.log('Error sending message:', error);
            });
        }
      }).then(() => console.log('Sent message')).catch(err => console.warn(err))

      res.redirect(`/polls/${makeUrlSafe(poll)}`)

    })

    router.get(`/${makeUrlSafe(poll)}/delete-poll/:key`, (req, res) => {
      const pollRef = firebase.database().ref('poll-list/').child(`${poll}/polls`)
      pollRef.child(`${req.params.key}`).set(null)
      .then(item => console.log('removed', item))
      .catch(err => console.log('error deleting', err));

      res.redirect(`/polls/${makeUrlSafe(poll)}`)
    })

    router.get(`/${makeUrlSafe(poll)}/:key/pos-:direction`, (req, res) =>{
      const pollRef = firebase.database().ref('poll-list').child(`${poll}/polls`)
      const positionRef = pollRef.child(`${req.params.key}`).child('position')

      pollRef.once('value').then(snap => {
        let newPos
        let transactionDirection
        let transactionDirectionTarget

        // Get the position that needs changing
        if(req.params.direction === 'up') {
          newPos = snap.val()[req.params.key].position - 1
          transactionDirection = value => value + 1
          transactionDirectionTarget = value => value - 1
        } else if(req.params.direction === 'down') {
          newPos = snap.val()[req.params.key].position + 1
          transactionDirection = value => value - 1
          transactionDirectionTarget = value => value + 1
        } else {
          res.redirect('/error')
        }

        // Change previous item position.
        snap.forEach(shot => {
          if(shot.val().position === newPos){
            pollRef.child(`${shot.key}`).child('position').transaction(transactionDirection)
              .then((data)=> console.log('Updated old position', data))
              .catch(err => console.log(err));
          }
        })

        // Change the position of chosen item
        positionRef
        .transaction(transactionDirectionTarget)
          .then(()=> console.log('Updated position'))
          .catch(err => console.log(err))

      }).then(()=> {
        res.redirect(`/polls/${makeUrlSafe(poll)}`)
      }).catch(err => console.log(err))

    })


    router.get(`/${makeUrlSafe(poll)}/active`, (req, res) => {
      const pollRef = firebase.database().ref('poll-list').child(`${poll}/polls`).orderByChild('position')

      if(!req.session.completed) {
        req.session.completed = []
      }

      pollRef.once('value').then(snap => {

        const newPolls = []
        snap.forEach(shot => {
          const questionId = shot.key
          if(!req.session.completed.includes(questionId)){
            newPolls.push({...shot.val(), id: shot.key})
          }
        })

        res.render('playPoll', {
          layout: 'main',
          pollTitle: poll,
          polls: newPolls
        });
      })
    })

    router.get(`/${makeUrlSafe(poll)}/results`, (req, res) => {
      const pollRef = firebase.database().ref('poll-list').child(`${poll}/polls`).orderByChild('position')

      pollRef.once('value').then(snap => {

        const newPolls = []

        snap.forEach(shot => {
          newPolls.push({...shot.val(), id: shot.key})
        })

        res.render('pollResults', {
          layout: 'main',
          pollTitle: poll,
          polls: newPolls
        });
      }).catch(err => console.log(err))
    })

    router.post(`/${makeUrlSafe(poll)}/:key/submit`, (req, res) => {
      const pollRef = firebase.database().ref('poll-list').child(`${poll}/polls`)
      const pollChildRef = pollRef.child(`${req.params.key}`)

      // Get chosen answer
      let answer = parseInt(Object.keys(req.body)[0])

      // Get chosen answer when not multiple choice
      if(isNaN(answer)) {
        answer = Object.values(req.body)[0]
        // Push the answer
        pollChildRef.child(`/pollResults/`).push(answer)
      } else {
        // Increment count
        pollChildRef.child(`/pollResults/${answer}`)
        .transaction(value => value + 1)
        .then(() => console.log('added result count'))
        .catch(err => console.log('error adding result count', err))
      }

      // Save completed questions
      if(!req.session.completed) {
        req.session.completed = []
      }
      req.session.completed.push(req.params.key)
      req.session.save();

      pollRef.once('value').then(snap => {

        // if question id is added to req.session.completed,
        // create a new list of questions to show the user without the one they just answered.
        const questionPromise = async () => {
          const newPolls = []
          await snap.forEach(question => {
            const questionId = question.key

            if(!req.session.completed.includes(questionId) && question.val().pollStatus){
              newPolls.push({...question.val(), id: questionId})
            }

          })
          return newPolls
        }

        questionPromise().then((obj) => {
          // if(obj.length === 0) {
          //   res.redirect(`/polls/${makeUrlSafe(poll)}/results`)
          // } else {
            res.render('playPoll', {
              layout: 'main',
              pollTitle: poll,
              polls: obj
            });
          // }
        }).catch(err => console.warn('Error Removing Questions', err))
      })
    })
  })
})

module.exports = router
