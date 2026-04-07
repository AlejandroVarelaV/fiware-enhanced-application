# Issue #1: Bootstrap Flask Backend and Implement Base NGSIv2 CRUD Services

## Overview
This issue establishes the foundational backend infrastructure for the FIWARE-enhanced application. It focuses on bootstrapping the Flask application, establishing connectivity to the Orion Context Broker, and implementing base CRUD services for all mandatory entities (Product, Store, Employee, Shelf, InventoryItem) with the NGSIv2 REST API.

**Scope (IN):**
- Flask application bootstrap and configuration
- NGSIv2 service layer and HTTP client
- Base CRUD REST endpoints for all entities
- Error handling and validation framework
- Project directory structure aligned with architecture.md
- Environment-based configuration (local development, Docker integration)
- Integration with Orion using host.docker.internal for callback URLs

**Scope (OUT):**
- Frontend HTML/CSS/JavaScript views
- Socket.IO real-time communication
- Subscription registration and notification handling
- External context provider registration
- Data initialization/seed scripts
- UI-specific API enhancements

## Acceptance Criteria

1. **Flask Application Structure**
   - [ ] Project structure follows the architecture pattern: modular services, config management, error handling
   - [ ] Application starts without errors with valid Orion connectivity configuration
   - [ ] All CRUD endpoints are defined and respond with appropriate HTTP status codes
   - [ ] Server startup logs confirm no unhandled exceptions

2. **NGSIv2 Service Layer**
   - [ ] OrionService class abstracts all NGSIv2 REST calls
   - [ ] Service handles entity CRUD operations (POST, GET, UPDATE, DELETE, PATCH)
   - [ ] Service includes query and list operations with filtering support
   - [ ] Error responses include proper NGSIv2 error handling and client logging
   - [ ] All HTTP calls use proper Content-Type and Accept headers for NGSIv2

3. **Entity CRUD Endpoints for Product**
   - [ ] POST /api/products - Create a new Product
   - [ ] GET /api/products - List all Products
   - [ ] GET /api/products/<id> - Retrieve single Product
   - [ ] PATCH /api/products/<id> - Update Product attributes
   - [ ] DELETE /api/products/<id> - Delete Product

4. **Entity CRUD Endpoints for Store**
   - [ ] POST /api/stores - Create a new Store
   - [ ] GET /api/stores - List all Stores
   - [ ] GET /api/stores/<id> - Retrieve single Store
   - [ ] PATCH /api/stores/<id> - Update Store attributes
   - [ ] DELETE /api/stores/<id> - Delete Store

5. **Entity CRUD Endpoints for Employee**
   - [ ] POST /api/employees - Create a new Employee
   - [ ] GET /api/employees - List all Employees
   - [ ] GET /api/employees/<id> - Retrieve single Employee
   - [ ] PATCH /api/employees/<id> - Update Employee attributes
   - [ ] DELETE /api/employees/<id> - Delete Employee

6. **Entity CRUD Endpoints for Shelf**
   - [ ] POST /api/shelves - Create a new Shelf
   - [ ] GET /api/shelves - List all Shelves
   - [ ] GET /api/shelves/<id> - Retrieve single Shelf
   - [ ] PATCH /api/shelves/<id> - Update Shelf attributes
   - [ ] DELETE /api/shelves/<id> - Delete Shelf

7. **Entity CRUD Endpoints for InventoryItem**
   - [ ] POST /api/inventory - Create a new InventoryItem
   - [ ] GET /api/inventory - List all InventoryItems
   - [ ] GET /api/inventory/<id> - Retrieve single InventoryItem
   - [ ] PATCH /api/inventory/<id> - Update InventoryItem attributes
   - [ ] DELETE /api/inventory/<id> - Delete InventoryItem

