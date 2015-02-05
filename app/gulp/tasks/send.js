var gulp = require('gulp');

var request = require("superagent");

var concat = require('concat-stream');

var p  = require('../../package.json');

var mailData  = require('../../data.json');

var Q = require("q");

var fs = require("fs");

var dotenv = require("dotenv");

dotenv.load();

gulp.task('send', ['mandrill'], function (cb) {
    send()
    .then(function(res){ console.log("Message Sent Successfully.") } )
    .fail( function(err){ console.log(err) } )
});

function send(operation){
    var file = fs.readFileSync("./inline/index.html", "utf-8");

    var deferred = Q.defer();

    request.post("https://mandrillapp.com/api/1.0/messages/send-template.json")
    .send( getData() ).on('error', deferred.reject )
    .end( function(res){
    	console.log(res.body)
        
        if( res.body.status == "error" ) return deferred.reject( res.body.message );
        else if (res.error) return deferred.reject( res.error.message );
        return deferred.resolve( res.body );
    } )

    return deferred.promise;    

}

function getDataAsMergeVars(){

	var merge = []

	for( key in mailData ){
		merge.push({
			name: key,
			content: mailData[key]
		})
	}

	return merge;
}

function getData(){

	p.mandrillMessage.global_merge_vars = getDataAsMergeVars();

	return {
	    "key": process.env.MandrilKey,
	    "template_name": p.name,
	    "template_content": [
	        {
	            "name": "example name",
	            "content": "example content"
	        }
	    ],
	    "message": p.mandrillMessage
	}

}