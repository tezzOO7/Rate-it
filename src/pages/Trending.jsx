import React from "react";
import Navbar from "../components/header/Navbar";
import { Link } from "react-router-dom";


const Trending = () => {
  return (
    <>
     
      <div className="relative z-10">
        <Navbar></Navbar>
        <div className="bg-gray-50/80 backdrop-blur-sm min-h-screen">
          <h1>lovely Trending page please</h1>
        </div>
      </div>
    </>
  );
};

export default Trending;
