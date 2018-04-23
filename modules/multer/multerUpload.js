const multer = require('multer');
const { wordFilter, videoFilter, pdfFilter, sysWordFilter, sysPdfFilter } = require('./multerFilter');
const { storage } = require('./multerStorage');
const { sysStorage } = require('./sysMulterStorage');


const uploadPlan = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50
  },
  fileFilter: pdfFilter
})

const uploadPlanLess = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50
  },
  fileFilter: sysPdfFilter
})

const uploadVideo = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 200
  },
  fileFilter: videoFilter
})

const uploadRegister = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50
  },
  fileFilter: wordFilter
})

const uploadWarrant = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50
  },
  fileFilter: pdfFilter
})

const uploadCover = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50
  },
  fileFilter: wordFilter
})

const uploadGameFile = multer({
  storage: sysStorage,
  limits: {
    fileSize: 1024 * 1024 * 50
  },
  fileFilter: sysPdfFilter
})

const uploadGameWord = multer({
  storage: sysStorage,
  limits: {
    fileSize: 1024 * 1024 * 50
  },
  fileFilter: sysWordFilter
})

module.exports = {
  uploadPlan,
  uploadVideo,
  uploadRegister,
  uploadWarrant,
  uploadCover,
  uploadGameFile,
  uploadGameWord,
  uploadPlanLess
}
