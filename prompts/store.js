var Create = require("../app/actions/store_create")
var Destroy = require("../app/actions/store_destroy")
var AddApp = require("../app/actions/store_add_app")
var Generate = require("../app/actions/store_generate_template")
var RemoveApp = require("../app/actions/store_remove_app")
var List = require("../app/actions/store_list")

var prompt = require("prompt")
var LoadPackage = require("../app/utils/package_loader")

function generate(){
  LoadPackage()
  .then(Generate)
  .then( function(){ console.log("Store Created Succesfully".green) } )
  .fail( function(err){ console.log("Error creating Stores".red.bold); console.error(err.red); }  )   
 }

function create(){
   prompt.start();
   prompt.get( [ 
     { name: 'name', description: 'Store: ( The name of the Store you want to create )' } ], function (err, result) {
     LoadPackage(result)
     .then( Create )
     .then( function(){ console.log("Store Created Succesfully".green) } )
     .fail( function(err){ console.log("Error Creating Stores".red.bold); console.error(err); }  )
   });
 }
 
function list(){
   LoadPackage()
   .then(List)
   .fail( function(err){ console.log("Error creating Stores".red.bold); console.error(err.red); }  )
}
 
function destroy(){
   prompt.start();
   prompt.get( [ 
     { name: 'name', description: 'Stores: ( The name of the Stores you want to delete )' } ], function (err, result) {
     LoadPackage(result)
     .then(Destroy)
     .then( function(){ console.log("Stores Deleted Succesfully".green) } )
     .fail( function(err){ console.log("Error creating Stores".red.bold); console.error(err.red); }  )
   });
 }
 
function addApp(){
   prompt.start();
   prompt.get( [ 
     { name: 'name', description: 'Stores: ( The name of the Store you want to use )' },
     { name: 'app_name', description: 'App: ( The name of the App you want to add to the store )' } ], function (err, result) {

     LoadPackage(result)
     then(AddApp)
     .then( function(){ console.log("App added succesfully to Stores".green) } )
     .fail( function(err){ console.log("Error creating Stores".red.bold); console.error(err); }  )
   });
 }

function removeApp(){
   prompt.start();
   prompt.get( [ 
     { name: 'name', description: 'Store: ( The name of the Store you want to use )' },
     { name: 'app_name', description: 'App: ( The name of the App you want to remove from the store )' } ], function (err, result) {
     
     LoadPackage(result)
     .then(RemoveApp)
     .then( function(store){ console.log("App removed succesfully from Store".green); } )
     .fail( function(err){ console.log("Error removing App from Store".red.bold); console.error(err); }  )
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