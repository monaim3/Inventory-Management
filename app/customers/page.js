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

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await fetch("/api/customers").then((r) => r.json());
    setCustomers(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editId) {
      await fetch(`/api/customers/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditId(null);
      toast.success("Customer updated successfully!");
    } else {
      await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      toast.success("Customer added successfully!");
    }
    setForm({ name: "", email: "", phone: "", address: "" });
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this customer?")) return;
    await fetch(`/api/customers/${id}`, { method: "DELETE" });
    load();
    toast.error("Customer deleted!");
  }

  function handleEdit(c) {
    setEditId(c.id);
    setForm({
      name: c.name,
      email: c.email || "",
      phone: c.phone || "",
      address: c.address || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
        Customers
      </h1>
      <p style={{ color: "#7AB2B2", marginBottom: "28px", fontSize: "14px" }}>
        Manage your customer information
      </p>

      {/* Form */}
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
          {editId ? "✏️ Edit Customer" : "➕ Add Customer"}
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
            <input
              required
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
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
              }}
            >
              {editId ? "Update Customer" : "Add Customer"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ name: "", email: "", phone: "", address: "" });
                }}
                style={{
                  background: "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
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
          All Customers ({customers.length})
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
              {["Name", "Email", "Phone", "Address", "Actions"].map((h) => (
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
            {customers.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #f0f7f8" }}>
                <td
                  style={{
                    padding: "12px 14px",
                    fontWeight: "600",
                    color: "#09637E",
                  }}
                >
                  {c.name}
                </td>
                <td style={{ padding: "12px 14px", color: "#555" }}>
                  {c.email || "—"}
                </td>
                <td style={{ padding: "12px 14px", color: "#555" }}>
                  {c.phone || "—"}
                </td>
                <td style={{ padding: "12px 14px", color: "#555" }}>
                  {c.address || "—"}
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <button
                    onClick={() => handleEdit(c)}
                    style={{
                      background: "#fff3e0",
                      color: "#e65100",
                      border: "none",
                      borderRadius: "6px",
                      padding: "5px 12px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600",
                      marginRight: "6px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
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
