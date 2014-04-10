var prompt = require("prompt")
var LoadPackage = require("../app/utils/package_loader")

var u_3_25 = require("../app/upgrades/u_3_25.js")

var Log = require("../app/utils/log")

function upgrade(callback){
  prompt.start();
  prompt.get( [], 
    function (err, result) {
      LoadPackage(result)  
      .then( u_3_25 )
      .then( function(){ Log.info("3VOT  Apps Upgraded Succesfully"); } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){ Log.error(err, "prompts/upgrade", 16 ); } )
    }
  );
}


module.exports = {
  upgrade: upgrade
}
