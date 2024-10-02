#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <Adafruit_Sensor.h>

#define DHTPIN 4      // Chân tín hiệu của DHT11
#define DHTTYPE DHT11 // Loại cảm biến DHT11
#define LED_PIN 5     // Chân nối với đèn LED (GPIO5 - D1)
// #define LED_PIN1 13 // D
#define LED_PIN2 12
#define LED_PIN3 16

DHT dht(DHTPIN, DHTTYPE);

const char *ssid = "iPhone (4)";
const char *password = "12345678";
const char *mqtt_server = "172.20.10.5";
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
  pinMode(LED_PIN, OUTPUT); 
  digitalWrite(LED_PIN, LOW);  
  
  // pinMode(LED_PIN1, OUTPUT); 
  // digitalWrite(LED_PIN1, LOW);  
  
  pinMode(LED_PIN2, OUTPUT);   
  digitalWrite(LED_PIN2, LOW); 
  
  pinMode(LED_PIN3, OUTPUT); 
  digitalWrite(LED_PIN3, LOW); 

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
      client.subscribe("data/light");
      // client.subscribe("data/light1");
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

  if (String(topic) == "data/light")
  {
    if (messageStr == "OFF")
    {
      digitalWrite(LED_PIN, LOW); // Tắt đèn
      Serial.println("LED turned OFF");
    }
    else if (messageStr == "ON")
    {
      digitalWrite(LED_PIN, HIGH); // Bật đèn
      Serial.println("LED turned ON");
    }
  }

  if (String(topic) == "data/light2")
  {
    if (messageStr == "OFF")
    {
      digitalWrite(LED_PIN2, LOW); // Tắt đèn
      Serial.println("LED turned OFF");
    }
    else if (messageStr == "ON")
    {
      digitalWrite(LED_PIN2, HIGH); // Bật đèn
      Serial.println("LED turned ON");
    }
  }

  if (String(topic) == "data/light3")
  {
    if (messageStr == "OFF")
    {
      digitalWrite(LED_PIN3, LOW); // Tắt đèn
      Serial.println("LED turned OFF");
    }
    else if (messageStr == "ON")
    {
      digitalWrite(LED_PIN3, HIGH); // Bật đèn
      Serial.println("LED turned ON");
    }
  }


  if (String(topic) == "data/lightall")
  {
    if (messageStr == "OFF")
    {
      digitalWrite(LED_PIN, LOW); 
      digitalWrite(LED_PIN2, LOW); 
      digitalWrite(LED_PIN3, LOW); 
      Serial.println("LED turned OFF");
    }
    else if (messageStr == "ON")
    {
      digitalWrite(LED_PIN, HIGH); // Bật đèn
      digitalWrite(LED_PIN2, HIGH); // Bật đèn
      digitalWrite(LED_PIN3, HIGH); // Bật đèn
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
  char lightStr[8];
  dtostrf(lightValue, 1, 2, lightStr);

  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature))
  {
    Serial.println("Failed to read from DHT sensor!");
  }
  else
  {
    char tempStr[8];
    char humStr[8];
    dtostrf(temperature, 1, 2, tempStr);
    dtostrf(humidity, 1, 2, humStr);

    Serial.printf("Light: %s, Temperature: %s, Humidity: %s\n", lightStr, tempStr, humStr);

    client.publish("sensor/light", lightStr);
    client.publish("sensor/temperature", tempStr);
    client.publish("sensor/humidity", humStr);

    char jsonStr[100];
    snprintf(jsonStr, sizeof(jsonStr), "{\"light\": %s, \"temperature\": %s, \"humidity\": %s}", lightStr, tempStr, humStr);

    // Gửi dữ liệu tới topic "data/lightall"
    client.publish("data/lightall", jsonStr);
  }

  delay(2000);
}
