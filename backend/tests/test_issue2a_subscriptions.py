"""Unit tests for Issue 2A subscription and notification behavior."""

import unittest
from flask import Flask

from app.routes.notification_routes import notification_bp
from app.services.subscription_service import SubscriptionService


class FakeOrionSubscriptionService:
    """Small test double for Orion subscription operations."""

    def __init__(self, existing_descriptions=None):
        self.created = []
        self.existing_descriptions = set(existing_descriptions or [])

    def list_subscriptions(self, limit=1000):
        subscriptions = []
        for description in self.existing_descriptions:
            subscriptions.append({'id': f'{description}-id', 'description': description})
        return subscriptions

    def create_subscription(self, payload):
        self.created.append(payload)
        return f"{payload['description']}-id"


class SubscriptionServiceTests(unittest.TestCase):
    def test_price_change_payload(self):
        service = SubscriptionService(
            FakeOrionSubscriptionService(),
            notification_url='http://backend:5000/api/notifications',
            low_stock_threshold=5,
        )

        payload = service.build_price_change_subscription()
        self.assertEqual(payload['description'], 'product-price-change-subscription')
        self.assertEqual(payload['subject']['entities'][0]['type'], 'Product')
        self.assertEqual(payload['subject']['condition']['attrs'], ['price'])

    def test_low_stock_payload_uses_threshold(self):
        service = SubscriptionService(
            FakeOrionSubscriptionService(),
            notification_url='http://backend:5000/api/notifications',
            low_stock_threshold=3,
        )

        payload = service.build_low_stock_subscription()
        self.assertEqual(payload['description'], 'inventory-low-stock-subscription')
        self.assertEqual(payload['subject']['entities'][0]['type'], 'InventoryItem')
        self.assertEqual(payload['subject']['condition']['expression']['q'], 'stockCount<3')

    def test_register_subscriptions_skips_existing(self):
        fake_orion = FakeOrionSubscriptionService(
            existing_descriptions={'product-price-change-subscription'}
        )
        service = SubscriptionService(
            fake_orion,
            notification_url='http://backend:5000/api/notifications',
            low_stock_threshold=5,
        )

        service.register_subscriptions()
        self.assertEqual(len(fake_orion.created), 1)
        self.assertEqual(
            fake_orion.created[0]['description'],
            'inventory-low-stock-subscription',
        )


class NotificationRouteTests(unittest.TestCase):
    def test_notification_endpoint_accepts_payload(self):
        app = Flask(__name__)
        app.register_blueprint(notification_bp)
        client = app.test_client()

        response = client.post(
            '/api/notifications',
            json={'data': [{'id': 'product-1', 'price': {'type': 'Number', 'value': 10.0}}]},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()['status'], 'received')


if __name__ == '__main__':
    unittest.main()
