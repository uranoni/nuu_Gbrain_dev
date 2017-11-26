const mongoose = require('mongoose');
const validator = require('validator');
const isEmail = require('validator/lib/isEmail')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const _ = require('lodash');

var SecuritySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: (value)=>{validator.isEmail(value)},
      message: '{VALUE} 不是合法的信箱'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

SecuritySchema.methods.generateAuthToken = function () {
  var security = this;
  var token = jwt.sign({_id: security._id.toHexString()}, process.env.JWT_SECRET).toString();
  security.tokens.push({token});
  return security.save().then(() => {
    return token
  })
}

SecuritySchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((security) => {
    if (!security) {
      return Promise.reject("沒有這個會員");
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, security.password).then((res) => {
         if (res) {
           resolve(security);
         } else {
           reject("此密碼錯誤");
         }
       })
    })
  })
}

SecuritySchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (e) {
    return Promise.reject();
  }
  return User.findOne({
    _id: decoded._id,
    'tokens.token': token
  })
}

SecuritySchema.methods.toJson = function () {
  var security = this;
  var securityObject = security.toObject();
  return _.pick(securityObject, ['_id', 'email','name'])
}

SecuritySchema.methods.removeToken = function (token) {
  var security = this;

  return security.update({
    $pull: {
      tokens: {token}
    }
  })
}

SecuritySchema.pre('save', function (next) {
  var security = this;
  if (security.isModified('password')){
    bcrypt.hash(security.password, 10).then(hash => {
      security.password = hash;
      next();
    })
  } else {
    next();
  }
})

module.exports = {SecuritySchema}
