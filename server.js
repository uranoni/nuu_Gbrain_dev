require('./config/config.js')

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const moment = require('moment');
const morgan = require("morgan");


const {User} = require('./models/user.js');
const {Team} = require('./models/team.js');
const {Post} = require('./models/post.js')
const {Point} = require('./models/point.js')
const {System} = require('./models/system.js');

var userRouter = require('./api/user.js')
var postRouter = require('./api/post.js')
var teamRouter = require('./api/team.js')
var pointRouter = require('./api/point.js')
var systemRouter = require('./api/system.js')
var fileRouter = require('./api/allFile.js')
var adminRouter = require('./api/admin.js')
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL);

var app = express();
app.use(morgan("dev"));

app.use(bodyParser.json({limit: '200mb'}));
app.use(express.static(__dirname))

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '200mb'
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, authToken"
  );
  res.header("Access-Control-Expose-Headers", "authToken")
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});


app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/team', teamRouter)
app.use('/api/point', pointRouter)
app.use('/api/system', systemRouter)
app.use('/api/allFile', fileRouter)
app.use('/api/admin', adminRouter)

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});


app.listen(process.env.PORT, () => {
  var date = Date.now()
  console.log( `[${moment(date).format("YYYY-MM-DD HH:MM:SS")}]--> start up post ${process.env.PORT}` );
})
