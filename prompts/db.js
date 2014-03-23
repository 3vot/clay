var prompt = require("prompt")
var LoadPackage = require("../app/utils/package_loader")

var Create = require("../app/actions/db_create")
var Build = require("../app/actions/db_build")
var Deploy = require("../app/actions/db_deploy")

function create(callback){
  return Create()
}

function build(callback){
  return Build({})
}

function deploy(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'version', description: 'Version: ( The Version of the Db App you want to deploy, enter for latest )' }, 
    { name: 'target', description: 'Target: ( development, test, production ) // enter for development' } ], 
    function (err, result) {
      if(!result.target) result.target = "development"
      LoadPackage(result)
      .then( Deploy )
      .then( function(){ console.log("DB App Deployed Succesfully".green); } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){ console.log("Error Deploying App"); console.error(err); })
  });
}

function develop(callback){
  var result= {
   target: "development" 
  }
  LoadPackage(result)
  .then( function(){ return Build({ developmentMode: true } ) } )
  .then( function(){ result.developmentMode = true; return Deploy(result) } )
  .then( function(){ console.log("DB App Deployed Succesfully".green); } )
  .then( function(){ if(callback) return callback(); })
  .fail( function(err){ console.log("Error Deploying App"); console.error(err); })
}


module.exports = {
  create: create,
  build: build,
  deploy: deploy,
  develop: develop
}
