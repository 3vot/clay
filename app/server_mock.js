var Path = require("path");
var fs = require("fs")

var logPath = Path.join(process.cwd(), "mock","log.json")

function setupRoutes(app){
	//fs.writeFileSync(logPath, "{}");

	app.get("/mock/:app_name/query", function(req,res){
		var query = req.query.query;
		index = query.indexOf("from ");
		var shortQuery = query.substring(index+5);
		var lastIndex = shortQuery.indexOf(" ");
		var name = shortQuery.substring(0,lastIndex);
		setTimeout(function(){
			res.send( require( getDataPath({ params: { object: name + "s" } } ) ));			
		},500);
	});

	app.get("/mock/:app_name/:object", function(req,res){
		setTimeout(function(){
			res.send(getDataPath(req))
		},500);
	});

	app.post("/mock/:app_name/:object", function(req,res){
		var data = require(getDataPath(req));
		req.body.id = "ABCDE"+( Math.random() * 100000 );
		
		console.log("POST")
		console.dir( req.body )
		data.push(req.body);
		setTimeout(function(){
			res.send(req.body)
		},500);
	});

	app.put("/mock/:app_name/:object/*", function(req,res){
		var data = require(getDataPath(req));
		var index =0;
		for (var i = 0; i < data.length; i++) {
			var item =data[i];
			if(item.id == req.body.id) index = i;
		};
		console.log("PUT")
		console.dir( req.body )
		setTimeout(function(){
			res.send(req.body);
		});
	});

	app.del("/mock/:app_name/:object/*", function(req,res){
		var index =0;
		
		console.log("DEL")
		console.dir( req.params )
		setTimeout(function(){
			res.send(200);
		},500);
	});
}

function getDataPath(req){
	var index = req.params.object.lastIndexOf("__cs");
	if(index > -1) req.params.object = req.params.object.substring(0,index+3)
	else req.params.object = req.params.object.substring(0, req.params.object.length-1)
	return Path.join("./" , "mock", req.params.object + ".json" );
}

module.exports = setupRoutes;