const express = require('express');
const path = require('path');
//const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const index = require('./routes/index');
const users = require('./routes/users');
const Bot = require('./lib/Bot');
const MqttClient = require('./lib/mqttclient');
const {url, switchControl} = require('./config/key');


const app = express();
const mqtt = new MqttClient(url, switchControl.username, switchControl.password);

const DeviceInfo = switchControl.deviceInfo;
const mqttManagement = new MqttClient(DeviceInfo.url, DeviceInfo.username, DeviceInfo.password);
mqtt.mqttManagement = mqttManagement;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler


app.get('/jarvis', (req, res) => {
  res.send('helloworld!');
})
// 监听post请求，DuerOS以http POST的方式来请求你的服务，[具体协议请参考](http://TODO)
app.post('/jarvis', (req, res) => {
  req.rawBody = '';

  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    req.rawBody += chunk;
  });

  req.on('end', () => {
    const b = new Bot(JSON.parse(req.rawBody), mqtt);
    // 开启签名认证
    // 为了避免你的服务被非法请求，建议你验证请求是否来自于DuerOS
    b.initCertificate(req.headers, req.rawBody).enableVerifyRequestSign();

    /**
     * 如果需要监控统计功能
     *
     * bot-sdk 集成了监控sdk，参考：https://www.npmjs.com/package/bot-monitor-sdk
     * 打开此功能，对服务的性能有一定的耗时增加。另外，需要在DBP平台上面上传public key，这里使用私钥签名
     * 文档参考：https://dueros.baidu.com/didp/doc/dueros-bot-platform/dbp-deploy/authentication_markdown
     /* *!/
     b.setPrivateKey(__dirname + '/rsa_private_key.pem').then(function (key) {
      // 0: debug  1: online
      b.botMonitor.setEnvironmentInfo(key, 0);

      b.run().then(function (result) {
        res.send(result);
      });
    }, function (err) {
      console.error('error');
    });*/


    // 不需要监控
    // b.run() 返回一个Promise的实例
    b.run().then((result) => {
      res.send(result);
    });
  });
});
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
