"use client";

import React, { useState } from "react";
import ToolBar from "@/app/component/enter-meeting/ToolBar";
import VideoArea from "@/app/component/enter-meeting/VideoArea";
const VideoCallComponent = () => {
  const [isSubtitle, setIsSubtitle] = useState(false);
  const [isSignLanguage, setIsSignLanguage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("off");
  return (
    <div className="flex flex-col bg-gray-900 text-white">
      <div className="py-4">
        <VideoArea
          isSubtitle={isSubtitle}
          isSignLanguage={isSignLanguage}
          selectedLanguage={selectedLanguage}
        />
      </div>
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
