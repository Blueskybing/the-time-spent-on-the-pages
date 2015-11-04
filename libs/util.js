/**
 * Created by lijun on 15-4-15.
 */

var _md5 = require('MD5');
var crypto = require('crypto');
var _util = require('util');
var _xmlreader = require("xmlreader");
var _query_string = require('querystring');

var Util = function () {
    var ndx1 = 1;
    var ndx2 = 1000;
    var ndx3 = 1000000;

    return {
        random: function (min, max) {
            var c = max - min;
            return Math.floor(Math.random() * c + min);
        },
        randomTo: function (max) {
            return Math.floor(Math.random() * max);
        },
        dbQuery: function (sql, callBack, params) {
            var dbPoolName = params && params.dbPoolName || COMMON_PARAM.DEFAULT_DB;
            if (!sql) {
                _Log.error('Util dbQuery sql参数错误:' + sql + ',dbPoolName:' + dbPoolName);
                callBack(null, params);
                return;
            }
            var dbPool = _DBPool[dbPoolName];
            if (!dbPool) {
                _Log.error('Util dbQuery 连接池错误 dbPool:' + dbPool);
                callBack(null, params);
                return;
            }
            dbPool.getConnection(function (err, conn) {
                if (err) {
                    _Log.fatalObj('getConnection error,sql:' + sql + ':', err);
                    callBack(null, params);
                    return;
                }
                conn.query(sql, params.columns || [], function (err, results) {
                    conn.release();
                    if (err) {
                        _Log.fatalObj('query error,sql:' + sql + ':', err);
                        callBack(null, params);
                        return;
                    }
                    callBack(results, params);
                });
            });
        },
        md5: function (text) {
            return _md5(text);
        },
        HmacSHA: function (text, key, mac_name, type) {
            var cipher = crypto.createHmac(mac_name, key);
            cipher.update(text, 'utf8');
            cipher = cipher.digest(type);
            return cipher;
        },
        getToken: function (len) {
            var temp = _md5((ndx1++) + (ndx2++) + (ndx3++));
            return temp.substring(0, len);
        },
        delElm: function (obj, elm) {
            obj[elm] = undefined;
        },
        obj2Xml: function (obj, root) {
            var left = '<';
            var right = '>';
            var leftEnd = '</';
            var typeHead = left + root + right;
            var typeEnd = leftEnd + root + right;
            var xmlHead = '<?xml version=\"1.0\" encoding=\"UTF-8\"?>';
            var content = xmlHead + typeHead;
            for (var key in obj) {
                content += left;
                content += key;
                content += right;
                content += obj[key];
                content += leftEnd;
                content += key;
                content += right;
            }
            content += typeEnd;
            return content;
        },
        xml2Obj: function (xmlStr, root, callBack) {
            var xmlObj = {};
            _xmlreader.read(xmlStr, function (err, result) {
                if (err) {
                    return callBack(err);
                }
                var value = result[root];
                for (var key in value) {
                    var obj = value[key]
                    if ('text' in obj) {
                        xmlObj[key] = obj.text();
                    }
                }
                callBack(null, xmlObj);
            });
        },
        arrangeInsertSql: function (value, columns) {
            if (!value || !columns || !Array.isArray(columns)) {
                return '';
            }
            var append = '';
            columns.forEach(function (e) {
                append += '\'';
                append += value[e] || '';
                append += '\'';
                append += ',';
            })
            append = append.deleteCharAt(append.length - 1);
            return append + ');';
        },
        fillDefault: function (obj) {
            if (obj) {
                for (var key in obj) {
                    if (!obj[key]) {
                        obj[key] = '';
                    }
                }
            }
        },
        arrangeUpdateSql: function (sql, value, baseColumns, columns) {
            if (!sql || !value || !baseColumns || !columns || !Array.isArray(columns)) {
                return sql;
            }
            columns.forEach(function (e) {
                sql = _util.format(sql, value[e] || '');
            });
            baseColumns.forEach(function (e) {
                sql = _util.format(sql, value[e] || '');
            });
            return sql;
        },
        getDateFormat: function (date, format) {
            if (!format) {
                format = 'yyyyMMddhhmmss';
            }
            return (date || new Date()).format(format);
        },
        getClientIp: function (req) {
            return req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress || 'unknown ip';
        },
        isApp: function (req) {
            var userAgent = req.get('user-agent') || '';
            var regx = /.*5miao_game.*/;
            if (userAgent.match(regx)) {
                return true;
            }
            return false;
        },
        getRedisTokenTey: function (uid) {
            return "user:" + uid + ":token";
        },
        getTotalDataKey: function (e) {
            return (e.date || '') + '_' + (e.partner_id || '') + '_' + ( e.game_id || '');
        },
        setCookie: function (res, cookie) {
            var cookieArr = [];
            cookie.forEach(function (e) {
                var cookieStr = '';
                for (var key in e) {
                    if (key === 'secure' || key === 'httponly') {
                        cookieStr += key;
                        cookieStr += ';';
                    } else {
                        cookieStr += key;
                        cookieStr += '=';
                        cookieStr += e[key];
                        cookieStr += ';';
                    }
                }
                if (cookieStr.length > 0) {
                    cookieStr = cookieStr.deleteCharAt(cookieStr.length - 1);
                }
                cookieArr.push(cookieStr);
            });
            res.writeHead(200, {
                'Set-Cookie': cookieArr,
                'Content-Type': 'text/plain'
            });
        },
        getCookie: function (req, key) {
            var cookies = req.cookies || {};
            return cookies[key];
        },
        parseNumberRound: function (str, bits) {
            return parseFloat(str).toFixed(bits);
        },
        parseQueryString: function (url) {
            return _query_string.parse(url);
        },
        stringifyQueryString: function (obj) {
            return _query_string.stringify(obj);
        },
        isPositiveInteger: function (num) {
            return /^[1-9]+[0-9]*]*$/.test(num);
        },
        getSrcSign: function (obj, filter) {
            if (!filter) {
                filter = {};
            }
            var keys = Object.keys(obj).sort();
            var paras = [];
            for (var i in keys) {
                var key = keys[i];
                // 默认过滤 sign,is_null 是否过滤空串或空值
                if (key == 'sign' || filter[key]
                    || (filter.is_null && !obj[key])) {
                    continue;
                }
                paras.push(key + "=" + obj[key]);
            }
            return paras.join("&");
        },
        /**
         *
         * @param str 源串
         * @param insert_str 要插入的字符串
         * @param sn 插入位置
         * @returns {string}
         */
        insertStr: function (str, insert_str, sn) {
            var newstr = "";
            for (var i = 0; i < str.length; i += sn) {
                var tmp = str.substring(i, i + sn);
                newstr += tmp + insert_str;
            }
            return newstr;
        },
        /**
         *
         * @param obj 要验证的对象
         * @param ignore_property 要忽略的属性
         * @returns {*}
         */
        checkObjValue: function (obj, ignore_property) {
            ignore_property = ignore_property || {}
            for (var key in obj) {
                if (ignore_property[key]) {
                    continue;
                }
                if (!obj[key]) {
                    return 'key';
                }
            }
            return false;
        },
        /**
         *
         * @param obj 要验证的对象
         * @param property 验证属性名,字符串数组
         * @returns {*}
         */
        checkValue: function (obj, property) {
            property = property || []
            for (var i in property) {
                var key = property[i];
                if (!obj[key]) {
                    return key;
                }
            }
            return false;
        }

    };
}

global._Utils = Util();

function BackClient(res) {
    return function (err, result) {
        if (err) {
            var json = {code: err.code, error: err.error};
            if (result) {
                json.message = result;
            }
            res.status(err.status).json(json);
        } else {
            if (!result) {
                result = {};
            }
            result.code = 0;
            res.status(200).json(result);
        }
        _Log.traceObj('-------------^-^-- 返回给客户端result：', result);
    };
}

global._BackClient = BackClient;