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

const storesFeedback = document.getElementById('stores-feedback');
const storesTableBody = document.getElementById('stores-table-body');
const createStoreButton = document.getElementById('create-store-btn');
const refreshStoresButton = document.getElementById('refresh-stores-btn');

const storeFormSection = document.getElementById('store-form-section');
const storeFormTitle = document.getElementById('store-form-title');
const storeForm = document.getElementById('store-form');
const cancelStoreButton = document.getElementById('cancel-store-btn');

const storeIdInput = document.getElementById('store-id');
const storeImageInput = document.getElementById('store-image');
const storeNameInput = document.getElementById('store-name');
const storeCountryCodeInput = document.getElementById('store-country-code');
const storeTemperatureInput = document.getElementById('store-temperature');
const storeRelativeHumidityInput = document.getElementById('store-relative-humidity');
const storeAddressStreetInput = document.getElementById('store-address-street');
const storeAddressCityInput = document.getElementById('store-address-city');
const storeAddressZipInput = document.getElementById('store-address-zip');
const storeLocationLngInput = document.getElementById('store-location-lng');
const storeLocationLatInput = document.getElementById('store-location-lat');
const storeUrlInput = document.getElementById('store-url');
const storeTelephoneInput = document.getElementById('store-telephone');
const storeCapacityInput = document.getElementById('store-capacity');
const storeDescriptionInput = document.getElementById('store-description');

const employeesFeedback = document.getElementById('employees-feedback');
const employeesTableBody = document.getElementById('employees-table-body');
const createEmployeeButton = document.getElementById('create-employee-btn');
const refreshEmployeesButton = document.getElementById('refresh-employees-btn');

const employeeFormSection = document.getElementById('employee-form-section');
const employeeFormTitle = document.getElementById('employee-form-title');
const employeeForm = document.getElementById('employee-form');
const cancelEmployeeButton = document.getElementById('cancel-employee-btn');

const employeeIdInput = document.getElementById('employee-id');
const employeeImageInput = document.getElementById('employee-image');
const employeeNameInput = document.getElementById('employee-name');
const employeeCategoryInput = document.getElementById('employee-category');
const employeeSkillsInput = document.getElementById('employee-skills');
const employeeEmailInput = document.getElementById('employee-email');
const employeeDateOfContractInput = document.getElementById('employee-date-of-contract');
const employeeUsernameInput = document.getElementById('employee-username');
const employeePasswordInput = document.getElementById('employee-password');
const employeeRefStoreInput = document.getElementById('employee-ref-store');

