/**
 * Created by bluesky on 15-11-4.
 * Description：定时同步数据到数据库
 */

"use strict";
require('../libs');
var log_cache_key_factory = require('../cache/log_cache_key_factory');
var base_dao = require('../libs/base_dao');
var synchronizer = module.exports = {};


synchronizer.syncGameLog = function () {

    _Log.info("开始同步缓存中的停留时长日志到数据库中...");
    var now = new Date().getTime();
    var new_log_index_array_key = new Array();
    var total;
    var success = 0;
    var failed = 0;
    var nc = 0;

    _Log.info("开始同步上一次没有同步的日志...");
    var log_index_array_key = log_cache_key_factory.getLogIndexArrKey();
    var log_index_array = _LocalCache.get(log_index_array_key) || new Array();

    total = log_index_array.length;
    if (total == 0) {
        _LocalCache.set(log_index_array_key, log_index_array);
    } else {
        for (var i in log_index_array) {
            var log_key = log_index_array[i];
            try {
                var log = _LocalCache.get(log_key) || {};
                if (log) {
                    if (now - log.long_time > 10000) {
                        // 同步到数据库中
                        base_dao.addObj({
                            userid: log.userid,
                            duration: log.duration,
                            time: new Date()
                        }, 'log');
                        success++;
                        _LocalCache.del(log_key);
                    } else {
                        new_log_index_array_key.push(log_key);
                        nc++;
                    }
                } else {
                    failed++;
                }
            } catch (e) {
                _Log.errorObj("同步失败 log_key:\n" + log_key, e);
                failed++;
            }
        }
    }

    _Log.info("开始同步当次日志...");
    var start_index_key = log_cache_key_factory.getLogIndexStartKey();
    var start_index = _LocalCache.get(start_index_key) || 0;

    var counter_key = log_cache_key_factory.getLogCounterKey();
    var end_index = _LocalCache.get(counter_key) || 0;
    _Log.info("开始索引和结束索引分别为：" + start_index + "," + end_index);

    if (end_index != 0) {
        total += end_index - start_index + 1;
        for (var i = start_index; i <= end_index; i++) {
            var log_count_key = log_cache_key_factory.getLogCountKey(i);
            var log_key = _LocalCache.get(log_count_key) || '';
            try {
                var log = _LocalCache.get(log_key) || {};
                if (log) {
                    if (now - log.long_time > 10000) {
                        // 同步到数据库中
                        base_dao.addObj({
                            userid: log.userid,
                            duration: log.duration,
                            time: new Date()
                        }, 'log');
                        success++;
                        _LocalCache.del(log_key);
                    } else {
                        new_log_index_array_key.push(log_key);
                        nc++;
                    }
                } else {
                    failed++;
                }
            } catch (e) {
                _Log.errorObj("同步失败 log_key:" + log_key, e);
                failed++;
            }

        }
    }

    _LocalCache.set(start_index_key, end_index + 1);
    _LocalCache.set(log_index_array_key, new_log_index_array_key);

    _Log.info("结束同步缓存中的游戏日志到数据库中，总数:" + total
        + ", 成功:" + success
        + ", 失败:" + failed
        + ", 不符合:" + nc
        + ", 耗时:" + (new Date().getTime() - now) + "ms\n"
    );
}

setInterval(synchronizer.syncGameLog, 10000);

//synchronizer.syncGameLog();