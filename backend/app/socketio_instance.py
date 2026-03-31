"""Socket.IO extension instance for real-time backend events."""

from flask_socketio import SocketIO


socketio = SocketIO(async_mode='threading', cors_allowed_origins='*')
