const express = require('express');
const _ = require('lodash');
const {Team} = require('../models/team.js');
const {Point} = require('../models/point.js');
const {System} = require('../models/system.js');
const {ObjectID} = require('mongodb')
const {authenticate} = require('../middleware/authenticate.js')
const {verifyRole} = require('../middleware/authenticate.js')

const { uploadPlan, uploadVideo, uploadRegister, uploadWarrant, uploadCover } = require('../modules/multer/multerUpload');

var { successCreateMail, sendEmail } = require('../modules/mailerMod.js')

var {storage, upload} = require('../modules/multerStorage.js')
var teamRouter = express.Router();


teamRouter.get('/getForTeacher', authenticate, (req, res) => {
  Team.find({'teacher.email': req.user.email}).then((result) => {
    res.send(result)
  }).catch((e) => {
    res.status(404).send(e)
  })
})


teamRouter.get('/getForTeamate', authenticate, (req, res) => {
  Team.find({$or:[{'leader.email': req.user.email} ,{registers:{$elemMatch: {email: req.user.email}}}]}).then((result) => {
    res.send(result)
  }).catch((e) => {
    res.status(404).send(e)
  })
})


teamRouter.patch('/updatePDF', authenticate, upload, (req, res) => {
  var teamData = JSON.parse(req.body.teamData)
  var pathRegexp = new RegExp("\/uploads.*");
  var planPath = req.files[0].destination.match(pathRegexp)[0]+'/'+req.files[0].filename;

  Team.findOne({_id: teamData._id}).then((team) => {
    console.log(team);
    return team.planUpdate(planPath)
  }).then((team) => {
    console.log(planPath);
    res.send(planPath)
  }).catch((e) => {
    res.status(403).send(e)
  })
})
//更新mp4
teamRouter.patch('/updateMP4', authenticate, upload, (req, res) => {
  var teamData = JSON.parse(req.body.teamData)
  var pathRegexp = new RegExp("\/uploads.*");
  var mp4Path = req.files[0].destination.match(pathRegexp)[0]+'/'+req.files[0].filename;
  Team.findOne({_id: teamData._id}).then((team) => {
    return team.ma4Update(mp4Path)
  }).then((team) => {
    res.send(mp4Path)
  }).catch((e) => {
    res.status(403).send(e)
  })
})

teamRouter.post('/uploadPlan', authenticate, uploadPlan.single('plan'), (req, res) => {
  const teamData = JSON.parse(req.body.teamData);
  const pathRegexp = new RegExp("\/uploads.*");
  let filePath = req.file.path.match(pathRegexp)[0]
  Team.findOne({_id: teamData._id}).then((team) => {
    return team.update({
      $set: {
        plan: filePath
      }
    })
  }).then((team) => {
    res.send({ filePath });
  }).catch((err) => {
    res.status(405).send(err);
  })
})

teamRouter.post('/uploadVideo', authenticate, uploadVideo.single('video'), (req, res) => {
  const teamData = JSON.parse(req.body.teamData);
  const pathRegexp = new RegExp("\/uploads.*");
  let filePath = req.file.path.match(pathRegexp)[0]
  Team.findOne({_id: teamData._id}).then((team) => {
    return team.update({
      $set: {
        video: filePath
      }
    })
  }).then((team) => {
    res.send({ filePath });
  }).catch((err) => {
    res.status(405).send(err);
  })
})

teamRouter.post('/uploadRegister', authenticate, uploadRegister.single('register'), (req, res) => {
  const teamData = JSON.parse(req.body.teamData);
  const pathRegexp = new RegExp("\/uploads.*");
  let filePath = req.file.path.match(pathRegexp)[0]
  Team.findOne({_id: teamData._id}).then((team) => {
    return team.update({
      $set: {
        register: filePath
      }
    })
  }).then((team) => {
    res.send({message: "檔案上傳成功！"});
  }).catch((err) => {
    res.status(405).send(err);
  })
})

teamRouter.post('/uploadWarrant', authenticate, uploadWarrant.single('warrant'), (req, res) => {
  const teamData = JSON.parse(req.body.teamData);
  const pathRegexp = new RegExp("\/uploads.*");
  let filePath = req.file.path.match(pathRegexp)[0]
  Team.findOne({_id: teamData._id}).then((team) => {
    return team.update({
      $set: {
        warrant: filePath
      }
    })
  }).then((team) => {
    res.send({message: "檔案上傳成功！"});
  }).catch((err) => {
    res.status(405).send(err);
  })
})

teamRouter.post('/uploadCover', authenticate, uploadCover.single('cover'), (req, res) => {
  const teamData = JSON.parse(req.body.teamData);
  const pathRegexp = new RegExp("\/uploads.*");
  let filePath = req.file.path.match(pathRegexp)[0]
  Team.findOne({_id: teamData._id}).then((team) => {
    return team.update({
      $set: {
        cover: filePath
      }
    })
  }).then((team) => {
    res.send({message: "檔案上傳成功！"});
  }).catch((err) => {
    res.status(405).send(err);
  })
})


teamRouter.get('/getUsableTeam', (req,res) => {
  Team.find().then((result)=>{
    var data = result.filter((r) => {
      return !r.qualification
    })
    res.send(data)
  }).catch((e)=>{
    res.status(403).send(e)
  })
})



teamRouter.get('/getAllTeam',verifyRole,(req,res)=>{
    Team.find().then((result)=>{
      res.send(result)
    }).catch((e)=>{
      res.status(403).send(e)
    })
})

teamRouter.patch('/setQualification', verifyRole, (req, res) => {
    var qualification = req.body.qualification
  Team.findOneAndUpdate({_id: req.body._teamId},{$set:{qualification}})
    .then((result) => {
      res.send(qualification)
    })
})

//建立隊伍(新)
teamRouter.post('/creatTeam', authenticate, function (req, res) {
  if (req.user.verify) {
    res.status(401).send({
      error: {
        message: '您還沒有做信箱認證！'
      }
    })
  }
  var teamData =  _.pick(req.body,['title','registers','qualification','teacher', 'leader'])
  var team = new Team(teamData)
  team.save().then((result)=>{
    var point = new Point({_teamId: result._id})
    return point.save()
  }).then((result) => {
    return System.findOne({'name':"systemArg"})
  }).then((system) => {
    successCreateMail.to = teamData.leader.email
    successCreateMail.html = system.successCreate
    sendEmail(successCreateMail)
    res.send(team);
  }).catch((e)=>{
    res.status(403).send(e)
  })
})

teamRouter.post('/checkName', (req,res) => {
  var teamName = req.body.teamName
  console.log(teamName);
  Team.find().then((result)=>{
    var data = _.map(result,"teamName")
    var tmp = data.filter((r)=>{
       return r == teamName
    })
    if (tmp.length > 0) {
      return Promise.reject("有重複名稱")
    } else {
      res.send("此名稱可以使用")
    }
  }).catch((e) => {
    res.status(403).send(e)
  })
})

module.exports = teamRouter;
