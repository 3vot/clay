console.log """
#{pkg.name} #{pkg.version}

Usage: #{pkg.name} [options] [command]

Commands:

  profile        Profile actions to setup enviroment  
  app            Manage Application Livecycle
  store          Manage de Appearance of the 3VOT Profile
  server         Start the development server

Options:

  -h,    output usage information
  -v,    output the version number
  -u,    Updates your 3VOT Profile

Profile Actions:
  3vot profile:create        Registers a new profile in the 3VOT Platform
  
  3vot profile:setup         Creates the project folder and installs all dependencies.
                              ( Windows Note: it's posible that users will need to run npm install manually )

App Actions
  3vot app:create            Registers a new App on the Platform using current credits and creates folder esctru

  3vot app:upload            Uploads the Code of the new app and uploads the app as a demo
  
  3vot app:clone             Clones an App from the 3VOT Platform Marketplace and downloads its source code
  
  3vot app:publish           Publishes a Demo App to your 3VOT Profile
  
  3vot app:build             Builds the development version of the App ( Used in manual operation )
  
  3vot app:install           Installs the NPM and Bower Dependencies of the App ( Used in Manual Operation )
  
Store Actions
  3vot store:create          Creates a new Store in on your 3VOT Profile Page

  3vot store:list            List all Stores and Apps in your 3VOT Profile
  
  3vot store:app:add         Adds an App to the specified store referenced by store name
  
  3vot store:app:remove      Removes an App from the Store

  3vot store:destroy         Removes a Store from your 3VOT Profile
  
  3vot store:generate        Updates your 3VOT Profile with all Apps in Stores

"""
