"""Service that forwards Orion notifications to Socket.IO clients."""

from app.utils.logger import get_logger


logger = get_logger(__name__)


class NotificationEventService:
    """Parse Orion notification payloads and emit frontend real-time events."""

    PRODUCT_PRICE_CHANGED = 'product_price_changed'
    LOW_STOCK = 'low_stock'

    def __init__(self, socketio, low_stock_threshold: int = 5):
        self.socketio = socketio
        self.low_stock_threshold = low_stock_threshold

    def forward_orion_notification(self, payload):
        """Emit Socket.IO events for supported Orion notification entities."""
        if not isinstance(payload, dict):
            logger.warning('Ignoring Orion notification: payload is not a JSON object')
            return 0

        data = payload.get('data') or []
        if not isinstance(data, list):
            logger.warning('Ignoring Orion notification: data is not an array')
            return 0

        emitted = 0
        subscription_id = payload.get('subscriptionId')

        for entity in data:
            if not isinstance(entity, dict):
                continue

            if self._emit_product_price_changed(entity, subscription_id):
                emitted += 1
                continue

            if self._emit_low_stock(entity, subscription_id):
                emitted += 1

        return emitted

    def _emit_product_price_changed(self, entity, subscription_id):
        entity_type = entity.get('type')
        if entity_type != 'Product' or 'price' not in entity:
            return False

        event_payload = {
            'subscriptionId': subscription_id,
            'entity': {
                'id': entity.get('id'),
                'type': entity_type,
                'name': self._get_attr_value(entity.get('name')),
                'price': self._get_attr_value(entity.get('price')),
            },
        }
        self.socketio.emit(self.PRODUCT_PRICE_CHANGED, event_payload)
        logger.info(f"Emitted Socket.IO event: {self.PRODUCT_PRICE_CHANGED} for {entity.get('id')}")
        return True

    def _emit_low_stock(self, entity, subscription_id):
        entity_type = entity.get('type')
        if entity_type != 'InventoryItem' or 'stockCount' not in entity:
            return False

        stock_count = self._get_attr_value(entity.get('stockCount'))
        if not isinstance(stock_count, (int, float)) or stock_count >= self.low_stock_threshold:
            return False

        event_payload = {
            'subscriptionId': subscription_id,
            'threshold': self.low_stock_threshold,
            'entity': {
                'id': entity.get('id'),
                'type': entity_type,
                'stockCount': stock_count,
                'refProduct': self._get_attr_value(entity.get('refProduct')),
                'refShelf': self._get_attr_value(entity.get('refShelf')),
                'refStore': self._get_attr_value(entity.get('refStore')),
            },
        }
        self.socketio.emit(self.LOW_STOCK, event_payload)
        logger.info(f"Emitted Socket.IO event: {self.LOW_STOCK} for {entity.get('id')}")
        return True

    @staticmethod
    def _get_attr_value(attribute):
        if isinstance(attribute, dict) and 'value' in attribute:
            return attribute['value']
        return attribute
