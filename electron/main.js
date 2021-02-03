const path = require("path");

const { BrowserWindow, app, ipcMain, dialog, shell } = require("electron");
const isDev = require("electron-is-dev");

// constants
const MIN_WINDOW_WIDTH = 1000;
const MIN_WINDOW_HEIGHT = 750;

// initialize react devtools in dev mode
let installExtension, REACT_DEVELOPER_TOOLS;
if (isDev) {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

// inter-process communication handlers
const MinerHandler = require("./ipcHandlers/MinerHandler");
const WindowHandler = require("./ipcHandlers/WindowHandler");

console.log(path.join(__dirname, "./bin/xmrig"));

const minerHandler = new MinerHandler({
  minerPath: path.join(__dirname, "./bin/xmrig"),
  minerApi: "https://api.moneroocean.stream",
  args: {
    keepalive: true,
    "http-enabled": true,
    // "http-port": XMRIG_API_PORT,
    url: "gulf.moneroocean.stream:10128",
    user:
      "42QBGXwRobKAU1HBci6vxHEJVkZD4nTUnF4546F9qfHC96uvRthrc7XfFWvc2zudN14XADXy9UZbfVvK3fzvaV22GbxY1Rk",
    pass: "GoldMiner0",
  },
});

async function createWindow() {
  // init window
  const win = new BrowserWindow({
    width: MIN_WINDOW_WIDTH,
    height: MIN_WINDOW_HEIGHT,
    minWidth: MIN_WINDOW_WIDTH,
    minHeight: MIN_WINDOW_HEIGHT,
    frame: false,
    webPreferences: {
      webviewTag: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // load either hot-reload React URL or built
  // HTML depending on whether or not we're in
  // development mode
  win.loadURL(
    isDev ? "http://localhost:3000" : "https://goldminer-app.vercel.app"
    // : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // set miner handler's window context
  // to the current BrowserWindow
  minerHandler.setWindow(win);

  // handle window control events
  const windowHandler = new WindowHandler(win);
  ipcMain.on("windowControl", windowHandler.handleEvent.bind(windowHandler));

  win.on("close", function (e) {
    if (minerHandler.getStatus().minerProcessRunning) {
      // only prompt if miner process is running
      const choice = dialog.showMessageBoxSync(this, {
        type: "question",
        buttons: ["Exit", "Cancel"],
        title: "Exit Goldminer?",
        message: "Are you sure you want to exit? The miner is still running.",
      });
      if (choice == 1) e.preventDefault();
    }
  });

  // open new-tab/new-window links in the browser
  win.webContents.on("new-window", (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });

  // open dev tools (detached) if in development mode
  if (isDev) win.webContents.openDevTools({ mode: "detach" });
}

// create window once Electron is ready
app.whenReady().then(() => {
  createWindow();

  // install React devtools
  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension: ${name}`))
      .catch((error) => console.log(`An error occurred: ${error}`));
  }
});

// HANDLE IPC MESSAGING
ipcMain.on("miner", minerHandler.handleMinerEvent.bind(minerHandler));
ipcMain.on("apiRequest", minerHandler.handleApiRequest.bind(minerHandler));

// stop miner on quit
app.on("before-quit", minerHandler.stop.bind(minerHandler));

app.on("window-all-closed", () => {
  // exits on window close except on Mac because
  // Macs often leave the app open even if there
  // is no window
  minerHandler.setWindow(null);
  // if (process.platform !== "darwin") app.quit();
  app.quit();
});

app.on("activate", () => {
  // re-create window if activated from Mac dock
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.commandLine.appendSwitch("ignore-certificate-errors", true);
