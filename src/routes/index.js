var express = require('express');
const db = require('../database.js');
const dir_utils = require("../dir_utils.js");

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Index' });
});

router.get('/transfer-gui', function(req,res, next) {
  res.render('transfer-gui.html', { title: 'Transfer' });
});

router.get('/list-gui', async function(req,res, next) {
  let session = await db.LoginInstance.findByPk(req.cookies["login_id"]);
  //req.query.d
  if (req.query.d) {
    res.locals.currentDirectory = req.query.d;
    res.locals.filesList = dir_utils.getFileList(session.user_id, req.query.d);
  }
  else {
    res.locals.currentDirectory = "/";
    res.locals.filesList = dir_utils.getFileList(session.user_id);
  }

  res.render('list-gui', { title: 'List' });
});

router.get('/about', async function(req,res,next) {
  res.render('about.html', { title: 'About' });
});

module.exports = router;
