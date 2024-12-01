// components/RemoteVideoComponent.js
import React from "react";

const RemoteVideoComponent = React.forwardRef((props, ref) => (
  <div
    className="participant-video"
    style={{
      width: "300px",
      height: "200px",
      margin: "10px",
      backgroundColor: "#000",
      borderRadius: "8px",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <video id="remote-video" ref={ref} autoPlay playsInline></video>
  </div>
));

export default RemoteVideoComponent;
