/**
 * @typedef {object} MasterDetails
 * @property {string} uuid
 * @property {string} host
 * @property {number} port
 *
 * @typedef {Object} Executor
 * @property {() => Promise<void>} dispose
 */
import { Discovery as DiscoveryService } from '#src/common/discovery';
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

  get name() {
    return this.details.name;
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

    console.log(
      'connected to master',
      this.uuid,
      this.host,
      this.port,
      this.name
    );

    const onRequest = (request, response) =>
      this.emit('request', request, response);

    this.socket.on('request', onRequest);
    this.socket.once('close', () => this.emit('close'));

    this.disposers.push(async () => {
      this.socket.off('request', onRequest);
      await this.socket.dispose();
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
  let masters = [];
  const discovery = new DiscoveryService();

  discovery.on('master', async info => {
    try {
      assert(info.uuid, 'uuid is required');
      assert(info.hosts, 'hosts is required');
      assert(Array.isArray(info.hosts), 'hosts must be an array');
      assert(info.port, 'port is required');

      // For each host, try to connect, if successful, abort.
      for (const host of info.hosts) {
        try {
          const master = new Master({ ...info, host });
          await master.connect();

          // Clean up master in case that it's disconnected.
          master.once('close', () => {
            console.log('master disconnected', master.uuid);
            master.dispose();
            masters = masters.filter(m => m !== master);
          });

          masters.push(master);
          break;
        } catch (err) {
          continue;
        }
      }
    } catch (err) {
      console.error(
        `unable to connect to master ${JSON.stringify(info)}: ${err}`
      );
    }
  });

  await discovery.listen();

  const dispose = async () => {
    for (const master of masters) await master.dispose();
    masters = [];
    discovery.dispose();
  };

  return { dispose };
};

const index = { create };
export { create, index as default };
