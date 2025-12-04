import React from "react";

function Logo({ width = "100px" }) {
  return (
    <img
      src="/logo2.png"
      alt="Logo"
      style={{ width }}
      className="rounded-full shadow-2xl transform h-auto bg-oragne-400 w-auto transition duration-200 hover:scale-105 hover:bg-orange-600"
    />
  );
}

export default Logo;
