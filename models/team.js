const mongoose = require('mongoose');
const _ = require('lodash');

var TeamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    trim: true
  },
  teacher: {
    name: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      trim: true,
      required: true
    }
  },
  leader: {
    name: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      trim: true,
      required: true
    }
  },
  registers: [{
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    }
  }],
  qualification: {
    type: Boolean,
    default: false
  },
  plan: {
    type: String,
    trim: true
  },
  video: {
    type: String,
    trim: true
  },
  register: {
    type: String,
    trim: true
  },
  warrant: {
    type: String,
    trim: true
  },
  cover: {
    type: String,
    trim: true
  }
},
{
    usePushEach: true
})

TeamSchema.methods.planUpdate = function (payload) {
  var team = this;
  return team.update({ $set: {
    plan: payload
  }})
}
TeamSchema.methods.ma4Update = function (payload) {
  var team = this;
  return team.update({ $set: {
    video: payload
  }})
}
var Team = mongoose.model('Team', TeamSchema)
module.exports = {Team}
