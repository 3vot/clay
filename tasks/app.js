var Request    =   require("superagent");
var Q = require("q");
var Path = require("path")
var fs = require("fs");
var path = Path.join( process.cwd(), "package.json" );

function App(){

}

App.create = function( app_name ){

  var deferred = Q.defer();
	 Request.post( "https://clay.secure.force.com/api/services/apexrest/clay-api" )
  .set('Accept', 'application/json')
  .type('application/json')
  .send( { "dev_code" : process.env.CLAY_CODE, "app_name" : app_name } )

  .end(function(res){
    if( res.status > 200 ) return deferred.reject(res.text );
    var p;

    if( !fs.existsSync(path) ){
      p = { name: app_name, version: "0.0.1" }
    }
    else{
      delete require.cache[require.resolve( path )]
      p  =  require( path );
      if( p.name != app_name ) p.name = app_name;
    }

    fs.writeFile(path, JSON.stringify(p, null, 4), function(err) {
      if(err) deferred.reject(err)
      else deferred.resolve( res.body ) 
    });

  });

  return deferred.promise;
}

App.check = function(app_name){

  var deferred = Q.defer();
  Request.get( "https://clay.secure.force.com/api/services/apexrest/clay-api" )
  .set('Accept', 'application/json')
  .type('application/json')
  .type('application/json')
  .query("dev_code="+ process.env.CLAY_CODE )
  .query("app_name="+ process.env.NAME )

  .end(function(res){
    if( res.status > 200 ) return deferred.reject(res.text );
    deferred.resolve( res.body )
  });

  return deferred.promise;

}

module.exports = App;