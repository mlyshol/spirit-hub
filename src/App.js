import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Sermons from "./pages/sermons";
import Home from "./pages/home";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/:pageId" element={<Sermons />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;