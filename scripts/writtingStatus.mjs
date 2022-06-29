export default class WrittingStatus {

    constructor(playerName) {
        this.moduleName = "playerStatus";
        this.keytimer = undefined;
        this.stop();
    }

    typing() {
        if (typeof this.keytimer !== 'undefined') {
            clearTimeout(this.keytimer);
        } else {
            let typingIcon = game.settings.get(this.moduleName, "typingIcon");
            switch (game.settings.get("playerStatus", "typingIconPosition")) {
            case "1":
                game.playerListStatus.addStatusBeforeOnlineStatus(game.user.id, "typping", typingIcon);
                break;
            case "2":
                game.playerListStatus.addStatusBeforePlayername(game.user.id, "typping", typingIcon);
                break;
            case "3":
                game.playerListStatus.addStatusAfterPlayername(game.user.id, "typping", typingIcon);
                break;
            }
        }
        this.keytimer = setTimeout(() => {
            this.stop();
        }, (game.settings.get("playerStatus", "timeOutSec") * 1000));
    }

    stop() {
        if (typeof this.keytimer !== "undefined") {
            clearTimeout(this.keytimer);
        }
        switch (game.settings.get(this.moduleName, "typingIconPosition")) {
        case "1":
            game.playerListStatus.removeStatusBeforeOnlineStatus(game.user.id, "typping");
            break;
        case "2":
            game.playerListStatus.removeStatusBeforePlayername(game.user.id, "typping");
            break;
        case "3":
            game.playerListStatus.removeStatusAfterPlayername(game.user.id, "typping");
            break;
        }
        this.keytimer = undefined;
    }
}
