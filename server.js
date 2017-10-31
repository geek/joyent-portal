'use strict';

const Good = require('good');
const Hapi = require('hapi');
const Inert = require('inert');
const Path = require('path');
const Sso = require('sso-auth');
const CloudApi = require('./packages/cloudapi-gql');
const Config = require('./.envconf.js');


const server = new Hapi.Server({
  debug: {
    log: ['error'],
    request: ['error']
  }
});

const handlerError = (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
};


server.connection({ port: 80 });

server.register(
  [
    {
      register: Good,
      options: {
        reporters: {
          console: [
            {
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{ log: '*', response: '*' }]
            },
            {
              module: 'good-console'
            },
            'stdout'
          ]
        }
      }
    },
    {
      register: Sso,
      options: {
        cookie: {
          password: process.env.COOKIE_PASSWORD || 'uUELnoNBVl-Mrey-gTY9uFkQ_0DO3DMP',
          isSecure: false,
          domain: 'localhost',
          isHttpOnly: false,
          ttl: 1000 * 60 * 60       // 1 hour
        },
        sso: {
          keyId: Config.KEY_ID,
          keyPath: Config.KEY_PATH
        }
      }
    },
    Inert,
    CloudApi
  ],
  (err) => {
    handlerError(err);

    server.route({
      method: 'GET',
      path: '/service-worker.js',
      config: {
        handler: {
          file: {
            path: Path.join(__dirname, './packages/my-joy-beta/build/service-worker.js')
          }
        }
      }
    });

    server.route({
      method: 'GET',
      path: '/{path*}',
      config: {
        auth: 'sso',
        handler: {
          directory: {
            path: Path.join(__dirname, './packages/my-joy-beta/build/'),
            redirectToSlash: true,
            index: true
          }
        }
      }
    });

    server.start((err) => {
      handlerError(err);
      // eslint-disable-next-line no-console
      console.log(`server started at http://localhost:${server.info.port}`);
    });
  }
);
