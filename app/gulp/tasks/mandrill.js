var gulp = require('gulp');

var request = require("superagent");

var concat = require('concat-stream');

var p  = require('../../package.json');

var Q = require("q");

var fs = require("fs");

var dotenv = require("dotenv");

dotenv.load();

gulp.task('mandrill', ['inline'], function (cb) {
  
    testExistance()
    .then( uploadTemplate )
    .then(function(){ console.log("Template " + p.name + " uploaded.") } )
    .fail( function(err){ console.log(err) } )

});

function uploadTemplate(operation){

    var file = fs.readFileSync("./inline/index.html", "utf-8");

    var deferred = Q.defer();

    request.post("https://mandrillapp.com/api/1.0/templates/"+ operation +".json")
    .send( {
        key: process.env.MandrilKey,
        name: p.name,
        code: file
    } ).on('error', deferred.reject )
    .end( function(res){
        
        if(res.body.code == 5 ) return deferred.resolve( "add" );
        else if( res.body.status == "error" ) return deferred.reject( res.body.message );
        else if (res.error) return deferred.reject( res.error.message );
        return deferred.resolve("update");
    } )

    return deferred.promise;    

}

function testExistance(){
    var deferred = Q.defer();

    request.post("https://mandrillapp.com/api/1.0/templates/info.json")
    .send( {
    "key": process.env.MandrilKey,
    "name": p.name
    } ).on('error', deferred.reject )
    .end( function(res){
        
        if(res.body.code == 5 ) return deferred.resolve( "add" );
        else if( res.body.status == "error" ) return deferred.reject( res.body.message );
        else if (res.error) return deferred.reject( res.error.message );
        return deferred.resolve("update");
    } )

    return deferred.promise;
}