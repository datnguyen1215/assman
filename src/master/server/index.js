import { WebSocketServer } from 'jscommon/websocket';
import http from '#src/common/http/index';
import routes from './http/routes';
import DiscoveryService from '#src/common/discovery';
import { v4 as uuid } from 'uuid';

const id = uuid();
console.log('id', id);

(async () => {
  const servers = await http.start({ port: 9358 }, routes());
  const wss = new WebSocketServer({ server: servers.http });
  const discovery = new DiscoveryService();

  console.log('sending discovery message');
  await discovery.send({
    type: 'master:discovery',
    data: {
      uuid: id,
      host: 'localhost',
      port: 9358
    }
  });

  wss.on('connection', ws => {
    console.log('connection', ws);
  });

  wss.listen();
})();
