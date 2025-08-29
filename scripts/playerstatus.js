// noinspection JSCheckFunctionSignatures

import AfkStatus from "./afkStatus.mjs";
import WrittingStatus from "./writtingStatus.mjs";

// Suppress deprecated global access warnings by mapping Game -> foundry.Game in V13+
Hooks.once('init', () => {
    try {
        if (globalThis?.foundry?.Game) {
            Object.defineProperty(globalThis, 'Game', {
                configurable: true,
                enumerable: false,
                get() { return foundry.Game; }
            });
        }
    } catch (e) {
        // ignore if property is non-configurable or environment differs
    }
});


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

    // noinspection JSUnusedLocalSymbols
    game.settings.register(AfkStatus.moduleName, "disableAfk", {
        name: game.i18n.localize("PLAYER-STATUS.afk.disable"),
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        onChange: enabled => window.location.reload(true)
    });

    // noinspection JSUnusedLocalSymbols
    game.settings.register(AfkStatus.moduleName, "disableTyping", {
        name: game.i18n.localize("PLAYER-STATUS.typing.disable"),
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        onChange: enabled => window.location.reload(true)
    });

    if (!game.settings.get(AfkStatus.moduleName, "disableAfk")) {
        let position = AfkStatus.parsePositionConfig(game.settings.get(AfkStatus.moduleName, "afkIconPosition"));
        let options = {
            resetFlags: false, override: false, position: position
        }

        if (register.registerKey(AfkStatus.keyName, "💤", options)) {
            Hooks.on("getSceneControlButtons", controls => {
                // Compare major version reliably (e.g., "12.331" -> 12)
                const major = parseInt(String(game.version).split('.')[0], 10);
                if (major >= 13) {
                    controls.tokens.tools.afk = {
                        name: "afk",
                        title: "💤AFK",
                        icon: "fas fa-comment-slash",
                        button: true,
                        onChange: () => game.afkStatus.afk()
                    };
                } else {
                    let tileControls = controls.find(x => x.name === "token");
                    // noinspection JSUnusedGlobalSymbols
                    tileControls.tools.push({
                        icon: "fas fa-comment-slash",
                        name: "afk",
                        title: "💤AFK",
                        button: true,
                        onClick: () => game.afkStatus.afk()
                    });
                }
            });
        }
    }
    if (!game.settings.get(AfkStatus.moduleName, "disableTyping")) {
        let position = WrittingStatus.parsePositionConfig(game.settings.get(WrittingStatus.moduleName, "typingIconPosition"));
        let options = {
            resetFlags: true,
            override: false,
            position: position
        }
        let typingIcon = game.settings.get(WrittingStatus.moduleName, "typingIcon");
        register.registerKey(WrittingStatus.keyName, typingIcon, options);
    }
});

Hooks.once('playerListStatusReady', function (playerListStatus) {
    if (playerListStatus.isRegistered(AfkStatus.keyName)) {
        // Avoid deprecated global Game; attach to the game instance
        game.afkStatus = new AfkStatus();
        game.chatCommands?.register({
            name: "/afk",
            module: "PlayerStatus",
            description: game.i18n.localize("PLAYER-STATUS.afk.afk_command"),
            icon: "<i class='fas fa-comment-slash'></i>"
        });
        game.chatCommands?.register({
            name: "/back",
            module: "PlayerStatus",
            description: game.i18n.localize("PLAYER-STATUS.afk.back_command"),
            icon: "<i class='fas fa-comment-slash'></i>"
        });
    }
    if (playerListStatus.isRegistered(WrittingStatus.keyName)) {
        // Avoid deprecated global Game; attach to the game instance
        game.writtingStatus = new WrittingStatus();
    }
});
