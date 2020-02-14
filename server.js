const {app} = require('./lib/handler');

const defaultPort = 4000;
const main = (port = defaultPort) => {
  app.listen(port, () => process.stdout.write(`started listening at ${port}`));
};

const [, , port] = process.argv;
main(port);
