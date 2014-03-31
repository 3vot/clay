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
  salesforce: null,
  target: "localhost"
}

var tempVars = {
  salesforce: null,
  package_json: null,
  pageResponse: null
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
  .then( function(){ 
    if( promptOptions.target == "production" ) return true; 
    console.log( "NOTE 1: THE FIRST TIME visit https://localhost:3000/" + promptOptions.user_name + " before using the Salesforce Visualforce Page, as localhost SSL is not trusted.") 
    return console.log( "NOTE 2: <head> is inserted to VF Page with this operation, any changes to template/head.html requires this command to be executed again.")
  })
  .then( function(){ 
    var url = tempVars.salesforce.instance_url + "/apex/" + promptOptions.app_name
    if( promptOptions.target == "localhost" ) url += "_dev"
    return console.log("App Available at: " + url) } )
  .then (function(){ return deferred.resolve() })
  .fail( function(err){ console.log(err); return deferred.reject(err) } );
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
  var head = ""
  try{ head = fs.readFileSync( headProbablePath, "utf-8") }catch(err){}
  var result = eco.render(app, { pck: tempVars.package_json, user_name: promptOptions.user_name, head: head } );
  result = Transform[promptOptions.target](result, promptOptions.user_name, promptOptions.app_name, promptOptions.domain )
  tempVars.page = result;
  
  process.nextTick(function(){ deferred.resolve(result); });
  return deferred.promise;
}

function publishPage(){
  var deferred = Q.defer();
  var name = promptOptions.app_name
  if(promptOptions.target == "localhost") name += "_dev"
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
    if( res.body.success == false && res.body[0] && res.body[0].message) return deferred.reject( "Salesforce.com rejected the upsert of a Visualforce Page with the HTML we send, it's posibly due to unvalid HTML. Please review your template files. ERROR: " + res.body[0].message )
    if( res.body.success == false ) return deferred.reject( "ERROR: " + JSON.stringify( res.body ) )
    tempVars.pageResponse = res.body
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