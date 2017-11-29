var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('estadisticas', { title: 'registros PROTUR - Estadísticas por Centro de Salud' });
});

module.exports = router;
