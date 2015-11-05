/**
 * Created by bluesky on 15-11-5.
 */


var log_cache_key_factory = require('./log_cache_key_factory');
// 计数器
var counter = 0;

(function () {
        counter = _LocalCache.get(log_cache_key_factory.getLogCounterKey()) || 0;
        if (counter == 0) {
            _LocalCache.set(log_cache_key_factory.getLogCounterKey(), counter);
        }
    }
);

function CacheCounter() {
    return {
        getLogCounterIndexKey: function () {
            counter += 1;
            // 同步到缓存中
            _LocalCache.set(log_cache_key_factory.getLogCounterKey(), counter);
            return log_cache_key_factory.getLogCountKey(counter);
        }
    }

}


global._CacheCounter = CacheCounter();