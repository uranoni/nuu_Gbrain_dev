const mongoose = require('mongoose');
const URI = 'mongodb://localhost:27017/'
const { SystemSchema } = require('./system')
const { UserSchema } = require('./user')
const { PointSchema } = require('./point')
const { PostSchema } = require('./post')
const { TeamSchema } = require('./team')
const { SecuritySchema } = require('./security')



function dbChange(dataBase, schemaName) {
  let Schema;
  switch (schemaName) {
    case 'User':
      Schema = UserSchema;
      break;
    case 'System':
      Schema = SystemSchema;
      break;
    case 'Team':
      Schema = TeamSchema;
      break;
    case 'Post':
      Schema = PostSchema;
      break;
    case 'Point':
      Schema = PointSchema;
      break;
    default:
      return;
  }
  const tmpConnect = mongoose.createConnection(URI + dataBase)

  return tmpConnect.model(schemaName, Schema)
}

function Security() {
  const tmpConnect = mongoose.createConnection(URI + "Security")
  return tmpConnect.model('Security', SecuritySchema)
}

module.exports = { dbChange, Security }
