const roomDb = require("../db/mongo/room.db");
const devLogUtil = require("../utils/devLog.util");

exports.verify = async (socket, next) => {
    try {
        let roomId = socket.handshake.headers["room-id"]||socket.handshake.query['roomId'];
        let userId = socket.handshake.headers["user-id"]||socket.handshake.query['userId'];
        if (!userId || !roomId) return next(new Error("please provide userId and roomId"));
        const roomData = await roomDb.findById(roomId).select({ _id: 1, createdBy: 1,numberOfRound:1,numberOfPlayer:1 });
        if (roomData == null) return next(new Error("invalid room id"));
        socket.data = {
            roomId: roomId,
            userId: userId,
            numberOfRound:roomData.numberOfRound,
            numberOfPlayer:roomData.numberOfPlayer,
            createdBy:roomData.createdBy,
        }

        next()
    } catch (error) {
        devLogUtil(error)
        next(new Error(error.message))
    }
}