const router = require('express').Router();

const apiRoutes = require('./api');

// adds prefix `/api` to all api routes 
// imported from the `api` directory
router.use('/api', apiRoutes);

router.use((req, res) => 
    res.send(`<h1>🤷 Sorry, that route isn't available at the moment, please check your url route.</h1>`));

module.exports = router;
