# Data Model (Final)

This document reflects the final model implemented in the app and matches the Mermaid class diagram rendered in the Home view.

## 1. Canonical Mermaid classDiagram (Exact Home View Definition)

```mermaid
classDiagram
    class Store {
      +id: URI
      +name: Text
      +image: Text
      +address: StructuredValue
      +location: geo:json Point
      +url: Text
      +telephone: Text
      +countryCode: Text(2)
      +capacity: Number
      +description: Text
      +temperature: Number [external]
      +relativeHumidity: Number [external]
      +tweets: StructuredValue [external]
    }

    class Employee {
      +id: URI
      +name: Text
      +image: Text
      +category: Text
      +email: Text
      +dateOfContract: DateTime
      +skills: Array~SkillEnum~
      +username: Text
      +password: Text
      +refStore: URI
    }

    class Product {
      +id: URI
      +name: Text
      +image: Text
      +size: Text
      +price: Number
      +color: Text(hex RGB)
    }

    class Shelf {
      +id: URI
      +name: Text
      +maxCapacity: Integer
      +location: geo:json Point
      +refStore: URI
    }

    class InventoryItem {
      +id: URI
      +shelfCount: Integer
      +stockCount: Integer
      +refStore: URI
      +refShelf: URI
      +refProduct: URI
    }

    Store "1" <-- "0..*" Employee : employs
    Store "1" <-- "0..*" Shelf : contains
    Shelf "1" <-- "0..*" InventoryItem : holds
    Product "1" <-- "0..*" InventoryItem : represented by
    Store "1" <-- "0..*" InventoryItem : contextual stock
```

## 2. Relationship Notes

1. One Store employs zero or more Employees.
2. One Store contains zero or more Shelves.
3. One Shelf holds zero or more InventoryItems.
4. One Product can be represented by zero or more InventoryItems.
5. InventoryItems include a Store reference for contextual stock grouping.

## 3. External Context Attributes

The following Store attributes are externally provided through Orion context provider registrations:
- `temperature`
- `relativeHumidity`
- `tweets`

## 4. Shelf Operations

**Shelf CRUD Operations:**
- **Create:** POST /api/shelves with name, maxCapacity, refStore
- **Read:** GET /api/shelves or GET /api/shelves/{shelf_id}
- **Update:** PATCH /api/shelves/{shelf_id} with new name and/or maxCapacity values
- **Delete:** DELETE /api/shelves/{shelf_id}

The Update (PATCH) operation supports editing shelf name and maximum capacity, enabling users to maintain shelf configuration directly from the Store Detail view.

## 5. Final Sync Statement

This file is synchronized with the exact Mermaid definition currently rendered in the Home view of the frontend and reflects all implemented CRUD operations including shelf updates (PR #55).

## 6. Runtime Note

The frontend networking fix for Docker deployment only changes how the UI reaches the backend and Socket.IO endpoint. It does not alter the entity schema, attributes, or relationships defined above.

The frontend parser repair in frontend/app.js also does not change this schema; it only restores valid JavaScript execution for the existing views.