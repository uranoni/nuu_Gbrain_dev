const mongoose = require('mongoose');
const {ObjectID} = require('mongodb')

var PointShema = new mongoose.Schema({
  _teamId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Team'
  },
  points1: [{
    _jurorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    score: {
      type: Number
    },
    comment: {
      type: String
    }
  }],
  points2: [{
    _jurorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    score: {
      type: Number
    },
    comment: {
      type: String
    }
  }]
})

PointShema.methods.checkFirst = function (userId, times) {
  var point = this;
  return new Promise((resolve, reject) => {
    var tmp
    if (times == 1) {
      tmp = point.points1.filter((p) => {
        console.log(p._jurorId);
        return p._jurorId.toHexString() == userId
      })
    } else {
       tmp= point.points2.filter((p) => {
        console.log(p._jurorId);
        return p._jurorId.toHexString() == userId
      })
    }

    if (tmp.length > 0) {
      reject("您已評過分了");
    } else {
      resolve(point);
    }
  })
}

PointShema.methods.grade = function (body, _jurorId, times) {
  var point = this;
  var {score, comment} = body
  var tmp = { score, comment, _jurorId }
  if (times == 1) {
    point.points1.push(tmp)
  } else {
    point.points2.push(tmp)
  }

  return point.save()
}

var Point = mongoose.model('Point', PointShema)

module.exports = {Point}
