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

class VideoArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zg: null,
      subtitle: "",
      tempSubtitle: "",
    };
    this.remoteVideoRef = createRef();
    this.audioContext = null;
    this.processor = null;
    this.updateSubtitle = this.updateSubtitle.bind(this);
  }

  async componentDidMount() {
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

    const zg = createZegoEngine(appID, server, {
      logLevel: "disable",
      remoteLogLevel: "disable",
    });
    this.setState({ zg }, async () => {
      zg.on("roomStreamUpdate", this.handleStreamUpdate);
      await loginToRoom(zg, roomID, token, userID, userName);
      const localStream = await createStream(zg);
      document.querySelector("#local-video").srcObject = localStream;
      zg.startPublishingStream(`video_${userID}`, localStream);
    });
  }

  updateSubtitle = (text, isFinal) => {
    if (isFinal) {
      this.setState((prevState) => {
        const newSubtitle = prevState.subtitle + " " + text;
        const sentences = newSubtitle.split(". ");
        return {
          subtitle:
            sentences.length > 2 ? sentences.slice(-2).join(". ") : newSubtitle,
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
      const remoteStream = await this.state.zg.startPlayingStream(
        streamList[0].streamID
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

        const source = this.audioContext.createMediaStreamSource(remoteStream);

        if (!this.processor) {
          this.processor = this.audioContext.createScriptProcessor(16384, 1, 1);
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
    const { subtitle, tempSubtitle } = this.state;
    return (
      <div className="flex-grow flex items-center justify-between">
        <LocalVideoComponent />
        <div className="participant-videos flex flex-wrap justify-center mt-4">
          <RemoteVideoComponent ref={this.remoteVideoRef} />
        </div>
        <div
          id="subtitle"
          style={{
            position: "absolute",
            color: "white",
            fontSize: 20,
            bottom: 80,
            left: 200,
            maxWidth: "60%",
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {subtitle}
          <span style={{ color: "#cccccc" }}>{tempSubtitle}</span>
        </div>
      </div>
    );
  }
}

export default VideoArea;
