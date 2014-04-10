var Path = require("path")
var fs = require("fs")
var Q = require("q");
var crypto = require('crypto')


function hide( value, key ){
  var algorithm = 'aes-256-cbc';
  var inputEncoding = 'utf8';
  var outputEncoding = 'hex';

  var cipher = crypto.createCipher(algorithm, key);
  var ciphered = cipher.update(value, inputEncoding, outputEncoding);
  ciphered += cipher.final(outputEncoding);

  return ciphered;

}

function show( value, key ){
  var algorithm = 'aes-256-cbc';
  var inputEncoding = 'utf8';
  var outputEncoding = 'hex';

  var decipher = crypto.createDecipher(algorithm, key);
  var deciphered = decipher.update(value, outputEncoding, inputEncoding);
  deciphered += decipher.final(inputEncoding);

  return deciphered;

}

module.exports = {
  show: show,
  hide: hide
}