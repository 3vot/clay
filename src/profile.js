var fs = require('fs');
var Q = require("q");
var colors = require('colors');
var Parse = require('parse').Parse;
var mime = require('mime')
var Path = require('path');
var prompt = require("prompt")

var Profile = require("./model/profile")

function prompt (){
  prompt.start();
  prompt.get( [ 
    { name: 'name', description: 'Name: ( The Official Name of your profile)' } ,
    { name: 'username', description: 'username: ( The username, that appears in the url )' }], function (err, result) {

      create(result)
      .then( function(){ console.log("Profile Created Succesfully".green) } )
      .fail( function(err){ console.log("Error creating Profile".red.bold); console.error(err.red); } )
  });
}

var promptOptions = {}

var profileObject = {}

function create( options ){
  promptOptions = options;
  console.info("We will create a Profile in the 3VOT Platform".yellow)
  var deferred = Q.defer();

  getProfile()
  .then( createProfile )
  .then( deferred.resolve )
  .fail( function(err){ deferred.reject(err); } );
  
  return deferred.promise;
  
} 
 
function getProfile(){
  var config = require(Path.join( process.cwd(), "3vot.json") );
  var deferred = Q.defer();
  Profile.findByAttributes( { "username": promptOptions.username } )
  .then( function(results){
    if(results.length !== 0){ return deferred.reject("There was a Profile already created with the username " + promptOptions.username )  }
    return deferred.resolve();
  })
  .fail( function(err){ deferred.reject(err) } )

  return deferred.promise;
}
   
function createProfile(){
  var deferred = Q.defer();
  console.info("Creating Profile".grey)
  Profile.create( { name: promptOptions.name , username: promptOptions.username  } )
  .then( function(profile){ profileObject= profile;  return deferred.resolve(profile); })
  .fail( function(err){ return deferred.reject(err); } );

  return deferred.promise;
}

module.exports = {
  prompt: prompt,
  create: create
};