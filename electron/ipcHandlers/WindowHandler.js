const State = require("../util/State");

module.exports = class WindowHandler {
  constructor(window) {
    this._window = window;

    this._isMaximized = new State(false);

    // send window state on change
    this._isMaximized.addChangeListener((isMaximized) =>
      this._window.webContents.send("windowControlStatusUpdate", { isMaximized })
    );

    this._window.on("maximize", () => this._isMaximized.setState(true));
    this._window.on("unmaximize", () => this._isMaximized.setState(false));
  }

  handleEvent(_event, arg) {
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
      default:
        console.log("No valid action provided");
    }
  }
};
