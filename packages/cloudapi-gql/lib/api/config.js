const { fetch } = require('./request');

module.exports = () => { return fetch('/:login/config'); };
