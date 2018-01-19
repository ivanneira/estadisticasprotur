var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('seguimiento', { title: 'Seguimiento de pacientes' });
});

module.exports = router;
