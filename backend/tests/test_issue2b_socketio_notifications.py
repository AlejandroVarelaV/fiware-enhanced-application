"""Unit tests for Issue 2B real-time notification forwarding."""

import unittest
from flask import Flask

from app.routes.notification_routes import notification_bp
from app.services.notification_event_service import NotificationEventService


class FakeSocketIO:
    """Collect emitted events for assertions."""

    def __init__(self):
        self.events = []

    def emit(self, event_name, payload):
        self.events.append((event_name, payload))


class NotificationEventServiceTests(unittest.TestCase):
    def test_emits_orion_notification(self):
        fake_socketio = FakeSocketIO()
        service = NotificationEventService(fake_socketio, low_stock_threshold=5)

        payload = {
            'subscriptionId': 'sub-price',
            'data': [
                {
                    'id': 'product-1',
                    'type': 'Product',
                    'name': {'type': 'Text', 'value': 'Laptop'},
                    'price': {'type': 'Number', 'value': 199.0},
                }
            ],
        }

        emitted_count = service.forward_orion_notification(payload)

        self.assertEqual(emitted_count, 1)
        self.assertEqual(fake_socketio.events[0][0], 'orion_notification')
        self.assertEqual(fake_socketio.events[0][1], payload)


class NotificationRouteSocketIOTests(unittest.TestCase):
    def test_notification_route_forwards_and_reports_count(self):
        app = Flask(__name__)
        app.notification_event_service = NotificationEventService(FakeSocketIO(), low_stock_threshold=5)
        app.register_blueprint(notification_bp)

        client = app.test_client()
        response = client.post(
            '/api/notifications',
            json={
                'subscriptionId': 'sub-price',
                'data': [
                    {
                        'id': 'product-1',
                        'type': 'Product',
                        'price': {'type': 'Number', 'value': 9.99},
                    }
                ],
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()['status'], 'received')
        self.assertEqual(response.get_json()['eventsEmitted'], 1)


class NotificationRouteGenericDeliveryTests(unittest.TestCase):
    def test_notification_route_emits_generic_event(self):
        app = Flask(__name__)
        fake_socketio = FakeSocketIO()
        app.notification_event_service = NotificationEventService(fake_socketio, low_stock_threshold=5)
        app.register_blueprint(notification_bp)

        client = app.test_client()
        payload = {
            'subscriptionId': 'sub-generic',
            'data': [
                {
                    'id': 'inventory-1',
                    'type': 'InventoryItem',
                    'stockCount': {'type': 'Integer', 'value': 2},
                }
            ],
        }

        response = client.post('/api/notifications', json=payload)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()['eventsEmitted'], 1)
        self.assertEqual(fake_socketio.events[0][0], 'orion_notification')
        self.assertEqual(fake_socketio.events[0][1], payload)


if __name__ == '__main__':
    unittest.main()
