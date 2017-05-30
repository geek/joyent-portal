'use strict';

const { expect } = require('code');
const Lab = require('lab');
const PortalData = require('../');

const lab = (exports.lab = Lab.script());
const it = lab.it;
const describe = lab.describe;

const internals = {
  options: { name: 'test', db: { test: true } }
};

describe('connect()', () => {
  it('connects to the database', (done) => {
    const data = new PortalData(internals.options);
    data.connect(done);
  });
});

describe('portals', () => {
  describe('createPortal()', () => {
    it('creates a new portal', (done) => {
      const data = new PortalData(internals.options);
      data.connect((err) => {
        expect(err).to.not.exist();

        const portal = {
          username: 'tom'
        };

        data.createPortal(portal, (err, result) => {
          expect(err).to.not.exist();
          expect(result.id).to.exist();
          expect(result.username).to.equal(portal.username);
          done();
        });
      });
    });
  });

  describe('getPortal()', () => {
    it('retrieves a single portal record', (done) => {
      const data = new PortalData(internals.options);
      data.connect((err) => {
        expect(err).to.not.exist();
        const datacenter = {
          region: 'us-sw-1'
        };

        data.createDatacenter(datacenter, (err, createdDatacenter) => {
          expect(err).to.not.exist();
          const portal = {
            username: 'tom',
            datacenter: {
              id: createdDatacenter.id
            }
          };

          data.createPortal(portal, (err, createdPortal) => {
            expect(err).to.not.exist();
            expect(createdPortal.id).to.exist();
            data.getPortal((err, retrievedPortal) => {
              expect(err).to.not.exist();
              expect(retrievedPortal.id).to.exist();
              expect(retrievedPortal.username).to.equal(portal.username);
              done();
            });
          });
        });
      });
    });
  });
});

describe('deployment groups', () => {
  describe('createDeploymentGroup()', () => {
    it('creates a deployment group record in the deployment_groups table', (done) => {
      const data = new PortalData(internals.options);
      const name = 'User Services';

      data.connect((err) => {
        expect(err).to.not.exist();
        data.createDeploymentGroup({ name }, (err, deploymentGroup) => {
          expect(err).to.not.exist();
          expect(deploymentGroup.id).to.exist();
          done();
        });
      });
    });
  });

  describe('getDeploymentGroup()', () => {
    it('gets a deployment group record from the deployment_groups table', (done) => {
      const data = new PortalData(internals.options);
      const name = 'User Services';

      data.connect((err) => {
        expect(err).to.not.exist();
        data.createDeploymentGroup({ name }, (err, createdDeploymentGroup) => {
          expect(err).to.not.exist();
          expect(createdDeploymentGroup.id).to.exist();
          data.getDeploymentGroup({ id: createdDeploymentGroup.id }, (err, deploymentGroup) => {
            expect(err).to.not.exist();
            expect(deploymentGroup).to.equal(createdDeploymentGroup);
            done();
          });
        });
      });
    });
  });

  describe('getDeploymentGroups()', () => {
    it('gets a list of deployment group records from the deployment_groups table', (done) => {
      const data = new PortalData(internals.options);
      const name = 'User Services';

      data.connect((err) => {
        expect(err).to.not.exist();
        data.createDeploymentGroup({ name }, (err, createdDeploymentGroup1) => {
          expect(err).to.not.exist();
          expect(createdDeploymentGroup1.id).to.exist();
          data.createDeploymentGroup({ name }, (err, createdDeploymentGroup2) => {
            expect(err).to.not.exist();
            expect(createdDeploymentGroup1.id).to.exist();

            data.getDeploymentGroups({ ids: [createdDeploymentGroup1.id, createdDeploymentGroup2.id] }, (err, deploymentGroups) => {
              expect(err).to.not.exist();
              expect(deploymentGroups.length).to.equal(2);
              data.getDeploymentGroups({ name }, (err, deploymentGroups) => {
                expect(err).to.not.exist();
                expect(deploymentGroups.length).to.equal(2);
                done();
              });
            });
          });
        });
      });
    });
  });
});

