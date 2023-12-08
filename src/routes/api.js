var express = require('express');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const db = require('../database.js');

var router = express.Router();

router.post('/upload', (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async function(err, fields, files){
      if(files.filetoupload){
        let oldPath = files.filetoupload[0].filepath;

        let session = await db.LoginInstance.findByPk(req.cookies["login_id"]);

        let newPath = `${process.env.USRFILES_LOCATION}/${session.user_id}/${files.filetoupload[0].originalFilename}`;
        console.log(`FILE UPLOAD ${newPath}`);
        let rawData = fs.readFileSync(oldPath);
      
        fs.writeFile(newPath, rawData, function(err){
            if(err) {
              console.log(err);
              return res.send("Upload with an error")
            }
            else {
              return res.send("Successfully uploaded");
            }
            
        });
      }
      else {
        return res.send("No file / empty file attached")
      }
  });
});

router.get('/download', async (req, res) => {
  if(req.query.f){
    //let filepath = `./usrFiles/${req.query.f}`;

    let session = await db.LoginInstance.findByPk(req.cookies["login_id"]);

    let filepath = `${process.env.USRFILES_LOCATION}/${session.user_id}/${req.query.f}`;
    console.log(`FILE DOWNLOAD ${filepath}`);
    if(fs.existsSync(filepath)){
      res.download(filepath);
    }
    else {
      return res.send("No such file.");
    }
  }
});

module.exports = {
	router: router
};
