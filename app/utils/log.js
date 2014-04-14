var Q = require("q");
var colors = require('colors');
var level = "DEBUG2";

//user_name is set manually or by ./package_loader
var user_name = "";

function setUsername(user_name_set){
  user_name = user_name_set;
}

function getUsername(){
  return user_name;
}


function setLevel(levelSet){
  level = levelSet;
}

function getLevel(){
  var value = 0;
  if( level == "DEBUG2" ) return 4;
  else if( level == "DEBUG" ) return 3;
  else if( level == "INFO" ) return 2;
  else if( level == "ERROR" ) return 1;
}

function info(message){
  if( getLevel() < 2   ) return false
  console.log( message.green )
}

function warning(message){
  console.log( message.yellow )
}

function debug(message, location, line){
  if( !location) location = "undefined, please define where error occured"
  if( getLevel() < 3  ) return false
  console.log( ("DEBUG: " + location + ":" + line ).yellow.bold)
  console.log( message )
  console.log( "" )
}

function debug2(message){
  if( getLevel() < 4  ) return false
  console.log("DEBUG2:".yellow.bold)
  if(!message) console.log("Debug Element is undefined")
  console.log( message.stack || message )
}

function error(message, location, line){

  var stringError = ""
  try{
    
    console.log("We encountered an error and must stop 3vot, sorry :=(".red)

    //comes from DB or external source in JSON
    if( typeof(message) === "string" ) {
      if(message.indexOf("{") == 0 ){ 
        warning( translateError(message) );
        message = JSON.parse(message);
        debug(message.message, location, line)
        debug2(message)
        errorObject = { message: message.message, fileName: location , lineNumber: line }
      }
      else{
        warning( translateError(message) );
        debug( message, location, line )    
        errorObject = { message: message, fileName: location , lineNumber: line }
      }
    }
    //Internet Error
    else if(getLevel() < 3 && message.stack && message.stack.indexOf("ENOTFOUND") && message.stack.indexOf("ETIMEDOUT")  || message.stack.indexOf("ECONNREFUSED") > -1 || message.stack.indexOf("ECONNRESET") > -1 ) {
      return console.log("Internet Connection Error, please check you are connected to the internet".bold.red)
    }
    else if( message.stack ){
      // JS Error
      var error  = message;
      warning( translateError(message.message) );
      if(error.message) debug(error.message, error.fileName, error.lineNumber )
      if(error.stack) debug2(error.stack) 
      errorObject = error
    }
    else{
      warning( translateError( message.toString() ));
      errorObject = { message: message.toString() , fileName: location , lineNumber: line }
      debug(message, location, line )
    }
  }catch(e){
    debug("Other Error Style", location, line)
    debug2(e)
    warning(message)
    debug2(message)
    errorObject = { message: message.toString() , fileName: location , lineNumber: line }
  }
  
  recordError(errorObject)  
}

function translateError(error){
  if( error.indexOf("profile_credits_to_reload_can_not_be_below_cero") > -1 ) return "Oh Oh, Your account does not have enought credits, please buy more credits in 3vot.com and try again".bold.underline
  if( error.indexOf("EEXIST") > -1 ) return "Oh Oh, That name is already in use, please try another...".bold.underline
  if( error.indexOf("uglifyify") > -1 ) return "Oh Oh, Project outdated please run: npm install uglifyify --save".bold.underline
  if( error.indexOf("invalid_grant") > -1 ) return "Oh Oh, Your credentials were not accepted by salesforce".bold.underline
  if( error.indexOf("profile_user_name_found") > -1) return "Oh Oh,  the username you typed is already in use, please try again"
  if( error.indexOf("Error: Profile Name") > -1) return "Oh Oh, usernames can only use only Letters, Numbers and Hypens( - )"
  
 

  return "Unidentified Error: " + error
}

function recordError(errorObject,callback){
  errorObject.distinct_id = getUsername();
  
  Stat.mixpanel.track("error", errorObject, function(err){
    if(err){
      info("Not able to register error on 3VOT Server");
      debug(err)
    }
    if(callback) callback()
  })
}

module.exports = {
  setLevel: setLevel,
  getLevel: getLevel,
  info: info,
  debug: debug,
  debug2: debug2,
  error: error,
  setUsername: setUsername,
  getUsername: getUsername,
  recordError: recordError
}

var Stat = require("./stats")