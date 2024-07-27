import "./App.css";
import { QRScanner } from "./ScannerCore";
import { useTorchLight } from "./useTorch";

// function App() {
//   const { isTorchAvailable, on, toggle } = useTorchLight();
//   return (
//     <div className="App">
//       <p>Is flash light available : {isTorchAvailable ? "Yes" : "No"}</p>
//       <button onClick={toggle}>{on ? "Off" : "On"}</button>
//     </div>
//   );
// }

function App() {
  const onScanResult = (e) => {
    console.log("scan result", e);
  };
  return (
    <div className="container">
      <div className="qrCode">
        <QRScanner onScanResult={onScanResult} />
      </div>
    </div>
  );
}

export default App;
