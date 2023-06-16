import { WebSocketServer } from 'jscommon/websocket';
import http from '#src/common/http/index';
import routes from './http/routes';

(async () => {
  const servers = await http.start({ port: 9358 }, routes());
  const wss = new WebSocketServer({ server: servers.http });

  wss.on('connection', ws => {
    console.log('connection', ws);
  });

  wss.listen();
})();
