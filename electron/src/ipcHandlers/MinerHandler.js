const path = require("path");
const { spawn } = require("child_process");
// const waitOn = require("wait-on");
// electron fetch:
const fetch = require("electron-fetch").default;

const MinerStateEnum = require("../enums/MinerStateEnum");
const NetworkUtil = require("../util/NetworkUtil");
const State = require("../util/State");
const { createCommandLineArgs, isNumericString } = require("../util/misc");

module.exports = class MinerHandler {
  constructor(config) {
    this._window = config.window || null; // holds a BrowserWindow object
    this._config = config; // miner config
    this._minerProcess = null; // miner spawn process (starts null)
    this._minerState = new State(MinerStateEnum.Inactive); // holds miner state enum
    this._minerStatistics = new State(null); // holds stats from API
    this._apiPort = -1; // will hold API port
    this._hasStartedPollingStatistics = false; // whether or not stats polling has started
    this._pollingInterval = -1; // holds polling setInterval

    // listen for changes to miner state and staatistics and handle accordingly
    this._minerState.addChangeListener(this._handleStateUpdate.bind(this));
    this._minerStatistics.addChangeListener(this._handleStateUpdate.bind(this));
  }

  setWindow(window) {
    this._window = window;
  }

  async start() {
    try {
      if (this._minerProcess === null) {
        this._apiPort = await NetworkUtil.getFreePort();
        console.log("Port for XMRig:", this._apiPort);

        this._minerProcess = spawn("node", [
          path.join(__dirname, "../scripts/startMiner.js"), // miner script path
          ...createCommandLineArgs(this._config.args), // XMRig miner atgs
          `--http-port=${this._apiPort}`, // for setting API port
          `--miner-executable-path=${this._config.minerPath}`, // pass along path to executable
        ]);

        this._sendStatusUpdate();
        this._minerState.setState(MinerStateEnum.Starting);

        this._minerProcess.stdout.on("data", (data) => {
          // process.stdout.write(data.toString());
          const dataStr = data.toString().trim();
          console.log(`New stdout from miner process: ${dataStr}`);

          if (isNumericString(dataStr))
            this._minerState.setState(parseInt(dataStr));
        });

        this._minerProcess.stderr.on("data", (data) => {
          process.stdout.write(data.toString());
        });

        this._minerProcess.on("exit", (_code) => {
          this._minerState.setState(MinerStateEnum.Inactive);
          // this._sendStatusUpdate(); // send status update just in case
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  stop() {
    if (this._minerProcess) {
      this._minerProcess.stdout.pause();
      this._minerProcess.kill();
      setTimeout(() => {
        this._minerProcess = null;
        this._resetMinerStatistics();
        this._minerState.setState(MinerStateEnum.Inactive);
      }, 100);
    }
  }

  getStatus() {
    // console.log(this._minerProcess, this._minerProcess?.killed);
    return {
      minerApi: this._config.minerApi,
      minerProcessRunning: this._minerProcess !== null,
      minerState: this._minerState.currentState,
      minerStatistics: this._minerStatistics.currentState,
      walletAddress: this._config.args.user,
    };
  }

  _refreshStatus(event) {
    const status = this.getStatus();
    event.reply("minerStatusUpdate", status);
  }

  _sendStatusUpdate() {
    const status = this.getStatus();
    try {
      this._window.webContents.send("minerStatusUpdate", status);
    } catch (e) {
      console.error(e);
    }
  }

  _handleStateUpdate() {
    if (
      this._minerState.currentState === MinerStateEnum.MinerStarted &&
      this._minerStatistics.currentState === null &&
      !this._hasStartedPollingStatistics
    ) {
      this._startPollingStatisticsInterval();
    }
    this._sendStatusUpdate();
  }

  _startPollingStatisticsInterval() {
    if (!this._hasStartedPollingStatistics) {
      this._pollingInterval = setInterval(
        this._pollMinerStatistics.bind(this),
        5000
      );
      this._hasStartedPollingStatistics = true;
    }
  }

  async _pollMinerStatistics() {
    const req = await fetch(`http://127.0.0.1:${this._apiPort}/2/summary`);
    const json = await req.json();
    this._minerStatistics.setState(json);
  }

  _resetMinerStatistics() {
    this._minerStatistics.setState(null);
    this._apiPort = -1;
    this._hasStartedPollingStatistics = false;
    clearInterval(this._pollingInterval); // stop polling
    this._pollingInterval = -1;
  }

  handleMinerEvent(event, arg) {
    console.log("Action received: " + arg.action);
    switch (arg.action) {
      case "start":
        this.start();
        break;
      case "stop":
        this.stop();
        break;
      case "refreshStatus":
        this._refreshStatus(event);
        break;
      default:
        console.log("No valid event");
    }
  }

  async handleApiRequest(event, arg) {
    let data, error;
    try {
      const req = await fetch(this._config.minerApi + arg.requestPath);
      data = await req.json();
    } catch (e) {
      error = e;
      console.error(e);
    }
    event.reply("apiResponse", {
      data,
      error,
      requestId: arg.requestId,
    });
  }
};
