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

var Template = require("./template")

var AwsCredentials = require("./aws/credentials");
var AwsHelpers = require("./aws/helpers");

var Profile = require("./model/profile")
var Package = require("./model/package")
var Store = require("./model/store")


// *****************
// CLI
// *****************
var Stores;

Stores = (function(){

  Stores.storeTemplatePath= Path.join(Path.dirname(fs.realpathSync(__filename)), '..' , 'templates' , "store.eco" );
  Stores.destinationBucket = "3vot.com"


  Stores.promptCreate = function(){
    prompt.start();
    prompt.get( [ 
      { name: 'name', description: 'Store: ( The name of the Store you want to create )' } ], function (err, result) {
      Stores.createStore(result)
      .then( function(){ console.log("Store Created Succesfully".green) } )
      .fail( function(err){ console.log("Error creating Stores".red.bold); console.error(err.red); }  )
    });
  }
  
  Stores.promptList = function(){
    Stores.listStores( {} )
    .then( function(){ console.log("Store Created Succesfully".green) } )
    .fail( function(err){ console.log("Error creating Stores".red.bold); console.error(err.red); }  )

  }
  
  Stores.promptDelete = function(){
    prompt.start();
    prompt.get( [ 
      { name: 'name', description: 'Stores: ( The name of the Stores you want to delete )' } ], function (err, result) {
      Stores.destroyStore(result)
      .then( function(){ console.log("Stores Created Succesfully".green) } )
      .fail( function(err){ console.log("Error creating Stores".red.bold); console.error(err.red); }  )
    });
  }
  
  Stores.promptAddToStore = function(){
    prompt.start();
    prompt.get( [ 
      { name: 'name', description: 'Stores: ( The name of the Store you want to use )' },
      { name: 'appName', description: 'App: ( The name of the App you want to add to the store )' },
      { name: 'template', description: 'Template: ( Your Custom Template, hit enter for standard )' } ], function (err, result) {
      
      if(result.template) Stores.storeTemplatePath = result.template;
      Stores.addAppToStore(result)
      .then( function(){ console.log("App added succesfully to Stores".green) } )
      .fail( function(err){ console.log("Error creating Stores".red.bold); console.error(err); }  )
    });
  }

  Stores.promptRemoveFromStore = function(){
    prompt.start();
    prompt.get( [ 
      { name: 'name', description: 'Store: ( The name of the Store you want to use )' },
      { name: 'appName', description: 'App: ( The name of the App you want to remove from the store )' } ], function (err, result) {
      
      Stores.removeAppFromStore(result)
      .then( function(store){ console.log("App removed succesfully from Store".green); } )
      .fail( function(err){ console.log("Error removing App from Store".red.bold); console.error(err); }  )
    });
  }

  Stores.createStore = function( options ){
    console.info("We will create a Store in the 3VOT Platform".yellow)
    var deferred = Q.defer();
    
    var storeController = new Stores( options )

    storeController.getProfile()
    .then( storeController.createStore )
    .then( deferred.resolve )
    .fail( function(err){ deferred.reject(err); } );
    
    return deferred.promise;
  }

  // Upload App Flow
  Stores.destroyStore = function( options ){
    console.info("We will delete a Store in the 3VOT Platform".yellow)
    var deferred = Q.defer();
    
    var storeController = new Stores( options )

    storeController.getProfile()
    .then( storeController.getStoreByName )
    .then( storeController.destroyStore )
    .then( deferred.resolve )
    .fail( function(err){ deferred.reject(err); } );
    
    return deferred.promise;
  }

  // Upload App Flow
  Stores.listStores = function( options  ){
    console.info("We will list all Store in the 3VOT Platform".yellow)

    var deferred = Q.defer();
    var storeController = new Stores( options )

    storeController.getProfile()
    .then( storeController.getStoresByUsername )
    .then( storeController.printStores )
    .then( deferred.resolve  )
    .fail( function(err){ deferred.reject(err); } )

     return deferred.promise;
   }

  // Upload App Flow
   Stores.addAppToStore = function( options ){
     console.info("We will add an App to the Store".yellow)
     var deferred = Q.defer();
     var storeController = new Stores( options )

     storeController.getProfile()
     .then( AwsCredentials.requestKeysFromProfile )
     .then( storeController.getStoreByName )
     .then( storeController.getStoresByUsername )
     .then( storeController.getAppByNameAndProfile )
     .then( storeController.addAppToStore )
     .then( storeController.deployProfileHtml )
     .then( storeController.uploadProfileHtml )
     .then( deferred.resolve )
     .fail(  function( err ){ return deferred.reject(err);  } )       

     return deferred.promise;
   }

   // Upload App Flow
   Stores.removeAppFromStore = function( options ){
     console.info("We will remove an App to the Store".yellow)
     var deferred = Q.defer();
     var storeController = new Stores( options )
     
     storeController.getProfile()
     .then( AwsCredentials.requestKeysFromProfile )
     .then( storeController.getStoreByName )
     .then( storeController.getStoresByUsername )
     .then( storeController.getAppByNameAndProfile )
     .then( storeController.removeAppFromStore )
     .then( storeController.deployProfileHtml )
     .then( storeController.uploadProfileHtml )
     .then( deferred.resolve )
     .fail(  function( err ){ return deferred.reject(err);  } )       

     return deferred.promise;
     
    }
   
 ////////
  // *****************************
  // INSTANCE STARTS HERE
  // *****************************
////////

     
    var store = {};

    function Stores( options ){
      store = options;
    } 
  
  Stores.prototype.getProfile= function(){
    var config = require(Path.join( process.cwd(), "3vot.json") );
    var deferred = Q.defer();
    Profile.findByAttributes( { "public_dev_key": config.key } )
    .then( function(results){
      if(results.length === 0){ return deferred.reject("We could not find a profile with the provided key. Check Configuration in 3vot.json")  }
      store.profile = results[0];
      store.username = store.profile.get("username")
      
      return deferred.resolve( store.profile );
    })
    .fail( function(err){ deferred.reject(err) } )

    return deferred.promise;
  }
   
  Stores.prototype.createStore = function(){
    var deferred = Q.defer();
    console.info("Creating Store".grey)
    Store.create( { profile: store.profile.get("username"), name: store.name, apps: []  } )
    .then( function(store){ store.packageData = store; return deferred.resolve(); } )
    .fail( function(err){ deferred.reject(err); } );

    return deferred.promise;
  }
  
  
  Stores.prototype.destroyStore = function(){
    var deferred = Q.defer();
    console.info("Destroying Store".grey)
     
    Store.destroy( store.packageData )
    .then( function(){ return deferred.resolve() } )
    .fail( function(err){ return deferred.reject(err); } );

    return deferred.promise;
  }
  
  
   Stores.prototype.getStoreByName = function(){
     var deferred = Q.defer();
     console.info("Finding Stores by Name".grey)
     
     Store.findByAttributes( { profile: store.profile.get("username"), name: store.name  } )
     .then( function(results){ store.packageData = results[0]; deferred.resolve(results[0]) } )
     .fail( function(err){ deferred.reject(err); } );

     return deferred.promise;
   }
   
   
   Stores.prototype.getStoresByUsername = function(){
     var deferred = Q.defer();
     console.info("Finding Stores by Username".grey)
     Store.findByAttributes( { profile: store.profile.get("username") } )
     .then( function(results){ store.list = results; deferred.resolve( results ) } )
     .fail( function(err){ deferred.reject(err); } );

     return deferred.promise;
   }
   
   Stores.prototype.printStores = function(){
     console.info( ("\nHere are the stores we found for: " + store.profile.get("name")).green);
     console.log("\n");
     store.list.forEach( function(store){
       console.log(store.get("name").underline.yellow);
       store.get("apps").forEach( 
       function(app){
         console.log(app.name.blue.bold + " v." + app.version );
        }
      );
      console.log("\n")
     });
   }
   
   Stores.prototype.getAppByNameAndProfile  = function( appName, profile ){
     console.info("Finding App Package by Name".grey)
     var deferred = Q.defer();
     Package.findByAttributes( { username: store.profile.get("username"), name: store.appName  } )
     .then( function(results){ if(results.length === 0){ return deferred.reject("App not found"); } store.app = results[0]; deferred.resolve( results[0] ) } )
     .fail( function(err){ deferred.reject(err); } );
     return deferred.promise;
   }
   
   Stores.prototype.addAppToStore  = function(){
     var deferred = Q.defer();
     console.info("Adding an App to the Store".grey)


     var app = {
       name: store.appName,
       version: store.app.get("versionPublished")
     };

     store.packageData.addUnique("apps", app);
     store.packageData.set("version", store.appVersion);

     Store.save(store.packageData)
     .then( function(store){ store.packageData = store; return deferred.resolve(store); } )
     .fail( function(err){ return deferred.reject(err); } );

     return deferred.promise;
   }

   Stores.prototype.removeAppFromStore = function(  ){
     var deferred = Q.defer();

     var app = {
       name: store.appName,
       version: store.app.get("versionPublished")
     };

     store.packageData.remove("apps", app);
    
     Store.save(store.packageData)
     .then( function(store){ store.packageData = store; return deferred.resolve(store); } )
     .fail( function(err){ return deferred.reject(err); } );
    
     return deferred.promise;
    }
     
  Stores.prototype.deployProfileHtml = function(){
    console.info("Generating Profile HTML".grey)
    console.log( Stores.storeTemplatePath );
    
    var profileHTML = Template.store(store.profile, store.list, Stores.storeTemplatePath );

    store.indexFileObject = { 
      body: profileHTML, 
      path: store.profile.get("username") + "/index.html", 
      key: store.profile.get("username") + "/index.html"  
    }
  
    return true;
  }
  
  Stores.prototype.uploadProfileHtml = function(){
    console.info("Uploading Profile HTML".grey)
    
    var deferred = Q.defer();
    
    AwsHelpers.uploadFile( Stores.destinationBucket , store.indexFileObject )
    .then( function(){ return deferred.resolve()  } )
    .fail( function(err){ return deferred.reject(err)  } );
    
    return deferred.promise;
  }
  
 return Stores;
})();

module.exports = Stores;