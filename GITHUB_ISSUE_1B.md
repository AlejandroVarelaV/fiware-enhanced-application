# Issue #1B: Implement CRUD Endpoints for Product and Store

## Overview

This issue builds upon Issue 1A to implement basic CRUD (Create, Read, Update, Delete) REST endpoints for the **Product** and **Store** entities. These are the two core catalog entities.

This issue includes:
- Product and Store service layer classes
- Minimal validation (required fields only)
- REST endpoints for both entities
- Consistent request/response format

This focuses on the **two simplest entities** to establish endpoint patterns and conventions. Response validation and relationship validation are deferred to Issue 1C.

**Estimated Effort**: 1-2 days

**Depends On**: Issue 1A (Flask app + OrionService working)

## Scope (IN)

- Product service with basic CRUD
- Store service with basic CRUD
- Product REST endpoints (POST, GET list, GET detail, PATCH, DELETE)
- Store REST endpoints (POST, GET list, GET detail, PATCH, DELETE)
- Required field validation only (no complex validation yet)
- Consistent error responses
- Entity-to-NGSIv2 mapping utilities
- Request/response JSON format documentation

## Scope (OUT)

- Relationship validation (e.g., Store reference validation)
- Complex field validation (email format, color hex, country code, etc.)
- Shelf, Employee, InventoryItem entities
- Subscription or notification handling
- Socket.IO integration
- External context providers
- Data initialization

## Acceptance Criteria

### Product Service Implementation
- [ ] `app/services/product_service.py` created with ProductService class
- [ ] ProductService uses OrionService for all Orion operations
- [ ] Required fields enforced: name, image, size, price, color
- [ ] Create method validates required fields (400 if missing)
- [ ] Read method retrieves single Product by ID or 404 if not found
- [ ] List method returns all Products from Orion
- [ ] Update method patches specified attributes
- [ ] Delete method removes Product entity
- [ ] All methods convert between Python dicts and NGSIv2 format

### Store Service Implementation
- [ ] `app/services/store_service.py` created with StoreService class
- [ ] StoreService uses OrionService for all Orion operations
- [ ] Required fields enforced: name, image, address, location, url, telephone, countryCode, capacity, description
- [ ] Create method validates required fields (400 if missing)
- [ ] Read method retrieves single Store by ID or 404 if not found
- [ ] List method returns all Stores from Orion
- [ ] Update method patches specified attributes
- [ ] Delete method removes Store entity
- [ ] All methods convert between Python dicts and NGSIv2 format

### Product REST Endpoints
- [ ] POST /api/products → Creates Product, returns 201 with created entity
- [ ] GET /api/products → Lists all Products, returns 200
- [ ] GET /api/products/<id> → Retrieves single Product, returns 200 or 404
- [ ] PATCH /api/products/<id> → Updates Product, returns 200 with updated entity
- [ ] DELETE /api/products/<id> → Deletes Product, returns 204
- [ ] All endpoints use consistent JSON response format

### Store REST Endpoints
- [ ] POST /api/stores → Creates Store, returns 201 with created entity
- [ ] GET /api/stores → Lists all Stores, returns 200
- [ ] GET /api/stores/<id> → Retrieves single Store, returns 200 or 404
- [ ] PATCH /api/stores/<id> → Updates Store, returns 200 with updated entity
- [ ] DELETE /api/stores/<id> → Deletes Store, returns 204
- [ ] All endpoints use consistent JSON response format

### Request/Response Format
- [ ] All responses are valid JSON
- [ ] Success responses include entity data
- [ ] Error responses include status code and error message
- [ ] Required field validation errors return 400 with field-specific messages
- [ ] 404 errors include informative message (e.g., "Product with id 'xyz' not found")
- [ ] 500 errors logged with full context, user-friendly message returned

### NGSIv2 Integration
- [ ] Product entities created in Orion with type="Product"
- [ ] Store entities created in Orion with type="Store"
- [ ] Entity IDs generated consistently (UUID or deterministic)
- [ ] All attributes mapped to NGSIv2 format (Text, Number, StructuredValue, geo:json)
- [ ] Round-trip verification: create → store in Orion → retrieve → same data

### Error Handling
- [ ] 400 Bad Request for invalid/missing required fields
- [ ] 404 Not Found for non-existent entities
- [ ] 409 Conflict if attempting to create duplicate ID
- [ ] 500 Internal Server Error logged with full exception context
- [ ] All error responses include descriptive message

### Testing
- [ ] All CRUD operations tested against live Orion instance
- [ ] Sample workflows: create → list → retrieve → update → delete
- [ ] Data integrity: verify Orion contains correct entity after each operation
- [ ] Error scenarios: missing fields, invalid JSON, non-existent IDs

## Implementation Tasks

