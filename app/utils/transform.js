var fs = require("fs")
var _3vot = require("3vot/utils")
var Path = require("path")
var placeholder = "{3vot}"
var local = "//localhost:3000";
var production = "//3vot.com"
var Log = require("3vot-cloud/utils/log")

var cheerio = require("cheerio")
var Transform = { local: toLocal, sf: toSf, index: transformIndex, _3vot: transform3VOT, production: toProduction }

//Transforms everything to Localhost
function toLocal( body, transformOptions ){
	var route = (transformOptions.host || local ) 
	body = _3vot.replaceAll(body, transformOptions.placeholder || placeholder, route);
	return body;
}

function toProduction(body, transformOptions){
	var route = ""
	if(transformOptions.package.threevot.domain ) route = transformOptions.package.threevot.domain
	else route = production + "/" + transformOptions.user.user_name + "/" + transformOptions.package.name;
	
	if(!transformOptions.promptValues.production) route += "_" + transformOptions.version
	body = _3vot.replaceAll(body, transformOptions.placeholder || placeholder, route);
	return body;
}

//Removes all {3vot} tags from internal js and css since they are not needed Static Resource uses relative paths
function toSf( body, transformOptions ){
	body = _3vot.replaceAll(body, transformOptions.placeholder || placeholder + "/", "");
	return body;
}

function injectClay(body, pck, production){
	return body;
	var cheerio = require('cheerio'),
  $ = cheerio.load(body);



	return $.xml();	
}

//Transforms Index.html into an Visualforce Page
function transformIndex(body, transformOptions, production){
	if(!transformOptions) transformOptions = {};

	if(production == null || production == undefined) production=true;
	var clay = '<script>window.clay = { path: "{!URLFOR($Resource.' + transformOptions.name + "_" + transformOptions.threevot.version + ')}" }</script>'
	if(!production) clay = '<script>window.clay = { path: "https://localhost:3000" }</script>'


	//body = _3vot.replaceAll(body, "{3vot}", "" )
	var cheerio = require('cheerio'),
  $ = cheerio.load(body,  { xmlMode: true });
	
	$('head').append(clay);

	$("link").each(function(i, elem) {
		var el = $(this)
		var url = el.attr("href");
		if(url && url.indexOf("{3vot}") > -1 ){
			url = url.replace("{3vot}", "");
			var transformed = "{!URLFOR($Resource." + transformOptions.name + "_" + transformOptions.threevot.version + ", '" +url +"')}"
			el.attr("href", transformed);
		}	
	});

	$("script").each(function(i, elem) {
		var el = $(this)
		var url = el.attr("src");
		if(url && url.indexOf("{3vot}") > -1 ){
			url = url.replace("{3vot}", "");
			var transformed = "{!URLFOR($Resource." + transformOptions.name + "_" + transformOptions.threevot.version + ", '" +url +"')}"
			el.attr("src", transformed);
			el.html(";");
		}	
	});


	return $.xml();	

}

function transform3VOT(body,transformOptions){
	if(!transformOptions) transformOptions = {}
	body = body.replace('"{3vot}/"', "window.clay.path + '/' "   );
	return body;
}

function readByType(path, transform, transformOptions){
	var body;
	var ext = Path.extname(path)
  if( path.indexOf(".js") > -1 || path.indexOf(".css") > -1 || path.indexOf(".html") > -1 || transformOptions.package.threevot.extensions.indexOf(ext) > -1 ){
  	Log.debug2("Transforming Path " + path )
  	body = fs.readFileSync(path,"utf-8")
  	if(transform) body = Transform[transform](body, transformOptions)
  }
  else body = fs.readFileSync(path)
  return body;
}

module.exports = {
	toLocal: toLocal,
	transformIndex: transformIndex,
	injectClay: injectClay,
	toSf: toSf,
	readByType: readByType
}