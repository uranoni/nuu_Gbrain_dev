const express = require('express');
const _ = require('lodash');
const pdf = require('pdfkit');
const {Team} = require('../models/team.js');
const {Point} = require('../models/point.js');
const {System} = require('../models/system.js');
const {ObjectID} = require('mongodb')
const {authenticate} = require('../middleware/authenticate.js')
const {verifyRole} = require('../middleware/authenticate.js')
const fs = require('fs');
const PDFMerge = require('pdf-merge');
var fileRouter = express.Router();
fileRouter.get('/getTeamData', (req, res) => {
  Team.find().select(['teamName', 'title', 'qualification','registers','leader','teacher']).then((result) => {
    var data = result;
    for(k=0;k<data.length;k++){
  var doc = new pdf;
  doc.pipe(fs.createWriteStream(`./mergeFile/allTeamData/${data[k].teamName}.pdf`));
  doc.font('./mingliu.TTF')
  .fontSize(24)
   .text(`隊伍名稱 ${data[k].teamName}`)
   .moveDown(0.5)

  doc.font('./mingliu.TTF')
  .fontSize(18)
  .text(`隊伍標頭 ${data[k].title}`)
  .moveDown(0.5)

  doc.font('./mingliu.TTF')
  .fontSize(16)
   .text(`指導老師名稱 ${data[k].teacher.name}`)
   .moveDown(0.5)

  doc.font('./mingliu.TTF')
  .fontSize(16)
  .text(`指導老師信箱 ${data[k].teacher.email}`)
  .moveDown(0.5)

  doc.font('./mingliu.TTF')
  .fontSize(16)
  .text(`隊長名稱 ${data[k].leader.name}`)
  .moveDown(0.5)

  doc.font('./mingliu.TTF')
  .fontSize(16)
  .text(`隊長信箱 ${data[k].leader.email}`)
  .moveDown(0.5)
  for(i=0;i<data[k].registers.length;i++)
   {

     doc.font('./mingliu.TTF')
    .fontSize(14)
    .text(`隊員名稱 ${data[k].registers[i].name}`)
    .moveDown(0.5)

     doc.font('./mingliu.TTF')
    .fontSize(14)
    .text(`隊員信箱 ${data[k].registers[i].email}`)
    .moveDown(0.5)
  }


 doc.end()
}
res.send('ok')
  })
})


fileRouter.get('/mergeAllDataPDF',(req,res)=>{
  Team.find().then((teamData)=>{
    var test=new Object();
    var fileData= _.map(teamData,'plan');
    var fileName= _.map(teamData,'teamName');
    test.fileData=fileData;
    test.fileName=fileName;
     return {fileData,fileName}
   }).then(({fileData,fileName})=>{
     var c=[];
    for(i=0;i<fileData.length;i++)
    {
    fileName[i] = `./mergeFile/allTeamData/${fileName[i]}.pdf`
    fileData[i] = '.'+fileData[i]
    c.push(fileName[i],fileData[i]);
    }
    console.log(c);
    return c
}).then((result)=>{
  var filename = `./mergeFile/TeamNameData/allTeamData.pdf`
  PDFMerge(result, {output: `${filename}`})
  return filename
}).then((filename)=>{
  return System.findOneAndUpdate({'name':"systemArg"}, {$set: { AllTeamNameData: filename }})
}).then((result)=>{
  res.send(result)
}).catch((e)=>{
  res.status(403).send(e)
});
})


module.exports = fileRouter;
