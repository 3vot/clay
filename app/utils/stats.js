var Mixpanel = require('mixpanel');
var mixpanel = Mixpanel.init('4d24604420d4c807da161f6f85a68d52');

var Q = require("q")

var Log = require("./log")

function register(options){
  var deferred = Q.defer();
  mixpanel.people.set( options.name, { "$last_name": options.user_name, "$email": options.email } , function(err) {
    if (err) return deferred.reject(err);
    return deferred.resolve(options);
  });

  return deferred.promise;

}

function track(name, event, options){
  var deferred = Q.defer();
  if(!event) event = {}
  delete event.public_dev_key
  delete event.private_dev_key
  delete event.db
  event.distinct_id = Log.getUsername()

  mixpanel.track(name, event, function(err) {
    if(err) Log.debug( err, "utils/stats", 29 )
    deferred.resolve(event)
  });


  return deferred.promise;
}

function getIP(){
  
}

module.exports = {
  mixpanel: mixpanel,
  register: register,
  track: track
}