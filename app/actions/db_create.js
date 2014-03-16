var Path = require("path")
var fs = require("fs")
var Q = require("q");
var eco = require("eco")
var prompt = require("prompt")



function execute(){
  console.info("Scaffolding New App".grey);

  fs.mkdirSync( Path.join( process.cwd(), "3vot_backend" ))

  fs.mkdirSync( Path.join( process.cwd(), "3vot_backend", "app" ))

  fs.mkdirSync( Path.join( process.cwd(), "3vot_backend", "test" ))
  
  var templatesPath =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../../templates');

  //var codeSrc = fs.readFileSync(  Path.join( templatesPath, "app", "code.eco" ), "utf-8");

//  var codeRender = eco.render( codeSrc , tempVars);


  //fs.writeFileSync( Path.join( process.cwd(), "apps", tempVars.app.name, "code" , "index.js" ), codeRender );

  return true;
}


module.exports = execute;