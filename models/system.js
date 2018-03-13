const mongoose = require('mongoose');
const moment = require('moment-timezone');
const _ = require('lodash');
var SystemSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "systemArg",
    unique: true
  },
  carousel: [{
    imgPath: {
      type: String
    }
  }],
  successSignup: {
    type: String
  },
  successCreate: {
    type: String
  },
  gameTitle: {
    type: String
  },
  registrationStart: {
    type: String
  },
  registrationEnd: {
    type: String
  },
  firstTrialStart: {
    type: String
  },
  finalTrialStart: {
    type: String
  },
  score1Percent: {
    type: Number
  },
  score2Percent: {
    type: Number
  },
  gameFile: {
    type: String
  },
  gameWord: {
    type: String
  },
  principal: {
    type: String
  },
  email: {
    type: String
  },
  AllTeamFile:{
    type:String
  },
  AllTeamNameData:{
    type:String
  }
},
{
    usePushEach: true
})

SystemSchema.methods.removeCarousel = function (carouselId) {
  var system = this;
  return system.update({
    $pull: {
      carousel: {_id: carouselId}
    }
  })
}

SystemSchema.methods.pushGamePath = function (gameFile) {
  var system = this;
  return system.update({$set: {gameFile}})
}

SystemSchema.methods.pushGamePath = function (gameWord) {
  var system = this;
  return system.update({$set: {gameWord}})
}

SystemSchema.methods.pushCarouselPhoto = function (imgPath) {
  var system = this;
  system.carousel.push({imgPath})
  return system.save().then((result) => {
    return result
  })
}

var System = mongoose.model('System',SystemSchema)

module.exports = {System}
