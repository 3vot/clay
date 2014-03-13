var _3vot = require("3vot")

function transformToLocalhost(indexFileContents, pck, domain){
  var devDomain = domain || "localhost:3000"
  indexFileContents = indexFileContents.replace("3vot.domain = 'demo.3vot.com';","3vot.domain = '" + devDomain  + "';")
  indexFileContents = _3vot.utils.replaceAll( indexFileContents,
    "assets", 
    ["//" , devDomain , pck.profile, pck.name , "assets"].join("/") 
  );

  return indexFileContents;
}

function transformToDemo(indexFileContents, tempVars){
  indexFileContents = indexFileContents.replace(
    "_3vot.path = '//' + _3vot.domain + '/' + package.profile + '/' + package.name;",
    "_3vot.path = '//' + _3vot.domain + '/' + package.profile + '/' + package.name + '_' + package.version;"
  );

  indexFileContents = _3vot.utils.replaceAll( indexFileContents, 
    "assets", 
    [ "//", "demo.3vot.com", tempVars.options.user_name, tempVars.app.name + "_" + tempVars.app.version, "assets"].join("/")
  );

  indexFileContents = _3vot.utils.replaceAll(indexFileContents , 
    [ "localhost:3000", tempVars.options.user_name, tempVars.app.name].join("/") ,
    [ "demo.3vot.com", tempVars.options.user_name, tempVars.app.name + "_" + tempVars.app.version ].join("/")
  )
  
  return indexFileContents;
}

function transformToProduction(indexFileContents, user_name, app){

  indexFileContents = indexFileContents.replace(
    "_3vot.domain = 'demo.3vot.com';",
    "_3vot.domain = '3vot.com';"
  );

  indexFileContents = indexFileContents.replace(
    "_3vot.path = '//' + _3vot.domain + '/' + package.profile + '/' + package.name + '_' + package.version;",
    "_3vot.path = '//' + _3vot.domain + '/' + package.profile + '/' + package.name;"
  );

  indexFileContents = _3vot.utils.replaceAll( indexFileContents, 
    [ "demo.3vot.com", user_name , app.name + "_" + app.version ].join("/"),
    [ "3vot.com", user_name, app.name].join("/") 
  );

  return indexFileContents;
}


module.exports = {
  transformToProduction: transformToProduction,
  transformToDemo: transformToDemo,
  transformToLocalhost: transformToLocalhost
}