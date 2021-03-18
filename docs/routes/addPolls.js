const router = require('express').Router();
const firebase = require('firebase/app');
require('firebase/database');

router.post('/', (req, res) => {
  const pollRef = firebase.database().ref('polls/').child(`${req.body.name}`)
  pollRef.push({
    pollAnswer: {
      type: 'multiple',
      values: ['A: Like this!', 'B: No! Like That']
    },
    pollQuestion: 'How can you make a poll?',
    pollStatus: false
  })
  res.redirect(`/polls/${req.body.name}`)
});

module.exports = router;
