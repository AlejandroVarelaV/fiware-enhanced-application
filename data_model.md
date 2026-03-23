# Data Model Specification

## 1. Scope and Modeling Approach

This document defines the extended NGSIv2 entity model for the FIWARE enhanced application.

Entities in scope:
- Store
- Employee
- Product
- Shelf
- InventoryItem

The model includes assignment-mandated attributes and relationships, while preserving core operational attributes required by list/detail views and inventory workflows.

## 2. Entity Definitions

## 2.1 Store

### Purpose
Represents a physical store/warehouse where products are stored and sold.

### Attributes
Mandatory extension attributes from assignment:
- url: Text (store website URL)
- telephone: Text
- countryCode: Text (exactly 2 characters)
- capacity: Number (cubic meters)
- description: Text (long-form)
- temperature: Number (provided by external context provider)
- relativeHumidity: Number (provided by external context provider)
- tweets: StructuredValue (provided by external context provider)

Operational/base attributes needed by required views:
- name: Text
- image: Text (image URL/path)
- address: StructuredValue (postal address)
- location: geo:json Point (latitude/longitude)

## 2.2 Employee

### Purpose
Represents an employee assigned to exactly one Store.

### Attributes
Mandatory extension attributes from assignment:
- email: Text (email format)
- dateOfContract: DateTime
- skills: Array<Text> constrained to:
  - MachineryDriving
  - WritingReports
  - CustomerRelationships
- username: Text
- password: Text

Operational/base attributes needed by required views:
- name: Text
- image: Text (photo URL/path)
- category: Text (used for iconized display)

Relationship attribute:
- refStore: Relationship -> Store (exactly one Store per Employee)

## 2.3 Product

### Purpose
Represents a product type stored on shelves and sold from inventory.

### Attributes
Mandatory extension attribute from assignment:
- color: Text (RGB hexadecimal format, for example #FFAA00)

Operational/base attributes needed by required views and subscriptions:
- name: Text
- image: Text (image URL/path)
- size: Text
- price: Number

## 2.4 Shelf

### Purpose
Represents a shelf inside a Store with finite capacity.

### Attributes
- name: Text
- maxCapacity: Integer (maximum units shelf can hold)
- location: geo:json Point (optional positional metadata inside/outside store context)

Relationship attribute:
- refStore: Relationship -> Store (each Shelf belongs to one Store)

Derived/visual value used in UI:
- fillLevelPercent: Computed value for progress bar coloring (derived from shelf inventory totals vs maxCapacity)

## 2.5 InventoryItem

### Purpose
Represents product inventory counts at Store/Shelf granularity.

### Attributes
- shelfCount: Integer (units for Product on a specific Shelf)
- stockCount: Integer (total units for Product in the Store context represented by this row)

Relationship attributes:
- refProduct: Relationship -> Product
- refShelf: Relationship -> Shelf
- refStore: Relationship -> Store

Operational rule:
- Buy-one-unit operation decrements shelfCount and stockCount by 1 using Orion patch increment semantics.

## 3. Relationship Model

Mandatory relationship chain:
1. Employee -> Store
   - Cardinality: many Employees to one Store.
   - Constraint: each Employee works in one and only one Store.

2. Store -> Shelf
   - Cardinality: one Store to many Shelves.

3. Shelf -> InventoryItem
   - Cardinality: one Shelf to many InventoryItems.

4. Product -> InventoryItem
   - Cardinality: one Product to many InventoryItems.

Additional contextual relation used in data access:
- InventoryItem -> Store (denormalized access path for grouped queries by Store).

## 4. Business Constraints

1. countryCode must be exactly two characters.
2. skills must contain only allowed enum values.
3. Product color must be stored as RGB hexadecimal text.
4. An Employee must always reference one valid Store.
5. A Shelf must always reference one valid Store.
6. An InventoryItem must reference valid Product, Shelf, and Store entities.
7. In Product detail view, adding InventoryItem is limited to Shelves in the selected Store that do not already contain that Product.
8. In Store detail view, adding InventoryItem to Shelf is limited to Products not already present in that Shelf.

## 5. External Context Attribution Rules

Store attributes temperature, relativeHumidity, and tweets are externally provided context attributes:
- Registered in Orion at application startup.
- Resolved from tutorial external context providers.
- Treated as standard Store attributes at query/render time.
- `tweets` shall be modeled as `StructuredValue` to preserve provider payload structure.

## 6. NGSIv2-Oriented Attribute Typing Guidance

Recommended NGSIv2 attribute typing:
- Text-like values: type Text
- Numeric counts/capacity/metrics: type Integer or Number as appropriate
- Dates: type DateTime
- Enumerated lists: type StructuredValue or Array representation
- tweets payload: type StructuredValue
- Geospatial coordinates: type geo:json
- Entity references: Relationship-style URI fields (for NGSIv2 often represented as Text URI fields with ref naming convention)

## 7. Mermaid UML Entity Diagram

The Mermaid UML diagram defined below shall be rendered in the Home view of the application.

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

## 8. View Traceability Matrix

- Products list view requires: Product.image, Product.name, Product.color, Product.size.
- Stores list view requires: Store.image, Store.name, Store.countryCode, Store.temperature, Store.relativeHumidity.
- Employees list view requires: Employee.image, Employee.name, Employee.category, Employee.skills.
- Product detail grouping requires: InventoryItem.stockCount by Store and InventoryItem.shelfCount by Shelf.
- Store detail grouped table requires: Shelf.name, Shelf.maxCapacity, Product(image/name/price/size/color), InventoryItem.stockCount, InventoryItem.shelfCount.
- Store map/detail requires: Store.location and Store.image.

## 9. Data Initialization Targets (Assignment-Aligned)

Initial load script must include at least:
- 4 Employees
- 4 Stores
- 4 Shelves per Store
- 10 Products
- Enough InventoryItems to guarantee at least 4 Products per Shelf

This initialization baseline ensures all mandatory UI views and grouping behaviors can be demonstrated.