const API_BASE = 'http://localhost:5000';
const SOCKET_BASE = 'http://localhost:5000';

const STORAGE_THEME_KEY = 'us_theme';
const STORAGE_LANG_KEY = 'us_lang';

const translations = {
  en: {
    'app.title': 'United Supermarket',
    'brand.name': 'United Supermarket',
    'header.dashboard': 'Smart Retail Dashboard',
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.stores': 'Stores',
    'nav.employees': 'Employees',
    'nav.storesMap': 'Stores Map',
    'toggle.theme': 'Toggle theme',
    'toggle.langBtn': 'ES / EN',
    'home.title': 'Home',
    'home.entityModel': 'Entity Model',
    'home.subtitle': 'United Supermarket - FIWARE NGSIv2-powered supermarket management',
    'products.title': 'Products',
    'products.create': 'Create Product',
    'products.refresh': 'Refresh',
    'products.table.image': 'Image',
    'products.table.name': 'Name',
    'products.table.color': 'Color',
    'products.table.size': 'Size',
    'products.table.price': 'Price',
    'products.table.actions': 'Actions',
    'products.empty.loaded': 'No products loaded.',
    'products.empty.found': 'No products found.',
    'products.form.createTitle': 'Create Product',
    'products.form.editTitle': 'Edit Product',
    'products.form.imageUrl': 'Image URL',
    'products.form.name': 'Name',
    'products.form.colorHex': 'Color (hex)',
    'products.form.size': 'Size',
    'products.form.price': 'Price',
    'products.form.save': 'Save',
    'products.form.cancel': 'Cancel',
    'stores.title': 'Stores',
    'stores.create': 'Create Store',
    'stores.refresh': 'Refresh',
    'stores.table.image': 'Image',
    'stores.table.name': 'Name',
    'stores.table.countryCode': 'Country Code',
    'stores.table.temperature': 'Temperature',
    'stores.table.relativeHumidity': 'Relative Humidity',
    'stores.table.actions': 'Actions',
    'stores.empty.loaded': 'No stores loaded.',
    'stores.empty.found': 'No stores found.',
    'stores.form.createTitle': 'Create Store',
    'stores.form.editTitle': 'Edit Store',
    'stores.form.imageUrl': 'Image URL',
    'stores.form.name': 'Name',
    'stores.form.countryCode': 'Country Code',
    'stores.form.temperature': 'Temperature',
    'stores.form.relativeHumidity': 'Relative Humidity',
    'stores.form.addressStreet': 'Address Street',
    'stores.form.addressCity': 'Address City',
    'stores.form.addressZip': 'Address ZIP',
    'stores.form.locationLng': 'Location Longitude',
    'stores.form.locationLat': 'Location Latitude',
    'stores.form.url': 'URL',
    'stores.form.telephone': 'Telephone',
    'stores.form.capacity': 'Capacity',
    'stores.form.description': 'Description',
    'stores.form.save': 'Save',
    'stores.form.cancel': 'Cancel',
    'storeDetail.title': 'Store Detail',
    'storeDetail.selectorAria': 'Select store',
    'storeDetail.refresh': 'Refresh Detail',
    'storeDetail.addShelf': 'Add Shelf',
    'storeDetail.addInventoryItem': 'Add Inventory Item',
    'storeDetail.empty.noStoresOption': 'No stores available',
    'storeDetail.empty.noStoresForDetail': 'No stores available for detail view.',
    'storeDetail.loadingInventory': 'Loading store inventory view...',
    'storeDetail.updatedInventory': 'Store inventory view updated.',
    'storeDetail.empty.selectStore': 'Select a store to view shelves and inventory.',
    'storeDetail.empty.noShelves': 'No shelves found for the selected store.',
    'storeDetail.shelf.unnamed': 'Unnamed shelf',
    'storeDetail.store.unnamed': 'Unnamed store',
    'storeDetail.metrics.productsCount': '{count} product(s)',
    'storeDetail.empty.noInventoryOnShelf': 'No inventory items on this shelf.',
    'storeDetail.buy': 'Buy product',
    'storeDetail.meta.price': 'price',
    'storeDetail.meta.size': 'size',
    'storeDetail.meta.color': 'color',
    'storeDetail.meta.shelfCount': 'shelfCount',
    'storeDetail.meta.stockCount': 'stockCount',
    'notifications.title': 'Notifications',
    'notifications.empty': 'No notifications yet.',
    'notifications.orionTitle': 'Orion notification',
    'notifications.subscriptionPrefix': 'Subscription {id}: {summary}',
    'notifications.noEntityData': 'No entity data included',
    'notifications.unknownEntity': 'unknown entity',
    'employees.title': 'Employees',
    'employees.create': 'Create Employee',
    'employees.refresh': 'Refresh',
    'employees.table.image': 'Image',
    'employees.table.name': 'Name',
    'employees.table.category': 'Category',
    'employees.table.skills': 'Skills',
    'employees.table.actions': 'Actions',
    'employees.empty.loaded': 'No employees loaded.',
    'employees.empty.found': 'No employees found.',
    'employees.form.createTitle': 'Create Employee',
    'employees.form.editTitle': 'Edit Employee',
    'employees.form.imageUrl': 'Image URL',
    'employees.form.name': 'Name',
    'employees.form.category': 'Category',
    'employees.form.skills': 'Skills (comma separated)',
    'employees.form.email': 'Email',
    'employees.form.dateOfContract': 'Date of Contract (ISO 8601)',
    'employees.form.datePlaceholder': '2026-03-30T10:00:00Z',
    'employees.form.username': 'Username',
    'employees.form.password': 'Password',
    'employees.form.storeId': 'Store ID',
    'employees.form.save': 'Save',
    'employees.form.cancel': 'Cancel',
    'storesMap.title': 'Stores Map',
    'storesMap.placeholder': 'Stores Map will be implemented in Issue 8.',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.entityImageAlt': 'entity image',
    'common.productImageAlt': 'product image',
    'status.loadingProducts': 'Loading products...',
    'status.loadedProducts': 'Loaded {count} product(s).',
    'status.productSelectedMissing': 'Selected product no longer exists.',
    'status.productUpdated': 'Product updated.',
    'status.productCreated': 'Product created.',
    'status.productDeleted': 'Product deleted.',
    'status.loadingStores': 'Loading stores...',
    'status.loadedStores': 'Loaded {count} store(s).',
    'status.storeDetailUnavailable': 'Unable to load store detail view.',
    'status.storeSelectedMissing': 'Selected store no longer exists.',
    'status.storeUpdated': 'Store updated.',
    'status.storeCreated': 'Store created.',
    'status.storeDeleted': 'Store deleted.',
    'status.noUnitsOnShelf': 'No units available on this shelf.',
    'status.noStockInStore': 'No stock available for this product in the store.',
    'status.productPurchased': 'Product purchased. Counts updated.',
    'status.selectStoreFirst': 'Select a store first.',
    'status.maxCapacityPositiveInt': 'maxCapacity must be a positive integer.',
    'status.shelfCreated': 'Shelf created.',
    'status.createShelfFirst': 'Create a shelf before adding inventory items.',
    'status.noProductsAvailableCreateFirst': 'No products available. Create a product first.',
    'status.invalidShelfId': 'Invalid shelf id.',
    'status.allProductsAlreadyOnShelf': 'All products are already present on this shelf.',
    'status.invalidProductId': 'Invalid product id.',
    'status.shelfCountNonNegativeInt': 'shelfCount must be a non-negative integer.',
    'status.inventoryItemCreated': 'InventoryItem created.',
    'status.loadingEmployees': 'Loading employees...',
    'status.loadedEmployees': 'Loaded {count} employee(s).',
    'status.employeeSelectedMissing': 'Selected employee no longer exists.',
    'status.employeeUpdated': 'Employee updated.',
    'status.employeeCreated': 'Employee created.',
    'status.employeeDeleted': 'Employee deleted.',
    'confirm.deleteProduct': 'Delete this product?',
    'confirm.deleteStore': 'Delete this store?',
    'confirm.deleteEmployee': 'Delete this employee?',
    'prompt.shelfName': 'Shelf name:',
    'prompt.shelfMaxCapacity': 'Shelf maxCapacity (positive integer):',
    'prompt.chooseShelfId': 'Choose shelf id:\n{options}',
    'prompt.chooseProductId': 'Choose product id:\n{options}',
    'prompt.shelfCount': 'shelfCount (non-negative integer):'
  },
  es: {
    'app.title': 'United Supermarket',
    'brand.name': 'United Supermarket',
    'header.dashboard': 'Panel de Retail Inteligente',
    'nav.home': 'Inicio',
    'nav.products': 'Productos',
    'nav.stores': 'Tiendas',
    'nav.employees': 'Empleados',
    'nav.storesMap': 'Mapa de Tiendas',
    'toggle.theme': 'Cambiar tema',
    'toggle.langBtn': 'ES / EN',
    'home.title': 'Inicio',
    'home.entityModel': 'Modelo de Entidades',
    'home.subtitle': 'United Supermarket - gestion de supermercados basada en FIWARE NGSIv2',
    'products.title': 'Productos',
    'products.create': 'Crear Producto',
    'products.refresh': 'Actualizar',
    'products.table.image': 'Imagen',
    'products.table.name': 'Nombre',
    'products.table.color': 'Color',
    'products.table.size': 'Talla',
    'products.table.price': 'Precio',
    'products.table.actions': 'Acciones',
    'products.empty.loaded': 'No hay productos cargados.',
    'products.empty.found': 'No se encontraron productos.',
    'products.form.createTitle': 'Crear Producto',
    'products.form.editTitle': 'Editar Producto',
    'products.form.imageUrl': 'URL de Imagen',
    'products.form.name': 'Nombre',
    'products.form.colorHex': 'Color (hex)',
    'products.form.size': 'Talla',
    'products.form.price': 'Precio',
    'products.form.save': 'Guardar',
    'products.form.cancel': 'Cancelar',
    'stores.title': 'Tiendas',
    'stores.create': 'Crear Tienda',
    'stores.refresh': 'Actualizar',
    'stores.table.image': 'Imagen',
    'stores.table.name': 'Nombre',
    'stores.table.countryCode': 'Codigo de Pais',
    'stores.table.temperature': 'Temperatura',
    'stores.table.relativeHumidity': 'Humedad Relativa',
    'stores.table.actions': 'Acciones',
    'stores.empty.loaded': 'No hay tiendas cargadas.',
    'stores.empty.found': 'No se encontraron tiendas.',
    'stores.form.createTitle': 'Crear Tienda',
    'stores.form.editTitle': 'Editar Tienda',
    'stores.form.imageUrl': 'URL de Imagen',
    'stores.form.name': 'Nombre',
    'stores.form.countryCode': 'Codigo de Pais',
    'stores.form.temperature': 'Temperatura',
    'stores.form.relativeHumidity': 'Humedad Relativa',
    'stores.form.addressStreet': 'Calle',
    'stores.form.addressCity': 'Ciudad',
    'stores.form.addressZip': 'Codigo Postal',
    'stores.form.locationLng': 'Longitud',
    'stores.form.locationLat': 'Latitud',
    'stores.form.url': 'URL',
    'stores.form.telephone': 'Telefono',
    'stores.form.capacity': 'Capacidad',
    'stores.form.description': 'Descripcion',
    'stores.form.save': 'Guardar',
    'stores.form.cancel': 'Cancelar',
    'storeDetail.title': 'Detalle de Tienda',
    'storeDetail.selectorAria': 'Seleccionar tienda',
    'storeDetail.refresh': 'Actualizar Detalle',
    'storeDetail.addShelf': 'Anadir Estanteria',
    'storeDetail.addInventoryItem': 'Anadir Item de Inventario',
    'storeDetail.empty.noStoresOption': 'No hay tiendas disponibles',
    'storeDetail.empty.noStoresForDetail': 'No hay tiendas disponibles para la vista de detalle.',
    'storeDetail.loadingInventory': 'Cargando vista de inventario de la tienda...',
    'storeDetail.updatedInventory': 'Vista de inventario actualizada.',
    'storeDetail.empty.selectStore': 'Selecciona una tienda para ver estanterias e inventario.',
    'storeDetail.empty.noShelves': 'No hay estanterias para la tienda seleccionada.',
    'storeDetail.shelf.unnamed': 'Estanteria sin nombre',
    'storeDetail.store.unnamed': 'Tienda sin nombre',
    'storeDetail.metrics.productsCount': '{count} producto(s)',
    'storeDetail.empty.noInventoryOnShelf': 'No hay items de inventario en esta estanteria.',
    'storeDetail.buy': 'Comprar producto',
    'storeDetail.meta.price': 'precio',
    'storeDetail.meta.size': 'talla',
    'storeDetail.meta.color': 'color',
    'storeDetail.meta.shelfCount': 'cantidadEstanteria',
    'storeDetail.meta.stockCount': 'stock',
    'notifications.title': 'Notificaciones',
    'notifications.empty': 'Aun no hay notificaciones.',
    'notifications.orionTitle': 'Notificacion de Orion',
    'notifications.subscriptionPrefix': 'Suscripcion {id}: {summary}',
    'notifications.noEntityData': 'No se incluyeron datos de entidad',
    'notifications.unknownEntity': 'entidad desconocida',
    'employees.title': 'Empleados',
    'employees.create': 'Crear Empleado',
    'employees.refresh': 'Actualizar',
    'employees.table.image': 'Imagen',
    'employees.table.name': 'Nombre',
    'employees.table.category': 'Categoria',
    'employees.table.skills': 'Habilidades',
    'employees.table.actions': 'Acciones',
    'employees.empty.loaded': 'No hay empleados cargados.',
    'employees.empty.found': 'No se encontraron empleados.',
    'employees.form.createTitle': 'Crear Empleado',
    'employees.form.editTitle': 'Editar Empleado',
    'employees.form.imageUrl': 'URL de Imagen',
    'employees.form.name': 'Nombre',
    'employees.form.category': 'Categoria',
    'employees.form.skills': 'Habilidades (separadas por comas)',
    'employees.form.email': 'Correo',
    'employees.form.dateOfContract': 'Fecha de Contrato (ISO 8601)',
    'employees.form.datePlaceholder': '2026-03-30T10:00:00Z',
    'employees.form.username': 'Usuario',
    'employees.form.password': 'Contrasena',
    'employees.form.storeId': 'ID de Tienda',
    'employees.form.save': 'Guardar',
    'employees.form.cancel': 'Cancelar',
    'storesMap.title': 'Mapa de Tiendas',
    'storesMap.placeholder': 'El Mapa de Tiendas se implementara en la Issue 8.',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.entityImageAlt': 'imagen de entidad',
    'common.productImageAlt': 'imagen de producto',
    'status.loadingProducts': 'Cargando productos...',
    'status.loadedProducts': 'Se cargaron {count} producto(s).',
    'status.productSelectedMissing': 'El producto seleccionado ya no existe.',
    'status.productUpdated': 'Producto actualizado.',
    'status.productCreated': 'Producto creado.',
    'status.productDeleted': 'Producto eliminado.',
    'status.loadingStores': 'Cargando tiendas...',
    'status.loadedStores': 'Se cargaron {count} tienda(s).',
    'status.storeDetailUnavailable': 'No se pudo cargar la vista de detalle de tienda.',
    'status.storeSelectedMissing': 'La tienda seleccionada ya no existe.',
    'status.storeUpdated': 'Tienda actualizada.',
    'status.storeCreated': 'Tienda creada.',
    'status.storeDeleted': 'Tienda eliminada.',
    'status.noUnitsOnShelf': 'No hay unidades disponibles en esta estanteria.',
    'status.noStockInStore': 'No hay stock disponible para este producto en la tienda.',
    'status.productPurchased': 'Producto comprado. Cantidades actualizadas.',
    'status.selectStoreFirst': 'Selecciona primero una tienda.',
    'status.maxCapacityPositiveInt': 'maxCapacity debe ser un entero positivo.',
    'status.shelfCreated': 'Estanteria creada.',
    'status.createShelfFirst': 'Crea una estanteria antes de anadir inventario.',
    'status.noProductsAvailableCreateFirst': 'No hay productos disponibles. Crea primero un producto.',
    'status.invalidShelfId': 'ID de estanteria invalido.',
    'status.allProductsAlreadyOnShelf': 'Todos los productos ya estan en esta estanteria.',
    'status.invalidProductId': 'ID de producto invalido.',
    'status.shelfCountNonNegativeInt': 'shelfCount debe ser un entero no negativo.',
    'status.inventoryItemCreated': 'Item de inventario creado.',
    'status.loadingEmployees': 'Cargando empleados...',
    'status.loadedEmployees': 'Se cargaron {count} empleado(s).',
    'status.employeeSelectedMissing': 'El empleado seleccionado ya no existe.',
    'status.employeeUpdated': 'Empleado actualizado.',
    'status.employeeCreated': 'Empleado creado.',
    'status.employeeDeleted': 'Empleado eliminado.',
    'confirm.deleteProduct': 'Eliminar este producto?',
    'confirm.deleteStore': 'Eliminar esta tienda?',
    'confirm.deleteEmployee': 'Eliminar este empleado?',
    'prompt.shelfName': 'Nombre de la estanteria:',
    'prompt.shelfMaxCapacity': 'maxCapacity de la estanteria (entero positivo):',
    'prompt.chooseShelfId': 'Elige ID de estanteria:\n{options}',
    'prompt.chooseProductId': 'Elige ID de producto:\n{options}',
    'prompt.shelfCount': 'shelfCount (entero no negativo):'
  }
};

