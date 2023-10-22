var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/transfer-gui', function(req,res, next) {
  res.render('transfer-gui', { title: 'Express'});
});

module.exports = router;
