# ROBODADA
## What is ROBODADA?

## Requirements
To use ROBODADA you need:
* NodeJS with NPM
* Webcam

### Nice to have
* a Robot (everything is nicer with a robot, isn't it?)

## Installation
First of all you need to install NodeJS from [here](https://nodejs.org/en/download/). We recommend using the Installer.

Check your working NodeJS installation by opening your terminal and type
```
node --version
```
which should show something like `v12.18.3`.
If your terminal tells you `Command not found` or similar, something went wrong with your NodeJS Installation.

Download the ROBODADA archive from [here](https://github.com/HybridThingsLab/robodada/archive/master.zip) and unzip it to a suitable directory. There will be a folder called `robodada-master`.

Next, we will install the neccessary packages: Go __with your terminal__ inside the `robodada-master` folder and into the folder `Serverland`. In this folder you see things like `app.js` and `package.json`.
The following command will automagically install all the needed things for you, while amazing you with nice terminal animations:
```
npm install
```
After a successful installation, again __with your terminal__ and inside the folder `robodada-master/Serverland` start the server with this command:
```
node app.js
```
The server is starting up, telling you:
```
Searching robots on <Your interface and ip here>
Listening on 3000 in <Your Path>robodada-master/Serverland/controller
````
It will search robots every few seconds - so don't mind the messages.

Congratulations! You've made it!

## How to use
Take your favourite browser, we recommend Firefox and Chrome and go to [localhost:3000](localhost:3000).

Shortcut to debug-view.

## Build your own Robot

* Pan Tilt -> Verweis
* Dokumentation Platine
* Beschriftetes Foto & Illustrator
* NodeMCU

So you decided to build your own robot - in the future this will be done by robots for you but until then you have to do it yourselves.

We assume that you have worked with Arduinos or similar in the past and __you know what you are doing__ when plugging in soldered stuff into your beloved Laptop.

The robot we will build is just a proposal, and you can modify it in any way you like. [Let us know](mailto:) when you did something cool!

You will build three components:
* a dagu robot servo pan tilt module
* a lasercut stand for the servos
* a soldered PCB board which will hold the microcontroller and connects to the servos

### DaguRobot Pan/Tilt module
You need [this](http://www.dagurobot.com/Sensor_pan_tilt_kit_DGS3003_servo?search=pan%20tilt&category_id=0) module. You will find it at your favourite distributor over the internet. __Make sure you get the long version!__
Build the module as described in the manual. When fixing the servo hubs, mount them in a position that the servers are in a 50% position when pointing upright/centered.

### Servostand
Our servostand is a lasercut stand which will perfectly fit the pan/tilt module and has fixing holes for the PCB and power connector.
You can cut it out of a 3mm thick material of your choice - we recommend MDF board or something similar, non-conductive, glueable.
 

## About
Team
Lab
HSA

## License
CC BY SA