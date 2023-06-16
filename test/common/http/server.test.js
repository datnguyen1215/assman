import httpServer from '#src/common/http/server';
import requests from 'http';
import { expect } from 'chai';

describe('server', () => {
  const PORT = 3000;
  const { http } = httpServer.create();

  it(`should create http server and listen to port ${PORT}`, done => {
    http.listen(PORT, err => {
      if (err) return done(err);
      done();
    });
  });

  it('should expose /health route', done => {
    requests.get(`http://localhost:${PORT}/health`, res => {
      expect(res.statusCode).to.be.equal(200);
      done();
    });
  });

  after(done => {
    http.close(done);
  });
});
