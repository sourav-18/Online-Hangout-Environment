const redis = require('redis');
const serverEnvUtil = require('../../utils/serverEnv.util');
const client = redis.createClient({
    url: serverEnvUtil.REDIS_URL,
});

client.on('error', err => { });
client.on('end', () => console.log('Redis Server End'));

async function init() {
    await client.connect();
    console.log("Redis connected");
    await client.select(serverEnvUtil.REDIS_PARTITIONS);
    console.log("Redis selected db " + serverEnvUtil.REDIS_PARTITIONS);
    // await client.flushDb();
    // console.log("Redis flushed");
}

init();

module.exports = client;