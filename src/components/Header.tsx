import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="backdrop-blur-sm bg-white/10  shadow-xl py-6 px-6 flex justify-between items-center fixed w-full z-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-40 blur-xl" />
      <Link
        href="/"
        className="text-3xl font-extrabold text-white tracking-wide drop-shadow-lg relative z-10 transition-all hover:text-outline-sm hover:scale-105">
        Skybox ai
      </Link>
    </header>
  );
};
export default Header;
