# Product Requirements Document (PRD)

## 1. Project Overview

### 1.1 Project Name
Aplicacion FIWARE mejorada (Practice 2 - Data Management in Smart Environments)

### 1.2 Purpose
This project extends the Practice 1 FIWARE application to implement advanced NGSIv2 capabilities in a smart retail/warehouse scenario. The solution integrates Orion Context Broker, Dockerized runtime services, a Flask backend, and an HTML/CSS/JavaScript frontend.

The core extension goals are:
- Registering external context providers in Orion at application startup.
- Creating and consuming NGSIv2 subscriptions.
- Receiving Orion notifications in the backend and propagating them to browser clients in real time.
- Extending the data model and user interface with new entities, attributes, visualizations, and interaction workflows.

### 1.3 Scope
In scope:
- NGSIv2 entity management and relationships.
- CRUD operations for domain entities.
- Subscription management and notification handling.
- Real-time server-to-client updates via Socket.IO.
- Enhanced bilingual UI (English/Spanish), Dark/Light mode, and required visual behaviors.

Out of scope:
- Features not explicitly required by the assignment specification.

## 2. Objectives

1. Enhance the existing FIWARE solution with NGSIv2 registrations and subscriptions.
2. Implement real-time notification flow from Orion to Flask and from Flask to the browser.
3. Extend the domain model for Employee, Store, and Product as specified.
4. Provide rich UI views for Products, Stores, Employees, Store detail, and Stores Map.
5. Include geospatial and immersive visualization components (Leaflet and Three.js).
6. Apply GitHub Flow for each implementation action and maintain project documentation after each issue.

## 3. Stakeholders and Users

- Student development team (primary implementers).
- Instructor/evaluator (acceptance and grading).
- End user role: Store operator/manager monitoring stock, prices, shelves, environment metrics, and notifications.

## 4. Functional Requirements

## 4.1 Data Management and CRUD

### FR-1. CRUD Coverage
The application shall support create, read, update, and delete workflows for:
- Product
- Store
- Employee
- Shelf
- InventoryItem

### FR-2. Entity Lists with Actions
The Products, Stores, and Employees views shall show entity tables where each row includes:
- Image
- Name
- Delete action (link-style button)
- Edit action (link-style button)

Additional attributes per entity list row:
- Product: color, size
- Store: countryCode, temperature, relativeHumidity
- Employee: category, skills

Each of these views shall include an Add New action (link-style button) at the beginning of the view.

## 4.2 Detailed Views and Interaction Rules

### FR-3. Product Detail View
The Product detail page shall display InventoryItems grouped by Store:
- For each Store group header row: Store name and stockCount for the product.
- Under each Store group: rows for each Shelf containing the product, showing shelfCount.

Each Store group header shall include an Add InventoryItem action that:
- Creates a new InventoryItem for the current Product.
- Restricts Shelf selection to Shelves in that Store that do not already contain the Product.
- Uses a dynamically loaded select input for valid Shelf options.

### FR-4. Store Detail View
The Store detail page shall include all items below:
1. Store location rendered on a map using Leaflet.
2. Immersive virtual tour of the Store using Three.js, showing Shelves and contained Products, including:
   - Units per shelf
   - Total stock units
3. InventoryItems table grouped by Shelf:
   - Shelf group header row with Shelf name and fill level.
   - Fill level represented using a progress bar.
   - Inventory rows showing Product attributes: image, name, price, size, color, stockCount, shelfCount.
4. Add Shelf action for the current Store.
5. Edit Shelf action in each Shelf group header.
6. Add InventoryItem action in each Shelf group header that:
   - Adds another Product not currently present in that Shelf.
   - Restricts Product selection to not-yet-present Products.
   - Uses a dynamically loaded select input.
7. Buy one unit action per InventoryItem that sends Orion patch request:
   - Method and endpoint:
     PATCH /v2/entities/<inventoryitem_id>/attrs
   - Body:
     {
       "shelfCount": {"type":"Integer", "value": {"$inc": -1}},
       "stockCount": {"type":"Integer", "value": {"$inc": -1}}
     }
8. Temperature and relative humidity displayed with:
   - Distinct icons based on value ranges.
   - Distinct colors based on value ranges.
   - Numeric value next to each icon.
9. Store tweets section shown after the InventoryItems table.
   - Each tweet prefixed by an icon resembling X (Twitter).
10. Notifications section showing each notification received (for example, low stock notifications for products in the Store).

## 4.3 Home and Global Navigation

