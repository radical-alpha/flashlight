import "./App.css";
import { useTorchLight } from "./useTorch";

function App() {
  const { isTorchAvailable, on, toggle } = useTorchLight();
  return (
    <div className="App">
      <p>Is flash light available : {isTorchAvailable ? "Yes" : "No"}</p>
      <button onClick={toggle}>{on ? "Off" : "On"}</button>
    </div>
  );
}

export default App;
