/**
 * Created by bluesky on 15-11-4.
 */



var router = require('express').Router();

router.all('/', function (req, res) {
    _Log.trace('记录停留时间');
    var counter = '';
    res.end('123');
});

module.exports = router;

