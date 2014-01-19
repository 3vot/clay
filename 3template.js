var layout = {};

module.exports = layout;

layout.html = function( pck ){

  var html= '<html> <head> <link  rel="stylesheet" type="text/css" href="//netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css" />    </head> <body>';
  html += '<div class="responsiveCheckWrapper"><div data-device="phone" class="visible-xs responsiveCheck">a</div><div data-device="tablet" class="visible-sm responsiveCheck">a</div><div data-device="laptop" class="visible-md responsiveCheck">a </div><div data-device="desktop" class="visible-lg responsiveCheck">a</div></div>' ;
  html += '<script id="loadarea" type="text/javascript"></script>';
  html += "<script>\n var package = " + pck + ";\n";
  html += "var _3vot = {}; "; 
  html += 'var entries = package.threevot.entries; \n';
  html += 'var responsiveDivs = document.getElementsByClassName("responsiveCheck");\n';
  html += '_3vot.device = "";\n' ;
  html += 'for(var i=0; i<responsiveDivs.length; i++){ var style = getComputedStyle( responsiveDivs[i] ); if(style.display==="block"){ _3vot.device = responsiveDivs[i].dataset.device; }   }'
  html += "var fileToCall = '';"
  html += "_3vot.domain = 'demo.3vot.com';"
  html += "_3vot.path = '//' + _3vot.domain + '/' + package.profile + '/' + package.name;";
  html += 'for(entryKey in entries){ var entryValue = entries[entryKey]; if(entryValue.indexOf(_3vot.device) > -1){ fileToCall = entryKey }  }'
  html += "document.getElementById('loadarea').src=  _3vot.path + '/' + fileToCall + '.js';";
  html += 'console.log(fileToCall)';  
  html += '</script>';
  html += '</body> </html>';

  return html;

}