'use strict';

// const Assert = require('assert');
const TritonWatch = require('triton-watch');
const auth = require('smartdc-auth');

const DEPLOYMENT_GROUP = 'docker:label:com.docker.compose.project';
const SERVICE = 'docker:label:com.docker.compose.service';
const HASH = 'docker:label:com.docker.compose.config-hash';

module.exports = class Watcher {
  constructor (options) {
    options = options || {};

    // todo assert options
    this._data = options.data;

    this._tritonWatch = new TritonWatch({
      frequency: 500,
      triton: {
        url: options.url, // process.env.SDC_URL
        account: options.account, // process.env.SDC_ACCOUNT
        user: options.user, // proces..env.SDC_USER
        sign: auth.cliSigner({
          keyId: options.keyId, // process.env.SDC_KEY_ID
          user: options.account, // process.env.SDC_ACCOUNT
          subuser: options.user // process.env.SDC_USER
        })
      }
    });

    this._tritonWatch.on('change', (container) => { return this.onChange(container); });
  }

  getDeploymentGroup (name, fn) {
    this._data.getDeploymentGroup({ name }, (err, dg) => {
      if (err) {
        return fn(err, false);
      }

      if (!dg) {
        return fn();
      }

      return fn(null, dg.id);
    });
  }

  getService ({ serviceName, deploymentGroupId }, fn) {
    this._data.getServices({
      name: serviceName,
      deploymentGroupId
    }, (err, services) => {
      if (err) {
        return fn(err, false);
      }

      if (!services || !services.length) {
        return fn();
      }

      return fn(null, services.pop().id);
    });
  }

  getInstance (machineId, fn) {
    this._data.getInstances({ machineId }, (err, instances) => {
      if (err) {
        return fn(err, false);
      }

      if (!instances || !instances.length) {
        return fn();
      }

      return fn(null, instances.pop());
    });
  }

  resolve ({ machine, deploymentGroupId, serviceId, instance }) {

  }

  onChange (machine) {
    if (!machine) {
      console.error('`change` event received without any machine data');
      return;
    }

    const { id, tags = [] } = machine;

    // assert id existence
    if (!id) {
      console.error('`change` event received for a machine without `id`');
      return;
    }

    // assert that it's a docker-compose project
    const isCompose = [DEPLOYMENT_GROUP, SERVICE, HASH].every(
      (name) => { return tags[name]; }
    );

    if (!isCompose) {
      console.error(`Changed machine ${id} was not provisioned by docker-compose`);
      return;
    }

    const deploymentGroupName = tags[DEPLOYMENT_GROUP];
    const serviceName = tags[SERVICE];

    const handleError = (fn) => {
      return (err, ...rest) => {
        if (err) {
          console.error(err);
          return;
        }

        fn(null, ...rest);
      };
    };

    const fetchInstance = (deploymentGroupId, serviceId) => {
      this.getInstance(id, handleError((_, instance) => {
        return this.resolve({
          machine,
          deploymentGroupId,
          serviceId,
          instance
        });
      }));
    };

    // assert that service exists
    const assertService = (deploymentGroupId) => {
      this.getService({
        serviceName,
        deploymentGroupId
      }, handleError((_, serviceId) => {
        if (!serviceId) {
          console.error(`Service "${serviceName}" form DeploymentGroup "${deploymentGroupName}" for machine ${id} not found`);
          return;
        }

        fetchInstance(deploymentGroupId, serviceId);
      });
    };

    // assert that project managed by this portal
    const assertDeploymentGroup = () => {
      this.getDeploymentGroup(deploymentGroupName, handleError((_, deploymentGroupId) => {
        if (!deploymentGroupId) {
          console.error(`DeploymentGroup "${deploymentGroupName}" for machine ${id} not found`);
          return;
        }

        assertService(deploymentGroupId);
      });
    };

    assertDeploymentGroup();
  }
};
