// tutorial ESP8266: https://www.instructables.com/id/Setting-Up-the-Arduino-IDE-to-Program-the-ESP8266-/
  
// config 
#include "config.h"

// libraries
#include <ArduinoOSC.h> // https://github.com/hideakitai/ArduinoOSC
#include <Servo.h>

// WIFI stuff
const char* ssid = SSID_NAME;
const char* pwd = PWD;

// servos
Servo s1;
Servo s2;
uint8_t servo1Pin = 5;
uint8_t servo2Pin = 4;

// server
String server_ip;

void setup() {
  Serial.begin(115200);

  // pin modes
  pinMode(LED_BUILTIN, OUTPUT);
  analogWriteFreq(1);
  s1.attach(servo1Pin);
  s2.attach(servo2Pin);

  // graceful WiFi connection
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(500);

  WiFi.begin(ssid, pwd);
  
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.print("WiFi connected, IP = "); Serial.println(WiFi.localIP());
    
  delay(1000);

  OscWiFi.subscribe(RECV_PORT, "/position", [](OscMessage & m) {
    float x = m.arg<float>(0);
    float y = m.arg<float>(1);
    positionControl(x, y);
  });

  OscWiFi.subscribe(RECV_PORT,"/helloRobot", [](OscMessage & m) {
    Serial.print(m.remoteIP()); Serial.print(" ");
    Serial.print(m.remotePort()); Serial.print(" ");
    Serial.print(m.size()); Serial.print(" ");
    Serial.print(m.address()); Serial.print(" ");

    server_ip = m.remoteIP();    

    OscWiFi.publish(server_ip, SEND_PORT, "/helloServer", ROBO_NAME);
    OscWiFi.post();
  });
}

void loop() {
  OscWiFi.parse();
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
}
