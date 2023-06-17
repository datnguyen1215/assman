import { Discovery as DiscoveryService } from '#src/common/discovery';
import events from 'jscommon/events';

const bus = events.create();
const discovery = new DiscoveryService();

const start = async () => {
  console.log('starting discovery');

  discovery.on('message', async message => {
    console.log('discovery message:', message);
    try {
      message = JSON.parse(message);
      switch (message.type) {
        case 'master:discover':
          const { uuid, host, port } = message.data;
          bus.emit('master', { uuid, host, port });
          break;

        default:
          throw new Error(`Unknown message type: ${message.type}`);
      }
    } catch (err) {
      console.error(err);
    }
  });

  await discovery.listen();
};

const stop = async () => {
  console.log('stopping discovery');
  discovery.stop();
};

const index = { start, stop, ...bus };
export { start, stop, index as default };
