var _3vot = require("3vot")

function transformToLocalhost(indexFileContents, pck){
  var devDomain = "localhost:3000"
  indexFileContents = indexFileContents.replace("3vot.domain = 'demo.3vot.com';","3vot.domain = '" + devDomain  + "';")
  indexFileContents = _3vot.utils.replaceAll( indexFileContents,
    "assets/", 
    ["//" , devDomain , pck.profile, pck.name , "assets", ""].join("/") 
  );

  return indexFileContents;
}

function transformToDemo(indexFileContents, pck){
  indexFileContents = indexFileContents.replace(
    "_3vot.path = '//' + _3vot.domain + '/' + package.profile + '/' + package.name;",
    "_3vot.path = '//' + _3vot.domain + '/' + package.profile + '/' + package.name + '_' + package.version;"
  );
  
  indexFileContents = _3vot.utils.replaceAll( indexFileContents, 
    "assets/", 
    [ "//", "demo.3vot.com", pck.profile, pck.name + "_" + pck.version ].join("/")
  );

  indexFileContents = _3vot.utils.replaceAll(indexFileContents , 
    [ "localhost:3000", pck.profile, pck.name].join("/") ,
    [ "demo.3vot.com", pck.profile , pck.name + "_" + pck.version ].join("/")
  )
  
  return indexFileContents;
}

function transformToProduction(indexFileContents, pck){
  
  indexFileContents = indexFileContents.replace(
    "_3vot.path = '//' + _3vot.domain + '/' + package.profile + '/' + package.name + '_' + package.version;",
    "_3vot.path = '//' + _3vot.domain + '/' + package.profile + '/' + package.name;"
  );
  
  indexFileContents = _3vot.utils.replaceAll( indexFileContents, 
    [ "demo.3vot.com", pck.profile , pck.name + "_" + package.version ].join("/"),
    [ "3vot.com", pck.profile, pck.name].join("/") 
  );
  
  return indexFileContents;
}


module.exports = {
  transformToProduction: transformToProduction,
  transformToDemo: transformToDemo,
  transformToLocalhost: transformToLocalhost
}