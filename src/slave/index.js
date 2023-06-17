import http from '#src/common/http/index';
import routes from './http/routes';
import Executor from './executor';

(async () => {
  const PORT = 9359;
  await http.start({ port: PORT }, routes());

  await Executor.create();
})();
