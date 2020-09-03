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
Next, we will install the neccessary packages: Go __with your terminal__ inside the robodada-master folder and go into Serverland. In this folder you see things like `app.js` and `package.json`.
The following command will automagically install all the needed things for you, while amazing you with nice terminal animations:
```
npm install
```
After a successful installation, again __with your terminal__ and inside the folder robodada-master/Serverland start the server with this command:
```
node app.js
```
The server is starting up, telling you:
```
Searching robots on <Your interface and ip here>
Listening on 3000 in <Your Path>robodada-master/Serverland/controller
````
It will search robots every few seconds - so don't mind the messages.

Congratulations! You made it!

## How to use
Take your favourite browser, we recommend Firefox and Chrome and go to [localhost:3000](localhost:3000).

## Build your own Robot

* Pan Tilt -> Verweis
* Dokumentation Platine
* Beschriftetes Foto & Illustrator
* NodeMCU

## About
Team
Lab
HSA

## License
CC BY SA