let currentLang = localStorage.getItem(STORAGE_LANG_KEY) || 'en';

function t(key, vars = {}) {
  const langTable = translations[currentLang] || translations.en;
  let text = langTable[key] || translations.en[key] || key;
  Object.entries(vars).forEach(([name, value]) => {
    text = text.replace(`{${name}}`, String(value));
  });
  return text;
}

function applyTranslations(lang) {
  currentLang = lang === 'es' ? 'es' : 'en';
  document.documentElement.lang = currentLang;
  localStorage.setItem(STORAGE_LANG_KEY, currentLang);

  const title = document.querySelector('title[data-i18n]');
  if (title) {
    title.textContent = t(title.dataset.i18n);
  }

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    element.setAttribute('placeholder', t(key));
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    element.setAttribute('aria-label', t(key));
  });
}

function toggleLang() {
  applyTranslations(currentLang === 'en' ? 'es' : 'en');
  refreshUiLanguageStrings();
}

function updateThemeIcon() {
  const icon = document.querySelector('#theme-toggle i');
  if (!icon) {
    return;
  }
  const darkEnabled = document.documentElement.dataset.theme === 'dark';
  if (darkEnabled) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
}

function toggleTheme() {
  const darkEnabled = document.documentElement.dataset.theme === 'dark';
  if (darkEnabled) {
    delete document.documentElement.dataset.theme;
    localStorage.setItem(STORAGE_THEME_KEY, 'light');
  } else {
    document.documentElement.dataset.theme = 'dark';
    localStorage.setItem(STORAGE_THEME_KEY, 'dark');
  }
  updateThemeIcon();
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem(STORAGE_THEME_KEY);
  if (savedTheme === 'dark') {
    document.documentElement.dataset.theme = 'dark';
  }
  updateThemeIcon();
}

