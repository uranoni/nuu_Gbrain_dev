var fs = require('fs');
var path = require('path');

function base64ToImage(data) {
  return new Promise((resolve, reject) => {
    data = data.replace(/.*:(image)\/(.*);.*,/, '');
    if (RegExp.$1 !== "image") {
      reject('這不是圖片');
    } else {
      var decide = RegExp.$1
      var extension = RegExp.$2;
      var date = Date.now()
      // data = data.replace(/^data:image\/png;base64,/, '');
      fs.writeFile(path.resolve(__dirname, `../carousel/${date}.${extension}`), data, 'base64', (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(`/carousel/${date}.${extension}`)
        }
      });
    }
  })
}

module.exports = { base64ToImage }
