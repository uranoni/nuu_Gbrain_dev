
const wordFilter = (req, file, cb) => {
  var team = JSON.parse(req.body.teamData);

  if (file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb({message: '上傳檔案格式錯誤，請上傳 doc 或 docx 檔格式，小於 50MB'}, false);
  }
};

const videoFilter = (req, file, cb) => {
  var team = JSON.parse(req.body.teamData);

  if (file.mimetype !== 'video/mp4') {
    cb({message: '上傳檔案格式錯誤，請上傳 mp4 檔格式，小於 200MB'}, false);
  } else if (req.user.email !== team.leader.email) {
    cb({message: '您不是隊長，只有隊長能上傳檔案！'}, false)
  } else {
    cb(null, true)
  }
};

const pdfFilter = (req, file, cb) => {
  var team = JSON.parse(req.body.teamData);
  
  if (file.mimetype === 'application/pdf' && req.user.email === team.leader.email) {
    cb(null, true)
  } else if (req.user.email !== team.leader.email) {
    cb({message: '您不是隊長，只有隊長能上傳檔案！'}, false)
  } else {
    cb({message: '上傳檔案格式錯誤，請上傳 pdf 檔格式，小於 50MB'}, false);
  }
};



module.exports = {
  wordFilter,
  videoFilter,
  pdfFilter
}
