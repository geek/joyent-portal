'use strict';

const CloudApi = require('./cloudapi');


exports.list = (args, request) => {
  return CloudApi('listMachines', args, request);
};

exports.get = (args, request) => {
  return CloudApi('getMachine', args, request);
};

exports.create = (args, request) => {
  return CloudApi('createMachine', args, request);
};

exports.stop = ctx => CloudApi('stopMachine', ctx);
exports.start = uuid => CloudApi('startMachine', uuid);
exports.startFromSnapshot = ctx => CloudApi('startMachineFromSnapshot', ctx);
exports.reboot = ctx => CloudApi('rebootMachine', ctx);

exports.resize = (args, request) => {
  const options = {
    path: `/my/machines/${args.id}?action=resize?package=${args.package}`
  };
  return CloudApi('fetch', options, request);
};

exports.rename = ctx => CloudApi('', ctx);
module.exports.destroy = ctx => CloudApi('deleteMachine', ctx);
module.exports.audit = ({ id }) => CloudApi('machineAudit', id);

module.exports.snapshots = {
  list: ctx => CloudApi('listMachineSnapshots', ctx),
  get: ctx => CloudApi('getMachineSnapshot', ctx),
  create: ctx => CloudApi('createMachineSnapshot', ctx),
  destroy: ctx => CloudApi('deleteMachineSnapshot', ctx)
};

module.exports.metadata = {
  list: ({ id }, request) => {
    const options = {
      path: `/my/machines/${id}/metadata`
    };
    return CloudApi('fetch', options, request);
  },
  get: ({ id, key }, request) => {
    const options = {
      path: `/my/machines/${id}/metadata/${key}`
    };
    return CloudApi('fetch', options, request);
  },
  destroy: ctx => Request('', ctx)
};

exports.firewall = {
  enable: ctx => CloudApi('enableMachineFirewall', ctx),
  disable: ctx => CloudApi('disableMachineFirewall', ctx)
};

exports.tags = {
  list: ctx => CloudApi('listMachineTags', ctx),
  get: ctx => CloudApi('getMachineTag', ctx),
  add: ctx => CloudApi('addMachineTags', ctx),
  replace: ctx => CloudApi('replaceMachineTags', ctx),
  destroy: ctx =>
    CloudApi(ctx.tag ? 'deleteMachineTag' : 'deleteMachineTags', ctx)
};
