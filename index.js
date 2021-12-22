const express = require('express');
const db      = require('./config/connection');
const routes  = require('./routes');

// using to get the current working directory of the node.js process
const cwd = process.cwd();

const PORT = process.env.PORT || 8888;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT} 🆗`);
  });
});
