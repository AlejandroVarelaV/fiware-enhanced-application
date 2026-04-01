"""Routes module - API endpoint blueprints."""

from .health_routes import health_bp
from .product_routes import product_bp
from .store_routes import store_bp
from .employee_routes import employee_bp
from .shelf_routes import shelf_bp
from .inventory_item_routes import inventory_item_bp
from .notification_routes import notification_bp

__all__ = [
	'health_bp',
	'product_bp',
	'store_bp',
	'employee_bp',
	'shelf_bp',
	'inventory_item_bp',
	'notification_bp',
]
