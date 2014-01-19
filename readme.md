3VOT - We'll set you free

3VOT is a collection Open Source Tools & Frameworks, wrapped in the 3VOT CLI Tool to promote the industries best practices in Front End Development and eliminate the many decisions and configurations developers need to make each time they start, build and deploy a project.

More importantly, 3VOT CLI is the tool used to create, build and deploy Apps to The 3VOT Platform; The First and Only FrontEnd as a Service provider, that makes it really easy to build apps and make them available to employees, customers and partners.

3VOT Apps are awesome because they are based 100% on NPM, so that we can finally work with Web Components and they are Responsive 2.0 by default write apps for Phone/Tablet/Desktop sharing code and also building specific funcionality for each.

The 3VOT Marketplace is for organizations to re-sell or share they apps with other organizations, so it's really easy to get started.

To get Started simply:

npm install 3vot -g

and setup a project:

2. Setup 3VOT: 3vot setup --key xxxxxxxxxxxxxxxxxxxx You can obtain the Key from your Organization's Dashboard

3. Install Dependencies: npm install .

then download an app:

1. Download the App from the Marketplace: 3vot download --app 3vot/angular-sample

2. Install the App and its dependencies: 3vot install --app angular-sample

the run the app in the local development

1. Start the Server ( express with live-reload ) : 3vot server

2. Visit the App: http://localhost:3000/yourOrg/yourApp


*Other Features*

Create a new App
TODO" 3vot create myAppName

Build the Application for Deploymeny
3vot build --app myappName

Upload The App and Deploy to Staging
3vot upload --app myAppName

