export default class AfkStatus {

    static moduleName = "playerStatus";
    static keyName = "afk";

    constructor() {
        this.isAfk = game.playerListStatus.status(AfkStatus.keyName);
        Hooks.on("chatMessage", function (_chatlog, messageText, _chatData) {
            if (messageText.startsWith("/afk") || messageText.startsWith("brb")) {
                let reason = messageText.indexOf(" ") > 0 ? messageText.substring(messageText.indexOf(" ")) : undefined;
                this.afk(reason);
                return false;
            }
            if (messageText.startsWith("/back")) {
                this.back();
                return false;
            }
            if (game.settings.get("playerStatus", "showChatActivityRemoveAFK")) {
                this.back();
            }
        }.bind(this));
    }

    afk(reason) {
        if (this.isAfk) {
            if (game.settings.get(AfkStatus.moduleName, "showChatNotification")) {
                // noinspection JSUnresolvedVariable
                let chatData = {
                    content: game.i18n.format("PLAYER-STATUS.afk.back", {
                        name: game.user.name
                    })
                };
                const FC = foundry?.CONST;
                if (FC?.CHAT_MESSAGE_STYLES?.OOC != null) {
                    chatData.style = FC.CHAT_MESSAGE_STYLES.OOC;
                } else {
                    chatData.type = CONST.CHAT_MESSAGE_TYPES.OOC;
                }
                ChatMessage.create(chatData);
            }
            if (game.settings.get(AfkStatus.moduleName, "showAfkIndicator")) {
                game.playerListStatus.off(AfkStatus.keyName);
            }
        } else {
            if (game.settings.get(AfkStatus.moduleName, "showChatNotification")) {
                // noinspection JSUnresolvedVariable
                let chatData = {
                    content: game.i18n.format("PLAYER-STATUS.afk.afk", {
                        name: game.user.name
                    }) + (typeof reason !== 'undefined' ? "<br/>" + reason : "")
                };
                const FC = foundry?.CONST;
                if (FC?.CHAT_MESSAGE_STYLES?.OOC != null) {
                    chatData.style = FC.CHAT_MESSAGE_STYLES.OOC;
                } else {
                    chatData.type = CONST.CHAT_MESSAGE_TYPES.OOC;
                }
                ChatMessage.create(chatData);
            }
            if (game.settings.get(AfkStatus.moduleName, "showAfkIndicator")) {
                game.playerListStatus.on(AfkStatus.keyName);
            }
        }
        this.isAfk = !this.isAfk;
    }

    back() {
        if (this.isAfk) {
            this.afk();
        }
    }

    changeShowIndicator(enabled) {
        if (enabled) {
            game.playerListStatus.on(AfkStatus.keyName);
        } else {
            game.playerListStatus.off(AfkStatus.keyName)
        }
    }

    changePosition(setting) {
        game.playerListStatus.changePosition(AfkStatus.keyName, AfkStatus.parsePositionConfig(setting))
    }

    /**
     * parse the position to show
     * @param {string} setting the setting from Foundry
     * @returns {Object} the position
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
