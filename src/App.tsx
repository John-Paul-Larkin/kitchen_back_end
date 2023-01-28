import React from "react";
import MainScreen from "./components/MainScreen";
import StationContext from "./context/StationContext";
import "./styles/App.css";

function App() {
  return (
    <>
      <StationContext>
        <MainScreen />
      </StationContext>
    </>
  );
}

export default App;
