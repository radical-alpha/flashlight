import React, { useMemo, useState } from "react";
import { useTorchLight, useZxing } from "./hooks";
import "./ScannerCore.css";

export const QRScanner = ({ onScanResult }) => {
  const { ref } = useZxing({ onScanResult });
  const [isTorchAvailable, setIsTorchAvailable] = useState(false);

  const onVideoPlay = () => {
    const track = ref.current.srcObject.getTracks().pop();
    setIsTorchAvailable(track.getCapabilities()?.torch);
  };

  const toggle = (value) => {
    const track = ref.current.srcObject.getTracks().pop();
    track.applyConstraints({
      advanced: [
        {
          torch: value,
        },
      ],
    });
  };

  return (
    <div className="qrContainer">
      <video className="qrScanner" ref={ref} onPlay={onVideoPlay} />
      <FlashLight isTorchAvailable={isTorchAvailable} toggle={toggle} />
    </div>
  );
};

const FlashLightComponent = ({ isTorchAvailable, toggle }) => {
  const [removeFlashLight, setRemoveFlashLight] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const onFlashClick = () => {
    setRemoveFlashLight(true);
    setTimeout(() => {
      setTorchOn(!torchOn);
      setRemoveFlashLight(false);
    }, 500);
    toggle(!torchOn);
  };
  const showTorchIcon = useMemo(() => {
    return isTorchAvailable && !removeFlashLight;
  }, [isTorchAvailable, removeFlashLight]);
  return (
    showTorchIcon && (
      <button onClick={onFlashClick} className="flashButton">
        {torchOn ? "Off" : "On"}
      </button>
    )
  );
};

const FlashLight = React.memo(FlashLightComponent);
