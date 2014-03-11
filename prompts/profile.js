var prompt = require("prompt")
var LoadPackage = require("../app/utils/package_loader")

var setup = require("../app/actions/profile_setup")
var create = require("../app/actions/profile_create")


function setup(){
  var options = [ 
    { name: 'key', description: 'Developer Key: ( Your Developer Key provided by the 3VOT Admin )' } 
  ];
  
  prompt.start();
  prompt.get( options, function (err, result) {
    setup( result )
    .then( function(){ "ok" } )
    .fail( function(err){console.error(err); } );
  });
}

function create(){
  prompt.start();
  prompt.get( [ 
    { name: 'name', description: 'Name: ( The Official Name of your profile)' } ,
    { name: 'user_name', description: 'username: ( The username, that appears in the url )' }, 
    { name: 'email', description: 'email: ( Your Email, required in order to administer your profile )' }],
    function (err, result) {
      create(result)
      .then( function(profile){ console.log("Profile Created Succesfully".green); console.log( ( "Save your developer key: " + profile.get("public_dev_key") ).bold) } )
      .fail( function(err){ console.log("Error creating Profile".red.bold); console.error(err.red); } )
  });
}

module.exports = {
  setup: setup,
  create: create
}