### FR-5. Home View
Home shall render the entity UML diagram (Mermaid) for the extended model.

### FR-6. Navigation Bar
The navigation bar shall:
- Include sections: Home, Products, Stores, Employees, Stores Map.
- Highlight the active section.
- Remain visible during scroll (sticky behavior).

### FR-7. Stores Map View
The Stores Map view shall:
- Render Store images on a Leaflet map.
- Show a hover card with image and key Store attributes.
- Navigate to Store detail when a Store marker/image is clicked.

## 4.4 NGSIv2 Registrations, Subscriptions, and Notifications

### FR-8. External Context Providers Registration
At application startup, the backend shall register external context providers in Orion for Store attributes:
- temperature
- relativeHumidity
- tweets

These providers are served by the tutorial container applications.

### FR-9. Orion Subscriptions
The application shall create Orion subscriptions equivalent to the NGSIv2 subscriptions tutorial for:
- Product price change notifications triggered by updates to `Product.price`.
- Low stock notifications for Product in Store triggered when `InventoryItem.stockCount` crosses a configured low-stock threshold.

### FR-10. Orion Notification Callback Endpoint
Because Orion runs in Docker, notification callback URLs shall use host.docker.internal to reference host-local backend endpoints instead of localhost.
Callback configuration shall never use localhost for Orion-to-backend notification delivery; it shall use host.docker.internal (for example, `http://host.docker.internal:<backend_port>/...`).

### FR-11. Server-to-Client Notification Forwarding
The backend shall receive Orion notifications and forward relevant events to browser clients using Flask-SocketIO.
The frontend shall receive and process those events using Socket.IO.

### FR-12. Cross-View Price Synchronization
When a product price-change notification is received, the updated price shall be reflected in all views where that Product is shown.

## 4.5 Data Input Forms

### FR-13. Input Variety
Data-entry forms shall use a wide variety of HTML input types where appropriate.

### FR-14. Validation
Forms shall include:
- Native HTML validation rules.
- Complementary JavaScript validation rules.

## 4.6 Visual and UX Requirements

### FR-15. CSS-First Principle
If an effect can be implemented with CSS or JavaScript, CSS shall be preferred.

### FR-16. Avoid Dynamic HTML Generation
JavaScript shall prioritize updating existing DOM element values and attributes rather than generating new HTML whenever feasible.

### FR-17. Employee View Animation
Employee photo shall enlarge on hover using CSS transition.

### FR-18. Store View Animation
Store photo shall enlarge and rotate 360 degrees on hover using CSS transition/animation.

### FR-19. Shelf Fill Progress Colors
Shelf fill progress bars shall use different colors according to fill levels.

### FR-20. Visual Information Compression
The UI shall use colors, icons, and compact visual elements to reduce table density and improve readability, including examples such as:
- color displayed as a color square
- country represented with a flag icon
- category represented with category-specific icon
- skills represented with skill-specific icons

### FR-21. Internationalization and Theme
The UI shall support:
- English and Spanish language switching.
- Dark mode and Light mode via toggle.

## 5. Non-Functional Requirements

## 5.1 Usability and UX
- Consistent navigation and discoverable CRUD actions.
- Clear visual grouping for Product-by-Store and Store-by-Shelf tables.
- Accessibility-oriented form validation feedback and icon usage.
- Responsive layout for desktop and mobile devices.
- Bilingual labels/messages and persistent user language preference during the session.
- Dark/Light mode with sufficient contrast and preserved readability.

## 5.2 Performance
- Store list and detail views should remain responsive under concurrent notification events.
- WebSocket notifications should be propagated with low latency to connected clients.
- Dynamic select inputs (eligible Shelves/Products) should load only required options.
- Minimize full-page reloads by updating affected UI components.

## 5.3 Scalability
- Architecture shall preserve separation between data broker (Orion), backend orchestration (Flask), and UI rendering.
- Notification handling should support multiple simultaneous browser sessions.
- Data model and routes should support adding new attributes/entities without breaking existing flows.
- Dockerized services shall allow isolated scaling and independent lifecycle management.

## 5.4 Reliability and Data Consistency
- Orion operations shall include error handling and user feedback for failed CRUD updates.
- Buy-one-unit action shall update shelfCount and stockCount atomically via Orion patch increment semantics.
- Subscription and context-provider registration routines shall be repeatable at application startup.

