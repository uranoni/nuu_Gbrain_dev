const express = require('express');
const _ = require('lodash');
const {User} = require('../models/user.js');
const {System} = require('../models/system.js');
const {ObjectID} = require('mongodb')
const {authenticate} = require('../middleware/authenticate.js')
const {verifyRole} = require('../middleware/authenticate.js')
const {verifyJuror} = require('../middleware/authenticate.js')
var { successSignupMail, sendEmail, forgotPasswordMail, updatePasswordMail, sendEmailPromise, signupVerifyHtml, signupVerifyMail } = require('../modules/mailerMod.js')
var { randomToken, forgotHtml, passwordUpdatedHtml } = require('../modules/forgotModules.js')
var userRouter = express.Router();


userRouter.post('/forgotPassword', (req, res) => {
  var body = _.pick(req.body, ['email'])
  User.findOne({email: body.email}).then((user) => {
    if (!user) {
      res.status(404).send('沒有此用戶')
    } else {
      return user
    }
  }).then((user) => {
    var token = randomToken();
    var expire = Date.now() + 60000
    return user.generateResetToken(token, expire)
  }).then(({token, user}) => {
    forgotPasswordMail.to = user.email;
    forgotPasswordMail.html = forgotHtml(req.headers.host, token);
    return sendEmailPromise(forgotPasswordMail)
  }).then((result) => {
    res.send("請到信箱點選通知信中連結更新密碼")
  }).catch((e) => {
    res.status(403).send(e)
  })
})

//可用可不用
userRouter.get('/forgotPassword/:token', (req, res) => {
  var token = req.params.token
  User.findOne({
    'reset.token': token,
    'reset.expire':{ $gt: Date.now() }
  }).then((user) => {
    if (!user) {
      return Promise.reject("時間超時獲多次請求，請重新請求或找最新的通知信")
    }
    res.send(user)
  }).catch((e) => {
    res.status(404).send(e)
  })
})


userRouter.patch('/forgotPassword/:token', (req, res) => {
  var newPassword = req.body.newPassword
  User.findOne({
    'reset.token': req.params.token,
    'reset.expire':{ $gt: Date.now() }
  }).then((user)=> {
    if (!user) {
      return Promise.reject("時間超時獲多次請求，請重新請求或找最新的通知信")
    }
    user.password = newPassword
    user.reset.token = undefined
    user.reset.expire = undefined
    return user.save()
  }).then((user) => {
    updatePasswordMail.to = user.email
    updatePasswordMail.html = passwordUpdatedHtml(user.email)
    sendEmail(updatePasswordMail)
    res.send("密碼已更新")
  }).catch((e) => {
    res.status(403).send()
  })
})

userRouter.patch('/updatePassword', authenticate, (req, res) => {
  var body = req.body
  User.findOne({email: req.user.email})
  .then((user) => {
    return user.updatePassword(body.oldPassword, body.newPassword)
  }).then((user) => {
    console.log(user);
    return user.save()
  }).then((user) => {
    updatePasswordMail.to = user.email
    updatePasswordMail.html = passwordUpdatedHtml(user.email)
    sendEmail(updatePasswordMail)
    res.send("密碼已更新")
  }).catch((err) => {
    res.status(403).send(err)
  })
})


//註冊
// userRouter.post('/signup',(req, res) => {
//   var body = _.pick(req.body, ['email', 'password', 'name', 'phone', 'studentId', 'department', 'lineId', 'roleId'])
//   body.time = new Date().toString();
//   var user = new User(body);
//   user.save().then((user) => {
//     return Promise.all([user.generateAuthToken(), System.findOne({'name':"systemArg"})])
//   }).then(([ {token, roleId}, system ]) => {
//     successSignupMail.html = system.successSignup
//     successSignupMail.to = body.email
//     sendEmail(successSignupMail)
//     res.header('authToken', token).send(roleId);
//   }).catch((e) => {
//     res.status(400).send(e);
//   })
// });

