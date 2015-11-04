/**
 * Created by lijun on 15-4-17.
 */

var mysql = require('mysql');
var config = CONFIG_MYSQL;

global._DBPool = {};

(function () {
    _Log.trace('init Database pool...');
    for (var key in config) {
        _Log.traceObj('init Database ' + key, config[key]);
        _DBPool[key] = mysql.createPool(config[key]);
    }
})();

function Connection() {
    return function (dbPoolName) {
        return mysql.createConnection(config[dbPoolName]);
    }
}

global._GetConnection = Connection();
