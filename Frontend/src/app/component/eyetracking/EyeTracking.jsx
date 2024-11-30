"use client";
import React, { useEffect, useState } from "react";

let flag = false;
const EyeTrackingComponent = () => {
  useEffect(() => {
    webgazer
      .setRegression("ridge")
      .setGazeListener((data, elapsedTime) => {
        // if (data && data.x && data.y) {
        //   console.log(data.x, data.y);
        // } else {
        //   console.log("See nothing");
        // }
      })
      .begin();
    webgazer.applyKalmanFilter(true);
  }, []);

  return <></>;
};

export default EyeTrackingComponent;
