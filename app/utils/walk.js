var fs = require("fs")
var Path = require("path")

function walkDir(dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function(sourceFile) {
    file = Path.join( dir, sourceFile );
    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()){ }
    else{ results.push({path: file, name: sourceFile }); }
  })
  return results;
}

module.exports = walkDir;