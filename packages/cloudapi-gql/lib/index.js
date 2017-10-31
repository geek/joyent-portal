'use strict';

const Fs = require('fs');
const Path = require('path');
const Graphi = require('graphi');
const Package = require('../package.json');
const Resolvers = require('./schema/resolvers');
const Schema = Fs.readFileSync(Path.join(__dirname, '/schema/schema.graphql'));


module.exports = function (server, options, next) {
  const graphiOptions = {
    graphiqlPath: false,
    schema: Schema,
    resolvers: Resolvers
  };

  server.register({ register: Graphi, options: graphiOptions }, next);
};

module.exports.attributes = {
  pkg: Package
};
