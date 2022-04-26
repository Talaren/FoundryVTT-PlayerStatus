export default class WrittingStatus {

    constructor() {
        this.keytimer = undefined;
    }

    typing(name) {
        if (typeof this.keytimer !== 'undefined') {
            clearTimeout(this.keytimer);
        } else {
            PlayerListStatus.addStatusAfterPlayername(name, "typping", "<span class='afk'>(T)</span>");
        }
        debugger;
        this.keytimer = setTimeout(function () {
            this.remove(name);
        }, 10000);
    }

    stop(name) {
        clearTimeout(this.keytimer);
        this.remove(name);
    }

    remove(name) {
        PlayerListStatus.removeStatusAfterPlayername(name, "typping");
        this.keytimer = undefined;
    }
}
