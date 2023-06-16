import { Router } from 'express';

export default () => {
  const router = Router();

  router.get('/', (_, res) => {
    res.send('Hello World!');
  });

  return router;
};
