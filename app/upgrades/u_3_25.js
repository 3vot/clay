var Q = require("q")
var Path = require("path")
var fs = require("fs")
var eco = require("eco")

var promptOptions = {
  public_dev_key: null,
  user_name: null
}

function execute(options){
  var deferred = Q.defer();
  promptOptions = options

  process.nextTick(function(){
    
    var appsPath = Path.join( process.cwd(), "apps" )
    
    files = fs.readdirSync(appsPath)
    dirs = []

    for(file in files){
      file = files[file]
      if(file != "dependencies"){
        adjust3vot(file)
      }
    }

    deferred.resolve()
  })
  
  return deferred.promise;
  
}

function adjust3vot(app_name){
  var pck = require( Path.join( process.cwd(), "apps", app_name, "package.json" ) );
  
  var templatesPath =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../../templates' , "app" , "3vot.eco");
  templatePath = fs.readFileSync( templatesPath, "utf-8");

  var templateRender = eco.render( templatePath , { options: { user_name: promptOptions.user_name, app_name: app_name } } );
  fs.writeFileSync( Path.join( process.cwd(), "apps", app_name, "start", "3vot.js" ), templateRender);
}

module.exports = execute