8. **Data Validation**
   - [ ] Employee.email validated as email format
   - [ ] Store.countryCode validated as exactly 2 characters
   - [ ] Employee.skills validated against enum (MachineryDriving, WritingReports, CustomerRelationships)
   - [ ] Required fields enforced for all entities per data_model.md
   - [ ] Product.color stored as RGB hex format (validated)
   - [ ] Relationship validation: Employee and Shelf reference valid Store, InventoryItem references valid Product/Shelf/Store

9. **Error Handling**
   - [ ] 404 responses for non-existent entities
   - [ ] 400 responses for invalid input with error message details
   - [ ] 500 responses with structured error logging for backend failures
   - [ ] Graceful handling of Orion connection failures (with informative error messages)
   - [ ] All errors include consistent JSON response format

10. **Configuration and Environment**
    - [ ] Environment variables documented in .env.example
    - [ ] ORION_URL, ORION_FIWARE_SERVICE, ORION_FIWARE_SERVICEPATH configurable
    - [ ] host.docker.internal used for callback URL configuration (if applicable)
    - [ ] Development mode (Flask debug) and production modes supported
    - [ ] Requirements.txt includes all dependencies (Flask, requests, python-dotenv, etc.)

11. **Testing Foundation**
    - [ ] Backend application runs successfully against a live Orion instance (Docker or local)
    - [ ] All endpoints return correct NGSIv2 response format
    - [ ] Sample CRUD sequences validate round-trip data integrity (store → Orion → retrieve)
    - [ ] Validation logic correctly rejects invalid data

## Implementation Tasks

### Phase 1: Project Structure and Flask Bootstrap

**Task 1.1: Create project directory structure**
- [ ] Create `/backend` directory
- [ ] Create `/backend/app` (Flask package)
- [ ] Create `/backend/app/services` (service layer)
- [ ] Create `/backend/app/routes` (endpoint handlers)
- [ ] Create `/backend/app/models` (data model/schemas)
- [ ] Create `/backend/app/utils` (helpers, validators, constants)
- [ ] Create `/backend/config` (configuration management)
- [ ] Create `/backend/tests` (unit tests placeholder)
- [ ] Create `/backend/requirements.txt`
- [ ] Create `/backend/.env.example`
- [ ] Create `/backend/run.py` (Flask app entry point)

**Task 1.2: Set up Flask application factory and configuration**
- [ ] Implement `config/config.py` with development/production/testing configurations
- [ ] Implement `app/__init__.py` (Flask application factory)
- [ ] Support environment variable loading via python-dotenv
- [ ] Configure Flask-CORS or appropriate CORS policy for future frontend integration
- [ ] Set up structured logging for all backend operations
- [ ] Ensure application starts cleanly without unhandled exceptions

**Task 1.3: Create requirements.txt with core dependencies**
Minimum dependencies:
- Flask
- requests (for Orion HTTP calls)
- python-dotenv
- python-dateutil (for DateTime handling)
- (Flask-SocketIO to be added in future issue)
- (additional test/dev dependencies as needed)

### Phase 2: NGSIv2 Service Layer

**Task 2.1: Implement OrionService class**
- [ ] `app/services/orion_service.py` - main service class
- [ ] Constructor accepts Orion base URL, FIWARE service, FIWARE service path
- [ ] Implement HTTP client with proper headers:
  - Accept: application/json
  - Content-Type: application/json
  - Fiware-Service and Fiware-ServicePath as configured
- [ ] Implement connection validation method (health check)
- [ ] Implement structured error logging and exception handling
- [ ] All HTTP calls wrapped with connection error handling

**Task 2.2: Implement NGSIv2 entity operations in OrionService**
- [ ] `create_entity(entity_type, entity_data)` - POST /v2/entities
- [ ] `get_entity(entity_id)` - GET /v2/entities/{id}
- [ ] `list_entities(entity_type=None, filters=None)` - GET /v2/entities (with optional filtering)
- [ ] `update_entity_attrs(entity_id, attrs)` - PATCH /v2/entities/{id}/attrs
- [ ] `delete_entity(entity_id)` - DELETE /v2/entities/{id}
- [ ] `patch_entity_increment(entity_id, attr_name, inc_value)` - PATCH with increment operator (for future buy-one-unit)
- [ ] All operations return parsed JSON responses or raise descriptive exceptions