let productsCache = [];
let storesCache = [];
let employeesCache = [];

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

  if (viewId === 'stores-view') {
    loadStores();
  }

  if (viewId === 'employees-view') {
    loadEmployees();
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

    const imageCell = createImageCell(product.image, product.name);

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

function setStoresFeedback(message, isError = false) {
  storesFeedback.textContent = message;
  storesFeedback.style.color = isError ? 'red' : 'inherit';
}

async function loadStores() {
  setStoresFeedback('Loading stores...');

  try {
    const response = await fetch(`${API_BASE}/api/stores`);
    if (!response.ok) {
      throw new Error(`Failed to load stores (${response.status})`);
    }

    storesCache = await response.json();
    renderStoresTable(storesCache);
    setStoresFeedback(`Loaded ${storesCache.length} store(s).`);
  } catch (error) {
    renderStoresTable([]);
    setStoresFeedback(error.message, true);
  }
}

function renderStoresTable(stores) {
  clearTableBody(storesTableBody);

  if (!Array.isArray(stores) || stores.length === 0) {
    renderEmptyState(storesTableBody, 6, 'No stores found.');
    return;
  }

  stores.forEach((store) => {
    const row = document.createElement('tr');

    const imageCell = createImageCell(store.image, store.name);

    const nameCell = document.createElement('td');
    nameCell.textContent = store.name || '';

    const countryCodeCell = document.createElement('td');
    countryCodeCell.textContent = store.countryCode || '';

    const temperatureCell = document.createElement('td');
    temperatureCell.textContent = String(store.temperature ?? '');

    const relativeHumidityCell = document.createElement('td');
    relativeHumidityCell.textContent = String(store.relativeHumidity ?? '');

    const actionsCell = createActionsCell(
      () => openEditStoreForm(store.id),
      () => deleteStore(store.id),
    );

    row.appendChild(imageCell);
    row.appendChild(nameCell);
    row.appendChild(countryCodeCell);
    row.appendChild(temperatureCell);
    row.appendChild(relativeHumidityCell);
    row.appendChild(actionsCell);

    storesTableBody.appendChild(row);
  });
}

function openCreateStoreForm() {
  storeFormTitle.textContent = 'Create Store';
  storeIdInput.value = '';
  storeImageInput.value = '';
  storeNameInput.value = '';
  storeCountryCodeInput.value = '';
  storeTemperatureInput.value = '';
  storeRelativeHumidityInput.value = '';
  storeAddressStreetInput.value = '';
  storeAddressCityInput.value = '';
  storeAddressZipInput.value = '';
  storeLocationLngInput.value = '';
  storeLocationLatInput.value = '';
  storeUrlInput.value = '';
  storeTelephoneInput.value = '';
  storeCapacityInput.value = '';
  storeDescriptionInput.value = '';
  storeFormSection.classList.remove('hidden');
}

function openEditStoreForm(storeId) {
  const store = storesCache.find((item) => item.id === storeId);
  if (!store) {
    setStoresFeedback('Selected store no longer exists.', true);
    return;
  }

  storeFormTitle.textContent = 'Edit Store';
  storeIdInput.value = store.id || '';
  storeImageInput.value = store.image || '';
  storeNameInput.value = store.name || '';
  storeCountryCodeInput.value = store.countryCode || '';
  storeTemperatureInput.value = String(store.temperature ?? '');
  storeRelativeHumidityInput.value = String(store.relativeHumidity ?? '');
  storeAddressStreetInput.value = store.address?.street || '';
  storeAddressCityInput.value = store.address?.city || '';
  storeAddressZipInput.value = store.address?.zip || '';
  storeLocationLngInput.value = String(store.location?.coordinates?.[0] ?? '');
  storeLocationLatInput.value = String(store.location?.coordinates?.[1] ?? '');
  storeUrlInput.value = store.url || '';
  storeTelephoneInput.value = store.telephone || '';
  storeCapacityInput.value = String(store.capacity ?? '');
  storeDescriptionInput.value = store.description || '';
  storeFormSection.classList.remove('hidden');
}

function closeStoreForm() {
  storeFormSection.classList.add('hidden');
}

function getStorePayloadFromForm() {
  const payload = {
    image: storeImageInput.value.trim(),
    name: storeNameInput.value.trim(),
    countryCode: storeCountryCodeInput.value.trim(),
    address: {
      street: storeAddressStreetInput.value.trim(),
      city: storeAddressCityInput.value.trim(),
      zip: storeAddressZipInput.value.trim(),
    },
    location: {
      type: 'Point',
      coordinates: [
        Number(storeLocationLngInput.value),
        Number(storeLocationLatInput.value),
      ],
    },
    url: storeUrlInput.value.trim(),
    telephone: storeTelephoneInput.value.trim(),
    capacity: Number(storeCapacityInput.value),
    description: storeDescriptionInput.value.trim(),
  };

  if (storeTemperatureInput.value.trim() !== '') {
    payload.temperature = Number(storeTemperatureInput.value);
  }

  if (storeRelativeHumidityInput.value.trim() !== '') {
    payload.relativeHumidity = Number(storeRelativeHumidityInput.value);
  }

  return payload;
}

async function saveStore(event) {
  event.preventDefault();

  const storeId = storeIdInput.value.trim();
  const payload = getStorePayloadFromForm();

  try {
    let response;

    if (storeId) {
      response = await fetch(`${API_BASE}/api/stores/${storeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      response = await fetch(`${API_BASE}/api/stores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed (${response.status})`);
    }

    closeStoreForm();
    await loadStores();
    setStoresFeedback(storeId ? 'Store updated.' : 'Store created.');
  } catch (error) {
    setStoresFeedback(error.message, true);
  }
}

async function deleteStore(storeId) {
  if (!window.confirm('Delete this store?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/stores/${storeId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Delete failed (${response.status})`);
    }

    await loadStores();
    setStoresFeedback('Store deleted.');
  } catch (error) {
    setStoresFeedback(error.message, true);
  }
}

function setEmployeesFeedback(message, isError = false) {
  employeesFeedback.textContent = message;
  employeesFeedback.style.color = isError ? 'red' : 'inherit';
}

async function loadEmployees() {
  setEmployeesFeedback('Loading employees...');

  try {
    const response = await fetch(`${API_BASE}/api/employees`);
    if (!response.ok) {
      throw new Error(`Failed to load employees (${response.status})`);
    }

    employeesCache = await response.json();
    renderEmployeesTable(employeesCache);
    setEmployeesFeedback(`Loaded ${employeesCache.length} employee(s).`);
  } catch (error) {
    renderEmployeesTable([]);
    setEmployeesFeedback(error.message, true);
  }
}

function renderEmployeesTable(employees) {
  clearTableBody(employeesTableBody);

  if (!Array.isArray(employees) || employees.length === 0) {
    renderEmptyState(employeesTableBody, 5, 'No employees found.');
    return;
  }

  employees.forEach((employee) => {
    const row = document.createElement('tr');

    const imageCell = createImageCell(employee.image, employee.name);

    const nameCell = document.createElement('td');
    nameCell.textContent = employee.name || '';

    const categoryCell = document.createElement('td');
    categoryCell.textContent = employee.category || '';

    const skillsCell = document.createElement('td');
    skillsCell.textContent = Array.isArray(employee.skills)
      ? employee.skills.join(', ')
      : (employee.skills || '');

    const actionsCell = createActionsCell(
      () => openEditEmployeeForm(employee.id),
      () => deleteEmployee(employee.id),
    );

    row.appendChild(imageCell);
    row.appendChild(nameCell);
    row.appendChild(categoryCell);
    row.appendChild(skillsCell);
    row.appendChild(actionsCell);

    employeesTableBody.appendChild(row);
  });
}

function openCreateEmployeeForm() {
  employeeFormTitle.textContent = 'Create Employee';
  employeeIdInput.value = '';
  employeeImageInput.value = '';
  employeeNameInput.value = '';
  employeeCategoryInput.value = '';
  employeeSkillsInput.value = '';
  employeeEmailInput.value = '';
  employeeDateOfContractInput.value = '';
  employeeUsernameInput.value = '';
  employeePasswordInput.value = '';
  employeeRefStoreInput.value = '';
  employeeFormSection.classList.remove('hidden');
}

function openEditEmployeeForm(employeeId) {
  const employee = employeesCache.find((item) => item.id === employeeId);
  if (!employee) {
    setEmployeesFeedback('Selected employee no longer exists.', true);
    return;
  }

  employeeFormTitle.textContent = 'Edit Employee';
  employeeIdInput.value = employee.id || '';
  employeeImageInput.value = employee.image || '';
  employeeNameInput.value = employee.name || '';
  employeeCategoryInput.value = employee.category || '';
  employeeSkillsInput.value = Array.isArray(employee.skills)
    ? employee.skills.join(', ')
    : (employee.skills || '');
  employeeEmailInput.value = employee.email || '';
  employeeDateOfContractInput.value = employee.dateOfContract || '';
  employeeUsernameInput.value = employee.username || '';
  employeePasswordInput.value = employee.password || '';
  employeeRefStoreInput.value = employee.refStore || '';
  employeeFormSection.classList.remove('hidden');
}

function closeEmployeeForm() {
  employeeFormSection.classList.add('hidden');
}

function getEmployeePayloadFromForm() {
  const skills = employeeSkillsInput.value
    .split(',')
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0);

  return {
    image: employeeImageInput.value.trim(),
    name: employeeNameInput.value.trim(),
    category: employeeCategoryInput.value.trim(),
    skills,
    email: employeeEmailInput.value.trim(),
    dateOfContract: employeeDateOfContractInput.value.trim(),
    username: employeeUsernameInput.value.trim(),
    password: employeePasswordInput.value,
    refStore: employeeRefStoreInput.value.trim(),
  };
}

