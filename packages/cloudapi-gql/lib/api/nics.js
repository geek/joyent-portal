const request = require('./request');

module.exports.list = () => { return request('listNics'); };
module.exports.get = (ctx) => { return request('getNic', ctx); };
module.exports.add = (ctx) => { return request(''); };
module.exports.destroy = (ctx) => { return request(''); };
