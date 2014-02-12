## Getting Started with 3VOT-CLI
- [If you are working ON YOUR CONSOLE](#console)
- [If you are using NITROUS.IO or cloud9](#nitrous)

	
## <a name="console"></a> Getting Started - ON YOUR CONSOLE  

### <a name="install"></a> Step 1 - Install 3vot-cli

Open the console (cmd) and install the 3VOT-CLI ( the tool to build, download and deploy apps )
```
 npm install 3vot-cli -g
```


### <a name="create"></a> Step 2 - Create a 3vot project
On your console, choose a folder to install 3vot and type:
```
 3vot setup
```

The console will ask for a Developer Key. If you don't have one yet you can use ' 0 ' for a demo.

This step will create the folder structure of a 3vot project and download all required dependencies from NPM. 

If you used the demo key ' 0 ' , setup will download a Tutorial folder also.


### <a name="download"></a> Step 3 - Downloading an app

3VOT Setup generates a project folder for your profile. In this case, the profile name is cli_test
Go inside the Test folder
```
 cd 3vot_cli_test
```

Now let’s Download the tutorial app, courtesy of 3VOT ;)
```
 3vot app:clone
```

The console will ask for the name of the app you want to download, in this case select the app:  'gold'
```
App: ( The App you want to download ):  gold
```

Then it will ask for the provider of the app, in this case is '3vot'
```
Profile: ( The profile name of the owner of the app ):  3vot 
```

Now you have a tutorial app in your folder with it's dependencies from NPM and Bower, next step is to Run it.


### Step 4 - Running the Tutorial App

Make sure you are on your Tutorial App folder '3vot_cli_test' and Run the app by typing `3vot server`
```
 3vot server
```

This will start a development server, to check the app running just point your browser to : ``http://localhost:3000/tutorial/gold``

### Step 5 - Modifying the App
Let's make changes to your app, go ahead and change the header in the following file:  ``3vot_cli_test/apps/gold/templates/layout.html``

```
...
<div class="row">
            <h1>CHANGE THIS HEADER</h1>
      <ul class="nav nav-pills nav-stacked col-md-2">
...
```

Save your changes and refresh your browser to see them.


### Step 6 - Uploading the App
If you have uploaded the app before you need to increment the version in your app's package.json file, located in `apps/gold/package.json` , this will allow you to check any running version later, if this is your first time uploading an app skip this.
```
{
	"name": "gold",
	"version": "0.0.1",
	"profile": "cli_test",
	"private": true,
	"scripts": {
		"start": "node app.js",
		"test": "grunt build --verbose"
}
```

Now Upload the app using :
```
3vot app:upload 
```
The console will ask for the name of the app you want to upload, write the name `gold` in this case.
```
App: ( the name of the app you want to upload ): gold
```
This will upload the App to your profile, you'll later be able to publish it to the world.

It will also deploy a demo of your app in ``http://demo.3vot.com/tutorial/gold_0.0.xx `` just change the last xx for the version of the app you want to check.

### Step 7 - Publishing the App

When you have a demo that you think it's a winner and want to publish it to the world just type:
```
3vot app:publish 
```

The console will ask for the name of the app you want to publish, in this case let's publish our app `gold`.
```
gold
```

You can access your published app in `3vot.com/profile/app/index.html`
```
http://3vot.com/cli_test/gold/index.html
```

And you're done!


## <a name="nitrous"></a> Getting Started - USING NITROUS.IO  


### Step 1 (On Nitrous.io) - Create a New Box

Create a New Box containing Node.Js, we'll name it `tutorial3vot`.

### Step 2 (On Nitrous.io) - Install 3vot-cli

On Nitrous console install the 3VOT-CLI ( the tool to build, download and deploy apps )
```
 npm install 3vot-cli -g
```


### Step 3 (On Nitrous.io) - Create a 3vot project
On the console, choose a folder to install 3vot and type:
```
 3vot setup
```

The console will ask for a Developer Key. If you don't have one yet you can use ' 0 ' for a demo.

This step will create the folder structure of a 3vot project and download all required dependencies from NPM. 

If you used the demo key ' 0 ' , setup will download a Tutorial folder also.


### Step 4 (On Nitrous.io) - Downloading an app

3VOT Setup generates a project folder for your profile. In this case, the profile name is cli_test
Go inside the Test folder
```
 cd 3vot_cli_test
```

Now let’s Download the tutorial app, courtesy of 3VOT ;)
```
 3vot app:clone
```

