_3Model = require("3vot-model")
_3Ajax = require("3vot-model/lib/ajax")

class App extends _3Model.Model
  @configure "App", "name", "billing", "marketing", "version" ,"user_name", "public_dev_key" 
  @extend(_3Ajax);
  @extend(_3Ajax.Auto);

  @querySimpleByName = "select id,sales,version,name from apps where name = $1"
  
  @querySimpleByNameAndProfileSecurity = "select apps.id,apps.sales,apps.name, apps.version from apps
   inner join profiles on (apps.profile_id = profiles.id) 
   where profiles.user_name = $1  and apps.name =  $2"


module.exports = App;