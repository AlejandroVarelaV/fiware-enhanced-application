# Issue #1C: Implement CRUD Endpoints for Employee, Shelf, and InventoryItem with Full Validation

## Overview

This issue completes the backend CRUD layer by implementing the three remaining entities (Employee, Shelf, InventoryItem) and adding comprehensive validation logic including **relationship validation**.

This issue includes:
- Employee, Shelf, and InventoryItem service layers
- Full validation logic (email format, country code, color hex, skills enum, etc.)
- Relationship validation (verify referenced entities exist)
- REST endpoints for all three entities
- Error handling for complex validation scenarios

This builds on the patterns established in Issues 1A and 1B and completes the core CRUD infrastructure.

**Estimated Effort**: 2-3 days

**Depends On**: Issue 1B (Product and Store endpoints working)

## Scope (IN)

- Employee service with full CRUD and validation
- Shelf service with full CRUD and relationship validation
- InventoryItem service with full CRUD and complex relationship validation
- Employee REST endpoints (POST, GET list, GET detail, PATCH, DELETE)
- Shelf REST endpoints (POST, GET list, GET detail, PATCH, DELETE)
- InventoryItem REST endpoints (POST, GET list, GET detail, PATCH, DELETE)
- Complete field validation (email, color hex, country code, skills enum, datetime, etc.)
- Relationship validation (verify Store, Product, Shelf references exist)
- Comprehensive error responses for validation failures
- Pre-implementation documentation updates

## Scope (OUT)

- Subscription or notification handling
- Socket.IO integration
- Data initialization/seed scripts
- External context provider registration
- Buy-one-unit operation enhancement (increment/decrement on inventoryItem)
- Query optimization or advanced filtering

## Acceptance Criteria

### Employee Service Implementation
- [ ] `app/services/employee_service.py` created with EmployeeService class
- [ ] EmployeeService uses OrionService for all Orion operations
- [ ] Required fields: name, image, category, email, dateOfContract, skills, username, password, refStore
- [ ] Email validation: must match standard email format (RFC 5322 simplified)
- [ ] Skills validation: must be array of enum values (MachineryDriving, WritingReports, CustomerRelationships)
- [ ] DateOfContract validation: must be ISO 8601 DateTime format
- [ ] Relationship validation: refStore must reference valid Store entity in Orion
- [ ] Create method returns 400 with field-specific error messages on validation failure
- [ ] Create method returns 404 if referenced Store does not exist
- [ ] Read, List, Update, Delete methods follow Issue 1B patterns
- [ ] Update validates same constraints as Create for any modified fields

### Shelf Service Implementation
- [ ] `app/services/shelf_service.py` created with ShelfService class
- [ ] ShelfService uses OrionService for all Orion operations
- [ ] Required fields: name, maxCapacity, refStore
- [ ] MaxCapacity validation: must be positive integer
- [ ] Relationship validation: refStore must reference valid Store entity in Orion
- [ ] Optional field: location (geo:json Point, validated if provided)
- [ ] Create method returns 400 for invalid maxCapacity
- [ ] Create method returns 404 if referenced Store does not exist
- [ ] Read, List, Update, Delete methods follow Issue 1B patterns

### InventoryItem Service Implementation
- [ ] `app/services/inventory_item_service.py` created with InventoryItemService class
- [ ] InventoryItemService uses OrionService for all Orion operations
- [ ] Required fields: shelfCount, stockCount, refStore, refShelf, refProduct
- [ ] ShelfCount and stockCount validation: must be non-negative integers
- [ ] Relationship validation for all three references:
  - refStore must reference valid Store entity
  - refShelf must reference valid Shelf entity
  - refProduct must reference valid Product entity
- [ ] Create method returns 400 for invalid counts
- [ ] Create method returns 404 if any referenced entity missing
- [ ] Create method must verify Shelf actually belongs to Store (refShelf.refStore == refStore)
- [ ] Read, List, Update, Delete methods follow Issue 1B patterns
- [ ] Support for future buy-one-unit operations (methods prepared but not activated)

### Validation Framework Enhancement
- [ ] `backend/app/utils/validators.py` expanded with:
  - `validate_email(email)` - RFC 5322 simplified validation
  - `validate_color_hex(color)` - #RRGGBB format validation
  - `validate_country_code(code)` - exactly 2 uppercase letters
  - `validate_skills_enum(skills)` - array of allowed skill values
  - `validate_datetime(dt_string)` - ISO 8601 DateTime validation
  - `validate_positive_integer(value, field_name)` - for counts/capacity
  - `validate_non_negative_integer(value, field_name)` - for inventory counts
  - `validate_entity_reference(orion_service, entity_id)` - verify entity exists in Orion
  - All validators return clean data or raise `ValidationError` with descriptive message

