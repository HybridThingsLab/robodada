// documentation ESP8266: https://www.mikrocontroller-elektronik.de/nodemcu-esp8266-tutorial-wlan-board-arduino-ide/

// libraries
#include <ArduinoOSC.h> // https://github.com/hideakitai/ArduinoOSC
#include <Servo.h>

// WiFi stuff
const char* ssid = "maschinenraum";
const char* pwd = "maschinenraum";
const IPAddress ip(192, 168, 1, 200);
const IPAddress gateway(192, 168, 1, 1);
const IPAddress subnet(255, 255, 255, 0);
Servo s1;
Servo s2;

// for ArduinoOSC
OscWiFi osc;
const char* host = "192.168.1.100";
const int recv_port = 9999;
const int send_port = 8888;

uint8_t servo1Pin = D1;
uint8_t servo2Pin = D2;


void setup() {
  Serial.begin(9600);

  // pin modes
  pinMode(LED_BUILTIN, OUTPUT);
  analogWriteFreq(1);
  s1.attach(servo1Pin);
  s2.attach(servo2Pin);

  // WiFi stuff
  WiFi.begin(ssid, pwd);
  WiFi.config(ip, gateway, subnet);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.print("WiFi connected, IP = "); Serial.println(WiFi.localIP());

  // ArduinoOSC
  osc.begin(recv_port);


  osc.subscribe("/servo1", [](OscMessage & m) {
    Serial.print("servo1 : ");
    Serial.print(m.ip()); Serial.print(" ");
    Serial.print(m.port()); Serial.print(" ");
    Serial.print(m.size()); Serial.print(" ");
    Serial.print(m.address()); Serial.print(" ");
    Serial.println(m.arg<int>(0));

    int pos = m.arg<int>(0);
    controlServo1(pos);

  });

  osc.subscribe("/servo2", [](OscMessage & m) {
    Serial.print("servo2 : ");
    Serial.print(m.ip()); Serial.print(" ");
    Serial.print(m.port()); Serial.print(" ");
    Serial.print(m.size()); Serial.print(" ");
    Serial.print(m.address()); Serial.print(" ");
    Serial.println(m.arg<int>(0));

    int pos = m.arg<int>(0);
    controlServo2(pos);

  });

}

void loop() {
  osc.parse(); // should be called

}

void controlServo1(int pos) {
  s1.write(pos);
  Serial.print("Servo 1: ");
  Serial.println(pos);
}

void controlServo2(int pos) {
  s2.write(pos);
  Serial.print("Servo 2: ");
  Serial.println(pos);
}
