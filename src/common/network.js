import os from 'os';

const getInterfaces = () => {
  const interfaces = os.networkInterfaces();
  const ips = [];

  for (const key in interfaces)
    for (const item of interfaces[key])
      if (item.family === 4 && !item.internal) ips.push(item.address);

  return ['localhost', ...ips];
};

const index = { getInterfaces };
export { getInterfaces, index as default };
