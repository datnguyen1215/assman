import { WebSocketServer } from 'jscommon/websocket';
import http from '#src/common/http/index';
import routes from './http/routes';
import DiscoveryService from '#src/common/discovery';
import { v4 as uuid } from 'uuid';

const id = uuid();
console.log('id', id);

const startWebSocketServer = httpServer => {
  const wss = new WebSocketServer({ server: httpServer });
  wss.on('connection', ws => {
    console.log('new connection');
  });

  wss.listen();
};

const startHttpServer = async () => {
  return await http.start(null, routes());
};

(async () => {
  const servers = await startHttpServer();
  startWebSocketServer(servers.http);

  const discovery = new DiscoveryService();

  console.log('sending discovery message');
  await discovery.send({
    type: 'master:discover',
    data: {
      uuid: id,
      host: 'localhost',
      port: 9358
    }
  });
})();
