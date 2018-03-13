const fs = require('fs');
const path = require('path');
const multer = require('multer');
const moment = require('moment');

const { fileNameSwitch } = require('./fileSwitch');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var team = JSON.parse(req.body.teamData);
    const filePath = path.resolve('__dirname', '../uploads/', team.title);
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }
    cb(null, filePath);
  },
  filename: function (req, file, cb) {
    var team = JSON.parse(req.body.teamData);
    function getFileExtension(filename) {
      return(/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
    }
    var fileExtension = getFileExtension(file.originalname);
    var fileName = `${team.title}_${fileNameSwitch(file.fieldname)}.${fileExtension}`;
    cb(null, fileName);
  }
})

module.exports = { storage };
