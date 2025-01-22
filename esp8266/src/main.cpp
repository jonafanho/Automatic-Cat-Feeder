#include <CustomScheduler.h>
#include <Settings.h>
#include <WiFiSetup.h>

#include <LittleFS.h>

#define SETUP_BUTTON D0
#define MOTOR_IN1 D1
#define MOTOR_IN2 D2
#define SENSOR D3
#define LED_PIN D4

#define MOTOR_SPEED 128
#define CYCLE_LENGTH 10
#define CYCLES 8

#define ACCESS_POINT_SSID "Automatic Cat Feeder Setup"

ESP8266WebServer server(80);
DNSServer dnsServer;
WiFiSetup wiFiSetup(server, dnsServer, ACCESS_POINT_SSID, SETUP_BUTTON);
CustomScheduler customScheduler;

uint16_t cycle = CYCLES * CYCLE_LENGTH;

void setup()
{
	Serial.begin(9600);
	Serial.println();
	Serial.println("Starting...");
	LittleFS.begin();

	pinMode(MOTOR_IN1, OUTPUT);
	pinMode(MOTOR_IN2, OUTPUT);
	pinMode(SENSOR, INPUT_PULLUP);
	pinMode(LED_PIN, OUTPUT);

	digitalWrite(MOTOR_IN1, LOW);
	digitalWrite(MOTOR_IN2, LOW);

	bool isNormalConnection = wiFiSetup.setup();
	server.on("/api/add-schedule", HTTP_GET, [&]() {
		customScheduler.add(server.arg("hour").toInt(), server.arg("minute").toInt(), server.arg("second").toInt(), server.arg("channel").toInt());
		Settings::sendToServer(server);
	});
	server.on("/api/remove-schedule", HTTP_GET, [&]() {
		customScheduler.remove(server.arg("hour").toInt(), server.arg("minute").toInt(), server.arg("second").toInt(), server.arg("channel").toInt());
		Settings::sendToServer(server);
	});
	server.on("/api/feed-cat", HTTP_GET, [&]() {
		Settings::sendToServer(server);
		cycle = 0;
	});

	if (isNormalConnection)
	{
		while (WiFi.status() != WL_CONNECTED)
		{
			delay(500);
		}
		Serial.print("Connected to WiFi: ");
		Serial.println(WiFi.localIP().toString());
	}
	else
	{
		Serial.print("Access point mode: ");
		Serial.println(ACCESS_POINT_IP.toString());
	}

	customScheduler.setup();
}

void moveMotor()
{
	if (cycle >= CYCLES * CYCLE_LENGTH)
	{
		digitalWrite(MOTOR_IN1, LOW);
		digitalWrite(MOTOR_IN2, LOW);
	}
	else if ((cycle % CYCLE_LENGTH) < 6)
	{
		digitalWrite(MOTOR_IN1, HIGH);
		digitalWrite(MOTOR_IN2, LOW);
	}
	else if ((cycle % CYCLE_LENGTH) >= 8)
	{
		digitalWrite(MOTOR_IN1, LOW);
		digitalWrite(MOTOR_IN2, HIGH);
	}
	else
	{
		digitalWrite(MOTOR_IN1, LOW);
		digitalWrite(MOTOR_IN2, LOW);
	}

	delay(100);
	bool sensor = digitalRead(SENSOR);
	digitalWrite(LED_PIN, sensor);

	if (!sensor)
	{
		cycle = CYCLES * CYCLE_LENGTH;
	}
	else if (cycle < CYCLES * CYCLE_LENGTH)
	{
		cycle++;
	}
}

void loop()
{
	dnsServer.processNextRequest();
	server.handleClient();

	uint8_t customSchedulerChannel = customScheduler.tick();
	if (customSchedulerChannel > 0)
	{
		cycle = 0;
	}

	moveMotor();
}
