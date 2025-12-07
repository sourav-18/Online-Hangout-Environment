let io = null;
const redisKey = require("../db/redis/key.redis");
const redisFun = require("../db/redis/fun.redis");
const socketKeyUtil = require("../utils/socketKey.util");

exports.init = (ioRcv) => {
    io = ioRcv;
}


exports.emitRoom = ({ roomId, event, data }) => {
    io.to(roomId).emit(event, {
        status: "success",
        message: "room Event",
        responseCode: 200,
        data: data
    });
}

exports.roomUpdate = async (roomId) => {
    let roomDetails = await redisFun.get(redisKey.keys.room(roomId));
    if (!roomDetails) return;
    roomDetails = JSON.parse(roomDetails);
    delete roomDetails.randomValues;
    for(let i=0;i<roomDetails.players.length;i++){
        delete roomDetails.players[i].guessNumbers;
    }
    this.emitRoom({ roomId: roomId, event: socketKeyUtil.emit.roomUpdate, data: roomDetails });
}

exports.updatePlayerScore = async (roomId) => {
    let roomDetails = await redisFun.get(redisKey.keys.room(roomId));
    if (!roomDetails) return;
    roomDetails = JSON.parse(roomDetails);
    let playerScores = roomDetails.players.map((item) => {
        return {
            userId: item.userId, correctAnswerCount: item.correctAnswerCount
        }
    })
    this.emitRoom({ roomId: roomId, event: socketKeyUtil.emit.roomPlayerScoreUpdate, data: playerScores });
}

exports.emitToUser = ({ socketId, event, data }) => {
    io.to(socketId).emit(event, {
        status: "success",
        message: "User Event",
        responseCode: 200,
        data: data
    })
}

exports.emitToUserError = ({ socketId, message }) => {
    io.to(socketId).emit(socketKeyUtil.emit.error, {
        status: "success",
        message: message,
        responseCode: 500,
        data: null
    })
}