userRouter.post('/signup',(req, res) => {
  var body = _.pick(req.body, ['email', 'password', 'name', 'phone', 'studentId', 'department', 'lineId', 'roleId'])
  body.time = new Date().toString();
  var user = new User(body);
  user.save().then((user) => {
    const token = randomToken();
    const expire = Date.now() + 60 * 1000;
    return user.saveVerifyToken(token, expire)
  }).then(({token, user}) => {
    let signupVerifyMail = {
      from: '"EECS" <eecs@nuu.edu.tw>',
      subject: '聯合大學金頭腦註冊驗證信'
    }
    signupVerifyMail.to = user.email;
    signupVerifyMail.html = signupVerifyHtml(user.name, token)
    return sendEmailPromise(signupVerifyMail)
    // res.header('authToken', token).send(roleId);
  }).then((result) => {
    console.log(result);
    res.send(user);
  }).catch((e) => {
    user.remove({email: user.email}).then(() => {
      res.status(400).send(e);
    })
  })
});

userRouter.get('/verifyMail/:token', (req, res) => {
  const token = req.params.token;
  User.findOne({
    'verification.token': token,
    'verification.expire': { $gt: Date.now() }
  }).then((user) => {
    if (!user) {
      res.status(412).send({
        error: {
          message: '時間超過或多次請求，請重新請求或點擊最新的驗證信！'
        }
      })
    }
    return user.update({$set: { verify: true }, $pull: {verification}})
  }).then(() => {
    res.redirect('http://eecs.csie.nuu.edu.tw/login.html')
  }).catch((err) => {
    res.status(409).send(err)
  })
})

userRouter.patch('/verifyMail', authenticate, (req, res) => {

})

// userRouter.post('/signup',(req, res) => {
//   var body = _.pick(req.body, ['email', 'password', 'name', 'phone', 'studentId', 'department', 'lineId', 'roleId'])
//   body.time = new Date().toString();
//   var user = new User(body);
//   user.save().then((user) => {
//     return System.findOne({'name':"systemArg"})
//   }).then((system) => {
//     successSignupMail.html = system.successSignup
//     successSignupMail.to = body.email
//     return sendEmail(successSignupMail)
//   }).then((result) => {
//     return user.generateAuthToken()
//   }).then((token) => {
//     res.header('authToken', token).send();
//   }).catch((e) => {
//     res.status(400).send(e);
//   })
// });


// res.header('authToken', token).send('OK');

//登入OK
userRouter.post('/signin', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken()
  }).then(({token, roleId}) => {
    console.log(token);
    res.header('authToken', token).send(roleId);
  }).catch((e) => {
    res.status(403).send(e);
  })
})

//評審登入用
userRouter.post('/jurorSignin', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByJuror(body.email, body.password).then((user) => {
    return user.generateAuthToken()
    .then(({token, roleId}) => {
      res.header('authToken', token).send(roleId);
    })
  }).catch((e) => {
    res.status(403).send("查無此評審");
  })
})



userRouter.get('/me', authenticate, (req, res) => {
  var user = req.user
  var objUser = user.toJson()
  res.send(objUser);
})
//測試驗證用
userRouter.get('/meverfy', verifyJuror, (req, res) => {
  var user = req.user
  var objUser = user.toJson()
  res.send(objUser);
})

userRouter.delete('/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }).catch(() => {
    res.status(400).send();
  })
})

userRouter.patch('/userUpdata', authenticate, (req, res) => {
  var body = _.pick(req.body, ['name','phone','studentId','department','lineId'])
  var token = req.token
  User.findByToken(token).then(user => {
    return user.userUpdata(body)
  }).then((user) => {
    res.send("更改成功");
  }).catch((e) => {
    res.status(403).send();
  })
})

userRouter.get('/role/:email', (req, res) => {
  var email = req.params.email;
  User.findOne({email}).then((user) => {
    res.send({roleId: user.roleId,name: user.name})
  }).catch((e)=>{
    res.status(403).send();
  })
})

module.exports = userRouter;
