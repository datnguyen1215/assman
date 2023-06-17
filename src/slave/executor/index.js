/**
 * @typedef {object} MasterDetails
 * @property {string} uuid
 * @property {string} host
 * @property {number} port
 *
 * @typedef {Object} Executor
 * @property {() => Promise<void>} dispose
 */
import discovery from './discovery';
import connection from './connection';
import { EventEmitter } from 'jscommon/events';
import assert from 'assert';

class Master extends EventEmitter {
  constructor(details) {
    super();

    assert(details.uuid, 'uuid is required');
    assert(details.host, 'host is required');
    assert(details.port, 'port is required');
    /** @private */
    this.details = details;
    /** @type {import('jscommon/websocket').WebSocketConnection} */
    this.socket = null;

    this.disposers = [];
  }

  get uuid() {
    return this.details.uuid;
  }

  get host() {
    return this.details.host;
  }

  get port() {
    return this.details.port;
  }

  /**
   * Connect to master.
   * @returns {Promise<void>}
   */
  async connect() {
    this.socket = await connection.create({
      host: this.host,
      port: this.port
    });

    console.log('connected to master', this.uuid);

    const onRequest = (request, response) =>
      this.emit('request', request, response);

    this.socket.on('request', onRequest);
    this.socket.once('close', () => this.emit('close'));

    this.disposers.push(async () => {
      this.socket.off('request', onRequest);
      await this.socket.close();
    });
  }

  /**
   * Dispose master.
   * @returns {Promise<void>}
   */
  dispose() {
    this.disposers.forEach(dispose => dispose());
  }
}

/**
 * Create an executor for commands.
 * @returns {Promise<Executor>}
 */
const create = async () => {
  const masters = [];

  await discovery.start();

  discovery.on('master', async info => {
    try {
      const { uuid, host, port } = info;
      const master = new Master({ uuid, host, port });
      await master.connect();
      masters.push(master);
    } catch (err) {
      console.error(err);
      console.error('unable to connect to master', JSON.stringify(info));
    }
  });

  const dispose = async () => {
    for (const master of masters) await master.dispose();
    await discovery.stop();
  };

  return { dispose };
};

const index = { create };
export { create, index as default };
