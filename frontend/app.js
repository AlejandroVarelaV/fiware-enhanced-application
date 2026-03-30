const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:5000' : '';

const views = document.querySelectorAll('.view');
const navLinks = document.querySelectorAll('.nav-link');

const productsFeedback = document.getElementById('products-feedback');
const productsTableBody = document.getElementById('products-table-body');
const createProductButton = document.getElementById('create-product-btn');
const refreshProductsButton = document.getElementById('refresh-products-btn');

const productFormSection = document.getElementById('product-form-section');
const productFormTitle = document.getElementById('product-form-title');
const productForm = document.getElementById('product-form');
const cancelProductButton = document.getElementById('cancel-product-btn');

const productIdInput = document.getElementById('product-id');
const productImageInput = document.getElementById('product-image');
const productNameInput = document.getElementById('product-name');
const productColorInput = document.getElementById('product-color');
const productSizeInput = document.getElementById('product-size');
const productPriceInput = document.getElementById('product-price');

let productsCache = [];

function showView(viewId) {
  views.forEach((view) => {
    if (view.id === viewId) {
      view.classList.remove('hidden');
    } else {
      view.classList.add('hidden');
    }
  });

  navLinks.forEach((link) => {
    if (link.dataset.view === viewId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  if (viewId === 'products-view') {
    loadProducts();
  }
}

function setProductsFeedback(message, isError = false) {
  productsFeedback.textContent = message;
  productsFeedback.style.color = isError ? 'red' : 'inherit';
}

async function loadProducts() {
  setProductsFeedback('Loading products...');

  try {
    const response = await fetch(`${API_BASE}/api/products`);
    if (!response.ok) {
      throw new Error(`Failed to load products (${response.status})`);
    }

    productsCache = await response.json();
    renderProductsTable(productsCache);
    setProductsFeedback(`Loaded ${productsCache.length} product(s).`);
  } catch (error) {
    renderProductsTable([]);
    setProductsFeedback(error.message, true);
  }
}

function renderProductsTable(products) {
  while (productsTableBody.firstChild) {
    productsTableBody.removeChild(productsTableBody.firstChild);
  }

  if (!Array.isArray(products) || products.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.textContent = 'No products found.';
    row.appendChild(cell);
    productsTableBody.appendChild(row);
    return;
  }

  products.forEach((product) => {
    const row = document.createElement('tr');

    const imageCell = document.createElement('td');
    const image = document.createElement('img');
    image.className = 'product-image';
    image.src = product.image || '';
    image.alt = product.name || 'product image';
    imageCell.appendChild(image);

    const nameCell = document.createElement('td');
    nameCell.textContent = product.name || '';

    const colorCell = document.createElement('td');
    colorCell.textContent = product.color || '';

    const sizeCell = document.createElement('td');
    sizeCell.textContent = product.size || '';

    const priceCell = document.createElement('td');
    priceCell.textContent = String(product.price ?? '');

    const actionsCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => openEditProductForm(product.id));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteProduct(product.id));

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    row.appendChild(imageCell);
    row.appendChild(nameCell);
    row.appendChild(colorCell);
    row.appendChild(sizeCell);
    row.appendChild(priceCell);
    row.appendChild(actionsCell);

    productsTableBody.appendChild(row);
  });
}

function openCreateProductForm() {
  productFormTitle.textContent = 'Create Product';
  productIdInput.value = '';
  productImageInput.value = '';
  productNameInput.value = '';
  productColorInput.value = '';
  productSizeInput.value = '';
  productPriceInput.value = '';
  productFormSection.classList.remove('hidden');
}

function openEditProductForm(productId) {
  const product = productsCache.find((item) => item.id === productId);
  if (!product) {
    setProductsFeedback('Selected product no longer exists.', true);
    return;
  }

  productFormTitle.textContent = 'Edit Product';
  productIdInput.value = product.id || '';
  productImageInput.value = product.image || '';
  productNameInput.value = product.name || '';
  productColorInput.value = product.color || '';
  productSizeInput.value = product.size || '';
  productPriceInput.value = String(product.price ?? '');
  productFormSection.classList.remove('hidden');
}

function closeProductForm() {
  productFormSection.classList.add('hidden');
}

function getProductPayloadFromForm() {
  return {
    image: productImageInput.value.trim(),
    name: productNameInput.value.trim(),
    color: productColorInput.value.trim(),
    size: productSizeInput.value.trim(),
    price: Number(productPriceInput.value),
  };
}

async function saveProduct(event) {
  event.preventDefault();

  const productId = productIdInput.value.trim();
  const payload = getProductPayloadFromForm();

  try {
    let response;

    if (productId) {
      response = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      response = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed (${response.status})`);
    }

    closeProductForm();
    await loadProducts();
    setProductsFeedback(productId ? 'Product updated.' : 'Product created.');
  } catch (error) {
    setProductsFeedback(error.message, true);
  }
}

async function deleteProduct(productId) {
  if (!window.confirm('Delete this product?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/products/${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Delete failed (${response.status})`);
    }

    await loadProducts();
    setProductsFeedback('Product deleted.');
  } catch (error) {
    setProductsFeedback(error.message, true);
  }
}

navLinks.forEach((button) => {
  button.addEventListener('click', () => showView(button.dataset.view));
});

createProductButton.addEventListener('click', openCreateProductForm);
refreshProductsButton.addEventListener('click', loadProducts);
cancelProductButton.addEventListener('click', closeProductForm);
productForm.addEventListener('submit', saveProduct);

showView('home-view');
