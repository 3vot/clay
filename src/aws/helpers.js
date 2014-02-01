var http = require("http");
var Q = require("q");
var AWS = require("aws-sdk")
var fs = require("fs")
var Helpers = {}
var mime = require('mime')


module.exports = Helpers;


Helpers.listKeys = function( sourceBucket, marker ){
  console.log(("Listing Keys for Bucket " + sourceBucket + " and marker " + marker ).grey);
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
  console.log(("Copying Key to Bucket " + destinationBucket + " from " + sourceKey ).grey);
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
  console.log(("Getting object from bucket " + destinationBucket + " with key " + key ).grey);

  var deferred = Q.defer();
  
  var s3 = new AWS.S3();
  var params = {  Bucket: destinationBucket , Key: key }
  
  s3.getObject(params, function(err, data){
    if(err) return deferred.reject(err);
    deferred.resolve(data.Body.toString('utf8'));
  });
  
  return deferred.promise;
  
}

Helpers.uploadFile = function(bucket, fileObject){
  // FileObjet: body , path, key, cache
  
  var deferred = Q.defer();
  var s3 = new AWS.S3();
  var rawFile = fileObject.body || fs.readFileSync(fileObject.path, "utf-8")
  var mimetype = mime.lookup(fileObject.path)
  s3.putObject( { CacheControl: "max-age=" + fileObject.cache || 31536000, ContentType: mimetype , ACL: 'public-read', Body: rawFile, Key: fileObject.key , Bucket: bucket }, 
    function(err, data) {
      if (err) { console.error("Error Uploading File: " + err); return deferred.reject(err); }
      console.info( ( "File Uploaded Correctly: " + fileObject.path + " to " + fileObject.key ).green );
      deferred.resolve();
    }
  );
  return deferred.promise;
}
