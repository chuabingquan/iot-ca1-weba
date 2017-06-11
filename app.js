var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socketio = require('socket.io');
var mongoose = require('mongoose');
var mqtt = require('mqtt');
var config = require('./config');
var operations = require('./Operations');
var Sound = require('./models/sound');
var topic = 'soundInput';

// Require routes
var index = require('./routes/index');
var users = require('./routes/users');
var sounds = require('./routes/sounds');

var app = express();

// Initialize Socket.IO
var io = socketio();
app.io = io;

io.on('connection', (socket) => {
  socket.removeAllListeners();
  console.log('Web Client connected!');

  // On 'toggle' event, retrieve data from web client
  socket.on('toggle', (data) => {
    console.log(data);
    mqttClient.publish('toggle', JSON.stringify(data));
  });
});

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
    mqttClient.subscribe('ledChange');
    //mqttClient.publish(topic, 'Hello from Node Client!');
  });

  //Listen for published messages
  mqttClient.on('message', (topic, message) => {
    //console.log('Topic:', topic, '\nMessage:', input);
      console.log('MQTT soundInput event');
      // Message is buffer
      var payload = JSON.parse(message.toString('UTF-8'));
      //var input = parseFloat(message);

      // Instantiate sound input object
      var soundInputObj = {};
      soundInputObj.value = parseFloat(payload.soundValue);
      soundInputObj.ledStatus = payload.ledStatus;

      var temporaryResult = null;

      var currentDate = new Date();
      var currentYear = currentDate.getFullYear();
      var currentMonth = currentDate.getMonth() + 1;
      var currentDate = currentDate.getDate();
      var startTime = '00:00:00.000';
      var endTime = '23:59:59:999';

      var gteTimestamp = currentYear + '-' + currentMonth + '-' + currentDate + ' ' + startTime;
      var lteTimestamp = currentYear + '-' + currentMonth + '-' + currentDate + ' ' + endTime;
      

      //var currentTimestamp = TimeStamp(new Date(currentYear, currentMonth, currentDate), 0);
      console.log(gteTimestamp, lteTimestamp);

      // Commit soundInputObj to database
      Sound.create(soundInputObj)
        .then((result) => {
          console.log('Just added to db:', result.value, result.ledStatus, 'at:', result.createdAt);
          temporaryResult = result; 
          //Find all ledStatus == true from db
          return Sound.find({ 'ledStatus': true, 'createdAt': { '$gte': gteTimestamp, '$lte': lteTimestamp } });
        })
        .then((instance) => {
          console.log(instance.length);
          // Emit 'mqtt' event for Socket.IO Web Client
          io.emit('publish', {
            topic: topic,
            value: temporaryResult.value,
            ledStatus: temporaryResult.ledStatus,
            activatedCounter: instance.length,
            createdAt: temporaryResult.createdAt
          });
        })
        .catch((err) => {
          console.log('Error occured:', err);
        });
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/api/sounds', sounds);

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
  res.render('error');
});

module.exports = app;