var eco = require("eco")
var fs = require("fs")
var Path = require("path");
var http = require("http")

var layout = {};

module.exports = layout;

layout.html = function( pck, head ){
  var templatePath = Path.join(Path.dirname(fs.realpathSync(__filename)), '..' , 'templates' , "app.eco" );
  var app = fs.readFileSync( templatePath, "utf-8" )
  var result = eco.render(app, { pck: pck, head: head } );
  return result;

}

layout.store = function( profile, stores, templatePath, callback ){
  var store = ""
  console.log("trying custom template")
  store = fs.readFile( templatePath, function(err,body){
    if(err) return getDefaultTemplate();
    callback(eco.render( store, { stores: stores, profile: profile } ) );
  });

  function getDefaultTemplate(){
    var options = { host: '3vot.com', path: '/store.eco' };
    
    var callback2 = function(res) {
      res.setEncoding('utf8');
      store = ""
      res.on('data', function (chunk) {
        store += chunk;
      });
      res.on('end', function () {
        callback(eco.render( store, { stores: stores, profile: profile } ) );
      });
      
    }

    var req = http.request(options, callback2).end();

  }
}