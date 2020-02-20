const { app } = require('./lib/routes');

const main = port => {
  app.listen(port, () => process.stdout.write(`started listening at ${port}`));
};

main(process.env.PORT || 4000);
