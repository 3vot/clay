var prompt = require("prompt")
var LoadPackage = require("../app/utils/package_loader")

var Setup = require("../app/actions/profile_setup")
var Create = require("../app/actions/profile_create")
var Update = require("../app/actions/profile_update")

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
      .then( function(){ return Update(result) } )
      .then( function(){ 
        console.log("Profile Created Succesfully".green); 
        if(callback) return callback(result);
      })
      .fail( function(err){ console.log("Error creating Profile".red.bold); console.error(err); } )
  });
}

function update(callback){
  LoadPackage({})
  .then( Update )
  .then( function(){ 
    console.log("Profile Updated Succesfully".green); 
    if(callback) return callback({});
  })
  .fail( function(err){ console.log("Error creating Profile".red.bold); console.error(err); } )

}

module.exports = {
  setup: setup,
  create: create,
  update: update
}