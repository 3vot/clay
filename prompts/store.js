var Create = require("../app/actions/store_create")
var Destroy = require("../app/actions/store_destroy")
var AddApp = require("../app/actions/store_add_app")
var Generate = require("../app/actions/store_generate_template")
var RemoveApp = require("../app/actions/store_remove_app")
var List = require("../app/actions/store_list")

var prompt = require("prompt")
var LoadPackage = require("../app/utils/package_loader")

function generate(callback){
  LoadPackage()
  .then(Generate)
  .then( function(){ console.log("Store Created Succesfully".green) } )
  .then( function(){ if(callback) return callback(); })
  .fail( function(err){ console.log("Error generating Store Profile".red.bold); console.error(err.red); }  )   
 }

function create(callback){
   prompt.start();
   prompt.get( [ 
     { name: 'name', description: 'Store: ( The name of the Store you want to create )' } ], function (err, result) {
     LoadPackage(result)
     .then( Create )
     .then( function(){ console.log("Store Created Succesfully".green) } )
     .then( function(){ if(callback) return callback(); })
     .fail( function(err){ console.log("Error Creating Stores".red.bold); console.error(err); }  )
   });
 }
 
function list(callback){
   LoadPackage()
   .then(List)
   .then( function(){ if(callback) return callback(); })
   .fail( function(err){ console.log("Error listing Stores".red.bold); console.error(err.red); }  )
}
 
function destroy(callback){
   prompt.start();
   prompt.get( [ 
     { name: 'name', description: 'Stores: ( The name of the Stores you want to delete )' } ], function (err, result) {
     LoadPackage(result)
     .then(Destroy)
     .then( function(){ console.log("Stores Deleted Succesfully".green) } )
     .then( function(){ if(callback) return callback(); })
     .fail( function(err){ console.log("Error destroying Stores".red.bold); console.error(err.red); }  )
   });
 }
 
function addApp(callback){
   prompt.start();
   prompt.get( [ 
     { name: 'name', description: 'Stores: ( The name of the Store you want to use )' },
     { name: 'app_name', description: 'App: ( The name of the App you want to add to the store )' } ], function (err, result) {

     LoadPackage(result)
     .then(AddApp)
     .then( function(){ console.log("App added succesfully to Stores".green) } )
     .then( function(){ if(callback) return callback(); })
     .fail( function(err){ console.log("Error addin an app to a Store".red.bold); console.error(err); }  )
   });
 }

function removeApp(callback){
   prompt.start();
   prompt.get( [ 
     { name: 'name', description: 'Store: ( The name of the Store you want to use )' },
     { name: 'app_name', description: 'App: ( The name of the App you want to remove from the store )' } ], function (err, result) {
     
     LoadPackage(result)
     .then(RemoveApp)
     .then( function(store){ console.log("App removed succesfully from Store".green); } )
     .then( function(){ if(callback) return callback(); })
     .fail( function(err){ console.log("Error removing an App from a Store".red.bold); console.error(err); }  )
   });
 }
 
module.exports = {
  removeApp: removeApp,
  addApp: addApp,
  create: create,
  destroy: destroy,
  list: list,
  generate: generate
}