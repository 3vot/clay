#3VOT-CLI

3VOT helps you build and deploy apps quicker. We call it Frontend as a Service.

You can build apps with any javascript framework and style them the best way you can. 

3VOT embraces the concept of modules and web components, you can re-use any component from NPM and Bower. It's an amazing way to build Quality Apps in a few days, that's 5x faster.

3VOT is also a community so you can simply copy an app for free, to your profile and start using as you own; or make a few changes to make it a perfect fit. Developers and Entrepreneurs can also build, customize and sell you amazing apps;

Here is the Information for the Developer to get started, but even if you are not a developer: give it a try.


<iframe width="560" height="315" src="//www.youtube.com/embed/Tcf_FBbIRpM?rel=0" frameborder="0" allowfullscreen></iframe>

#### Requirements

- [NodeJS](http://nodejs.org/)

#### Index
- [1- Install 3VOT CLI](#install)
- [2- Create a 3VOT project](#create)
- [3- Downloading an App](#download) 
- [4- Running the Tutorial App](#run) 
- [5- Modifying the App](#modify)
- [6- Uploading the App](#upload)
- [7- Publishing the App](#publish)
- [8- Create a new App](#create)
- [9- Run, Upload and Publish again](#run2)
- [10- Creating a new Store](#createStore)
- [11- Listing Stores](#list)
- [12- Adding Apps to a Store](#add)
- [13- Removing an app from a store](#remove)
- [14- Deleting a store](#delete)


### <a name="install"></a> Step 1 - Install 3vot-cli

Open the console (cmd) and install the 3vot-cli ( the tool to build, download and deploy apps )
```
 npm install 3vot-cli -g
```


### <a name="create"></a> Step 2 - Create a 3VOT project
On your console, choose a folder to install 3vot and type:
```
 3vot setup
```

The console will ask for a Developer Key. If you don't have one yet you can use ' 0 ' for a demo.

This step will create the folder structure of a 3VOT project and download all required dependencies from NPM. 

If you used the demo key ' 0 ' , setup will download a Tutorial folder also.


### <a name="download"></a> Step 3 - Downloading an App

`3vot setup` generates a project folder for your profile. In this case, the profile name is cli_test
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


### <a name="run"></a> Step 4 - Running the Tutorial App

Make sure you are on your Tutorial App folder '3vot_cli_test' and Run the app by typing `3vot server`
```
 3vot server
```

This will start a development server, to check the app running just point your browser to : ``http://localhost:3000/tutorial/gold``

### <a name="modify"></a> Step 5 - Modifying the App
Let's make changes to your app, go ahead and change the header in the following file:  ``3vot_cli_test/apps/gold/templates/layout.html``

```
...
<div class="row">
            <h1>CHANGE THIS HEADER</h1>
      <ul class="nav nav-pills nav-stacked col-md-2">
...
```

Save your changes and refresh your browser to see them.


### <a name="upload"></a> Step 6 - Uploading the App
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

### <a name="publish"></a> Step 7 - Publishing the App

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

### <a name="create"></a> Step 8 - Create a new App

On your console, go inside your `3vot_cli_test` project folder, and create a new app simply by writing:
```
3vot app:create
```

The console will ask for the app's name so write the name of the app you want to create
```
App Name ( The name of the app you want to create ):  appname
```

This will create a folder with the name of the app and will make a basic scaffold for your project. 

### <a name="run2"></a> Step 9 - Run, Upload and Publish again.

Run, upload and publish the app as in Steps 4, 6, and 7.


### <a name="createStore"></a> Step 10 - Creating a new Store

Stores are a great way to manage and order your apps after you publish them.

To create a new store just type in your console 
```
3vot store:create
```

The console will ask for a name for your store, just like so:
```
Store: ( The name of the Store you want to create ):  mystore
```	

Write a name and this will create it instantly.

### <a name="list"></a> Step 11- Listing Stores

You can see the list of your stores using the command:
```	
3vot store:list
```	
This will show, not only the stores you have but also de apps that have been added to each store.

### <a name="add"></a> Step 12- Adding Apps to a Store

Now that you've created a store you can add your apps to it.

It's really simple, add them by using:
```	
3vot store:add
```	

The console will ask for the name of the store you want to add the app to, and the name of the app.
```	
Stores: ( The name of the Store you want to use ): mystore
App: ( The name of the App you want to add to the store ):  myapp
```	

### <a name="remove"></a> Step 13- Removing an app from a store

In the same way you add an app to a store you can remove one, using ``3vot store:remove`` , this will remove it from the store, but will not delete the app.


### <a name="delete"></a> Step 14- Deleting a store

To delete a store just use the command ...
```	
3vot store:delete
```	
and choose the store you want to delete.

