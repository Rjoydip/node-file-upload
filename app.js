var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var QRCode = require('qrcode');
//require multer for the file uploads
var multer = require('multer');
var multiparty = require('multiparty');

var app = express();

var DIR = "./uploads";

//create a cors middleware
app.use(function (req, res, next) {
  //set headers to allow cross origin request.
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
  uploadDir: DIR
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// MULTER 
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
})

//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({
  storage: storage
}).any();


// ROUTES

app.get('/', function (req, res) {
  res.sendFile("index.html");
});

app.post('/multiparty_file_upload', function (req, res) {
  var form = new multiparty.Form();
  form.uploadDir = DIR;
  form.multiples = true;

  var RENAMED_FILE;

  form.parse(req, function (err, fields, files) {});

  form.on('progress', function (bytesReceived, bytesExpected) {
    res.write(JSON.stringify({
      bytesReceived,
      bytesExpected
    }));
  });

  form.on('file', function (name, file) {
    RENAMED_FILE = `${Date.now()}${path.extname(file.name)}`;
    fs.rename(file.path, path.join(form.uploadDir, "/", RENAMED_FILE));
  });

  form.on('end', function () {
    res.write("\n");
    res.write(JSON.stringify({
      files: RENAMED_FILE
    }));
  });

  form.on('error', function (err) {
    res.status(422).send({
      err
    });
  });

});

//multer file upload function.
app.post('/multer_file_upload', function (req, res) {

  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {});

  form.on('progress', function (bytesReceived, bytesExpected) {
    res.write(JSON.stringify({
      bytesReceived,
      bytesExpected
    }));
  }); // for get progress

  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      console.log(err);
      return res.status(422).send("an Error occured")
    }

    res.write("\n");
    // No error occured.
    return res.write(JSON.stringify({
      message: "File uploaded successfully"
    }));
  });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({
    err
  });
});

module.exports = app;