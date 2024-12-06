import React, { Component, createRef } from "react";
import {
  createZegoEngine,
  loginToRoom,
  createStream,
} from "@/app/helpers/zegoEngineManager";

import {
  processAudioData,
  initializeWebSocket,
} from "@/app/helpers/audioProcessor";
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
    };
    this.userID = "user-" + Math.floor(Math.random() * 10000);
    this.remoteVideoRef = createRef();
    this.audioContext = null;
    this.processor = null;
    this.updateSubtitle = this.updateSubtitle.bind(this);
  }

  async componentDidMount() {
    try {
      const { generateToken04 } = require("@/app/helpers/zegoServerAssistant");
      const appID = 280263608;
      const server = "1175c6e2e8bec41076e917a9a01a5627";
      const userID = "user-" + Math.floor(Math.random() * 10000);
      const roomID = "room-1";
      const userName = "ducanh";
      const effectiveTimeInSeconds = 3600;
      const payload = "";

      const token = await generateToken04(
        appID,
        userID,
        server,
        effectiveTimeInSeconds,
        payload
      );

      if (!token) {
        throw new Error("Failed to generate token");
      }

      const zg = createZegoEngine(appID, server, {
        logLevel: "disable",
        remoteLogLevel: "disable",
      });

      if (!zg) {
        throw new Error("Failed to create ZegoEngine instance");
      }

      this.setState({ zg }, async () => {
        try {
          zg.on("roomStreamUpdate", this.handleStreamUpdate);

          const loginResult = await loginToRoom(
            zg,
            roomID,
            token,
            userID,
            userName
          );
          if (!loginResult) {
            throw new Error("Failed to login to room");
          }

          const localStream = await createStream(zg);
          if (!localStream) {
            throw new Error("Failed to create local stream");
          }

          const localVideo = document.querySelector("#local-video");
          if (localVideo) {
            localVideo.srcObject = localStream;
            await zg.startPublishingStream(`video_${userID}`, localStream);
          }
        } catch (error) {
          console.error("Error in ZegoEngine setup:", error);
          alert("Failed to initialize video call. Please try again.");
        }
      });
    } catch (error) {
      console.error("Error in componentDidMount:", error);
      alert(
        "An error occurred while setting up the video call. Please try again."
      );
    }
  }

  updateSubtitle = (text, isFinal) => {
    if (isFinal) {
      this.setState((prevState) => {
        const finalSubtitle = text;

        const translatedWords = finalSubtitle
          .toLowerCase()
          .split(" ")
          .map((word) => {
            const cleanWord = word.replace(/[.,!?]$/, "");
            const punctuation = word.match(/[.,!?]$/)?.[0] || "";
            return (translations[cleanWord] || cleanWord) + punctuation;
          });

        return {
          subtitle: finalSubtitle,
          translatedSubtitle: translatedWords.join(" "),
          tempSubtitle: "",
        };
      });
    } else {
      this.setState({ tempSubtitle: text });
    }
  };

  handleStreamUpdate = async (roomID, updateType, streamList) => {
    if (
      updateType === "ADD" &&
      streamList.length > 0 &&
      this.remoteVideoRef.current
    ) {
      const remoteStreamInfo = streamList[streamList.length - 1];

      if (!remoteStreamInfo.streamID.includes(this.userID)) {
        const remoteStream = await this.state.zg.startPlayingStream(
          remoteStreamInfo.streamID
        );
        this.remoteVideoRef.current.srcObject = remoteStream;
        this.remoteVideoRef.current.muted = false;

        try {
          await initializeWebSocket(this.updateSubtitle);

          if (!this.audioContext) {
            this.audioContext = new (window.AudioContext ||
              window.webkitAudioContext)({
              sampleRate: 16000,
            });
          }

          const source =
            this.audioContext.createMediaStreamSource(remoteStream);

          if (!this.processor) {
            this.processor = this.audioContext.createScriptProcessor(
              4096,
              1,
              1
            );
            this.processor.onaudioprocess = async (event) => {
              try {
                await processAudioData(event.inputBuffer.getChannelData(0));
              } catch (error) {
                console.error("Error processing audio:", error);
              }
            };
          }

          source.connect(this.processor);
          this.processor.connect(this.audioContext.destination);
        } catch (error) {
          console.error("Error initializing WebSocket:", error);
        }
      }
    }
  };

  componentWillUnmount() {
    if (this.processor) {
      this.processor.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  render() {
    const { subtitle, tempSubtitle, translatedSubtitle } = this.state;
    const { isSubtitle, isSignLanguage } = this.props;

    return (
      <div className="flex-grow flex flex-col items-center justify-center relative">
        <div className="flex flex-row justify-center items-center w-full">
          <LocalVideoComponent />
          <div className="participant-videos flex flex-wrap justify-center mt-4">
            <RemoteVideoComponent ref={this.remoteVideoRef} />
          </div>
        </div>

        <div>
          <div
            id="translated-subtitle"
            className={`absolute text-yellow-400 text-xl bottom-[15%] left-1/2 -translate-x-1/2 max-w-[80%] text-center bg-black/50 p-2.5 rounded-md `}
          >
            {translatedSubtitle}
            {(translatedSubtitle === "" || translatedSubtitle === null) && (
              <span className="text-yellow-400">
                {this.props.selectedLanguage === "en" && "Translated Subtitle"}
                {this.props.selectedLanguage === "vi" && "Phụ đề dịch"}
                {this.props.selectedLanguage === "de" &&
                  "Untertitel übersetzen"}
                {this.props.selectedLanguage === "fr" && "Sous-titre traduit"}
                {this.props.selectedLanguage === "ja" && "翻訳字幕"}
                {this.props.selectedLanguage === "ko" && "번역된 자막"}
                {this.props.selectedLanguage === "zh" && "翻译字幕"}
              </span>
            )}
          </div>
          <div
            id="subtitle"
            className={`absolute text-white text-xl bottom-[10%] left-1/2 -translate-x-1/2 max-w-[80%] text-center bg-black/50 p-2.5 rounded-md mt-[8px] ${
              isSubtitle ? "block" : "hidden"
            }`}
          >
            {subtitle}
            <span className="text-gray-300">{tempSubtitle}</span>
          </div>
        </div>

        {isSignLanguage && (
          <img
            src="/quick_test.gif"
            alt="Speech-to-Text Indicator"
            className="absolute bottom-[2%] right-[8%] w-[150px] h-[150px]"
          />
        )}
      </div>
    );
  }
}

export default VideoArea;
