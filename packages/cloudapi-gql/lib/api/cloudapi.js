'use strict';

const Crypto = require('crypto');
const Fs = require('fs');
const Util = require('util');
const Bunyan = require('bunyan');
const CloudApi = require('triton/lib/cloudapi2');
const Wreck = require('wreck');


const internals = {
  url: process.env.SDC_URL,
  keyId: process.env.SDC_KEY_ID,
  key: Fs.readFileSync(process.env.SDC_KEY_PATH),
  log: Bunyan.createLogger({
    name: 'cloudapi'
  })
};


module.exports = function (methodName, args, request) {
  const cloudapi = new internals.CloudApi({
    token: request.auth.credentials.token,
    account: 'my' //request.auth.credentials.profile.login
  });
  if (methodName === 'fetch') {
    return cloudapi.fetch(args);
  }

  return new Promise((resolve, reject) => {
    cloudapi[methodName](args, (err, result) => {
      if (err) {
        return reject(err);
      }

      return resolve(result);
    });
  });
  //const method = Util.promisify();
  //return method.call(cloudapi, args);
};


internals.CloudApi = class extends CloudApi.CloudApi {
  constructor (options) {
    options.url = internals.url;
    options.sign = () => {};
    options.log = internals.log;
    super(options);

    this.token = options.token;
  }

  authHeaders () {
    const now = new Date().toUTCString();
    const signer = Crypto.createSign('sha256');
    signer.update(now);
    const signature = signer.sign(internals.key, 'base64');

    return {
      Date: now,
      Authorization: `Signature keyId="${internals.keyId}",algorithm="rsa-sha256" ${signature}`,
      'X-Auth-Token': this.token
    };
  }

  _getAuthHeaders (method, path, callback) {

    return callback(null, this.authHeaders());
  }

  fetch (options = {}) {
    const wreckOptions = {
      headers: this.authHeaders(),
      baseUrl: internals.url,
      json: true
    };

    wreckOptions.headers = Object.assign({ 'Content-Type': 'application/json' }, wreckOptions.headers, options.headers);
    const method = options.method && options.method.toLowerCase() || 'get';

    return Wreck[method](options.path, wreckOptions);
  }
};
