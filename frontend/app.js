const API_BASE = 'http://localhost:5000';
const SOCKET_BASE = 'http://localhost:5000';

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
const storeSelector = document.getElementById('store-selector');
const storeDetailFeedback = document.getElementById('store-detail-feedback');
const storeShelvesContainer = document.getElementById('store-shelves-container');
const addShelfButton = document.getElementById('add-shelf-btn');
const addInventoryItemButton = document.getElementById('add-inventory-item-btn');
const refreshStoreDetailButton = document.getElementById('refresh-store-detail-btn');

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
const notificationsList = document.getElementById('notifications-list');

const MAX_NOTIFICATIONS = 50;

let productsCache = [];
let storesCache = [];
let employeesCache = [];
let shelvesCache = [];
let inventoryItemsCache = [];
let selectedStoreId = '';

function bindIfPresent(element, eventName, handler) {
  if (!element) {
    return;
  }
  element.addEventListener(eventName, handler);
}

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
  if (!productsFeedback) {
    return;
  }
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
  if (!productsTableBody) {
    return;
  }
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
    row.dataset.productId = product.id || '';

    const imageCell = createImageCell(product.image, product.name);

    const nameCell = document.createElement('td');
    nameCell.textContent = product.name || '';

    const colorCell = document.createElement('td');
    colorCell.textContent = product.color || '';

    const sizeCell = document.createElement('td');
    sizeCell.textContent = product.size || '';

    const priceCell = document.createElement('td');
    priceCell.className = 'product-price-cell';
    priceCell.dataset.productId = product.id || '';
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
  if (!productFormSection) {
    return;
  }
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
  if (!productFormSection) {
    return;
  }
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
  if (!productFormSection) {
    return;
  }
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
  if (!storesFeedback) {
    return;
  }
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
    await loadStoreDetailData(selectedStoreId);
  } catch (error) {
    renderStoresTable([]);
    renderStoreSelector('');
    renderStoreShelves([], [], new Map());
    setStoreDetailFeedback('Unable to load store detail view.', true);
    setStoresFeedback(error.message, true);
  }
}

