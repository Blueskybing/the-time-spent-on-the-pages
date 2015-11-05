/**
 * Created by Bluesky on 2015/11/5.
 * Description： 缓存 key 工厂
 */


var log_cache_key_factory = module.exports = {};

log_cache_key_factory.getLogKey = function (userid, page) {
    return "log:" + userid + page;
}

log_cache_key_factory.getLogIndexArrKey = function () {
    return "log_index_array_key";
}

log_cache_key_factory.getLogIndexStartKey = function () {
    return "log:index_start";

}

log_cache_key_factory.getLogCountKey = function (count) {
    return "log:" + count;
}

log_cache_key_factory.getLogCounterKey = function () {
    return "log:counter";
}



