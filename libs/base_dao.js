/**
 * Created by Bluesky on 2015/8/27.
 * Description：数据库固定基本操作
 */
var base_dao = module.exports = {};


/**
 * 根据数据库表名新增对象
 * @param insert_obj
 * @param callback
 * @param table_name
 */
base_dao.addObj = function (insert_obj, table_name, callback) {
    if (typeof callback != 'function') {
        callback = function () {
        };
    }
    if (!table_name) {
        _Log.error('table_name不能为空..');
        callback(null);
    } else if (typeof insert_obj == 'object') {
        var insert_sql = "insert into " + table_name + " SET  ?";
        _DirectSolid(insert_sql, function (results) {
            if (typeof callback == 'function') {
                callback(results);
            } else {
                callback(null);
                _Log.error('回调失败，请转入正确的回调函数.');
            }
        }, {
            dbPoolName: 'test',
            columns: insert_obj
        });
    } else {
        _Log.errorObj('请传入正确的对象', insert_obj);
        callback(null);
    }
}

