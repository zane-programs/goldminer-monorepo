import { sendIpcMessage } from "./ipc";
import { nanoid } from "nanoid";

interface ApiRequestEvent {
  detail: {
    requestId: string;
    data?: any;
    error?: any;
  };
}

export function apiRequest(requestPath: string) {
  return new Promise((resolve, reject) => {
    const requestId = nanoid();
    sendIpcMessage({ channel: "apiRequest", arg: { requestId, requestPath } });

    // handles apiResponse event
    function handleEventListener(event: any) {
      const response = (event as ApiRequestEvent).detail;
      if (response.requestId === requestId) {
        // get rid of event listener
        window.removeEventListener("apiResponse", handleEventListener);
        // return response or reject with error
        response.error ? reject(response.error) : resolve(response.data);
      }
    }

    window.addEventListener("apiResponse", handleEventListener);
  });
}
