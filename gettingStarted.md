####[3VOT-CLI Intro](https://github.com/3vot/3vot-cli/blob/master/readme.md)
#### Getting Started - Index
- [1- Install 3VOT CLI](#install)
- [2- Create a 3VOT profile](#profile) 
- [3- SetUp your profile folder](#setup)
- [4- Clone an App](#download) 
- [5- Running the Tutorial App](#run) 
- [6- Modifying the App](#modify)
- [7- Uploading the App](#upload)
- [8- Publishing the App](#publish)
- [9- Create a new App](#create)
- [10- Run, Upload and Publish again](#run2)
- [11- Creating a new Store](#createStore)
- [12- Listing Stores](#list)
- [13- Adding Apps to a Store](#add)
- [14- Modify your profile template](#template)
- [15- Removing an app from a store](#remove)
- [16- Deleting a store](#delete)



#### <a name="install"></a> Step 1 - Install 3vot-cli

Open the console (cmd) and install the 3vot-cli ( the tool to build, download and deploy apps )
```
npm install 3vot-cli -g
```

#### <a name="profile"></a> Step 2 - Create a 3VOT profile

Create you organization profile in 3vot:
```
3vot profile:create
```

The console will ask for the full name of your organization's profile:
```
prompt: Name: ( The Official Name of your profile):  myprofilefullname
```

Then it will ask for the username of your profile, that's the one the will appear in your 3vot url (3vot.com/myusername):
```
prompt: username: ( The username, that appears in the url ): myusername
```

This will create your profile in the platform, please take note of your developer key and keep it safe. 


#### <a name="setup"></a> Step 3 - SetUp your profile folder
On your console, choose a folder to install 3vot and type:
``` 
3vot setup 
```

The console will ask for your Developer Key. 

This step will create, in your computer, the folder structure of your 3VOT profile and download all required dependencies from NPM. 


#### <a name="download"></a> Step 4 - Clone an App

`3vot setup` generates a project folder for your profile. 
Go inside the Test folder
```
 cd 3vot_myusername
```

Now let’s Download a tutorial app, courtesy of 3VOT ;)
```
 3vot app:clone
```

The console will ask for the name of the owner of the app you want to download, in this case select the owner:  '3vot'
```
prompt: Profile: ( The profile name of the owner of the app ): 3vot
```

Then it will ask for the name of the app you want to clone, in this case is 'hello-multi-platform'
```
Profile: ( The profile name of the owner of the app ):  hello-multi-platform 
```

It will ask for the private code in case you are clonning a private app, this one is a public up, so just hit enter: 

```
prompt: Code: ( The private code in case it's a private app ):                                                          
```

Finally it will ask for the version of the app you want to clone, for the last just hit enter:
```
prompt: Version: ( The App version, hit enter for latest ):
```

Now you have a tutorial app in your apps folder with it's dependencies from NPM, next step is to Run it.


#### <a name="run"></a> Step 5 - Running the Tutorial App

Make sure you are on your profile folder '3vot_myusername' and Run the app by typing `3vot server`
```
 3vot server
```

##### If you are using your local console (Mac):

This will start a development server, to check the app running just point your browser to : ``http://localhost:3000/myusername/hello-multi-platform``

##### If you are using Nitrous.io:

The console will ask for the preview domain where you can check your app, for this just select the `Boxes` option located on the top right menu of the Nitrous IDE. 

Inside the Nitous-io box you created should be the `Preview URI` address you need, use that one on the nitrous console without the `http://` or trailing slashes `/`. 

```
Example: Domain: ( If you are on nitrous.io type the preview domain with out http:// or trailing slashes / ) :  tutorial3vot-73872-use1.nitrousbox.com
```

This will start a development server, to check the app running using nitrous just point your browser to your `previewURI/profile/app` .
```
Example: tutorial3vot-73872-use1.nitrousbox.com/myusername/hello-multi-platform
```

#### <a name="modify"></a> Step 6 - Modifying the App
Let's make changes to your app, go ahead and change the header in the following file:  ``3vot_myusername/apps/hello-multi-platform/templates/layouts/desktop.eco``

```
...
<div class="container">

  <div class=" content-header">
    <h2>CHANGE SOMETHING INSIDE THIS HEADER</h2>
  </div>
...
```

Save your changes and refresh your browser to see them.


#### <a name="upload"></a> Step 7 - Uploading the App
If you have uploaded the app before you need to increment the version in your app's package.json file, located in `apps/hello-multi-platform/package.json` , this will allow you to check any running version later, if this is your first time uploading an app skip this.

```
{
	"name": "hello-multi-platform",
	"version": "0.0.1",
	"profile": "myusername",
	"description": "A simple app with the SpineJS framework that loads JSON from a Google Spreadsheet, it showcases how to build a multiplatform App.",
	"threevot": {
		"displayName": "Multiplatform Hello World",
		"private": false,
		"privateCode": "",
		"size": "small",
		"external": {},
...
```

Now Upload the app using :
```
3vot app:upload 
```
The console will ask for the name of the app you want to upload, write the name `hello-multi-platform` in this case.
```
App: ( the name of the app you want to upload ): hello-multi-platform
```
This will upload the App to your profile, you'll later be able to publish it to the world.

It will also deploy a demo of your app in ``http://demo.3vot.com/armova6/hello-multi-platform_0.0.xx `` just change the last xx for the version of the app you want to check.

#### <a name="publish"></a> Step 8 - Publishing the App

When you have a demo that you think it's a winner and want to publish it to the world just type:
```
3vot app:publish 
```

The console will ask for the name of the app you want to publish, in this case let's publish our app `hello-multi-platform`.
```
prompt: App: ( The Name of the App you want to publish ):  hello-multi-platform  
```

The console will ask for the version of the app to be published, to publish the last just hit enter:
```
prompt: Version: ( The Version of the App you want to publish, enter for latest ):
```

You can access your published app in `3vot.com/profile/app/index.html`
```
http://3vot.com/myusername/hello-multi-platform/index.html
```

And you're done!

#### <a name="create"></a> Step 9 - Create a new App

On your console, go inside your `3vot_myusername` profile folder, and create a new app simply by writing:
```
3vot app:create
```

The console will ask for the app's name so write the name of the app you want to create
```
App Name ( The name of the app you want to create ):  appname
```

This will create a folder with the name of the app and will make a basic scaffold for your project. 

#### <a name="run2"></a> Step 10 - Run, Upload and Publish again.

Run, upload and publish the app as in Steps 4, 6, and 7.


#### <a name="createStore"></a> Step 11 - Creating a new Store

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

#### <a name="list"></a> Step 12- Listing Stores

You can see the list of your stores using the command:
```	
3vot store:list
```	
This will show, not only the stores you have but also de apps that have been added to each store.

#### <a name="add"></a> Step 13- Adding Apps to a Store

Now that you've created a store you can add your apps to it.

It's really simple, add them by using:
```	
3vot store:add
```	

The console will ask for the name of the store you want to add the app to, and the name of the app.
```	
prompt: Stores: ( The name of the Store you want to use ): mystore
prompt: App: ( The name of the App you want to add to the store ):  hello-multi-platform 
```

#### <a name="template"></a> Step 14- Modify your profile template

At the moment you add an app to a store, for the first time, you start having a profile page located at `www.3vot.com/myusername`. Your profile is using a standard template located in `3vot_myusername/store/template.eco` in your computer. 

You can modify or change your template file and update it using:
```
3VOT store:publish store/template.eco
```

#### <a name="remove"></a> Step 15- Removing an App from a Store

In the same way you add an app to a store you can remove one, using ``3vot store:remove`` , this will remove it from the store, but will not delete the app.

The console will ask the name of the store from wich you will remove an app:
```
prompt: Store: ( The name of the Store you want to use ): mystore
```

Then it will ask for the name of the app to be removed:
```
prompt: App: ( The name of the App you want to remove from the store ):  hello-multi-platform 
```


#### <a name="delete"></a> Step 16- Deleting a Store

To delete a store just use the command ...
```	
3vot store:delete
```	
and enter the name the store you want to delete
```
prompt: Stores: ( The name of the Stores you want to delete ): mystore
```

#### Hope you love your first experience with 3vot's Front End as a Service Platform!
#### For support, pair programming sessions or any feedback, please visit us at [www.3vot.com](http://3vot.com/)


