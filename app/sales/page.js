"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsCart3, BsPeople } from "react-icons/bs";
import { TbCurrencyTaka } from "react-icons/tb";
import { FiSearch, FiDownload, FiPrinter } from "react-icons/fi";
import ConfirmModal from "../../components/ConfirmModal";
import Pagination from "../../components/Pagination";
import EmptyState from "../../components/EmptyState";
import SkeletonRow from "../../components/SkeletonRow";

const PAGE_SIZE = 10;

const inputStyle = {
  border: "1.5px solid #c8e0e6",
  borderRadius: "8px",
  padding: "10px 14px",
  fontSize: "14px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  color: "#333",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function printInvoice(sale) {
  const win = window.open("", "_blank", "width=620,height=820");
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Invoice #${sale.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 48px; color: #333; }
    .header { text-align: center; border-bottom: 2px solid #09637E; padding-bottom: 24px; margin-bottom: 24px; }
    .header h1 { color: #09637E; font-size: 28px; letter-spacing: 4px; }
    .header p { color: #7AB2B2; margin-top: 4px; }
    .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f7f8; font-size: 15px; }
    .row span { color: #888; }
    .total { border-top: 2px solid #09637E; margin-top: 16px; padding-top: 16px; display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; color: #09637E; }
    .footer { margin-top: 40px; text-align: center; color: #aaa; font-size: 12px; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>INVOICE</h1>
    <p>Invoice #${sale.id} &nbsp;•&nbsp; ${formatDate(sale.sale_date)}</p>
  </div>
  <div class="row"><span>Customer</span><strong>${sale.customer_name}</strong></div>
  <div class="row"><span>Product</span><strong>${sale.product_name}</strong></div>
  <div class="row"><span>Quantity</span><strong>${sale.quantity}</strong></div>
  <div class="row"><span>Unit Price</span><strong>৳${sale.unit_price}</strong></div>
  ${sale.note ? `<div class="row"><span>Note</span><strong>${sale.note}</strong></div>` : ""}
  <div class="total"><span>Total Amount</span><strong>৳${parseFloat(sale.total_price).toLocaleString()}</strong></div>
  <div class="footer">Thank you for your business!</div>
  <script>window.print(); window.onafterprint = () => window.close();</script>
</body>
</html>`);
  win.document.close();
}

function exportCSV(sales) {
  const headers = ["#", "Customer", "Product", "Qty", "Unit Price", "Total", "Date"];
  const rows = sales.map((s) => [
    `#${s.id}`,
    s.customer_name,
    s.product_name,
    s.quantity,
    `${s.unit_price}`,
    `${parseFloat(s.total_price).toFixed(2)}`,
    formatDate(s.sale_date),
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((v) => `"${v}"`).join(","))
    .join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sales_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({ customer_id: "", product_id: "", quantity: "", note: "" });

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [s, p, c] = await Promise.all([
        fetch("/api/sales").then((r) => r.json()),
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/customers").then((r) => r.json()),
      ]);
      setSales(s);
      setProducts(p);
      setCustomers(c);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  function handleProductChange(productId) {
    setForm({ ...form, product_id: productId, quantity: "" });
    setSelectedProduct(products.find((p) => p.id == productId) || null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success(`Sale recorded! Total: ৳${data.total_price}`);
        setForm({ customer_id: "", product_id: "", quantity: "", note: "" });
        setSelectedProduct(null);
        loadAll();
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function confirmDelete() {
    try {
      await fetch(`/api/sales/${confirm.id}`, { method: "DELETE" });
      toast.error("Sale deleted!");
      setConfirm({ open: false, id: null });
      loadAll();
    } catch {
      toast.error("Delete failed");
    }
  }

  const totalRevenue = sales.reduce((sum, s) => sum + parseFloat(s.total_price), 0);

  const filtered = sales.filter((s) =>
    [s.customer_name, s.product_name].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={1500} />
      <ConfirmModal
        isOpen={confirm.open}
        message="Are you sure you want to delete this sale record? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ open: false, id: null })}
      />

      <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#09637E", marginBottom: "8px" }}>Sales</h1>
      <p style={{ color: "black", marginBottom: "28px", fontSize: "14px" }}>Record and manage product sales</p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "28px" }}>
        {[
          { label: "Total Sales", value: sales.length, icon: BsCart3, gradient: "linear-gradient(135deg, #09637E 0%, #0d8fad 100%)", shadow: "0 8px 32px rgba(9,99,126,0.35)" },
          { label: "Total Revenue", value: "৳ " + totalRevenue.toLocaleString(), icon: TbCurrencyTaka, gradient: "linear-gradient(135deg, #0f7a6e 0%, #14a896 100%)", shadow: "0 8px 32px rgba(15,122,110,0.35)" },
          { label: "Customers", value: customers.length, icon: BsPeople, gradient: "linear-gradient(135deg, #1a6eb5 0%, #2190e0 100%)", shadow: "0 8px 32px rgba(26,110,181,0.35)" },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="rounded-xl px-6 py-7 flex flex-col justify-between relative overflow-hidden min-h-[140px]" style={{ background: card.gradient, boxShadow: card.shadow }}>
              <div className="flex justify-between items-center">
                <span className="text-[15px] font-bold text-white tracking-wide uppercase">{card.label}</span>
                <div className="w-[46px] h-[46px] rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Icon size={22} color="white" />
                </div>
              </div>
              <div className="text-[42px] font-bold text-white tracking-tighter leading-none mt-4">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* New Sale Form */}
      <div style={{ background: "white", borderRadius: "16px", padding: "24px", marginBottom: "24px", boxShadow: "0 2px 12px rgba(9,99,126,0.08)", borderTop: "4px solid #088395" }}>
        <h2 style={{ fontWeight: "700", color: "#09637E", marginBottom: "16px" }}>🧾 New Sale</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <select required value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} style={inputStyle}>
              <option value="">Select Customer</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select required value={form.product_id} onChange={(e) => handleProductChange(e.target.value)} style={inputStyle}>
              <option value="">Select Product</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
            </select>
            <div>
              <input required type="number" min="1" max={selectedProduct?.quantity || 999} placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} style={inputStyle} />
              {selectedProduct && (
                <div style={{ fontSize: "12px", color: "#088395", marginTop: "4px" }}>
                  Price: ৳{selectedProduct.price} | Stock: {selectedProduct.quantity}
                </div>
              )}
            </div>
            <input placeholder="Note (optional)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} style={inputStyle} />
          </div>
          {selectedProduct && form.quantity && (
            <div style={{ background: "#EBF4F6", borderRadius: "10px", padding: "12px 16px", marginBottom: "12px", fontSize: "14px" }}>
              <strong style={{ color: "#09637E" }}>Total: ৳{(selectedProduct.price * form.quantity).toLocaleString()}</strong>
              <span style={{ color: "#7AB2B2", marginLeft: "16px" }}>{form.quantity} × ৳{selectedProduct.price}</span>
            </div>
          )}
          <button type="submit" style={{ background: "linear-gradient(135deg, #09637E, #088395)", color: "white", border: "none", borderRadius: "8px", padding: "10px 24px", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>
            Record Sale
          </button>
        </form>
      </div>

      {/* Sales Table */}
      <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(9,99,126,0.08)" }}>
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 style={{ fontWeight: "700", color: "#09637E" }}>Sales History ({filtered.length})</h2>
          <div className="flex gap-2 flex-wrap items-center">
            <div style={{ position: "relative" }}>
              <FiSearch style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#aaa" }} size={14} />
              <input
                placeholder="Search customer or product…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                style={{ paddingLeft: "32px", paddingRight: "14px", paddingTop: "8px", paddingBottom: "8px", fontSize: "13px", border: "1.5px solid #c8e0e6", borderRadius: "8px", outline: "none", width: "220px", color: "#333" }}
              />
            </div>
            <button
              onClick={() => exportCSV(filtered)}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "13px", fontWeight: "600", background: "#e8f5e9", color: "#2e7d32", border: "none", borderRadius: "8px", cursor: "pointer" }}
            >
              <FiDownload size={14} /> Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ background: "#EBF4F6" }}>
                {["#", "Customer", "Product", "Qty", "Unit Price", "Total", "Date", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#088395", fontWeight: "600", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRow cols={8} />
              ) : paginated.length === 0 ? (
                <EmptyState colSpan={8} message={search ? `No sales matching "${search}"` : "No sales recorded yet."} />
              ) : (
                paginated.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #f0f7f8" }}>
                    <td style={{ padding: "12px 14px", color: "#7AB2B2" }}>#{s.id}</td>
                    <td style={{ padding: "12px 14px", fontWeight: "600", color: "#09637E" }}>{s.customer_name}</td>
                    <td style={{ padding: "12px 14px", color: "#555" }}>{s.product_name}</td>
                    <td style={{ padding: "12px 14px", color: "#555" }}>{s.quantity}</td>
                    <td style={{ padding: "12px 14px", color: "#555" }}>৳{s.unit_price}</td>
                    <td style={{ padding: "12px 14px", fontWeight: "700", color: "#088395" }}>৳{parseFloat(s.total_price).toLocaleString()}</td>
                    <td style={{ padding: "12px 14px", color: "#999", fontSize: "12px" }}>{formatDate(s.sale_date)}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <button onClick={() => printInvoice(s)} style={{ background: "#e3f2fd", color: "#1565c0", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: "pointer", fontSize: "12px", fontWeight: "600", marginRight: "6px" }} title="Print Invoice">
                        <FiPrinter size={12} style={{ display: "inline", marginRight: "4px" }} />Print
                      </button>
                      <button onClick={() => setConfirm({ open: true, id: s.id })} style={{ background: "#ffebee", color: "#c62828", border: "none", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