**Task 2.3: Implement entity type mapping to NGSIv2 format**
- [ ] Utility functions to convert Python dicts to NGSIv2 format (with type metadata)
- [ ] Utility functions to parse NGSIv2 responses back to Python objects
- [ ] Support for standard NGSIv2 attribute typing (Text, Integer, Number, DateTime, geo:json, Relationship, etc.)

### Phase 3: CRUD Endpoint Structure and Entity-Specific Services

**Task 3.1: Create base service classes**
- [ ] `app/services/base_service.py` - abstract service with common CRUD patterns
- [ ] Each entity service inherits from base and implements entity-specific validation
- [ ] Service methods: create, read, read_list, update, delete

**Task 3.2: Implement Product service**
- [ ] `app/services/product_service.py`
- [ ] Validate required fields: name, image, size, price, color (hex RGB format)
- [ ] Implement all CRUD operations using OrionService
- [ ] Convert Product domain objects to/from Orion representations

**Task 3.3: Implement Store service**
- [ ] `app/services/store_service.py`
- [ ] Validate required fields: name, image, address, location (geo:json), url, telephone, countryCode (exactly 2 chars), capacity, description
- [ ] Implement all CRUD operations
- [ ] Note: temperature, relativeHumidity, tweets to be filled by external providers (placeholder support)

**Task 3.4: Implement Employee service**
- [ ] `app/services/employee_service.py`
- [ ] Validate required fields: name, image, category, email (format), dateOfContract, skills (enum), username, password, refStore (valid Store)
- [ ] Implement all CRUD operations
- [ ] Validate refStore relationship exists before creation/update

**Task 3.5: Implement Shelf service**
- [ ] `app/services/shelf_service.py`
- [ ] Validate required fields: name, maxCapacity (Integer), refStore (valid Store)
- [ ] Optional: location (geo:json)
- [ ] Implement all CRUD operations
- [ ] Validate refStore relationship exists

**Task 3.6: Implement InventoryItem service**
- [ ] `app/services/inventory_item_service.py`
- [ ] Validate required fields: shelfCount, stockCount, refStore, refShelf, refProduct
- [ ] Validate all relationships exist before creation/update
- [ ] Implement all CRUD operations
- [ ] Support for future buy-one-unit (increment/decrement operations)

### Phase 4: REST Endpoint Routes

**Task 4.1: Create product endpoints**
- [ ] `app/routes/product_routes.py`
- [ ] POST /api/products → create product
- [ ] GET /api/products → list products
- [ ] GET /api/products/<product_id> → retrieve product
- [ ] PATCH /api/products/<product_id> → update product
- [ ] DELETE /api/products/<product_id> → delete product
- [ ] Use consistent request/response JSON format with proper status codes

**Task 4.2: Create store endpoints**
- [ ] `app/routes/store_routes.py`
- [ ] POST /api/stores → create store
- [ ] GET /api/stores → list stores
- [ ] GET /api/stores/<store_id> → retrieve store
- [ ] PATCH /api/stores/<store_id> → update store
- [ ] DELETE /api/stores/<store_id> → delete store

**Task 4.3: Create employee endpoints**
- [ ] `app/routes/employee_routes.py`
- [ ] POST /api/employees → create employee
- [ ] GET /api/employees → list employees
- [ ] GET /api/employees/<employee_id> → retrieve employee
- [ ] PATCH /api/employees/<employee_id> → update employee
- [ ] DELETE /api/employees/<employee_id> → delete employee

**Task 4.4: Create shelf endpoints**
- [ ] `app/routes/shelf_routes.py`
- [ ] POST /api/shelves → create shelf
- [ ] GET /api/shelves → list shelves
- [ ] GET /api/shelves/<shelf_id> → retrieve shelf
- [ ] PATCH /api/shelves/<shelf_id> → update shelf
- [ ] DELETE /api/shelves/<shelf_id> → delete shelf

