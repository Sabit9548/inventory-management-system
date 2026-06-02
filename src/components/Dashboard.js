import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Dashboard({ notify }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .getDashboard()
      .then(setStats)
      .catch((e) => notify(e.message, "error"));
  }, [notify]);

  const cards = [
    { label: "Total Products", value: stats?.total_products, icon: "📦" },
    { label: "Total Customers", value: stats?.total_customers, icon: "👥" },
    { label: "Total Orders", value: stats?.total_orders, icon: "🧾" },
    { label: "Low Stock Products", value: stats?.low_stock_products, icon: "⚠️" },
  ];

  return (
    <section>
      <h2>Dashboard</h2>
      <div className="cards">
        {cards.map((c) => (
          <div className="card" key={c.label}>
            <div className="card-icon">{c.icon}</div>
            <div className="card-value">{c.value ?? "—"}</div>
            <div className="card-label">{c.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
