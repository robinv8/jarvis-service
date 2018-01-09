const {Auth} = require('baidubce-sdk');

const AK = '7b532895e8f2495cbc92f8a608a42748';
const SK = 'e1f231c1a20c48bc9b408f78e8bf8b83';

/**
 *
 * @param host
 * @param method
 * @param uri
 * @param params
 * @returns {string}
 */
const auth = new Auth(AK, SK);

function Signature(host, method, uri, params) {
  this.host = host;
  this.method = method;
  this.uri = uri;
  this.params = params;
  this.headers = {
    Host: this.host
  }
  this.getSignature = () => auth.generateAuthorization(this.method, this.uri, this.params, this.headers);

}

module.exports = Signature;