var express = require('express');
var router = express.Router();


router.get(`/.well-known/pki-validation/1D64ED976FDFAAD1B8F72EFFC1180DDE.txt`, function(req,res,next) {
    res.sendFile(`/pers/1D64ED976FDFAAD1B8F72EFFC1180DDE.txt`);
  });
  
  module.exports = router;
  