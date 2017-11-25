const express = require('express');
const _ = require('lodash');
var securityRouter = express.Router();
const { Security } = require('../models');
const { securityAuth } = require('../middleware/securityAuth')

securityRouter.post('/signup',(req, res) => {
  var body = _.pick(req.body, ['email', 'password', 'name'])
  var security = new Security()(body);
  console.log(security);
  security.save().then(() => {
    return Promise.all([security.generateAuthToken(), security.toJson()])
  }).then(([token, security]) => {
    res.header('token', token).send(security);
  }).catch((e) => {
    if (e.code == '11000') {
      res.status(400).send('Email已經使用過了');
    }
    res.status(400).send(e);
  })
});

securityRouter.get('/uniqueEmail/:email', (req, res) => {
  var email = req.params.email;
  var regex = new RegExp("^[a-zA-Z0-9!#$&_*?^{}~-]+(\.[a-zA-Z0-9!#$&_*?^{}~-]+)*@([a-z0-9]+([a-z0-9-]*)\.)+[a-zA-Z]+$", "g");
  if (!regex.test(email)) {
    res.status(402).send("此信箱不合規範")
  } else {
    Security().findOne({ email }).then((response) => {
      if (!response) {
        res.status(200).send()
        return;
      }
      return Promise.reject('此信箱已有人使用了')
    }).catch((err) => {
      res.status(402).send(err)
    })
  }
})

securityRouter.post('/signin', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  Security().findByCredentials(body.email, body.password).then((security) => {
    return Promise.all([security.generateAuthToken(), security.toJson()])
  }).then(([token, security]) => {
    res.header('token', token).send(security);
  }).catch((e) => {
    res.status(403).send(e);
  })
})

securityRouter.get('/check', securityAuth, (req, res) => {
  var security = req.security
  var objUser = security.toJson()
  res.send(objUser);
})

securityRouter.delete('/logout', securityAuth, (req, res) => {
  req.security.removeToken(req.token).then(()=>{
    res.status(200).send('成功登出');
  }).catch(() => {
    res.status(400).send();
  })
})

module.exports = securityRouter;
