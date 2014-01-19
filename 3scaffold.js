var bower = require("bower");

var Path = require("path")
var fs = require("fs")
var Q = require("Q");
Q.longStackSupport = true;

_3scaffold = (function() {

  function _3scaffold() {}

  _3scaffold.downloadProject= function (version){
    if(!version) version = "latest";
    console.info("Downloading 3VOT Project".yellow)
    var deferred = Q.defer();
    var s3 = new Aws.S3();
    
    var params = {Bucket: 'project.3vot.com', Key: "3vot" +  "_" + version  + '.3vot' };
    
    s3.getObject(params).createReadStream().pipe(zlib.createGunzip() ).pipe( tar.Extract( Path.join( process.cwd() ) ) );
    
    return deferred.promise;
  }

  return _3scaffold;

})();

module.exports = _3scaffold;