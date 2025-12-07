module.exports = {
    emit: {
        error:"on::error",
        roomPlayerOnline: "on::room:player-online",
        roomPlayerOffline: "on::room:player-offline",
        roomPlayerJoin: "on::room:player-join",
        roomUpdate: "on::room:update",
        roomStatusUpdate: "on::room:status-update",
        roomGuessNumberStart: "on::room:guess-number-start",
        roomPlayerGuessNumber:"on::room:player-guess-number",
        roomCorrectGuessNumber:"on::room:correct-guess-number",
        roomPlayerGuessCorrectNumber:"on::room:player-guess-correct-number",
        roomPlayerScoreUpdate:"on:room:player-score-update",
        oneTwoOneMessage:"on::one-two-one-message",
        groupMessage:"on::group-message",
        groupVoiceMessage:"on::group-voice-message"
    },
    on: {
        roomPlayerGuessNumber:"room:guess-number",
        oneTwoOneMessage:"one-two-one-message",
        groupMessage:"group-message",
        groupVoiceMessage:"group-voice-message"
    }
}