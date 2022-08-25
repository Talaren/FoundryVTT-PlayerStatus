export default class WrittingStatus {

    static moduleName = "playerStatus";
    static keyName = "typing";

    constructor() {
        this.keytimer = undefined;
        let chat = document.getElementById('chat-message');
        chat.addEventListener("keydown", function () {
            this.typing();
        }.bind(this));
    }

    typing() {
        if (typeof this.keytimer !== 'undefined') {
            clearTimeout(this.keytimer);
        } else {
            game.playerListStatus.on(WrittingStatus.keyName);
        }
        this.keytimer = setTimeout(function() {
            this.stop();
        }.bind(this), (game.settings.get("playerStatus", "timeOutSec") * 1000));
    }

    stop() {
        if (typeof this.keytimer !== "undefined") {
            clearTimeout(this.keytimer);
        }
        game.playerListStatus.off(WrittingStatus.keyName);
        this.keytimer = undefined;
    }

    changePosition(setting) {
        game.playerListStatus.changePosition(WrittingStatus.keyName, WrittingStatus.parsePositionConfig(setting))
    }

    /**
     * Parse the position config to a position
     * @param {string} setting The position config
     * @returns {symbol} The position
     */
    static parsePositionConfig(setting) {
        switch (setting) {
            case "1":
                return PLAYERLIST.POSITIONS.BEFORE_ONLINE_STATUS;
            case "2":
                return PLAYERLIST.POSITIONS.BEFORE_PLAYERNAME;
            case "3":
                return PLAYERLIST.POSITIONS.AFTER_PLAYERNAME;
        }
    }
}
