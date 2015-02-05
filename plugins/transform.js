var fs           =  require('fs');
var path         =  require('path');
var through      =  require('through2');
var request      =  require("superagent");
var cheerio      =  require("cheerio");
var gutil        =  require('gulp-util');
var PluginError  =  gutil.PluginError;
var Q            =  require("q");
var jsforce      = require("jsforce");
var open = require('open');


function gulpVisualforceHtml(opts){

  return through.obj(function(file, enc, callback){

    // Pass file through if:
    // - file has no contents
    // - file is a directory
    if (file.isNull() || file.isDirectory()) {
        this.push(file);
        return callback();
    }
    
    // User's should be using a compatible glob with plugin.
    // Example: gulp.src('images/**/*.{jpg,png}').pipe(watermark())
    if (['.html'].indexOf(path.extname(file.path)) === -1) {
      return callback();
    }

    // No support for streams
    if (file.isStream()) {
      throw new PluginError({
        plugin: 'R2-VFTRANSFORM',
        message: 'Streams are not supported.'
      });
      return callback();
    }

    if (file.isBuffer()) {

        transform.call(this, file, opts);
        login( process.env.SF_USERNAME,process.env.SF_PASSWORD, process.env.SF_HOST )
        .then( function(){
          upload( file, opts, callback);
        }).fail( callback )
    }
   
  });
}

function transform(file, opts){

  var clayprod = '<script>';
  clayprod += 'window._sf = { staticResource: "{!URLFOR($Resource.'+ opts.name +')}" };';
  clayprod += '\n window._sf.staticResource = window._sf.staticResource.split("?")[0]';
  clayprod +='</script></head>';

  var claylocal = '<script>';
  claylocal += 'window._sf = { staticResource: "'+ opts.host +'" };';
  claylocal += '\n window._sf.staticResource = window._sf.staticResource.split("?")[0]';
  claylocal +='</script></head>\n';

  claylocal += "<script>\n"
  claylocal += "var script = document.createElement('script');\n" 
  claylocal += "script.src = '" + opts.host + "/browser-sync/browser-sync-client.2.0.0-rc6.js';\n "
  claylocal += "document.head.appendChild(script)\n";
  claylocal += "</script>";

  var cheerio = require('cheerio'),
  $ = cheerio.load( file.contents.toString(),  { xmlMode: true });

  if( opts.host ) $("head").append( claylocal );
  else $("head").append( clayprod );

    $("link").each(function(i, elem) {
      var el = $(this)
      var url = el.attr("href");
      
      if( opts.host ){
        url = url.replace("{3vot}", opts.host);
        el.attr("href", url);
      }
      else{
        url = url.replace("{3vot}/", "");
        var transformed = "{!URLFOR($Resource." + opts.name + ", '" +url +"')}"
        el.attr("href", transformed);
      }
  
    });

    $("script").each(function(i, elem) {
      var el = $(this)
      var url = el.attr("src");
      
      if(url){
        if( opts.host ){
          url = url.replace("{3vot}", opts.host);
          el.attr("src", url);
        }
        else{
          url = url.replace("{3vot}/", "");
          if(url && url.indexOf("http") !=0  ){
            var transformed = "{!URLFOR($Resource." + opts.name + ", '" +url +"')}"
            el.attr("src", transformed);
          }
          el.html(";");
        }
      }

    });
  this.push(file);
  var page = $.html();
  page = page.replace(/&apos;/g,'"');
  file.contents = new Buffer( page );
}


function upload(  file , opts, cb ){
  var url  = process.env.INSTANCE_URL + "/services/data/v30.0/sobjects/ApexPage/Name/" + opts.name; 

  gutil.log( 'Starting', gutil.colors.cyan('Visualforce Page Upload'));

  body = {
    Markup : file.contents.toString(),
    ControllerType : 3,
    MasterLabel: opts.name,
    ApiVersion: "30.0"
  }

  var req = request.patch( url )
  .type( "application/json" )
  .set( 'Authorization', 'Bearer ' + process.env.ACCESS_TOKEN )
  .send( body )
  .end( function( err, res ){
    if( err ) return cb( err );
    if( res.body[0] && res.body[0].errorCode ) return cb( new Error("Salesforce.com rejected the upsert of a Visualforce Page with the HTML we send, it's posibly due to unvalid HTML. Please review your template files. ERROR: " + res.body[0].message ) );
    if( res.body.success == false || res.body.errorCode ) cb( new Error( "ERROR: " + JSON.stringify( res.body ) ) );
    gutil.log( 'Finished', gutil.colors.cyan('Visualforce Page Upload'));
    if(opts.open) open( process.env.INSTANCE_URL + "/apex/" + process.env.NAME  )
    cb();
  })
};

function login( username, password, host ){
  var deferred = Q.defer();
  
  if ( process.env.INSTANCE_URL ) process.nextTick( function(){ deferred.resolve() } );
  else
    gutil.log( "Starting",  gutil.colors.cyan('Login to Salesforce'));
    var username = username;
    var password = password;
    var host = host || "login.salesforce.com"

    var conn = new jsforce.Connection({
      loginUrl : 'https://' + host
    });

    conn.login( username, password, function( err, userinfo ){
      if(err) deferred.reject(err)
      else{
        process.env.INSTANCE_URL = conn.instanceUrl;
        process.env.ACCESS_TOKEN = conn.accessToken;
        deferred.resolve();
      }
    });
  return deferred.promise; 
}

module.exports = gulpVisualforceHtml;