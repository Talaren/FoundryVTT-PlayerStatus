export default class WrittingStatus {

	constructor() {
		this.moduleName = "playerStatus";
		this.keyName = "typping";
		this.keytimer = undefined;
		let position = this.parsePositionConfig(game.settings.get(this.moduleName, "typingIconPosition"));
		let options = {
			resetFlags: true,
			override: false,
			position: position
		}
		let typingIcon = game.settings.get(this.moduleName, "typingIcon");
		let success = game.playerListStatus.registerKey(this.keyName, typingIcon, options);
		if (success) {
			Hooks.on("chatMessage", (_chatlog, _messageText, _chatData) => {
				this.stop();
			});
			let chat = document.getElementById('chat-message');
			chat.addEventListener("keydown", function() {
				game.writtingStatus.typing();
			});
		}
	}

	typing() {
		if (typeof this.keytimer !== 'undefined') {
			clearTimeout(this.keytimer);
		} else {
			game.playerListStatus.on(this.keyName);
		}
		this.keytimer = setTimeout(() => {
			game.writtingStatus.stop();
		}, (game.settings.get("playerStatus", "timeOutSec") * 1000));
	}

	stop() {
		if (typeof this.keytimer !== "undefined") {
			clearTimeout(this.keytimer);
		}
		game.playerListStatus.off(this.keyName);
		this.keytimer = undefined;
	}

	changePosition(setting) {
		game.playerListStatus.changePosition(this.keyName, this.parsePositionConfig(setting))
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
