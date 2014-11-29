var Log = require("3vot-cloud/utils/log")
var Path = require("path")
var fs = require("fs")
var Q = require("q");
var eco = require("eco")
var Transform = require("../utils/transform")

var promptOptions = {
  user_name: null,
  app_name: null,
  target: null
}

function renderPage(options){
  Log.debug("Rendering Page","actions/salesforce_upload", 43)


  promptOptions = options;

  var templatePath = Path.join( process.cwd(),  "index.html" );
  var templateBody = fs.readFileSync( templatePath, "utf-8" );
  var html = "";

  if(promptOptions.promptValues.target == "localhost"){
    html = Transform["toLocal"]( templateBody, promptOptions, false)
    html = Transform.injectClay(html, promptOptions.package, false);
  }
  else if(promptOptions.promptValues.target == "production"){

    html = Transform.transformIndex( templateBody, promptOptions.package, promptOptions.promptValues.publish);
    //html = Transform.injectClay(html, promptOptions.package);
  }

  return html;  
}

module.exports = renderPage;