export default class AfkStatus {

	constructor() {
		this.moduleName = "playerStatus";
		this.keyName = "afk";
		let success = this.registerKey();
		if (success) {
			this.isAfk = game.playerListStatus.status(this.keyName);
			Hooks.on("chatMessage", (_chatlog, messageText, _chatData) => {
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
			});
		}
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
			if (game.settings.get(this.moduleName, "showAfkIndicator")) {
				game.playerListStatus.off(this.keyName);
			}
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
			if (game.settings.get(this.moduleName, "showAfkIndicator")) {
				game.playerListStatus.on(this.keyName);
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
			this.registerKey();
		} else {
			game.playerListStatus.removeKey(this.keyName)
		}
	}

	changeIndicator(setting) {
		game.playerListStatus.changeValue(this.keyName, setting)
	}

	changePosition(setting) {
		game.playerListStatus.changePosition(this.keyName, this.parsePositionConfig(setting))
	}

	registerKey() {
		let position = this.parsePositionConfig(game.settings.get(this.moduleName, "afkIconPosition"));
		let options = {
			resetFlags: false,
			override: false,
			position: position
		}
		return game.playerListStatus.registerKey(this.keyName, "💤", options);
	}

	parsePositionConfig(setting) {
		switch (setting) {
			case "1":
				return game.playerListStatus.positions.beforeOnlineStatus;
			case "2":
				return game.playerListStatus.positions.beforePlayername;
			case "3":
				return game.playerListStatus.positions.afterPlayername;
		}
	}
}
