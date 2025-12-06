const redisFun = require("../db/redis/fun.redis");
const redisKey = require("../db/redis/key.redis");
const roomUtil = require("../utils/room.util");
const ioController = require("../controllers/io.controller");
const socketKeyUtil = require("../utils/socketKey.util");
const devLogUtil = require("../utils/devLog.util");

exports.join = async (socket) => {
    try {
        const { roomId, userId, numberOfPlayer, numberOfRound, createdBy } = socket.data;
        let roomDetails = await redisFun.get(redisKey.keys.room(roomId));

        if (!roomDetails) {
            roomDetails = {
                players: [{ userId: userId, action: roomUtil.player.action.ideal, status: roomUtil.player.status.online }],
                joinPlayerCount: 1,
                numberOfPlayer: numberOfPlayer,
                numberOfRound: numberOfRound,
                status: roomUtil.status.active,
                event: roomUtil.event.ideal,
                randomValues: getRandomNumber(numberOfRound),
                currentRound: 0,
            }
        } else {
            roomDetails = JSON.parse(roomDetails);
            if (roomDetails.status == roomUtil.status.completed) {
                ioController.emitToUserError({ socketId: socket.id, message: "Room was already completed" });
                return;
            }
            else if (roomDetails.status == roomUtil.status.live) {
                const playerIndex = roomDetails.players.findIndex((item) => item.userId == userId);
                if (playerIndex == -1) {
                    roomDetails.players[playerIndex].status = roomUtil.player.status.online
                }
                ioController.emitRoom({ roomId: roomId, event: socketKeyUtil.emit.roomPlayerOnline, data: userId });
            } else if (roomDetails.joinPlayerCount < roomDetails.numberOfPlayer) {
                roomDetails.players.push({ userId: userId, action: roomUtil.player.action.ideal, status: roomUtil.player.status.online });
                roomDetails.joinPlayerCount++;
                ioController.emitRoom({ roomId: roomId, event: socketKeyUtil.emit.roomPlayerJoin, data: userId });
            } else {
                ioController.emitToUserError({ socketId: socket.id, message: "Room was full" });
                return;
            }
        }

        socket.join(roomId);

        await redisFun.set(redisKey.keys.room(roomId), JSON.stringify(roomDetails));
        ioController.roomUpdate(roomId);

        gotoLive(roomId)

    } catch (error) {
        devLogUtil(error);
    }

}

async function gotoLive(roomId) {

    let roomDetails = await redisFun.get(redisKey.keys.room(roomId));
    if (!roomDetails) return;
    roomDetails = JSON.parse(roomDetails);
    if (roomDetails.status == roomUtil.status.active && roomDetails.joinPlayerCount == roomDetails.numberOfPlayer) {
        roomDetails.status = roomUtil.status.live;
        await redisFun.set(redisKey.keys.room(roomId), JSON.stringify(roomDetails));
        ioController.emitRoom({ roomId: roomId, event: socketKeyUtil.emit.roomStatusUpdate, data: roomUtil.status.live });
        ioController.emitRoom({ roomId: roomId, event: socketKeyUtil.emit.roomGuessNumberStart, data: null });

    }

}



exports.disconnect = async (socket) => {
    try {
        const { roomId, userId, createdBy } = socket.data;
        let roomDetails = await redisFun.get(redisKey.keys.room(roomId));
        if (!roomDetails) return;
        roomDetails = JSON.parse(roomDetails);
        const playerIndex = roomDetails.players.findIndex((item) => item.userId == userId);
        if (playerIndex == -1) return;

        if (roomDetails.status == roomUtil.status.active) {
            roomDetails.players = roomDetails.players.filter((item) => item.userId != userId);
            roomDetails.joinPlayerCount--;
            await redisFun.set(redisKey.keys.room(roomId), JSON.stringify(roomDetails));
            ioController.roomUpdate(roomId);
        } else {
            roomDetails.players[playerIndex].status = roomUtil.player.status.offline;
            await redisFun.set(redisKey.keys.room(roomId), JSON.stringify(roomDetails));
            ioController.emitRoom({ roomId, event: socketKeyUtil.emit.roomPlayerOffline, data: userId });
        }
    } catch (error) {
        devLogUtil(error);
    }
}

function getRandomNumber(range) {
    let arr = [];
    for (let i = 0; i < range; i++) {
        arr.push(Math.ceil(Math.random() * 9));
    }
    return arr;
}



// exports.joinV2 = async (socket) => {
//     try {
//         const { roomId, userId, numberOfPlayer, numberOfRound, createdBy } = socket.data;
//         let roomDetails = await redisFun.get(redisKey.keys.room(roomId));

//         if (!roomDetails) {
//             roomDetails = {
//                 createdBy: createdBy,
//                 players: [{ userId: createdBy, action: roomUtil.player.action.ideal, status: roomUtil.player.status.online }],
//                 joinPlayerCount: 1,
//                 numberOfPlayer: numberOfPlayer,
//                 numberOfRound: numberOfRound,
//                 status: roomUtil.status.active,
//                 event: roomUtil.event.ideal
//             }
//         } else {
//             roomDetails = JSON.parse(roomDetails);
//         }


//         if (roomDetails.status == roomUtil.status.completed) {
//             ioController.emitToUserError({ socketId: socket.id, message: "Room was already completed" });
//             return;
//         }
//         else if (roomDetails.status == roomUtil.status.live||userId==createdBy) {
//             const playerIndex = roomDetails.players.findIndex((item) => item.userId == userId);
//             if (playerIndex == -1) {
//                 roomDetails.players[playerIndex].status = roomUtil.player.status.online
//             }
//             ioController.emitRoom({ roomId: roomId, event: socketKeyUtil.emit.roomPlayerOnline, data: userId });
//         }


//         if (userId != createdBy) {
//             roomDetails.players.push({ userId: userId, action: roomUtil.player.action.ideal, status: roomUtil.player.status.online });
//             roomDetails.joinPlayerCount++;
//             ioController.emitRoom({ roomId: roomId, event: socketKeyUtil.emit.roomPlayerJoin, data: userId });
//         }

//         socket.join(roomId)

//         await redisFun.set(redisKey.keys.room(roomId), JSON.stringify(roomDetails));

//         ioController.roomUpdate(roomId);

//     } catch (error) {
//         devLogUtil(error);
//     }

// }

// exports.disconnectV2 = async (socket) => {
//     try {
//         const { roomId, userId, createdBy } = socket.data;
//         let roomDetails = await redisFun.get(redisKey.keys.room(roomId));
//         if(!roomDetails)return;
//         roomDetails = JSON.parse(roomDetails);
//         const playerIndex = roomDetails.players.findIndex((item) => item.userId == userId);
//         if (playerIndex == -1) return;

//         if (roomDetails.status == roomUtil.status.active && userId != createdBy) {
//             roomDetails.players = roomDetails.players.filter((item) => item.userId != userId);
//             roomDetails.joinPlayerCount--;
//             await redisFun.set(redisKey.keys.room(roomId), JSON.stringify(roomDetails));
//             ioController.roomUpdate(roomId);
//         } else {
//             roomDetails.players[playerIndex].status = roomUtil.player.status.offline;
//             await redisFun.set(redisKey.keys.room(roomId), JSON.stringify(roomDetails));
//             ioController.emitRoom({ roomId, event: socketKeyUtil.emit.roomPlayerOffline, data: userId });
//         }
//     } catch (error) {
//         devLogUtil(error);
//     }
// }