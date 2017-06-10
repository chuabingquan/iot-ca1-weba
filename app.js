var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mqtt = require('mqtt');
var config = require('./config');
var operations = require('./Operations');
var Sound = require('./models/sound');
var topic = 'soundInput';

// Use mongoose with native promises
mongoose.Promise = global.Promise;

// Initialize connection to mongodb
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;

// Initialize MQTT connection
var mqttClient = mqtt.connect(config.mqttUrl);

// Log database connection status
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', () => {
  console.log('Connected to database.');

  // Instantiate MQTT Client to subscribe to Raspberry Pi Events
  mqttClient.on('connect', () => {
    console.log('Connected to MQTT');
    mqttClient.subscribe(topic);
    //mqttClient.publish(topic, 'Hello from Node Client!');
  });

  //Listen for published messages
  mqttClient.on('message', (topic, message) => {
    // Message is buffer
    var input = parseFloat(message);
    console.log('Topic:', topic, '\nMessage:', input);

    // Instantiate sound input object
    var soundInputObj = {};
    soundInputObj.value = input;

    // Commit soundInputObj to database
    Sound.create(soundInputObj)
      .then((result) => {
        console.log('Just added to db:', result.value);
      })
      .catch((err) => {
        console.log('Error occured:', err);
      });
    //mqttClient.end();
  });

});

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
