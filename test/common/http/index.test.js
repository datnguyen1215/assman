import http from '#src/common/http/index';
import axios from 'axios';
import { expect } from 'chai';

describe('http', () => {
  const CUSTOM_PORT = 3000;

  it('should start & stop a server on default port', done => {
    const run = async () => {
      await http.start();
      const response = await axios.get('http://localhost:9358/health');
      expect(response.status).to.be.equal(200);

      await http.stop();

      try {
        await axios.get('http://localhost:9358/health', {
          timeout: 2000
        });
      } catch (err) {
        expect(err.code).to.be.equal('ECONNREFUSED');
        done();
      }
    };

    run();
  }).timeout(5000);

  it('should start a server on custom port', async () => {
    await http.start({ port: CUSTOM_PORT });
    const response = await axios.get(`http://localhost:${CUSTOM_PORT}/health`);
    expect(response.status).to.be.equal(200);
    await http.stop();
  });
});
