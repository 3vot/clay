var prompt = require("prompt")
var LoadPackage = require("../app/utils/package_loader")

var Setup = require("../app/actions/profile_setup")
var Create = require("../app/actions/profile_create")


function setup(callback){
  var options = [ 
    { name: 'public_dev_key', description: 'Developer Key: ( Your Developer Key provided by the 3VOT Admin )' } 
  ];
  
  prompt.start();
  prompt.get( options, function (err, result) {
    Setup(result)
    .then( function(){ "ok" } )
    .then( function(){ if(callback) return callback(); })
    .fail( function(err){console.error(err); } );
  });
}

function create(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'name', description: 'Name: ( The Official Name of your profile)' } ,
    { name: 'user_name', description: 'username: ( The username, that appears in the url )' }, 
    { name: 'email', description: 'email: ( Your Email, required in order to administer your profile )' }],
    function (err, result) {
      Create(result)
      .then( function(options){ 
        console.log("Profile Created Succesfully".green); 
        console.log( ( "Save your developer key: " + options.public_dev_key ).bold) 
        if(callback) return callback(options);
      })
      .fail( function(err){ console.log("Error creating Profile".red.bold); console.error(err.red); } )
  });
}

module.exports = {
  setup: setup,
  create: create
}