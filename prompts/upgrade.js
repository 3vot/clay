var prompt = require("prompt")
var LoadPackage = require("../app/utils/package_loader")

var u_3_25 = require("../app/upgrades/u_3_25.js")

function upgrade(callback){
  prompt.start();
  prompt.get( [], 
    function (err, result) {
      LoadPackage(result)  
      .then( u_3_25 )
      .then( function(){ console.log("3VOT-CLI Apps Upgraded Succesfully".green); } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){console.error(err); } )
    }
  );
}


module.exports = {
  upgrade: upgrade
}
