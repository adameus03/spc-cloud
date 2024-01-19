var express = require('express');
const db = require('../database.js');
const dir_utils = require("../dir_utils.js");

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  db.LoginInstance.findByPk(req.cookies["login_id"]).then((loginInstance) => {
    db.Person.findByPk(loginInstance.user_id).then((user) => {
      res.locals.username = user.username;
      res.render('index', { title: 'Index' });
    }).catch((err) => {
      console.log(`Error while seeking Person: ${err}`);
    });
  }).catch((err) => {
    console.log(`Error while seeking LoginInstance: ${err}`);
  });
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

router.get('/shared-directory', async function(req,res,next) {
  res.render('shared-directory.html', {title: 'Shared directory'});
});

module.exports = router;
