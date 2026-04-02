"""Notification routes for Orion subscription callbacks."""

from flask import Blueprint, current_app, jsonify, request

from app.utils.logger import get_logger


logger = get_logger(__name__)

notification_bp = Blueprint('notifications', __name__, url_prefix='/api')


@notification_bp.route('/notifications', methods=['POST'])
def receive_notification():
    """Receive Orion notifications and forward them to connected Socket.IO clients."""
    payload = request.get_json(silent=True)
    logger.info(f"Received Orion notification: {payload}")

    emitted_events = 0
    event_service = getattr(current_app, 'notification_event_service', None)
    if event_service is not None:
        emitted_events = event_service.forward_orion_notification(payload)
    else:
        logger.warning('notification_event_service not configured; skipping Socket.IO emission')

    return jsonify({'status': 'received', 'eventsEmitted': emitted_events}), 200
