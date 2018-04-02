var fs = require('fs');
var archiver = require('archiver');
var path = require('path')

const putputPath = path.resolve(__dirname, '../public')
const zipPath = path.resolve(__dirname, '../uploads')
const fileZIP = () => {
  return new Promise((resolve, reject) => {
    var output = fs.createWriteStream(putputPath + '/uploads.zip');

    var archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    output.on('close', function() {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
      resolve('/public/uploads.zip');
    });

    output.on('end', function() {
      console.log('Data has been drained');
    });

    archive.on('error', function(err) {
      reject(err);
    });

    archive.pipe(output);

    archive.directory(zipPath, 'uploads');

    archive.finalize();
  })
}

module.exports = { fileZIP };
