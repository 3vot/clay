var Path = require("path");

function setupRoutes(app){

	app.get("/mock/:app_name/query", function(req,res){
		var query = req.query.query;
		index = query.indexOf("from ");
		var shortQuery = query.substring(index+5);
		var lastIndex = shortQuery.indexOf(" ");
		var name = shortQuery.substring(0,lastIndex);
		res.send( require( getDataPath({ params: { object: name + "s" } } ) ));
	});

	app.get("/mock/:app_name/:object", function(req,res){
		res.send(getDataPath(req))
	});

	app.post("/mock/:app_name/:object", function(req,res){
		var data = require(getDataPath(req));
		req.body.id = "ABCDE"+(Math.random() * 100000);
		data.push(req.body);
		res.send(req.body)
	});

	app.put("/mock/:app_name/:object/*", function(req,res){
		var data = require(getDataPath(req));
		var index =0;
		for (var i = 0; i < data.length; i++) {
			var item =data[i];
			if(item.id == req.body.id) index = i;
		};

		res.send(req.body);
	});

	app.del("/mock/:app_name/:object/*", function(req,res){
			var index =0;
		for (var i = 0; i < data.length; i++) {
			var item =data[i];
			if(item.id == req.body.id) index = i;
		};
		res.send(200);
	});
}

function getDataPath(req){
	var index = req.params.object.lastIndexOf("__cs");
	req.params.object = req.params.object.substring(0,index+3) 
	return Path.join("./" , "mock", req.params.object + ".json" );
}

module.exports = setupRoutes;