async function saveEmployee(event) {
  event.preventDefault();

  const employeeId = employeeIdInput.value.trim();
  const payload = getEmployeePayloadFromForm();

  try {
    let response;

    if (employeeId) {
      response = await fetch(`${API_BASE}/api/employees/${employeeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      response = await fetch(`${API_BASE}/api/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed (${response.status})`);
    }

    closeEmployeeForm();
    await loadEmployees();
    setEmployeesFeedback(employeeId ? 'Employee updated.' : 'Employee created.');
  } catch (error) {
    setEmployeesFeedback(error.message, true);
  }
}

async function deleteEmployee(employeeId) {
  if (!window.confirm('Delete this employee?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/employees/${employeeId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Delete failed (${response.status})`);
    }

    await loadEmployees();
    setEmployeesFeedback('Employee deleted.');
  } catch (error) {
    setEmployeesFeedback(error.message, true);
  }
}

function clearTableBody(tableBody) {
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
}

function renderEmptyState(tableBody, colSpan, message) {
  const row = document.createElement('tr');
  const cell = document.createElement('td');
  cell.colSpan = colSpan;
  cell.textContent = message;
  row.appendChild(cell);
  tableBody.appendChild(row);
}

function createImageCell(imageUrl, imageName) {
  const imageCell = document.createElement('td');
  const image = document.createElement('img');
  image.className = 'entity-image';
  image.src = imageUrl || '';
  image.alt = imageName || 'entity image';
  imageCell.appendChild(image);
  return imageCell;
}

function createActionsCell(onEdit, onDelete) {
  const actionsCell = document.createElement('td');
  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', onEdit);

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', onDelete);

  actionsCell.appendChild(editButton);
  actionsCell.appendChild(deleteButton);
  return actionsCell;
}

navLinks.forEach((button) => {
  button.addEventListener('click', () => showView(button.dataset.view));
});

createProductButton.addEventListener('click', openCreateProductForm);
refreshProductsButton.addEventListener('click', loadProducts);
cancelProductButton.addEventListener('click', closeProductForm);
productForm.addEventListener('submit', saveProduct);

createStoreButton.addEventListener('click', openCreateStoreForm);
refreshStoresButton.addEventListener('click', loadStores);
cancelStoreButton.addEventListener('click', closeStoreForm);
storeForm.addEventListener('submit', saveStore);

createEmployeeButton.addEventListener('click', openCreateEmployeeForm);
refreshEmployeesButton.addEventListener('click', loadEmployees);
cancelEmployeeButton.addEventListener('click', closeEmployeeForm);
employeeForm.addEventListener('submit', saveEmployee);

showView('home-view');
