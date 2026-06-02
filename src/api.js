const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.detail
      ? Array.isArray(data.detail)
        ? data.detail.map((d) => d.msg).join(", ")
        : data.detail
      : "Request failed";
    throw new Error(message);
  }
  return data;
}

export const api = {
  // Products
  getProducts: () => request("/products"),
  createProduct: (body) =>
    request("/products", { method: "POST", body: JSON.stringify(body) }),
  updateProduct: (id, body) =>
    request(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  // Customers
  getCustomers: () => request("/customers"),
  createCustomer: (body) =>
    request("/customers", { method: "POST", body: JSON.stringify(body) }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: "DELETE" }),

  // Orders
  getOrders: () => request("/orders"),
  getOrder: (id) => request(`/orders/${id}`),
  createOrder: (body) =>
    request("/orders", { method: "POST", body: JSON.stringify(body) }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: "DELETE" }),

  // Dashboard
  getDashboard: () => request("/dashboard"),
};
