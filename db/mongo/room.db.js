const mongoose = require("mongoose");
const conn = require("./conn.db");
const dbUtil = require("../../utils/db.util");

const roomSchema = new mongoose.Schema({
    createdBy: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: dbUtil.room.status.active
    },
    numberOfPlayer: {
        type: Number,
        required: true
    },
    numberOfRound: {
        type: Number,
        required: true
    }
})

module.exports = conn.model("rooms", roomSchema);