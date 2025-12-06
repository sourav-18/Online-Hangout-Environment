require("dotenv").config()
require("./db/mongo/conn.db");
require("./db/redis/client.redis");
const express = require("express");
const http = require("http")
const socketIO = require("socket.io");
const bodyParser = require("body-parser");
const serverEnvUtil = require("./utils/serverEnv.util");
const roomRoute = require("./routes/room.route");
const { verify } = require("./middlewares/socketConnection.middleware");
const ioController = require("./controllers/io.controller");
const roomSocketController = require("./controllers/roomSocket.controller");


const app = express();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    if (!req.body) req.body = {};
    next()
})

const server = http.createServer(app);

let io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

//socket

io.use(verify).on('connection', (socket) => {
    roomSocketController.join(socket);

    socket.on("disconnect", () => {
        roomSocketController.disconnect(socket);
        console.log("disconnect: ", socket.id);
    });

})

//api

app.use("/api/v1/rooms", roomRoute);

server.listen(serverEnvUtil.SERVER_PORT, (err) => {
    if (!err) {
        console.log(`socket server running at ${serverEnvUtil.SERVER_PORT}`)
        return;
    }
    console.log(`error at server running: `, err)
})

ioController.init(io);