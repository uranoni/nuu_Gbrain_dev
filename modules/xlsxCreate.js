const express = require("express");
const router = express.Router();

const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');

const { Team } = require('../models/team');

const allTeamXlsx = () => {
  const data = [
    ['專題主題', '指導老師', '隊長', '組員', '備註']
  ];

  Team.find().then((teams) => {
    teams.forEach(team => {
      let registersName = team.registers.map(r => `${r.name}(${r.email})`);
      const row = [ team.title, `${team.teacher.name}(${team.teacher.email})`, `${team.leader.name}(${team.leader.email})`, registersName.join(', ')]
      data.push(row);
    })
    const buffer = xlsx.build([{ name: "工作表1", data: data}]);
    const filePath = path.resolve('__dirname', '../public/form')
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync('./public');
      fs.mkdirSync('./public/form');
    }
    fs.writeFileSync( `${filePath}/總隊伍表.xlsx`, buffer)
  })
}

module.exports = { allTeamXlsx };
