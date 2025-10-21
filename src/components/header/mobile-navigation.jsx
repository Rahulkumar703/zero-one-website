"use client";
import React, { useEffect, useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import Sidebar from "./Sidebar";

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // ensure overlay root exists for the Sidebar portal
    let overlay = document.getElementById("overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.setAttribute("id", "overlay");
      document.body.appendChild(overlay);
    }
    return () => {};
  }, []);

  return (
    <div className="lg:hidden block">
      <button
        aria-label="open menu"
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-md"
      >
        <HiMenuAlt4 size={26} />
      </button>
      <Sidebar isMounted={isOpen} unmount={() => setIsOpen(false)} />
    </div>
  );
};

export default MobileNavigation;
