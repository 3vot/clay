var Create = require("../app/actions/store_create")
var Destroy = require("../app/actions/store_destroy")
var AddApp = require("../app/actions/store_add_app")
var Generate = require("../app/actions/store_generate_template")
var RemoveApp = require("../app/actions/store_remove_app")
var List = require("../app/actions/store_list")

var prompt = require("prompt")
var LoadPackage = require("../app/utils/package_loader")
var Log = require("../app/utils/log")

function generate(options){
  Generate(options)
  .then( function(){ Log.debug("Store Data Generated Succesfully", "prompts/store", 14) } )
  .fail( function(err){ Log.error(err, "prompts/store", 15) }  )   
 }

function create(callback){
   prompt.start();
   prompt.get( [ 
     { name: 'name', description: 'Store: ( The name of the Store you want to create )' } ], function (err, result) {
     LoadPackage(result)
     .then( Create )
     .then( function(options){ 
       Log.debug("Store Created Succesfully", "prompts/store", 25)
        if(callback) return callback(options);
      })
      .fail( function(err){ Log.error(err, "prompts/store", 28) }  )   
   });
 }
 
function list(callback){
   LoadPackage()
   .then(List)
   .then( function(){ if(callback) return callback(); })
   .fail( function(err){ Log.error(err, "prompts/store", 36) }  )   
}
 
function destroy(callback){
   prompt.start();
   prompt.get( [ 
     { name: 'name', description: 'Stores: ( The name of the Stores you want to delete )' } ], function (err, result) {
     LoadPackage(result)
     .then(Destroy)
     .then( function(options){ 
       Log.debug("Stores Deleted Succesfully", "prompts/store", 46 )
       if(callback) return callback();
     })
     .fail( function(err){ Log.error(err, "prompts/store", 49) }  )   
   });
 }
 
function addApp(callback){
   prompt.start();
   prompt.get( [ 
     { name: 'name', description: 'Stores: ( The name of the Store you want to use )' },
     { name: 'app_name', description: 'App: ( The name of the App you want to add to the store )' } ], function (err, result) {

     LoadPackage(result)
     .then(AddApp)
     .then( function(options){ 
       Log.debug("App added succesfully to Stores", "prompts/store", 63)
        if(callback) return callback(options);
     })
     .fail( function(err){ Log.error(err, "prompts/store", 65) }  )   
   });
 }

function removeApp(callback){
   prompt.start();
   prompt.get( [ 
     { name: 'name', description: 'Store: ( The name of the Store you want to use )' },
     { name: 'app_name', description: 'App: ( The name of the App you want to remove from the store )' } ], function (err, result) {
     
     LoadPackage(result)
     .then(RemoveApp)
     .then( function(options){ 
       Log.debug("App removed succesfully from Store", "prompts/store", 78)
        if(callback) return callback(options);
      })
      .fail( function(err){ Log.error(err, "prompts/store", 81) }  )   
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