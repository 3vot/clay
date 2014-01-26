var Aws = require("aws-sdk");
var Parse = require('parse').Parse;
var Path = require("path")
var fs = require("fs")
var Q = require("q");
Q.longStackSupport = true;
var prompt = require("prompt")

var _3profile = require("./3profile")
var _3upload = require("./3upload")


_3publish = (function() {

  function _3publish() {}

  _3publish.prompt = function(){
    prompt.start();
    prompt.get( [ 
      { name: 'app', description: 'App: ( The Name of the App you want to publish )' },
      { name: 'version', description: 'Version: ( The Version of the App you want to publish )' } ], function (err, result) {
        _3publish.publishApp( "demo.3vot.com", "3vot.com", result.app, result.version )
        .then( function(){ console.log("App Published Succesfully".green); } )
        .fail( function(err){ console.log("Error Publishing App"); console.error(err); })
    });
  }

  _3publish.publishApp = function(sourceBucket, destinationBucket, appName, version){
    var deferred = Q.defer();
    
    var pckPath = Path.join(process.cwd(), "apps", appName, "package.json" );

    var _this = this;
    _this.pck = require(pckPath);
    _this.profile = null;

    var config = require(Path.join( process.cwd(), "3vot.json") );
    
    _3profile.getProfileFromKey( config.key )
    .then( function( foundProfile ){ _this.profile = foundProfile; return _3publish.listKeys(sourceBucket, _this.profile.attributes.username + "/" + _this.pck.name + "_" + version ) } )
    .then( function(keys){ return _3publish.copyKeys(sourceBucket, destinationBucket, keys, version); } )
    .then( function(){  return _3publish.getObjectFromBucket(destinationBucket, _this.profile.attributes.username, _this.pck.name ) } )
    
    .then( 
      function(body){
        body = _3publish.adjustIndexToProduction(body, sourceBucket, destinationBucket);
        return _3upload.uploadFile( destinationBucket , { body: body, key: _this.profile.attributes.username + "/" + appName + "/index.html", path: sourceBucket + "/" + _this.profile.attributes.username + "/" + appName + "_" + version + "/index.html" }  ) ;
      }
    )
    .then( function(){ return deferred.resolve() } )
    .fail( function(err){ deferred.reject(err);  }  )
    return deferred.promise;

  }

  _3publish.getObjectFromBucket = function(bucket, profile, appname){
    var deferred = Q.defer();
    
    var s3 = new Aws.S3();
    var params = {  Bucket: bucket , Key: profile + "/" + appname + "/index.html" }
    
    console.log(("Getting object from bucket " + bucket + " with key " + params.Key ).grey);
    
    s3.getObject(params, function(err, data){
      if(err) return deferred.reject(err);
      deferred.resolve(data.Body.toString('utf8'));
    });
    
    return deferred.promise;
    
  }
  
  _3publish.adjustIndexToProduction = function(indexFileContents, sourceDomain, destinationDomain){
    console.log(("Adjusting Index File for Production " + sourceDomain + " to " + destinationDomain ).grey);
    indexFileContents = indexFileContents.replace(sourceDomain, destinationDomain);
    indexFileContents = indexFileContents.replace(
      "_3vot.path = '//' + _3vot.domain + '/' + package.profile + '/' + package.name + '_' + package.version;",
      "_3vot.path = '//' + _3vot.domain + '/' + package.profile + '/' + package.name;"
    );
    return indexFileContents;
  }
  
  

  _3publish.copyKeys = function(sourceBucket, destinationBucket, keys, version){
    console.log(("Copying all Keys in Bucket " + sourceBucket + " to " + destinationBucket ).grey);
    var deferred = Q.defer();

    var _this = this;
    _this.indexIndex = 0;
    _this.indexFound = false;    
    
    var indexFound = false;
     uploadPromises = []
     keys.forEach(function(key){
       if(key.Key.indexOf("index.html") == -1 && !_this.indexFound ) { _this.indexIndex++; } else if(key.Key.indexOf("index.html") > 0) { _this.indexFound = true; };
       var newKey = key.Key.replace("_" + version, "");
       uploadPromises.push( _3publish.copyKey(destinationBucket, sourceBucket + "/" + key.Key , newKey ) );
     });
     
     Q.all( uploadPromises )
     .then( function(results){ return deferred.resolve( {results: results , indexOfIndex: _this.indexIndex } ) })
     .fail( function(error){ return deferred.reject( error ) });
     
     return deferred.promise;
  }

  _3publish.copyKey = function(destinationBucket, source, key){
    console.log(("Copying Key to Bucket " + destinationBucket + " from " + source ).grey);
    var deferred = Q.defer();

    var s3 = new Aws.S3();
    s3.copyObject({ Bucket: destinationBucket, CopySource: encodeURIComponent(source), Key: key }, function(err, data){
      if(err){ return deferred.reject(err); }
      deferred.resolve(data);
    });

    return deferred.promise;
    
  }

  _3publish.listKeys = function(s3bucket, marker){
    console.log(("Listing Keys for Bucket " + s3bucket + " and marker " + marker ).grey);
    var deferred = Q.defer();
    var allKeys = [];
    var s3 = new Aws.S3();
    s3.listObjects({Bucket: s3bucket, Prefix: marker}, function(err, data){
      if(err) return deferred.reject(err);
      allKeys = allKeys.concat(data.Contents);

      if(data.IsTruncated)
        listObjects(data.Contents.slice(-1)[0].Key);
      else
        deferred.resolve(allKeys);
    });

    
    return deferred.promise;
    
  }
  
  return _3publish;

})();

module.exports = _3publish;



