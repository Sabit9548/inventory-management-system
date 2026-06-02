import React, { useCallback, useState } from "react";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Customers from "./components/Customers";
import Orders from "./components/Orders";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "products", label: "Products" },
  { key: "customers", label: "Customers" },
  { key: "orders", label: "Orders" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <h1>📦 Inventory & Orders</h1>
        <nav className="tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={tab === t.key ? "tab active" : "tab"}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <main className="content">
        {tab === "dashboard" && <Dashboard notify={notify} />}
        {tab === "products" && <Products notify={notify} />}
        {tab === "customers" && <Customers notify={notify} />}
        {tab === "orders" && <Orders notify={notify} />}
      </main>
    </div>
  );
}
