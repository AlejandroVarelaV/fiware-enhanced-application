"""
Flask application factory and initialization.

This module creates the Flask application and configures all extensions,
blueprints, error handlers, and services.
"""

from flask import Flask, jsonify
from flask_cors import CORS
import logging
import re

from config import get_config
from seed_data import seed_data
from app.utils.logger import setup_logging, get_logger
from app.services import (
    OrionService,
    ProductService,
    StoreService,
    EmployeeService,
    ShelfService,
    InventoryItemService,
)
from app.models.exceptions import (
    ApplicationError,
    OrionConnectionError,
    OrionEntityNotFoundError,
)
from app.routes import (
    health_bp,
    product_bp,
    store_bp,
    employee_bp,
    shelf_bp,
    inventory_item_bp,
)


logger = get_logger(__name__)


def create_app(config_name=None):
    """
    Create and configure Flask application.
    
    Args:
        config_name (str, optional): Configuration name ('development', 'testing', 'production').
                                      If None, reads from FLASK_CONFIG environment variable.
    
    Returns:
        Flask: Configured Flask application instance
    """
    # Load configuration
    config = get_config(config_name)
    
    # Create Flask app
    app = Flask(__name__)
    app.config.from_object(config)
    
    # Setup logging
    setup_logging(app)
    logger.info(f"Creating Flask app with config: {config.__class__.__name__}")
    
    # Enable CORS
    cors_origins = app.config.get('CORS_ORIGINS', '*')
    CORS(app, origins=cors_origins)
    logger.debug(f"CORS enabled for origins: {cors_origins}")
    
    fiware_service = app.config.get('ORION_FIWARE_SERVICE', 'smart_retail')
    fiware_service = re.sub(r'[^A-Za-z0-9_]', '_', fiware_service)

    # Initialize OrionService
    orion_service = OrionService(
        base_url=app.config.get('ORION_URL', 'http://localhost:1026'),
        fiware_service=fiware_service,
        fiware_servicepath=app.config.get('ORION_FIWARE_SERVICEPATH', '/'),
        timeout=app.config.get('HEALTH_CHECK_TIMEOUT', 2),
    )
    app.orion_service = orion_service
    logger.info(f"OrionService initialized: {app.config.get('ORION_URL', 'http://localhost:1026')}")

    # Initialize application services
    app.product_service = ProductService(orion_service)
    app.store_service = StoreService(orion_service)
    app.employee_service = EmployeeService(orion_service)
    app.shelf_service = ShelfService(orion_service)
    app.inventory_item_service = InventoryItemService(orion_service)
    logger.debug("Product, Store, Employee, Shelf, and InventoryItem services initialized")

    # Seed initial data once if Orion is reachable and data is empty.
    try:
        seed_data(app)
        logger.info("Initial data seeding check completed")
    except Exception as e:
        logger.warning(f"Initial data seeding skipped due to error: {e}")
    
    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(store_bp)
    app.register_blueprint(employee_bp)
    app.register_blueprint(shelf_bp)
    app.register_blueprint(inventory_item_bp)
    logger.debug("Health check blueprint registered")
    
    # Register error handlers
    register_error_handlers(app)
    logger.debug("Error handlers registered")
    
    logger.info("Flask application created successfully")
    
    return app


def register_error_handlers(app):
    """
    Register global error handlers for the Flask application.
    
    Args:
        app: Flask application instance
    """
    
    @app.errorhandler(OrionConnectionError)
    def handle_orion_connection_error(error):
        """Handle Orion connection errors."""
        logger.error(f"Orion connection error: {error.message}")
        return jsonify({
            'error': 'ORION_CONNECTION_ERROR',
            'message': error.message,
        }), 503
    
    @app.errorhandler(OrionEntityNotFoundError)
    def handle_entity_not_found_error(error):
        """Handle entity not found errors."""
        logger.warning(f"Entity not found: {error.message}")
        return jsonify({
            'error': 'NOT_FOUND',
            'message': error.message,
        }), 404
    
    @app.errorhandler(ApplicationError)
    def handle_application_error(error):
        """Handle general application errors."""
        logger.error(f"Application error ({error.error_code}): {error.message}")
        return jsonify({
            'error': error.error_code,
            'message': error.message,
        }), 400
    
    @app.errorhandler(400)
    def handle_bad_request(error):
        """Handle 400 Bad Request."""
        logger.warning(f"Bad request: {error}")
        return jsonify({
            'error': 'BAD_REQUEST',
            'message': str(error),
        }), 400
    
    @app.errorhandler(404)
    def handle_not_found(error):
        """Handle 404 Not Found."""
        logger.warning(f"Endpoint not found: {error}")
        return jsonify({
            'error': 'NOT_FOUND',
            'message': 'Endpoint not found',
        }), 404
    
    @app.errorhandler(500)
    def handle_internal_error(error):
        """Handle 500 Internal Server Error."""
        logger.error(f"Internal server error: {error}")
        return jsonify({
            'error': 'INTERNAL_SERVER_ERROR',
            'message': 'An internal server error occurred',
        }), 500
    
    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        """Handle unexpected exceptions."""
        logger.exception(f"Unexpected error: {error}")
        return jsonify({
            'error': 'INTERNAL_SERVER_ERROR',
            'message': 'An unexpected error occurred',
        }), 500