describe('datacenters', () => {
  describe('createDatacenter()', () => {
    it('creates a new datacenter record', (done) => {
      const data = new PortalData(internals.options);
      data.connect((err) => {
        expect(err).to.not.exist();
        const datacenter = {
          region: 'us-sw-1'
        };

        data.createDatacenter(datacenter, (err, result) => {
          expect(err).to.not.exist();
          expect(result.id).to.exist();
          expect(result.region).to.equal(datacenter.region);
          done();
        });
      });
    });
  });

  describe('getDatacenter()', () => {
    it('retrieves a datacenter record from an id', (done) => {
      const data = new PortalData(internals.options);
      data.connect((err) => {
        expect(err).to.not.exist();
        const datacenter = {
          region: 'us-sw-1'
        };

        data.createDatacenter(datacenter, (err, createdDatacenter) => {
          expect(err).to.not.exist();
          expect(createdDatacenter.id).to.exist();
          data.getDatacenter({ id: createdDatacenter.id }, (err, retrievedDatacenter) => {
            expect(err).to.not.exist();
            expect(retrievedDatacenter.region).to.equal(datacenter.region);
            done();
          });
        });
      });
    });

    it('retrieves a datacenter record from a region', (done) => {
      const data = new PortalData(internals.options);
      data.connect((err) => {
        expect(err).to.not.exist();
        const datacenter = {
          region: 'us-sw-1'
        };

        data.createDatacenter(datacenter, (err, createdDatacenter) => {
          expect(err).to.not.exist();
          expect(createdDatacenter.id).to.exist();
          data.getDatacenter({ region: createdDatacenter.region }, (err, retrievedDatacenter) => {
            expect(err).to.not.exist();
            expect(retrievedDatacenter.region).to.equal(datacenter.region);
            done();
          });
        });
      });
    });
  });

  describe('getDatacenters()', () => {
    it('retrieves all datacenter records', (done) => {
      const data = new PortalData(internals.options);
      data.connect((err) => {
        expect(err).to.not.exist();
        const datacenter1 = {
          region: 'us-sw-1'
        };

        const datacenter2 = {
          region: 'us-west-1'
        };

        data.createDatacenter(datacenter1, (err, createdDatacenter1) => {
          expect(err).to.not.exist();
          data.createDatacenter(datacenter2, (err, createdDatacenter2) => {
            expect(err).to.not.exist();
            data.getDatacenters((err, datacenters) => {
              expect(err).to.not.exist();
              expect(datacenters.length).to.equal(2);
              done();
            });
          });
        });
      });
    });
  });
});


