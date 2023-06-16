/**
 * @typedef {Object} MulticastConfig
 * @property {string} host
 * @property {number} port
 */
import dgram from 'dgram';

const createSocket = config => {
  const socket = dgram.createSocket('udp4');
  socket.bind(config.port, config.host);
  return socket;
};

const index = { createSocket };
export { createSocket, index as default };
