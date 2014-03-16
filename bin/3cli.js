#!/usr/bin/env node

require("coffee-script/register")
var argv = require('optimist').argv;
var Path = require('path')
var prompt = require("prompt")
var fs = require("fs");
var Q = require("q");
var colors = require('colors');

var ProfileQ = require("../prompts/profile")

var Server = require("../app/actions/server")

var Store = require("../prompts/store")

var Db = require("../prompts/db")


var App = require("../prompts/app")

var _3Model = require("3vot-model")

//_3Model.Model.host = "http://localhost:3002/v1"

_3Model.Model.host = "http://threevot-api.herokuapp.com/v1"

// *****************
// CLI
// *****************
var callback = function(){
  console.log("---- 3VOT ----".bold)
}


if(argv.v){
  var pathToPackage =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../package.json');
  var pck  = require(pathToPackage);
  console.log(pck.version);
}
else if( argv.h ){
  var pkg = require("../package.json")
  console.log("" + pkg.name + " " + pkg.version + "\n\nUsage: " + pkg.name + " [options] [command]\n\nCommands:\n\n  profile        Profile actions to setup enviroment  \n  app            Manage Application Livecycle\n  store          Manage de Appearance of the 3VOT Profile\n  server         Start the development server\n\nOptions:\n\n  -h,    output usage information\n  -v,    output the version number\n  -u,    Updates your 3VOT Profile\n\nProfile Actions:\n  3vot profile:create        Registers a new profile in the 3VOT Platform\n  \n  3vot profile:setup         Creates the project folder and installs all dependencies.\n                              ( Windows Note: it's posible that users will need to run npm install manually )\n\nApp Actions\n  3vot app:create            Registers a new App on the Platform using current credits and creates folder esctru\n\n  3vot app:upload            Uploads the Code of the new app and uploads the app as a demo\n  \n  3vot app:clone             Clones an App from the 3VOT Platform Marketplace and downloads its source code\n  \n  3vot app:publish           Publishes a Demo App to your 3VOT Profile\n  \n  3vot app:build             Builds the development version of the App ( Used in manual operation )\n  \n  3vot app:install           Installs the NPM and Bower Dependencies of the App ( Used in Manual Operation )\n  \nStore Actions\n  3vot store:create          Creates a new Store in on your 3VOT Profile Page\n\n  3vot store:list            List all Stores and Apps in your 3VOT Profile\n  \n  3vot store:app:add         Adds an App to the specified store referenced by store name\n  \n  3vot store:app:remove      Removes an App from the Store\n\n  3vot store:destroy         Removes a Store from your 3VOT Profile\n  \n  3vot store:generate        Updates your 3VOT Profile with all Apps in Stores\n");
}

else{
  if(argv.u){ callback = Store.generate }
  
  if( argv._.indexOf("profile:setup") > -1 ){ ProfileQ.setup(); } 

  else if( argv._.indexOf("profile:create") > -1 ){ ProfileQ.create( Store.generate ); }

  else if( argv._.indexOf("app:create") > -1 ){ App.create(); }

  else if( argv._.indexOf("app:upload") > -1 ){ App.upload(callback); }

  else if( argv._.indexOf("app:clone") > -1 ){ App.download(); }

  else if( argv._.indexOf("app:publish") > -1 ){ 
    //if(argv.store){ callback = Store.addAutoApp(callback) }
    App.publish(callback); 
  }

  else if( argv._.indexOf("app:build") > -1 ){ App.build(); }

  else if( argv._.indexOf("app:install") > -1 ){ App.install(); }

  else if( argv._.indexOf("store:create") > -1 ){ Store.create(callback); }

  else if( argv._.indexOf("store:destroy") > -1 ){ Store.destroy(callback); }

  else if( argv._.indexOf("store:list") > -1 ){ Store.list(); }

  else if( argv._.indexOf("store:app:add") > -1 ){ Store.addApp(callback); }

  else if( argv._.indexOf("store:app:remove") > -1 ){ Store.removeApp(callback); }

  else if( argv._.indexOf("store:destroy") > -1 ){ Store.destroy(callback); }

  else if( argv._.indexOf("store:publish") > -1 ){ Store.generate(); }

  else if( argv._.indexOf("db:create") > -1 ){ Db.create(); }

  else if( argv._.indexOf("db:build") > -1 ){ Db.build(); }

  else if( argv._.indexOf("db:deploy") > -1 ){ Db.deploy(); }

  else if( argv._.indexOf("server") > -1 ){ Server.prompt(callback); }
}
