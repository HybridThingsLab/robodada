// documentation ESP8266: https://www.mikrocontroller-elektronik.de/nodemcu-esp8266-tutorial-wlan-board-arduino-ide/

// libraries
#include <ArduinoOSC.h> // https://github.com/hideakitai/ArduinoOSC
#include <Servo.h>

// Robot's properties
const String name = "Bender";

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
const int send_port = 9999;

uint8_t servo1Pin = D1;
uint8_t servo2Pin = D2;


void setup() {
  Serial.begin(115200);

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

  delay(1000);

  //say hello to the server in the pattern: name, ip address
  osc.send(host, send_port, "/hello", name, ip.toString());
  delay(1000);

  osc.subscribe("/position", [](OscMessage & m) {

    /*
    Serial.print("PosMsg : ");
         
    Serial.print(m.ip()); Serial.print(" ");
    Serial.print(m.port()); Serial.print(" ");
    Serial.print(m.size()); Serial.print(" ");
    Serial.print(m.address()); Serial.print(" ");
    Serial.println(m.arg<int>(0));
    */

    float x = m.arg<float>(0);
    float y = m.arg<float>(1);
    
    /*
    Serial.print("x: ");
    Serial.println(x);
    Serial.print("y: ");
    Serial.println(y);
    */
    
    positionControl(x, y);

  });

}

void loop() {
  osc.parse(); // should be called

}

float float_map(float x, float in_min, float in_max, float out_min, float out_max)
{
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

void positionControl(float x, float y) {
  int m_x = float_map(x, 0, 1, 0, 170);
  int m_y = float_map(y, 0, 1, 0, 170);
  s1.write(m_x);
  s2.write(m_y);

  /*
  Serial.print("x: ");
  Serial.print(m_x);
  Serial.print(" y: ");
  Serial.println(m_y);
  */
}
