// const State = require("../util/State");

module.exports = class WindowHandler {
  constructor(window) {
    this._window = window;

    this._window.on("maximize", this._sendStatusUpdate.bind(this));
    this._window.on("unmaximize", this._sendStatusUpdate.bind(this));
    this._window.on("focus", this._sendStatusUpdate.bind(this));
    this._window.on("blur", this._sendStatusUpdate.bind(this));
    // TODO: check performance impact
    this._window.on("resize", this._sendStatusUpdate.bind(this));

    // this._isMaximized = new State(false);

    // send window state on change
    // this._isMaximized.addChangeListener(this._sendStatusUpdate.bind(this));

    // this._window.on("maximize", () => this._isMaximized.setState(true));
    // this._window.on("unmaximize", () => this._isMaximized.setState(false));
  }

  handleEvent(event, arg) {
    switch (arg.action) {
      case "close":
        this._window.close();
        break;
      case "minimize":
        this._window.minimize();
        break;
      case "toggleMaximize":
        this._window.isMaximized()
          ? this._window.unmaximize()
          : this._window.maximize();
        break;
      case "refreshStatus":
        event.reply("windowControlStatusUpdate", this.getStatus());
        break;
      default:
        console.log("No valid action provided");
    }
  }

  getStatus() {
    return {
      isMaximized: this._window.isMaximized(),
      isFocused: this._window.isFocused(),
    };
  }

  _sendStatusUpdate() {
    this._window.webContents.send(
      "windowControlStatusUpdate",
      this.getStatus()
    );
  }
};