const views = document.querySelectorAll('.view');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggleButton = document.getElementById('theme-toggle');
const langToggleButton = document.getElementById('lang-toggle');

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

function refreshUiLanguageStrings() {
  renderProductsTable(productsCache);
  renderStoresTable(storesCache);
  renderEmployeesTable(employeesCache);
}

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
  setProductsFeedback(t('status.loadingProducts'));

  try {
    const response = await fetch(`${API_BASE}/api/products`);
    if (!response.ok) {
      throw new Error(`Failed to load products (${response.status})`);
    }

    productsCache = await response.json();
    renderProductsTable(productsCache);
    setProductsFeedback(t('status.loadedProducts', { count: productsCache.length }));
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
    cell.textContent = t('products.empty.found');
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
    editButton.textContent = t('common.edit');
    editButton.addEventListener('click', () => openEditProductForm(product.id));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = t('common.delete');
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
  productFormTitle.dataset.i18n = 'products.form.createTitle';
  productFormTitle.textContent = t('products.form.createTitle');
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
    setProductsFeedback(t('status.productSelectedMissing'), true);
    return;
  }

  productFormTitle.dataset.i18n = 'products.form.editTitle';
  productFormTitle.textContent = t('products.form.editTitle');
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
    setProductsFeedback(productId ? t('status.productUpdated') : t('status.productCreated'));
  } catch (error) {
    setProductsFeedback(error.message, true);
  }
}

