var mqtt = require('mqtt');
require('dotenv').config();

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

/* returns a random float with 2 decimal points between minimum and maximum */
function rf(minimum, maximum) {
    value = (Math.random() * (maximum - minimum)) + minimum;
    return value.toFixed(2);
}
/* On MQTT connection, starts the sendData function */
client.on('connect', function () {
    console.log("MQTT connected");
    intervalID = sendData();
})

/* On MQTT error, stops the sendData function */
client.on('disconnect', function () {
    console.log("MQTT disconnected, connecting...");
    clearInterval(intervalID);
})
client.on('end', function () {
    console.log("MQTT disconnected, connecting...");
    clearInterval(intervalID);
})
client.on('error', function () {
    console.log("MQTT disconnected, connecting...");
    clearInterval(intervalID);
})

class virtualSensor {
    sendStateUpdate (newdata) {
        client.publish(process.env.MQTT_TOPIC, newdata);
    }
}

let ph = new virtualSensor();
let optod = new virtualSensor();
let c4e = new virtualSensor();

function sendData() {
    return setInterval(function(){
        phdata = '{"ref":"ph", "temp":"'+rf(15, 27)+'", "pH": "'+rf(0, 14)+'", "redox":"'+rf(0, 1)+'"}';
        ph.sendStateUpdate(phdata);
        
        optoddata = '{"ref":"optod", "temp":"'+rf(15, 27)+'", "oxSat": "'+rf(0, 100)+'", "oxMg":"'+rf(0, 100)+'","oxPpm":"'+rf(0, 100)+'"}';
        optod.sendStateUpdate(optoddata);

        c4edata = '{"ref":"c4e", "temp":"'+rf(15, 27)+'", "condutivity": "'+rf(0, 800)+'", "salinity":"'+rf(0, 35)+'","tds":"'+rf(0, 200)+'"}';
        c4e.sendStateUpdate(c4edata);

        console.log("Data published");
    },5000);
}