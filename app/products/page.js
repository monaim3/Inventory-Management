"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiSearch } from "react-icons/fi";
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

const btnPrimary = {
  background: "linear-gradient(135deg, #09637E, #088395)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "10px 20px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    category_id: "",
    supplier_id: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [p, c, s] = await Promise.all([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()),
        fetch("/api/suppliers").then((r) => r.json()),
      ]);
      setProducts(p);
      setCategories(c);
      setSuppliers(s);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editId) {
        await fetch(`/api/products/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setEditId(null);
        toast.success("Product updated successfully!");
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Product added successfully!");
      }
      setForm({
        name: "",
        price: "",
        quantity: "",
        category_id: "",
        supplier_id: "",
      });
      loadAll();
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function confirmDelete() {
    try {
      await fetch(`/api/products/${confirm.id}`, { method: "DELETE" });
      toast.error("Product deleted!");
      setConfirm({ open: false, id: null });
      loadAll();
    } catch {
      toast.error("Delete failed");
    }
  }

  async function handleEdit(p) {
    try {
      const full = await fetch(`/api/products/${p.id}`).then((r) => r.json());
      setEditId(full.id);
      setForm({
        name: full.name,
        price: full.price,
        quantity: full.quantity,
        category_id: String(full.category_id),
        supplier_id: String(full.supplier_id),
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Failed to load product");
    }
  }

  const filtered = products.filter((p) =>
    [p.name, p.category_name, p.supplier_name].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase()),
    ),
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={1500} />
      <ConfirmModal
        isOpen={confirm.open}
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ open: false, id: null })}
      />

      <h1
        style={{
          fontSize: "24px",
          fontWeight: "800",
          color: "#09637E",
          marginBottom: "8px",
        }}
      >
        Products
      </h1>
      <p style={{ color: "black", marginBottom: "28px", fontSize: "14px" }}>
        Manage your product inventory
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
          {editId ? "✏️ Edit Product" : "➕ Add New Product"}
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
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
            <input
              required
              type="number"
              placeholder="Price (৳)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              style={inputStyle}
            />
            <input
              required
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              style={inputStyle}
            />
            <select
              required
              value={String(form.category_id)}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
              style={inputStyle}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              required
              value={String(form.supplier_id)}
              onChange={(e) =>
                setForm({ ...form, supplier_id: e.target.value })
              }
              style={inputStyle}
            >
              <option value="">Select Supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name}
                </option>
              ))}
            </select>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button type="submit" style={btnPrimary}>
                {editId ? "Update Product" : "Add Product"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setForm({
                      name: "",
                      price: "",
                      quantity: "",
                      category_id: "",
                      supplier_id: "",
                    });
                  }}
                  style={{ ...btnPrimary, background: "#ccc" }}
                >
                  Cancel
                </button>
              )}
            </div>
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
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 style={{ fontWeight: "700", color: "#09637E" }}>
            All Products ({filtered.length})
          </h2>
          <div style={{ position: "relative" }}>
            <FiSearch
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#aaa",
              }}
              size={14}
            />
            <input
              placeholder="Search by name, category, supplier…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{
                paddingLeft: "32px",
                paddingRight: "14px",
                paddingTop: "8px",
                paddingBottom: "8px",
                fontSize: "13px",
                border: "1.5px solid #c8e0e6",
                borderRadius: "8px",
                outline: "none",
                width: "240px",
                color: "#333",
              }}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
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
                  "Name",
                  "Price",
                  "Quantity",
                  "Category",
                  "Supplier",
                  "Actions",
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
              {loading ? (
                <SkeletonRow cols={6} />
              ) : paginated.length === 0 ? (
                <EmptyState
                  colSpan={6}
                  message={
                    search
                      ? `No products matching "${search}"`
                      : "No products yet. Add your first product!"
                  }
                />
              ) : (
                paginated.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f0f7f8" }}>
                    <td
                      style={{
                        padding: "12px 14px",
                        fontWeight: "600",
                        color: "#09637E",
                      }}
                    >
                      {p.name}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#088395",
                        fontWeight: "600",
                      }}
                    >
                      ৳{p.price}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          background: p.quantity < 10 ? "#ffebee" : "#e8f5e9",
                          color: p.quantity < 10 ? "#e53935" : "#2e7d32",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {p.quantity}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", color: "#555" }}>
                      {p.category_name}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#555" }}>
                      {p.supplier_name}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <button
                        onClick={() => handleEdit(p)}
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
                        onClick={() => setConfirm({ open: true, id: p.id })}
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
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
