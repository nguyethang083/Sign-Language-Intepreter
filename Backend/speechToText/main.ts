import { AssemblyAI, RealtimeTranscript } from "assemblyai";
import { WebSocketServer, WebSocket } from "ws";

require("dotenv").config();

declare module "ws" {
  interface WebSocket {
    isAlive: boolean;
  }
}

const run = async () => {
  if (!process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY) {
    throw new Error("Missing ASSEMBLY_AI_API environment variable");
  }
  const client = new AssemblyAI({
    apiKey: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY,
  });
  const SAMPLE_RATE = 16_000;

  // Khởi tạo transcriber ở ngoài
  const transcriber = client.realtime.transcriber({
    sampleRate: SAMPLE_RATE,
  });

  let isAssemblyAIReady = false;
  const wss = new WebSocketServer({
    port: 8080,
    perMessageDeflate: false,
    maxPayload: 1024 * 1024,
    clientTracking: true,
    backlog: 100,
  });

  // Thêm heartbeat để duy trì kết nối
  function heartbeat(this: any) {
    this.isAlive = true;
  }

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

  transcriber.on("transcript.final", (data: RealtimeTranscript) => {
    console.log("Received transcript:", data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  transcriber.on("close", () => {
    console.log("AssemblyAI connection closed");
    isAssemblyAIReady = false;
  });

  // Thiết lập WebSocket server
  wss.on("connection", (ws) => {
    (ws as any).isAlive = true;
    ws.on("pong", heartbeat);

    console.log("Client connected");

    ws.on("message", async (message) => {
      if (!isAssemblyAIReady) {
        console.log("Waiting for AssemblyAI connection...");
        try {
          // Thử kết nối lại nếu chưa sẵn sàng
          await transcriber.connect();
          console.log("Attempted to reconnect to AssemblyAI");
        } catch (error) {
          console.error("Failed to connect to AssemblyAI:", error);
          return;
        }
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

  // Kiểm tra kết nối định kỳ
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if ((ws as any).isAlive === false) {
        return ws.terminate();
      }
      (ws as any).isAlive = false;
      ws.ping();
    });
  }, 30000);
};

run().catch((error) => {
  console.error("Error running the application:", error);
});
