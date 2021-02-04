try {
  window.ipcApi.receive("minerStatusUpdate", (data) => {
    // console.log(`Received ${JSON.stringify(data)} from main process`);
    window.dispatchEvent(
      new CustomEvent("minerStatusUpdate", { detail: data })
    );
  });
  window.ipcApi.receive("apiResponse", (data) => {
    window.dispatchEvent(
      new CustomEvent("apiResponse", { detail: data })
    );
  });
  window.ipcApi.receive("windowControlStatusUpdate", (data) => {
    window.dispatchEvent(
      new CustomEvent("windowControlStatusUpdate", { detail: data })
    );
  });
  window.addEventListener("sendIpcMessage", (e) => {
    window.ipcApi.send(e.detail.channel, e.detail.arg || []);
  });
} catch (e) {
  // if there's an error, we're NOT in the Electron environment,
  // so we will start showing fake data FOR TESTING PURPOSES.

  // make it clear that this is a dev mode
  alert("YOU ARE IN A DEV MODE (sort of)");

  // forward all ipc message requests to console
  window.addEventListener("sendIpcMessage", (e) => {
    console.log(e.detail);
  });

  // send first benchmarking notification
  window.dispatchEvent(
    new CustomEvent("minerStatusUpdate", {
      detail: {
        minerProcessRunning: true,
        minerState: 2,
        minerStatistics: null,
      },
    })
  );

  // start faux polling interval, supplying random data
  setInterval(
    () =>
      window.dispatchEvent(
        new CustomEvent("minerStatusUpdate", {
          detail: {
            minerProcessRunning: true,
            minerState: 3,
            minerStatistics: {
              algo: "rx/zane", // fake algo name heh
              hashrate: {
                highest: 10000,
                total: [Math.random() * 3000 + 7000, null, null],
              },
            },
          },
        })
      ),
    5000
  );
}
