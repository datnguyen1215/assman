import http from 'http';
import express from 'express';

const create = routes => {
  const app = express();
  const server = http.createServer(app);

  // handle routes
  if (routes) app.use('/', routes);

  app.use('/health', (_, res) => {
    res.status(200).send('OK');
  });

  return { express: app, http: server };
};

const index = { create };
export { create, index as default };
