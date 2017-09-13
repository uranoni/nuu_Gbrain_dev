const {verifyRole} = require('../middleware/authenticate.js')
const express = require('express');
const _ = require('lodash');
const {Team} = require('../models/team.js');
const {System} = require('../models/system.js');
const { storage, uploadSingle } = require('../modules/gameUploadStorege.js')
const PDFMerge = require('pdf-merge');
var systemRouter = express.Router();
const moment = require('moment');

systemRouter.post('/successCreate', verifyRole, (req, res) => {
  var successCreate = req.body.successCreate
  System.findOneAndUpdate({'name':"systemArg"},{
    $set: { successCreate }
  }).then((result)=>{
    res.send("成功更新或修改")
  }).catch((e)=>{
      res.status(404).send("取得失敗");
  })
})

systemRouter.post('/successSignup', verifyRole, (req, res) => {
  var successSignup = req.body.successSignup
  System.findOneAndUpdate({'name':'systemArg'}, {
    $set: { successSignup }
  }).then((result)=>{
    res.send("成功更新或修改")
  }).catch((e)=>{
    res.status(403).send("取得失敗");
  })
})

systemRouter.post('/uploadGameFile', verifyRole, uploadSingle, (req, res) => {
  var pathRegexp = new RegExp("\/gameUploads.*");
  var gamePath = req.file.destination.match(pathRegexp)[0]+'/'+req.file.filename;
  System.findOne({name: "systemArg"}).then((system) => {
    var system = new System(system);
    return system.pushGamePath(gamePath)
  }).then(() => {
    res.send("新增或更新成功")
  }).catch((e) => {
    res.status(403).send("失敗")
  })
})


systemRouter.post('/sysArgument',verifyRole,(req,res)=>{
  var body = _.pick(req.body,['gameTitle','email','score1Percent','score2Percent','registrationStart','registrationEnd','firstTrialStart','finalTrialStart'])

  var systems = new System(body)
  systems.save().then(()=>{
    res.send(systems)
  }).catch((e)=>{
    res.status(401).send(e)
  })
})

systemRouter.get('/getSuccessArg',verifyRole,(req,res)=>{
  System.find({'name':"systemArg"}).then((result)=>{
    // console.log(result);
    if(result == null){
      res.status(404).send("取得失敗")
    }
    else {
       var finlresult = new Object();
       finlresult.successCreate = result[0].successCreate;
       finlresult.successSignup = result[0].successSignup;

      console.log(finlresult)
      res.send(finlresult)
    }
  })
})

systemRouter.get('/getArg',verifyRole,(req,res)=>{
  System.find({'name':"systemArg"}).then((result)=>{
    console.log(result);
    if(result == null){
      res.status(404).send("取得失敗")
    }
    else {
      res.send(result)
    }
  })
})

systemRouter.patch('/updateArg', verifyRole, (req, res) => {
    var body =_.pick(req.body,['gameTitle','email','score1Percent','score2Percent','registrationStart','registrationEnd','firstTrialStart','finalTrialStart'])
    console.log(body)
    var {gameTitle,email,score1Percent,score2Percent,registrationStart,registrationEnd,firstTrialStart,finalTrialStart} = body
    System.findOneAndUpdate({'name':"systemArg"},{
      $set:{
      gameTitle,email,score1Percent,score2Percent,registrationStart,registrationEnd,firstTrialStart,finalTrialStart
    }
    }).then(()=>{
      res.send(body)
    }).catch((e)=>{
        res.status(404).send("取得失敗");
      })
})

// systemRouter.get('/mergeTeamFile',(req,res)=>{
//    Team.find().then((data)=>{
//      var fileData= _.map(data,'plan');
//      console.log(fileData)
//       return fileData
//     }).then((result)=>{
//       var date = Date.now()
//       var filename = `./mergeFile/AllTeamFile_${moment(date).format("YYYYMMDD_HHmm")}.pdf`
//       return PDFMerge(result, { output: `./mergeFile/AllTeamFile_${moment(date).format("YYYYMMDD_HHmm")}.pdf`} )
//     }).then((buffer) => {
//       res.send(buffer);
//   });
// })

systemRouter.get('/mergeTeamFile',(req,res)=>{
   Team.find().then((data)=>{
     var fileData= _.map(data,'plan');
      return fileData
    }).then((result)=>{
      var date = Date.now()
      var filename = `/mergeFile/AllTeamFile_${moment(date).format("YYYYMMDD_HHmm")}.pdf`
      return PDFMerge(result, {output: `.${filename}`}).then(() => {
        return filename
      })
    }).then((filename) => {
      return System.findOneAndUpdate({'name':"systemArg"}, {$set: { AllTeamFile: filename }})
    }).then((result) => {
      res.send(result)
    }).catch((e) => {
      res.status(403).send(e)
    });
})


systemRouter.get('/getArgForAny',(req,res)=>{
  System.find({'name':"systemArg"}).then((result)=>{
    console.log(result);
    if(result == null){
      res.status(404).send("取得失敗")
    }
    else {
      var timeres =  new Object();
      timeres.registrationStart = result[0].registrationStart
      timeres.registrationEnd = result[0].registrationEnd
      timeres.firstTrialStart = result[0].firstTrialStart
      timeres.finalTrialStart= result[0].finalTrialStart
      console.log(timeres);
      res.send(timeres)
    }
  })
})

// systemRouter.get('/getSystem', (req, res) => {
//   System.find({'name':"systemArg"}).select(['registrationStart', 'registrationEnd', 'firstTrialStart', 'finalTrialStart']).then((result) => {
//     res.send(result)
//   })
// })

module.exports = systemRouter;
