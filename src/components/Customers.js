import React, { useEffect, useState } from "react";
import { api } from "../api";

const EMPTY = { full_name: "", email: "", phone: "" };

export default function Customers({ notify }) {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(EMPTY);

  const load = () =>
    api.getCustomers().then(setCustomers).catch((e) => notify(e.message, "error"));

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const validate = () => {
    if (!form.full_name.trim()) return "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "A valid email is required";
    if (!form.phone.trim()) return "Phone is required";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return notify(error, "error");
    try {
      await api.createCustomer({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      notify("Customer created");
      setForm(EMPTY);
      load();
    } catch (err) {
      notify(err.message, "error");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await api.deleteCustomer(id);
      notify("Customer deleted");
      load();
    } catch (err) {
      notify(err.message, "error");
    }
  };

  return (
    <section>
      <h2>Customers</h2>
      <form className="form" onSubmit={submit}>
        <input
          placeholder="Full name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.full_name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td className="actions">
                  <button className="link danger" onClick={() => remove(c.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="5" className="empty">
                  No customers yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
