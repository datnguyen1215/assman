/**
 * @typedef {Object} DiscoveryConfig
 * @property {string} host
 * @property {number} port
 *
 * @typedef {Object} MasterData
 * @property {string} uuid
 * @property {string} name
 * @property {string[]} hosts
 * @property {number} port
 */
import dgram from 'dgram';
import { EventEmitter } from 'jscommon/events';
import lodash from 'lodash';
import { v4 as uuid } from 'uuid';
import assert from 'assert';

const DEFAULT_CONFIG = {
  address: '233.233.233.233',
  port: 9357
};

class Discovery extends EventEmitter {
  /**
   * @param {DiscoveryConfig} config
   */
  constructor(config = DEFAULT_CONFIG) {
    super();

    this.id = uuid();

    /** @private */
    this.config = lodash.merge({}, DEFAULT_CONFIG, config);

    /** @private */
    this.socket = dgram.createSocket('udp4');
  }

  /**
   * Start listening for messages.
   * @returns {Promise<void>}
   */
  listen() {
    return new Promise((resolve, reject) => {
      const { address, port } = this.config;
      const { socket } = this;

      socket.bind(port, () => {
        this.emit('bind');
        socket.addMembership(address);
        resolve();
      });

      socket.on('message', msg => {
        try {
          const message = JSON.parse(msg.toString());
          switch (message.type) {
            case 'master:discover':
              this.emit('master', message.data);
              break;

            default:
              throw new Error('Invalid message type');
          }
        } catch (err) {
          console.error(err);
        }
      });

      socket.once('close', () => this.emit('close'));
      socket.once('error', err => reject(err));
    });
  }

  /**
   * Send a shoutout to the multicast group.
   * @param {MasterData} data
   */
  async shoutout(data) {
    assert(data.uuid, 'Missing uuid');
    assert(data.name, 'Missing name');
    assert(data.hosts, 'Missing hosts');
    assert(data.port, 'Missing port');
    await this.send({ type: 'master:discover', data });
  }

  /**
   * Dispose the socket.
   */
  dispose() {
    this.socket.close();
    this.socket = null;
    this.config = null;
  }

  /**
   * Send a raw string to the multicast group.
   * @param {string} str
   * @private
   */
  sendString(str) {
    return new Promise((resolve, reject) => {
      const { socket, config } = this;
      const { address, port } = config;
      socket.send(str, port, address, err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  /**
   * Send a message to the multicast group.
   * @param {string|Object} msg
   * @returns {Promise<void>}
   */
  async send(msg) {
    switch (typeof msg) {
      case 'string':
        return await this.sendString(msg);

      case 'object':
        return await this.sendString(JSON.stringify(msg));

      default:
        throw new Error('Invalid message type');
    }
  }
}

export { Discovery, Discovery as default };
