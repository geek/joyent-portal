const request = require('./request');

module.exports.list = (ctx) => { return request('listPackages', ctx); };
module.exports.get = ({ id, name }) => { return request.fetch(`/:login/packages/${id || name}`); };
