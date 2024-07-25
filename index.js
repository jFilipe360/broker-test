var mqtt = require('mqtt');
require('dotenv').config();

/* Ensure all required environment variables are defined */
const requiredEnvVars = [
    'MQTT_PORT',
    'MQTT_HOST',
    'MQTT_USER',
    'MQTT_PASS',
    'MQTT_CAUDAL_TOPIC'
];

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Environment variable ${envVar} is not defined`);
    }
});

/* MQTT connection options */
var options = {
    port: process.env.MQTT_PORT,
    host: process.env.MQTT_HOST,
    clientId: 'test-mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS
};

var client = mqtt.connect(options);
var caudalNivel = 50; // Initial default flow rate

/* On MQTT connection, subscribe to flow rate topic */
client.on('connect', function () {
    console.log("MQTT connected");
    client.subscribe(process.env.MQTT_CAUDAL_TOPIC, function (err) {
        if (!err) {
            console.log("Subscribed to flow rate topic");
        } else {
            console.error("Failed to subscribe to flow rate topic:", err);
        }
    });
});

/* Handle flow rate change messages */
client.on('message', function (topic, message) {
    if (topic === process.env.MQTT_CAUDAL_TOPIC) {
        let newCaudalNivel = parseInt(message.toString());
        if (!isNaN(newCaudalNivel) && newCaudalNivel >= 0 && newCaudalNivel <= 100) {
            caudalNivel = newCaudalNivel;
            console.log("Flow rate level updated to " + caudalNivel + "%");
        } else {
            console.error("Received invalid flow rate level:", message.toString());
        }
    }
});

/* On MQTT error, handle disconnect */
client.on('disconnect', handleDisconnect);
client.on('end', handleEnd);
client.on('error', handleErr);

function handleDisconnect() {
    console.log("MQTT disconnected");
}

function handleEnd() {
    console.log("MQTT connection ended");
}

function handleErr(err) {
    console.log("MQTT error:", err.message);
}