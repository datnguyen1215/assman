/**
 * @typedef {Object} ServerConfig
 * @property {number} [port=9358] - The port to listen on
 */
import Server from './server';
import lodash from 'lodash';

const DEFAULT_CONFIG = {
  port: 9358
};

let servers = {
  express: null,
  http: null
};

/**
 * Starts the server.
 * @param {ServerConfig} [config={}]
 */
const start = (config = {}, routes) => {
  return new Promise((resolve, reject) => {
    config = lodash.merge({}, DEFAULT_CONFIG, config);
    servers = Server.create(routes);
    servers.http.listen(config.port, err => {
      if (err) return reject(err);
      resolve(servers);
    });
  });
};

/**
 * Stop the server.
 */
const stop = () => {
  return new Promise(resolve => {
    servers.http.close(() => {
      resolve();
    });
  });
};

const index = { start, stop };
export { start, stop, index as default };
