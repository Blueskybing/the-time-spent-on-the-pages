/**
 * Created by lijun on 15-4-17.
 * Description：加载配置
 */

var fs = require('fs');
var config = Config();
global.CONFIG_MYSQL = {};
(function () {
    var mysqlConfig = config('mysql');
    for (var key in mysqlConfig) {
        CONFIG_MYSQL[key] = mysqlConfig[key][CONST_ENV];
    }
})();

global.CONFIG_LOG4JS = config('log4js')[CONST_ENV];
global.CONFIG_REDIS = config('redis')[CONST_ENV];

function Config() {
    var configs = JSON.parse(fs.readFileSync(__dirname + '/../config/config.json'));
    return function (key) {
        return configs[key];
    }
}