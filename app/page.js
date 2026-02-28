import { FiBox, FiDollarSign, FiGrid, FiTruck } from "react-icons/fi";
import { TbCurrencyTaka } from "react-icons/tb";
import DashboardChart from "../components/DashboardChart";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function getDashboardData() {
  const [products, reports, categories, suppliers] = await Promise.all([
    fetch(`${BASE}/api/products`, { cache: "no-store" }).then((r) => r.json()),
    fetch(`${BASE}/api/reports`, { cache: "no-store" }).then((r) => r.json()),
    fetch(`${BASE}/api/categories`, { cache: "no-store" }).then((r) => r.json()),
    fetch(`${BASE}/api/suppliers`, { cache: "no-store" }).then((r) => r.json()),
  ]);
  return { products, reports, categories, suppliers };
}

export default async function Dashboard() {
  const { products, reports, categories, suppliers } = await getDashboardData();
  const totalValue = products.reduce(
    (sum, p) => sum + parseFloat(p.price) * p.quantity,
    0
  );

  const statCards = [
    {
      label: "Total Products",
      value: products.length,
      icon: FiBox,
      gradient: "linear-gradient(135deg, #09637E 0%, #0d8fad 100%)",
      shadow: "0 8px 32px rgba(9,99,126,0.35)",
    },
    {
      label: "Total Value",
      value: "৳ " + totalValue.toLocaleString(),
      icon: TbCurrencyTaka,
      gradient: "linear-gradient(135deg, #0f7a6e 0%, #14a896 100%)",
      shadow: "0 8px 32px rgba(15,122,110,0.35)",
    },
    {
      label: "Categories",
      value: categories.length,
      icon: FiGrid,
      gradient: "linear-gradient(135deg, #1a6eb5 0%, #2190e0 100%)",
      shadow: "0 8px 32px rgba(26,110,181,0.35)",
    },
    {
      label: "Suppliers",
      value: suppliers.length,
      icon: FiTruck,
      gradient: "linear-gradient(135deg, #6b3fa0 0%, #9b59d0 100%)",
      shadow: "0 8px 32px rgba(107,63,160,0.35)",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#09637E] mb-2">Dashboard</h1>
      <p className="text-black text-sm mb-7">Overview of your inventory</p>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "28px" }}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="rounded-xl px-6 py-7 flex flex-col justify-between relative overflow-hidden min-h-[150px]"
              style={{ background: card.gradient, boxShadow: card.shadow }}
            >
              <div className="flex justify-between items-center z-10">
                <span className="text-[13px] font-semibold text-white/80 tracking-wide uppercase">
                  {card.label}
                </span>
                <div className="w-[42px] h-[42px] rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Icon size={20} color="white" />
                </div>
              </div>
              <div className="text-[38px] font-semibold text-white tracking-tighter leading-none z-10 mt-4">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales Chart */}
      <DashboardChart />

      {/* Low Stock Alert */}
      {reports.lowStock?.length > 0 && (
        <div className="bg-[linear-gradient(135deg,#fff5f5,#ffe8e8)] border border-[#ffcdd2] rounded-2xl px-6 py-5 mb-7">
          <h2 className="text-[#e53935] font-bold mb-2.5">⚠️ Low Stock Alert</h2>
          {reports.lowStock.map((p) => (
            <div key={p.id} className="text-[#c62828] text-sm mb-1">
              • <strong>{p.name}</strong> — only {p.quantity} remaining
            </div>
          ))}
        </div>
      )}

      {/* Recent Products Table */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(9,99,126,0.08)]">
        <h2 className="text-base font-bold text-[#09637E] mb-4">
          Recent Products
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#EBF4F6]">
                {["Name", "Category", "Supplier", "Price", "Quantity"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3.5 py-2.5 text-[#088395] font-semibold text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 6).map((p) => (
                <tr key={p.id} className="border-b border-[#f0f7f8]">
                  <td className="px-3.5 py-3 font-semibold text-[#09637E]">{p.name}</td>
                  <td className="px-3.5 py-3 text-[#555]">{p.category_name}</td>
                  <td className="px-3.5 py-3 text-[#555]">{p.supplier_name}</td>
                  <td className="px-3.5 py-3 font-semibold text-[#088395]">৳ {p.price}</td>
                  <td className="px-3.5 py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        p.quantity < 10
                          ? "bg-[#ffebee] text-[#e53935]"
                          : "bg-[#e8f5e9] text-[#2e7d32]"
                      }`}
                    >
                      {p.quantity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