**Task 4.5: Create inventory endpoints**
- [ ] `app/routes/inventory_routes.py`
- [ ] POST /api/inventory → create inventory item
- [ ] GET /api/inventory → list inventory items
- [ ] GET /api/inventory/<inventory_id> → retrieve inventory item
- [ ] PATCH /api/inventory/<inventory_id> → update inventory item
- [ ] DELETE /api/inventory/<inventory_id> → delete inventory item

**Task 4.6: Register all routes in Flask app**
- [ ] Import and register all route blueprints in `app/__init__.py`
- [ ] Ensure consistent URL prefix /api

**Task 4.7: Implement health check endpoint**
- [ ] GET /api/health → returns backend status and Orion connectivity status
- [ ] Response format: `{ "status": "ok", "orion": "connected", "timestamp": "..." }`

### Phase 5: Validation and Error Handling

**Task 5.1: Implement validators module**
- [ ] `app/utils/validators.py`
- [ ] Email format validation
- [ ] Country code validation (exactly 2 characters)
- [ ] Skills enum validation (MachineryDriving, WritingReports, CustomerRelationships)
- [ ] Color hex RGB validation (#RRGGBB format)
- [ ] DateTime format validation
- [ ] Relationship validation (entity exists in Orion)

**Task 5.2: Implement error handler middleware**
- [ ] Global error handler for unhandled exceptions
- [ ] Consistent error response JSON format
- [ ] HTTP status code mapping (400 for validation, 404 for not found, 500 for server errors)
- [ ] All errors logged with context for debugging

**Task 5.3: Implement request/response serialization**
- [ ] Utility functions to map NGSIv2 responses to consistent API response format
- [ ] Handle NULL/missing attributes gracefully
- [ ] Support ISO format dates in responses

### Phase 6: Configuration and Documentation

**Task 6.1: Create environment configuration files**
- [ ] `.env.example` in backend directory with all required environment variables
- [ ] Document each variable with description
- [ ] Example values appropriate for Docker dev environment (host.docker.internal)

**Task 6.2: Update .gitignore**
- [ ] Exclude `.env` (actual secrets)
- [ ] Exclude `__pycache__`, `*.pyc`
- [ ] Exclude `.venv`, `venv`
- [ ] Exclude `*.log`

**Task 6.3: Create README.md for backend**
- [ ] Setup instructions (virtual environment, pip install)
- [ ] Environment variable configuration
- [ ] Running the Flask development server
- [ ] Orion connectivity requirements (Docker Compose reference)
- [ ] Example curl requests for each CRUD endpoint

**Task 6.4: Update project documentation**
- [ ] Update `architecture.md` with detailed Flask backend structure
- [ ] Add service layer patterns and HTTP communication details
- [ ] Update `PRD.md` if any scope clarifications emerged
- [ ] Ensure `data_model.md` references are consistent

### Phase 7: Integration Testing and Verification

**Task 7.1: Manual testing checklist**
- [ ] Start Flask application with ORION_URL pointing to valid Orion instance
- [ ] Verify `/api/health` endpoint returns connected status
- [ ] Test create product endpoint (POST /api/products with valid data)
- [ ] Verify created product appears in Orion (GET /v2/entities via curl or Orion UI)
- [ ] Test list products endpoint (GET /api/products)
- [ ] Test update product endpoint (PATCH /api/products/<id>)
- [ ] Test delete product endpoint (DELETE /api/products/<id>)
- [ ] Repeat for Store, Employee, Shelf, InventoryItem entities

**Task 7.2: Validation testing**
- [ ] Test email validation (invalid email rejected with 400 bad request)
- [ ] Test countryCode validation (non-2-char rejected)
- [ ] Test color validation (invalid hex format rejected)
- [ ] Test required field validation (missing fields rejected)
- [ ] Test relationship validation (invalid refStore rejected)

**Task 7.3: Error handling testing**
- [ ] Test 404 response when retrieving non-existent entity
- [ ] Test connection error handling when Orion is unavailable
- [ ] Test malformed request handling (invalid JSON, etc.)

## Files to Create

```
backend/
├── app/
│   ├── __init__.py                 (Flask app factory)
│   ├── services/
│   │   ├── __init__.py
│   │   ├── orion_service.py        (NGSIv2 HTTP client)
│   │   ├── base_service.py         (abstract CRUD service)
│   │   ├── product_service.py
│   │   ├── store_service.py
│   │   ├── employee_service.py
│   │   ├── shelf_service.py
│   │   └── inventory_item_service.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── product_routes.py
│   │   ├── store_routes.py
│   │   ├── employee_routes.py
│   │   ├── shelf_routes.py
│   │   ├── inventory_routes.py
│   │   └── health_routes.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── schemas.py              (request/response schemas)
│   │   └── exceptions.py           (custom exceptions)
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── validators.py
│   │   ├── constants.py            (skills enum, etc.)
│   │   ├── ngsi_helpers.py         (NGSI format conversion)
│   │   └── logger.py               (logging configuration)
├── config/
│   ├── __init__.py
│   └── config.py
├── tests/
│   └── __init__.py                 (placeholder for future unit tests)
├── run.py                          (entry point)
├── requirements.txt
├── .env.example
└── README.md
```

## Testing Instructions

### Prerequisites
- Docker and Docker Compose running Orion, MongoDB, tutorial provider (per docker-compose.yml)
- Python 3.8+
- Virtual environment set up

### Setup Steps
1. Navigate to backend directory: `cd backend`
2. Create virtual environment: `python -m venv venv`
3. Activate virtual environment: `source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and adjust ORION_URL if needed
6. Run Flask: `python run.py`

### Verification
1. Health check: `curl http://localhost:5000/api/health`
2. Create product: `curl -X POST http://localhost:5000/api/products -H "Content-Type: application/json" -d '{"name":"Widget","image":"widget.jpg","size":"M","price":9.99,"color":"#FF0000"}'`
3. List products: `curl http://localhost:5000/api/products`
4. Retrieve product by ID from step 2 response
5. Update product: `curl -X PATCH http://localhost:5000/api/products/<id> -H "Content-Type: application/json" -d '{"price":12.99}'`
6. Delete product: `curl -X DELETE http://localhost:5000/api/products/<id>`
7. Repeat for other entities

## GitHub Flow Checklist

- [ ] Create GitHub issue from this plan
- [ ] Create branch: `git checkout -b feature/issue-1-backend-bootstrap`
- [ ] Commit incrementally as tasks complete
- [ ] Push branch regularly: `git push origin feature/issue-1-backend-bootstrap`
- [ ] When complete, merge to main (direct merge or via pull request)
- [ ] After merge, update PRD.md, architecture.md, data_model.md with implementation details
- [ ] Close issue

## Notes and Considerations

1. **Orion Connectivity**: Ensure Orion is accessible from the backend (use host.docker.internal if both are containerized; use localhost if Orion is local-only).

2. **Future Considerations**: The endpoint structure is designed to easily accommodate Socket.IO event emission once subscriptions are added. Currently, endpoints return HTTP responses only.

3. **Data Model Alignment**: All entity services strictly follow the data_model.md specification. External provider attributes (temperature, relativeHumidity, tweets) are NOT created in this issue; the services support their presence in responses once registered.

4. **Validation Strategy**: Validation occurs both at the service layer (business logic) and at the OrionService layer (Orion rejects invalid creates/updates with appropriate NGSIv2 error responses).

5. **Error Logging**: All errors are logged for debugging; production deployment should filter logs appropriately.

6. **Response Format Consistency**: All endpoints follow a consistent JSON response structure (e.g., `{"status": "ok", "data": {...}, "message": "..."}` or direct entity data).

7. **Database Persistence**: All data is persisted in Orion's MongoDB backend. This issue does NOT include data migration, backup, or seed scripts.

