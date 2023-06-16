import Discovery from '#src/common/discovery';
import { expect } from 'chai';

describe('common/discovery.js', () => {
  const receiver = new Discovery();
  const sender = new Discovery();
  it('should be able to send raw string', done => {
    const onMessage = message => {
      expect(message).to.equal('hello');
      receiver.off('message', onMessage);
      done();
    };

    receiver.on('message', onMessage);

    receiver.listen();
    sender.send('hello');
  });

  it('should be able to send object', done => {
    const onMessage = message => {
      message = JSON.parse(message);
      expect(message.hello).to.equal('world');
      receiver.off('message', onMessage);
      done();
    };

    receiver.on('message', onMessage);
    receiver.listen();

    sender.send({ hello: 'world' });
  });

  after(() => {
    receiver.dispose();
    sender.dispose();
  });
});
