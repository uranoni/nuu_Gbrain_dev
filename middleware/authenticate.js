var {User} = require('./../models/user.js')

var authenticate = (req, res, next) => {
  var token = req.header('authToken');
  User.findByToken(token).then(user => {
    if (!user) {
      return Promise.reject();
    }
      req.user = user;
      req.token = token;
      //console.log(req.user.roleId);
      next();
  }).catch(()=>{
    res.status(401).send();
  })
}
//verifyRole 驗證腳色
var verifyRole = (req, res, next)=>{
  var token = req.header('authToken');
  User.findByToken(token).then(user => {
    if (user.roleId != "admin") {

      return Promise.reject();
    }

      req.user = user;
      req.token = token;
      next();
  }).catch(()=>{
    res.status(401).send();
  })
}
module.exports = {authenticate,verifyRole};
