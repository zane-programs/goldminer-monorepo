const { spawn } = require("child_process");
const waitOn = require("wait-on");
const nodeCleanup = require("node-cleanup");

const MinerStateEnum = require("../enums/MinerStateEnum");
const { createCommandLineArgs } = require("../util/misc");

// get command-line args
const argvRaw = require("minimist")(process.argv.slice(2));

const xmrigArgs = Object.assign({}, argvRaw);
delete xmrigArgs["miner-executable-path"];

let minerProcess = null;

// handle process exit
nodeCleanup((_exitCode, _signal) => {
  if (minerProcess !== null && minerProcess.kill) {
    minerProcess.stdout.pause();
    minerProcess.kill();
  }
});

(async () => {
  minerProcess = spawn(argvRaw["miner-executable-path"], [
    ...createCommandLineArgs(xmrigArgs),
  ]);

  writeEnum(MinerStateEnum.Starting);

  minerProcess.on("exit", (code) => {
    writeEnum(MinerStateEnum.Inactive);
    process.exit(code);
  });

  // wait for XMRig API to be available, meaning
  // that the mining process has started
  await waitOn({ resources: [`tcp:${argvRaw["http-port"]}`] });

  writeEnum(MinerStateEnum.MinerStarted);
})();

function writeEnum(en) {
  process.stdout.write(en.toString());
}
