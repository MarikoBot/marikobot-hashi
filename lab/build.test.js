const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../.env` });

const { HashiClient } = require('../lib');

const client = new HashiClient({
  intents: 3276799,
  processName: 'BOT-LAB',
  mongoose: {
    dbName: 'dev',
    connectionURI: 'mongodb://localhost:27017/',
    connectOptions: { dbName: 'hashi-dev' },
  },
});

void client.login();