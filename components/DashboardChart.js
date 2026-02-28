"use client";

import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

export default function DashboardChart() {
  const [data, setData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetch("/api/sales")
      .then((r) => r.json())
      .then((sales) => {
        if (!Array.isArray(sales)) return;

        // Always show last 6 months (fill 0 for months with no sales)
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
          months.push({ month: key, revenue: 0 });
        }

        let total = 0;
        sales.forEach((s) => {
          const d = new Date(s.sale_date);
          const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
          const entry = months.find((m) => m.month === key);
          const amount = parseFloat(s.total_price || 0);
          if (entry) entry.revenue += amount;
          total += amount;
        });

        setTotalRevenue(total);
        setData(months);
      })
      .catch(() => {});
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: "white", border: "1px solid #e0eef2", borderRadius: "12px", padding: "12px 16px", boxShadow: "0 4px 20px rgba(9,99,126,0.12)", fontSize: "13px" }}>
          <p style={{ color: "#7AB2B2", marginBottom: "4px", fontWeight: "600" }}>{label}</p>
          <p style={{ color: "#09637E", fontWeight: "800", fontSize: "15px" }}>
            ৳{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(9,99,126,0.08)", marginBottom: "28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#09637E", marginBottom: "2px" }}>
            Monthly Sales Revenue
          </h2>
          <p style={{ fontSize: "12px", color: "#7AB2B2" }}>Revenue trend over time</p>
        </div>
        <div style={{ background: "linear-gradient(135deg, #09637E, #0d8fad)", borderRadius: "10px", padding: "6px 14px", fontSize: "12px", fontWeight: "600", color: "white" }}>
          ৳{totalRevenue.toLocaleString()} Total
        </div>
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#09637E" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#09637E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f7f8" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#7AB2B2" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#7AB2B2" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `৳${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#09637E"
            strokeWidth={2.5}
            fill="url(#revenueGradient)"
            dot={{ fill: "#09637E", strokeWidth: 2, r: 4, stroke: "white" }}
            activeDot={{ r: 6, fill: "#09637E", stroke: "white", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
