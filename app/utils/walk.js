var fs = require("fs")
var Path = require("path")
var Log = require("./log")


function walkDir(dir, results) {
  var results = [];
  var list;
  try{
    list = fs.readdirSync(dir);
  }catch(e){
    return [];
  }

  list.forEach(function(sourceFile) {
    file = Path.join( dir, sourceFile );
    var stat = fs.statSync(file);
    if ( stat && stat.isDirectory() ){
      var recursiveResult = walkDir( file , results );
      for(index in recursiveResult){
        var recursive = recursiveResult[ index ];
        recursive.name = sourceFile + "/" + recursive.name;
      }
      results = results.concat( results,  recursiveResult);
    }
    else{
      results.push( { path: file, name: sourceFile } );
    }
  })
  
  return results.filter(function(elem, pos) {
      return results.indexOf(elem) == pos;
  })
}

module.exports = walkDir;