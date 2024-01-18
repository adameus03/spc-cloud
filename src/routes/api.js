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
        let session = await db.LoginInstance.findByPk(req.cookies["login_id"]);
        
        let uploadSucceeded = true;
        for (let file of files.filetoupload) {
          /*let oldpath = file.path;
          let newpath = `${process.env.USRFILES_LOCATION}/${session.user_id}/${file.name}`;
          fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
          });*/
          let oldPath = file.filepath;
          let newPath = `${process.env.USRFILES_LOCATION}/${session.user_id}/${file.originalFilename}`;
          console.log(`FILE UPLOAD ${newPath}`);
          let rawData = fs.readFileSync(oldPath);
          
          fs.writeFile(newPath, rawData, function(err){
              if(err) {
                console.log(`Error while uploading to ${newPath}: ${err}`);
                uploadSucceeded = false;
              }
              else {
                console.log(`Successfully uploaded to ${newPath}`); 
                //return res.send("Successfully uploaded");
              }
              
          });
        }

        if (uploadSucceeded) {
          res.locals.success = files.filetoupload.length === 1 ? "Successfully uploaded the file." : `Successfully uploaded ${files.filetoupload.length} files.`;
          res.render('transfer-gui.html', { title: 'Transfer' });
        } else {
          res.locals.error = "One or more files failed to upload";
          res.render('transfer-gui.html', { title: 'Transfer' });
        }

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
      res.locals.error = "No such file.";
      res.render('transfer-gui.html', { title: 'Transfer' });
      //return;
      //return res.send("No such file.");
    }
  }
});

module.exports = {
	router: router
};
