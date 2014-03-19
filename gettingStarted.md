####[3VOT-CLI Intro](https://github.com/3vot/3vot-cli/blob/master/readme.md)

#### <a name="index"></a> Getting Started - Index
- [Intro to 3VOT's Profile & Marketplace](#intro)
- [Requirements](#requirements)
- [1- Install 3VOT CLI](#install)
- [2- Create a 3VOT profile](#profile) 
- [3- Set Up your profile folder](#setup)
- [4- Clone an App](#download) 
- [5- Running the Test App](#run) 
- [6- Modifying the App](#modify)
- [7- Uploading the App](#upload)
- [8- Publishing the App](#publish)
- [9- Create a new App](#create)
- [10- Run, Upload and Publish again](#run2)
- [11- Creating a new Store](#createStore)
- [12- Listing Stores](#list)
- [13- Adding Apps to a Store](#add)
- [14- Removing an app from a store](#remove)
- [15- Deleting a store](#delete)



#### <a name="intro"></a> Intro to 3VOT, Profile & Marketplace

3VOT is a Front-End as a Service to build Apps 5X faster with reusable [NPM](https://www.npmjs.org/) components and the best of the modern web architectures. 

3VOT provides you with a Profile for your organization, there you can publish your apps and organize them by Stores, so that you can share them with your team, partners or customers. You can clone your Apps in other organization's profiles or promote them in our Marketplace. Take a look at [this video](http://www.youtube.com/watch?v=ewhugA219m0) to see how your profile will look.

3vot-cli is the local component you will use to create your apps, profile and stores. It will also let you publish your apps instantly so you don't have to worry about servers, infraestruture or other complex decisions.

[<< Back to Index](#index)

#### <a name="requirements"></a> Requirements

- You can go trought this guides in you local console (Mac or Linux) or using [Nitrous.io](https://nitrous.io).
- [NodeJS](http://nodejs.org/) installed locally. If using Nitrous.io create a new box and pick node.js as template.

[<< Back to Index](#index)

#### <a name="install"></a> Step 1 - Install 3vot-cli

Open your local console and install the 3vot-cli ( the command line interface to operate 3VOT )
```
npm install 3vot-cli@0.3.25 -g
```

`3vot -h` will display a commands list and `3vot -v` will display the version of 3vot-cli.

[<< Back to Index](#index)

#### <a name="profile"></a> Step 2 - Create a 3VOT profile

Create you organization's profile in 3vot:
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

Finally will ask for the Admin email:
````
prompt: email: ( Your Email, required in order to administer your profile ):  myemail@mydomain.com
````

This will create your profile in the platform, please take note of your developer key and keep it safe. 

You can access your profile in `3vot.com/myusername`. Each Profile includes a default App called [Hangouts](http://3vot.com/3vot/hangouts), take a look at it, is to schedule an introductory hangout with Roberto Rodríguez, our main architect and cofounder, in 30 minutes he will share his insights on 3vot's philosophy and modern web architecture.

[<< Back to Index](#index)

#### <a name="setup"></a> Step 3 - Set Up your profile folder
On your console, choose a folder to install 3vot and type:
``` 
3vot profile:setup 
```

The console will ask for your Developer Key. 

This step will create, in your computer, the folder structure of your 3VOT profile and download all required dependencies from NPM. 

[<< Back to Index](#index)

#### <a name="download"></a> Step 4 - Clone an App

`3vot profile:setup` generates a project folder for your profile.

Go inside the created project folder
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

Then it will ask for the name of the app you want to clone, in this case is 'Welcome'
```
Profile: ( The App you want to Download ):  Welcome 
```

Finally it will ask for the version of the app you want to clone, for the last just hit enter:
```
prompt: Version: ( The App version, hit enter for latest ):
```

Now you have a Welcome app in your apps folder with it's dependencies from NPM, next step is to Run it.

[<< Back to Index](#index)

#### <a name="run"></a> Step 5 - Running the Welcome App

Make sure you are on your profile folder '3vot_myusername' and Run the app by typing `3vot server`
```
 3vot server
```

##### If you are using your local console (Mac or Linux):

This will start a development server, to check the app running just point your browser to : ``http://localhost:3000/myusername/Welcome``

##### If you are using Nitrous.io:

The console will ask for the preview domain where you can check your app, for this just select the `Boxes` tab located on the top right menu of the Nitrous IDE. 

Inside the Nitous-io box you are using it should be the `Preview URI` address you need, use that one on the nitrous console without the `http://` or trailing slashes `/`. 

```
Example: Domain: ( If you are on nitrous.io type the preview domain with out http:// or trailing slashes / ) :  tutorial3vot-73872-use1.nitrousbox.com
```

This will start a development server, to check the app running using nitrous just point your browser to your `previewURI/profile/app` .
```
Example: tutorial3vot-73872-use1.nitrousbox.com/myusername/Welcome
```

[<< Back to Index](#index)

#### <a name="modify"></a> Step 6 - Modifying the App
Let's make changes to your app, go ahead and change the header in the following file:  ``3vot_myusername/apps/Welcome/templates/layout.html``

```
...
  </div><!--Row-->
    
    <h3 class=" text-inverse text-center">Welcome to 3vot's CHANGE SOMETHING INSIDE THIS HEADER!!!</h3>
    <h1 class="text-center text-inverse page-header">Resource Guide</h1>
    <br><br>
    
    <div class="col-md-10 col-md-offset-1">
...
```

Save your changes and refresh your browser to see them.

Stop the server using `ctrl+c`.

[<< Back to Index](#index)

#### <a name="upload"></a> Step 7 - Uploading the App
In your app's package.json file, located in `apps/Welcome/package.json` , you will be able to add a description of your app, 140 characters max.

```
{
	"name": "WelcomeApp",
	"description": "ADD SOMETHING HERE",
	"version": "0.0.1",
...
```

Now Upload the app using :
```
3vot app:upload 
```
The console will ask for the name of the app you want to upload, write the name `Welcome` in this case.
```
App: ( the name of the app you want to upload ): Welcome
```
This will upload the App to your profile as a demo, you'll be able to publish it to the world later, access the demo app in ``http://3vot.com/myusername/Welcome_1``. The integer at the end of the url is the version number, each time you upload the app again that integer will be upgraded.

[<< Back to Index](#index)

#### <a name="publish"></a> Step 8 - Publishing the App

When you have a demo that you think it's a winner and want to publish it to the world just type:
```
3vot app:publish
```

The console will ask for the name of the app you want to publish, in this case let's publish our app `Welcome`.
```
prompt: App: ( The Name of the App you want to publish ):  Welcome 
```

The console will ask for the version of the app to be published, to publish the last just hit enter:
```
prompt: Version: ( The Version of the App you want to publish, enter for latest ):
```

You can access your published app in `3vot.com/profile/app`
```
http://3vot.com/myusername/Welcome
```

And you're done!

Later we will show you how to publish your app in a store in `3vot.com/myusername` (steps 11-13).

[<< Back to Index](#index)

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

[<< Back to Index](#index)

#### <a name="run2"></a> Step 10 - Run, Upload and Publish again.

Run, upload and publish the app as in Steps 5, 6, and 7.

[<< Back to Index](#index)

#### <a name="createStore"></a> Step 11 - Creating a new Store

Stores are a great way to manage and order your apps after you publish them.

To create a new store just type in your console 
```
3vot store:create -u 
```

The console will ask for a name for your store, just like so:
```
Store: ( The name of the Store you want to create ):  mystore
```	

Write a name and this will create it instantly.

You can see the Store in your profile in `3vot.com/myusername`, this profile is being updated automatically because we used the `-u` option after the command `store:create`.

[<< Back to Index](#index)

#### <a name="list"></a> Step 12- Listing Stores

You can see the list of your stores using the command:
```	
3vot store:list
```	
This will show, not only the stores you have but also de apps that have been added to each store.

[<< Back to Index](#index)

#### <a name="add"></a> Step 13- Adding Apps to a Store

Now that you've created a store you can add your apps to it.

It's really simple, add them by using:
```	
3vot store:app:add -u
```	

The console will ask for the name of the store you want to add the app to, and the name of the app.
```	
prompt: Stores: ( The name of the Store you want to use ): mystore
prompt: App: ( The name of the App you want to add to the store ):  Welcome 
```

If you do `3vot store:list` or go to `3vot.com/myusername` you will see the updates.

[<< Back to Index](#index)

#### <a name="remove"></a> Step 14- Removing an App from a Store

In the same way you add an app to a store you can remove one, using ``3vot store:app:remove -u`` , this will remove it from the store, but will not delete the app.

The console will ask the name of the store from wich you will remove an app:
```
prompt: Store: ( The name of the Store you want to use ): mystore
```

Then it will ask for the name of the app to be removed:
```
prompt: App: ( The name of the App you want to remove from the store ):  WelcomeApp 
```

[<< Back to Index](#index)

#### <a name="delete"></a> Step 15- Deleting a Store

To delete a store just use the command ...
```	
3vot store:destroy -u
```	
and enter the name the store you want to delete
```
prompt: Stores: ( The name of the Stores you want to delete ): mystore
```

[<< Back to Index](#index)


#### Hope you love your first experience with 3vot's Front End as a Service Platform!
#### Don't forget to use the [Hangouts App](http://3vot.com/3vot/hangouts) to schedule a deeper discussion on how to become a 3VOT master.




