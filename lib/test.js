const {Auth} = require('baidubce-sdk');

const auth = new Auth('7b532895e8f2495cbc92f8a608a42748', 'e1f231c1a20c48bc9b408f78e8bf8b83');
const axios = require('axios');

const host = 'iotdm.gz.baidubce.com'
const method = 'GET';
const uri = '/v3/iot/management/device';
const headers = {
  Host: host,
};
const signature = auth.generateAuthorization(method, uri, {}, headers);
axios.defaults.baseURL = `https://${host}`;
axios.defaults.headers.common.Authorization = signature;
// axios.defaults.headers.common['Host'] = 'iot.bj.baidubce.com';
axios.get('/v3/iot/management/device').then((result) => {
  console.log(result);
}).catch((error) => {
  console.log(error);
});
