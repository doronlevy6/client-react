import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import WelcomePage from "./components/WelcomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
    </Routes>
  );
}

export default App;
