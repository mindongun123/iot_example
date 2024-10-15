#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <Adafruit_Sensor.h>

#define DHTPIN 4      // Chân tín hiệu của DHT11 (GPIO5 - D2)
#define DHTTYPE DHT11 // Loại cảm biến DHT11

// #define LED_PIN1 13 // // Chân nối với đèn LED (GPIO13 - D7)

#define LED_PIN5 5   // Chân nối với đèn LED (GPIO5 - D1)
#define LED_PIN12 12 // Chân nối với đèn LED (GPIO12 - D6)
#define LED_PIN16 16 // Chân nối với đèn LED (GPIO16 - D0)

DHT dht(DHTPIN, DHTTYPE);

const char *ssid = "jk";
const char *password = "12345687@";
const char *mqtt_server = "192.168.1.11";
const int mqtt_port = 1993;

const char *mqtt_user = "dong";
const char *mqtt_password = "b21dccn230";

WiFiClient espClient;
PubSubClient client(espClient);

int lightSensorPin = A0;
int lightValue = 0;

void setup_wifi();
void reconnect();
void callback(char *topic, byte *message, unsigned int length);

void setup()
{
  Serial.begin(9600);
  // pinMode(LED_PIN1, OUTPUT);
  // digitalWrite(LED_PIN1, LOW);

  // dang ki den led
  pinMode(LED_PIN5, OUTPUT);
  digitalWrite(LED_PIN5, LOW);

  pinMode(LED_PIN12, OUTPUT);
  digitalWrite(LED_PIN12, LOW);

  pinMode(LED_PIN16, OUTPUT);
  digitalWrite(LED_PIN16, LOW);

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  dht.begin();
}

void setup_wifi()
{
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
}

void reconnect()
{
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP8266Client", mqtt_user, mqtt_password))
    {
      Serial.println("connected");
      client.subscribe("data/light1");
      client.subscribe("data/light2");
      client.subscribe("data/light3");
      client.subscribe("data/lightall");
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void callback(char *topic, byte *message, unsigned int length)
{
  String messageStr = String((char *)message).substring(0, length);

  if (String(topic) == "data/light1")
  {
    if (messageStr == "OFF")
    {
      digitalWrite(LED_PIN5, LOW);
      Serial.println("LED turned OFF");
    }
    else if (messageStr == "ON")
    {
      digitalWrite(LED_PIN5, HIGH);
      Serial.println("LED turned ON");
    }
  }

  if (String(topic) == "data/light2")
  {
    if (messageStr == "OFF")
    {
      digitalWrite(LED_PIN12, LOW);
      Serial.println("LED turned OFF");
    }
    else if (messageStr == "ON")
    {
      digitalWrite(LED_PIN12, HIGH);
      Serial.println("LED turned ON");
    }
  }

  if (String(topic) == "data/light3")
  {
    if (messageStr == "OFF")
    {
      digitalWrite(LED_PIN16, LOW);
      Serial.println("LED turned OFF");
    }
    else if (messageStr == "ON")
    {
      digitalWrite(LED_PIN16, HIGH);
      Serial.println("LED turned ON");
    }
  }

  if (String(topic) == "data/lightall")
  {
    if (messageStr == "OFF")
    {
      digitalWrite(LED_PIN5, LOW);
      digitalWrite(LED_PIN12, LOW);
      digitalWrite(LED_PIN16, LOW);
      Serial.println("LED turned OFF");
    }
    else if (messageStr == "ON")
    {
      digitalWrite(LED_PIN5, HIGH);
      digitalWrite(LED_PIN12, HIGH);
      digitalWrite(LED_PIN16, HIGH);
      Serial.println("LED turned ON");
    }
  }
}

void loop()
{
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();

  lightValue = analogRead(lightSensorPin);
  char testLightStr[32];
  dtostrf(lightValue, 1, 2, testLightStr);
  Serial.println(lightValue);
  snprintf(testLightStr, sizeof(testLightStr), "{\"light\": %d}", lightValue);

  // if (isnan(lightValue))
  // {
  //   Serial.println("Failed to read from DHT sensor!");
  // }
  // else
  // {
  //   char lightStr[8];
  //   dtostrf(lightValue, 1, 2, lightStr);

  //   Serial.printf("Light: %s", lightStr);

  //   client.publish("sensor/light", lightStr);

  //   char jsonStr[100];
  //   snprintf(jsonStr, sizeof(jsonStr), "{\"light\": %s}", lightStr);

  //   client.publish("data/light1", jsonStr);
  //   client.publish("data/light2", jsonStr);
  //   client.publish("data/light3", jsonStr);
  //   client.publish("data/lightall", jsonStr);
  // }

  /////
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature) || isnan(lightValue))
  {
    Serial.println("Failed to read from DHT sensor!");
  }
  else
  {
    char lightStr[8];
    char tempStr[8];
    char humStr[8];
    dtostrf(lightValue, 1, 2, lightStr);
    dtostrf(temperature, 1, 2, tempStr);
    dtostrf(humidity, 1, 2, humStr);

    Serial.printf("Light: %s, Temperature: %s, Humidity: %s\n", lightStr, tempStr, humStr);

    // gui du lieu nhiet do, do am, anh sang len mqtt
    client.publish("sensor/light", lightStr);
    client.publish("sensor/temperature", tempStr);
    client.publish("sensor/humidity", humStr);

    char jsonStr[100];
    snprintf(jsonStr, sizeof(jsonStr), "{\"light\": %s, \"temperature\": %s, \"humidity\": %s}", lightStr, tempStr, humStr);

    // gui du lieu nhiet  anh sang len topic "data/light1", "data/light2", "data/light3", "data/lightall"
    client.publish("data/light1", jsonStr);
    client.publish("data/light2", jsonStr);
    client.publish("data/light3", jsonStr);
    // Gửi dữ liệu tới topic "data/lightall"
    client.publish("data/lightall", jsonStr);
  }

  delay(2000);
}
