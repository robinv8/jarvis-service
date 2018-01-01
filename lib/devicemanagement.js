function Management(mqtt, deviceName) {
  this.mqtt = mqtt;
  this.deviceName = deviceName;
  this.prefix = `$baidu/iot/shadow/${this.deviceName}/`;
  /**
   * 更新物影子
   */
  this.update = (params) => {
    this.mqtt.client.subscribe(`${this.prefix}update`, {
      qos: 0,
    });
    this.mqtt.client.subscribe(`${this.prefix}update/accepted`, {
      qos: 0,
    });
    this.mqtt.client.subscribe(`${this.prefix}update/rejected`, {
      qos: 0,
    });
    this.mqtt.client.publish(`$baidu/iot/shadow/${this.deviceName}/update`, JSON.stringify({
      requestId: Math.random().toString(16).substr(2, 8),
      reported: {
        status: params.status,
      },
    }), {
      qos: 0,
      retain: false,
    });
  };

  this.get = () => {
  };
  this.delta = () => {

  };
  this.delete = () => {

  };
  this.updateDocument = () => {

  };
  this.updateSnapshot = () => {

  };
  this.communication = () => {

  };
}

module.exports = Management;