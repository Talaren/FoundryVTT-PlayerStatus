export default class AfkStatus {

    constructor() {
        this.isAfk = game.playerListStatus.isStatusActiv(game.user.id, "afk");
        this.moduleName = "playerStatus";
    }

    afk(reason) {
        if (this.isAfk) {
            if (game.settings.get(this.moduleName, "showChatNotification")) {
                let chatData = {
                    content: game.i18n.format("PLAYER-STATUS.afk.back", {
                        name: game.user.name
                    }),
                    type: CONST.CHAT_MESSAGE_TYPES.OOC
                };
                ChatMessage.create(chatData);
            }
            if (game.settings.get(this.moduleName, "showEmojiIndicator")) {
                switch (game.settings.get("playerStatus", "afkIconPosition")) {
                case "1":
                    game.playerListStatus.removeStatusBeforeOnlineStatus(game.user.id, "afk");
                    break;
                case "2":
                    game.playerListStatus.removeStatusBeforePlayername(game.user.id, "afk");
                    break;
                case "3":
                    game.playerListStatus.removeStatusAfterPlayername(game.user.id, "afk");
                    break;
                }
            }
            this.isAfk = false;
        } else {
            if (game.settings.get(this.moduleName, "showChatNotification")) {
                let chatData = {
                    content: game.i18n.format("PLAYER-STATUS.afk.afk", {
                        name: game.user.name
                    }) + (typeof reason !== 'undefined' ? "<br/>" + reason : ""),
                    type: CONST.CHAT_MESSAGE_TYPES.OOC
                };
                ChatMessage.create(chatData);
            }
            if (game.settings.get(this.moduleName, "showEmojiIndicator")) {
                switch (game.settings.get("playerStatus", "afkIconPosition")) {
                case "1":
                    game.playerListStatus.addStatusBeforeOnlineStatus(game.user.id, "afk", "💤");
                    break;
                case "2":
                    game.playerListStatus.addStatusBeforePlayername(game.user.id, "afk", "💤");
                    break;
                case "3":
                    game.playerListStatus.addStatusAfterPlayername(game.user.id, "afk", "💤");
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
