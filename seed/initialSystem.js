const {System} = require('../models/system');
const moment = require('moment');

const initialSystem = () => {
  System.find({'name':'systemArg'}).then((result) => {
    if (result.length == 0) {
      let systems = new System({
        "gameTitle": "2018年第七屆金腦獎專題競賽",
        "email": "chinghua@nuu.edu.tw",
        "registrationStart": moment().format('YYYY-MM-DD'),
        "registrationEnd": moment().format('YYYY-MM-DD'),
        "firstTrialStart": moment().format('YYYY-MM-DD'),
        "finalTrialStart": moment().format('YYYY-MM-DD'),
        "successSignup": "恭喜您註冊成功",
        "successCreate": "恭喜您隊伍創建成功",
        "principal": "陳清華"
      })
      systems.save().then(() => {
        console.log('initial success');
      }).catch(() => {
        console.log('initial fail');
      })
    }
  })
}

module.exports = { initialSystem };
