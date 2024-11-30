import Link from "next/link";
import React from "react";

const SignMeetWorkplace = () => {
  return (
    <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center p-4">
      {/* Logo and Title */}
      <div className="mb-20 text-center">
        <h1 className="text-white text-4xl font-bold mb-2">SignMeet</h1>
        <h2 className="text-white text-5xl font-normal">Workplace</h2>
      </div>

      {/* Login Container */}
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        {/* Join Meeting Button */}
        <Link href={"/meeting"}>
          <button
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md mb-4 
                     hover:bg-blue-600 transition-colors duration-200 font-medium"
          >
            Join a meeting
          </button>
        </Link>

        {/* Sign Up Button */}
        <Link href={"/signup"}>
          <button
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md mb-3
                     hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Sign up
          </button>
        </Link>

        {/* Sign In Button */}
        <Link href={"/signin"}>
          <button
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md
                     hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Sign in
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SignMeetWorkplace;
