var Log = require("3vot-cloud/utils/log")
var Path = require("path")
var fs = require("fs")
var Q = require("q");
var eco = require("eco")

var promptOptions = {
  user_name: null,
  app_name: null,
  show_header: null,
  target: null
}

function renderPage(options){
  promptOptions = options;

  Log.debug("Rendering Page","actions/salesforce_upload", 43)

  if(promptOptions.show_header === "y"){
    promptOptions.show_header = true;
  }else{ promptOptions.show_header = false}

  var templateName = "page.eco"
  if(promptOptions.target != "production") templateName = "localpage.eco"

  var templatePath = Path.join(Path.dirname(fs.realpathSync(__filename)), '..' , ".." , 'templates',"salesforce" , templateName );
  
  var app = fs.readFileSync( templatePath, "utf-8" )

  try{
    var package_json = require( Path.join( process.cwd(), "apps", promptOptions.app_name, "package.json" )  );
  }catch(e){
    throw "App " + promptOptions.app_name + " not found. Did you create it? Create an app or template before we can send it to salesforce."
  }

  var headProbablePath = Path.join( process.cwd(), "apps", promptOptions.app_name, "code","views","head.html" );
  var head = ""
  try{ head = fs.readFileSync( headProbablePath, "utf-8") }catch(err){}
  var result = eco.render(app, { pck: package_json, user_name: promptOptions.user_name, head: head, show_header: promptOptions.show_header, unmanned: promptOptions.unmanned } );

  return result;  

}

module.exports = renderPage;