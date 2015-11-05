var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    // 参数整合，方便后面使用
    if (req.method.toUpperCase() == 'GET') {
        req.param_info = req.query;
    } else {
        req.param_info = req.body;
    }
    _Log.traceObj('==routes/index============' + req.method + '===============', req.param_info);
    next();
});

router.use('/', require('../interface'));

module.exports = router;
