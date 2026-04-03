# System Architecture (Final)

## 1. Final Component Architecture

United Supermarket is implemented as a FIWARE-centered architecture with these runtime components:

1. Orion Context Broker (NGSIv2) - central context data broker.
2. Tutorial context provider container - external data source for Store attributes.
3. Flask backend - API orchestration, validation, Orion proxy/service logic, startup registration/subscription, notification callback handling.
4. Static frontend (HTML/CSS/JS served by nginx) - user UI and interaction logic.
5. Socket.IO channel - backend to browser real-time notification delivery.

### Component Diagram (Description)
- Frontend calls Flask backend via REST endpoints under `/api/*` through the nginx reverse proxy in the frontend container.
- Flask backend calls Orion NGSIv2 endpoints for entity operations.
- Orion resolves external Store attributes through registered provider at `http://tutorial:3000/api/v2`.
- Orion sends subscription callbacks to backend notification endpoint.
- Backend forwards callback payloads to connected clients through Socket.IO event `orion_notification`.
- Frontend resolves the API and Socket.IO base URL at runtime from the browser origin, with a localhost:5000 fallback for direct development access.

## 2. Runtime Services (docker-compose)

- `orion-v2` (port 1026)
- `mongo-db` (port 27017)
- `tutorial` (ports 3002 and 3001; provider endpoint at `http://tutorial:3000/api/v2`)
- `backend` (port 5000)
- `frontend` (port 3000 mapped to nginx 80)

Frontend nginx also proxies `/api/` and `/socket.io/` requests to the backend container so the browser can use same-origin requests on port 3000.

## 3. Complete Backend API Endpoint Table

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/products | Create Product |
| GET | /api/products | List Products |
| GET | /api/products/{product_id} | Get Product by id |
| PATCH | /api/products/{product_id} | Update Product |
| DELETE | /api/products/{product_id} | Delete Product |
| POST | /api/stores | Create Store |
| GET | /api/stores | List Stores |
| GET | /api/stores/{store_id} | Get Store by id |
| PATCH | /api/stores/{store_id} | Update Store |
| DELETE | /api/stores/{store_id} | Delete Store |
| POST | /api/employees | Create Employee |
| GET | /api/employees | List Employees |
| GET | /api/employees/{employee_id} | Get Employee by id |
| PATCH | /api/employees/{employee_id} | Update Employee |
| DELETE | /api/employees/{employee_id} | Delete Employee |
| POST | /api/shelves | Create Shelf |
| GET | /api/shelves | List Shelves |
| GET | /api/shelves/{shelf_id} | Get Shelf by id |
| PATCH | /api/shelves/{shelf_id} | Update Shelf |
| DELETE | /api/shelves/{shelf_id} | Delete Shelf |
| POST | /api/inventory-items | Create InventoryItem |
| GET | /api/inventory-items | List InventoryItems |
| GET | /api/inventory-items/{inventory_item_id} | Get InventoryItem by id |
| PATCH | /api/inventory-items/{inventory_item_id} | Update InventoryItem |
| DELETE | /api/inventory-items/{inventory_item_id} | Delete InventoryItem |
| PATCH | /api/inventory-items/{inventory_item_id}/buy | Atomic decrement of shelfCount and stockCount |
| POST | /api/notifications | Orion subscription callback receiver |
| GET | /api/registrations | Proxy Orion registrations list |
| GET | /api/health | Backend and Orion connectivity health check |

## 4. Context Provider Registrations

Registered at startup from backend service layer:

1. `store-environment-context-provider`
- Entity type: `Store`
- `idPattern`: `.*`
- Attributes: `temperature`, `relativeHumidity`
- Provider URL: `http://tutorial:3000/api/v2`
- `legacyForwarding: true`

2. `store-tweets-context-provider`
- Entity type: `Store`
- `idPattern`: `.*`
- Attributes: `tweets`
- Provider URL: `http://tutorial:3000/api/v2`
- `legacyForwarding: true`

Startup behavior:
- Registration attempts are isolated; errors are logged and startup continues.

## 5. Subscription Types

Registered at backend startup, deduplicated by description:

1. `product-price-change-subscription`
- Subject entity type: `Product`
- Condition attrs: `price`
- Notification attrs: `id`, `type`, `name`, `price`
- Notification URL: from `ORION_NOTIFICATION_URL`

2. `inventory-low-stock-subscription`
- Subject entity type: `InventoryItem`
- Condition attrs: `stockCount`
- Condition expression: `stockCount < LOW_STOCK_THRESHOLD` (default 5)
- Notification attrs: `id`, `type`, `stockCount`, `refProduct`, `refShelf`, `refStore`
- Notification URL: from `ORION_NOTIFICATION_URL`

## 6. Notification and Real-Time Flow

1. Orion detects subscription condition and POSTs to `/api/notifications`.
2. Flask backend receives payload.
3. Backend `NotificationEventService` emits Socket.IO event `orion_notification`.
4. Frontend Socket.IO client receives event and updates notification UI.

Note:
- Frontend also contains `price_change` listener logic, but backend currently emits `orion_notification` only.

## 7. Key Configuration Inputs

Backend runtime variables used in code:
- `FLASK_CONFIG`
- `FLASK_PORT`
- `LOG_LEVEL`
- `CORS_ORIGINS`
- `ORION_URL`
- `ORION_FIWARE_SERVICE`
- `ORION_FIWARE_SERVICEPATH`
- `ORION_NOTIFICATION_URL`
- `LOW_STOCK_THRESHOLD`
- `HEALTH_CHECK_TIMEOUT`

## 8. Architectural Conclusion

The final architecture is fully aligned with the implemented repository: Orion-centered context management, startup registrations/subscriptions, callback ingestion, and Socket.IO real-time propagation to the static frontend.

The frontend script at frontend/app.js is back to a valid parse state and no longer contains the truncated edit fragments that caused browser syntax failures.