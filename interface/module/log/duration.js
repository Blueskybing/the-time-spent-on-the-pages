/**
 * Created by bluesky on 15-11-4.
 */
var verify_value = require('verify-value');
var router = require('express').Router();
var log_cache_key_factory = require('../../../cache/log_cache_key_factory');


router.all('/', function (req, res) {
    // 验证参数
    var key = verify_value.checkValue(req.param_info, ['userid', 'page', 'duration']);
    if (key) {
        _Log.error('保存日志信息 ' + key + ' 不能为空');
        return _BackClient(res)(1);
    }
    // 先根据 key 获取缓存中日志记录
    var log_key = log_cache_key_factory.getLogKey(req.param_info.userid, req.param_info.page);
    var log = _LocalCache.get(log_key) || {};

    if (log['userid']) {
        log.duration += parseInt(req.param_info.duration);
    } else {
        var countKey = _CacheCounter.getLogCounterIndexKey();
        log.userid = req.param_info.userid;
        log.duration = parseInt(req.param_info.duration);
        _LocalCache.set(countKey, log_key);
    }
    log.long_time = new Date().getTime();
    _LocalCache.set(log_key, log);
    console.log('---', _LocalCache.get(log_key));
    res.end(0);
});

module.exports = router;

