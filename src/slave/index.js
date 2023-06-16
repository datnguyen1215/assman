import http from '#src/common/http/index';
import routes from './http/routes';

(async () => {
  const PORT = 9359;
  await http.start({ port: PORT }, routes());
})();
