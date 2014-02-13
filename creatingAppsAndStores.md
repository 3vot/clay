## 	Creating Apps and Stores with 3VOT-CLI

 - [Creating a New App ON YOUR CONSOLE (Mac)](#newAppConsole)
 - [Creating a New Store ON YOUR CONSOLE (Mac)](#newStoreConsole)
 
- [Creating a New App using NITROUS.IO](#newAppNitrous)
- [Creating a New Store using NITROUS.IO](#newStoreNitrous)


## <a name="newAppConsole"></a> Creating a New App - ON YOUR CONSOLE (Mac)

### Step 1 - Create the app

On your console, go inside your 3vot project folder, and create a new app simply by writing:
```
3vot app:create
```

The console will ask for the app's name so write the name of the app you want to create
```
App Name ( The name of the app you want to create ):  appname
```

This will create a folder with the name of the app and will make a basic scaffold for your project. 

### Step 2 - Run the App

Run the server to test the app you just created.
```
 3vot server
```
And check the app running by pointing your browser to : 
```
http://localhost:3000/profile/appname
```
``Remember to change /profile/ for the name of your profile and /appname for the name of your app``


### Step 3 - Upload the app
After you've created your app, remember to upload it to your profile by using :
```
3vot app:upload
```

This will deploy a demo of your app in ``http://demo.3vot.com/profile/appname_0.0.xx `` just change the last xx for the version of the app you want to check.


### Step 4 - Publish the app


You'll be able to publish the app to the world by using 
```
3vot app:publish
```

And then access it in 
```
http://3vot.com/profile/myapp/index.html
```

## Creating a New Store


Stores are a great way to manage and order your apps.


### Step 1 - Creating the store

To create a new store just type in your console 
```
3vot store:create
```

The console will ask for a name for your store, just like so:
```
Store: ( The name of the Store you want to create ):  mystore
```	

Write a name and this will create it instantly.


You can see the list of your stores using the command:
```	
3vot store:list
```	
This will show, not only the stores you have but also de apps that have been added to each store.

### Step 2- Adding apps to a store

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

### Removing an app from a store

In the same way you add an app to a store you can remove one, using ``3vot store:remove`` , this will remove it from the store, but will not delete the app.


### Deleting a store

To delete a store just use the command ...
```	
3vot store:delete
```	
and choose the store you want to delete.


## Index


#### - [3VOT-CLI Intro](https://github.com/3vot/3vot-cli/)
#### - [Getting Started](https://github.com/3vot/3vot-cli/blob/master/gettingStarted.md)
#### - [Creating Apps and Stores](https://github.com/3vot/3vot-cli/blob/master/creatingAppsAndStores.md)