### Task B1: Create NGSIv2 Format Utilities
- [ ] Create `backend/app/utils/ngsi_helpers.py` with utility functions:
  - `to_ngsi_format(entity_type, data_dict)` → converts Python dict to NGSIv2 with type metadata
  - `from_ngsi_format(ngsi_dict)` → converts NGSIv2 response back to Python dict
  - `generate_entity_id(entity_type)` → generates consistent entity IDs
- [ ] Support attribute typing for Text, Number, Integer, DateTime, StructuredValue, geo:json
- [ ] Handle nested structures (e.g., address as StructuredValue)
- [ ] Handle geospatial data (location as geo:json Point)

### Task B2: Create Validation Utilities (Minimal)
- [ ] Create `backend/app/utils/validators.py` with basic validation:
  - `validate_required_fields(data, required_fields)` → raises ValidationError if any missing
  - Return early for this issue; complex field validation in Issue 1C
- [ ] Export custom ValidationError exception from models

### Task B3: Implement Product Service
- [ ] Create `backend/app/services/product_service.py`:
  - Import OrionService, validators, ngsi_helpers
  - Implement ProductService class with methods:
    - `__init__(orion_service)` - constructor
    - `create(product_data)` - validates required fields, calls orion_service.create_entity()
    - `get(product_id)` - calls orion_service.get_entity(), handles 404
    - `list()` - calls orion_service.list_entities(entity_type="Product")
    - `update(product_id, updates)` - calls orion_service.update_entity_attrs()
    - `delete(product_id)` - calls orion_service.delete_entity()
  - Required fields: name, image, size, price, color
  - Use ngsi_helpers for format conversion
  - Log all operations for debugging

### Task B4: Implement Store Service
- [ ] Create `backend/app/services/store_service.py`:
  - Import OrionService, validators, ngsi_helpers
  - Implement StoreService class with methods:
    - `__init__(orion_service)` - constructor
    - `create(store_data)` - validates required fields, calls orion_service.create_entity()
    - `get(store_id)` - calls orion_service.get_entity(), handles 404
    - `list()` - calls orion_service.list_entities(entity_type="Store")
    - `update(store_id, updates)` - calls orion_service.update_entity_attrs()
    - `delete(store_id)` - calls orion_service.delete_entity()
  - Required fields: name, image, address, location, url, telephone, countryCode, capacity, description
  - Use ngsi_helpers for format conversion (special handling for geo:json location)
  - Log all operations for debugging

### Task B5: Implement Product Routes
- [ ] Create `backend/app/routes/product_routes.py`:
  - Create Blueprint: `product_bp` with url_prefix="/api/products"
  - Dependency injection of ProductService (via Flask current_app)
  - POST route: accept JSON, call service.create(), return 201 with entity
  - GET (no ID) route: call service.list(), return 200 with array
  - GET (with ID) route: call service.get(id), return 200 or 404
  - PATCH route: call service.update(id, updates), return 200 with updated entity
  - DELETE route: call service.delete(id), return 204
  - Handle errors: catch ValidationError (400), EntityNotFoundError (404), etc.

### Task B6: Implement Store Routes
- [ ] Create `backend/app/routes/store_routes.py`:
  - Create Blueprint: `store_bp` with url_prefix="/api/stores"
  - Dependency injection of StoreService (via Flask current_app)
  - POST route: accept JSON, call service.create(), return 201 with entity
  - GET (no ID) route: call service.list(), return 200 with array
  - GET (with ID) route: call service.get(id), return 200 or 404
  - PATCH route: call service.update(id, updates), return 200 with updated entity
  - DELETE route: call service.delete(id), return 204
  - Handle errors: catch ValidationError (400), EntityNotFoundError (404), etc.
  - Special handling for geo:json location field in responses

### Task B7: Instantiate and Register Services
- [ ] Update `backend/app/__init__.py` (Flask factory):
  - Create singleton instances of ProductService and StoreService during app initialization
  - Attach services to `app` object for access in routes: `app.product_service`, `app.store_service`
  - Register product_bp and store_bp blueprints with `/api` prefix
  - Ensure error handlers cover all exception types from services

### Task B8: Create Request/Response Schema Documentation
- [ ] Create `backend/app/models/schemas.py` documenting:
  - Product schema (CREATE request, response example)
  - Store schema (CREATE request, response example)
  - Common error response format
  - Example JSON for each endpoint
- [ ] Use comments or docstring format for documentation
- [ ] Include required vs optional fields per issue scope

### Task B9: Manual Testing
- [ ] Ensure Issue 1A backend is running
- [ ] Test Product endpoints:
  - Create: `POST /api/products` with valid Product JSON
  - List: `GET /api/products`
  - Retrieve: `GET /api/products/<id>` with ID from create response
  - Update: `PATCH /api/products/<id>` with new data
  - Delete: `DELETE /api/products/<id>`
- [ ] Test Store endpoints (same workflow):
  - Create: `POST /api/stores` with valid Store JSON
  - List: `GET /api/stores`
  - Retrieve: `GET /api/stores/<id>`
  - Update: `PATCH /api/stores/<id>`
  - Delete: `DELETE /api/stores/<id>`
