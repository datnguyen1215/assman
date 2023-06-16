import multicast from '#src/common/multicast';

let socket = null;

const start = () => {
  if (socket) return;

  socket = multicast.createSocket({ host: '233.233.233.237', port: 9357 });
  socket.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  });

  socket.once('close', () => {
    console.log('socket closed');
  });

  socket.once('error', err => {
    console.log('socket error');
    console.log(err);
  });
};

const stop = () => {
  if (!socket) return;
  socket.close();
};

const index = { start, stop };
export { start, stop, index as default };
