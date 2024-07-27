import {
  BarcodeFormat,
  BrowserMultiFormatReader,
  DecodeHintType,
} from "@zxing/library";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const SUPPORTS_MEDIA_DEVICES = "mediaDevices" in navigator;

const DecodeHints = new Map();
const formats = [BarcodeFormat.QR_CODE];
DecodeHints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

export const useZxing = ({
  constraints = {
    audio: false,
    video: {
      facingMode: "environment",
    },
  },
  hints = DecodeHints,
  timeBetweenDecdingAttempts = 300,
  onScanResult = () => {},
}) => {
  const ref = useRef();
  const reader = useMemo(() => {
    const instance = new BrowserMultiFormatReader(hints);
    instance.timeBetweenDecodingAttempts = timeBetweenDecdingAttempts;
    return instance;
  }, [hints, timeBetweenDecdingAttempts]);

  useEffect(() => {
    if (ref.current) {
      reader.decodeFromConstraints(
        constraints,
        ref.current,
        (result, error) => {
          if (result) {
            onScanResult(result);
          }
        }
      );
    }
    return () => {
      reader.reset();
    };
  }, [constraints]);

  return { ref };
};

export const useTorchLight = ({ mediaStream }) => {
  const [permissionState, setPermissionState] = useState("unknown");
  const [track, setTrack] = useState();
  const [isTorchAvailable, setIsTorchAvailable] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (mediaStream && !track) {
      // const tracks = mediaStream.getTracks();
      const track = mediaStream.getVideoTracks().pop();
      if (track) {
        setTrack(track);
        alert(`${JSON.stringify(track.getCapabilities().torch)}`);
        if (track?.getCapabilities().torch) {
          setIsTorchAvailable(true);
        } else {
          setIsTorchAvailable(false);
        }
        console.log("track", track);
      }
    }
  }, [mediaStream]);

  useEffect(() => {
    // let tempPermission = permissionState;
    // const getPermissions = async () => {
    //   try {
    //     tempPermission = await navigator.permissions.query({
    //       name: "camera",
    //     });
    //     tempPermission = tempPermission.state;
    //     console.log(tempPermission);
    //   } catch {}
    //   if (["unknown", "prompt"].includes(tempPermission)) {
    //     try {
    //       await navigator.mediaDevices.getUserMedia({ video: true });
    //       // alert(`torch status :: granted}`);
    //       tempPermission = "granted";
    //     } catch {
    //       // alert(
    //       //   `torch status:: ${JSON.stringify({ tempPermission: tempPermission })}`
    //       // );
    //       alert(`torch status :: denied)}`);
    //       tempPermission = "denied";
    //     }
    //   }
    //   // console.log(tempPermission);
    //   setPermissionState(tempPermission);
    // };
    // getPermissions();
    // navigator.permissions
    //   .query({
    //     name: "camera",
    //   })
    //   .then((permissionStatus) => {
    //     let permissionState = permissionStatus.state;
    //     setPermissionState(permissionState);
    //     if (permissionState === "prompt") {
    //       navigator.mediaDevices
    //         .getUserMedia({
    //           video: true,
    //         })
    //         .then(() => {
    //           setPermissionState("granted");
    //         })
    //         .catch((err) => {
    //           console.log("Error", err);
    //           setPermissionState("denied");
    //         });
    //     }
    //   });
  }, []);

  // useEffect(() => {
  //   if (permissionState === "granted" && SUPPORTS_MEDIA_DEVICES) {
  //     navigator.mediaDevices.enumerateDevices().then((devices) => {
  //       const cameras = devices
  //         .filter((device) => device.kind === "videoinput")
  //         .reverse();
  //       if (cameras.length === 0) {
  //         console.log("No camera found on this device.", "");
  //         setIsTorchAvailable(false);
  //       } else {
  //         const camera = cameras[0];
  //         console.log("Cam device ID :: ", camera.deviceId);

  //         navigator.mediaDevices
  //           .getUserMedia({
  //             video: {
  //               deviceId: {
  //                 exact: camera.deviceId,
  //               },
  //             },
  //           })
  //           .then((stream) => {
  //             const track = stream.getVideoTracks().pop();
  //             setTrack(track);
  //             // @ts-ignore
  //             if (track?.getCapabilities().torch) {
  //               setIsTorchAvailable(true);
  //             } else {
  //               setIsTorchAvailable(false);
  //             }
  //           });
  //       }
  //     });
  //   }
  // }, [permissionState]);

  const turnOn = useCallback(() => {
    setOn(true);
    // @ts-ignore
    track.applyConstraints({
      advanced: [
        {
          // @ts-ignore
          torch: true,
        },
      ],
    });
  }, [track]);

  const turnOff = useCallback(() => {
    setOn(false);
    // @ts-ignore
    track.applyConstraints({
      advanced: [
        {
          // @ts-ignore
          torch: false,
        },
      ],
    });
  }, [track]);

  const getToggler = useCallback(() => {
    if (isTorchAvailable) {
      return on ? turnOff : turnOn;
    } else {
      return () => {};
    }
  }, [isTorchAvailable, on, turnOn, turnOff]);

  return {
    isTorchAvailable,
    on,
    toggle: getToggler(),
  };
};
