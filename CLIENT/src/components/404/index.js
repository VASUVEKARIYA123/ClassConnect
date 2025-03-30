import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen text-center p-6 bg-gradient-to-r from-indigo-900 via-purple-700 to-pink-600 text-white overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="w-[600px] h-[600px] bg-white opacity-10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>
      <h1 className="text-9xl font-extrabold drop-shadow-lg mb-4 animate-bounce">
        404
      </h1>
      <p className="text-xl font-semibold drop-shadow-md mb-6 animate-pulse">
        Oops! The page you are looking for does not exist.
      </p>
      <Link to="/">
        <button className="px-8 py-4 text-xl font-bold rounded-full bg-yellow-400 text-gray-900 shadow-2xl transform hover:scale-110 transition-all duration-300 hover:bg-yellow-500 relative z-10">
          🚀 Take Me Home!
        </button>
      </Link>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-20 w-32 h-32 bg-pink-300 opacity-30 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400 opacity-30 rounded-full blur-2xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-indigo-500 opacity-30 rounded-full blur-2xl animate-float delay-500"></div>
      </div>
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 4s infinite ease-in-out;
          }
        `}
      </style>
    </div>
  );
}