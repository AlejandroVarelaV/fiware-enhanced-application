const API_BASE = "http://localhost:5000";

const viewIds = ["home", "products", "stores", "employees"];

const statusEl = document.getElementById("status");
const productsListEl = document.getElementById("products-list");
const storesListEl = document.getElementById("stores-list");
const employeesListEl = document.getElementById("employees-list");
const employeesNoteEl = document.getElementById("employees-note");

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.className = isError ? "status error" : "status ok";
}

function clearElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const noContent = response.status === 204;
  const data = noContent ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const msg = data && data.message ? data.message : `Request failed with status ${response.status}`;
    throw new Error(msg);
  }

  return data;
}

function showView(viewName) {
  for (const id of viewIds) {
    const section = document.getElementById(`${id}-view`);
    const button = document.querySelector(`.nav-btn[data-view="${id}"]`);
    const active = id === viewName;
    section.classList.toggle("active", active);
    button.classList.toggle("active", active);
  }
}

function productToText(product) {
  return `${product.id || "(no id)"} | ${product.name || "Unnamed"} | price: ${product.price}`;
}

function storeToText(store) {
  return `${store.id || "(no id)"} | ${store.name || "Unnamed"} | country: ${store.countryCode || "n/a"}`;
}

function employeeToText(employee) {
  return `${employee.id || "(no id)"} | ${employee.name || "Unnamed"} | email: ${employee.email || "n/a"}`;
}

function renderEntityList(container, items, formatFn) {
  clearElement(container);

  if (!Array.isArray(items) || items.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No records found.";
    container.appendChild(li);
    return;
  }

  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = formatFn(item);
    container.appendChild(li);
  }
}

async function loadProducts() {
  const products = await apiRequest("/api/products");
  renderEntityList(productsListEl, products, productToText);
}

async function loadStores() {
  const stores = await apiRequest("/api/stores");
  renderEntityList(storesListEl, stores, storeToText);
}

async function loadEmployees() {
  try {
    const employees = await apiRequest("/api/employees");
    employeesNoteEl.textContent = "Showing data from /api/employees.";
    renderEntityList(employeesListEl, employees, employeeToText);
  } catch (error) {
    clearElement(employeesListEl);
    const li = document.createElement("li");
    li.textContent = "Employees endpoint unavailable in this backend build.";
    employeesListEl.appendChild(li);
    employeesNoteEl.textContent = "Employee endpoint may be unavailable in current backend build.";
    throw error;
  }
}

function getCreateProductPayload(formData) {
  return {
    name: formData.get("name"),
    image: formData.get("image"),
    size: formData.get("size"),
    price: Number(formData.get("price")),
    color: formData.get("color"),
  };
}

function getPatchPayload(formData) {
  const fields = ["name", "image", "size", "price", "color"];
  const patch = {};

  for (const field of fields) {
    const value = formData.get(field);
    if (value !== null && String(value).trim() !== "") {
      patch[field] = field === "price" ? Number(value) : value;
    }
  }

  return patch;
}

function bindEvents() {
  for (const btn of document.querySelectorAll(".nav-btn")) {
    btn.addEventListener("click", () => {
      const viewName = btn.dataset.view;
      showView(viewName);
    });
  }

  document.getElementById("refresh-products-btn").addEventListener("click", async () => {
    try {
      await loadProducts();
      setStatus("Products refreshed.");
    } catch (error) {
      setStatus(error.message, true);
    }
  });

  document.getElementById("refresh-stores-btn").addEventListener("click", async () => {
    try {
      await loadStores();
      setStatus("Stores refreshed.");
    } catch (error) {
      setStatus(error.message, true);
    }
  });

  document.getElementById("refresh-employees-btn").addEventListener("click", async () => {
    try {
      await loadEmployees();
      setStatus("Employees refreshed.");
    } catch (error) {
      setStatus(error.message, true);
    }
  });

  document.getElementById("create-product-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const payload = getCreateProductPayload(new FormData(event.target));
      await apiRequest("/api/products", { method: "POST", body: JSON.stringify(payload) });
      event.target.reset();
      await loadProducts();
      setStatus("Product created successfully.");
    } catch (error) {
      setStatus(error.message, true);
    }
  });

  document.getElementById("update-product-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.target);
      const id = String(formData.get("id") || "").trim();
      const patch = getPatchPayload(formData);

      if (!id) {
        throw new Error("Product ID is required.");
      }
      if (Object.keys(patch).length === 0) {
        throw new Error("At least one field is required to update.");
      }

      await apiRequest(`/api/products/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      event.target.reset();
      await loadProducts();
      setStatus("Product updated successfully.");
    } catch (error) {
      setStatus(error.message, true);
    }
  });

  document.getElementById("delete-product-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.target);
      const id = String(formData.get("id") || "").trim();
      if (!id) {
        throw new Error("Product ID is required.");
      }

      await apiRequest(`/api/products/${encodeURIComponent(id)}`, { method: "DELETE" });
      event.target.reset();
      await loadProducts();
      setStatus("Product deleted successfully.");
    } catch (error) {
      setStatus(error.message, true);
    }
  });
}

async function bootstrap() {
  bindEvents();

  try {
    await loadProducts();
    await loadStores();
    setStatus("Frontend ready.");
  } catch (error) {
    setStatus(error.message, true);
  }
}

bootstrap();
