var bower = require("bower");

var Path = require("path")
var fs = require("fs")
var Q = require("q");
Q.longStackSupport = true;

_3scaffold = (function() {

  function _3scaffold() {}

  _3scaffold.setup= function (options){

    fs.mkdir( Path.join( process.cwd(), options.folder ), function(){} );
    fs.mkdir( Path.join( process.cwd(), options.folder , "apps" ), function(){} );
    fs.mkdir( Path.join( process.cwd(), options.folder , "apps", "dependencies" ), function(){} );
    fs.mkdir( Path.join( process.cwd(), options.folder , "tmp" ), function(){}) ;

    var templatesPath =  Path.join(Path.dirname(fs.realpathSync(__filename)), './templates');

    console.log(templatesPath);
  
    var _3votJSON = require( Path.join(  templatesPath, "_3vot.json" ));
    var gitIgnore = fs.readFileSync(  Path.join( templatesPath, "_.gitignore" ), "utf-8");
    var pckJSON = require( Path.join( templatesPath, "package.json" ));

    _3votJSON.key = options.key;
    _3votJSON.profile = options.profile;

    fs.writeFileSync( Path.join(process.cwd(), options.folder, "3vot.json"), JSON.stringify(_3votJSON) );
    fs.writeFileSync( Path.join(process.cwd(), options.folder, "package.json"), JSON.stringify(pckJSON) );
    fs.writeFileSync( Path.join(process.cwd(), options.folder, ".gitignore"), gitIgnore );

  }
  
  return _3scaffold;

})();

module.exports = _3scaffold;