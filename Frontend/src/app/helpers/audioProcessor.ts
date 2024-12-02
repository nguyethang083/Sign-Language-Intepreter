let websocket: WebSocket | null = null;

export const initializeWebSocket = (
  onTranscript: (text: string, isFinal: boolean) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      resolve();
      return;
    }

    websocket = new WebSocket("ws://localhost:8080");

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onTranscript(data.text, data.isFinal);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    const connectionTimeout = setTimeout(() => {
      websocket?.close();
      reject(new Error("WebSocket connection timeout"));
    }, 10000);

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
): Promise<void> => {
  if (!audioData || !websocket || websocket.readyState !== WebSocket.OPEN) {
    throw new Error("WebSocket not ready or no audio data");
  }

  // Chuyển đổi Float32Array sang Int16Array (PCM 16-bit)
  const pcmData = new Int16Array(audioData.length);
  for (let i = 0; i < audioData.length; i++) {
    const s = Math.max(-1, Math.min(1, audioData[i]));
    pcmData[i] = s < 0 ? s * 32768 : s * 32767;
  }

  websocket.send(pcmData.buffer);
};
