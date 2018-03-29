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

// var signupVerifyHtml = (name, token) => {
//   return `<div style="background-color: #eee; height: 800px; width: 80%; margin: auto; display: flex; justify-content: center; align-items: center; flex-direction: column;">
//   <div style="background-color: #fff; height: 360px; width: 60%; margin-top: 50px; padding: 40px 80px; text-align: center;">
//     <h2 style="color: #666">嗨! ${name} 先生/小姐</h2>
//     <p>謝謝您註冊金腦獎帳號，在帳號啟用之前，必須先確認帳號是本人無誤，請點擊下面按鈕驗證您的電子信箱。</p>
//     <br>
//     <a href="http://eecs.csie.nuu.edu.tw/api/user/verifyMail/${token}" style="background-color: #7289da; color: white; text-decoration: none; padding: 10px 20px">
//       驗證信箱
//     </a>
//   </div>
//   <div style="height: 60px; background-color: #fff; width: 60%; margin-top: 20px; padding: 40px 80px;"></div>
//
// </div>`
// }


var signupVerifyHtml = (name, token) => {
  return `<div style="background:#f9f9f9">
  <div style="background-color:#f9f9f9">
    <div style="margin:0px auto;max-width:640px;background:transparent">
      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:transparent" align="center" border="0">
        <tbody>
          <tr>
            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 0px">
              <div aria-labelledby="mj-column-per-100" class="m_3751144356682424584mj-column-per-100 m_3751144356682424584outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td style="word-break:break-word;font-size:0px;padding:0px" align="center">
                        <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px" align="center" border="0">
                          <tbody>
                            <tr>
                              <td style="width:138px"><a href="http://www.nuu.edu.tw/" target="_blank"><img alt="" title="" height="" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/National_United_University_logo.svg/400px-National_United_University_logo.svg.png" width="120" class="CToWUd"></a></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div style="max-width:640px;margin:0 auto;border-radius:4px;overflow:hidden">
      <div style="margin:0px auto;max-width:640px;background:#ffffff">
        <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff" align="center" border="0">
          <tbody>
            <tr>
              <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 70px">
                <div aria-labelledby="mj-column-per-100" class="m_3751144356682424584mj-column-per-100 m_3751144356682424584outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%">
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tbody>
                      <tr>
                        <td style="word-break:break-word;font-size:0px;padding:0px" align="left">
                          <div style="color:#737f8d;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:16px;line-height:24px;text-align:left">

                            <h2 style="font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-weight:500;font-size:20px;color:#4f545c;letter-spacing:0.27px">嗨 ${name},</h2>
                            <p>謝謝您註冊 <span class="il">金腦獎</span> ! 在帳號啟動之前，必須先確認帳號是否為本人，請點擊下方按鈕驗證您的墊子郵件。</p>

                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="word-break:break-word;font-size:0px;padding:10px 25px;padding-top:20px" align="center">
                          <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate" align="center" border="0">
                            <tbody>
                              <tr>
                                <td style="border:none;border-radius:3px;color:white;padding:15px 19px" align="center" valign="middle" bgcolor="#7289DA"><a href="http://eecs.csie.nuu.edu.tw/api/user/verifyMail/${token}" style="text-decoration:none;line-height:100%;background:#7289da;color:white;font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:15px;font-weight:normal;text-transform:none;margin:0px" target="_blank">
            Verify Email
          </a></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="word-break:break-word;font-size:0px;padding:30px 0px">
                          <p style="font-size:1px;margin:0px auto;border-top:1px solid #dcddde;width:100%"></p>
                        </td>
                      </tr>
                      <tr>
                        <td style="word-break:break-word;font-size:0px;padding:0px" align="left">
                          <div style="color:#747f8d;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:13px;line-height:16px;text-align:left">
                            <p>如需幫助請洽 聯合大學電機資訊學院 <br><br> 陳清華 Email: chinghua@nuu.edu.tw</p>

                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div style="margin:0px auto;max-width:640px;background:transparent">
      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:transparent" align="center" border="0">
        <tbody>
          <tr>
            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px">
              <div aria-labelledby="mj-column-per-100" class="m_3751144356682424584mj-column-per-100 m_3751144356682424584outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td style="word-break:break-word;font-size:0px">
                        <div style="font-size:1px;line-height:12px">&nbsp;</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="margin:0px auto;max-width:640px;background:transparent">
      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:transparent" align="center" border="0">
        <tbody>
          <tr>
            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px">
              <div aria-labelledby="mj-column-per-100" class="m_3751144356682424584mj-column-per-100 m_3751144356682424584outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td style="word-break:break-word;font-size:0px;padding:0px" align="center">
                        <div style="color:#99aab5;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:12px;line-height:24px;text-align:center">
                          由 <span class="il">國立聯合大學電機資訊學院</span> 發送 • <a href="http://eecs.nuu.edu.tw/" style="color:#1eb0f4;text-decoration:none" target="_blank">造訪電資學院</a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="word-break:break-word;font-size:0px;padding:0px" align="center">
                        <div style="color:#99aab5;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:12px;line-height:24px;text-align:center">
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
`
}

var signupVerifyMail = {
  from: '"EECS" <eecs@nuu.edu.tw>',
  subject: '聯合大學金頭腦註冊驗證信'
}

var successSignupMail = {
  from: '"EECS" <eecs@nuu.edu.tw>',
  subject: '聯合大學金頭腦成功註冊通知信'
};

var successCreateMail = {
from: '"EECS" <eecs@nuu.edu.tw>',
subject: '聯合大學金頭腦建立隊伍通知信'
};

var forgotPasswordMail = {
  from: '"EECS" <eecs@nuu.edu.tw>',
  subject: '聯合大學金頭腦忘記密碼通知信'
}

var updatePasswordMail = {
  from: '"EECS" <eecs@nuu.edu.tw>',
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
