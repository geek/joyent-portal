'use strict';

const { hapi: Voyager } = require('graphql-voyager/middleware');
const { hapi: Playground } = require('graphql-playground/middleware');
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi');
const { formatError } = require('apollo-errors');
const Execa = require('execa');
const Hapi = require('hapi');
const Inert = require('inert');
const Path = require('path');
const Sso = require('sso-auth');


const schema = require('./schema');

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

// compile docs
// eslint-disable-next-line new-cap
Execa('npm', ['run', 'graphdoc']).catch(handlerError);

server.connection({ port: process.env.PORT });

server.register(
  [
    {
      register: Sso,
      options: {
        cookie: {
          password: process.env.COOKIE_PASSWORD || 'uUELnoNBVl-Mrey-gTY9uFkQ_0DO3DMP',
          isSecure: false,
          domain: 'localhost',
          ttl: 1000 * 60 * 60       // 1 hour
        },
        sso: {
          keyId: process.env.KEY_ID,
          keyPath: process.env.KEY_PATH
        }
      }
    },
    Inert,
    {
      register: graphqlHapi,
      options: {
        path: '/graphql',
        graphqlOptions: {
          formatError,
          schema
        },
        route: {
          cors: Boolean(process.env.CORS)
        }
      }
    },
    {
      register: graphiqlHapi,
      options: {
        path: '/graphiql',
        graphiqlOptions: {
          endpointURL: '/graphql'
        }
      }
    },
    {
      register: Playground,
      options: {
        path: '/playground',
        endpointUrl: '/graphql'
      }
    },
    {
      register: Voyager,
      options: {
        path: '/voyager',
        endpointUrl: '/graphql'
      }
    }
  ],
  (err) => {
    handlerError(err);

    server.route([
      {
        method: 'GET',
        path: '/doc/{param*}',
        config: {
          auth: 'sso',
          handler: {
            directory: {
              path: '../doc',
              redirectToSlash: true,
              index: true
            }
          }
        }
      },
      {
        method: 'GET',
        path: '/{path*}',
        config: {
          auth: 'sso',
          handler: {
            directory: {
              path: Path.join(__dirname, '../../my-joy-beta/build/'),
              redirectToSlash: true,
              index: true
            }
          }
        }
      }
    ]);

    server.start((err) => {
      handlerError(err);
      // eslint-disable-next-line no-console
      console.log(`server started at http://0.0.0.0:${server.info.port}`);
    });
  }
);