function renderStoresTable(stores) {
  if (!storesTableBody) {
    return;
  }
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
  if (!storeFormSection) {
    return;
  }
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
  if (!storeFormSection) {
    return;
  }
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
  if (!storeFormSection) {
    return;
  }
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

function setStoreDetailFeedback(message, isError = false) {
  if (!storeDetailFeedback) {
    return;
  }
  storeDetailFeedback.textContent = message;
  storeDetailFeedback.style.color = isError ? 'red' : 'inherit';
}

async function loadStoreDetailData(preferredStoreId = '') {
  if (!Array.isArray(storesCache) || storesCache.length === 0) {
    selectedStoreId = '';
    renderStoreSelector('');
    renderStoreShelves([], [], new Map());
    setStoreDetailFeedback('No stores available for detail view.');
    return;
  }

  setStoreDetailFeedback('Loading store inventory view...');

  try {
    const [shelvesResponse, inventoryResponse, productsResponse] = await Promise.all([
      fetch(`${API_BASE}/api/shelves`),
      fetch(`${API_BASE}/api/inventory-items`),
      fetch(`${API_BASE}/api/products`),
    ]);

    if (!shelvesResponse.ok) {
      throw new Error(`Failed to load shelves (${shelvesResponse.status})`);
    }

    if (!inventoryResponse.ok) {
      throw new Error(`Failed to load inventory items (${inventoryResponse.status})`);
    }

    if (!productsResponse.ok) {
      throw new Error(`Failed to load products (${productsResponse.status})`);
    }

    shelvesCache = await shelvesResponse.json();
    inventoryItemsCache = await inventoryResponse.json();
    productsCache = await productsResponse.json();

    renderStoreSelector(preferredStoreId);
    renderCurrentStoreInventory();
    setStoreDetailFeedback('Store inventory view updated.');
  } catch (error) {
    renderStoreShelves([], [], new Map());
    setStoreDetailFeedback(error.message, true);
  }
}

function renderStoreSelector(preferredStoreId) {
  if (!storeSelector) {
    return;
  }
  while (storeSelector.firstChild) {
    storeSelector.removeChild(storeSelector.firstChild);
  }

  if (!Array.isArray(storesCache) || storesCache.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'No stores available';
    storeSelector.appendChild(option);
    storeSelector.value = '';
    selectedStoreId = '';
    addShelfButton.disabled = true;
    addInventoryItemButton.disabled = true;
    refreshStoreDetailButton.disabled = true;
    return;
  }

  storesCache.forEach((store) => {
    const option = document.createElement('option');
    option.value = store.id;
    option.textContent = `${store.name || 'Unnamed store'} (${store.id})`;
    storeSelector.appendChild(option);
  });

  const validPreferred = preferredStoreId && storesCache.some((store) => store.id === preferredStoreId);
  const currentValid = selectedStoreId && storesCache.some((store) => store.id === selectedStoreId);

  if (validPreferred) {
    selectedStoreId = preferredStoreId;
  } else if (!currentValid) {
    selectedStoreId = storesCache[0].id;
  }

  storeSelector.value = selectedStoreId;
  addShelfButton.disabled = false;
  addInventoryItemButton.disabled = false;
  refreshStoreDetailButton.disabled = false;
}

function renderCurrentStoreInventory() {
  const productMap = new Map(productsCache.map((product) => [product.id, product]));

  // Frontend-only filter by current store id.
  const inventoryForStore = inventoryItemsCache.filter((item) => item.refStore === selectedStoreId);
  const shelvesForStore = shelvesCache.filter((shelf) => shelf.refStore === selectedStoreId);

  renderStoreShelves(shelvesForStore, inventoryForStore, productMap);
}

function renderStoreShelves(shelves, inventoryItems, productMap) {
  if (!storeShelvesContainer) {
    return;
  }
  while (storeShelvesContainer.firstChild) {
    storeShelvesContainer.removeChild(storeShelvesContainer.firstChild);
  }

  if (!selectedStoreId) {
    const note = document.createElement('p');
    note.className = 'empty-note';
    note.textContent = 'Select a store to view shelves and inventory.';
    storeShelvesContainer.appendChild(note);
    return;
  }

  if (!Array.isArray(shelves) || shelves.length === 0) {
    const note = document.createElement('p');
    note.className = 'empty-note';
    note.textContent = 'No shelves found for the selected store.';
    storeShelvesContainer.appendChild(note);
    return;
  }

  const stockByProduct = inventoryItems.reduce((acc, item) => {
    const productId = item.refProduct;
    const shelfCount = Number(item.shelfCount || 0);
    acc[productId] = (acc[productId] || 0) + shelfCount;
    return acc;
  }, {});

  shelves.forEach((shelf) => {
    const shelfItems = inventoryItems.filter((item) => item.refShelf === shelf.id);
    const usedCapacity = shelfItems.reduce((sum, item) => sum + Number(item.shelfCount || 0), 0);
    const maxCapacity = Number(shelf.maxCapacity || 0);
    const fillPercent = maxCapacity > 0
      ? Math.min(100, Math.round((usedCapacity / maxCapacity) * 100))
      : 0;

    const shelfCard = document.createElement('article');
    shelfCard.className = 'shelf-card';

    const shelfHeader = document.createElement('div');
    shelfHeader.className = 'shelf-header';

    const shelfTitle = document.createElement('h4');
    shelfTitle.textContent = `${shelf.name || 'Unnamed shelf'} (${shelf.id})`;

    const shelfMetrics = document.createElement('span');
    shelfMetrics.className = 'shelf-metrics';
    shelfMetrics.textContent = `${shelfItems.length} product(s)`;

    shelfHeader.appendChild(shelfTitle);
    shelfHeader.appendChild(shelfMetrics);

    const capacityRow = document.createElement('div');
    capacityRow.className = 'capacity-row';

    const capacityTrack = document.createElement('div');
    capacityTrack.className = 'capacity-track';

    const capacityFill = document.createElement('div');
    capacityFill.className = 'capacity-fill';
    capacityFill.style.width = `${fillPercent}%`;

    const capacityLabel = document.createElement('span');
    capacityLabel.textContent = `${usedCapacity}/${maxCapacity || 0} (${fillPercent}%)`;

    capacityTrack.appendChild(capacityFill);
    capacityRow.appendChild(capacityTrack);
    capacityRow.appendChild(capacityLabel);

    const inventoryGrid = document.createElement('div');
    inventoryGrid.className = 'inventory-grid';

    if (shelfItems.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-note';
      empty.textContent = 'No inventory items on this shelf.';
      inventoryGrid.appendChild(empty);
    }

    shelfItems.forEach((item) => {
      const product = productMap.get(item.refProduct) || {};
      const shelfCount = Number(item.shelfCount || 0);
      const stockCount = Number(stockByProduct[item.refProduct] || 0);

      const inventoryCard = document.createElement('div');
      inventoryCard.className = 'inventory-item-card';
      inventoryCard.dataset.productId = item.refProduct || '';
      inventoryCard.dataset.storeId = item.refStore || selectedStoreId || '';

      const image = document.createElement('img');
      image.className = 'entity-image';
      image.src = product.image || '';
      image.alt = product.name || 'product image';

      const content = document.createElement('div');

      const title = document.createElement('strong');
      title.textContent = product.name || item.refProduct;

      const meta = document.createElement('div');
      meta.className = 'inventory-item-meta';
      const priceLabel = document.createTextNode('price: ');
      const priceValue = document.createElement('span');
      priceValue.className = 'inventory-price-value';
      priceValue.dataset.productId = item.refProduct || '';
      priceValue.textContent = String(product.price ?? '');
      const details = document.createTextNode(` | size: ${product.size || ''} | color: ${product.color || ''} | shelfCount: ${shelfCount} | stockCount: ${stockCount}`);

      meta.appendChild(priceLabel);
      meta.appendChild(priceValue);
      meta.appendChild(details);

      content.appendChild(title);
      content.appendChild(meta);

      const buyButton = document.createElement('button');
      buyButton.type = 'button';
      buyButton.textContent = 'Comprar producto';
      buyButton.disabled = shelfCount <= 0 || stockCount <= 0;
      buyButton.addEventListener('click', () => buyOneProduct(item));

      inventoryCard.appendChild(image);
      inventoryCard.appendChild(content);
      inventoryCard.appendChild(buyButton);
      inventoryGrid.appendChild(inventoryCard);
    });

    shelfCard.appendChild(shelfHeader);
    shelfCard.appendChild(capacityRow);
    shelfCard.appendChild(inventoryGrid);
    storeShelvesContainer.appendChild(shelfCard);
  });
}

async function buyOneProduct(inventoryItem) {
  const currentShelfCount = Number(inventoryItem.shelfCount || 0);
  const currentStockCount = Number(inventoryItem.stockCount || 0);

  if (currentShelfCount <= 0) {
    setStoreDetailFeedback('No units available on this shelf.', true);
    return;
  }

  if (currentStockCount <= 0) {
    setStoreDetailFeedback('No stock available for this product in the store.', true);
    return;
  }

  const payload = {
    shelfCount: currentShelfCount - 1,
    stockCount: currentStockCount - 1,
  };

  try {
    const response = await fetch(`${API_BASE}/api/inventory-items/${inventoryItem.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Buy operation failed (${response.status})`);
    }

    await loadStoreDetailData(selectedStoreId);
    setStoreDetailFeedback('Product purchased. Counts updated.');
  } catch (error) {
    setStoreDetailFeedback(error.message, true);
  }
}

