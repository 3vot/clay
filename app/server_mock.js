var Path = require("path");

function setupRoutes(app){

	app.get("/mock/:app_name/:object", function(req,res){
		res.sendfile(getDataPath(req))
	});

	app.post("/mock/:app_name/:object", function(req,res){
		var data = require(getDataPath(req));
		data.push(req.body);
		res.sendfile(Path.join("apps", req.params.app_name, "mock", req.params.object + ".json" ))
	});

	app.put("/mock/:app_name/:object", function(req,res){
		var data = require(getDataPath(req));
		var index =0;
		for (var i = 0; i < data.length; i++) {
			var item =data[i];
			if(item.id == req.body.id) index = i;
		};

		res.sendfile(Path.join("apps", req.params.app_name, "mock", req.params.object + ".json" ))
	});

	app.del("/mock/:app_name/:object", function(req,res){
			var index =0;
		for (var i = 0; i < data.length; i++) {
			var item =data[i];
			if(item.id == req.body.id) index = i;
		};

		res.send(200);
	});

}

function getDataPath(req){
	return Path.join("apps", req.params.app_name, "mock", req.params.object + ".json" );
}

module.exports = setupRoutes;