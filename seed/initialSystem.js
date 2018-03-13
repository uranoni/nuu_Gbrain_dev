const {System} = require('../models/system');
const {User} = require('../models/user');
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
        console.log('initial system success');
      }).catch(() => {
        console.log('initial system fail');
      })
    }
  })
}

const initialAdminUser = () => {
  User.find().then((result) => {
    if (result.length === 0) {
      let user = new User({
        "email" : process.env.NUU_USER + '@nuu.edu.tw',
        "password" : process.env.NUU_PASS,
        "name" : "admin",
        "phone" : "0123456789",
        "studentId" : "admin",
        "department" : "系統管理員",
        "lineId" : "admin",
        "roleId" : "admin"
      })
      user.save().then(() => {
        console.log('initial User success');
      }).catch(() => {
        console.log('initial User fail');
      })
    }
  })
}

module.exports = { initialSystem, initialAdminUser };