## 5.5 Maintainability and Delivery Constraints
- Use GitHub Flow for every implementation issue (plan, issue, branch, commit/push, merge/PR).
- Keep PRD.md, architecture.md, and data_model.md updated after each completed issue.
- Exclude .venv and __pycache__ from project archives through .gitignore.
- Deliver requirements.txt generated with pip freeze > requirements.txt.

## 5.6 Workflow Governance and Documentation Policy
- GitHub Flow is the mandatory development workflow for this project and shall be followed for every implementation action.
- Documentation updates are continuous: PRD.md, architecture.md, and data_model.md shall be reviewed and updated immediately after each completed issue.
- AGENTS.md may define repository-level operational rules that enforce documentation updates after each issue and must be aligned with this PRD policy.

## 6. User Stories

1. As a store manager, I want to view all Stores with key environmental indicators so that I can quickly identify risky humidity/temperature conditions.
2. As an inventory operator, I want to buy one product unit directly from a Store inventory row so that stock is updated immediately in Orion.
3. As an inventory operator, I want Product inventory grouped by Store and Shelf so that I can understand where stock is physically located.
4. As an inventory operator, I want Store inventory grouped by Shelf with color-coded fill levels so that I can prioritize restocking.
5. As a catalog manager, I want to create and edit Products including color and size so that product metadata is complete and consistent.
6. As an HR/admin user, I want to manage Employees with skills, contract date, and Store assignment so that staffing data stays accurate.
7. As a user, I want forms with clear validation messages so that I can correct input errors before submission.
8. As a user, I want the interface available in English and Spanish so that I can work in my preferred language.
9. As a user, I want to switch between Dark and Light mode so that I can choose comfortable visual settings.
10. As a user, I want a Stores Map with hover cards and click-through navigation so that I can spatially explore Store information.
11. As a user, I want Store location displayed on detail view map so that I can verify geographic placement.
12. As a user, I want an immersive Three.js Store tour so that I can inspect shelf/product distribution visually.
13. As an operations user, I want to see tweets and environmental external context for each Store so that I can include external signals in decisions.
14. As an operations user, I want real-time low-stock and price-change notifications so that I can react without refreshing pages.
15. As an operations user, I want product price updates propagated to all relevant views so that all displayed data remains synchronized.

## 7. Acceptance Criteria Summary

A release candidate is acceptable when:
- All mandatory views and CRUD workflows are implemented.
- Required NGSIv2 registrations/subscriptions are active and functional.
- Orion notifications reach backend callback endpoints using host.docker.internal and are pushed to clients via Socket.IO.
- Required visual, animation, iconography, i18n, and theme features are present.
- Documentation and delivery constraints are satisfied (README, requirements.txt, archive policy, GitHub Flow evidence).

## 8. Implementation Status

### 8.1 Implemented Features

Backend (Issues 1C, 2A, 2B):
- CRUD endpoints implemented for Product, Store, Employee, Shelf, and InventoryItem.
- Validation implemented in service layer (required fields, formats, numeric constraints, reference existence checks).
- Orion integration implemented through OrionService.
- SubscriptionService implemented and executed at startup to register Orion subscriptions (price change and low stock).
- Notification callback endpoint implemented at `/api/notifications`.
- Flask-SocketIO integration implemented in backend and notification forwarding service emits real-time events.

Frontend (Issues 2C, 2D + Store detail completion):
- Base frontend implemented as vanilla HTML/CSS/JavaScript (no frameworks).
- CRUD views implemented for Products, Stores, and Employees.
- Store detail implemented with grouped rendering: Store -> Shelves -> InventoryItems.
- Store detail shows Products inside each Shelf with attributes:
   - image
   - name
   - price
   - size
   - color
- Store detail shows both counts in each InventoryItem row:
   - shelfCount
   - stockCount
- Shelf capacity progress bar implemented in Store detail.
- Store detail actions implemented:
   - Add Shelf
   - Add InventoryItem
   - Buy product

Purchase flow status:
- Buy product action uses `PATCH /api/inventory-items/<id>`.
- PATCH payload decrements both `shelfCount` and `stockCount` by 1.
- Values used in PATCH are taken directly from backend InventoryItem fields.
- After successful PATCH, Store detail view is refreshed using existing fetch/render flow.

### 8.2 Pending Features

- Frontend Socket.IO client integration and in-UI real-time notification rendering.
- Store map view (Leaflet) and store-detail map section.
- Three.js immersive store visualization.
- Advanced UI features requested by assignment (full iconography set, bilingual i18n toggle, dark/light mode polish, advanced visuals).
