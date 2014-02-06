var eco = require("eco")
var fs = require("fs")
var Path = require("path");

var layout = {};

module.exports = layout;

layout.html = function( pck, head ){
  var templatePath = Path.join(Path.dirname(fs.realpathSync(__filename)), '..' , 'templates' , "app.eco" );
  var app = fs.readFileSync( templatePath, "utf-8" )
  var result = eco.render(app, { pck: pck, head: head } );
  return result;

}

layout.store = function( profile, stores, templatePath ){
  
  var store = fs.readFileSync( templatePath, "utf-8" )
  var result = eco.render( store, { stores: stores, profile: profile } );

  return result;
  
}