async function deleteProduct(productId) {
  if (!window.confirm(t('confirm.deleteProduct'))) {
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
    setProductsFeedback(t('status.productDeleted'));
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
  setStoresFeedback(t('status.loadingStores'));

  try {
    const response = await fetch(`${API_BASE}/api/stores`);
    if (!response.ok) {
      throw new Error(`Failed to load stores (${response.status})`);
    }

    storesCache = await response.json();
    renderStoresTable(storesCache);
    setStoresFeedback(t('status.loadedStores', { count: storesCache.length }));
    await loadStoreDetailData(selectedStoreId);
  } catch (error) {
    renderStoresTable([]);
    renderStoreSelector('');
    renderStoreShelves([], [], new Map());
    setStoreDetailFeedback(t('status.storeDetailUnavailable'), true);
    setStoresFeedback(error.message, true);
  }
}

function renderStoresTable(stores) {
  if (!storesTableBody) {
    return;
  }
  clearTableBody(storesTableBody);

  if (!Array.isArray(stores) || stores.length === 0) {
    renderEmptyState(storesTableBody, 6, t('stores.empty.found'));
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
  storeFormTitle.dataset.i18n = 'stores.form.createTitle';
  storeFormTitle.textContent = t('stores.form.createTitle');
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
    setStoresFeedback(t('status.storeSelectedMissing'), true);
    return;
  }

  storeFormTitle.dataset.i18n = 'stores.form.editTitle';
  storeFormTitle.textContent = t('stores.form.editTitle');
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
    setStoresFeedback(storeId ? t('status.storeUpdated') : t('status.storeCreated'));
  } catch (error) {
    setStoresFeedback(error.message, true);
  }
}

