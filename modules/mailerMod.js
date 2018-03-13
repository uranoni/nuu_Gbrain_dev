const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: 'mail.nuu.edu.tw',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NUU_USER,
    pass: process.env.NUU_PASS
  }
})

var signupVerifyHtml = (name, token) => {
  return `<div style="background-color: #eee; height: 800px; width: 80%; margin: auto; display: flex; justify-content: center; align-items: center; flex-direction: column;">
  <div style="background-color: #fff; height: 360px; width: 60%; margin-top: 50px; padding: 40px 80px; text-align: center;">
    <h2 style="color: #666">嗨! ${name} 先生/小姐</h2>
    <p>謝謝您註冊金腦獎帳號，在帳號啟用之前，必須先確認帳號是本人無誤，請點擊下面按鈕驗證您的電子信箱。</p>
    <br>
    <a href="http://eecs.csie.nuu.edu.tw/api/user/verifyMail/${token}" style="background-color: #7289da; color: white; text-decoration: none; padding: 10px 20px">
      驗證信箱
    </a>
  </div>
  <div style="height: 60px; background-color: #fff; width: 60%; margin-top: 20px; padding: 40px 80px;"></div>

</div>`
}

var signupVerifyMail = {
  from: '"EECS" <eecs@nuu.edu.tw>',
  subject: '聯合大學金頭腦註冊驗證信'
}

var successSignupMail = {
  from: process.env.GMAIL_USER,
  subject: '聯合大學金頭腦成功註冊通知信'
};

var successCreateMail = {
from: process.env.GMAIL_USER,
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

var sendEmail = function (payload) {
 transporter.sendMail(payload, function(error, info){
    if (error) {
      console.log("send mail fail")
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

var sendEmailPromise = function (payload) {
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

module.exports = { transporter, successSignupMail, successCreateMail, sendEmail, forgotPasswordMail, updatePasswordMail, sendEmailPromise, signupVerifyHtml,
signupVerifyMail}
