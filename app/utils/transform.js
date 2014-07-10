var fs = require("fs")
var _3vot = require("3vot/utils")

var placeholder = "{3vot}"
var local = "//localhost:3000";
var production = "//3vot.com"

var Transform = { local: toLocal, sf: toSf, index: transformIndex, _3vot: transform3VOT }

//Transforms everything to Localhost
function toLocal( body, transformOptions ){
	var route = (transformOptions.host || local ) + "/" + transformOptions.app_name;
	body = _3vot.replaceAll(body, transformOptions.placeholder || placeholder, route);
	return body;
}

//Removes all {3vot} tags from internal js and css since they are not needed Static Resource uses relative paths
function toSf( body, transformOptions ){
	body = _3vot.replaceAll(body, transformOptions.placeholder || placeholder + "/", "");
	return body;
}

//Transforms Index Body to Div tags
function transformBodyToDiv(body, transformOptions){
	if(!transformOptions) transformOptions = {}
	body = _3vot.replaceAll(body, "<body ", "<div ");
	body = _3vot.replaceAll(body, "</body>", "</div>");	
	return body;
}

//Transforms Index.html into an Visualforce Page
function transformIndex(body, transformOptions){
	if(!transformOptions) transformOptions = {}
	body = _3vot.replaceAll(body, "{3vot}", "{!URLFOR($Resource." + transformOptions.name + "_" + transformOptions.threevot.version + ")}" )
	return body;
}

function transform3VOT(body,transformOptions){
	if(!transformOptions) transformOptions = {}
	body = body.replace('"{3vot}/"', "window.clay.path + '/' "   );
	return body;
}

function readByType(path, transform, transformOptions){
	var body;
  if( path.indexOf(".js") > -1 || path.indexOf(".css") > -1 || path.indexOf(".html") > -1){
  	body = fs.readFileSync(path,"utf-8")
  	if(transform) body = Transform[transform](body, transformOptions)
  }
  else body = fs.readFileSync(path)
  return body;
}

module.exports = {
	toLocal: toLocal,
	transformIndex: transformIndex,
	transformBodyToDiv: transformBodyToDiv,
	toSf: toSf,
	readByType: readByType
}