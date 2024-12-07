import React, { Component, createRef } from "react";
import {
  createZegoEngine,
  loginToRoom,
  createStream,
} from "@/app/helpers/zegoEngineManager";
import { convertToBlob } from "@/../../Backend/speechToText-v2/js/index";
import LocalVideoComponent from "@/app/component/videocall/LocalVideoComponent";
import RemoteVideoComponent from "@/app/component/videocall/RemoteVideoComponent";
import translations from "@/../public/translate/en-vi.json";

class VideoArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zg: null,
      subtitle: "",
      tempSubtitle: "",
      translatedSubtitle: "",
      socket: null,
      remoteStream: null,
    };
    this.USER_ID = "user-" + Math.floor(Math.random() * 10000);
    this.ROOM_ID = "room-1";
    this.APP_ID = 280263608;
    this.SERVER = "1175c6e2e8bec41076e917a9a01a5627";

    this.remoteVideoRef = createRef();
    this.audioContext = null;
    this.processor = null;
  }

  async componentDidMount() {
    try {
      const { generateToken04 } = require("@/app/helpers/zegoServerAssistant");
      const userID = this.USER_ID;
      const roomID = this.ROOM_ID;
      const userName = "ducanh";

      const token = await generateToken04(
        this.APP_ID,
        userID,
        this.SERVER,
        3600,
        ""
      );
      if (!token) throw new Error("Failed to generate token");

      const zg = createZegoEngine(this.APP_ID, this.SERVER, {
        logLevel: "disable",
        remoteLogLevel: "disable",
      });
      if (!zg) throw new Error("Failed to create ZegoEngine instance");

      this.setState({ zg }, async () => {
        zg.on("roomStreamUpdate", this.handleStreamUpdate);
        await loginToRoom(zg, this.ROOM_ID, token, this.USER_ID, "ducanh");
        const localStream = await createStream(zg);
        const localVideo = document.querySelector("#local-video");
        if (localVideo) {
          localVideo.srcObject = localStream;
          await zg.startPublishingStream(`video_${this.USER_ID}`, localStream);
        }
      });
    } catch (error) {
      console.error("Error in componentDidMount:", error);
    }
  }

  async initializeWebSocket() {
    try {
      const url =
        process.env.NODE_ENV === "development"
          ? "http://localhost:8000/"
          : "https://broken-smoke-9608.fly.dev/";

      const { token } = await fetch(url).then((res) => res.json());

      const socket = new WebSocket(
        `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`
      );

      socket.onmessage = (message) => {
        const res = JSON.parse(message.data);
        const text = res.text || "";
        const isFinal = res.message_type === "FinalTranscript";

        if (isFinal) {
          const translatedWords = text
            .toLowerCase()
            .split(" ")
            .map((word) => {
              const cleanWord = word.replace(/[.,!?]$/, "");
              const punctuation = word.match(/[.,!?]$/)?.[0] || "";
              return (translations[cleanWord] || cleanWord) + punctuation;
            });

          this.setState({
            subtitle: text,
            translatedSubtitle: translatedWords.join(" "),
            tempSubtitle: "",
          });
        } else {
          this.setState({ tempSubtitle: text });
        }
      };

      socket.onerror = () => socket.close();
      socket.onclose = () => this.setState({ socket: null });
      this.setState({ socket });
    } catch (error) {
      console.error("Error initializing WebSocket:", error);
    }
  }

  handleStreamUpdate = async (roomID, updateType, streamList) => {
    if (
      updateType !== "ADD" ||
      !streamList.length ||
      !this.remoteVideoRef.current
    )
      return;

    const remoteStreamInfo = streamList[streamList.length - 1];
    if (remoteStreamInfo.streamID.includes(this.USER_ID)) return;

    try {
      const remoteStream = await this.state.zg.startPlayingStream(
        remoteStreamInfo.streamID
      );
      this.remoteVideoRef.current.srcObject = remoteStream;
      this.setState({ remoteStream });

      await this.initializeWebSocket();
      await this.setupAudioProcessing(remoteStream);
    } catch (error) {
      console.error("Error in handleStreamUpdate:", error);
    }
  };

  setupAudioProcessing = async (remoteStream) => {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 16000,
    });
    const source = this.audioContext.createMediaStreamSource(remoteStream);
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

    source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);

    this.processor.onaudioprocess = (e) => {
      if (this.state.socket?.readyState !== WebSocket.OPEN) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64data = reader.result.split("base64,")[1];
        this.state.socket.send(JSON.stringify({ audio_data: base64data }));
      };
      reader.readAsDataURL(convertToBlob(e.inputBuffer.getChannelData(0)));
    };
  };

  componentWillUnmount() {
    this.state.socket?.close();
    this.processor?.disconnect();
    this.audioContext?.close();
  }

  render() {
    const { subtitle, tempSubtitle, translatedSubtitle } = this.state;
    const { isSubtitle, isSignLanguage, selectedLanguage } = this.props;

    return (
      <>
        <div className="flex-grow flex flex-col items-center justify-center relative p-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-center items-center w-full max-w-[1400px]">
            <LocalVideoComponent />
            <RemoteVideoComponent ref={this.remoteVideoRef} />
          </div>

          {isSignLanguage !== "default" && isSignLanguage && (
            <img
              src={`/quick_test.gif`}
              alt="Sign language"
              className="absolute bottom-0 right-[8%] w-[150px] h-[150px]"
            />
          )}
        </div>
        <div>
          <div
            id="translated-subtitle"
            className={`absolute text-yellow-400 text-lg bottom-[20%] left-1/2 -translate-x-1/2 max-w-[80%] text-center bg-black/50 p-2.5 rounded-md ${
              selectedLanguage === "off" ? "hidden" : "block"
            }`}
          >
            {translatedSubtitle || translations[`subtitle_${selectedLanguage}`]}
          </div>
          <div
            id="subtitle"
            className={`absolute text-white text-lg bottom-[12%] left-1/2 -translate-x-1/2 max-w-[80%] text-center bg-black/50 p-2.5 rounded-md mt-[8px] ${
              isSubtitle ? "block" : "hidden"
            }`}
          >
            {subtitle}
            <span className="text-gray-300">{tempSubtitle}</span>
          </div>
        </div>
      </>
    );
  }
}

export default VideoArea;
