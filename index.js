const express = require('express');
const fs = require('fs');
const path = require('path')
const formidable = require('formidable');
   
const app = express();
   
app.get('/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<h1>FILE UPLOADING</h1>');
  res.write('<form action="api/upload" method="post" enctype="multipart/form-data">');
  res.write('<input type="file" name="filetoupload"><br>');
  res.write('<input type="submit" value="Store file">');
  res.write('</form>');

  res.write('<h1>FILE DOWNLOADING</h1>');
  res.write('<form action="api/download" method="get">');
  res.write('<input type="text" placeholder="Enter filename..." name="f">');
  res.write('<input type="submit" value="Download file">');
  res.write('</form>');
  return res.end();
});

app.post('/api/upload', (req, res, next) => {
    
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      if(files.filetoupload){
        let oldPath = files.filetoupload[0].filepath;

        let newPath = "./usrFiles/" + files.filetoupload[0].originalFilename;
        let rawData = fs.readFileSync(oldPath)
      
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

app.get('/api/download', (req, res) => {
  if(req.query.f){
    let filepath = `./usrFiles/${req.query.f}`;
    if(fs.existsSync(filepath)){
      res.download(filepath);
    }
    else {
      return res.send("No such file.");
    }
  }
});
   
const port = 8000;
app.listen(port, function(err){
    if(err) console.log(err)
    console.log(`Server listening on Port ${port}`);
});