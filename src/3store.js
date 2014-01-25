var fs = require('fs');
var Ignore = require("fstream-ignore");
var Aws = require("aws-sdk");
var Semver = require("semver");
var fstream = require("fstream");
var tar = require("tar");
var zlib = require("zlib");
var Q = require("q");
Q.longStackSupport = true;
var colors = require('colors');
var Parse = require('parse').Parse;
var mime = require('mime')
var Path = require('path');
var prompt = require("prompt")

var _3profile = require("./3profile")

var _3template = require("./3template")

var _3upload = require("./3upload")

//TODO: Must request this variables in a Safe Way

Aws.config.update( { accessKeyId: 'AKIAIHNBUFKPBA2LINFQ', secretAccessKey: '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' } );


// *****************
// CLI
// *****************
var _3store;

_3store = (function(){

  var app = { name: "", username: "" };
  var username = "";
  var packageInfo = "";
  var stages = []

  function _3store( options ) {}

  _3store.storeTemplatePath= Path.join( process.cwd(), "templates", "store.eco" );

  _3store.promptCreate = function(){
    prompt.start();
    prompt.get( [ 
      { name: 'store', description: 'Store: ( The name of the Store you want to create )' } ], function (err, result) {
      _3store.createStore(result.store)
      .then( function(){ console.log("Store Created Succesfully".green) } )
      .fail( function(err){ console.log("Error creating Store".red.bold); console.error(err.red); }  )
    });
  }
  
  _3store.promptDelete = function(){
    prompt.start();
    prompt.get( [ 
      { name: 'store', description: 'Store: ( The name of the Store you want to delete )' } ], function (err, result) {
      _3store.deleteStore(result.store)
      .then( function(){ console.log("Store Created Succesfully".green) } )
      .fail( function(err){ console.log("Error creating Store".red.bold); console.error(err.red); }  )
      
    });
  }
  
  _3store.promptAddToStore = function(){
    prompt.start();
    prompt.get( [ 
      { name: 'store', description: 'Store: ( The name of the Store you want to create )' },
      { name: 'app', description: 'App: ( The name of the App you want to add to the store )' },
      { name: 'version', description: 'Store: ( The version number, hit enter for latest )' } ,
      { name: 'template', description: 'Template: ( Your Custom Template, hit enter for standard )' } ], function (err, result) {
      
      _3store.storeTemplatePath = result.template;
      _3store.addAppToStore("3vot.com", result.store, result.app, result.version)
      .then( function(){ console.log("App added succesfully to Store".green) } )
      .fail( function(err){ console.log("Error creating Store".red.bold); console.error(err.red); }  )
    });
  }

  _3store.promptRemoveFromStore = function(){
    prompt.start();
    prompt.get( [ 
      { name: 'store', description: 'Store: ( The name of the Store you want to use )' },
      { name: 'app', description: 'App: ( The name of the App you want to remove from the store )' },
      { name: 'version', description: 'App: ( The version of the App you want to remove from the store )' } ], function (err, result) {
      _3store.removeAppFromStore("3vot.com", result.store, result.app, result.version )
      .then( function(store){ console.log("App removed succesfully from Store".green); } )
      .fail( function(err){ console.log("Error removing App from Store".red.bold); console.error(err); }  )
    });
  }

  // Upload App Flow
  _3store.createStore = function( storeName ){

    console.info("We will create a Store in the 3VOT Platform".yellow)
    
    var deferred = Q.defer();
    
    var Stores = Parse.Object.extend("Stores");
    store = new Stores();
    
    var config = require(Path.join( process.cwd(), "3vot.json") );
    
    _3profile.getProfileFromKey( config.key )
    .then( function(profile){ 
      console.log("Creating Store for Profile " + profile.attributes.name);
      store.set( "profile", profile.attributes.username );
      store.set( "name", storeName );
      store.set( "apps", [] );
      store.save()
      .then( 
        function(store){ deferred.resolve(store) },
        function(err){ deferred.reject(err);  } 
      )
      .fail( function(err){ deferred.reject(err);  }  );
    });
    
    return deferred.promise;
  }


  // Upload App Flow
  _3store.deleteStore = function( storeName ){

    console.info("We will create a Store in the  3VOT Platform".yellow)
    
    var deferred = Q.defer();
    
    var Stores = Parse.Object.extend("Stores");
    store = new Stores();
    
    var config = require(Path.join( process.cwd(), "3vot.json") );
    
    _3profile.getProfileFromKey( config.key )
    .then( function( foundProfile ){ return _3store._getStoreByName( storeName, foundProfile ) } )
    .then( function( stores ){ 
      stores[0].destroy()
      .then(
        function(){ deferred.resolve() },
        function(err){ deferred.reject(err) }
      )
    })
    .fail( function(err){ deferred.reject(err) } );
   
    return deferred.promise;
  }

  // Upload App Flow
   _3store.listStores = function(  ){

     console.info("We will list all Stores in the 3VOT Platform".yellow)

     var deferred = Q.defer();

     var Stores = Parse.Object.extend("Stores");
     store = new Stores();

     var config = require(Path.join( process.cwd(), "3vot.json") );

     _3profile.getProfileFromKey( config.key )
     .then( function(profile){ 
       console.info(("Looking for all Stores in " + profile.attributes.name).grey);
       
       var storeQuery = new Parse.Query(Stores);
       storeQuery.equalTo("profile", profile.attributes.username);
       storeQuery.find()
       .then(  
         function( stores ){ 
           console.info( ("\nHere are the stores we found for: " + profile.attributes.name).green);
           console.log("\n");
           stores.forEach( function(store){
              console.log(store.attributes.name.underline.yellow);
              store.attributes.apps.forEach( function(app){
                console.log(app.name.blue.bold + " v." + app.version );
              });
              console.log("\n")
           });
         
           deferred.resolve(stores);  
          },
          function( err ){ deferred.reject(err); } 
        )
       .fail( function( err ){ deferred.reject(err);  } )       
     });

     return deferred.promise;
   }

  // Upload App Flow
   _3store.addAppToStore = function( bucket, storeName, appName, appVersion ){

     console.info("We will add an App to the Store".yellow)

     var _this = this;
     var deferred = Q.defer();
     var profile = null;
     
     var config = require(Path.join( process.cwd(), "3vot.json") );

     _3profile.getProfileFromKey( config.key )
     .then( function( foundProfile ){ _this.profile = foundProfile; return _3store._getStoreByName( storeName, foundProfile ) } )
     .then( function( stores ){ _this.stores = stores; _this.store = stores[0]; return _3store._getAppByNameAndProfile( appName, _this.profile ) } )
     .then( function( packages ){ return _3store._addAppToStore(_this.store, packages[0], appVersion )  })
     .then( function( ){ return _3store.deployProfileHtml( bucket, _this.profile, _this.stores) } )
     .then( function(){ return deferred.resolve( ); } )
     .fail(  function( err ){ return deferred.reject(err);  } )       

     return deferred.promise;
   }

   // Upload App Flow
    _3store.removeAppFromStore = function( bucket, storeName, appName, version ){

      console.info("We will remove an App from the Store".yellow)

      var _this = this;
      var deferred = Q.defer();
      var profile = null;
      var store = null;
      
      var config = require(Path.join( process.cwd(), "3vot.json") );

      _3profile.getProfileFromKey( config.key )
      .then( function( foundProfile ){ _this.profile = foundProfile; return _3store._getStoreByName( storeName, foundProfile ) } )
      .then( function( stores ){ _this.stores = stores; _this.store = stores[0]; return _3store._getAppByNameAndProfile( appName, _this.profile ) } )
      .then( function( packages ){ return _3store._removeAppFromStore( _this.store, packages[0], version )  })
      .then( function( ){ return _3store.deployProfileHtml( bucket, _this.profile, _this.stores) } )
      .then( function( ){ return deferred.resolve( ); } )
      .fail(  function( err ){ return deferred.reject(err);  } )       

      return deferred.promise;
    }
   
   _3store._getStoreByName  = function(storeName, profile){
     var deferred = Q.defer();
     
    console.info("Finding Store by Name".grey)
     
     var storeQuery = new Parse.Query("Stores");
     storeQuery.equalTo("profile", profile.attributes.username);
     storeQuery.equalTo("name", storeName);
     return storeQuery.find()
   }
   
   _3store._getAppByNameAndProfile  = function( appName, profile ){
     console.info("Finding App Package by Name".grey)
     var packageQuery = new Parse.Query("Packages");
     packageQuery.equalTo("username", profile.attributes.username);
     packageQuery.equalTo("name", appName);
     return packageQuery.find()
   }
   
   _3store._addAppToStore  = function( store, pck, version){
     var deferred = Q.defer();

     console.info("Adding an App to the Store".grey)

      var app = {
        name: pck.attributes.name,
        version: version || pck.attributes.version
      };
      
       store.addUnique("apps", app);
       store.set("version", version);
       store.save()
       .then(
         function(store){ return deferred.resolve(store); } ,
         function(err){ return deferred.reject(err); }
      );

       return deferred.promise;
     }

   _3store._removeAppFromStore = function( store, pck, version ){
     var deferred = Q.defer();

     var app = {
       name: pck.attributes.name,
       version: version
     };

     console.info("Removing an App from the Store".grey)
       var count = store.attributes.apps.length;
       store.remove("apps", app);
       store.save()
       .then(
         function(store){ return deferred.resolve(store); } ,
         function(err){ return deferred.reject(err); }
      );

       return deferred.promise;
     }
     
  _3store.deployProfileHtml = function(bucket, profile, stores){
    console.info("Generating Profile HTML".grey)
    
    var deferred = Q.defer();
    
    var profileHTML = _3template.store(profile, stores, _3store.storeTemplatePath );
    var fileObject = { body: profileHTML, path: profile.attributes.username + "/index.html" , key: profile.attributes.username + "/index.html"  }
    _3upload.uploadFile(bucket, fileObject )
    .then( function(){ return deferred.resolve()  } )
    .fail( function(err){ return deferred.reject(err)  } )
    
    return deferred.promise;
  }
  
 return _3store;
})();

module.exports = _3store;