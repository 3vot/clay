var Log = require("3vot-cloud/utils/log")
var Path = require("path")
var fs = require("fs")
var Q = require("q");
var eco = require("eco")
var Transform = require("../utils/transform")

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

  var package_json = require( Path.join( process.cwd(), "apps", promptOptions.app_name, "package.json" )  );
  var templatePath = Path.join(Path.dirname(fs.realpathSync(__filename)), '..' ,".." , 'templates', "salesforce", "page.eco" );
  var htmlPath = Path.join( Path.join( process.cwd(), "apps", promptOptions.app_name, "index.html" ) );

  var app = fs.readFileSync( templatePath, "utf-8" )

  var html = "";
  if(promptOptions.target == "localhost") html = Transform["toLocal"]( fs.readFileSync( htmlPath, "utf-8" ), {user_name: promptOptions.user_name, app_name: promptOptions.app_name} )
  else if(promptOptions.target == "production") html = Transform.transformIndex( fs.readFileSync( htmlPath, "utf-8" ), package_json);

  html = Transform.transformBodyToDiv(html, {});

  var result = eco.render(app, { pck: package_json, user_name: promptOptions.user_name, body: html, show_header: promptOptions.show_header, unmanned: promptOptions.unmanned } );

  return result;  

}

module.exports = renderPage;