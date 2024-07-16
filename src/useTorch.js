import React, { useState, useEffect } from "react";

export const useTorchLight = () => {
  const [permissionState, setPermissionState] = useState("unknown");
  const [track, setTrack] = useState();
  const [isTorchAvailable, setIsTorchAvailable] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    navigator.permissions
      .query({
        name: "camera",
      })
      .then((permissionStatus) => {
        console.info("permissionStatus", permissionStatus);
        let permissionState = permissionStatus.state;

        if (permissionState === "prompt" || permissionState === "unknown") {
          navigator.mediaDevices
            .getUserMedia({
              video: true,
            })
            .then(() => {
              setPermissionState("granted");
            })
            .catch(() => {
              setPermissionState("denied");
            });
        }
      });
  }, []);

  useEffect(() => {
    if (permissionState === "granted") {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const cameras = devices
          .filter((device) => device.kind === "videoinput")
          .reverse();
        if (cameras.length === 0) {
          throw "No camera found on this device.";
        }
        const camera = cameras[0];
        console.info("cam device id :: ", camera.deviceId);

        navigator.mediaDevices
          .getUserMedia({
            video: {
              deviceId: {
                exact: camera.deviceId,
              },
            },
          })
          .then((stream) => {
            const track = stream.getVideoTracks().pop();
            setTrack(track);

            if (track?.getCapabilities().torch) {
              setIsTorchAvailable(true);
            } else {
              setIsTorchAvailable(false);
            }
          });
      });
    }
  }, [permissionState]);

  const turnOn = () => {
    setOn(true);

    track.applyConstraints({
      advanced: [
        {
          torch: true,
        },
      ],
    });
  };

  const turnOff = () => {
    setOn(false);

    track.applyConstraints({
      advanced: [
        {
          torch: false,
        },
      ],
    });
  };

  return {
    isTorchAvailable,
    on,
    toggle: on ? turnOff : turnOn,
  };
};
