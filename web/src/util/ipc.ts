export interface MessageInfo {
  channel: string;
  arg?: any; // TODO: change to specific type (maybe)
}

export function sendIpcMessage(messageInfo: MessageInfo) {
  window.dispatchEvent(
    new CustomEvent("sendIpcMessage", {
      detail: messageInfo,
    })
  );
}

// refresh status of app, including miner and window control
export const refreshStatus = () => {
  // refresh miner
  sendIpcMessage({ channel: "miner", arg: { action: "refreshStatus" } });
  // refresh window controls status
  sendIpcMessage({
    channel: "windowControl",
    arg: { action: "refreshStatus" },
  });
};
