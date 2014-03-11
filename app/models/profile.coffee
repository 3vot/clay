_3Model = require("3vot-model")

_3Ajax = require("3vot-model/lib/ajax")

Q = require("q")

class Profile extends _3Model.Model
  @configure "Profile", "user_name", "marketing", "security", "contacts"
  @extend(_3Ajax);
  @extend(_3Ajax.Auto);

  @query_key: "select id, user_name, security from profiles where security::json->>'public_dev_key' = $1"

  @queryProfile: (key) ->
    errorString = "We could not find a profile with the provided key. Check Configuration in 3vot.json";
    deferred = Q.defer();

    done= () ->
      return deferred.resolve( Profile.first() ) if( Profile.count() == 1)
      deferred.reject(errorString)

    fail= ( error ) ->        
      deferred.reject( errorString + error )

    query=
      select: Profile.query_key
      values: [key]

    Profile.fetch( { query: query }, { done: done, fail: fail }  )

    return deferred.promise;

module.exports = Profile;