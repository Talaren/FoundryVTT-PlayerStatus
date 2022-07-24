import AfkStatus from "./afkStatus.mjs";
import WrittingStatus from "./writtingStatus.mjs";

Hooks.on("getSceneControlButtons", function(controls) {
	let tileControls = controls.find(x => x.name === "token");
	tileControls.tools.push({
		icon: "fas fa-comment-slash",
		name: "afk",
		title: "💤AFK",
		button: true,
		onClick: () => game.afkStatus.afk()
	});
});

Hooks.once('playerListStatusReady', function() {
	let moduleName = 'playerStatus';

	game.settings.register(moduleName, "showAfkIndicator", {
		name: game.i18n.localize("PLAYER-STATUS.afk.showAfkIndicator"),
		scope: 'world',
		config: true,
		type: Boolean,
		default: true,
		onChange: enabled => game.afkStatus.changeShowIndicator(enabled)
	});

	game.settings.register(moduleName, "showChatNotification", {
		name: game.i18n.localize("PLAYER-STATUS.afk.showChatNotification"),
		scope: 'world',
		config: true,
		type: Boolean,
		default: false,
	});

	game.settings.register(moduleName, "showChatActivityRemoveAFK", {
		name: game.i18n.localize("PLAYER-STATUS.afk.showChatActivityRemoveAFK"),
		scope: 'client',
		config: true,
		type: Boolean,
		default: true
	});

	game.settings.register(moduleName, "timeOutSec", {
		name: game.i18n.localize("PLAYER-STATUS.typing.timeOutSec"),
		scope: 'world',
		config: true,
		type: Number,
		default: 5,
		onChange: () => game.writtingStatus.stop()
	});

	game.settings.register(moduleName, "typingIcon", {
		name: game.i18n.localize("PLAYER-STATUS.typing.icon"),
		scope: 'world',
		config: true,
		choices: {
			"⌛": "⌛",
			"🗨️": "🗨️"
		},
		type: String,
		default: "🗨️",
		onChange: setting => game.writtingStatus.changeIndicator(setting)
	});

	game.settings.register(moduleName, "afkIconPosition", {
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

	game.settings.register(moduleName, "typingIconPosition", {
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

	let afkStatus = new AfkStatus();
	game.afkStatus = afkStatus;
	let writtingStatus = new WrittingStatus();
	game.writtingStatus = writtingStatus;
});
