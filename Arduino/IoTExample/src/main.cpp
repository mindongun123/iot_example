#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <Adafruit_Sensor.h>

#define DHTPIN 4      // Chân tín hiệu của DHT11 (GPIO5 - D2)
#define DHTTYPE DHT11 // Loại cảm biến DHT11

#define LED_PIN5 5   // Chân nối với đèn LED (GPIO5 - D1)
#define LED_PIN12 12 // Chân nối với đèn LED (GPIO12 - D6)
#define LED_PIN16 16 // Chân nối với đèn LED (GPIO16 - D0)
#define LED_PIN13 13 // Chân nối với đèn LED (GPIO13 - D7)

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

unsigned long lastSensorUpdate = 0;
const long sensorUpdateInterval = 10000;

void setup_wifi();
void reconnect();
void callback(char *topic, byte *message, unsigned int length);

void setup()
{
  Serial.begin(9600);

  pinMode(LED_PIN5, OUTPUT);
  digitalWrite(LED_PIN5, LOW);

  pinMode(LED_PIN12, OUTPUT);
  digitalWrite(LED_PIN12, LOW);

  pinMode(LED_PIN16, OUTPUT);
  digitalWrite(LED_PIN16, LOW);

  pinMode(LED_PIN13, OUTPUT);
  digitalWrite(LED_PIN13, LOW);

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
      client.subscribe("iot/action/light1");
      client.subscribe("iot/action/light2");
      client.subscribe("iot/action/light3");
      client.subscribe("iot/action/light4");
      client.subscribe("iot/action/lightall");
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
// Biến lưu trạng thái hiện tại của các đèn LED
bool led1State = LOW;
bool led2State = LOW;
bool led3State = LOW;
bool led4State = LOW;

void callback(char *topic, byte *message, unsigned int length)
{
  String messageStr = String((char *)message).substring(0, length);

  if (String(topic) == "iot/action/light1")
  {
    if (messageStr == "OFF" && led1State == HIGH)
    {
      digitalWrite(LED_PIN5, LOW);
      led1State = LOW;
      Serial.println("\nLED 1 OFF");
    }
    else if (messageStr == "ON" && led1State == LOW)
    {
      digitalWrite(LED_PIN5, HIGH);
      led1State = HIGH;
      Serial.println("\nLED 1 ON");
    }
  }

  if (String(topic) == "iot/action/light2")
  {
    if (messageStr == "OFF" && led2State == HIGH)
    {
      digitalWrite(LED_PIN12, LOW);
      led2State = LOW;
      Serial.println("\nLED 2 OFF");
    }
    else if (messageStr == "ON" && led2State == LOW)
    {
      digitalWrite(LED_PIN12, HIGH);
      led2State = HIGH;
      Serial.println("\nLED 2 ON");
    }
  }

  if (String(topic) == "iot/action/light3")
  {
    if (messageStr == "OFF" && led3State == HIGH)
    {
      digitalWrite(LED_PIN16, LOW);
      led3State = LOW;
      Serial.println("\nLED 3 OFF");
    }
    else if (messageStr == "ON" && led3State == LOW)
    {
      digitalWrite(LED_PIN16, HIGH);
      led3State = HIGH;
      Serial.println("\nLED 3 ON");
    }
  }

  if (String(topic) == "iot/action/light4")
  {
    if (messageStr == "OFF" && led4State == HIGH)
    {
      digitalWrite(LED_PIN13, LOW);
      led4State = LOW;
      Serial.println("\nLED 4 OFF");
    }
    else if (messageStr == "ON" && led4State == LOW)
    {
      digitalWrite(LED_PIN13, HIGH);
      led4State = HIGH;
      Serial.println("\nLED 4 ON");
    }
  }

  if (String(topic) == "iot/action/lightall")
  {
    if (messageStr == "OFF")
    {
      digitalWrite(LED_PIN5, LOW);
      digitalWrite(LED_PIN12, LOW);
      digitalWrite(LED_PIN16, LOW);
      digitalWrite(LED_PIN13, LOW);
      led1State = LOW;
      led2State = LOW;
      led3State = LOW;
      led4State = LOW;
      Serial.println("\nALL LED OFF");
    }
    else if (messageStr == "ON")
    {
      digitalWrite(LED_PIN5, HIGH);
      digitalWrite(LED_PIN12, HIGH);
      digitalWrite(LED_PIN16, HIGH);
      digitalWrite(LED_PIN13, HIGH);
      led1State = HIGH;
      led2State = HIGH;
      led3State = HIGH;
      led4State = HIGH;
      Serial.println("\nALL LED ON");
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

  unsigned long currentMillis = millis();

  // Chỉ cập nhật dữ liệu sensor sau mỗi 10 giây
  if (currentMillis - lastSensorUpdate >= sensorUpdateInterval)
  {
    lastSensorUpdate = currentMillis;

    float lightValue = analogRead(lightSensorPin);
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();

    // data fake
    float dataFake = random(20, 100);

    if (isnan(humidity) || isnan(temperature) || isnan(lightValue))
    {
      Serial.println("Failed to read from DHT sensor!");
    }
    else
    {
      char lightStr[8];
      char tempStr[8];
      char humStr[8];
      char fakeStr[8];
      dtostrf(lightValue, 1, 2, lightStr);
      dtostrf(temperature, 1, 2, tempStr);
      dtostrf(humidity, 1, 2, humStr);
      dtostrf(dataFake, 1, 2, fakeStr);

      char jsonStr[100];
      snprintf(jsonStr, sizeof(jsonStr), "{\"light\": %s, \"temperature\": %s, \"humidity\": %s, \"datafake\": %s}", lightStr, tempStr, humStr, fakeStr);

      Serial.printf("\nLight: %s, Temperature: %s, Humidity: %s, DataFake: %s\n", lightStr, tempStr, humStr, fakeStr);
      Serial.printf(jsonStr);

      // Gửi dữ liệu sensor lên MQTT
      client.publish("iot/sensor", jsonStr);
    }
  }
}


// Cam bien gia --> dataFake, tuong ung voi Action light4 