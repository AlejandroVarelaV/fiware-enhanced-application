"""Service layer for Orion NGSIv2 subscriptions used by Issue 2A."""

from app.utils.logger import get_logger


logger = get_logger(__name__)


class SubscriptionService:
    """Creates and registers Orion subscriptions for key backend events."""

    PRICE_CHANGE_DESCRIPTION = 'product-price-change-subscription'
    LOW_STOCK_DESCRIPTION = 'inventory-low-stock-subscription'

    def __init__(self, orion_service, notification_url: str, low_stock_threshold: int = 5):
        self.orion_service = orion_service
        self.notification_url = notification_url
        self.low_stock_threshold = low_stock_threshold

    def build_price_change_subscription(self):
        """Build subscription payload for Product price updates."""
        return {
            'description': self.PRICE_CHANGE_DESCRIPTION,
            'subject': {
                'entities': [{'idPattern': '.*', 'type': 'Product'}],
                'condition': {'attrs': ['price']},
            },
            'notification': {
                'http': {'url': self.notification_url},
                'attrs': ['id', 'type', 'name', 'price'],
                'attrsFormat': 'normalized',
            },
        }

    def build_low_stock_subscription(self):
        """Build subscription payload for InventoryItem low stock events."""
        return {
            'description': self.LOW_STOCK_DESCRIPTION,
            'subject': {
                'entities': [{'idPattern': '.*', 'type': 'InventoryItem'}],
                'condition': {
                    'attrs': ['stockCount'],
                    'expression': {
                        'q': f'stockCount<{self.low_stock_threshold}',
                    },
                },
            },
            'notification': {
                'http': {'url': self.notification_url},
                'attrs': ['id', 'type', 'stockCount', 'refProduct', 'refShelf', 'refStore'],
                'attrsFormat': 'normalized',
            },
        }

    def register_subscriptions(self):
        """Create subscriptions in Orion if they do not already exist."""
        existing_subscriptions = self.orion_service.list_subscriptions()
        existing_descriptions = {
            subscription.get('description')
            for subscription in existing_subscriptions
            if isinstance(subscription, dict)
        }

        for payload in (
            self.build_price_change_subscription(),
            self.build_low_stock_subscription(),
        ):
            description = payload['description']
            if description in existing_descriptions:
                logger.info(f"Subscription already exists, skipping: {description}")
                continue

            subscription_id = self.orion_service.create_subscription(payload)
            logger.info(f"Registered Orion subscription: {description} (id={subscription_id or 'unknown'})")
