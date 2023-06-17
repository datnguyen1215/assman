/**
 * @typedef {Object} ConnectConfig
 * @property {string} host
 * @property {number} port
 */
import { WebSocketConnection } from 'jscommon/websocket';
import { WebSocket } from 'ws';

/**
 * Make connection.
 * @param {ConnectConfig} ConnectConfig
 */
const create = config => {
  return new Promise((resolve, reject) => {
    const { host, port } = config;
    const url = `ws://${host}:${port}`;

    const ws = new WebSocket(url);
    ws.onopen = () => {
      const connection = new WebSocketConnection(ws);
      resolve(connection);
    };

    ws.onerror = err => {
      reject(err);
    };
  });
};

const index = { create };
export { create, index as default };
