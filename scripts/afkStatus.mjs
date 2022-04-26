export default class AfkStatus {

    constructor() {
        this.isAfk = false;
        this.moduleName = "playerStatus";
    }

    afk(reason) {
        if (this.isAfk) {
            if (game.settings.get(this.moduleName, "showChatNotification")) {
                let player = game.user;
                let chatData = {
                    content: game.i18n.format("PLAYER-STATUS.afk.back", {
                        name: player.name
                    }),
                    type: CONST.CHAT_MESSAGE_TYPES.OOC
                };
                ChatMessage.create(chatData);
            }
            if (game.settings.get(this.moduleName, "showEmojiIndicator")) {
                switch (game.settings.get("playerStatus", "afkIconPosition")) {
                case "1":
                    PlayerListStatus.removeStatusBeforeOnlineStatus(game.user.name, "afk");
                    break;
                case "2":
                    PlayerListStatus.removeStatusBeforePlayername(game.user.name, "afk");
                    break;
                case "3":
                    PlayerListStatus.removeStatusAfterPlayername(game.user.name, "afk");
                    break;
                }
            }
            this.isAfk = false;
        } else {
            if (game.settings.get(this.moduleName, "showChatNotification")) {
                let player = game.user;
                let chatData = {
                    content: game.i18n.format("PLAYER-STATUS.afk.afk", {
                        name: player.name
                    }) + (typeof reason !== 'undefined' ? "<br/>" + reason : ""),
                    type: CONST.CHAT_MESSAGE_TYPES.OOC
                };
                ChatMessage.create(chatData);
            }
            if (game.settings.get(this.moduleName, "showEmojiIndicator")) {
                switch (game.settings.get("playerStatus", "afkIconPosition")) {
                case "1":
                    PlayerListStatus.addStatusBeforeOnlineStatus(game.user.name, "afk", "💤");
                    break;
                case "2":
                    PlayerListStatus.addStatusBeforePlayername(game.user.name, "afk", "💤");
                    break;
                case "3":
                    PlayerListStatus.addStatusAfterPlayername(game.user.name, "afk", "💤");
                    break;
                }
            }
            this.isAfk = true;
        }
    }

    back() {
        if (this.isAfk) {
            this.afk();
        }
    }
}
