const redisClient = require('./client.redis');

exports.get = async (key) => {
    let result = await redisClient.get(key);
    if (result) {
        return result;
    } else {
        return false;
    }
}

exports.set = async (key, value) => {
    let result = await redisClient.set(key, value);
    if (result) {
        return result;
    }
    return false;
}