### Employee REST Endpoints
- [ ] POST /api/employees → Creates Employee with full validation, returns 201 or 400/404
- [ ] GET /api/employees → Lists all Employees, returns 200
- [ ] GET /api/employees/<id> → Retrieves single Employee, returns 200 or 404
- [ ] PATCH /api/employees/<id> → Updates Employee with validation rerun, returns 200 or 400/404
- [ ] DELETE /api/employees/<id> → Deletes Employee, returns 204

### Shelf REST Endpoints
- [ ] POST /api/shelves → Creates Shelf with validation, returns 201 or 400/404
- [ ] GET /api/shelves → Lists all Shelves, returns 200
- [ ] GET /api/shelves/<id> → Retrieves single Shelf, returns 200 or 404
- [ ] PATCH /api/shelves/<id> → Updates Shelf with validation, returns 200 or 400/404
- [ ] DELETE /api/shelves/<id> → Deletes Shelf, returns 204

### InventoryItem REST Endpoints
- [ ] POST /api/inventory → Creates InventoryItem with full validation, returns 201 or 400/404
- [ ] GET /api/inventory → Lists all InventoryItems, returns 200
- [ ] GET /api/inventory/<id> → Retrieves single InventoryItem, returns 200 or 404
- [ ] PATCH /api/inventory/<id> → Updates InventoryItem with validation, returns 200 or 400/404
- [ ] DELETE /api/inventory/<id> → Deletes InventoryItem, returns 204

### Error Handling and Messages
- [ ] Validation errors (400) include field name and reason: `{"field": "email", "error": "Invalid email format"}`
- [ ] Reference errors (404) include entity type and ID: `{"error": "Store with id 'xyz' not found"}`
- [ ] Complex validation errors list all failed constraints
- [ ] Relationship validation failures include which relationship failed and why
- [ ] All error messages are user-readable and actionable

### Integration Testing
- [ ] All endpoints tested against Issue 1B Product/Store data
- [ ] Creation workflows with valid relationships: Store → Shelf → InventoryItem
- [ ] Negative tests: creation with non-existent references returns 404
- [ ] Negative tests: creation with invalid field values returns 400
- [ ] Update workflows preserve relationships and revalidate
- [ ] Delete workflows succeed when no constraints violated
- [ ] Data integrity verified in Orion after each operation

## Implementation Tasks

### Task C1: Enhance Validation Utilities
- [ ] Update `backend/app/utils/validators.py` with all validators listed above:
  - `validate_email(email)` - basic format check
  - `validate_color_hex(color)` - #RRGGBB pattern
  - `validate_country_code(code)` - 2 alpha chars
  - `validate_skills_enum(skills)` - check against allowed values
  - `validate_datetime(dt_string)` - ISO 8601 format
  - `validate_positive_integer(value, field_name)` - > 0
  - `validate_non_negative_integer(value, field_name)` - >= 0
  - `validate_entity_reference(orion_service, entity_id)` - call OrionService.get_entity()
- [ ] Each validator raises `ValidationError` with descriptive message
- [ ] Export all validators from module for use in services

### Task C2: Implement Employee Service
- [ ] Create `backend/app/services/employee_service.py`:
  - Import OrionService, validators, ngsi_helpers
  - Implement EmployeeService class with methods:
    - `__init__(orion_service)` - constructor
    - `_validate_employee_data(data, is_update=False)` - private method for full validation
    - `create(employee_data)` - validate required fields + relationships, create in Orion
    - `get(employee_id)` - retrieve by ID, 404 if not found
    - `list()` - list all Employees by type filter
    - `update(employee_id, updates)` - validate updates, patch in Orion
    - `delete(employee_id)` - delete by ID
  - Validation checks:
    - Required fields present
    - Email format valid
    - Skills array contains only allowed enum values
    - DateOfContract is valid ISO 8601 DateTime
    - refStore exists in Orion (call validator)
  - Log validation failures and errors for debugging
  - Use ngsi_helpers for format conversion

### Task C3: Implement Shelf Service
- [ ] Create `backend/app/services/shelf_service.py`:
  - Import OrionService, validators, ngsi_helpers
  - Implement ShelfService class with methods:
    - `__init__(orion_service)` - constructor
    - `_validate_shelf_data(data, is_update=False)` - private method for full validation
    - `create(shelf_data)` - validate required fields + relationships, create in Orion
    - `get(shelf_id)` - retrieve by ID, 404 if not found
    - `list()` - list all Shelves
    - `list_by_store(store_id)` - list Shelves for specific Store
    - `update(shelf_id, updates)` - validate updates, patch in Orion
    - `delete(shelf_id)` - delete by ID
  - Validation checks:
    - Required fields present
    - maxCapacity is positive integer
    - refStore exists in Orion (call validator)
    - Optional location validated if provided (geo:json format)
  - Log all operations for debugging
  - Use ngsi_helpers for format conversion

