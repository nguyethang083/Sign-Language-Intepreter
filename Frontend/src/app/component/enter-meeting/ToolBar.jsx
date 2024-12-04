import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

const ToolBar = ({
  isSubtitle,
  setIsSubtitle,
  isSignLanguage,
  setIsSignLanguage,
  selectedLanguage,
  setSelectedLanguage,
}) => {
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([
    { name: "Duc Anh Phung", isHost: true },
    { name: "John Doe", isHost: false },
    { name: "Jane Smith", isHost: false },
  ]);

  const [currentMessage, setCurrentMessage] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "vi", name: "Tiếng Việt" },
    { code: "ja", name: "日本語" },
    { code: "ko", name: "한국어" },
    { code: "zh", name: "中文" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "off", name: "Turn off" },
  ];

  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode);
    setIsTranslating(true);
    setShowLanguageMenu(false);
  };

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: currentMessage, sender: "You" },
      ]);
      setCurrentMessage("");
    }
  };

  // Memoize the current language name
  const currentLanguageName = useMemo(() => {
    const selectedLang = languages.find(
      (lang) => lang.code === selectedLanguage
    );
    return selectedLang ? selectedLang.name : "Translate";
  }, [selectedLanguage, languages]);

  return (
    <>
      {/* Chat Sidebar */}
      {isChatOpen && (
        <div className="fixed top-0 right-0 h-screen w-80 bg-white flex flex-col shadow-lg z-50">
          <div className="p-3 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-base font-medium text-gray-700">
              Meeting Chat
            </h2>
            <button
              className="p-1 hover:bg-gray-200 rounded-full transition duration-200"
              onClick={() => setIsChatOpen(false)}
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {messages.map((msg, index) => (
              <div key={index} className="mb-4">
                <div className="text-xs text-gray-500 mb-1">{msg.sender}</div>
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    msg.sender === "You"
                      ? "ml-auto bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 font-medium">To:</span>
                <select className="text-sm bg-transparent border-0 focus:ring-0 text-gray-600 font-medium">
                  <option>Everyone</option>
                </select>
              </div>

              <div className="relative">
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-black"
                  placeholder="Type message here..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center space-x-2 px-1">
                <button className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>
                <button className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <button className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Participants Sidebar */}
      {isParticipantsOpen && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-900 border-l border-gray-700 flex flex-col shadow-lg">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Participants</h2>
            <button
              className="text-gray-400 hover:text-white transition duration-200"
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
                <span className="text-white">{participant.name}</span>
                {participant.isHost && (
                  <span className="text-sm text-blue-400">Host</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between h-[12%] bg-gray-900 py-3 border-t border-gray-700 shadow-lg">
        <div>
          <button
            className={`mx-2 px-4 py-2 hover:bg-gray-700 rounded-lg transition duration-200`}
            onClick={() => setIsAudioOn(!isAudioOn)}
          >
            <div className="text-[20px]">{isAudioOn ? "🔊" : "🔇"}</div>
            <div className="text-white">Audio</div>
          </button>
          <button
            className={`mx-2 px-4 py-2 hover:bg-gray-700 rounded-lg transition duration-200`}
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            <div className="text-[20px]">{isVideoOn ? "📹" : "📷"}</div>
            <div className="text-white">
              {isVideoOn ? "Stop Video" : "Start Video"}
            </div>
          </button>
        </div>

        <div className="relative">
          <button
            className="mx-2 px-4 py-2 hover:bg-gray-700 rounded-lg transition duration-200"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <div className="text-[20px]">💬</div>
            <div className="text-white">Chat</div>
          </button>

          <button
            className="mx-2 px-4 py-2 hover:bg-gray-700 rounded-lg transition duration-200"
            onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
          >
            <div className="text-[20px]">🙋‍♂️</div>
            <div className="text-white">Participants</div>
          </button>

          <button className="mx-2 px-4 py-2 hover:bg-gray-700 rounded-lg transition duration-200">
            <div className="text-[20px]">🎥</div>
            <div className="text-white">Share</div>
          </button>
          <button
            onClick={() => setIsSubtitle(!isSubtitle)}
            className="mx-2 px-4 py-2 hover:bg-gray-700 rounded-lg transition duration-200"
          >
            <div className="text-[20px]">{isSubtitle ? "📤" : "📥"}</div>
            <div className="text-white">Subtitle</div>
          </button>

          <button
            onClick={() => setIsSignLanguage(!isSignLanguage)}
            className="mx-2 px-4 py-2 hover:bg-gray-700 rounded-lg transition duration-200"
          >
            <div className="text-[20px]">{isSignLanguage ? "🤟" : "👋"}</div>
            <div className="text-white">Sign language</div>
          </button>

          <div className="relative inline-block">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="mx-2 px-4 py-2 hover:bg-gray-700 rounded-lg transition duration-200"
            >
              <div className="text-[20px]">🌐</div>
              <div className="text-white">{currentLanguageName}</div>
            </button>

            {showLanguageMenu && (
              <div className="absolute bottom-full mb-2 right-0 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors duration-200
                      ${
                        selectedLanguage === lang.code
                          ? "bg-gray-700 text-blue-400"
                          : "text-white"
                      }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Link href={"/summary"}>
          <button className="mx-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition duration-200">
            ❌ End
          </button>
        </Link>
      </div>
    </>
  );
};
export default ToolBar;
