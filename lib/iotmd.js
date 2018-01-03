const Signature = require('./iot');
const axios = require('axios');

const host = 'iotdm.gz.baidubce.com';


axios.defaults.baseURL = `https://${host}`;

function request(options) {
  const {method, uri, params} = options;
  return axios({
    method: method,
    url: uri,
    data: params,
    headers: {
      Authorization: new Signature(host, method, uri, params).getSignature()
    }
  })
}

/**
 * 创建物模板
 * @param name
 * @param description
 * @param properties
 * @returns {Promise}
 */
/*
exports.createSchema = (name, description, properties) => {
  const options = {
    method: 'POST',
    uri: '/v3/iot/management/schema',
    params: {
      name: name,
      description: description,
      properties: properties
    }
  }
  return new Promise((resolve) => {
    request(options).then((result) => {
      resolve(result);
    }).catch((error) => {
      console.log(error);
    });
  })
}
*/
exports.schemaList = () => {
  const options = {
    method: 'GET',
    uri: '/v3/iot/management/schema',
    params: {}
  }
  return new Promise((resolve) => {
    request(options).then((result) => {
      resolve(result);
    }).catch((error) => {
      console.log(error);
    });
  })
}
exports.deviceList = () => {
  const method = 'GET';
  const uri = '/v3/iot/management/device';
  const params = {};
  return new Promise((resolve) => {
    axios({
      method: method,
      url: uri,
      data: params,
      headers: {
        Authorization: new Signature(host, method, uri, params).getSignature()
      }
    }).then((result) => {
      resolve(result);
    }).catch((error) => {
      console.log(error);
    });
  })
}
/**
 * 创建设备
 * @param deviceName 设备名称
 * @param description 描述
 * @param schemaId 物模型ID
 * @returns {Promise}
 */
exports.createDevice = (deviceName, description, schemaId) => {
  const method = 'POST';
  const uri = '/v3/iot/management/device';
  const params = {
    deviceName: deviceName,
    description: description,
    schemaId: schemaId
  }
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: uri,
      data: params,
      headers: {
        Authorization: new Signature(host, method, uri, params).getSignature()
      }
    }).then((result) => {
      resolve(result);
    }).catch((error) => {
      console.log(error);
    });
  })
}