### Task C4: Implement InventoryItem Service
- [ ] Create `backend/app/services/inventory_item_service.py`:
  - Import OrionService, OrionService, validators, ngsi_helpers
  - Implement InventoryItemService class with methods:
    - `__init__(orion_service, shelf_service)` - constructor (needs shelf_service for store lookup)
    - `_validate_inventory_data(data, is_update=False)` - private method for full validation
    - `create(inventory_data)` - validate all relationships, create in Orion
    - `get(inventory_id)` - retrieve by ID, 404 if not found
    - `list()` - list all InventoryItems
    - `list_by_store(store_id)` - list InventoryItems for Store
    - `list_by_shelf(shelf_id)` - list InventoryItems for Shelf
    - `list_by_product(product_id)` - list InventoryItems for Product
    - `update(inventory_id, updates)` - validate updates, patch in Orion
    - `delete(inventory_id)` - delete by ID
  - Validation checks:
    - Required fields present
    - shelfCount and stockCount are non-negative integers
    - All three references exist in Orion:
      - refStore exists
      - refShelf exists
      - refProduct exists
    - Verify Shelf belongs to Store (refShelf.refStore == refStore)
  - Note: buy-one-unit (increment) logic prepared but not called (future issue)
  - Log all operations for debugging

### Task C5: Implement Employee Routes
- [ ] Create `backend/app/routes/employee_routes.py`:
  - Create Blueprint: `employee_bp` with url_prefix="/api/employees"
  - Dependency injection of EmployeeService (via Flask current_app)
  - POST route: validate JSON, call service.create(), return 201 or 400/404
  - GET (no ID) route: call service.list(), return 200
  - GET (with ID) route: call service.get(id), return 200 or 404
  - PATCH route: call service.update(id, updates), return 200 or 400/404
  - DELETE route: call service.delete(id), return 204
  - Error handling: catch ValidationError (400), EntityNotFoundError (404), etc.
  - Format errors for user readability

### Task C6: Implement Shelf Routes
- [ ] Create `backend/app/routes/shelf_routes.py`:
  - Create Blueprint: `shelf_bp` with url_prefix="/api/shelves"
  - Dependency injection of ShelfService (via Flask current_app)
  - POST route: validate JSON, call service.create(), return 201 or 400/404
  - GET (no ID) route: call service.list(), return 200
  - GET (with ID) route: call service.get(id), return 200 or 404
  - PATCH route: call service.update(id, updates), return 200 or 400/404
  - DELETE route: call service.delete(id), return 204
  - Optional query param: ?store=<store_id> on GET to filter by store
  - Error handling: catch ValidationError (400), EntityNotFoundError (404), etc.

### Task C7: Implement InventoryItem Routes
- [ ] Create `backend/app/routes/inventory_routes.py`:
  - Create Blueprint: `inventory_bp` with url_prefix="/api/inventory"
  - Dependency injection of InventoryItemService (via Flask current_app)
  - POST route: validate JSON, call service.create(), return 201 or 400/404
  - GET (no ID) route: call service.list(), return 200
  - GET (with ID) route: call service.get(id), return 200 or 404
  - PATCH route: call service.update(id, updates), return 200 or 400/404
  - DELETE route: call service.delete(id), return 204
  - Optional query params: ?store=<id>, ?shelf=<id>, ?product=<id> for filtering
  - Error handling: catch ValidationError (400), EntityNotFoundError (404), etc.

### Task C8: Instantiate and Register Services
- [ ] Update `backend/app/__init__.py` (Flask factory):
  - Create singleton instances of EmployeeService, ShelfService, InventoryItemService
  - Note: InventoryItemService needs ShelfService for relationship checks
  - Attach services to `app` object: `app.employee_service`, `app.shelf_service`, `app.inventory_service`
  - Register employee_bp, shelf_bp, inventory_bp blueprints with `/api` prefix
  - Ensure error handlers cover all validation exception types

### Task C9: Update Request/Response Schema Documentation
- [ ] Expand `backend/app/models/schemas.py` with:
  - Employee schema (CREATE request, response example, validation rules)
  - Shelf schema (CREATE request, response example, validation rules)
  - InventoryItem schema (CREATE request, response example, validation rules)
  - Relationship documentation (which fields reference which entities)
  - Example error responses for validation failures
