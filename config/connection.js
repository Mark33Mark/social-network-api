const { connect, connection } = require('mongoose');

const connectionString =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/social_networkDB';

connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
