import { AssemblyAI } from "assemblyai";

// Hàm nhận Float16Array và trả về text transcript
export const convertAudioToText = async (audioData) => {
  require("dotenv").config();
  if (!process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY) {
    throw new Error("Missing ASSEMBLY_AI_API environment variable");
  }

  const client = new AssemblyAI({
    apiKey: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY,
  });

  const SAMPLE_RATE = 16000;

  // Tạo transcriber để xử lý transcript thời gian thực
  const transcriber = client.realtime.transcriber({
    sampleRate: SAMPLE_RATE,
  });

  return new Promise(async (resolve, reject) => {
    let finalTranscript = "";

    // Lắng nghe sự kiện transcript
    transcriber.on("transcript", (transcript) => {
      if (transcript.message_type === "FinalTranscript" && transcript.text) {
        finalTranscript += transcript.text + " ";
      }
    });

    transcriber.on("error", (error) => {
      console.error("Error:", error);
      reject(error);
    });

    transcriber.on("close", () => {
      resolve(finalTranscript.trim());
    });

    try {
      console.log("Connecting to AssemblyAI real-time transcript service");
      await transcriber.connect();

      console.log("Sending audio data");
      // Chuyển đổi Float16Array thành Buffer để gửi qua stream
      const audioBuffer = Buffer.from(audioData.buffer);
      transcriber.stream().write(audioBuffer);

      // Kết thúc stream sau khi gửi xong dữ liệu
      transcriber.stream().end();
    } catch (error) {
      console.error("Failed to process audio:", error);
      reject(error);
    }
  });
};
