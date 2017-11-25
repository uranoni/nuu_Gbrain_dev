const express = require('express');
const _ = require('lodash');
const {dbChange} = require('../models');
const {ObjectID} = require('mongodb')
const {authenticate} = require('../middleware/authenticate.js')
const {verifyRole} = require('../middleware/authenticate.js')
var { successCreateMail, sendEmail } = require('../modules/mailerMod.js')

var {storage, upload} = require('../modules/multerStorage.js')
var teamRouter = express.Router();


teamRouter.get('/getForTeacher', authenticate, (req, res) => {
  dbChange('test3', 'Team').find({'teacher.email': req.user.email}).then((result) => {
    res.send(result)
  }).catch((e) => {
    res.status(404).send(e)
  })
})


teamRouter.get('/getForTeamate', authenticate, (req, res) => {
  dbChange('test3', 'Team').find({$or:[{'leader.email': req.user.email} ,{registers:{$elemMatch: {email: req.user.email}}}]}).then((result) => {
    res.send(result)
  }).catch((e) => {
    res.status(404).send(e)
  })
})


teamRouter.patch('/updatePDF', authenticate, upload, (req, res) => {
  var teamData = JSON.parse(req.body.teamData)
  var pathRegexp = new RegExp("\/uploads.*");
  var planPath = req.files[0].destination.match(pathRegexp)[0]+'/'+req.files[0].filename;

  dbChange('test3', 'Team').findOne({_id: teamData._id}).then((team) => {
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
  dbChange('test3', 'Team').findOne({_id: teamData._id}).then((team) => {
    return team.ma4Update(mp4Path)
  }).then((team) => {
    res.send(mp4Path)
  }).catch((e) => {
    res.status(403).send(e)
  })
})

teamRouter.get('/getUsableTeam', (req,res) => {
  dbChange('test3', 'Team').find().then((result)=>{
    var data = result.filter((r) => {
      return !r.qualification
    })
    res.send(data)
  }).catch((e)=>{
    res.status(403).send(e)
  })
})

teamRouter.get('/getAllTeam',verifyRole,(req,res)=>{
    dbChange('test3', 'Team').find().then((result)=>{
      res.send(result)
    }).catch((e)=>{
      res.status(403).send(e)
    })
})

teamRouter.patch('/setQualification', verifyRole, (req, res) => {
    var qualification = req.body.qualification
  dbChange('test3', 'Team').findOneAndUpdate({_id: req.body._teamId},{$set:{qualification}})
    .then((result) => {
      res.send(qualification)
    })
})

//建立隊伍(新)
teamRouter.post('/creatTeam', authenticate, upload, function (req, res) {
  var body = JSON.parse(req.body.teamData)
  var teamData =  _.pick(body,['teamName','title','registers','qualification','teacher', 'leader'])
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
  var team = new dbChange('test3', 'Team')(teamData)
  team.save().then((result)=>{
    var point = new dbChange('test3', 'Point')({_teamId: result._id})
    return point.save()
  }).then((result) => {
    return dbChange('test3', 'System').findOne({'name':"systemArg"})
  }).then((system) => {
    successCreateMail.to = teamData.leader.email
    successCreateMail.html = system.successCreate
    sendEmail(successCreateMail)
    res.send("報名成功")
  }).catch((e)=>{
    res.status(403).send(e)
  })
})

teamRouter.post('/checkName', (req,res) => {
  var teamName = req.body.teamName
  console.log(teamName);
  dbChange('test3', 'Team').find().then((result)=>{
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
