const serverEnvUtil = require("./serverEnv.util")

module.exports = (...message) => {
    if (serverEnvUtil.SERVER_ENVIRONMENT=='dev')
        console.log(...message);
    return;
}