async function deleteStore(storeId) {
  if (!window.confirm(t('confirm.deleteStore'))) {
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
    setStoresFeedback(t('status.storeDeleted'));
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
    setStoreDetailFeedback(t('storeDetail.empty.noStoresForDetail'));
    return;
  }

  setStoreDetailFeedback(t('storeDetail.loadingInventory'));

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
    setStoreDetailFeedback(t('storeDetail.updatedInventory'));
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
    option.textContent = t('storeDetail.empty.noStoresOption');
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
    option.textContent = `${store.name || t('storeDetail.store.unnamed')} (${store.id})`;
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
    note.textContent = t('storeDetail.empty.selectStore');
    storeShelvesContainer.appendChild(note);
    return;
  }

  if (!Array.isArray(shelves) || shelves.length === 0) {
    const note = document.createElement('p');
    note.className = 'empty-note';
    note.textContent = t('storeDetail.empty.noShelves');
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
    shelfTitle.textContent = `${shelf.name || t('storeDetail.shelf.unnamed')} (${shelf.id})`;

    const shelfMetrics = document.createElement('span');
    shelfMetrics.className = 'shelf-metrics';
    shelfMetrics.textContent = t('storeDetail.metrics.productsCount', { count: shelfItems.length });

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
      empty.textContent = t('storeDetail.empty.noInventoryOnShelf');
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
      image.alt = product.name || t('common.productImageAlt');

      const content = document.createElement('div');

      const title = document.createElement('strong');
      title.textContent = product.name || item.refProduct;

      const meta = document.createElement('div');
      meta.className = 'inventory-item-meta';
      const priceLabel = document.createTextNode(`${t('storeDetail.meta.price')}: `);
      const priceValue = document.createElement('span');
      priceValue.className = 'inventory-price-value';
      priceValue.dataset.productId = item.refProduct || '';
      priceValue.textContent = String(product.price ?? '');
      const details = document.createTextNode(` | ${t('storeDetail.meta.size')}: ${product.size || ''} | ${t('storeDetail.meta.color')}: ${product.color || ''} | ${t('storeDetail.meta.shelfCount')}: ${shelfCount} | ${t('storeDetail.meta.stockCount')}: ${stockCount}`);

      meta.appendChild(priceLabel);
      meta.appendChild(priceValue);
      meta.appendChild(details);

      content.appendChild(title);
      content.appendChild(meta);

      const buyButton = document.createElement('button');
      buyButton.type = 'button';
      buyButton.textContent = t('storeDetail.buy');
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
    setStoreDetailFeedback(t('status.noUnitsOnShelf'), true);
    return;
  }

  if (currentStockCount <= 0) {
    setStoreDetailFeedback(t('status.noStockInStore'), true);
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
    setStoreDetailFeedback(t('status.productPurchased'));
  } catch (error) {
    setStoreDetailFeedback(error.message, true);
  }
}

