'use strict';

const consul = require('consul');
const fs = require('fs');

function getConsulLocation() {
  let host = 'localhost';
  if (process.env.CONSUL) {
    host = process.env.CONSUL;
  }

  return host;
}

const client = consul({
  host: getConsulLocation()
});

let acquired = false;
const key = 'service/cockroach/leader';

client.health.service('consul', function(err, result) {
  if (err) throw err;

  let lock = client.lock({
    key:key,
    value: process.env.HOSTNAME
  });

  lock.on('acquire', function() {
    console.log('lock acquired');
    acquired = true;
    process.exit();
  });

  lock.on('error', function(err) {
    console.log('got an error, ', err);
  });

  lock.on('end', function(err) {
    console.log('lock released or there was a permanent failure');
  });

  lock.acquire();

  setTimeout(() => {
    if (!acquired) {
      client.kv.get(key, function(err, result) {
        if (err) throw err;
        fs.writeFileSync('tojoin', result.Value);
        process.exit();
      });
    } else {
      process.exit();
    }
  }, 7000);
});
