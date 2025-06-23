import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import Home from "./pages/Home";
import Valutazione from "./pages/Valutazione";
import Chat from "./pages/Chat";
import Risultato from "./pages/Risultato";
import About from "./pages/About";
import Privacy from "./pages/Privacy";

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/valutazione" element={<Valutazione />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/risultato" element={<Risultato />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;