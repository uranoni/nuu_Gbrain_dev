var { Security } = require('./../models')

var securityAuth = (req, res, next) => {
  var token = req.header('authToken');
  Security().findByToken(token).then(security => {
    if (!security) {
      return Promise.reject();
    }
      req.security = security;
      req.token = token;
      //console.log(req.security.roleId);
      next();
  }).catch(()=>{
    res.status(401).send();
  })
}

module.exports = { securityAuth }
