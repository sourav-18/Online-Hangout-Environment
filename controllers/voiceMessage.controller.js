const devLogUtil = require("../utils/devLog.util");
const ioController = require("../controllers/io.controller");
const fs = require('fs');
const path = require('path');
const socketKeyUtil = require("../utils/socketKey.util");

exports.groupVoiceMessage = (socket, meta, buffer) => {
    try {

        const filename = `${Date.now()}-voice.webm`;
        const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
        const filepath = path.join(UPLOAD_DIR, filename);

        const nodeBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
        fs.writeFileSync(filepath, nodeBuffer);

        const payload = {
            from: socket.data.userId,
            filename: filename,
            mimeType: meta.mimeType,
            url: `/uploads/${filename}`,
        };

        ioController.emitRoom({roomId:socket.data.roomId,event:socketKeyUtil.emit.groupVoiceMessage,data:{
            payload:payload,
            nodeBuffer:nodeBuffer
        }})

    } catch (error) {
        devLogUtil(error)
    }
}