const request = require('./request');

module.exports = () => { return request('listDatacenters'); };
// this method is useless since it only "returns an HTTP redirect to your client, where the datacenter url is in the Location header"
// module.exports.get = ({ name }) => request.fetch(`/:login/datacenters/${name}`);
