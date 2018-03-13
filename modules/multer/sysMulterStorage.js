const fs = require('fs');
const path = require('path');
const multer = require('multer');
const moment = require('moment');

const { fileNameSwitch } = require('./fileSwitch');

var sysStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filePath = path.resolve('__dirname', '../uploads/', 'systemFiles');
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }
    cb(null, filePath);
  },
  filename: function (req, file, cb) {
    function getFileExtension(filename) {
      return(/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
    }
    var fileExtension = getFileExtension(file.originalname);
    var fileName = `${fileNameSwitch(file.fieldname)}.${fileExtension}`;
    cb(null, fileName);
  }
})

module.exports = { sysStorage };
