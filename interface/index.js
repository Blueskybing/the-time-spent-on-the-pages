/**
 * Created by bluesky on 15-11-4.
 */


var router = require('express').Router();

router.use('/log', require('./module/log/duration'));
module.exports = router;