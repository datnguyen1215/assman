import { WebSocketServer } from 'jscommon/websocket';
import http from './http';

(async () => {
  const servers = await http.start();
  const wss = new WebSocketServer({ server: servers.http });

  wss.on('connection', ws => {
    console.log('connection', ws);
  });

  wss.listen();
})();
