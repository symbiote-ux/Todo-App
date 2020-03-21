const { app } = require('./lib/routes');

const main = () => {
  const defaultPort = 4000;
  const port = process.env.PORT || defaultPort;
  app.listen(port, () =>
    process.stdout.write(`started listening at ${port}\n\n`)
  );
};

main();
