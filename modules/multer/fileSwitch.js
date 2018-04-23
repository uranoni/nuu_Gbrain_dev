const moment = require('moment');

const fileNameSwitch = (type) => {
  switch (type) {
    case 'plan':
      return '計畫書';
      break;
    case 'video':
      return '成果影片';
      break;
    case 'register':
      return '報名表';
      break;
    case 'warrant':
      return '著作授權書';
      break;
    case 'cover':
      return '封面';
      break;
    case 'gameFile':
      return '比賽辦法';
      break;
    case 'gameWord':
      return '比賽附件';
      break;
    case 'planLess':
      return '計畫書(評審)'
    default:
      var data = Date.now();
      return moment(data).format('YYYYMMDD_HHmmss');
  }
}

const fileTypeSwitch = (type) => {
  switch (type) {
    case 'word':
      return ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      break;
    case 'video':
      return ['video/mp4'];
      break;
    case 'pdf':
      return ['application/pdf'];
      break;
    default:
      return ;
  }
}

module.exports = { fileNameSwitch, fileTypeSwitch }
