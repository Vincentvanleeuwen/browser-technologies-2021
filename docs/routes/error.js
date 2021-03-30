const router = require('express').Router();

router.get('/', (req, res) => {

  res.render('404', {
    layout: 'main'
  });
});

router.post('/', (req, res) => {

  res.render('404', {
    layout: 'main'
  });
});
module.exports = router;
