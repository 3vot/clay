### Clay is an innovation on how we build Salesforce Apps using Javascript

**When I imagined Clay, I taught of the perfect developer experience**<br/>
Let us know how close we got @rodriguezartav

* Finally! A Development Server to build Visualforce Apps locally ( read localhost ).
* Finally!! Simply Upload apps and assets as Static Resource, painless and wonderfull; No need to think.
* Finally!!! The technology to build Enterprise Apps with Javascript in a Modular, maintanable way.
* Finally!!!! Forget about Limits and reuse over 80,000 JS Libs and hundreds of Third Party Services.

**Clay is an automated Production Line of Apps** as a developer you can use to build robust JS Apps; as an organization use it to build apps consistently. Large or Small it will make you 10x Faster and 100X Happier.

## The next generation of Javascript Apps
Internet Users got used to the experience of Facebook, Twitter, Gmail and hundreds of the leading web apps. Business users however must conform with them old click and wait Apps where it takes ages ( and hundreds of page refreshes ) to get anything done.

There is a new generation of Apps that are amazing, reactive, beautifull and with Clay posible. Give it a try and learn how simple it is to build modern Javascript Applications the modular, profesional way.

### Getting Started and Documentation
* Requirements ( if you don't have NODEJS )
* Getting Started in 5 Minutes: Without ClaySF || With ClaySF
* Clay Command Line Toolkit
* Templates & Examples
* Build Once, deploy to Desktop & Salesforce1

## Clay on AppExchange - NO APEX
ClaySF is an Add-ON published on AppExchange that you install on Salesforce and makes it super simple to interact with the Salesforce API's without having to write any APEX whatsoever. 

ClaySF uses a Model to CRUD and Query Salesforce Data the right way, without consuming API Calls and without refresing the page. It's state of the art.

Query Salesforce Data from Javascript
var accounts = Account.query("select id, name from Account where LastModifiedDate > LAST_WEEK")

Using Javascript constructs create any Object: 
var account = Account.create({ Name: "ACME Supplies" });

**No Apex Required**, but it's just as simple to execute Apex Methods from Javascript
var result = Clay.call( "AccountCustomController", "functionName" ,"arg1" ,10, "arg3");

**Finally contact every Salesforce API from Javascript**
Clay.call("v30/services/chatter/feeds/")


##### Purchasing ClaySF is not required in order to use Clay. Organizations that install CLAYSF do it because of it's commercial advantages when building Apps or by developers that don't want to write their own controllers in Salesforce.

**Click here to register for the Free Trail**


## Clay Production Line of Apps

