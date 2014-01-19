var _3vot = require("3vot");
var fs = require("fs");

var App = (function() {

  App.metadata = require("../package")

  document.body.innerHTML = fs.readFileSync("./apps/gold/templates/layout.html");

  function App() {
    require("../code/bootstrap");
  }

  return App;

})();

_3vot.initApp(App);