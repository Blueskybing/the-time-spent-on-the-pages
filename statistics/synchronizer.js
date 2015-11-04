/**
 * Created by bluesky on 15-11-4.
 * Description：定时同步数据到数据库
 */

"use strict";

var synchronizer = {};

synchronizer.syncGameLog = function(){

    _Log.info("开始同步缓存中的停留时长日志到数据库中...");

    var now = new Date().getTime();
    var total = 0;
    var success = 0;
    var failed = 0;
    var nc = 0;

    _Log.log.info("开始同步上一次没有同步的日志...");

    var log_index_list_key = 'log_index_list_key';
    var gameLogIndexListJson = _LocalCache.get()

    var gameLogIndexList = new ArrayList();

    if (gameLogIndexListJson == null)
    {
        this.cm.set(gameLogIndexListKey, JsonUtils.toString(gameLogIndexList));
    }
    else {
        gameLogIndexList = JsonUtils.toList(gameLogIndexListJson);
    }
    total = gameLogIndexList.size();
    Iterator it = gameLogIndexList.iterator();
    while (it.hasNext())
    {
        String gameLogKey = (String)it.next();
        try {
            String gameLogLogJson = this.cm.get(gameLogKey);
            if (gameLogLogJson != null)
            {
                UserGameLog userGameLog = (UserGameLog)JsonUtils.fromString(
                gameLogLogJson, UserGameLog.class);
                if (now - userGameLog.getLongTime() > 30000L)
                {
                    userGameLog.setPlayTime(DateTime.now());
                    this.userGameLogDaoImpl.add(userGameLog);
                    this.cm.delete(gameLogKey);
                    it.remove();
                    success++;
                }
            else {
                nc++;
            }
            }
            else
            {
                it.remove();
                failed++;
            }
        }
        catch (Exception e) {
        log.error("同步失败 gameLog:\n" + gameLogKey, e);
        failed++;
    }
    }

    log.info("开始同步当次日志...");

    var startIndexKey = LogCacheKeyFactory.getGameLogIndexStartKey();
    var startIndexStr = this.cm.get(startIndexKey);
    var startIndex = 0L;
    if (startIndexStr != null)
    {
        startIndex = Long.parseLong(startIndexStr);
    }

    var counterKey = LogCacheKeyFactory.getGameLogCounterKey();
    var counterStr = this.cm.get(counterKey);
    var endIndex = Long.parseLong(counterStr);

    log.info("开始索引和结束索引分别为：" + startIndex + "," + endIndex);
    total += endIndex - startIndex + 1L;
    for (long i = startIndex; i <= endIndex; i += 1L)
    {
        var gameLogCountKey = LogCacheKeyFactory.getGameLogCountKey(i);
        var gameLogKey = this.cm.get(gameLogCountKey);
        try {
            String gameLogLogJson = this.cm.get(gameLogKey);
            UserGameLog userGameLog = (UserGameLog)JsonUtils.fromString(gameLogLogJson,
                UserGameLog.class);

            if (now - userGameLog.getLongTime() > 30000L)
            {
                userGameLog.setPlayTime(DateTime.now());
                this.userGameLogDaoImpl.add(userGameLog);
                this.cm.delete(gameLogKey);
                success++;
            }
        else {
                gameLogIndexList.add(gameLogKey);
                nc++;
            }
        }
        catch (Exception e) {
        log.error("同步失败 gameLog:\n" + gameLogKey, e);
        failed++;
    }

    }

    this.cm.set(startIndexKey, String.valueOf(endIndex + 1L));
    this.cm.set(gameLogIndexListKey, JsonUtils.toJson(gameLogIndexList));

    log.info("结束同步缓存中的游戏日志到数据库中，总数:{}, 成功:{}, 失败:{}, 不符合:{}, 耗时:{}ms\n", new Object[] { Long.valueOf(total), Integer.valueOf(success), Integer.valueOf(failed), Integer.valueOf(nc), Long.valueOf(System.currentTimeMillis() - now) });
}