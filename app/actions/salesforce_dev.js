var Path = require("path")
var fs = require("fs")
var Q = require("q");
var crypto = require('crypto')
var request = require("superagent")
var eco = require("eco")

var Transform = require("../utils/transform")

var promptOptions = {
  public_dev_key: null,
  user_name: null,
  app_name: null,
  salesforce: null
}

var tempVars = {
  salesforce: null,
  package_json: null
}

function execute(options){
  var deferred = Q.defer();
  promptOptions = options;
  
  tempVars.package_json = require( Path.join( process.cwd(), "apps", promptOptions.app_name, "package.json" )  );
  
  values("username")
  values("password")
  values("key")

  login()
  .then( renderPage )
  .then( publishPage )
  .then (function(){ return deferred.resolve() })
  .fail( function(err){ return deferred.reject(err) } );
  return deferred.promise;
}

function login(){
  var deferred = Q.defer();
  
  var url = "https://login.salesforce.com/services/oauth2/token";
  body = {
    grant_type: "password",
    client_id: "3MVG9A2kN3Bn17hvlSRXnnVzjDNILmhSt.TZ.MgCe5mAt9XKFYDQV5FCMKm6cpHhbVmTQArgicRUt7zzcWMhQ",
    client_secret: "256153260162134490",
    username: "dev.one@3vot.com",
    password: "3vot3vot1Q4ScTdymTlNoZr6pnyglCha8G"
  }
  var req = request.post(url).type("application/x-www-form-urlencoded").send(body)
  req.end(function(err,res){
    if(err) return deferred.reject(err)
    tempVars.salesforce = JSON.parse(res.text)
    deferred.resolve(tempVars.salesforce)
  })

  return deferred.promise;
}

function renderPage(){
  var deferred = Q.defer();
  var templatePath = Path.join(Path.dirname(fs.realpathSync(__filename)), '..' , ".." , 'templates',"salesforce" , "page.eco" );
  var app = fs.readFileSync( templatePath, "utf-8" )
  
  var headProbablePath = Path.join( process.cwd(), "apps", promptOptions.app_name, "templates","head.html" );
  var head = fs.readFileSync( headProbablePath, "utf-8")
  var result = eco.render(app, { pck: tempVars.package_json, user_name: promptOptions.user_name, head: head } );
  result = Transform.localhost(result, promptOptions.user_name, promptOptions.app_name, promptOptions.domain )
  tempVars.page = result;
  
  process.nextTick(function(){ deferred.resolve(result); });
  return deferred.promise;
}

function publishPage(){
  var deferred = Q.defer();
  var name = promptOptions.app_name + "_dev"
  var url = tempVars.salesforce.instance_url + "/services/data/v29.0/sobjects/ApexPage/Name/" + name;
  
  body = {
    Markup : tempVars.page,
    ControllerType : 3,
    MasterLabel: name,
    ApiVersion: "29.0"
  }
  var req = request.patch(url)
  .type("application/json")
  .set('Authorization', 'Bearer ' + tempVars.salesforce.access_token )
  .send(body)
  
  req.end(function(err,res){
    if(err) return deferred.reject(err)
    deferred.resolve(res.body)
  })

  return deferred.promise; 
}

function values( key ){
  var decipher = crypto.createDecipher("aes192", promptOptions.public_dev_key + "_" + "aes192")
  decipher.update(promptOptions.salesforce[key], "hex", "binary")
  promptOptions.salesforce[key] = decipher.final("binary")
}

module.exports = execute;