- [ ] Use clear formatting for required vs optional fields

### Task C10: Update Project Documentation
- [ ] Update `backend/README.md`:
  - Add example curl requests for all three new endpoints
  - Document validation rules per entity
  - Include example of relationship validation error (404 when Store not found)
  - Add setup instructions for creating initial test data
- [ ] Update `architecture.md`:
  - Document service layer pattern (validation delegation to services)
  - Add endpoint mapping table (all 15 CRUD endpoints)
  - Include error response format documentation
- [ ] Update `data_model.md` if any clarifications emerged during implementation

### Task C11: Comprehensive Manual Testing
- [ ] Create test workflow to verify all relationships:
  1. Create Store (reference from Shelf and Employee)
  2. Create Product (reference from InventoryItem)
  3. Create Shelf with refStore → Store created in step 1
  4. Create Employee with refStore → Store from step 1
  5. Create InventoryItem with all three refs
  6. Verify all entities persisted in Orion
  7. Verify deletion constraints (e.g., delete Store, check if Shelf/Employee handle orphaning)
- [ ] Negative test cases (detailed below)
- [ ] Data integrity verification: round-trip data matches what was stored

### Task C12: Validation Negative Test Cases
- [ ] Test Email validation:
  - Invalid format: "notanemail", expect 400
  - Valid format: "user@example.com", expect success
- [ ] Test Color hex:
  - Invalid: "red", "#FF", expect 400
  - Valid: "#FF5733", "#000000", expect success
- [ ] Test Country code:
  - Invalid: "USA", "U", expect 400
  - Valid: "US", "GB", expect success
- [ ] Test Skills enum:
  - Invalid: ["InvalidSkill"], expect 400
  - Valid: ["MachineryDriving", "WritingReports"], expect success
- [ ] Test DateTime:
  - Invalid: "2026-03", expect 400
  - Valid: "2026-03-23T10:30:00Z", expect success
- [ ] Test Integer constraints:
  - Negative maxCapacity: expect 400
  - Negative shelfCount: expect 400
  - Positive maxCapacity/counts: expect success

## Files to Create/Modify

### New Files
```
backend/app/services/
├── employee_service.py
├── shelf_service.py
└── inventory_item_service.py

backend/app/routes/
├── employee_routes.py
├── shelf_routes.py
└── inventory_routes.py
```

### Modified Files
```
backend/app/utils/
├── validators.py                   (significantly expanded)

backend/app/__init__.py              (service instantiation, blueprint registration)
backend/app/models/schemas.py        (expanded with new entity schemas)
backend/README.md                    (CRUD examples, validation rules)
architecture.md                      (endpoint mapping, service patterns)
data_model.md                        (if clarifications needed)
```

## Testing Instructions

### Prerequisites
- Issues 1A and 1B completed and working
- Backend running: `python run.py`
- Orion/MongoDB running in Docker Compose
- At least one Store and one Product already created (from Issue 1B testing)

### Setup
```bash
# Backend already running from Issue 1A
# Test data (Store, Product) should exist from Issue 1B tests
```

### Manual Test Workflow

#### Employee CRUD with Validation
```bash
# 1. Get Store ID from Issue 1B (or create new)
STORE_ID="urn:ngsi-ld:Store:..."

# 2. Create valid Employee
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "image": "john-doe.jpg",
    "category": "warehouse",
    "email": "john@example.com",
    "dateOfContract": "2024-01-15T09:00:00Z",
    "skills": ["MachineryDriving", "WritingReports"],
    "username": "jdoe",
    "password": "secure123",
    "refStore": "'$STORE_ID'"
  }'

# 3. Test invalid email (expect 400)
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "image": "jane-doe.jpg",
    "category": "sales",
    "email": "invalid-email",
    "dateOfContract": "2024-01-15T09:00:00Z",
    "skills": ["CustomerRelationships"],
    "username": "jdoe2",
    "password": "secure123",
    "refStore": "'$STORE_ID'"
  }'

# 4. Test missing refStore (expect 400)
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Smith",
    "image": "bob-smith.jpg",
    "category": "management",
    "email": "bob@example.com",
    "dateOfContract": "2024-01-15T09:00:00Z",
    "skills": ["WritingReports"],
    "username": "bsmith",
    "password": "secure123"
  }'

# 5. Test invalid refStore (expect 404)
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Brown",
    "image": "alice-brown.jpg",
    "category": "it",
    "email": "alice@example.com",
    "dateOfContract": "2024-01-15T09:00:00Z",
    "skills": ["MachineryDriving"],
    "username": "abrown",
    "password": "secure123",
    "refStore": "urn:ngsi-ld:Store:nonexistent"
  }'

# 6. List and retrieve Employee
curl http://localhost:5000/api/employees
curl http://localhost:5000/api/employees/<employee_id>

# 7. Update Employee
curl -X PATCH http://localhost:5000/api/employees/<employee_id> \
  -H "Content-Type: application/json" \
  -d '{"email": "john.new@example.com"}'

# 8. Delete Employee
curl -X DELETE http://localhost:5000/api/employees/<employee_id>
```

