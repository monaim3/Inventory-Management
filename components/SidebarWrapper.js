"use client";

import { useState } from "react";
import Image from "next/image";
import SidebarNav from "./SidebarNav";
import { FiMenu, FiX } from "react-icons/fi";

function SidebarContent({ onNavClick }) {
  return (
    <>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <Image
          src="/logo2.png"
          alt="Logo"
          width={150}
          height={80}
          style={{ objectFit: "contain" }}
        />
      </div>
      <SidebarNav onNavClick={onNavClick} />
      <div style={{ padding: "20px 24px", fontSize: "11px", color: "#aaa", textAlign: "center" }}>
        Inventory Management System © 2026
      </div>
    </>
  );
}

export default function SidebarWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar — in-flow, part of body flex layout */}
      <aside
        className="hidden md:flex flex-col"
        style={{
          width: "240px",
          flexShrink: 0,
          background: "#EBF4F6",
          boxShadow: "4px 0 20px rgba(9,99,126,0.15)",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <SidebarContent onNavClick={() => {}} />
      </aside>

      {/* Mobile hamburger button */}
      <button
        className="md:hidden"
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          top: "14px",
          left: "14px",
          zIndex: 250,
          padding: "8px",
          borderRadius: "8px",
          background: "#09637E",
          color: "white",
          border: "none",
          cursor: "pointer",
          lineHeight: 0,
        }}
        aria-label="Toggle menu"
      >
        {open ? <FiX size={18} /> : <FiMenu size={18} />}
      </button>

      {/* Mobile backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 200,
          }}
        />
      )}

      {/* Mobile overlay sidebar */}
      <aside
        className="md:hidden flex flex-col"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "240px",
          background: "#EBF4F6",
          boxShadow: "4px 0 20px rgba(9,99,126,0.15)",
          zIndex: 210,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <SidebarContent onNavClick={() => setOpen(false)} />
      </aside>
    </>
  );
}
