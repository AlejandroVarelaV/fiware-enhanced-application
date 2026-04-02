"""Service that forwards Orion notifications to Socket.IO clients."""

from app.utils.logger import get_logger


logger = get_logger(__name__)


class NotificationEventService:
    """Emit a generic real-time notification event for Orion callbacks."""

    EVENT_NAME = 'orion_notification'

    def __init__(self, socketio, low_stock_threshold: int = 5):
        self.socketio = socketio
        self.low_stock_threshold = low_stock_threshold

    def forward_orion_notification(self, payload):
        """Emit the raw Orion notification payload to all connected clients."""
        if not isinstance(payload, dict):
            logger.warning('Ignoring Orion notification: payload is not a JSON object')
            return 0

        if hasattr(self.socketio, 'server') and self.socketio.server is None:
            logger.info(f"Socket.IO server not initialized; skipping emit for {self.EVENT_NAME}")
            return 1

        self.socketio.emit(self.EVENT_NAME, payload)
        logger.info(f"Emitted Socket.IO event: {self.EVENT_NAME}")
        return 1
