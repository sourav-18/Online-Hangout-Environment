const ioController = require("../controllers/io.controller");
const socketKeyUtil = require("../utils/socketKey.util");
const redisKey = require("../db/redis/key.redis");
const redisFun = require("../db/redis/fun.redis");

exports.oneTwoOneMessage = async (socket, data) => {
    let roomDetails = await redisFun.get(redisKey.keys.room(socket.data.roomId));
    if (!roomDetails) return;
    roomDetails = JSON.parse(roomDetails);
    const receiverUserId = data.userId;
    const player = roomDetails.players.find((item) => item.userId == receiverUserId);
    console.log(player.socketId);
    if (player) {
        ioController.emitToUser({
            socketId: player.socketId, event: socketKeyUtil.emit.oneTwoOneMessage, data: {
                message: data.message,
                userId: socket.userId
            }
        });
    }
    return;
}

exports.groupMessage = async (socket, data) => {
    ioController.emitRoom({
        roomId: socket.data.roomId, event: socketKeyUtil.emit.groupMessage, data: {
            message: data.message,
            userId: socket.userId
        }
    });

}