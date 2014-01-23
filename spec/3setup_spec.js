var assert = require("assert")
var should = require("should")

var fs = require("fs")
var _3scaffold = require("../src/setup")


var Path = require("path")

describe('3Scaffold', function(){
  
  it('sould have files', function(){

    var options= {folder: "temp", key: "key", profile: "profile" };

    _3scaffold.setup( options );
    
    var _3vot = fs.readFileSync( Path.join( process.cwd(), "tmp", "3vot.json"), "utf-8");
    var pck = fs.statSync( Path.join( process.cwd(), "tmp", "package.json"));
    var gitIgnore = fs.statSync( Path.join( process.cwd(), "tmp", ".gitignore"));

    var apps = fs.statSync( Path.join( process.cwd(), "tmp", "apps"));

    var deps = fs.statSync( Path.join( process.cwd(), "tmp", "apps" , "dependencies"));

    var tmp = fs.statSync( Path.join( process.cwd(), "tmp", "tmp"));

    _3vot = JSON.parse(_3vot);
    _3vot.key.should.equal("key");
    _3vot.profile.should.equal("profile");

    pck.isFile().should.equal(true);

    gitIgnore.isFile().should.equal(true);

    apps.isDirectory().should.equal(true);
    deps.isDirectory().should.equal(true);
    tmp.isDirectory().should.equal(true);

  });
});  