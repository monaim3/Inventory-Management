"use client";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    customer_id: "",
    product_id: "",
    quantity: "",
    note: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [s, p, c] = await Promise.all([
      fetch("/api/sales").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/customers").then((r) => r.json()),
    ]);
    setSales(s);
    setProducts(p);
    setCustomers(c);
  }

  function handleProductChange(productId) {
    setForm({ ...form, product_id: productId, quantity: "" });
    const found = products.find((p) => p.id == productId);
    setSelectedProduct(found || null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
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
  }

  async function handleDelete(id) {
    if (!confirm("Delete this sale?")) return;
    await fetch(`/api/sales/${id}`, { method: "DELETE" });
    loadAll();
    toast.error("Sale deleted!");
  }

  const totalRevenue = sales.reduce(
    (sum, s) => sum + parseFloat(s.total_price),
    0,
  );

  return (
    <div>
      <ToastContainer position="top-right" autoClose={1500} />
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "800",
          color: "#09637E",
          marginBottom: "8px",
        }}
      >
        Sales
      </h1>
      <p style={{ color: "#7AB2B2", marginBottom: "28px", fontSize: "14px" }}>
        Record and manage product sales
      </p>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 2px 12px rgba(9,99,126,0.08)",
            borderTop: "4px solid #09637E",
          }}
        >
          <div style={{ fontSize: "28px" }}>🧾</div>
          <div
            style={{ fontSize: "28px", fontWeight: "800", color: "#09637E" }}
          >
            {sales.length}
          </div>
          <div style={{ fontSize: "13px", color: "#7AB2B2" }}>Total Sales</div>
        </div>
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 2px 12px rgba(9,99,126,0.08)",
            borderTop: "4px solid #088395",
          }}
        >
          <div style={{ fontSize: "28px" }}>💰</div>
          <div
            style={{ fontSize: "24px", fontWeight: "800", color: "#088395" }}
          >
            ৳{totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: "13px", color: "#7AB2B2" }}>
            Total Revenue
          </div>
        </div>
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 2px 12px rgba(9,99,126,0.08)",
            borderTop: "4px solid #7AB2B2",
          }}
        >
          <div style={{ fontSize: "28px" }}>👥</div>
          <div
            style={{ fontSize: "28px", fontWeight: "800", color: "#7AB2B2" }}
          >
            {customers.length}
          </div>
          <div style={{ fontSize: "13px", color: "#7AB2B2" }}>Customers</div>
        </div>
      </div>

      {/* New Sale Form */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 2px 12px rgba(9,99,126,0.08)",
          borderTop: "4px solid #088395",
        }}
      >
        <h2
          style={{ fontWeight: "700", color: "#09637E", marginBottom: "16px" }}
        >
          🧾 New Sale
        </h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <select
              required
              value={form.customer_id}
              onChange={(e) =>
                setForm({ ...form, customer_id: e.target.value })
              }
              style={inputStyle}
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              required
              value={form.product_id}
              onChange={(e) => handleProductChange(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.quantity})
                </option>
              ))}
            </select>

            <div>
              <input
                required
                type="number"
                min="1"
                max={selectedProduct?.quantity || 999}
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                style={inputStyle}
              />
              {selectedProduct && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#088395",
                    marginTop: "4px",
                  }}
                >
                  Price: ৳{selectedProduct.price} | Stock available:{" "}
                  {selectedProduct.quantity}
                </div>
              )}
            </div>

            <input
              placeholder="Note (optional)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              style={inputStyle}
            />
          </div>

          {/* Preview */}
          {selectedProduct && form.quantity && (
            <div
              style={{
                background: "#EBF4F6",
                borderRadius: "10px",
                padding: "12px 16px",
                marginBottom: "12px",
                fontSize: "14px",
              }}
            >
              <strong style={{ color: "#09637E" }}>
                Total: ৳
                {(selectedProduct.price * form.quantity).toLocaleString()}
              </strong>
              <span style={{ color: "#7AB2B2", marginLeft: "16px" }}>
                {form.quantity} × ৳{selectedProduct.price}
              </span>
            </div>
          )}

          <button
            type="submit"
            style={{
              background: "linear-gradient(135deg, #09637E, #088395)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 24px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Record Sale
          </button>
        </form>
      </div>

      {/* Sales Table */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 2px 12px rgba(9,99,126,0.08)",
        }}
      >
        <h2
          style={{ fontWeight: "700", color: "#09637E", marginBottom: "16px" }}
        >
          Sales History ({sales.length})
        </h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ background: "#EBF4F6" }}>
              {[
                "#",
                "Customer",
                "Product",
                "Qty",
                "Unit Price",
                "Total",
                "Date",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    color: "#088395",
                    fontWeight: "600",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sales.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #f0f7f8" }}>
                <td style={{ padding: "12px 14px", color: "#7AB2B2" }}>
                  #{s.id}
                </td>
                <td
                  style={{
                    padding: "12px 14px",
                    fontWeight: "600",
                    color: "#09637E",
                  }}
                >
                  {s.customer_name}
                </td>
                <td style={{ padding: "12px 14px", color: "#555" }}>
                  {s.product_name}
                </td>
                <td style={{ padding: "12px 14px", color: "#555" }}>
                  {s.quantity}
                </td>
                <td style={{ padding: "12px 14px", color: "#555" }}>
                  ৳{s.unit_price}
                </td>
                <td
                  style={{
                    padding: "12px 14px",
                    fontWeight: "700",
                    color: "#088395",
                  }}
                >
                  ৳{parseFloat(s.total_price).toLocaleString()}
                </td>
                <td
                  style={{
                    padding: "12px 14px",
                    color: "#999",
                    fontSize: "12px",
                  }}
                >
                  {new Date(s.sale_date).toLocaleDateString("en-BD")}
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <button
                    onClick={() => handleDelete(s.id)}
                    style={{
                      background: "#ffebee",
                      color: "#c62828",
                      border: "none",
                      borderRadius: "6px",
                      padding: "5px 12px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