async function addShelfToCurrentStore() {
  if (!selectedStoreId) {
    setStoreDetailFeedback('Select a store first.', true);
    return;
  }

  const name = window.prompt('Shelf name:');
  if (!name) {
    return;
  }

  const maxCapacityRaw = window.prompt('Shelf maxCapacity (positive integer):', '10');
  const maxCapacity = Number(maxCapacityRaw);

  if (!Number.isInteger(maxCapacity) || maxCapacity <= 0) {
    setStoreDetailFeedback('maxCapacity must be a positive integer.', true);
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/shelves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        maxCapacity,
        refStore: selectedStoreId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Create shelf failed (${response.status})`);
    }

    await loadStoreDetailData(selectedStoreId);
    setStoreDetailFeedback('Shelf created.');
  } catch (error) {
    setStoreDetailFeedback(error.message, true);
  }
}

async function addInventoryItemToCurrentStore() {
  if (!selectedStoreId) {
    setStoreDetailFeedback('Select a store first.', true);
    return;
  }

  const shelvesForStore = shelvesCache.filter((shelf) => shelf.refStore === selectedStoreId);
  if (shelvesForStore.length === 0) {
    setStoreDetailFeedback('Create a shelf before adding inventory items.', true);
    return;
  }

  if (productsCache.length === 0) {
    setStoreDetailFeedback('No products available. Create a product first.', true);
    return;
  }

  const shelfOptions = shelvesForStore.map((shelf) => `${shelf.id} (${shelf.name || 'unnamed'})`).join('\n');
  const selectedShelfId = window.prompt(`Choose shelf id:\n${shelfOptions}`);
  if (!selectedShelfId) {
    return;
  }

  const shelf = shelvesForStore.find((item) => item.id === selectedShelfId.trim());
  if (!shelf) {
    setStoreDetailFeedback('Invalid shelf id.', true);
    return;
  }

  const existingOnShelf = new Set(
    inventoryItemsCache
      .filter((item) => item.refShelf === shelf.id)
      .map((item) => item.refProduct),
  );

  const availableProducts = productsCache.filter((product) => !existingOnShelf.has(product.id));
  if (availableProducts.length === 0) {
    setStoreDetailFeedback('All products are already present on this shelf.', true);
    return;
  }

  const productOptions = availableProducts.map((product) => `${product.id} (${product.name || 'unnamed'})`).join('\n');
  const selectedProductId = window.prompt(`Choose product id:\n${productOptions}`);
  if (!selectedProductId) {
    return;
  }

  const product = availableProducts.find((item) => item.id === selectedProductId.trim());
  if (!product) {
    setStoreDetailFeedback('Invalid product id.', true);
    return;
  }

  const shelfCountRaw = window.prompt('shelfCount (non-negative integer):', '1');
  const shelfCount = Number(shelfCountRaw);
  if (!Number.isInteger(shelfCount) || shelfCount < 0) {
    setStoreDetailFeedback('shelfCount must be a non-negative integer.', true);
    return;
  }

  const currentStoreStock = inventoryItemsCache
    .filter((item) => item.refStore === selectedStoreId && item.refProduct === product.id)
    .reduce((sum, item) => sum + Number(item.shelfCount || 0), 0);

  try {
    const response = await fetch(`${API_BASE}/api/inventory-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shelfCount,
        stockCount: currentStoreStock + shelfCount,
        refStore: selectedStoreId,
        refShelf: shelf.id,
        refProduct: product.id,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Create inventory item failed (${response.status})`);
    }

    await loadStoreDetailData(selectedStoreId);
    setStoreDetailFeedback('InventoryItem created.');
  } catch (error) {
    setStoreDetailFeedback(error.message, true);
  }
}

function handleStoreSelectionChange() {
  if (!storeSelector) {
    return;
  }
  selectedStoreId = storeSelector.value;
  renderCurrentStoreInventory();
}

function setEmployeesFeedback(message, isError = false) {
  if (!employeesFeedback) {
    return;
  }
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
  if (!employeesTableBody) {
    return;
  }
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
  if (!employeeFormSection) {
    return;
  }
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
  if (!employeeFormSection) {
    return;
  }
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
  if (!employeeFormSection) {
    return;
  }
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
  if (!tableBody) {
    return;
  }
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
}

function renderEmptyState(tableBody, colSpan, message) {
  if (!tableBody) {
    return;
  }
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

function getEscapedSelectorValue(value) {
  const text = String(value || '');
  if (window.CSS && typeof window.CSS.escape === 'function') {
    return window.CSS.escape(text);
  }
  return text.replace(/["\\]/g, '\\$&');
}

function appendNotification(title, details) {
  if (!notificationsList) {
    return;
  }

  const existingEmptyNote = notificationsList.querySelector('.empty-note');
  if (existingEmptyNote) {
    existingEmptyNote.remove();
  }

  const item = document.createElement('li');
  item.className = 'notification-item';

  const heading = document.createElement('strong');
  heading.textContent = title;

  const message = document.createElement('span');
  message.textContent = details;

  const timestamp = document.createElement('small');
  timestamp.textContent = new Date().toLocaleTimeString();

  item.appendChild(heading);
  item.appendChild(message);
  item.appendChild(document.createElement('br'));
  item.appendChild(timestamp);

  notificationsList.appendChild(item);

  while (notificationsList.children.length > MAX_NOTIFICATIONS) {
    notificationsList.removeChild(notificationsList.firstChild);
  }
}

function normalizePriceChangedPayload(payload) {
  const entity = payload && payload.entity;
  if (!entity || typeof entity !== 'object') {
    return null;
  }

  const productId = typeof entity.id === 'string' ? entity.id.trim() : '';
  const priceValue = Number(entity.price);
  if (!productId || Number.isNaN(priceValue)) {
    return null;
  }

  return {
    productId,
    productName: entity.name || productId,
    price: priceValue,
  };
}

function normalizeLowStockPayload(payload) {
  const entity = payload && payload.entity;
  if (!entity || typeof entity !== 'object') {
    return null;
  }

  const inventoryId = typeof entity.id === 'string' ? entity.id.trim() : '';
  const productId = typeof entity.refProduct === 'string' ? entity.refProduct.trim() : '';
  const storeId = typeof entity.refStore === 'string' ? entity.refStore.trim() : '';
  const stockCount = Number(entity.stockCount);
  const threshold = Number(payload.threshold);

  if (!inventoryId || Number.isNaN(stockCount)) {
    return null;
  }

  return {
    inventoryId,
    productId,
    storeId,
    stockCount,
    threshold: Number.isNaN(threshold) ? null : threshold,
  };
}

function updateProductPriceInUI(productId, price) {
  productsCache = productsCache.map((product) => {
    if (product.id === productId) {
      return { ...product, price };
    }
    return product;
  });

  const escapedProductId = getEscapedSelectorValue(productId);
  const nextPrice = String(price);

  const productPriceCells = document.querySelectorAll(`.product-price-cell[data-product-id="${escapedProductId}"]`);
  productPriceCells.forEach((cell) => {
    cell.textContent = nextPrice;
  });

  const storePriceFields = document.querySelectorAll(`.inventory-price-value[data-product-id="${escapedProductId}"]`);
  storePriceFields.forEach((field) => {
    field.textContent = nextPrice;
  });
}

function highlightLowStockProduct(productId, storeId) {
  if (!productId) {
    return;
  }

  const escapedProductId = getEscapedSelectorValue(productId);
  const productRows = document.querySelectorAll(`tr[data-product-id="${escapedProductId}"]`);

  productRows.forEach((row) => {
    row.classList.add('low-stock');
    window.setTimeout(() => row.classList.remove('low-stock'), 5000);
  });

  if (storeId && selectedStoreId && storeId !== selectedStoreId) {
    return;
  }

  const inventoryCards = document.querySelectorAll(`.inventory-item-card[data-product-id="${escapedProductId}"]`);
  inventoryCards.forEach((card) => {
    card.classList.add('low-stock');
    window.setTimeout(() => card.classList.remove('low-stock'), 5000);
  });
}

function initRealtimeNotifications() {
  if (typeof window.io !== 'function') {
    // Socket.IO script is optional for basic CRUD usage.
    return;
  }

  const socket = window.io(SOCKET_BASE);

  socket.on('connect', () => {
    console.log('Socket.IO connected', socket.id);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket.IO connection error:', error);
  });

  socket.on('orion_notification', (payload) => {
    console.log('Socket event: orion_notification', payload);

    try {
      if (!payload || typeof payload !== 'object') {
        console.warn('Ignoring malformed orion_notification payload.', payload);
        return;
      }

      const notificationId = payload.subscriptionId || 'n/a';
      const entities = Array.isArray(payload.data) ? payload.data : [];
      const entitySummary = entities.length === 0
        ? 'No entity data included'
        : entities.map((entity) => {
          if (!entity || typeof entity !== 'object') {
            return 'unknown entity';
          }

          const entityType = entity.type || 'Entity';
          const entityId = entity.id || 'n/a';
          const price = entity.price && typeof entity.price === 'object' ? entity.price.value : undefined;
          const stockCount = entity.stockCount && typeof entity.stockCount === 'object' ? entity.stockCount.value : undefined;

          if (typeof price !== 'undefined') {
            return `${entityType} ${entityId} price=${price}`;
          }

          if (typeof stockCount !== 'undefined') {
            return `${entityType} ${entityId} stockCount=${stockCount}`;
          }

          return `${entityType} ${entityId}`;
        }).join(' | ');

      appendNotification('Orion notification', `Subscription ${notificationId}: ${entitySummary}`);
    } catch (error) {
      console.error('Error handling orion_notification event:', error);
    }
  });
}

navLinks.forEach((button) => {
  bindIfPresent(button, 'click', () => showView(button.dataset.view));
});

bindIfPresent(createProductButton, 'click', openCreateProductForm);
bindIfPresent(refreshProductsButton, 'click', loadProducts);
bindIfPresent(cancelProductButton, 'click', closeProductForm);
bindIfPresent(productForm, 'submit', saveProduct);

bindIfPresent(createStoreButton, 'click', openCreateStoreForm);
bindIfPresent(refreshStoresButton, 'click', loadStores);
bindIfPresent(cancelStoreButton, 'click', closeStoreForm);
bindIfPresent(storeForm, 'submit', saveStore);
bindIfPresent(storeSelector, 'change', handleStoreSelectionChange);
bindIfPresent(addShelfButton, 'click', addShelfToCurrentStore);
bindIfPresent(addInventoryItemButton, 'click', addInventoryItemToCurrentStore);
bindIfPresent(refreshStoreDetailButton, 'click', () => loadStoreDetailData(selectedStoreId));

bindIfPresent(createEmployeeButton, 'click', openCreateEmployeeForm);
bindIfPresent(refreshEmployeesButton, 'click', loadEmployees);
bindIfPresent(cancelEmployeeButton, 'click', closeEmployeeForm);
bindIfPresent(employeeForm, 'submit', saveEmployee);

initRealtimeNotifications();
showView('home-view');
