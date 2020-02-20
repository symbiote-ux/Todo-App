const { app } = require('./lib/routes');

const main = () => {
  const port = process.env.PORT || 4000;
  app.listen(port, () => process.stdout.write(`started listening at ${port}`));
};

main();
