# Web Bomic Collect
Web Bomic Events Collection

Allows collection of Web Bomic client events via IPad or Android devices, that can be synchronised to any Web Bomic application.

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process. Make sure you've installed Node.js and npm first, then install grunt globally using npm:

```bash
$ npm install -g grunt-cli
```

## Downloading Web Bomic Collect

### Cloning The GitHub Repository
Ue Git to directly clone the Web Bomic Collect repository:
```bash
$ git clone https://github.com/RidersOfRohan/web-bomic-collect.git
```
This will clone the latest version of the Web Bomic Collect repository to a **web-bomic-collect** folder.

## Quick Install
Once you've downloaded the boilerplate and installed all the prerequisites, the first thing you should do is install the Node.js dependencies. 

To install Node.js dependencies you're going to use npm again. In the application folder run this in the command-line:

```bash
$ npm install
```

This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for testing and running your application.
* Finally, when the install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application.

## Running Your Application
After the install process is over, you'll be able to run your application using Grunt. Just run grunt default task:

```bash
$ grunt build
```

Your application should then be published to the public.dist/public folder. You can then point a webserver at this directory.

That's it! Your application should be running. To proceed with your development, check the other sections in this documentation.
If you encounter any problems, try the Troubleshooting section.