The console will ask for the name of the app you want to download, in this case select the app:  'gold'
```
App: ( The App you want to download ):  gold
```

Then it will ask for the provider of the app, in this case is '3vot'
```
Profile: ( The profile name of the owner of the app ):  3vot 
```

Now you have a tutorial app in your folder with it's dependencies from NPM and Bower, next step is to Run it.

### Step 5 (On Nitrous.io) - Running the Tutorial App


Make sure you are on your Tutorial App folder '3vot_cli_test' and Run the app by typing `3vot server`
```
 3vot server
```
The console will ask for the preview domain where you can check your app, for this just select the `Boxes` option located on the top right menu of the Nitrous IDE. 

Inside the `tutorial3vot` box we created should be the `Preview URI` address we need, use that one on the nitrous console without the `http://` or trailing slashes `/`. 

```
Example: Domain: ( If you are on nitrous.io type the preview domain with out http:// or trailing slashes / ) :  tutorial3vot-73872-use1.nitrousbox.com
```


This will start a development server, to check the app running using nitrous just point your browser to your `previewURI/profile/app` .
```
Example: tutorial3vot-73872-use1.nitrousbox.com/cli_test/gold
```
#### Step 6 (On Nitrous.io) - Modifying the App
Let's make changes to your app, go ahead and change the header in the following file:  
``
3vot_cli_test/apps/gold/templates/layout.html
``

```
...
<div class="row">
            <h1>CHANGE THIS HEADER</h1>
      <ul class="nav nav-pills nav-stacked col-md-2">
...
```

Save your changes and refresh the app in your browser to see them.


### Step 7 (On Nitrous.io) - Uploading the App
If you have uploaded the app before you need to increment the version in your app's package.json file, located in `apps/gold/package.json` , this will allow you to check any running version later, if this is your first time uploading an app skip this.
```
{
	"name": "gold",
	"version": "0.0.1",
	"profile": "cli_test",
	"private": true,
	"scripts": {
		"start": "node app.js",
		"test": "grunt build --verbose"
}
```

Now Upload the app using :
```
3vot app:upload 
```
The console will ask for the name of the app you want to upload, write the name `gold` in this case.
```
App: ( the name of the app you want to upload ): gold
```
This will upload the App to your profile, you'll later be able to publish it to the world.

It will also deploy a demo of your app in ``http://demo.3vot.com/tutorial/gold_0.0.xx `` just change the last xx for the version of the app you want to check.

### Step 8 (On Nitrous.io) - Publishing the App

When you have a demo that you think it's a winner and want to publish it to the world just type:
```
3vot app:publish 
```

The console will ask for the name of the app you want to publish, in this case let's publish our app `gold`.
```
gold
```

You can access your published app in `3vot.com/profile/app/index.html`
```
http://3vot.com/cli_test/gold/index.html
```

And you're done!


## Index


#### - [3VOT-CLI Intro](https://github.com/3vot/3vot-cli/)
#### - [Getting Started](https://github.com/3vot/3vot-cli/blob/master/gettingStarted.md)
#### - [Creating Apps and Stores](https://github.com/3vot/3vot-cli/blob/master/creatingAppsAndStores.md)


#About 3VOT 
3vot is a company that packs the best open source modules, and the industry standard best practices into a Comercial Solution that enables every organisation to build their own apps. 

3VOT is currently in Private Beta, and we'll open and account for you if you are interested.

