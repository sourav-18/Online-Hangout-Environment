const roomDb = require("../db/mongo/room.db");
const devLogUtil = require("../utils/devLog.util")
const responseUtil = require("../utils/response.util");
const serverEnvUtil = require("../utils/serverEnv.util");

exports.create = async (req,res) => {
    try {
        const { numberOfPlayer, numberOfRound, createdBy } = req.body;
        const dbRes = await roomDb.create({
            numberOfPlayer: numberOfPlayer,
            numberOfRound: numberOfRound,
            createdBy: createdBy
        })
        res.json(responseUtil.success("room crate successfully", dbRes._id));
    } catch (error) {
        const errorMessage = "error to creating room";
        res.json(responseUtil.error(errorMessage))
        devLogUtil(errorMessage, error)
    }
}

