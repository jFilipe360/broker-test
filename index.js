var mqtt = require('mqtt');
require('dotenv').config();

/* Ensure all required environment variables are defined */
const requiredEnvVars = [
    'MQTT_PORT',
    'MQTT_HOST',
    'MQTT_USER',
    'MQTT_PASS',
    'MQTT_TOPIC',
    'MQTT_INTERVAL_TOPIC'
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

var client = mqtt.connect(process.env.MQTT_HOST, options);
var intervalID;
var intervalTime = 5000; // Default interval time
var currentDate;


/* returns a random float with 2 decimal points between minimum and maximum */
function rf(minimum, maximum) {
    value = (Math.random() * (maximum - minimum)) + minimum;
    return value.toFixed(2);
}

/* On MQTT connection, starts the sendData function and subscribes to interval changes */
client.on('connect', function () {
    console.log("MQTT connected");
    intervalID = sendData();
    client.subscribe(process.env.MQTT_INTERVAL_TOPIC, function (err) {
        if (!err) {
            console.log("Subscribed to interval topic");
        } else {
            console.error("Failed to subscribe to interval topic:", err);
        }
    });
});

/* On MQTT error, stops the sendData function */
client.on('disconnect', handleDisconnect);
client.on('end', handleEnd);
client.on('error', handleErr);

function handleDisconnect() {
    console.log("MQTT disconnected, clearing interval...");
    clearInterval(intervalID);
}

function handleEnd() {
    console.log("MQTT ended, clearing interval...");
    clearInterval(intervalID);
}

function handleErr() {
    console.log("MQTT error, clearing interval...");
    clearInterval(intervalID);
}

/* Handle interval change messages */
client.on('message', function (topic, message) {
    if (topic === process.env.MQTT_INTERVAL_TOPIC) {
        let newIntervalTime = parseInt(message.toString());
        if (!isNaN(newIntervalTime) && newIntervalTime > 0) {
            intervalTime = newIntervalTime;
            updateInterval();
        } else {
            console.error("Received invalid interval time:", message.toString());
        }
    }
});

class virtualSensor {
    sendStateUpdate(newdata) {
        client.publish(process.env.MQTT_TOPIC, newdata, (err) => {
            if (err) {
                console.error("Failed to publish data:", err);
            }
        });
    }
}

let ph = new virtualSensor();
let optod = new virtualSensor();
let c4e = new virtualSensor();

function sendData() {
    return setInterval(function () {
        currentDate = new Date();
        var timestamp = currentDate.toLocaleTimeString();

        let phdata = '{"ref":"ph", "temp":"' + rf(15, 27) + '", "pH": "' + rf(0, 14) + '", "redox":"' + rf(0, 1) + '"}';
        ph.sendStateUpdate(phdata);

        let optoddata = '{"ref":"optod", "temp":"' + rf(15, 27) + '", "oxSat": "' + rf(0, 100) + '", "oxMg":"' + rf(0, 100) + '","oxPpm":"' + rf(0, 100) + '"}';
        optod.sendStateUpdate(optoddata);

        let c4edata = '{"ref":"c4e", "temp":"' + rf(15, 27) + '", "conductivity": "' + rf(0, 800) + '", "salinity":"' + rf(0, 35) + '","tds":"' + rf(0, 200) + '"}';
        c4e.sendStateUpdate(c4edata);

        console.log("Data published at " + timestamp);
    }, intervalTime);
}

function updateInterval() {
    clearInterval(intervalID);
    intervalID = sendData();
    console.log("Interval updated to " + intervalTime + " ms");
}