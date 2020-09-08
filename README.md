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
<image of robot>
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
_image of pan/tilt module>_

You need [this](http://www.dagurobot.com/Sensor_pan_tilt_kit_DGS3003_servo?search=pan%20tilt&category_id=0) module. You will find it at your favourite distributor over the internet. __Make sure you get the long version!__
Build the module as described in the manual. When fixing the servo hubs, mount them in a position that the servers are in a __50% position__ when pointing upright/centered.

### Servostand
_image of servostand_

Our servostand is a lasercut stand which will perfectly fit the pan/tilt module and has fixing holes for the PCB and power connector.
You can cut it out of a __3mm__ thick material of your choice - we recommend MDF board or something similar, non-conductive, glueable.
 
### Circuit board
_image of soldered board_

The circuit board holds the electric heart of your robot: a NodeMCU wireless controller (free the robots!). Additionally it provides a voltage converter and a (huge) capacitor to provide the servos with power, while supporting a wide range of input voltages. It also has mounting holes and a terminal connector for the powerboard too keep everything organized.

#### Building the board
_image of circuit_

Solder the board as shown in the diagram. We use a breadboard, labeled on the top side and cut with a lasercutter. Make sure you hit the board on its holes when labeling your conductor paths.

We strongly recommend to use wire for the long connections.

#### Flashing the Robot
_image of arduino flashing_
We do this with the Arduino software. Don't worry - it's straight forward.

Before programming the robot, you need to add the board to the Arduino's board library and do some minor configurations. It is well documented [here](https://www.instructables.com/id/Setting-Up-the-Arduino-IDE-to-Program-the-ESP8266-/).

After setting up your Arduino environment, go to ```robodada-master/Roboland/NodeMCU_ESP8266/osc_servo``` and open up the ```osc_servo.ino``` file with your Arduino programming environment. You will notice that the patch consists of two files: beside the ```osc_servo.ino``` there is also a ```config.h```.

Open the ```config.h``` and fill the following information:
```cpp
#define ROBO_NAME "Bender"

#define SSID_NAME "name of your WiFi"
#define PWD "password of your WiFi"
```

* ROBO_NAME: name of your robot, choose wisely, __if you use multiple robots, names must be unique__
* SSID_NAME: as your robot connects via WiFi it has to know your credentials. This one is the name/ssid of your WiFi.
* PWD: the secret of your WiFi

Save your changes and upload the patch to your NodeMCU. Your Arduino Software should show the upload progress and something like "completed" in the end. If it does not finish/start the upload, most probably something went wrong with the NodeMCU driver installation or the board configuration.


## About
Team
Lab
HSA

## License
CC BY SA