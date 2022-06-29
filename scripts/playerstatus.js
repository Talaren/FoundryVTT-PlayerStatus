import AfkStatus from "./afkStatus.mjs";
import WrittingStatus from "./writtingStatus.mjs";

Hooks.on("chatMessage", (chatlog, messageText, chatData) => {
    if (messageText.startsWith("/afk") || messageText.startsWith("brb")) {
        let reason = messageText.indexOf(" ") > 0 ? messageText.substr(messageText.indexOf(" ")) : undefined;
        window.game.afkStatus.afk(reason);
        return false;
    }
    if (messageText.startsWith("/back")) {
        window.game.afkStatus.back();
        return false;
    }
    if (game.settings.get("playerStatus", "showChatActivityRemoveAFK")) {
        window.game.afkStatus.back();
    }
    window.game.writtingStatus.stop();
});

Hooks.once('ready', function () {
    let moduleName = 'playerStatus';

    game.settings.register(moduleName, "showEmojiIndicator", {
        name: game.i18n.localize("PLAYER-STATUS.afk.showEmojiIndicator.name"),
        scope: 'world',
        config: true,
        type: Boolean,
    default:
        true
    });

    game.settings.register(moduleName, "showChatNotification", {
        name: game.i18n.localize("PLAYER-STATUS.afk.showChatNotification.name"),
        scope: 'world',
        config: true,
        type: Boolean,
    default:
        false
    });

    game.settings.register(moduleName, "showChatActivityRemoveAFK", {
        name: game.i18n.localize("PLAYER-STATUS.afk.showChatActivityRemoveAFK.name"),
        scope: 'client',
        config: true,
        type: Boolean,
    default:
        true
    });

    game.settings.register(moduleName, "timeOutSec", {
        name: game.i18n.localize("PLAYER-STATUS.typing.timeOutSec.name"),
        scope: 'world',
        config: true,
        type: Number,
    default:
        5
    });

    game.settings.register(moduleName, "typingIcon", {
        name: game.i18n.localize("PLAYER-STATUS.typing.icon.name"),
        scope: 'world',
        config: true,
        choices: {
            "⌛": "⌛",
            "🗨️": "🗨️"
        },
        type: String,
    default:
        "🗨️"
    });

    game.settings.register(moduleName, "afkIconPosition", {
        name: game.i18n.localize("PLAYER-STATUS.afk.iconPosition.name"),
        scope: 'world',
        config: true,
        choices: {
            "1": game.i18n.localize("PLAYER-STATUS.iconPosition.beforeOnline"),
            "2": game.i18n.localize("PLAYER-STATUS.iconPosition.afterOnline"),
            "3": game.i18n.localize("PLAYER-STATUS.iconPosition.afterName")
        },
        type: String,
    default:
        "3"
    });

    game.settings.register(moduleName, "typingIconPosition", {
        name: game.i18n.localize("PLAYER-STATUS.typing.iconPosition.name"),
        scope: 'world',
        config: true,
        choices: {
            "1": game.i18n.localize("PLAYER-STATUS.iconPosition.beforeOnline"),
            "2": game.i18n.localize("PLAYER-STATUS.iconPosition.afterOnline"),
            "3": game.i18n.localize("PLAYER-STATUS.iconPosition.afterName")
        },
        type: String,
    default:
        "3"
    });

    let afkStatus = new AfkStatus();
    window.game.afkStatus = afkStatus;
    let writtingStatus = new WrittingStatus();
    window.game.writtingStatus = writtingStatus;

    let chat = document.getElementById('chat-message');
    chat.addEventListener("keydown", function (event) {
        window.game.writtingStatus.typing();
    });
});

Hooks.on("getSceneControlButtons", function (controls) {
    let tileControls = controls.find(x => x.name === "token");
    tileControls.tools.push({
        icon: "fas fa-comment-slash",
        name: "afk",
        title: "💤AFK",
        button: true,
        onClick: () => window.game.afkStatus.afk()
    });
});
