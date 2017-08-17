'use strict';

module.exports = (data) => {
  const queryWrap = function (name) {
    return function (options, request, cb) {
      return data[name](options, cb);
    };
  };

  const mutationWrap = function (name) {
    return function (options, request, cb) {
      return data[name](options, cb);
    };
  };

  const queries = [
    'portal',
    'deploymentGroups',
    'deploymentGroup',
    'services',
    'service',
    'instances',
    'instance',
    'metricTypes',
    'metricData',
    'package',
    'datacenters',
    'instanceMetric',
    'config',
    'importableDeploymentGroups',
    'metrics'
  ];

  const mutations = [
    'createDeploymentGroup',
    'updateDeploymentGroup',
    'deleteDeploymentGroup',
    'provisionManifest',
    'scale',
    'stopServices',
    'startServices',
    'restartServices',
    'deleteServices',
    'stopInstances',
    'startInstances',
    'restartInstances',
    'importDeploymentGroup'
  ];

  const resolvers = {};

  queries.forEach((query) => {
    const functionName = 'get' + query[0].toUpperCase() + query.slice(1);
    resolvers[query] = queryWrap(functionName);
  });

  mutations.forEach((mutation) => {
    resolvers[mutation] = mutationWrap(mutation);
  });

  return resolvers;
};
