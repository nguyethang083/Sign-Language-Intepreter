import React from "react";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
const appID = 280263608;
const server = "1175c6e2e8bec41076e917a9a01a5627";
const token =
  "04AAAAAGdBaJkAEHVobzRmdjhpYTFjOHRhb3IAoBxK3naPp+BHWAyNtSifh0FSQD1BfB3fu3HTvW6zIYkHPoQkIpZxFfmhIXaqj+IBo0vW/r4oNNBqF5i5OMEGTZXcOL1gr8SbY/D5EWhF03n2bvQEMOn8Q7iYXwzmF88XA0zoLbxkShOGGNjgDP56YsbLd7R6JUqqEM3VI4tE6hhVzvRYozF231nE9y8MvlUQ1TJ1CiRAucfZbl37irI9M/0=";

// Initialize the [ZegoExpressEngine] instance.
class CommonUsageReact extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      zg: null,
    };
  }
  createZegoExpressEngineOption() {
    const zg = new ZegoExpressEngine(appID, server);
    this.setState(
      {
        zg: zg,
      },
      () => {
        // Listen for the event callbacks.
        console.log("listening...");
      }
    );
    const handleLogin = async (
      roomID: string,
      userID: string,
      userName: string
    ) => {
      const result = await this.state.zg.loginRoom(
        roomID,
        token,
        { userID, userName },
        { userUpdate: true }
      );
    };
  }
}