describe('versions', () => {
  describe('createVersion()', () => {
    it('creates a new version record in the versions table', (done) => {
      const data = new PortalData(internals.options);
      data.connect((err) => {
        expect(err).to.not.exist();
        data.createDeploymentGroup({ name: 'something' }, (err, deploymentGroup) => {
          expect(err).to.not.exist();
          const clientManifest = {
            deploymentGroupId: deploymentGroup.id,
            type: 'compose',
            format: 'yml',
            raw: 'docker compose raw contents',
            json: { services: [] }
          };

          data.provisionManifest(clientManifest, (err, manifest) => {
            expect(err).to.not.exist();

            const clientVersion = {
              manifestId: manifest.id,
              scales: [{
                serviceName: 'consul',
                replicas: 3
              }],
              plan: {
                running: true,
                actions: [{
                  type: 'start',
                  service: 'consul',
                  machines: ['vmid', 'vmid']
                }]
              }
            };

            data.createVersion(clientVersion, (err, result) => {
              expect(err).to.not.exist();
              expect(result.id).to.exist();
              expect(result.scales).to.equal(clientVersion.scales);
              done();
            });
          });
        });
      });
    });
  });

  describe('getVersion()', () => {
    it('retrieves a version record with an id or manifestId', (done) => {
      const data = new PortalData(internals.options);
      data.connect((err) => {
        expect(err).to.not.exist();
        data.createDeploymentGroup({ name: 'something' }, (err, deploymentGroup) => {
          expect(err).to.not.exist();
          const clientManifest = {
            deploymentGroupId: deploymentGroup.id,
            type: 'compose',
            format: 'yml',
            raw: 'docker compose raw contents',
            json: { services: [] }
          };

          data.provisionManifest(clientManifest, (err, manifest) => {
            expect(err).to.not.exist();

            const clientVersion = {
              manifestId: manifest.id,
              scales: [{
                serviceName: 'consul',
                replicas: 3
              }],
              plan: {
                running: true,
                actions: [{
                  type: 'start',
                  service: 'consul',
                  machines: ['vmid', 'vmid']
                }]
              }
            };

            data.createVersion(clientVersion, (err, result) => {
              expect(err).to.not.exist();
              expect(result.id).to.exist();
              expect(result.scales).to.equal(clientVersion.scales);
              data.getVersion({ id: result.id }, (err, retrievedVersion1) => {
                expect(err).to.not.exist();
                expect(retrievedVersion1.id).to.equal(result.id);
                data.getVersion({ manifestId: result.manifestId }, (err, retrievedVersion2) => {
                  expect(err).to.not.exist();
                  expect(retrievedVersion1.id).to.equal(retrievedVersion2.id);
                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  describe('getVersions()', () => {
    it('retrieve versions records with a manifestId', (done) => {
      const data = new PortalData(internals.options);
      data.connect((err) => {
        expect(err).to.not.exist();
        data.createDeploymentGroup({ name: 'something' }, (err, deploymentGroup) => {
          expect(err).to.not.exist();
          const clientManifest = {
            deploymentGroupId: deploymentGroup.id,
            type: 'compose',
            format: 'yml',
            raw: 'docker compose raw contents',
            json: { services: [] }
          };

          data.provisionManifest(clientManifest, (err, manifest) => {
            expect(err).to.not.exist();

            const clientVersion = {
              manifestId: manifest.id,
              scales: [{
                serviceName: 'consul',
                replicas: 3
              }],
              plan: {
                running: true,
                actions: [{
                  type: 'start',
                  service: 'consul',
                  machines: ['vmid', 'vmid']
                }]
              }
            };

            data.createVersion(clientVersion, (err, result) => {
              expect(err).to.not.exist();
              expect(result.id).to.exist();
              expect(result.scales).to.equal(clientVersion.scales);
              data.getVersions({ manifestId: clientVersion.manifestId }, (err, versions) => {
                expect(err).to.not.exist();
                expect(versions.length).to.equal(1);
                done();
              });
            });
          });
        });
      });
    });

    it('retrieve versions records with a deployment group id', (done) => {
      const data = new PortalData(internals.options);
      data.connect((err) => {
        expect(err).to.not.exist();
        data.createDeploymentGroup({ name: 'something' }, (err, deploymentGroup) => {
          expect(err).to.not.exist();
          const clientManifest = {
            deploymentGroupId: deploymentGroup.id,
            type: 'compose',
            format: 'yml',
            raw: 'docker compose raw contents',
            json: { services: [] }
          };

          data.provisionManifest(clientManifest, (err, manifest) => {
            expect(err).to.not.exist();

            const clientVersion = {
              manifestId: manifest.id,
              scales: [{
                serviceName: 'consul',
                replicas: 3
              }],
              plan: {
                running: true,
                actions: [{
                  type: 'start',
                  service: 'consul',
                  machines: ['vmid', 'vmid']
                }]
              }
            };

            data.createVersion(clientVersion, (err, version) => {
              expect(err).to.not.exist();

              data.getVersions({ deploymentGroupId: deploymentGroup.id }, (err, versions) => {
                expect(err).to.not.exist();
                expect(versions.length).to.equal(1);
                expect(versions[0].id).to.equal(version.id);
                done();
              });
            });
          });
        });
      });
    });
  });
});


describe('manifests', () => {
  describe('provisionManifest()', () => {
    it('creates a new manifest record in the manifests table', (done) => {
      const data = new PortalData(internals.options);
      data.connect((err) => {
        expect(err).to.not.exist();
        data.createDeploymentGroup({ name: 'something' }, (err, deploymentGroup) => {
          expect(err).to.not.exist();
          const clientManifest = {
            deploymentGroupId: deploymentGroup.id,
            type: 'compose',
            format: 'yml',
            raw: 'docker compose raw contents',
            json: { services: [] }
          };

          data.provisionManifest(clientManifest, (err, result) => {
            expect(err).to.not.exist();
            expect(result.id).to.exist();
            expect(result.created).to.exist();
            done();
          });
        });
      });
    });
  });

  describe('getManifests()', () => {
    it('retrieves manifests using from a manifest type', (done) => {
      const data = new PortalData(internals.options);
      data.connect((err) => {
        expect(err).to.not.exist();
        data.createDeploymentGroup({ name: 'something' }, (err, deploymentGroup) => {
          expect(err).to.not.exist();
          const clientManifest = {
            deploymentGroupId: deploymentGroup.id,
            type: 'compose',
            format: 'yml',
            raw: 'docker compose raw contents',
            json: { services: [] }
          };

          data.provisionManifest(clientManifest, (err, result) => {
            expect(err).to.not.exist();
            data.getManifests({ type: clientManifest.type }, (err, manifests) => {
              expect(err).to.not.exist();
              expect(manifests.length).to.equal(1);
              done();
            });
          });
        });
      });
    });

    it('retrieves manifests using from a deployment group id', (done) => {
      const data = new PortalData(internals.options);
      data.connect((err) => {
        expect(err).to.not.exist();
        data.createDeploymentGroup({ name: 'something' }, (err, deploymentGroup) => {
          expect(err).to.not.exist();
          const clientManifest = {
            deploymentGroupId: deploymentGroup.id,
            type: 'compose',
            format: 'yml',
            raw: 'docker compose raw contents',
            json: { services: [] }
          };

          data.provisionManifest(clientManifest, (err, result) => {
            expect(err).to.not.exist();
            data.getManifests({ type: clientManifest.type }, (err, manifests) => {
              expect(err).to.not.exist();
              expect(manifests.length).to.equal(1);
              done();
            });
          });
        });
      });
    });
  });
});
