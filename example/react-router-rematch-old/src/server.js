
import http from 'http';
import app from './serverIndex';

const logs = console.log; // eslint-disable-line
const server = http.createServer(app);
let currentApp = app;

const PORT = process.env.PORT || 3000;
server.listen(PORT, (error) => {
  if (error) {
    logs(error);
  }
  logs('🚀 started!', `PORT: http://localhost:${PORT}`);
});

if (module.hot) {
  logs('✅  Server-side HMR Enabled!');
  module.hot.accept('./server', () => {
    logs('🔁  HMR Reloading `./server`...');
    server.removeListener('request', currentApp);
    const newApp = require('./server').default; // eslint-disable-line
    server.on('request', newApp);
    currentApp = newApp;
  });
}
