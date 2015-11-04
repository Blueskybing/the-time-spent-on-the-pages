/**
 * Created by Bluesky on 2015/8/28.
 * Description：通用临时本地缓存
 */
"use strict"
var fs = require('fs');
var LRU = require("lru-cache");
var cache;
(function () {
    _Log.trace('init local cache..')
    var configs = JSON.parse(fs.readFileSync(__dirname + '/../config/config.json'));
    if (configs['local_cache']) {
        cache = LRU(configs['local_cache']);
        _Log.traceObj('cache configuration:', configs['local_cache']);
    } else {
        _Log.trace('cannot find cache configuration,use default.');
    }
})();

global._LocalCache = cache;




