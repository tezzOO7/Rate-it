import React from "react";

import Navbar from "./components/header/Navbar";
import SearchInfluncer from "./components/SearchInfluncer";


const App = () => {
  return (
    <div className="relative">
      
      <div className="relative z-10">
        <Navbar></Navbar>
        <SearchInfluncer></SearchInfluncer>
      </div>
    </div>
  );
};

export default App;
