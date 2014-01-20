var bower = require("bower");

var Path = require("path")
var fs = require("fs")
var Q = require("Q");
Q.longStackSupport = true;

_3scaffold = (function() {

  function _3scaffold() {}

  _3scaffold.setup= function (folderName){

    fs.mkdir( Path.join(process.cwd(), folderName ), function(){});
    fs.mkdir( Path.join(process.cwd(), folderName , "apps" ), function(){});
    fs.mkdir( Path.join(process.cwd(), folderName , "apps", "dependencies" ), function(){});
    fs.mkdir( Path.join(process.cwd(), folderName , "tmp" ), function(){});
    
    var _3votJSON = require( Path.join(process.cwd(), "templates", "3vot.json"  ));
    var gitIgnore = fs.readFileSync(  Path.join(process.cwd(), "templates", ".gitignore"  ));
    var pckJSON = require( Path.join(process.cwd(), "templates", "package.json"  ));
    
    fs.writeFileSync( Path.join(process.cwd(), folderName, "3vot.json"), JSON.stringify(_3votJSON) );

    fs.writeFileSync( Path.join(process.cwd(), folderName, "package.json"), JSON.stringify(pckJSON) );

    fs.writeFileSync( Path.join(process.cwd(), folderName, ".gitignore"), gitIgnore );

  }
  
  return _3scaffold;

})();

module.exports = _3scaffold;