async function addShelfToCurrentStore() {
  if (!selectedStoreId) {
    setStoreDetailFeedback(t('status.selectStoreFirst'), true);
    return;
  }

  const name = window.prompt(t('prompt.shelfName'));
  if (!name) {
    return;
  }

  const maxCapacityRaw = window.prompt(t('prompt.shelfMaxCapacity'), '10');
  const maxCapacity = Number(maxCapacityRaw);

  if (!Number.isInteger(maxCapacity) || maxCapacity <= 0) {
    setStoreDetailFeedback(t('status.maxCapacityPositiveInt'), true);
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
    setStoreDetailFeedback(t('status.shelfCreated'));
  } catch (error) {
    setStoreDetailFeedback(error.message, true);
  }
}

async function addInventoryItemToCurrentStore() {
  if (!selectedStoreId) {
    setStoreDetailFeedback(t('status.selectStoreFirst'), true);
    return;
  }

  const shelvesForStore = shelvesCache.filter((shelf) => shelf.refStore === selectedStoreId);
  if (shelvesForStore.length === 0) {
    setStoreDetailFeedback(t('status.createShelfFirst'), true);
    return;
  }

  if (productsCache.length === 0) {
    setStoreDetailFeedback(t('status.noProductsAvailableCreateFirst'), true);
    return;
  }

  const shelfOptions = shelvesForStore.map((shelf) => `${shelf.id} (${shelf.name || t('storeDetail.shelf.unnamed')})`).join('\n');
  const selectedShelfId = window.prompt(t('prompt.chooseShelfId', { options: shelfOptions }));
  if (!selectedShelfId) {
    return;
  }

  const shelf = shelvesForStore.find((item) => item.id === selectedShelfId.trim());
  if (!shelf) {
    setStoreDetailFeedback(t('status.invalidShelfId'), true);
    return;
  }

  const existingOnShelf = new Set(
    inventoryItemsCache
      .filter((item) => item.refShelf === shelf.id)
      .map((item) => item.refProduct),
  );

  const availableProducts = productsCache.filter((product) => !existingOnShelf.has(product.id));
  if (availableProducts.length === 0) {
    setStoreDetailFeedback(t('status.allProductsAlreadyOnShelf'), true);
    return;
  }

  const productOptions = availableProducts.map((product) => `${product.id} (${product.name || t('storeDetail.store.unnamed')})`).join('\n');
  const selectedProductId = window.prompt(t('prompt.chooseProductId', { options: productOptions }));
  if (!selectedProductId) {
    return;
  }

  const product = availableProducts.find((item) => item.id === selectedProductId.trim());
  if (!product) {
    setStoreDetailFeedback(t('status.invalidProductId'), true);
    return;
  }

  const shelfCountRaw = window.prompt(t('prompt.shelfCount'), '1');
  const shelfCount = Number(shelfCountRaw);
  if (!Number.isInteger(shelfCount) || shelfCount < 0) {
    setStoreDetailFeedback(t('status.shelfCountNonNegativeInt'), true);
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
    setStoreDetailFeedback(t('status.inventoryItemCreated'));
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
  setEmployeesFeedback(t('status.loadingEmployees'));

  try {
    const response = await fetch(`${API_BASE}/api/employees`);
    if (!response.ok) {
      throw new Error(`Failed to load employees (${response.status})`);
    }

    employeesCache = await response.json();
    renderEmployeesTable(employeesCache);
    setEmployeesFeedback(t('status.loadedEmployees', { count: employeesCache.length }));
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
    renderEmptyState(employeesTableBody, 5, t('employees.empty.found'));
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
  employeeFormTitle.dataset.i18n = 'employees.form.createTitle';
  employeeFormTitle.textContent = t('employees.form.createTitle');
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
    setEmployeesFeedback(t('status.employeeSelectedMissing'), true);
    return;
  }

  employeeFormTitle.dataset.i18n = 'employees.form.editTitle';
  employeeFormTitle.textContent = t('employees.form.editTitle');
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
    setEmployeesFeedback(employeeId ? t('status.employeeUpdated') : t('status.employeeCreated'));
  } catch (error) {
    setEmployeesFeedback(error.message, true);
  }
}

