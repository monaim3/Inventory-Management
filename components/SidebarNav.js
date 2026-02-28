"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsCart3, BsPeople } from "react-icons/bs";
import { FiHome, FiBox, FiGrid, FiTruck, FiBarChart2 } from "react-icons/fi";

const navItems = [
  { href: "/", label: "Dashboard", icon: FiHome },
  { href: "/products", label: "Products", icon: FiBox },
  { href: "/categories", label: "Categories", icon: FiGrid },
  { href: "/suppliers", label: "Suppliers", icon: FiTruck },
  { href: "/customers", label: "Customers", icon: BsPeople },
  { href: "/sales", label: "Sales", icon: BsCart3 },
  { href: "/reports", label: "Reports", icon: FiBarChart2 },
];

export default function SidebarNav({ onNavClick = () => {} }) {
  const pathname = usePathname();

  return (
    <nav style={{ padding: "16px 12px", flex: 1 }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              color: isActive ? "white" : "#0B7894",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: isActive ? "700" : "500",
              marginBottom: "4px",
              background: isActive ? "#0B7894" : "transparent",
              transition: "all 0.2s",
            }}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
