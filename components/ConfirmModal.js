"use client";

import { FiAlertTriangle } from "react-icons/fi";

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 300,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "36px 32px 28px",
          width: "400px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "68px",
            height: "68px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #fff0f0, #ffe0e0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 4px 16px rgba(220,53,69,0.15)",
          }}
        >
          <FiAlertTriangle size={30} color="#e53935" />
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "800",
            color: "#1a1a2e",
            marginBottom: "10px",
          }}
        >
          Delete Confirmation
        </h3>

        {/* Message */}
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            lineHeight: "1.6",
            marginBottom: "28px",
          }}
        >
          {message}
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "12px",
              background: "#f5f5f5",
              color: "#555",
              border: "none",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #e53935, #c62828)",
              color: "white",
              border: "none",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(229,57,53,0.35)",
            }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
