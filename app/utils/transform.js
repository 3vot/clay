var _3vot = require("3vot")
var Path = require("path")
var Log = require("./log")


function localhost(fileContents, user_name, app_name, domain){
  var devDomain = domain || "localhost:3000"
  
  fileContents = _3vot.utils.replaceAll( fileContents, '//3vot.com', '//' + devDomain )

  //tranform assets
  fileContents = _3vot.utils.replaceAll( fileContents,
    "*/assets", 
    ["/" , devDomain , user_name, app_name , "assets"].join("/") 
  );

  return fileContents;
}

function demo(fileContents, user_name, app_name, app_version){
  if(!app_version || ( parseInt(app_version) > 0 ) == false ){
    app_version = require( Path.join(process.cwd(), "apps", app_name, "package.json") ).threevot.version;
  }
  
  if(fileContents.indexOf("/"+app_name+"_"+app_version) == -1){
    fileContents = _3vot.utils.replaceAll( fileContents, user_name+"/"+app_name, user_name+"/"+app_name+"_"+app_version  )    
  }

  
  //transform path to demo with version number
  fileContents = _3vot.utils.replaceAll( fileContents, 
    '_3vot.path=_3vot.domain+"/' + user_name + '/"+package.name',
    '_3vot.path=_3vot.domain+"/' + user_name + '/"+package.name+"_'+app_version+'"'
  );
  
  //tranform assets
  fileContents = _3vot.utils.replaceAll( fileContents,
    "*/assets", 
    ["//3vot.com" , user_name, app_name + "_" + app_version , "assets"].join("/") 
  );
  
  fileContents = _3vot.utils.replaceAll( fileContents, "//3vot.com", "//" + _3vot.host  )
  
  return fileContents;
}

module.exports = {
  production: demo,
  demo: demo,
  localhost: localhost
}