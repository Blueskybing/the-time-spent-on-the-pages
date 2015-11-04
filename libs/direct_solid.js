/**
 * Created by lijun on 15-5-21.
 */

function DirectSolid() {
    return function (sql, callBack, opts) {
        opts = opts || {};
        callBack = callBack || function (results, params) {
            };
        opts.type = opts.type || 'SELECT';
        _Utils.dbQuery(sql, callBack, opts);
    }
}
global._DirectSolid = DirectSolid();
