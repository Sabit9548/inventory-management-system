import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Orders({ notify }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: 1 }]);
  const [details, setDetails] = useState(null);

  const load = () => {
    api.getOrders().then(setOrders).catch((e) => notify(e.message, "error"));
    api.getProducts().then(setProducts).catch(() => {});
    api.getCustomers().then(setCustomers).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const productName = (id) => products.find((p) => p.id === id)?.name || `#${id}`;
  const customerName = (id) =>
    customers.find((c) => c.id === id)?.full_name || `#${id}`;

  const updateItem = (idx, field, value) => {
    const next = [...items];
    next[idx][field] = value;
    setItems(next);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!customerId) return notify("Select a customer", "error");
    const cleaned = items
      .filter((i) => i.product_id)
      .map((i) => ({ product_id: Number(i.product_id), quantity: Number(i.quantity) }));
    if (cleaned.length === 0) return notify("Add at least one product", "error");
    if (cleaned.some((i) => i.quantity <= 0))
      return notify("Quantities must be greater than 0", "error");
    try {
      await api.createOrder({ customer_id: Number(customerId), items: cleaned });
      notify("Order created");
      setCustomerId("");
      setItems([{ product_id: "", quantity: 1 }]);
      load();
    } catch (err) {
      notify(err.message, "error");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete/cancel this order?")) return;
    try {
      await api.deleteOrder(id);
      notify("Order deleted");
      load();
    } catch (err) {
      notify(err.message, "error");
    }
  };

  return (
    <section>
      <h2>Orders</h2>
      <form className="form order-form" onSubmit={submit}>
        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
          <option value="">Select customer…</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name}
            </option>
          ))}
        </select>

        {items.map((item, idx) => (
          <div className="order-line" key={idx}>
            <select
              value={item.product_id}
              onChange={(e) => updateItem(idx, "product_id", e.target.value)}
            >
              <option value="">Select product…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (stock: {p.quantity})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateItem(idx, "quantity", e.target.value)}
            />
            {items.length > 1 && (
              <button
                type="button"
                className="link danger"
                onClick={() => setItems(items.filter((_, i) => i !== idx))}
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="secondary"
          onClick={() => setItems([...items, { product_id: "", quantity: 1 }])}
        >
          + Add item
        </button>
        <button type="submit">Create Order</button>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{customerName(o.customer_id)}</td>
                <td>{o.items.length}</td>
                <td>${o.total_amount.toFixed(2)}</td>
                <td>{new Date(o.created_at).toLocaleString()}</td>
                <td className="actions">
                  <button className="link" onClick={() => setDetails(o)}>
                    View
                  </button>
                  <button className="link danger" onClick={() => remove(o.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="empty">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {details && (
        <div className="modal" onClick={() => setDetails(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Order #{details.id}</h3>
            <p>
              <strong>Customer:</strong> {customerName(details.customer_id)}
            </p>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {details.items.map((it, i) => (
                  <tr key={i}>
                    <td>{productName(it.product_id)}</td>
                    <td>{it.quantity}</td>
                    <td>${it.unit_price.toFixed(2)}</td>
                    <td>${(it.unit_price * it.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="total">Total: ${details.total_amount.toFixed(2)}</p>
            <button className="secondary" onClick={() => setDetails(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
