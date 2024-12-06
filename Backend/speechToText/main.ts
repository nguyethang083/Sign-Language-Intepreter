import { AssemblyAI, RealtimeTranscript } from "assemblyai";
import { WebSocketServer } from "ws";

require("dotenv").config();

const run = async () => {
  if (!process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY) {
    throw new Error("Missing ASSEMBLY_AI_API environment variable");
  }
  const client = new AssemblyAI({
    apiKey: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY,
  });
  const SAMPLE_RATE = 16_000;
  const BUFFER_SIZE = 4096;

  // Khởi tạo transcriber ở ngoài
  const transcriber = client.realtime.transcriber({
    sampleRate: SAMPLE_RATE,
  });

  let isAssemblyAIReady = false;
  const wss = new WebSocketServer({
    port: 8080,
    perMessageDeflate: false,
    maxPayload: 1024 * 1024,
  });

  // Thiết lập các listeners cho transcriber
  transcriber.on("open", ({ sessionId }) => {
    console.log(`AssemblyAI Session opened with ID: ${sessionId}`);
    isAssemblyAIReady = true;
    console.log("isAssemblyAIReady set to:", isAssemblyAIReady);
  });

  transcriber.on("error", (error: Error) => {
    console.error("AssemblyAI Error:", error);
    isAssemblyAIReady = false;
  });

  transcriber.on("transcript", (data: RealtimeTranscript) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            text: data.text,
            isFinal: false,
          })
        );
      }
    });
  });

  transcriber.on("transcript.final", (data: RealtimeTranscript) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            text: data.text,
            isFinal: true,
          })
        );
      }
    });
  });

  // Handle reconnection logic
  transcriber.on("close", async () => {
    console.log("AssemblyAI connection closed");
    isAssemblyAIReady = false;
    try {
      await transcriber.connect();
      console.log("Reconnected to AssemblyAI");
      isAssemblyAIReady = true;
    } catch (error) {
      console.error("Failed to reconnect to AssemblyAI:", error);
    }
  });

  // Thiết lập WebSocket server
  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", async (message) => {
      if (!isAssemblyAIReady) {
        console.log("Waiting for AssemblyAI connection...");
        return;
      }

      try {
        const arrayBuffer: ArrayBuffer =
          message instanceof Buffer
            ? message.buffer.slice(
                message.byteOffset,
                message.byteOffset + message.byteLength
              )
            : (message as ArrayBuffer);

        const float16Array = new Int16Array(arrayBuffer);
        await transcriber.sendAudio(float16Array.buffer);
      } catch (error) {
        console.error("Error sending audio:", error);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  console.log("WebSocket server is running on ws://localhost:8080");

  // Kết nối ban đầu
  try {
    await transcriber.connect();
    console.log("Initially connected to AssemblyAI");
  } catch (error) {
    console.error("Initial connection to AssemblyAI failed:", error);
  }
};

run().catch((error) => {
  console.error("Error running the application:", error);
});
