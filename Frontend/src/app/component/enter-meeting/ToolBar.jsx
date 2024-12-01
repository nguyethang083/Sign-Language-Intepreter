import Link from "next/link";
import { useState, useEffect } from "react";

const ToolBar = () => {
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isEyeTracking, setIsEyeTracking] = useState(false);
  const [isSubtitle, setIsSubtitle] = useState(false);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([
    { name: "Duc Anh Phung", isHost: true },
    { name: "John Doe", isHost: false },
    { name: "Jane Smith", isHost: false },
  ]);

  const [currentMessage, setCurrentMessage] = useState("");

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: currentMessage, sender: "You" },
      ]);
      setCurrentMessage("");
    }
  };
  useEffect(() => {
    if (!isEyeTracking) {
      const removeElements = (selector) => {
        document.querySelectorAll(selector).forEach((el) => el.remove());
      };

      removeElements("#webgazerVideoContainer");
      removeElements("#webgazerGazeDot");
    }
  }, [isEyeTracking]);

  return (
    <>
      {/* Chat Sidebar */}
      {isChatOpen && (
        <div className="absolute top-0 right-0 bottom-0 w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Chat</h2>
            <button
              className="text-gray-400 hover:text-white"
              onClick={() => setIsChatOpen(false)}
            >
              ✖️
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender === "You"
                    ? "text-right text-blue-400"
                    : "text-left text-gray-400"
                }`}
              >
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none"
                placeholder="Type a message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Participants Sidebar */}
      {isParticipantsOpen && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Participants</h2>
            <button
              className="text-gray-400 hover:text-white"
              onClick={() => setIsParticipantsOpen(false)}
            >
              ✖️
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {participants.map((participant, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-700 px-4 py-2 rounded-lg"
              >
                <span>{participant.name}</span>
                {participant.isHost && (
                  <span className="text-sm text-blue-400">Host</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between h-[12%] bg-gray-800 py-3 border-t border-gray-700">
        <div>
          <button
            className={`mx-2 px-4 py-2 hover:bg-gray-700 rounded-lg`}
            onClick={() => setIsAudioOn(!isAudioOn)}
          >
            <div className="text-[20px]">{isAudioOn ? "🔊" : "🔇"}</div>
            <div>Audio</div>
          </button>
          <button
            className={`mx-2 px-4 py-2 hover:bg-gray-700 rounded-lg`}
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            <div className="text-[20px]">{isVideoOn ? "📹" : "📷"}</div>
            <div>{isVideoOn ? "Stop Video" : "Start Video"}</div>
          </button>
        </div>

        <div>
          <button
            className="mx-2 px-4 py-2 hover:bg-gray-700 rounded-lg"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <div className="text-[20px]">💬</div>
            <div>Chat</div>
          </button>

          <button
            className="mx-2 px-4 py-2 hover:bg-gray-700 rounded-lg"
            onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
          >
            <div className="text-[20px]">🙋‍♂️</div>
            <div>Participants</div>
          </button>

          <button className="mx-2 px-4 py-2 hover:bg-gray-700 rounded-lg">
            <div className="text-[20px]">🎥</div>
            <div>Share</div>
          </button>
          <button
            onClick={() => setIsSubtitle(!isSubtitle)}
            className="mx-2 px-4 py-2 hover:bg-gray-700 rounded-lg"
          >
            <div className="text-[20px]">{isSubtitle ? "📤" : "📥"}</div>
            <div>Subtitle</div>
          </button>

          <button
            onClick={() => setIsEyeTracking(!isEyeTracking)}
            className="mx-2 px-4 py-2 hover:bg-gray-700 rounded-lg"
          >
            <div className="text-[20px]">{isEyeTracking ? "😐" : "😑"}</div>
            <div>Eye tracking</div>
          </button>
        </div>

        <Link href={"/summary"}>
          <button className="mx-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
            ❌ End
          </button>
        </Link>
      </div>
    </>
  );
};
export default ToolBar;
