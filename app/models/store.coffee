_3Model = require("3vot-model")
_3Ajax = require("3vot-model/lib/ajax")

Q = require("q")

class Store extends _3Model.Model
  @configure "Store", "name", "profile_id", "apps", "public_dev_key", "user_name"
  @extend(_3Ajax);
  @extend(_3Ajax.Auto);


module.exports = Store;