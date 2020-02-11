const {Server} = require('http');
const {app} = require('./lib/handler');

const defaultPort = 3333;

const main = function(port = defaultPort) {
  const server = new Server(app.serve.bind(app));
  server.listen(port, () => {
    process.stdout.write(`started listening: ${port}`);
  });
};

const portNumPosition = 2;
main(process.argv[portNumPosition]);
