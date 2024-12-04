import Link from "next/link";
import React from "react";

const SignMeetWorkplace = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 flex flex-col items-center justify-center p-4">
      {/* Logo and Title Section */}
      <div className="mb-16 text-center animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-white mr-3 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-white animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="text-white text-4xl font-bold mb-2">SignMeet</h1>
        <h2 className="text-white text-2xl font-light">
          Video Call & Sign Language Support
        </h2>
      </div>

      {/* Main Container */}
      <div className="bg-white/95 backdrop-blur rounded-xl p-8 w-full max-w-md shadow-2xl animate-fade-in">
        {/* Join Meeting Button */}
        <Link href={"/meeting"}>
          <button
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg mb-4 
                         hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center transform hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Join a meeting
          </button>
        </Link>

        {/* Sign Up Button */}
        <Link href={"/signup"}>
          <button
            className="w-full bg-white text-blue-600 py-4 px-6 rounded-lg mb-3
                         border-2 border-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium transform hover:scale-105"
          >
            Sign up
          </button>
        </Link>

        {/* Sign In Button */}
        <Link href={"/signin"}>
          <button
            className="w-full bg-gray-50 text-gray-700 py-4 px-6 rounded-lg
                         hover:bg-gray-100 transition-all duration-200 font-medium transform hover:scale-105"
          >
            Sign in
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SignMeetWorkplace;
