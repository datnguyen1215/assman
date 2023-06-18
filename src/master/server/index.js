import { WebSocketServer } from 'jscommon/websocket';
import http from '#src/common/http/index';
import routes from './http/routes';
import DiscoveryService from '#src/common/discovery';
import { v4 as uuid } from 'uuid';
import os from 'os';
import network from '#src/common/network';

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
  await discovery.shoutout({
    uuid: id,
    name: os.userInfo().username,
    hosts: network.getInterfaces().filter(x => x !== 'localhost'),
    port: 9358
  });
})();
