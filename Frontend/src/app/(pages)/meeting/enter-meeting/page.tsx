"use client";

import React, { useState } from "react";
import ToolBar from "@/app/component/enter-meeting/ToolBar";
import VideoArea from "@/app/component/enter-meeting/VideoArea";
const VideoCallComponent = () => {
  const [isSubtitle, setIsSubtitle] = useState(false);
  const [isSignLanguage, setIsSignLanguage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("off");
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <VideoArea
        isSubtitle={isSubtitle}
        isSignLanguage={isSignLanguage}
        selectedLanguage={selectedLanguage}
      />
      <ToolBar
        isSubtitle={isSubtitle}
        setIsSubtitle={setIsSubtitle}
        isSignLanguage={isSignLanguage}
        setIsSignLanguage={setIsSignLanguage}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
    </div>
  );
};

export default VideoCallComponent;
