const express = require('express');
const _ = require('lodash');
const {Point} = require('../models/point.js');
const {authenticate} = require('../middleware/authenticate.js')
const {ObjectID} = require('mongodb')

var pointRouter = express.Router();

pointRouter.get('/jurorGrade', authenticate, (req, res) => {
  var _jurorId = req.user._id
  Point.find()
    .populate({
        path: '_teamId',
        select: ['teamName','teacher','registers','video', 'plan','qualification','leader','title']
      })
    .populate({
        path: 'points1._jurorId',
        select: ['email','name','phone','studentId','department','lineId','roleId']
      })
    .populate({
        path: 'points2._jurorId',
        select: ['email','name','phone','studentId','department','lineId','roleId']
      })
    .then((result) => {

      result = result.filter((r) => {
        return !r._teamId.qualification
      })
      return result.map((r) => {
        r.points1 = r.points1.filter((a) => {
          return a._jurorId._id.toHexString() == _jurorId
        })
        r.points2 = r.points2.filter((a) => {
          return a._jurorId._id.toHexString() == _jurorId
        })
        return r
      })
    }).then((result) => {
      res.send(result)
    }).catch((e) => {
      res.status(403).send(e)
    })
})


pointRouter.post('/grade/:times', authenticate, (req, res) => {
  var times = req.params.times
  if (req.user.roleId !== "juror") {
    res.status(402).send("你不是裁判")
  } else {
    var body = _.pick(req.body, ['score', 'comment']);
    var _teamId = req.body.teamId
    Point.findOne({_teamId}).then((point) => {
      return point.checkFirst(req.user._id, times)
    }).then((point) => {
      return point.grade(body, req.user._id, times)
    }).then((point)=>{
      res.send(point)
    }).catch((e) => {
      res.status(403).send(e)
    })
  }
})


pointRouter.get('/noGrade/:times', authenticate, (req, res) => {
  var _jurorId = req.user._id
  var times = req.params.times
  var tmp = `points${times}._jurorId`
  var findPoint = (times) => {
    if (times == 1) {
      return Point.find({'points1._jurorId':{$ne: _jurorId}}).populate({
          path: 'points1._jurorId',
          select: ['email','name','phone','studentId','department','lineId','roleId']
        })
    } else {
      return Point.find({'points2._jurorId':{$ne: _jurorId}}).populate({
          path: 'points2._jurorId',
          select: ['email','name','phone','studentId','department','lineId','roleId']
        })
    }
  }
  findPoint(times)
  .populate({
      path: '_teamId',
      select: ['teamName','teacher','registers','video', 'plan','qualification','leader']
    })
  .then((result) => {
    if (result.length == 0) {
      res.status(403).send("您都評過分數囉！")
    } else {
      console.log(result);
      var data = result.map(m => {
        m.points1 = []
        m.points2 = []
        return m
      })
      res.send(data)
    }
  },(e) => {
    res.status(403).send("err")
  })
})

pointRouter.get('/haveGrade/:times', authenticate, (req, res) => {
  var _jurorId = req.user._id
  var times = req.params.times

  const findPoint = (times) => {
    if (times == 1) {
      return Point.find({'points1':{$elemMatch: {_jurorId}}})
      .populate({
          path: '_teamId',
          select: ['teamName','teacher','registers','video', 'plan','qualification','leader']
        })
      .populate({
          path: 'points1._jurorId',
          select: ['email','name','phone','studentId','department','lineId','roleId']
        })
    } else {
      return Point.find({'points2':{$elemMatch: {_jurorId}}})
      .populate({
          path: '_teamId',
          select: ['teamName','teacher','registers','video', 'plan','qualification','leader']
        })
      .populate({
          path: 'points2._jurorId',
          select: ['email','name','phone','studentId','department','lineId','roleId']
        })
    }
  }
  findPoint(times)
  .then((result) => {
    if (result.length == 0) {
      res.status(403).send("您還沒評過分數喔！")
    } else {
      var filterData = (times, result) => {
        var data;
        if (times == 1) {
          data = result.map((r) => {
            r.points2 = []
            r.points1 = r.points1.filter((a) => {
              return a._jurorId._id.toHexString() == _jurorId
            })
            return r
          })
          return data
        } else {
          data = result.map((r) => {
            r.points1 = []
            r.points2 = r.points2.filter((a) => {
              return a._jurorId._id.toHexString() == _jurorId
            })
            return r
          })
          return data
        }
      }
      return filterData(times, result)
    }
  }).then((data) => {
    res.send(data)
  })
})

pointRouter.patch('/updateGrade/:times', authenticate, (req, res) => {
  var _jurorId = req.user._id
  var times = req.params.times
  var body = _.pick(req.body, ['newScore', 'newComment']);
  var _teamId = req.body.teamId

  var pointFindUpdate = (times) => {
    if (times == 1) {
      return Point.findOneAndUpdate({_teamId,'points1._jurorId':_jurorId}, {$set: {'points1.$.score': body.newScore, 'points1.$.comment': body.newComment}})
    } else {
      return Point.findOneAndUpdate({_teamId,'points2._jurorId':_jurorId}, {$set: {'points2.$.score': body.newScore, 'points2.$.comment': body.newComment}})
    }
  }
  var pointFindOne = (times) => {
    if (times == 1) {
      return Point.findOne({_teamId,'points1._jurorId':_jurorId})
    } else {
      return Point.findOne({_teamId,'points2._jurorId':_jurorId})
    }
  }

  // var filterData = (times, result) => {
  //   var data;
  //   if (times == 1) {
  //     data = result.map((r) => {
  //       r.points2 = []
  //       r.points1 = r.points1.filter((a) => {
  //         return a._jurorId._id.toHexString() == _jurorId
  //       })
  //       return r
  //     })
  //     return data
  //   } else {
  //     data = result.map((r) => {
  //       r.points1 = []
  //       r.points2 = r.points2.filter((a) => {
  //         return a._jurorId._id.toHexString() == _jurorId
  //       })
  //       return r
  //     })
  //     return data
  //   }
  // }

  pointFindUpdate(times).then(() => {
    return pointFindOne(times)
  }).then((result) => {
    res.send(result)
  }).catch((e) => {
    res.status(403).send(e)
  })
})

module.exports = pointRouter;
