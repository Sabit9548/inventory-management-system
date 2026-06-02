import React, { useEffect, useState } from "react";
import { api } from "../api";

const EMPTY = { name: "", sku: "", price: "", quantity: "" };

export default function Products({ notify }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);

  const load = () =>
    api.getProducts().then(setProducts).catch((e) => notify(e.message, "error"));

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const validate = () => {
    if (!form.name.trim() || !form.sku.trim()) return "Name and SKU are required";
    if (form.price === "" || Number(form.price) < 0) return "Price must be >= 0";
    if (form.quantity === "" || Number(form.quantity) < 0)
      return "Quantity must be >= 0";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return notify(error, "error");
    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
    };
    try {
      if (editingId) {
        await api.updateProduct(editingId, payload);
        notify("Product updated");
      } else {
        await api.createProduct(payload);
        notify("Product created");
      }
      setForm(EMPTY);
      setEditingId(null);
      load();
    } catch (err) {
      notify(err.message, "error");
    }
  };

  const edit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, sku: p.sku, price: p.price, quantity: p.quantity });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.deleteProduct(id);
      notify("Product deleted");
      load();
    } catch (err) {
      notify(err.message, "error");
    }
  };

  return (
    <section>
      <h2>Products</h2>
      <form className="form" onSubmit={submit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="SKU"
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && (
          <button
            type="button"
            className="secondary"
            onClick={() => {
              setEditingId(null);
              setForm(EMPTY);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className={p.quantity < 10 ? "low-stock" : ""}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.quantity}</td>
                <td className="actions">
                  <button className="link" onClick={() => edit(p)}>
                    Edit
                  </button>
                  <button className="link danger" onClick={() => remove(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="empty">
                  No products yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
