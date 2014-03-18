var _3vot = require("3vot")

function localhost(fileContents, user_name, app_name, domain){
  var devDomain = domain || "localhost:3000"

  //transform domain
  fileContents = fileContents.replace("3vot.domain = '3vot.com';","3vot.domain = '" + devDomain  + "';")

  //tranform assets
  fileContents = _3vot.utils.replaceAll( fileContents,
    "*/assets", 
    ["/" , devDomain , user_name, app_name , "assets"].join("/") 
  );

  return fileContents;
}

function demo(fileContents, user_name, app_name, app_version){
  
  //transform path to demo with version number
  fileContents = fileContents.replace(
    "_3vot.path = '//' + _3vot.domain + '/" + user_name + "/' + package.name;",
    "_3vot.path = '//' + _3vot.domain + '/" + user_name + "/' + package.name + '_" + app_version + "';"
  );
  
  //tranform assets
  fileContents = _3vot.utils.replaceAll( fileContents,
    "*/assets", 
    ["//3vot.com" , user_name, app_name + "_" + app_version , "assets"].join("/") 
  );
  
  return fileContents;
}

function production(fileContents, user_name, app_name){

  //tranform assets
  fileContents = _3vot.utils.replaceAll( fileContents,
    "*/assets", 
    ["//3vot.com" , user_name, app_name , "assets"].join("/") 
  );

  return fileContents;
}


module.exports = {
  production: production,
  demo: demo,
  localhost: localhost
}