const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const {User} = require('./models/user.js');
const {Team} = require('./models/team.js');
const {Post} = require('./models/post.js')
const moment = require('moment');
const {ObjectID} = require('mongodb')
const {authenticate} = require('./middleware/authenticate.js')
const {verifyRole} = require('./middleware/authenticate.js')
const multer = require('multer');
const fs = require('fs')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/NuuGBrain', { useMongoClient: true });

var app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/uploads', express.static('uploads'));
// app.use(express.static(__dirname))
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var team = JSON.parse(req.body.teamData)
    if (!fs.existsSync( `${__dirname}/uploads/${team.teamName}`)){
        fs.mkdirSync(`${__dirname}/uploads/${team.teamName}`);
    }
    cb(null,`${__dirname}/uploads/${team.teamName}`)
    },
    filename: function (req, file, cb) {
      var team = JSON.parse(req.body.teamData)
      function getFileExtension1(filename) {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
      }
      var fileName = getFileExtension1(file.originalname);
      var date = Date.now()
      cb(null, `${team.teamName}_${moment(date).format("YYYYMMDD_HHmmss")}.${fileName}`)
    }
  })

  var upload = multer({ storage }).any()
//更新pdf
app.patch('/updatePDF', authenticate, upload, (req, res) => {
  var teamData = JSON.parse(req.body.teamData)
  //var pathRegexp = new RegExp("\/.*");
  var pathRegexp = new RegExp("\/uploads.*");
  var planPath = req.files[0].destination.match(pathRegexp)[0]+'/'+req.files[0].filename;
  Team.findOne({_id: teamData._id}).then((team) => {
    return team.planUpdate(planPath)
  }).then((team) => {
    res.send(team)
  }).catch((e) => {
    res.status(403).send(e)
  })
})
//更新mp4
app.patch('/updateMP4', authenticate, upload, (req, res) => {
  var teamData = JSON.parse(req.body.teamData)
  var pathRegexp = new RegExp("\/uploads.*");
  var mp4Path = req.files[0].destination.match(pathRegexp)[0]+'/'+req.files[0].filename;
  Team.findOne({_id: teamData._id}).then((team) => {
    return team.ma4Update(mp4Path)
  }).then((team) => {
    res.send(team)
  }).catch((e) => {
    res.status(403).send(e)
  })
})

// app.patch('/updateMP4')
//建立隊伍(新)
app.post('/creatTeam', authenticate, upload, function (req, res) {

console.log(req.body);
console.log(req.body.teamData);
  var body = JSON.parse(req.body.teamData)
  var teamData =  _.pick(body,['teamName','title','registers','qualification','teacher'])
  var videoObj = req.files.filter((v)=>{
    return v.mimetype == 'video/mp4'
  })
  var planObj = req.files.filter((p)=>{
    return p.mimetype == 'application/pdf'
  })
  var pathRegexp = new RegExp("\/uploads.*");
  var videoPath = videoObj[0].destination.match(pathRegexp)[0]
  var planPath = planObj[0].destination.match(pathRegexp)[0]
  teamData.video = `${videoPath}/${videoObj[0].filename}`;
  teamData.plan = `${planPath}/${planObj[0].filename}`;
  var team = new Team(teamData)
  team.save().then(()=>{
    res.send(team)
  }).catch((e)=>{
    res.status(403).send(e)
  })
})

//建立隊伍(舊)
// app.post('/creatTeam', authenticate, upload, function (req, res) {
//   var body = _.pick(req.body,['teamName','title','registers','qualification','teacher'])
//
//   // console.log(body);
//   var videoObj = req.files.filter((v)=>{
//     return v.mimetype == 'video/mp4'
//   })
//   var planObj = req.files.filter((p)=>{
//     return p.mimetype == 'application/pdf'
//   })
//   console.log(videoObj);
//   var pathRegexp = new RegExp("\/.*");
//   var videoPath = videoObj[0].destination.match(pathRegexp)[0]
//   var planPath = planObj[0].destination.match(pathRegexp)[0]
//   body.video = `${videoPath}/${videoObj[0].filename}`;
//   body.plan = `${planPath}/${planObj[0].filename}`;
//   var team = new Team(body)
//   team.save().then(()=>{
//     res.send(team)
//   }).catch((e)=>{
//     res.status(403).send(e)
//   })
// })

//寄郵件
app.post('/sendMail',(req,res)=>{
  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'uranoni777@gmail.com',
    pass: 'lucky909075'
  }
});

var mailOptions = {
  from: 'uranoni777@gmail.com',
  to: 'kg650034@gmail.com',
  subject: 'HI using Node.js',
  html:'<h1>wwwwwwwwwwwwwwwwwwwwwwwwww</h1><br><h1>wwwwwwwwwwwwwwwwwwwwwwwwww</h1>'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
    res.status(200).send("OK")
  }
});
})


//新建隊伍
app.post('/newTeam', authenticate, upload, (req, res) => {
  var body = _.pick(req.body,['teamName','title','registers','qualification','video','plan','teacher'])
  var team = new Team(body)
  team.save().then(()=>{
    res.send(team)
  }).catch((e)=>{
    res.status(403).send(e)
  })
})
//建立文章
app.post('/newPost',verifyRole, (req, res) => {
   var author = req.user.name;
   console.log(author);
  var body = _.pick(req.body,['PostId','title','content','time'])
  var posts = new Post(body)
  posts.author=author;
  posts.save().then(()=>{
    res.send(posts)
  }).catch((e)=>{
    res.status(403).send(e)
  })
})

//註冊
app.post('/signup',(req, res) => {
//	console.log(req.body);
  var body = _.pick(req.body, ['email', 'password', 'name', 'phone', 'studentId', 'department', 'lineId', 'roleId'])
  body.time = new Date().toString();
  var user = new User(body);
  user.save().then(() => {
    user.generateAuthToken();
  }).then((token) => {
    res.header('authToken', token).send();
  }).catch((e) => {
    res.status(400).send(e);
  })
});
//登入
app.post('/signin', (req, res) => {
//console.log(req.body);
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('authToken', token).send();
    }).catch(() => {
      res.status(403).send();
    })
  })
})

app.get('/me', authenticate, (req, res) => {
//	console.log(req);
  var user = req.user
  var objUser = user.toJson()
  res.send(objUser);
})
//測試驗證用
app.get('/meverfy', verifyRole, (req, res) => {
  var user = req.user
  var objUser = user.toJson()
  res.send(objUser);
})

app.delete('/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }).catch(() => {
    res.status(400).send();
  })
});

app.patch('/userUpdata', authenticate, (req, res) => {
  var body = _.pick(req.body, ['name','phone','studentId','department','lineId'])
  var token = req.token
  User.findByToken(token).then(user => {
    return user.userUpdata(body)
  }).then((user) => {
    res.send();
  }).catch((e) => {
    res.status(403).send();
  })
})

app.get('/role/:email', (req, res) => {
  var email = req.params.email;
  User.findOne({email}).then((user) => {
    res.send({roleId: user.roleId,name: user.name})
  }).catch((e)=>{
    res.status(403).send();
  })
})

app.listen(3000, () => {
  var date = Date.now()
  console.log('start up post 3000');
  console.log(moment(date).format("YYYYMMDD_HHmmss"));
})
