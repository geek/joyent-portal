'use strict';

const Hapi = require('hapi');
const HapiPino = require('hapi-pino');
const Inert = require('inert');
const Path = require('path');
const Sso = require('sso-auth');
const CloudApi = require('./packages/cloudapi-gql');


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


server.connection({
  port: 80,
  routes: {
    cors: {
      origin: ['localhost', 'localhost:80'],
      credentials: true,
      additionalHeaders: ['Cookie']
    }
  }
});

server.register(
  [
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
          keyId: process.env.SDC_KEY_ID,
          keyPath: process.env.SDC_KEY_PATH
        }
      }
    },
    {
      register: HapiPino,
      options: {
        prettyPrint: true,
        logEvents: ['request-error']
      }
    },
    Inert,
    CloudApi
  ],
  (err) => {
    handlerError(err);

    server.route([
      {
        method: 'GET',
        path: '/static/{path*}',
        config: {
          auth: false,
          handler: {
            directory: {
              path: Path.join(__dirname, './packages/my-joy-beta/build/static/'),
              redirectToSlash: true,
              index: false
            }
          }
        }
      },
      {
        method: 'GET',
        path: '/{path}.json',
        config: {
          auth: false,
          handler: (request, reply) => {
            const path = Path.join(__dirname, `./packages/my-joy-beta/build/${request.params.path}.json`);
            reply.file(path);
          }
        }
      },
      {
        method: 'GET',
        path: '/service-worker.js',
        config: {
          auth: false,
          handler: (request, reply) => {
            const path = Path.join(__dirname, `./packages/my-joy-beta/build/service-worker.js`);
            reply.file(path);
          }
        }
      },
      {
        method: '*',
        path: '/{path*}',
        config: {
          handler: {
            file: {
              path: Path.join(__dirname, './packages/my-joy-beta/build/index.html')
            }
          }
        }
      }
    ]);

    server.auth.default('sso');

    server.start((err) => {
      handlerError(err);
      // eslint-disable-next-line no-console
      console.log(`server started at http://localhost:${server.info.port}`);
    });
  }
);
