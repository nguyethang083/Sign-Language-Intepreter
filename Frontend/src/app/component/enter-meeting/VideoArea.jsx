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
    this.state = { zg: null };
    this.remoteVideoRef = createRef();
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

  handleStreamUpdate = async (roomID, updateType, streamList) => {
    if (updateType === "ADD" && streamList.length > 0) {
      const remoteStream = await this.state.zg.startPlayingStream(
        streamList[0].streamID
      );
      if (this.remoteVideoRef.current) {
        this.remoteVideoRef.current.srcObject = remoteStream;
        this.remoteVideoRef.current.muted = false;

        try {
          await initializeWebSocket();

          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)({
            sampleRate: 16000,
          });

          const BUFFER_SIZE = 8192;

          const source = audioContext.createMediaStreamSource(remoteStream);
          const processor = audioContext.createScriptProcessor(
            BUFFER_SIZE,
            1,
            1
          );

          let lastProcessingTime = 0;
          const PROCESS_INTERVAL = 100;

          processor.onaudioprocess = async (event) => {
            const currentTime = Date.now();
            if (currentTime - lastProcessingTime < PROCESS_INTERVAL) {
              return;
            }

            try {
              const text = await processAudioData(
                event.inputBuffer.getChannelData(0)
              );
              if (text) {
                const subtitleElement = document.querySelector("#subtitle");
                if (subtitleElement) {
                  subtitleElement.textContent = text;
                }
              }
            } catch (error) {
              console.error("Error processing audio:", error);
            }

            lastProcessingTime = currentTime;
          };

          source.connect(processor);
          processor.connect(audioContext.destination);
        } catch (error) {
          console.error("Error initializing WebSocket:", error);
        }
      }
    }
  };

  render() {
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
            left: 400,
          }}
        >
          This is a subtitle text
        </div>
      </div>
    );
  }
}

export default VideoArea;
