const router = require('express').Router();
const firebase = require('firebase/app');
require('firebase/database');
const admin = require('firebase-admin');

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
        // console.log('get', snap.val());
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

        for(i = 0; i < valuesAmount; i++) {
          valuesArray.push(0)
        }
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
          pollStatus: req.body.pollStatus === 'on',
          pollResults: valuesArray
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

    router.get(`/${poll}/activate-poll/:key`, (req, res) => {
      const pollRef = firebase.database().ref('polls/').child(`${poll}`)
      const pollChildRef = pollRef.child(`${req.params.key}`)
      let pollStatus
      pollChildRef.on('value', (snap) => {
        pollStatus = snap.val().pollStatus
      })
      pollChildRef.update({
        'pollStatus': !pollStatus
      })
      pollChildRef.on('value', (snap) => {

        if(snap.val().pollStatus === true) {

          // Create a Push Message
          let message = {
            notification: {
              title: poll,
              body: snap.val().pollQuestion
            },
            topic: poll
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
      })

      pollRef.on('value', (snap) => {
        res.render('polls', {
          layout: 'main',
          pollTitle: poll,
          polls: snap.val()
        });
      })
    })

    router.get(`/${poll}/delete-poll/:key`, (req, res) => {
      const pollRef = firebase.database().ref('polls/').child(`${poll}`)
      pollRef.child(`${req.params.key}`).set(null)
      .then(item => console.log('removed', item))
      .catch(err => console.log('error deleting', err));

      pollRef.on('value', (snap) => {

        res.render('polls', {
          layout: 'main',
          pollTitle: poll,
          polls: snap.val()
        });
      })
    })

    router.get(`/${poll}/active`, (req, res) => {
      const pollRef = firebase.database().ref('polls/').child(`${poll}`)
      console.log('active-completed', req.session.completed)
      if(!req.session.completed) {
        req.session.completed = []
      }

      pollRef.on('value', (snap) => {

        const newQuestions = {}

        snap.forEach(question => {
          const questionId = question.key

          if(!req.session.completed.includes(questionId)){
            newQuestions[question.key] = question.val()
          }
        });

        res.render('playPoll', {
          layout: 'main',
          pollTitle: poll,
          polls: snap.val()
        });
      })
    })

    router.get(`/${poll}/results`, (req, res) => {
      const pollRef = firebase.database().ref('polls/').child(`${poll}`)

      pollRef.on('value', (snap) => {
        console.log('get', Object.values(snap.val()));

        res.render('pollResults', {
          layout: 'main',
          pollTitle: poll,
          polls: snap.val()
        });
      })
    })

    router.post(`/${poll}/:key/submit`, (req, res) => {
      const pollRef = firebase.database().ref('polls/').child(`${poll}`)
      const pollChildRef = pollRef.child(`${req.params.key}`)

      // Get chosen answer
      let answer = parseInt(Object.keys(req.body)[0])
      console.log('answer=',answer)
      console.log('answer=',req.body)
      // Get chosen answer when not multiple choice
      if(isNaN(answer)) {
        answer = Object.values(req.body)[0]
        // Push the answer
        pollChildRef.child(`/pollResults/`).push(answer)
      } else {
        // Increment count
        pollChildRef.child(`/pollResults/${answer}`).transaction(value => value + 1)
      }

      // Save completed questions
      if(!req.session.completed) {
        req.session.completed = []
      }
      req.session.completed.push(req.params.key)
      req.session.save();


      console.log('reqcompleted', req.session.completed)
      pollRef.on('value', (snap) => {

        const newQuestions = {}

        const questionPromise = async () => {
          await snap.forEach(question => {
            const questionId = question.key

            if(!req.session.completed.includes(questionId) && question.val().pollStatus){
              newQuestions[question.key] = question.val()
            }
            console.log('questionresult', newQuestions);
          })
          return newQuestions

        }

        questionPromise().then((obj) => {
          console.log('object=', obj)
          if(Object.keys(obj).length === 0) {
            res.redirect(`/polls/${poll}/results`)
          } else {
            res.render('playPoll', {
              layout: 'main',
              pollTitle: poll,
              polls: newQuestions
            });

          }
        }).catch(err => console.warn('Error Removing Questions', err))

      })
    })
  })
})


module.exports = router
