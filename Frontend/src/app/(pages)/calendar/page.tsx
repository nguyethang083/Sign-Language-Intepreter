"use client";
import CalendarSideBar from "@/app/component/home/CalendarSideBar";
import TopNavigationBar from "@/app/component/navigation/TopNavigationBar";
import React from "react";

const ZoomHome = () => {
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Navigation Bar */}
      <TopNavigationBar />

      {/* Existing content */}
      <div className="flex flex-1 justify-between">
        <iframe
          src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FHo_Chi_Minh&showPrint=0&mode=WEEK&src=cGh1bmdkdWNhbmgyNTExQGdtYWlsLmNvbQ&src=ZTVjZTMyOGU1NTAzMTAyZDU5MmM2NjYxNzRjMWU2NDcxOWE5ZWZlNGRlYzEzOGU4ZDQzZTEwZTg1NThkMTBkYkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=ZjQ3NzBhOWFjMDVmNzJmZTU0OTU0ZmUxMjFhZjM4YWZhNzk5Mjg1ZDQzYzUyNjgwMzcyNmUyMTY2NDU0ZDYyM0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=aGQ2Z2cyNHRqZ2YxOGRjMGY5azVpbWdkaDhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=bGI3ZDZnb3E1NXI5dXVqbHVvMTFqZmFjbmtAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=bTVjbWs5b3YzZnN2cjc4aTJyMWl1cDNkYzBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=MmNkZWM1MmRkMzFiMTJjNDE3ZTM3YzM3MDYxNjkyNzVkMWMzZTk5YTc4YWJkYTA4YTBiYWI5NGRiNzQ2ODFjNUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=YzdrODY5cDRuMnRyamhnbDI3b2NtOTZhOXNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=MTBmYzE4Y2IyYWVlMWFiZTE3OTkyNGVlZDlhYTY5Y2U5NDAyOGNmNTM3NTRlNmJkNmI4ZWQ4ZDgxYmE5ODg0MEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=dmkub3J0aG9kb3hfY2hyaXN0aWFuaXR5I2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=dmkudmlldG5hbWVzZSNob2xpZGF5QGdyb3VwLnYuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23009688&color=%23D50000&color=%237CB342&color=%23ba3c6b&color=%23ccb577&color=%23E67C73&color=%23536bc2&color=%2369c093&color=%23b09cb7&color=%23C0CA33&color=%234285F4&color=%230B8043"
          width="1000"
          height="600"
          frameBorder={0}
          scrolling="no"
        ></iframe>

        {/* Calendar sidebar */}
        <CalendarSideBar />
      </div>
    </div>
  );
};

export default ZoomHome;
