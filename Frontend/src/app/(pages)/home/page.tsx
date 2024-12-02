"use client";
import CalendarSideBar from "@/app/component/home/CalendarSideBar";
import ScheduleMeetingForm from "@/app/component/home/ScheduleMeetingForm";
import Link from "next/link";
import React from "react";
import { useState } from "react";

const ZoomHome = () => {
  const [onSchedule, setOnSchedule] = useState(false);
  const handleSchedule = () => {
    console.log("Handle Schedule");
    setOnSchedule(!onSchedule);
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main content */}
      {onSchedule && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-8 rounded-lg shadow-lg max-h-full overflow-y-auto">
            {/* Nút "X" để đóng */}
            <button
              onClick={handleSchedule}
              className="absolute top-1 right-4 text-[48px] text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>

            <ScheduleMeetingForm />
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center p-8">
        {/* Quick actions grid */}
        <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto">
          {/* New meeting */}
          <Link href={"/meeting/enter-meeting"}>
            <div className="flex flex-col items-center">
              <button className="w-24 h-24 bg-orange-500 rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <div className="mt-2 flex items-center text-gray-700">
                <span>New meeting</span>
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Join */}
          <Link href={"/meeting"}>
            <div className="flex flex-col items-center">
              <button className="w-24 h-24 bg-blue-500 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
              <span className="mt-2 text-gray-700">Join</span>
            </div>
          </Link>

          {/* Schedule */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleSchedule}
              className="w-24 h-24 bg-blue-500 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
            >
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
            <span className="mt-2 text-gray-700">Schedule</span>
          </div>

          {/* Share screen */}
          <div className="flex flex-col items-center">
            <button className="w-24 h-24 bg-blue-500 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7l4-4m0 0l4 4m-4-4v18"
                />
              </svg>
            </button>
            <span className="mt-2 text-gray-700">Share screen</span>
          </div>
        </div>
      </div>

      {/* Calendar sidebar */}
      <CalendarSideBar />
    </div>
  );
};

export default ZoomHome;
