"""Unit tests for Issue 1C service logic."""

import unittest

from app.models.exceptions import OrionEntityNotFoundError, ValidationError
from app.services.employee_service import EmployeeService
from app.services.shelf_service import ShelfService
from app.services.inventory_item_service import InventoryItemService


class FakeOrionService:
    """Small test double for OrionService used by service tests."""

    def __init__(self, existing_ids=None):
        self.existing_ids = set(existing_ids or [])

    def get_entity(self, entity_id):
        if entity_id not in self.existing_ids:
            raise OrionEntityNotFoundError(entity_id)
        return {'id': entity_id, 'type': 'Mock'}

    def create_entity(self, entity_type, entity_data):
        created = {'id': entity_data['id'], 'type': entity_type}
        for key, value in entity_data.items():
            if key not in ('id', 'type'):
                created[key] = value
        return created

    def list_entities(self, entity_type=None, limit=1000):
        return []

    def update_entity_attrs(self, entity_id, attrs):
        if entity_id not in self.existing_ids:
            raise OrionEntityNotFoundError(entity_id)
        updated = {'id': entity_id, 'type': 'Mock'}
        updated.update(attrs)
        return updated

    def delete_entity(self, entity_id):
        if entity_id not in self.existing_ids:
            raise OrionEntityNotFoundError(entity_id)
        return True


class EmployeeServiceTests(unittest.TestCase):
    def test_create_employee_success(self):
        service = EmployeeService(FakeOrionService(existing_ids={'store-1'}))

        payload = {
            'name': 'Jane',
            'image': 'jane.png',
            'category': 'cashier',
            'email': 'jane@example.com',
            'dateOfContract': '2024-01-10T09:00:00Z',
            'skills': ['WritingReports'],
            'username': 'jane',
            'password': 'secret',
            'refStore': 'store-1',
        }

        result = service.create(payload)
        self.assertEqual(result['type'], 'Employee')
        self.assertIn('id', result)

    def test_create_employee_invalid_email(self):
        service = EmployeeService(FakeOrionService(existing_ids={'store-1'}))

        payload = {
            'name': 'Jane',
            'image': 'jane.png',
            'category': 'cashier',
            'email': 'invalid-email',
            'dateOfContract': '2024-01-10T09:00:00Z',
            'skills': ['WritingReports'],
            'username': 'jane',
            'password': 'secret',
            'refStore': 'store-1',
        }

        with self.assertRaises(ValidationError):
            service.create(payload)

    def test_create_employee_missing_store_reference(self):
        service = EmployeeService(FakeOrionService(existing_ids=set()))

        payload = {
            'name': 'Jane',
            'image': 'jane.png',
            'category': 'cashier',
            'email': 'jane@example.com',
            'dateOfContract': '2024-01-10T09:00:00Z',
            'skills': ['WritingReports'],
            'username': 'jane',
            'password': 'secret',
            'refStore': 'store-1',
        }

        with self.assertRaises(OrionEntityNotFoundError):
            service.create(payload)


class ShelfServiceTests(unittest.TestCase):
    def test_create_shelf_negative_capacity(self):
        service = ShelfService(FakeOrionService(existing_ids={'store-1'}))

        payload = {
            'name': 'Shelf A',
            'maxCapacity': -1,
            'refStore': 'store-1',
        }

        with self.assertRaises(ValidationError):
            service.create(payload)

    def test_create_shelf_missing_store_reference(self):
        service = ShelfService(FakeOrionService(existing_ids=set()))

        payload = {
            'name': 'Shelf A',
            'maxCapacity': 10,
            'refStore': 'store-1',
        }

        with self.assertRaises(OrionEntityNotFoundError):
            service.create(payload)


class InventoryItemServiceTests(unittest.TestCase):
    def test_create_inventory_item_success(self):
        service = InventoryItemService(
            FakeOrionService(existing_ids={'store-1', 'shelf-1', 'product-1'})
        )

        payload = {
            'shelfCount': 2,
            'stockCount': 5,
            'refStore': 'store-1',
            'refShelf': 'shelf-1',
            'refProduct': 'product-1',
        }

        result = service.create(payload)
        self.assertEqual(result['type'], 'InventoryItem')
        self.assertIn('id', result)

    def test_create_inventory_item_negative_stock(self):
        service = InventoryItemService(
            FakeOrionService(existing_ids={'store-1', 'shelf-1', 'product-1'})
        )

        payload = {
            'shelfCount': 2,
            'stockCount': -1,
            'refStore': 'store-1',
            'refShelf': 'shelf-1',
            'refProduct': 'product-1',
        }

        with self.assertRaises(ValidationError):
            service.create(payload)

    def test_create_inventory_item_missing_reference(self):
        service = InventoryItemService(
            FakeOrionService(existing_ids={'store-1', 'shelf-1'})
        )

        payload = {
            'shelfCount': 2,
            'stockCount': 1,
            'refStore': 'store-1',
            'refShelf': 'shelf-1',
            'refProduct': 'product-1',
        }

        with self.assertRaises(OrionEntityNotFoundError):
            service.create(payload)


if __name__ == '__main__':
    unittest.main()
