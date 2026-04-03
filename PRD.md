# Product Requirements Document (Final Sync)

## 1. Project Overview

### 1.1 Project Name
United Supermarket - FIWARE Enhanced Application

### 1.2 Goal
Deliver a Manchester United themed smart retail application on FIWARE NGSIv2 with:
- Orion Context Broker as source of truth.
- Flask backend for orchestration, validation, subscriptions, and notifications.
- Static frontend for CRUD, visualization, and real-time updates.

### 1.3 Scope
In scope:
- CRUD for Product, Store, Employee, Shelf, InventoryItem.
- Context provider registrations for Store external attributes.
- Orion subscriptions and callback handling.
- Socket.IO notification forwarding.
- Required frontend views and visual behaviors.

Out of scope:
- Features not implemented in this repository.

## 2. Final Assignment Requirements Status

Each requirement from the assignment and issue chain is marked with final implementation status.

1. ✅ Done - CRUD for Product, Store, Employee, Shelf, InventoryItem is implemented in backend routes/services and wired in frontend views.
2. ✅ Done - List views include row-level edit/delete actions and entity-specific fields (products, stores, employees).
3. ✅ Done - Product Detail view groups inventory by Store and Shelf, includes per-store add-to-shelf flow with shelf eligibility filtering.
4. 🟡 Partial - Store Detail includes grouped inventory, add shelf, add inventory item, buy action, weather, tweets, notifications, and 3D tour; explicit Edit Shelf action in each shelf header is not implemented.
5. ✅ Done - Home view renders Mermaid entity model diagram for Store, Employee, Product, Shelf, InventoryItem.
6. ✅ Done - Sticky navigation includes Home, Products, Stores, Employees, Stores Map with active section highlight.
7. ✅ Done - Stores Map is implemented with Leaflet markers, hover card, and click-through to store detail context.
8. ✅ Done - Orion context providers are registered at backend startup for temperature/relativeHumidity and tweets via tutorial container.
9. ✅ Done - Backend exposes registrations inspection endpoint GET /api/registrations.
10. ✅ Done - Orion subscriptions are registered at startup for Product.price change and InventoryItem low stock threshold.
11. ✅ Done - Orion callback endpoint receives notifications and forwards them through Socket.IO (`orion_notification`).
12. 🟡 Partial - Cross-view price synchronization listener exists in frontend (`price_change`), but backend does not emit a dedicated `price_change` event; generic Orion notifications are emitted.
13. ✅ Done - Forms use varied input types (text, number, color, email, password, date, select, multiselect).
14. ✅ Done - Native HTML validation plus JavaScript validation logic is implemented in frontend and backend services.
15. ✅ Done - CSS-first visual effects are used for hover/animation/progress-color behavior.
16. ✅ Done - Frontend logic primarily updates existing elements/attributes and reuses templates for rendering.
17. ✅ Done - Employee image hover zoom is implemented with CSS transition.
18. ✅ Done - Store image hover zoom + 360-degree rotation is implemented with CSS transition.
19. ✅ Done - Shelf fill progress bars are color-coded by capacity level.
20. ✅ Done - Visual compression requirements implemented (color swatches, country flags, category icons, skills icons/tooltips).
21. ✅ Done - Internationalization EN/ES and dark/light theme toggle with localStorage persistence are implemented.
22. ✅ Done - Orion subscription setup avoids duplicates by checking existing descriptions before creation.
23. ✅ Done - Notification flow is resilient: startup registration failures are logged and do not crash app bootstrap.
24. ✅ Done - GitHub Flow was followed for this final synchronization issue with dedicated issue + branch + merge workflow.

## 3. Implemented Feature Baseline

### 3.1 Backend
- Flask app factory with CORS, error handlers, service wiring, and startup registration routines.
- Route blueprints:
  - `/api/products`
  - `/api/stores`
  - `/api/employees`
  - `/api/shelves`
  - `/api/inventory-items`
  - `/api/inventory-items/<id>/buy`
  - `/api/notifications`
  - `/api/registrations`
  - `/api/health`
- Orion service layer for NGSIv2 CRUD, subscriptions, and connectivity checks.

### 3.2 Frontend
- Views: Home, Products, Product Detail, Stores, Store Detail, Employees, Stores Map.
- Store detail enhancements: weather badges, tweets list, real-time notifications panel, 3D tour, capacity bars, buy flow.
- Product detail enhancements: grouped inventory and per-store add-to-shelf.
- Global UX: sticky nav, theme toggle, EN/ES localization.

### 3.3 Real-Time and External Context
- External context provider registration for Store environmental and tweets attributes.
- Orion subscriptions for price change and low stock.
- Notification callback endpoint with Socket.IO fan-out to clients.

## 4. Known Gaps / Partial Items

1. Dedicated backend `price_change` Socket.IO emission is not implemented (frontend listener exists).
2. Store Detail does not provide explicit shelf edit action in shelf header.
3. Some deep validation constraints are not enforced end-to-end (for example strict color format and strict 2-char country code enforcement in all flows).

## 5. Acceptance Summary

The project is functionally complete for the requested final delivery scope, with the partial items documented above. Core FIWARE integration, CRUD workflows, external context, subscriptions, real-time notifications, and UI requirements are implemented and operational.