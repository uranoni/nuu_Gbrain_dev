const express = require("express");
const router = express.Router();

const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');

const { Team } = require('../models/team');

const allTeamXlsxPromise = () => {
  return new Promise((resolve, reject) => {
    const data = [
      ['專題主題', '指導老師', '指導老師email', '隊長', '隊長email', '檔案上傳進度', '組員一', '組員一email', '組員二', '組員二email', '組員三', '組員三email', '組員四', '組員四email', '組員五', '組員五email']
    ];

    Team.find().then((teams) => {
      teams.forEach(team => {
        const processCheck = ['register', 'plan', 'cover', 'video', 'warrant'];

        let count = 0;
        processCheck.forEach( p => {
          if (team[p]) {
            count ++
          }
        })
        team.process = count / 5 * 100 + '%';

        const row = [
          team.title,
          team.teacher.name,
          team.teacher.email,
          team.leader.name,
          team.leader.email,
          team.process
        ]


        for (let i = 0; i < team.registers.length; i++) {
          row.push(team.registers[i].name);
          row.push(team.registers[i].email);
        }

        data.push(row);
      })

      try {
        const buffer = xlsx.build([{ 'name': "工作表1", 'data': data}]);
        const formPath = path.resolve(__dirname, '../public/form')
        const publicPath = path.resolve(__dirname, '../public')
        if (!fs.existsSync(publicPath)) {
          fs.mkdirSync(publicPath);
        } else if (!fs.existsSync(formPath)) {
          fs.mkdirSync(formPath);
        }
        fs.writeFileSync( `${formPath}/總隊伍表.xlsx`, buffer)
        resolve('/public/form/總隊伍表.xlsx');
      } catch(err) {
        reject(err)
      }
    })
  })
}

module.exports = { allTeamXlsxPromise };
