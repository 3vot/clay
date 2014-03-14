var _3vot = require("3vot")

function localhost(fileContents, user_name, app_name, domain){
  var devDomain = domain || "localhost:3000"

  //transform domain
  fileContents = fileContents.replace("3vot.domain = 'demo.3vot.com';","3vot.domain = '" + devDomain  + "';")

  //tranform assets
  fileContents = _3vot.utils.replaceAll( fileContents,
    "*/assets", 
    ["/" , devDomain , user_name, app_name , "assets"].join("/") 
  );

  return fileContents;
}

function demo(fileContents, user_name, app){
  
  //transform path to demo with version number
  fileContents = fileContents.replace(
    "_3vot.path = '//' + _3vot.domain + '/" + user_name + "/' + package.name;",
    "_3vot.path = '//' + _3vot.domain + '/" + user_name + "/' + package.name + '_" + app.version + "';"
  );
  
  //tranform assets
  fileContents = _3vot.utils.replaceAll( fileContents,
    "*/assets", 
    ["//demo.3vot.com" , user_name, app.name + "_" + app.version , "assets"].join("/") 
  );
  
  return fileContents;
}

function production(fileContents, user_name, app){

  fileContents = fileContents.replace(
    "_3vot.domain = 'demo.3vot.com';",
    "_3vot.domain = '3vot.com';"
  );

  //tranform assets
  fileContents = _3vot.utils.replaceAll( fileContents,
    "*/assets", 
    ["//3vot.com" , user_name, app.name , "assets"].join("/") 
  );

  fileContents = _3vot.utils.replaceAll( fileContents, 
    [ "demo.3vot.com", user_name , app.name + "_" + app.version ].join("/"),
    [ "3vot.com", user_name, app.name].join("/") 
  );

  return fileContents;
}


module.exports = {
  production: production,
  demo: demo,
  localhost: localhost
}