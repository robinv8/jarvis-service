const mqtt = require('mqtt');

function Client(url, username, password) {
  this.url = url;
  this.username = username;
  this.password = password;
  this.clientId = `mqttjs_${Math.random().toString(16).substr(2, 8)}`;
  this.client = mqtt.connect(url, {
    clientId: this.clientId,
    username: this.username,
    password: this.password,
  });
  this.client.on('error', (err) => {
    console.log(err);
    this.client.end();
  });

  this.client.on('connect', () => {
    console.log(`client connected:${this.clientId}`);
  });

  this.client.on('message', (topic, message) => {
    console.log(`Received Message:= ${message.toString()} 
On topic:= ${topic}`);
  });
  this.client.on('close', () => {
    console.log(`${this.clientId} disconnected`);
  });
  return this;
}

module.exports = Client;
