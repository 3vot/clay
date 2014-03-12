#!/usr/bin/env node

require("coffee-script")
var argv = require('optimist').argv;
var Path = require('path')
var prompt = require("prompt")
var fs = require("fs");
var Q = require("q");
var colors = require('colors');

var ProfileQ = require("../prompts/profile")

var Server = require("../src/server")

var Store = require("../prompts/store")

var App = require("../prompts/app")

var _3Model = require("3vot-model")

//_3Model.Model.host = "http://localhost:3002/v1"

_3Model.Model.host = "http://threevot-api.herokuapp.com/v1"

// *****************
// CLI
// *****************

if(argv.v){
  var pathToPackage =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../package.json');
  var pck  = require(pathToPackage);
  console.log(pck.version);
}

else if( argv._.indexOf("profile:setup") > -1 ){ ProfileQ.setup(); } 

else if( argv._.indexOf("profile:create") > -1 ){ ProfileQ.create(); }

else if( argv._.indexOf("app:create") > -1 ){ App.create(); }

else if( argv._.indexOf("app:upload") > -1 ){ App.upload(); }

else if( argv._.indexOf("app:clone") > -1 ){ App.download(); }

else if( argv._.indexOf("app:publish") > -1 ){ App.publish(); }

else if( argv._.indexOf("app:build") > -1 ){ App.build(); }

else if( argv._.indexOf("app:install") > -1 ){ App.install(); }

else if( argv._.indexOf("store:create") > -1 ){ Store.create(); }

else if( argv._.indexOf("store:destroy") > -1 ){ Store.destroy(); }

else if( argv._.indexOf("store:list") > -1 ){ Store.list(); }

else if( argv._.indexOf("store:add") > -1 ){ Store.addApp(); }

else if( argv._.indexOf("store:remove") > -1 ){ Store.removeApp(); }

else if( argv._.indexOf("store:publish") > -1 ){ Store.generate(); }

else if( argv._.indexOf("server") > -1 ){ Server.prompt(); }

else if( argv.h ){
  var pkg = require("../package.json")
  console.log("" + pkg.name + " " + pkg.version + "\n\nUsage: " + pkg.name + " [options] [command]\n\nCommands:\n\n  profile        Profile actions to setup enviroment  \n  app            Manage Application Livecycle\n  store          Manage de Appearance of the 3VOT Profile\n  server         Start the development server\n\nOptions:\n\n  -h,    output usage information\n  -v,    output the version number\n\nProfile Actions:\n  3vot profile:create        Registers a new profile in the 3VOT Platform\n  \n  3vot profile:setup         Creates the project folder and installs all dependencies.\n                              ( Windows Note: it's posible that users will need to run npm install manually )\n");
}
