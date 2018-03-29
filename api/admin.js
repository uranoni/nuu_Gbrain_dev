const express = require('express');
const {verifyRole} = require('../middleware/authenticate.js')
const _ = require('lodash');
const {Team} = require('../models/team.js');
const {User} = require('../models/user.js');
const {Point} = require('../models/point.js');
const { allTeamXlsx } = require('../modules/xlsxCreate.js')

const router = express.Router();

router.route('/teamData')
  .get(verifyRole, (req, res) => {
    Team.find()
      .then((result) => (
        res.send(result)
      ))
  })


router.route('/userData')
  .get(verifyRole, (req, res) => {
    User.find({ roleId: { $ne: "admin" } })
      .then((result) => (
        res.send(result)
      ))
  })


router.route('/user/:id')
  .get(verifyRole, (req, res) => {
    const userId = req.params.id;
    User.findOne({ _id: userId })
      .then((user) => {
        if (!user) {
          res.status(404).send({
            message: "not found user id with : " + userId
          })
        }
        res.send(user)
      })
  })
  .patch(verifyRole, (req, res) => {
    const userId = req.params.id;
    const modidyData = req.body;
    User.findOne({ _id: userId })
      .then((user) => {
        if (!user) {
          res.status(404).send({
            message: "not found user id with : " + userId
          })
        }
        const updateData = {
          ...user,
          ...modidyData
        }
        return user.update({ $set: { ...updateData } })
      })
      .then((result) => {
        res.send({
          message: "更新會員成功(update user success)"
        })
      })
      .catch((err) => {
        res.status(405).send({
          message: err
        })
      })
  })
  .delete(verifyRole, (req, res) => {
    const userId = req.params.id;
    User.findOne({ _id: userId })
      .then((user) => {
        if (!user) {
          res.status(404).send({
            message: "not found user id with : " + userId
          })
        }
        return user.remove()
      })
      .then((result) => {
        res.send({
          message: "刪除會員成功(delete user success)"
        })
      })
      .catch((err) => {
        res.status(405).send({
          message: "error",
          errorMsg: err
        })
      })
  })

router.route('/team/:id')
  .get(verifyRole, (req, res) => {
    const teamId = req.params.id;
    Team.findOne({ _id: teamId })
      .then((team) => {
        if (!team) {
          res.status(404).send({
            message: "not found team id with : " + teamId
          })
        }
        res.send(team)
      })
  })
  .patch(verifyRole, (req, res) => {
    const teamId = req.params.id;
    const modidyData = req.body;
    Team.findOne({ _id: teamId })
      .then((team) => {
        if (!team) {
          res.status(404).send({
            message: "not found team id with : " + teamId
          })
        }
        const updateData = {
          ...team,
          ...modidyData
        }
        return team.update({ $set: { ...updateData } })
      })
      .then((result) => {
        allTeamXlsx();
        res.send({
          message: "更新隊伍成功(update team success)"
        })
      })
      .catch((err) => {
        res.status(405).send({
          message: err
        })
      })
  })
  .delete(verifyRole, (req, res) => {
    const teamId = req.params.id;
    Team.findOne({ _id: teamId })
      .then((team) => {
        if (!team) {
          res.status(404).send({
            message: "not found team id with : " + teamId
          })
        }
        return Promise.all([team.remove({ _id: teamId }), Point.findOneAndRemove({_teamId: teamId})])
      })
      .then((result) => {
        allTeamXlsx();
        res.send({
          message: "刪除隊伍成功(delete team success)"
        })
      })
      .catch((err) => {
        res.status(405).send({
          message: err
        })
      })
  })

router.route('/teamRegister/:teamId/:registerId')
  .delete(verifyRole, (req, res) => {
    const teamId = req.params.teamId;
    const registerId = req.params.registerId;
    Team.findOne({_id: teamId})
      .then((team) => {
        if (!team) {
          res.status(404).send({
            message: "not found team id with : " + teamId
          })
        }
        return team.update({$pull: {
          registers: { _id: registerId }
        }})
      })
      .then((result) => {
        allTeamXlsx();
        res.send({
          message: "刪除隊員成功(success delete register)"
        })
      })
      .catch((err) => {
        res.status(405).send({
          message: err
        })
      })
  })

module.exports = router;
