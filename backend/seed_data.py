"""Initial backend data seeding script.

Run with:
    python seed_data.py
"""

from dotenv import load_dotenv

from app.utils.ngsi_helpers import from_ngsi, to_ngsi


def seed_data(app=None):
    """Seed initial Product, Store, Employee, Shelf and InventoryItem entities.

    This function is structured to be callable from elsewhere in the future
    (for example, from create_app) by passing an app instance.
    """
    load_dotenv()

    if app is None:
        from app import create_app
        flask_app = create_app()
    else:
        flask_app = app

    with flask_app.app_context():
        product_service = flask_app.product_service
        employee_service = flask_app.employee_service
        shelf_service = flask_app.shelf_service
        inventory_item_service = flask_app.inventory_item_service
        orion_service = flask_app.orion_service

        existing_products = product_service.list()
        if existing_products:
            print('Seed skipped: products already exist, no data duplicated.')
            return

        products_data = [
            {'id': 'product-001', 'name': 'Red Apple', 'image': '/img/products/apple.jpg', 'size': '1kg', 'price': 2.5, 'color': '#D12A2A'},
            {'id': 'product-002', 'name': 'Banana Pack', 'image': '/img/products/banana.jpg', 'size': '1kg', 'price': 2.1, 'color': '#F2D22E'},
            {'id': 'product-003', 'name': 'Whole Milk', 'image': '/img/products/milk.jpg', 'size': '1L', 'price': 1.6, 'color': '#F4F4F4'},
            {'id': 'product-004', 'name': 'Brown Bread', 'image': '/img/products/bread.jpg', 'size': '500g', 'price': 1.4, 'color': '#8B5A2B'},
            {'id': 'product-005', 'name': 'White Rice', 'image': '/img/products/rice.jpg', 'size': '1kg', 'price': 2.9, 'color': '#EFEDE7'},
            {'id': 'product-006', 'name': 'Olive Oil', 'image': '/img/products/oliveoil.jpg', 'size': '1L', 'price': 5.8, 'color': '#B8A22A'},
            {'id': 'product-007', 'name': 'Coffee Beans', 'image': '/img/products/coffee.jpg', 'size': '500g', 'price': 7.2, 'color': '#4E342E'},
            {'id': 'product-008', 'name': 'Orange Juice', 'image': '/img/products/orangejuice.jpg', 'size': '1L', 'price': 2.7, 'color': '#F08C00'},
            {'id': 'product-009', 'name': 'Tomato Sauce', 'image': '/img/products/tomatosauce.jpg', 'size': '350g', 'price': 1.9, 'color': '#C62828'},
            {'id': 'product-010', 'name': 'Pasta', 'image': '/img/products/pasta.jpg', 'size': '500g', 'price': 1.3, 'color': '#E9D8A6'},
        ]

        stores_data = [
            {
                'id': 'store-001',
                'name': 'Old Trafford Market',
                'image': '/img/stores/store.jpg',
                'address': {'streetAddress': '1 North Ave', 'addressLocality': 'Springfield'},
                'location': {'type': 'Point', 'coordinates': [-3.7038, 40.4168]},
                'url': 'https://north.example.com',
                'telephone': '+34-111-111-111',
                'countryCode': 'ES',
                'capacity': 1200,
                'description': 'Main northern store',
                'temperature': {'type': 'Float', 'value': 19.5},
                'relativeHumidity': {'type': 'Float', 'value': 0.62},
                'tweets': {'type': 'StructuredValue', 'value': []},
            },
            {
                'id': 'store-002',
                'name': 'Salford Quays Store',
                'image': '/img/stores/store.jpg',
                'address': {'streetAddress': '25 South Blvd', 'addressLocality': 'Springfield'},
                'location': {'type': 'Point', 'coordinates': [-3.6938, 40.4068]},
                'url': 'https://south.example.com',
                'telephone': '+34-222-222-222',
                'countryCode': 'ES',
                'capacity': 1100,
                'description': 'Main southern store',
                'temperature': {'type': 'Float', 'value': 22.0},
                'relativeHumidity': {'type': 'Float', 'value': 0.71},
                'tweets': {'type': 'StructuredValue', 'value': []},
            },
            {
                'id': 'store-003',
                'name': 'Stretford Mall',
                'image': '/img/stores/store.jpg',
                'address': {'streetAddress': '14 East St', 'addressLocality': 'Springfield'},
                'location': {'type': 'Point', 'coordinates': [-3.6838, 40.4168]},
                'url': 'https://east.example.com',
                'telephone': '+34-333-333-333',
                'countryCode': 'ES',
                'capacity': 1300,
                'description': 'Main eastern store',
                'temperature': {'type': 'Float', 'value': 18.0},
                'relativeHumidity': {'type': 'Float', 'value': 0.58},
                'tweets': {'type': 'StructuredValue', 'value': []},
            },
            {
                'id': 'store-004',
                'name': 'Deansgate Express',
                'image': '/img/stores/store.jpg',
                'address': {'streetAddress': '50 West Rd', 'addressLocality': 'Springfield'},
                'location': {'type': 'Point', 'coordinates': [-3.7138, 40.4168]},
                'url': 'https://west.example.com',
                'telephone': '+34-444-444-444',
                'countryCode': 'ES',
                'capacity': 1250,
                'description': 'Main western store',
                'temperature': {'type': 'Float', 'value': 24.5},
                'relativeHumidity': {'type': 'Float', 'value': 0.79},
                'tweets': {'type': 'StructuredValue', 'value': []},
            },
        ]

        employees_data = [
            {
                'id': 'employee-001',
                'name': 'Alex Martin',
                'image': '/img/employees/alex.jpg',
                'category': 'Manager',
                'email': 'alex.martin@example.com',
                'dateOfContract': '2024-01-15T09:00:00Z',
                'skills': ['WritingReports', 'CustomerRelationships'],
                'username': 'alex.martin',
                'password': 'pass1234',
                'refStore': 'store-001',
            },
            {
                'id': 'employee-002',
                'name': 'Bea Lopez',
                'image': '/img/employees/bea.jpg',
                'category': 'Operator',
                'email': 'bea.lopez@example.com',
                'dateOfContract': '2024-02-20T09:00:00Z',
                'skills': ['MachineryDriving'],
                'username': 'bea.lopez',
                'password': 'pass1234',
                'refStore': 'store-002',
            },
            {
                'id': 'employee-003',
                'name': 'Chris Vega',
                'image': '/img/employees/chris.jpg',
                'category': 'Supervisor',
                'email': 'chris.vega@example.com',
                'dateOfContract': '2024-03-10T09:00:00Z',
                'skills': ['CustomerRelationships', 'MachineryDriving'],
                'username': 'chris.vega',
                'password': 'pass1234',
                'refStore': 'store-003',
            },
            {
                'id': 'employee-004',
                'name': 'Dana Ruiz',
                'image': '/img/employees/dana.jpg',
                'category': 'Clerk',
                'email': 'dana.ruiz@example.com',
                'dateOfContract': '2024-04-05T09:00:00Z',
                'skills': ['WritingReports'],
                'username': 'dana.ruiz',
                'password': 'pass1234',
                'refStore': 'store-004',
            },
        ]

        created_products = [product_service.create(product) for product in products_data]

        created_stores = []
        for store in stores_data:
            ngsi_store = to_ngsi(store)
            # Keep explicit NGSIv2 typing for external provider placeholders.
            ngsi_store['temperature'] = store['temperature']
            ngsi_store['relativeHumidity'] = store['relativeHumidity']
            ngsi_store['tweets'] = store['tweets']

            created_store = orion_service.create_entity('Store', ngsi_store)
            created_stores.append(from_ngsi(created_store))

        created_employees = [employee_service.create(employee) for employee in employees_data]

        shelves_by_store = {}
        shelf_names_by_store = {
            'store-001': ['Fresh Produce A', 'Dairy & Refrigerated', 'Bakery & Bread', 'Beverages'],
            'store-002': ['Fresh Produce B', 'Dairy & Refrigerated', 'Bakery & Bread', 'Beverages'],
            'store-003': ['Fresh Produce C', 'Dairy & Refrigerated', 'Bakery & Bread', 'Beverages'],
            'store-004': ['Fresh Produce D', 'Dairy & Refrigerated', 'Bakery & Bread', 'Beverages'],
        }
        for store in created_stores:
            store_id = store['id']
            store_shelves = []
            for shelf_index in range(1, 5):
                shelf_names = shelf_names_by_store.get(store_id, [])
                shelf_name = shelf_names[shelf_index - 1] if len(shelf_names) >= shelf_index else f'Shelf {shelf_index}'
                shelf_payload = {
                    'id': f'{store_id}-shelf-{shelf_index:02d}',
                    'name': shelf_name,
                    'maxCapacity': 200,
                    'refStore': store_id,
                }
                store_shelves.append(shelf_service.create(shelf_payload))
            shelves_by_store[store_id] = store_shelves

        product_ids = [product['id'] for product in created_products]
        for store in created_stores:
            store_id = store['id']
            for shelf_position, shelf in enumerate(shelves_by_store[store_id], start=1):
                shelf_id = shelf['id']
                for item_offset in range(4):
                    product_id = product_ids[(shelf_position * 4 + item_offset) % len(product_ids)]
                    count = 20 + item_offset
                    inventory_payload = {
                        'id': f'{shelf_id}-item-{item_offset + 1:02d}',
                        'shelfCount': count,
                        'stockCount': count + 30,
                        'refStore': store_id,
                        'refShelf': shelf_id,
                        'refProduct': product_id,
                    }
                    inventory_item_service.create(inventory_payload)

        print(
            'Seed complete: '
            f"{len(created_products)} products, "
            f"{len(created_stores)} stores, "
            f"{len(created_employees)} employees, "
            f"{sum(len(shelves) for shelves in shelves_by_store.values())} shelves, "
            f"{4 * sum(len(shelves) for shelves in shelves_by_store.values())} inventory items."
        )


if __name__ == '__main__':
    seed_data()
