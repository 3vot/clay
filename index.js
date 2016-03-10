global.threevot = {}

var Path = require("path")
var Fs = require("fs")
var gulp = require('gulp');
var gutil = require('gulp-util');
var chalk = require('chalk');

var localPath = Path.join( process.cwd(), "gulpfile.js" )

var localPath = process.cwd();
var originalTaks = gulp.tasks;

var minimist = require("minimist")
var args = minimist( process.argv );

var env = "";
if( args.env ) env = "-" + args.env

try{
	require('dotenv').config({path: './.env' + env});
}catch(e){ console.warning('Could not load .env file - vars should be loaded externally') }

var p = require( Path.join( process.cwd() , "package.json" ) );

var platform = args.platform || process.env.platform;

if( platform ) process.env.NAME = platform;
if( !process.env.NAME ) process.env.NAME = p.name;


if( !process.env.DIST_FOLDER ) process.env.DIST_FOLDER = "./dist";
if( !process.env.ZIP_NAME ) process.env.ZIP_NAME = process.env.NAME;
if( !process.env.ZIP_FOLDER ) process.env.ZIP_FOLDER = process.cwd();

console.log( chalk.magenta('Welcome to CLAY by 3VOT.com') );

require("./tasks/app")
require("./tasks/dist")

