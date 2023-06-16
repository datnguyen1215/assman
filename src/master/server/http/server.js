import http from 'http';
import express from 'express';
import routes from './routes';

const create = () => {
  const app = express();
  const server = http.createServer(app);

  // handle routes
  app.use('/', routes());

  return { express: app, http: server };
};

const index = { create };
export { create, index as default };
