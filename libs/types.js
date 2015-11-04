/**
 * Created by lijun on 15-4-20.
 */

function Types() {
    /** 公用提前 */
    var TIME_PARAM = {
        SCAN_LOGIN_WAIT: 5000,                          //扫描登录请求周期
        SCAN_RECYCLE: 10000,                            //扫描缓存对象周期
        SCAN_RECYCLE_COST: 50,                          //扫描缓存对象耗时调试输出时间
        COMMON_VALID_TIME: 14100000,                    //缓存对象默认有效期
        PID_VALID_TIME: 300000,                         //P参数(短信内容)的有效时间
        REQ_LOGIN_WAIT_TIME: 4000,                      //请求等待超时
        LOG_IN_VALID: 14100000,                         //登录有效期(4h - 5m)
        STRATEGY_VALID: 180000,                         //请求策略有效期
        CONFIRM_VALID: 1000,                            //二次确认最短时间
        PIC_ANALYSE_MAX_TIME: 180000,                   //图形验证码破解最大时间
        COMMON_SOLID_TIME: 300000,                      //持久化对象默认有效期
        SOLID_RECYCLE: 30000                            //扫描持久化缓存对象周期
    };
    return {
        /** 状态 */
        LOG_STATUS: {OK: 0, NONE: -1, FAIL: 1, TIMEOUT: 2},

        /** 时间参数 */
        TIME_PARAM: TIME_PARAM,

        /** 运行时缓存 不配置项则默认否*/
        CACHE_TYPE: {
            PID_DEVICE: {NAME: 'PID_DEVICE', VALID_CHECK: true, RECYCLE_TIME: TIME_PARAM.PID_VALID_TIME},
            DEVICE_CONTENT: {NAME: 'DEVICE_CONTENT', VALID_CHECK: true, RECYCLE_TIME: TIME_PARAM.PID_VALID_TIME},
            REQ_LOGIN_WAIT: {NAME: 'REQ_LOGIN_WAIT', VALID_CHECK: true},
            LOG_IN_STATUS: {NAME: 'LOG_IN_STATUS', VALID_CHECK: true},
            LOG_IN_TOKEN: {NAME: 'LOG_IN_TOKEN', VALID_CHECK: true},
            PAY_STRATEGY: {NAME: 'PAY_STRATEGY', VALID_CHECK: true, RECYCLE_TIME: TIME_PARAM.STRATEGY_VALID},
            JS_MM_CALLBACK: {NAME: 'JS_MM_CALLBACK', VALID_CHECK: true, RECYCLE_TIME: TIME_PARAM.LOG_IN_VALID},
            JS_TOKEN_USERID: {NAME: 'JS_TOKEN_USERID', VALID_CHECK: true, RECYCLE_TIME: TIME_PARAM.LOG_IN_VALID},
            '1758_STATE_PARAM': {NAME: '1758_STATE_PARAM', VALID_CHECK: true, RECYCLE_TIME: 1000 * 60 * 60},
            "BACK_CLIENT_ORDER_STATUS": {
                NAME: 'BACK_CLIENT_ORDER_STATUS',
                VALID_CHECK: true,
                RECYCLE_TIME: 1000 * 60 * 10
            },
            "BACK_CLIENT_USER_INFO": {NAME: 'BACK_CLIENT_USER_INFO', VALID_CHECK: true, RECYCLE_TIME: 1000 * 60 * 60},
            "BACK_CLIENT_USER_INFO_COUNT": {
                NAME: 'BACK_CLIENT_USER_INFO_COUNT',
                VALID_CHECK: true,
                RECYCLE_TIME: 1000 * 60 * 60
            },
            ORDER_CACHE: {
                NAME: 'ORDER_CACHE',
                SOLID_CHECK: true,
                SOLID_THEN_DEL: true,
                KEEP_MAX_TIME: TIME_PARAM.PIC_ANALYSE_MAX_TIME
            },
            TOKEN_CACHE: {
                NAME: 'TOKEN_CACHE',
                SOLID_CHECK: true,
                SOLID_THEN_DEL: true,
                KEEP_MAX_TIME: TIME_PARAM.LOG_IN_VALID
            }
        },
        /** 启动加载缓存 */
        CACHE_ON_START: {
            CONFIG: {NAME: 'CONFIG', SQL: 'SELECT * FROM t_mm_config;'},
            CPGAME: {NAME: 'CPGAME', SQL: 'SELECT * FROM t_mm_cpgame;'},
            CHANNEL: {NAME: 'CHANNEL', SQL: 'SELECT * FROM t_mm_channel;'},
            VCODE: {NAME: 'VCODE', SQL: 'SELECT * FROM t_mm_vcode order by `VCode`;'},
            SIGNGAME: {NAME: 'SIGNGAME', SQL: 'SELECT * FROM t_mm_signgame;'},
            PLATFORM: {NAME: 'PLATFORM', SQL: 'SELECT * FROM wumiao_open_platform;', DB: 'out_01'}
        },
        /** 运行时缓存 (请严格遵循数据库设计原则设计表)*/
        CACHE_ON_RUNNING: {
            ORDER_CACHE: {
                //DB
                INSERT: {
                    NAME: 'ORDER_CACHE',
                    TABLE: 't_mm_order',
                    COLUMN: ['CPOrderId', 'CPGameId', 'Price', 'VirtualGoods', 'GameName', 'UserId', 'VCode', 'ChannelId', 'CPId', 'CPServiceId', 'ConsumeCode', 'TransIDO', 'Success', 'Region']
                }
            },
            TOKEN_CACHE: {
                INSERT: {
                    NAME: 'TOKEN_CACHE',
                    TABLE: 't_mm_token',
                    COLUMN: ['TokenCode', 'Col01', 'Col02', 'Col03']
                },
                UPDATE: {
                    NAME: 'TOKEN_CACHE',
                    TABLE: 't_mm_token',
                    BASE_COLUMN: ['TokenCode', 'Col03'],
                    COLUMN: ['Col01', 'Col02']
                }
            }
        },
        /** 配置项名称 */
        CONFIG_ITEM: {
            PIC_CODE: 'PicCode',
            CONFIRM: 'Confirm',
            CONFIG_PAY: 'ConfigPay'
        },
        COMMON_PARAM: {
            DEFAULT_TIME: '2000-01-01 00:00:01',
            DEFAULT_DB: 'union_mobile_game'
        },
        CONTENT_TYPES: {
            HTML: {NAME: 'HTML', CONTENT: 'text/html'},
            TEXT: {NAME: 'TEXT', CONTENT: 'text/plain'},
            XML: {NAME: 'XML', CONTENT: 'text/xml'},
            JSON: {NAME: 'JSON', CONTENT: 'application/json'},
            JPEG: {NAME: 'JPEG', CONTENT: 'image/jpeg'},
            'FORM-URLENCODED': {NAME: 'FORM-URLENCODED', CONTENT: 'application/x-www-form-urlencoded'},
            ENCODE: '; charset=utf-8'
        }
    }
};

var types = Types();

global.CONST_ENV = process.env.NODE_ENV || "development"; // 引用系统环境变量设置运行环境
global.LOG_STATUS = types.LOG_STATUS;
global.TIME_PARAM = types.TIME_PARAM;
global.CACHE_TYPE = types.CACHE_TYPE;
global.CONFIG_ITEM = types.CONFIG_ITEM;
global.COMMON_PARAM = types.COMMON_PARAM;
global.CONTENT_TYPES = types.CONTENT_TYPES;
global.CACHE_ON_START = types.CACHE_ON_START;
global.CACHE_ON_RUNNING = types.CACHE_ON_RUNNING;
