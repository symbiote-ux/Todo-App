const { app } = require('./lib/routes');

const defaultPort = 4000;
const main = (port = defaultPort) => {
  app.listen(port, () => process.stdout.write(`started listening at ${port}`));
};

main(process.env.PORT);
