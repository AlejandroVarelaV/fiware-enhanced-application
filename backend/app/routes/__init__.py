"""Routes module - API endpoint blueprints."""

from .health_routes import health_bp
from .product_routes import product_bp
from .store_routes import store_bp

__all__ = ['health_bp', 'product_bp', 'store_bp']
