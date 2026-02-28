import "./globals.css";
import Image from "next/image";
import SidebarNav from "../components/SidebarNav";

export const metadata = {
  title: "Inventory Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "Segoe UI, sans-serif",
          background: "#EBF4F6",
          display: "flex",
          minHeight: "100vh",
        }}
      >
        {/* Sidebar — fixed */}
        <aside
          style={{
            width: "240px",
            minHeight: "100vh",
            background: "#EBF4F6",
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            boxShadow: "4px 0 20px rgba(9,99,126,0.15)",
            zIndex: 100,
          }}
        >
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <Image
              src="/logo2.png"
              alt="Logo"
              width={150}
              height={80}
              style={{ borderRadius: "6px", objectFit: "contain" }}
            />
          </div>

          <SidebarNav />

          <div
            style={{
              padding: "20px 24px",
              fontSize: "11px",
              color: "#aaa",
              textAlign: "center",
            }}
          >
            Inventory Management System © 2026
          </div>
        </aside>

        {/* Main Content */}
        <div style={{ marginLeft: "240px", flex: 1, minHeight: "100vh" }}>
          <header
            style={{
              background: "white",
              padding: "16px 32px",
              borderBottom: "1px solid #e0eef2",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky",
              top: 0,
              zIndex: 50,
              boxShadow: "0 2px 8px rgba(9,99,126,0.06)",
            }}
          >
            <div style={{ fontSize: "18px", color: "#0B7894" }}>
              Welcome back
            </div>
            <div
              style={{
                background: "linear-gradient(135deg, #09637E, #088395)",
                color: "white",
                borderRadius: "20px",
                padding: "6px 16px",
                fontSize: "15px",
                fontWeight: "600",
              }}
            >
              Admin
            </div>
          </header>

          <main style={{ padding: "32px" }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
