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
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await fetch("/api/categories").then((r) => r.json());
    setCategories(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editId) {
      await fetch(`/api/categories/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditId(null);
      toast.success("Category updated successfully!");
    } else {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      toast.success("Category added successfully!");
    }
    setForm({ name: "", description: "" });
    load();
  }

  async function handleEdit(c) {
    setEditId(c.id);
    setForm({ name: c.name, description: c.description || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    load();
    toast.error("Category deleted!");
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
        Categories
      </h1>
      <p style={{ color: "#7AB2B2", marginBottom: "28px", fontSize: "14px" }}>
        Organize your products by category
      </p>

      {/* Form Card */}
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
          {editId ? "✏️ Edit Category" : "➕ Add Category"}
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr auto",
            gap: "12px",
            alignItems: "end",
          }}
        >
          <input
            required
            placeholder="Category Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={inputStyle}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #09637E, #088395)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {editId ? "Update" : "Add"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ name: "", description: "" });
                }}
                style={{
                  background: "#e0e0e0",
                  color: "#555",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table Card */}
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
          All Categories ({categories.length})
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
              {["ID", "Name", "Description", "Actions"].map((h) => (
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
            {categories.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #f0f7f8" }}>
                <td style={{ padding: "12px 14px", color: "#7AB2B2" }}>
                  #{c.id}
                </td>
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
                  {c.description || "—"}
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
