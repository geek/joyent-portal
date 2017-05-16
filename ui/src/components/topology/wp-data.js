/* eslint-disable */
module.exports = [{
  "uuid": "081a792c-47e0-4439-924b-2efa9788ae9e",
  "id": "nginx",
  "name": "Nginx",
  "project": "e0ea0c02-55cc-45fe-8064-3e5176a59401",
  "instances": 1,
  "metrics": [{
    "name": "CPU",
    "value": "50%"
  }, {
    "name": "Memory",
    "value": "20%"
  }, {
    "name": "Network",
    "value": "2.9Kb/sec"
  }],
  "connections": [
    "be227788-74f1-4e5b-a85f-b5c71cbae8d8"
  ],
  "healthy": true,
  "datacenter": 1
}, {
  "uuid": "be227788-74f1-4e5b-a85f-b5c71cbae8d8",
  "id": "wordpress",
  "name": "Wordpress",
  "project": "e0ea0c02-55cc-45fe-8064-3e5176a59401",
  "instances": 2,
  "metrics": [{
    "name": "CPU",
    "value": "50%"
  }, {
    "name": "Memory",
    "value": "20%"
  }, {
    "name": "Network",
    "value": "2.9Kb/sec"
  }],
  "connections": [
    "6a0eee76-c019-413b-9d5f-44712b55b993",
    "6d31aff4-de1e-4042-a983-fbd23d5c530c",
    "4ee4103e-1a52-4099-a48e-01588f597c70"
  ],
  "healthy": true,
  "datacenter": 2
}, {
  "uuid": "6a0eee76-c019-413b-9d5f-44712b55b993",
  "id": "nfs",
  "name": "NFS",
  "project": "e0ea0c02-55cc-45fe-8064-3e5176a59401",
  "instances": 2,
  "metrics": [{
    "name": "CPU",
    "value": "50%"
  }, {
    "name": "Memory",
    "value": "20%"
  }, {
    "name": "Network",
    "value": "2.9Kb/sec"
  }],
  "healthy": true,
  "datacenter": 2
}, {
  "uuid": "6d31aff4-de1e-4042-a983-fbd23d5c530c",
  "id": "memcached",
  "name": "Memcached",
  "project": "e0ea0c02-55cc-45fe-8064-3e5176a59401",
  "instances": 2,
  "metrics": [{
    "name": "CPU",
    "value": "50%"
  }, {
    "name": "Memory",
    "value": "20%"
  }, {
    "name": "Network",
    "value": "2.9Kb/sec"
  }],
  "healthy": true,
  "datacenter": 2
}, {
  "uuid": "4ee4103e-1a52-4099-a48e-01588f597c70",
  "id": "percona",
  "name": "Percona",
  "project": "e0ea0c02-55cc-45fe-8064-3e5176a59401",
  "instances": 2,
  "metrics": [{
    "name": "CPU",
    "value": "50%"
  }, {
    "name": "Memory",
    "value": "20%"
  }, {
    "name": "Network",
    "value": "2.9Kb/sec"
  }],
  "healthy": true,
  "datacenter": 1
}, {
  "uuid": "97c68055-db88-45c9-ad49-f26da4264777",
  "id": "consul",
  "name": "Consul",
  "project": "e0ea0c02-55cc-45fe-8064-3e5176a59401",
  "instances": 2,
  "metrics": [{
    "name": "CPU",
    "value": "50%"
  }, {
    "name": "Memory",
    "value": "20%"
  }, {
    "name": "Network",
    "value": "2.9Kb/sec"
  }],
  "healthy": true,
  "datacenter": 2
}];
