var request = require("superagent")
var parseString = require("xml2js").parseString

var fs = require("fs")

var zip = fs.readFileSync(__dirname + '/js.zip');

var zip64 =  new Buffer(zip).toString('base64');

var result;




login();

function upload(result){

var parts = result.serverUrl[0].split("/")
var url = parts[0]  + '//' + parts[2] + '/services/data/v30.0/tooling/sobjects/StaticResource/'

request.post(url)
.set('Authorization', 'Bearer ' + result.sessionId)
.set('Content-Type', 'application/json')
.send({ 'Name': "test1", Body: zip64, ContentType: "application/zip", CacheControl: "Public"  })

.end(function(err,res){
	console.log(res.body)
});

}

function login(){

	var txt = '<?xml version="1.0" encoding="utf-8" ?><env:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/"><env:Body><n1:login xmlns:n1="urn:partner.soap.sforce.com"><n1:username>one@94demo.com</n1:username><n1:password>3vot3votjL1t0cZurJWSDgJeLbYXx4mO3</n1:password></n1:login></env:Body></env:Envelope>';

request.post("https://login.salesforce.com/services/Soap/u/30.0")
.set('SOAPAction', 'login')
.set('Content-Type', 'text/xml')
.send(txt)
.end(function(err,res){
	
	parseString(res.text, function (err, result) {
		result = result["soapenv:Envelope"]["soapenv:Body"][0].loginResponse[0].result[0];
		//console.log(result)
		upload(result)
});


})

}



//curl https://login.salesforce.com/services/Soap/u/30.0 -H "Content-Type: text/xml; charset=UTF-8" -H "SOAPAction: login" -d @login.txt
