const BaseBot = require('bot-sdk');
const config = require('../config/key');
const DeviceManagement = require('./devicemanagement');
const {createDevice, deviceList, schemaList} = require('./iotmd');

class Bot extends BaseBot {
  constructor(postData, mqtt) {
    super(postData);
    const management = new DeviceManagement(mqtt.mqttManagement, config.switchControl.deviceInfo.name);
    management.get();
    this.addLaunchHandler(() => {
      this.waitAnswer();
      return {
        outputSpeech: '欢迎使用设备控制!',
      };
    });
    this.addSessionEndedHandler(() => {
      this.endSession();
      return {
        outputSpeech: '谢谢使用设备控制！',
      };
    });
    this.addIntentHandler('control_light', () => {
      const name = this.getSlot('device_name');
      const loc = this.getSlot('home_loc');
      const control = this.getSlot('switch_control');
      if (!name) {
        this.nlu.ask('device_name');
        const text = '是什么设备？';
        const card = new Bot.Card.TextCard(text);
        return Promise.resolve({
          card,
          outputSpeech: `${text}`,
        });
      }
      if (!loc) {
        this.nlu.ask('home_loc');
        const text = `是哪里的${name}？`;
        const card = new Bot.Card.TextCard(text);
        return Promise.resolve({
          card,
          outputSpeech: `${text}`,
        });
      }
      if (!control) {
        this.nlu.ask('switch_control');
        const text = '打开还是关闭？';
        const card = new Bot.Card.TextCard(text);
        return Promise.resolve({
          card,
          outputSpeech: `${text}`,
        });
      }
      if (this.request.isDialogStateCompleted()) {
        const text = `已为您${control === '关' ? '关闭' : '打开'}${loc}的${name}！`;
        const card = new Bot.Card.TextCard(text);
        mqtt.client.subscribe(config.switchControl.topic, {qos: 0});

        mqtt.client.publish(config.switchControl.topic, control === '关' ? '0' : '1', {qos: 0, retain: false});
        const params = {
          status: control === '关' ? '0' : '1',
        };
        management.update(params);
        return Promise.resolve({
          card,
          outputSpeech: `${text}`,
        });
      }
    });
    this.addIntentHandler('operate_device', async () => {
      const name = this.getSlot('device_name');
      const loc = this.getSlot('home_loc');
      const control = this.getSlot('switch_control');
      const operate = this.getSlot('operate_type');

      console.log(operate, loc, control, name);
      if (operate === 'query') {
        //this.nlu.ask('operate_type');
        const result = await schemaList().then(result => result);
        console.log(result);
        const text = `查询到${result.totalCount}个设备`;


        let card = new Bot.Card.TextCard(text);
        return new Promise(function (resolve, reject) {
          resolve({
            card: card,
            outputSpeech: text
          });
        });
      }
    })
  }
}

module.exports = Bot;
