const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

<<<<<<< HEAD
var successSignupMail = {
  from: process.env.GMAIL_USER,
  subject: '聯合大學金頭腦成功註冊通知信'
};

var successCreateMail = {
from: process.env.GMAIL_USER,
=======
var successSignup = {
  from: 'nuuGbrainDev@gmail.com',
  subject: '聯合大學金頭腦成功註冊通知信'
};

var successCreate = {
from: 'nuuGbrainDev@gmail.com',
>>>>>>> ba3d039e47380e09f2d40da2cddb75e77d5437f6
subject: '聯合大學金頭腦建立隊伍通知信'
};

var forgotPasswordMail = {
  from: process.env.GMAIL_USER,
  subject: '聯合大學金頭腦忘記密碼通知信'
}

var updatePasswordMail = {
  from: process.env.GMAIL_USER,
  subject: '聯合大學金頭腦密碼已更改通知信'
}

var forgotPassword = {
  from: 'nuuGbrainDev@gmail.com',
  subject: '聯合大學金頭腦忘記密碼通知信'
}

var sendEmail = function (payload) {
   return new Promise((resolve, reject) => {
     transporter.sendMail(payload, function(error, info){
        if (error) {
          reject(error)
        } else {
          console.log('Email sent: ' + info.response);
          resolve(info)
        }
      });
   })
}


<<<<<<< HEAD
module.exports = { transporter, successSignupMail, successCreateMail, sendEmail, forgotPasswordMail, updatePasswordMail}
=======
module.exports = { transporter, successSignup, successCreate, sendEmail, forgotPassword}
>>>>>>> ba3d039e47380e09f2d40da2cddb75e77d5437f6
