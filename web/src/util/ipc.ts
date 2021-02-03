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

export const quitApp = () => sendIpcMessage({ channel: "quitApp" });
export const refreshStatus = () =>
  sendIpcMessage({ channel: "miner", arg: { action: "refreshStatus" } });
