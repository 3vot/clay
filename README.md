Clay Command Line Tool
========

Command Line tool to build and Publish Web and Mobile Applications


## What is clay

Clay is used to publish pages, apps and content to the web fast and easy.

Clay can also be used to build javascript/html5 apps with a streamlined process that takes advantage of gulp plugins.

## How can I use Clay

First setup your project, then use clay and gulp plugin to automate the most repetitive tasks while building apps and finally use Clay to upload the project to the web.

## Creating an App
After registering with Clay - create and app using `clay create APP_NAME` where APP_NAME is the name of your app.

Once you are ready to `clay preview` your app - it will be available in APP_NAME.3votapp.com - where APP_NAME is the name of your app.

Then from your domain - simply create a CNAME record that points to APP_NAME.3votapp.com. Once that's done you'll be able to run apps from http://smile.cocacola.com for example.

## Gulp and Plugins
Use project http://github.com/3vot/r3_demo to setup your new project.

Gulp is optional and completely under developers control - in the end what Clay does is it gets the contents of the `dist` folder and uploads it. 



## Salesforce
Clay is useful to build Salesforce Applications based in Visualforce - it contains a set of plugins to login, run a local server, upload visualforce pages and static resources.

It operates the whole livecycle of the app from development to deployment - apps can be build like regular HTML5/Javascript apps and then published to Salesforce/Salesforce1 as Visualforce Pages.

Use project http://github.com/3vot/vf_demo to setup your new project.

## Commands

### clay
Runs the default Gulp task - is similar as running gulp.

### clay preview
Runs the `gulp dist` task if it exists and then uploads the contents of the `dist` folder into APP_NAME_stage.3votapp.com. 

The preview adds a _stage suffix to APP_NAME, this is done so we are able to have a staging sharable version.

### clay publish
Runs the `gulp dist` task if it exists and then uploads the contents of the `dist` folder into APP_NAME.3votapp.com. 

## Salesforce Commands

Salesforce commands are similar - just add the salesforce keyword

`clay salesforce` - starts local development server

`clay salesforce publish` - published contents of `dist` folder as visualforce page + static resources


## Gulp Tasks
To run a gulp task from Clay - simply type the task name after clay. `clay images` - just make sure the task's name is not salesforce, preview or publish.

## .env file
Every project needs to have a .env file - this file contains project specific information. Here is an example:
```
```

Make sure to add the `.env` file entry to `.gitignore` file on the projects root.

## .env file for Salesforce
When used in Salesforce the .env file also requires the options SF_USERNAME, SF_PASSWORD AND SF_HOST. SF_PASSWORD may include the security token right after the password.


