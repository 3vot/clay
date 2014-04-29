var http = require("http");
var Q = require("q");
var AWS = require("aws-sdk")
var fs = require("fs")
var Helpers = {}
var mime = require('mime')

var Log = require("../utils/log")

module.exports = Helpers;

Helpers.listKeys = function( sourceBucket, marker ){
  //console.log(("Listing Keys for Bucket " + sourceBucket + " and marker " + marker ).grey);
  var deferred = Q.defer();
  var allKeys = [];
  var s3 = new AWS.S3();
  s3.listObjects({Bucket: sourceBucket, Prefix: marker}, function(err, data){
    if(err) return deferred.reject(err);
    allKeys = allKeys.concat(data.Contents);
    if(data.IsTruncated)
      listObjects(data.Contents.slice(-1)[0].Key);
    else
      deferred.resolve(allKeys);
  });
  return deferred.promise;
}

Helpers.copyKey = function(destinationBucket, sourceKey, destinationKey){
  //console.log(("Copying Key to Bucket " + destinationBucket + " from " + sourceKey + ' key' + sourceKey ).grey);
  var deferred = Q.defer();

  var s3 = new AWS.S3();
  s3.copyObject({ Bucket: destinationBucket, CopySource: encodeURIComponent(sourceKey), Key: destinationKey }, function(err, data){
    if(err){ return deferred.reject(err); }
    deferred.resolve(data);
  });

  return deferred.promise;
}

//app.profile.get("username") + "/" + app.name + "/index.html"
Helpers.getObjectFromBucket = function(destinationBucket, key){
  //console.log(("Getting object from bucket " + destinationBucket + " with key " + key ).grey);

  var deferred = Q.defer();
  
  var s3 = new AWS.S3();
  var params = {  Bucket: destinationBucket , Key: key }
  
  s3.getObject(params, function(err, data){
    if(err) return deferred.reject(err);
    deferred.resolve(data.Body.toString('utf8'));
  });
  
  return deferred.promise;
}

Helpers.uploadFile = function(bucket, fileObject, deferred, count){
  // FileObjet: body , path, key, cache

  var deferred = deferred || Q.defer();
  if(!count) count = 1
  var s3 = new AWS.S3();
  var rawFile = fileObject.body || fs.readFileSync(fileObject.path)
  var mimetype = mime.lookup(fileObject.path)
  s3.putObject( { CacheControl: "max-age=" + fileObject.cache || 31536000, ContentType: mimetype , ACL: 'public-read', Body: rawFile, Key: fileObject.key , Bucket: bucket }, 
    function(err, data) {
      if (err) { 
        Log.debug("Error Uploading File: (" + count + ")"  , "aws/helpers", 69 );
        Log.debug2(err)
        Log.debug2(fileObject)
        if(count > 2){
          return deferred.reject(err); 
        }
        count++;
        Helpers.uploadFile(bucket, fileObject, deferred, count++ )
      }
      else{
        process.stdout.write(".");
        return deferred.resolve();
      } 
    }
  );
  return deferred.promise;
}


Helpers.uploadFileRaw = function(bucket, fileObject, deferred, count){
  // FileObjet: body , path, key, cache

  var deferred = deferred || Q.defer();
  if(!count) count = 1
  var s3 = new AWS.S3();
  var rawFile = fileObject.body || fs.readFileSync(fileObject.path )
  var mimetype = mime.lookup(fileObject.path)
  s3.putObject( { CacheControl: "max-age=" + fileObject.cache || 31536000, ContentType: mimetype , ACL: 'public-read', Body: rawFile, Key: fileObject.key , Bucket: bucket }, 
    function(err, data) {
      if (err) { 
        Log.debug("Error Uploading File Raw: (" + count + ")"  , "aws/helpers", 93 );
        Log.debug2(err)
        Log.debug2(fileObject)
        if(count > 2) return deferred.reject(err); 
        return Helpers.uploadFile(bucket, fileObject, deferred, count++ )
      }

      deferred.resolve();
    }
  );
  return deferred.promise;
}