- [ ] Verify data persists in Orion (check via Orion HTTP API or UI)
- [ ] Test error scenarios:
  - Missing required field (expect 400)
  - Non-existent ID (expect 404)
  - Malformed JSON (expect 400)

## Files to Create/Modify

### New Files
```
backend/app/services/
├── product_service.py
└── store_service.py

backend/app/routes/
├── product_routes.py
└── store_routes.py

backend/app/utils/
├── ngsi_helpers.py
└── validators.py

backend/app/models/
└── schemas.py
```

### Modified Files
```
backend/app/__init__.py              (service instantiation, blueprint registration)
backend/requirements.txt             (no new dependencies for this issue)
backend/README.md                    (add CRUD endpoint examples)
```

## Testing Instructions

### Prerequisites
- Issue 1A completed and backend running: `python run.py`
- Orion/MongoDB running in Docker Compose
- Python requests or curl available

### Setup
```bash
# Backend already running from Issue 1A
# No additional setup needed if Issue 1A is complete
```

### Manual Test Scenarios

#### Product CRUD
```bash
# 1. Create Product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Widget Pro",
    "image": "widget-pro.jpg",
    "size": "L",
    "price": 29.99,
    "color": "#FF5733"
  }'
# Note the product ID from response (e.g., "urn:ngsi-ld:Product:...")

# 2. List Products
curl http://localhost:5000/api/products

# 3. Get single Product
curl http://localhost:5000/api/products/<id>

# 4. Update Product
curl -X PATCH http://localhost:5000/api/products/<id> \
  -H "Content-Type: application/json" \
  -d '{"price": 34.99}'

# 5. Delete Product
curl -X DELETE http://localhost:5000/api/products/<id>

# 6. Verify deletion (expect 404)
curl http://localhost:5000/api/products/<id>
```

#### Store CRUD
```bash
# Similar workflow for Stores
# 1. Create Store
curl -X POST http://localhost:5000/api/stores \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Downtown Store",
    "image": "store-downtown.jpg",
    "address": {"street": "123 Main", "city": "Boston", "zip": "02101"},
    "location": {"type": "Point", "coordinates": [-71.0589, 42.3601]},
    "url": "https://store.example.com",
    "telephone": "+1-617-555-0100",
    "countryCode": "US",
    "capacity": 500,
    "description": "Main retail location"
  }'

# 2-5. List, Get, Update, Delete (similar to Products)
```

### Verification in Orion
```bash
# Check created entities directly in Orion
curl http://localhost:1026/v2/entities -H "Fiware-Service: smart-retail"

# Or query by type
curl "http://localhost:1026/v2/entities?type=Product" \
  -H "Fiware-Service: smart-retail"
curl "http://localhost:1026/v2/entities?type=Store" \
  -H "Fiware-Service: smart-retail"
```

## Validation Test Cases

| Test Case | Input | Expected | HTTP Status |
|-----------|-------|----------|-------------|
| Valid Product | All required fields | Success | 201 |
| Missing Product field | Missing "name" | Validation error | 400 |
| Valid Store | All required fields | Success | 201 |
| Missing Store field | Missing "location" | Validation error | 400 |
| Non-existent Product ID | GET /products/fake-id | Not found | 404 |
| Malformed JSON | Invalid JSON body | Parse error | 400 |

## GitHub Flow Checklist

- [ ] Create GitHub issue from this description
- [ ] Create branch: `git checkout -b feature/1b-crud-products-stores`
- [ ] Commit incrementally (e.g., per service, per route)
- [ ] Push branch: `git push origin feature/1b-crud-products-stores`
- [ ] Upon completion, merge to main
- [ ] After merge, update `architecture.md` with endpoint documentation

## Dependencies for Next Issue

**Issue 1C** will depend on this issue completing:
- Issue 1C will add Employee, Shelf, InventoryItem services and routes
- Issue 1C will add complex validation (relationships, enum validation, etc.)
- Issue 1C will assume ProductService and StoreService patterns are correct

## Notes and Considerations

1. **Pattern Establishment**: This issue establishes the service/route pattern used for remaining entities in Issue 1C.

2. **Minimal Validation**: Intentionally minimal in this issue to keep scope focused. Complex validation (emails, country codes, relationships, enum values) deferred to Issue 1C.

3. **Required Fields Only**: Only "required" checks. Format validation (color hex) is Issue 1C scope.

4. **Service Dependency Injection**: Services instantiated in Flask factory and attached to app; this pattern repeated in Issue 1C.

5. **Error Response Consistency**: All errors follow same JSON format for consistency across all entities added in 1C.

6. **No Subscriptions Yet**: Endpoints return HTTP responses. Socket.IO event emission comes in later issues.

7. **Data Format**: Orion returns data; endpoints should preserve structure and convert cleanly back to client format.
