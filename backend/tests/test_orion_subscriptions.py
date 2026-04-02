"""Unit tests for Orion subscription operations (Issue 2A)."""

import unittest
from unittest.mock import Mock, MagicMock, patch
from app.services.orion_service import OrionService


class OrionSubscriptionMethodsTest(unittest.TestCase):
    """Tests for subscription methods in OrionService."""

    def setUp(self):
        """Set up test fixtures."""
        self.orion = OrionService(
            base_url='http://localhost:1026',
            fiware_service='smart_retail',
            fiware_servicepath='/',
            timeout=5,
        )

    def test_list_subscriptions_success(self):
        """Test listing subscriptions from Orion."""
        # Mock the response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = [
            {
                'id': 'subscription-1',
                'description': 'product-price-change-subscription',
            },
            {
                'id': 'subscription-2',
                'description': 'inventory-low-stock-subscription',
            },
        ]
        self.orion.session.get = Mock(return_value=mock_response)

        # Call the method
        subscriptions = self.orion.list_subscriptions()

        # Verify
        self.assertEqual(len(subscriptions), 2)
        self.assertEqual(subscriptions[0]['id'], 'subscription-1')
        self.assertEqual(subscriptions[1]['description'], 'inventory-low-stock-subscription')

    def test_create_subscription_success(self):
        """Test creating a subscription in Orion."""
        # Mock the response
        mock_response = Mock()
        mock_response.status_code = 201
        mock_response.json.return_value = {}
        mock_response.headers = {'Location': '/v2/subscriptions/subscription-123'}
        self.orion.session.post = Mock(return_value=mock_response)

        # Call the method
        payload = {
            'description': 'product-price-change-subscription',
            'subject': {
                'entities': [{'idPattern': '.*', 'type': 'Product'}],
                'condition': {'attrs': ['price']},
            },
            'notification': {
                'http': {'url': 'http://backend:5000/api/notifications'},
                'attrs': ['id', 'type', 'name', 'price'],
            },
        }
        subscription_id = self.orion.create_subscription(payload)

        # Verify
        self.assertEqual(subscription_id, 'subscription-123')
        self.orion.session.post.assert_called_once()

    def test_create_subscription_returns_none_without_location(self):
        """Test that create_subscription returns None if Location header is missing."""
        # Mock the response without Location header
        mock_response = Mock()
        mock_response.status_code = 201
        mock_response.json.return_value = {}
        mock_response.headers = {}  # No Location header
        self.orion.session.post = Mock(return_value=mock_response)

        # Call the method
        payload = {
            'description': 'test-subscription',
            'subject': {'entities': [{'type': 'Product'}]},
            'notification': {'http': {'url': 'http://backend:5000/api/notifications'}},
        }
        subscription_id = self.orion.create_subscription(payload)

        # Verify - should return None
        self.assertIsNone(subscription_id)


class SubscriptionEndToEndTest(unittest.TestCase):
    """End-to-end test for full subscription workflow."""

    def test_subscription_payloads_ngsi_v2_compliant(self):
        """Verify subscription payloads follow NGSIv2 structure."""
        from app.services.subscription_service import SubscriptionService

        fake_orion = Mock()
        fake_orion.list_subscriptions.return_value = []

        service = SubscriptionService(
            orion_service=fake_orion,
            notification_url='http://host.docker.internal:5000/api/notifications',
            low_stock_threshold=5,
        )

        # Test price change subscription
        price_payload = service.build_price_change_subscription()
        self.assertEqual(price_payload['subject']['entities'][0]['type'], 'Product')
        self.assertEqual(price_payload['subject']['condition']['attrs'], ['price'])
        self.assertTrue(price_payload['notification']['http']['url'].endswith('/api/notifications'))

        # Test low stock subscription
        stock_payload = service.build_low_stock_subscription()
        self.assertEqual(stock_payload['subject']['entities'][0]['type'], 'InventoryItem')
        self.assertEqual(stock_payload['subject']['condition']['attrs'], ['stockCount'])
        self.assertEqual(stock_payload['subject']['condition']['expression']['q'], 'stockCount<5')
        self.assertIn('stockCount', stock_payload['notification']['attrs'])

        # Both should have the required NGSIv2 fields
        for payload in [price_payload, stock_payload]:
            self.assertIn('description', payload)
            self.assertIn('subject', payload)
            self.assertIn('notification', payload)
            self.assertIn('http', payload['notification'])
            self.assertIn('attrs', payload['notification'])


if __name__ == '__main__':
    unittest.main()
