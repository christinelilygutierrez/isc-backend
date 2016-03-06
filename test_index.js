var express = require('express');
var multer = require('multer');
var app = express();
var upload = multer({ dest: 'public/uploads/' });

app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.post('/', upload.single('file'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
   res.json(req.body);
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
