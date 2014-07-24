var prompt = require("prompt")
var Register = require("3vot-cloud/app/register")
var Path= require("path")
var Stats = require("3vot-cloud/utils/stats")
var Log = require("3vot-cloud/utils/log")
var Packs = require("3vot-cloud/utils/packs")
var AddUser = require("../app/actions/adduser")
var RemoveUser = require("../app/actions/removeuser")


function addUser(){
  var options = [ 
    { name: 'public_dev_key', description: '3VOT Developer Key: ( Your Public Developer Key )' } ,
    { name: 'salesforce_host', description: 'Salesforce Host: ( hit enter for login.salesforce.com )' } ,
    { name: 'salesforce_user_name', description: 'Salesforce User Name:' } ,
    { name: 'salesforce_password', hidden: true, description: 'Salesforce Password: ' } ,
    { name: 'salesforce_token', description: 'Salesforce Token' } ,
  ];
  
  prompt.start();
  prompt.get( options, function (err, result) {
    result.namespace = "clay";
    result.salesforce_host = result.salesforce_host || "login.salesforce.com"

    Packs.get(result, false)
    .then( AddUser )
    .then( function(){ Log.info("User added correctly and it's ready to use.") } )
    .then( function(){ return Stats.track("profile:adduser") } )
    .then(function(){ process.exit() })
    .fail( function(err){ Log.error(err, "./prompt/profile",43); } );
  });

}

function removeUser(){
    Packs.get({ namespace: "clay" },false)
    .then( RemoveUser )
    .then( function(){ Log.info("User removed correctly and it's ready to use.") } )
    .then( function(){ return Stats.track("profile:removeuser") } )
    .then(function(){ process.exit() })
    .fail( function(err){ Log.error(err, "./prompt/profile",43); } );
}

function listUser(){
  Packs.get({ namespace: "clay" }, false)
  .then( function(options){
    if(!options.user || !options.user.users || options.user.users.length == 0 ) return Log.info("No users found, use clay adduser")
     for(user in options.user.users){
        console.log(user );
      }
  })  
  .fail( function(err){ Log.error(err, "./prompt/profile",43); } );
}

function register(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'user_name', description: 'Profile Name: ( only lowercase letters, numbers and lowerdash _ )' }, 
    { name: 'salesforce_host', description: 'Salesforce Host: ( hit enter for login.salesforce.com )' } ,
    { name: 'salesforce_user_name', description: 'Salesforce User Name:' } ,
    { name: 'salesforce_password', hidden: true, description: 'Salesforce Password: ' } ,
    { name: 'salesforce_token', description: 'Salesforce Token' } ,
    ],
    function (err, result) {
      result.name = "";
      result.salesforce_host = result.salesforce_host || "login.salesforce.com"
      Log.setUsername(result.user_name)
      Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")
      Register(result)
      .then( function(tempVars){
        result.public_dev_key = tempVars.public_dev_key;
        result.namespace = "clay";
        return Packs.get(result, false);
      })
      .then( AddUser )
      .then( function(){
        Stats.track( "register",result )
        Log.info("3VOT created your profile and it's ready to use.")
      })
    .then(function(){ process.exit() })
    .fail( function(err){  Log.error(err, "./prompt/profile",43); });
  });
}

module.exports = {
  register: register,
  addUser: addUser,
  removeUser: removeUser,
  listUser: listUser
}