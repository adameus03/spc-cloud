var express = require('express');
const fs = require('fs');
//const path = require('path');
//const mkdirp = require('mkdirp');
var getDirName = require('path').dirname;
const formidable = require('formidable');
const db = require('../database.js');
const archiver = require('archiver');
const crypto = require('crypto');

var router = express.Router();

/*function writeFile(path, contents, cb) {
  mkdirp.mkdirpNative(getDirName(path), function (err) {
    if (err) return cb(err);
    
    fs.writeFile(path, contents, cb);
  });
}*/
function writeFile(path, contents, cb) {
  fs.mkdir(getDirName(path), { recursive: true}, function (err) {
    if (err) return cb(err);

    fs.writeFile(path, contents, cb);
  });
}

/**
 * @param {String} sourceDir: /some/folder/to/compress
 * @param {String} outPath: /path/to/created.zip
 * @returns {Promise}
 */
function zipDirectory(sourceDir, outPath) {
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', err => reject(err))
      .pipe(stream)
    ;

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

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
          
          writeFile(newPath, rawData, function(err){
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

router.post('/delete', async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function(err, fields, files) {
    if(fields.f){
      let session = await db.LoginInstance.findByPk(req.cookies["login_id"]);
      let filepath = `${process.env.USRFILES_LOCATION}/${session.user_id}/${fields.f}`;
      if(fs.existsSync(filepath)){
        console.log(`file exists: ${filepath}`);
        if (!fs.lstatSync(filepath).isDirectory()) {
          console.log(`FILE DELETE ${filepath}`);
          fs.unlinkSync(filepath);
          //res.locals.success = "Successfully deleted the file.";
          //res.render('transfer-gui.html', { title: 'Transfer' });
          res.send({ success: "Successfully deleted the file."});
        } else {
          console.log(`DIRECTORY DELETE ${filepath}`);
          fs.rmdirSync(filepath, { recursive: true });
          //res.locals.success = "Successfully deleted the directory.";
          //res.render('transfer-gui.html', { title: 'Transfer' });
          res.send({ success: "Successfully deleted the directory."});
        }
        
        //res.render('transfer-gui.html', { title: 'Transfer' });
      }
      else {
        //res.locals.error = "No such file.";
        //res.render('transfer-gui.html', { title: 'Transfer' });
        res.send({ error: "No such file."});
        //return;
        //return res.send("No such file.");
      }
    }
    else {
      //res.locals.error = "No file specified.";
      //res.render('transfer-gui.html', { title: 'Transfer' });
      res.send({ error: "No file specified."});
      //return;
      //return res.send("No file specified.");
    }
  });

  /*if(req.body.f){
    let session = await db.LoginInstance.findByPk(req.cookies["login_id"]);
    let filepath = `${process.env.USRFILES_LOCATION}/${session.user_id}/${req.body.f}`;
    if(fs.existsSync(filepath)){
      console.log(`file exists: ${filepath}`);
      if (!fs.lstatSync(filepath).isDirectory()) {
        console.log(`FILE DELETE ${filepath}`);
        fs.unlinkSync(filepath);
        //res.locals.success = "Successfully deleted the file.";
        res.send({ success: "Successfully deleted the file."});
      } else {
        console.log(`DIRECTORY DELETE ${filepath}`);
        fs.rmdirSync(filepath, { recursive: true });
        //res.locals.success = "Successfully deleted the directory.";
        res.send({ success: "Successfully deleted the directory."});
      }
      
      //res.render('transfer-gui.html', { title: 'Transfer' });
    }
    else {
      //res.locals.error = "No such file.";
      //res.render('transfer-gui.html', { title: 'Transfer' });
      res.send({ error: "No such file."});
    }
  }
  else {
    //res.locals.error = "No file specified.";
    //res.render('transfer-gui.html', { title: 'Transfer' });
    res.send({ error: "No file specified."});
  }*/
});

router.get('/download', async (req, res) => {
  if(req.query.f){
    //let filepath = `./usrFiles/${req.query.f}`;

    let session = await db.LoginInstance.findByPk(req.cookies["login_id"]);

    let filepath = `${process.env.USRFILES_LOCATION}/${session.user_id}/${req.query.f}`;
    if(fs.existsSync(filepath)){
      console.log(`file exists: ${filepath}`);
      if (!fs.lstatSync(filepath).isDirectory()) {
        console.log(`FILE DOWNLOAD ${filepath}`);
        res.download(filepath, (err)=>{
          if (err) {
            console.log(`file download error: ${err}`);
          }
        });
      } else {
        console.log(`DIRECTORY DOWNLOAD ${filepath}`);
        //res.zip({
        //  files: [
        //    { path: filepath, name: req.query.f }
        //  ],
        //  filename: `${req.query.f}.zip`
        //});
        
        let zippath = `/tmp/${genRanHex(32)}.zip`;
        zipDirectory(filepath, zippath).then(() => {
          res.download(zippath, (err)=>{
            if (err) {
              console.log(`file download error: ${err}`);
            }
            fs.unlink(zippath, (err) => {
              if (err) {
                console.log(`file delete error: ${err}`);
              }
            });
          });
        }).catch((err) => {
          console.log(`zip error: ${err}`);
          res.locals.error = "Error while zipping";
          res.render('transfer-gui.html', { title: 'Transfer' });
        });
      }
    }
    else {
      res.locals.error = "No such file.";
      res.render('transfer-gui.html', { title: 'Transfer' });
      //return;
      //return res.send("No such file.");
    }
  }

});

router.get('/share', async (req, res) => {
  let session = await db.LoginInstance.findByPk(req.cookies["login_id"]);
  let filepath = `${process.env.USRFILES_LOCATION}/${session.user_id}/${req.query.f}`;

  let encryptedFileName = req.query.accessKey;
  let personName = req.query.userName;
  let fileToDownload = req.query.fileToDownload;

  let password = '';

  await db.Person.findOne({
    where: {
      username: personName
    }
  }).then((user) => {
    if (user) {
      password = user.password;
    } else {
      res.locals.error = "Invalid access key";
    }
  }).catch((error) => {
    console.error(`Произошла ошибка при поиске пользователя: ${error.message}`);
  });

  const paddingLength = 8 - (password.length % 8);
  if (paddingLength !== 8) {
    password += '\0'.repeat(paddingLength); // Добавляем нули до нужной длины
  }

  const staticSalt = Buffer.from('staticsalt123456');
  const iterations = 10000;
  let derivedKey = '';
  crypto.pbkdf2(password, staticSalt, iterations, 32, 'sha256', (err, key) => {
    if (err) throw err;
    derivedKey = key;
  });

  const algorithm = 'aes-256-cbc';

  const key = crypto.pbkdf2Sync(derivedKey, staticSalt, 100000, 32, 'sha256');
  const iv = crypto.pbkdf2Sync(derivedKey, staticSalt, 100000, 16, 'sha256');

  console.log(derivedKey);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decryptedData = decipher.update(encryptedFileName, 'base64', 'utf-8');
  decryptedData += decipher.final('utf-8');

  console.log('Decrypted Data:', decryptedData);
  });



router.get('/getKey', async (req, res, next) => {
  let fileName = req.query.currentDirectory + req.query.fileName;
  let session = await db.LoginInstance.findByPk(req.cookies["login_id"]);
  let password = ''


  await db.Person.findOne({
      where: {
      user_id: session.dataValues.user_id
    }
  }).then((user) => {
    if (user) {
      password = user.password;
    } else {
      res.locals.error = "Invalid user data";
    }
  }).catch((error) => {
    console.error(`Error: ${error.message}`);
  });

  const staticSalt = new Uint8Array(['staticsalt123456']);
  const iterations = 10000;
  let derivedKey = '';
  crypto.pbkdf2(password, staticSalt, iterations, 32, 'sha256', (err, key) => {
    if (err) throw err;
    derivedKey = key;
  });

  const algorithm = 'aes-256-cbc';

  const key = crypto.pbkdf2Sync(derivedKey, staticSalt, 100000, 32, 'sha256');
  const iv = crypto.pbkdf2Sync(derivedKey, staticSalt, 100000, 16, 'sha256');

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedData = cipher.update(fileName, 'utf-8', 'base64');
  encryptedData += cipher.final('base64');

  res.send({ success: encryptedData});
});


module.exports = {
	router: router
};
