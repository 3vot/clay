var fs = require('fs');

var archiver = require('archiver');

var output = fs.createWriteStream(__dirname + '/js.zip');
var archive = archiver('zip');

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

archive.bulk([
  { expand: true, cwd: 'js/', src: ['*.*'],dest: 'app' }
]);

archive.finalize();