#### Shelf CRUD with Validation
```bash
# 1. Get Store ID
STORE_ID="urn:ngsi-ld:Store:..."

# 2. Create valid Shelf
curl -X POST http://localhost:5000/api/shelves \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics Aisle 1",
    "maxCapacity": 100,
    "refStore": "'$STORE_ID'"
  }'

# 3. Test negative maxCapacity (expect 400)
curl -X POST http://localhost:5000/api/shelves \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid Shelf",
    "maxCapacity": -10,
    "refStore": "'$STORE_ID'"
  }'

# 4. Test non-existent Store (expect 404)
curl -X POST http://localhost:5000/api/shelves \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Orphan Shelf",
    "maxCapacity": 50,
    "refStore": "urn:ngsi-ld:Store:nonexistent"
  }'

# 5. List, retrieve, update, delete (similar patterns)
```

#### InventoryItem CRUD with Complex Validation
```bash
# 1. Have Store, Product, Shelf created
STORE_ID="urn:ngsi-ld:Store:..."
PRODUCT_ID="urn:ngsi-ld:Product:..."
SHELF_ID="urn:ngsi-ld:Shelf:..."

# 2. Create valid InventoryItem
curl -X POST http://localhost:5000/api/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "shelfCount": 25,
    "stockCount": 50,
    "refStore": "'$STORE_ID'",
    "refShelf": "'$SHELF_ID'",
    "refProduct": "'$PRODUCT_ID'"
  }'

# 3. Test negative counts (expect 400)
curl -X POST http://localhost:5000/api/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "shelfCount": -5,
    "stockCount": 10,
    "refStore": "'$STORE_ID'",
    "refShelf": "'$SHELF_ID'",
    "refProduct": "'$PRODUCT_ID'"
  }'

# 4. Test non-existent references (expect 404)
curl -X POST http://localhost:5000/api/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "shelfCount": 10,
    "stockCount": 20,
    "refStore": "urn:ngsi-ld:Store:nonexistent",
    "refShelf": "'$SHELF_ID'",
    "refProduct": "'$PRODUCT_ID'"
  }'

# 5. List, retrieve, update, delete (similar patterns)
```

## GitHub Flow Checklist

- [ ] Create GitHub issue from this description
- [ ] Create branch: `git checkout -b feature/1c-validation-remaining-entities`
- [ ] Commit incrementally (e.g., validators, services, routes per entity)
- [ ] Push branch: `git push origin feature/1c-validation-remaining-entities`
- [ ] Upon completion, merge to main
- [ ] After merge, update `PRD.md`, `architecture.md`, `data_model.md` with implementation details

## Next Steps After This Issue

Once Issues 1A, 1B, and 1C are complete:

1. **Issue #2**: Subscribe to Orion notifications and register external context providers
2. **Issue #3**: Implement Socket.IO for real-time client updates
3. **Issue #4**: Implement buy-one-unit inventory operation
4. **Issue #5+**: Frontend views and UI implementation

## Notes and Considerations

1. **Service Composition**: InventoryItemService depends on ShelfService for relationship verification. Carefully manage dependency injection.

2. **Relationship Cascade**: This issue does NOT handle cascading deletes. Deleting a Store does not automatically delete Shelves/Employees. This is acceptable for this phase.

3. **Validation Performance**: Entity existence checks call Orion synchronously. For large-scale deployments, consider caching.

4. **Error Messages**: Validation error messages should be specific enough for frontend forms to highlight the exact field with issue.

5. **enum Values**: Skills are strictly validated against the enum. Frontend will need to use same enum list for dropdown.

6. **DateTime Format**: ISO 8601 is enforced. Frontend must submit in this format; backend will reject others.

7. **Geo:json Format**: Locations use standard GeoJSON Point format. Validation ensures structure is correct.

8. **Future Enhancement**: Once subscriptions are active (Issue #2), relationship validation could be optimized via subscription events rather than on-demand Orion queries.

9. **Completeness**: After Issue 1C, all CRUD endpoints are functional. Issues #2+ add event handling, UI, and advanced features on top of this solid foundation.
