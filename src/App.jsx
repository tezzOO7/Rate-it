import React from "react";
import { Analytics } from "@vercel/analytics/react"

import Navbar from "./components/header/Navbar";
import SearchInfluncer from "./components/SearchInfluncer";
import Footer from "./components/footer/Footer";


const App = () => {
  return (
    <div className="relative">
      
      <div className="relative z-10">
        <Navbar></Navbar>
        <SearchInfluncer></SearchInfluncer>
        <Analytics />
      </div>
      <Footer />
    </div>
  );
};

export default App;