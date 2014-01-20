var assert = require("assert")
var should = require("should")

var fs = require("fs")
var _3scaffold = require("../3scaffold")


var Path = require("path")

describe('3Scaffold', function(){
  
  it('sould have files', function(){

    _3scaffold.setup( "tmp");
    
    var _3vot = fs.statSync( Path.join( process.cwd(), "tmp", "3vot.json"));
    var pck = fs.statSync( Path.join( process.cwd(), "tmp", "package.json"));
    var gitIgnore = fs.statSync( Path.join( process.cwd(), "tmp", ".gitignore"));

    var apps = fs.statSync( Path.join( process.cwd(), "tmp", "apps"));

    var deps = fs.statSync( Path.join( process.cwd(), "tmp", "apps" , "dependencies"));

    var tmp = fs.statSync( Path.join( process.cwd(), "tmp", "tmp"));

    _3vot.isFile().should.equal(true);

    pck.isFile().should.equal(true);

    gitIgnore.isFile().should.equal(true);

    apps.isDirectory().should.equal(true);
    deps.isDirectory().should.equal(true);
    tmp.isDirectory().should.equal(true);

  });
});  