async function deleteEmployee(employeeId) {
  if (!window.confirm(t('confirm.deleteEmployee'))) {
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
    setEmployeesFeedback(t('status.employeeDeleted'));
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
  image.alt = imageName || t('common.entityImageAlt');
  imageCell.appendChild(image);
  return imageCell;
}

function createActionsCell(onEdit, onDelete) {
  const actionsCell = document.createElement('td');
  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.textContent = t('common.edit');
  editButton.addEventListener('click', onEdit);

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = t('common.delete');
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

  const socket = window.location.origin === SOCKET_BASE ? io() : io(SOCKET_BASE);

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket.IO connection error:', error);
  });

  socket.on('orion_notification', (payload) => {
    console.log('Notification received:', payload);

    try {
      if (!payload || typeof payload !== 'object') {
        console.warn('Ignoring malformed orion_notification payload.', payload);
        return;
      }

      const notificationId = payload.subscriptionId || 'n/a';
      const entities = Array.isArray(payload.data) ? payload.data : [];
      const entitySummary = entities.length === 0
        ? t('notifications.noEntityData')
        : entities.map((entity) => {
          if (!entity || typeof entity !== 'object') {
            return t('notifications.unknownEntity');
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

      appendNotification(
        t('notifications.orionTitle'),
        t('notifications.subscriptionPrefix', { id: notificationId, summary: entitySummary }),
      );
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
bindIfPresent(themeToggleButton, 'click', toggleTheme);
bindIfPresent(langToggleButton, 'click', toggleLang);

applySavedTheme();
applyTranslations(currentLang);
initRealtimeNotifications();
showView('home-view');
