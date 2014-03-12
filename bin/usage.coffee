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

Profile Actions:
  3vot profile:create        Registers a new profile in the 3VOT Platform
  
  3vot profile:setup         Creates the project folder and installs all dependencies.
                              ( Windows Note: it's posible that users will need to run npm install manually )

"""
