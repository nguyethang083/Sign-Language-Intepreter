let websocket: WebSocket | null = null;
let messageHandler: ((event: MessageEvent) => void) | null = null;

export const initializeWebSocket = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      resolve();
      return;
    }

    websocket = new WebSocket("ws://localhost:8080");

    if (websocket.bufferedAmount === undefined) {
      websocket.binaryType = "arraybuffer";
    }

    const connectionTimeout = setTimeout(() => {
      websocket?.close();
      reject(new Error("WebSocket connection timeout"));
    }, 5000);

    websocket.onopen = () => {
      clearTimeout(connectionTimeout);
      console.log("WebSocket connection established");
      resolve();
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed");
      websocket = null;
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      websocket = null;
    };
  });
};

export const processAudioData = async (
  audioData: Float32Array
): Promise<string | null> => {
  if (!websocket || websocket.readyState !== WebSocket.OPEN) {
    await initializeWebSocket();
  }

  const pcmData = new Int16Array(audioData.length);
  const scale = 32767;
  for (let i = 0; i < audioData.length; i++) {
    pcmData[i] = Math.max(-scale, Math.min(scale, audioData[i] * scale));
  }

  return new Promise((resolve, reject) => {
    if (!websocket) {
      reject(new Error("WebSocket not initialized"));
      return;
    }

    if (messageHandler) {
      websocket.removeEventListener("message", messageHandler);
    }

    messageHandler = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        resolve(data.text);
      } catch (error) {
        console.error("Error processing message:", error);
        reject(error);
      }
    };

    websocket.addEventListener("message", messageHandler);
    websocket.send(pcmData.buffer);
  });
};
