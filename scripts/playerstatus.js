// noinspection JSCheckFunctionSignatures

import AfkStatus from "./afkStatus.mjs";
import WrittingStatus from "./writtingStatus.mjs";


Hooks.once('playerListStatusInit', function (register) {
    game.settings.register(AfkStatus.moduleName, "showAfkIndicator", {
        name: game.i18n.localize("PLAYER-STATUS.afk.showAfkIndicator"),
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        onChange: enabled => game.afkStatus.changeShowIndicator(enabled)
    });

    game.settings.register(AfkStatus.moduleName, "showChatNotification", {
        name: game.i18n.localize("PLAYER-STATUS.afk.showChatNotification"),
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
    });

    game.settings.register(AfkStatus.moduleName, "showChatActivityRemoveAFK", {
        name: game.i18n.localize("PLAYER-STATUS.afk.showChatActivityRemoveAFK"),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(WrittingStatus.moduleName, "timeOutSec", {
        name: game.i18n.localize("PLAYER-STATUS.typing.timeOutSec"),
        scope: 'world',
        config: true,
        type: Number,
        default: 5,
        onChange: () => game.writtingStatus.stop()
    });

    game.settings.register(WrittingStatus.moduleName, "typingIcon", {
        name: game.i18n.localize("PLAYER-STATUS.typing.icon"),
        scope: 'world',
        config: true,
        choices: {
            "⌛": "⌛",
            "🗨️": "🗨️"
        },
        type: String,
        default: "🗨️",
        onChange: setting => game.playerListStatus.changeValue(WrittingStatus.keyName, setting)
    });

    game.settings.register(AfkStatus.moduleName, "afkIconPosition", {
        name: game.i18n.localize("PLAYER-STATUS.afk.iconPosition"),
        scope: 'world',
        config: true,
        choices: {
            "1": game.i18n.localize("PLAYER-STATUS.iconPosition.beforeOnline"),
            "2": game.i18n.localize("PLAYER-STATUS.iconPosition.afterOnline"),
            "3": game.i18n.localize("PLAYER-STATUS.iconPosition.afterName")
        },
        type: String,
        default: "3",
        onChange: setting => game.afkStatus.changePosition(setting)
    });

    game.settings.register(WrittingStatus.moduleName, "typingIconPosition", {
        name: game.i18n.localize("PLAYER-STATUS.typing.iconPosition"),
        scope: 'world',
        config: true,
        choices: {
            "1": game.i18n.localize("PLAYER-STATUS.iconPosition.beforeOnline"),
            "2": game.i18n.localize("PLAYER-STATUS.iconPosition.afterOnline"),
            "3": game.i18n.localize("PLAYER-STATUS.iconPosition.afterName")
        },
        type: String,
        default: "3",
        onChange: setting => game.writtingStatus.changePosition(setting)
    });

    {
        let position = AfkStatus.parsePositionConfig(game.settings.get(AfkStatus.moduleName, "afkIconPosition"));
        let options = {
            resetFlags: false, override: false, position: position
        }

        if (register.registerKey(AfkStatus.keyName, "💤", options)) {
            Hooks.on("getSceneControlButtons", function (controls) {
                let tileControls = controls.find(x => x.name === "token");
                // noinspection JSUnusedGlobalSymbols
                tileControls.tools.push({
                    icon: "fas fa-comment-slash",
                    name: "afk",
                    title: "💤AFK",
                    button: true,
                    onClick: () => game.afkStatus.afk()
                });
            });
        }
    }
    {
        let position = WrittingStatus.parsePositionConfig(game.settings.get(WrittingStatus.moduleName, "typingIconPosition"));
        let options = {
            resetFlags: true,
            override: false,
            position: position
        }
        let typingIcon = game.settings.get(WrittingStatus.moduleName, "typingIcon");
        if (register.registerKey(WrittingStatus.keyName, typingIcon, options)) {
            Hooks.on("chatMessage", (_chatlog, _messageText, _chatData) => game.writtingStatus.stop());
        }
    }
});

Hooks.once('playerListStatusReady', function (playerListStatus) {
    Game.prototype.afkStatus = new AfkStatus();
    Game.prototype.writtingStatus = new WrittingStatus();

    if (playerListStatus.isRegistered("afk")) {
        let chat = document.getElementById('chat-message');
        chat.addEventListener("keydown", function () {
            game.writtingStatus.typing();
        });
    }
});
