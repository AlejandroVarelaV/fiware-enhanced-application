"""
Flask configuration management for development, testing, and production environments.
Configuration values are loaded from environment variables via python-dotenv.
"""

import os
import logging


class Config:
    """Base configuration class with common settings."""
    
    # Flask core settings
    FLASK_CONFIG = os.getenv('FLASK_CONFIG', 'development')
    TESTING = False
    DEBUG = False
    
    # Server settings
    FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    # CORS settings
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')
    
    # Orion Context Broker settings
    ORION_URL = os.getenv('ORION_URL', 'http://localhost:1026')
    ORION_FIWARE_SERVICE = os.getenv('ORION_FIWARE_SERVICE', 'smart-retail')
    ORION_FIWARE_SERVICEPATH = os.getenv('ORION_FIWARE_SERVICEPATH', '/')
    
    # Health check settings
    HEALTH_CHECK_TIMEOUT = int(os.getenv('HEALTH_CHECK_TIMEOUT', 2))


class DevelopmentConfig(Config):
    """Development environment configuration."""
    
    DEBUG = True
    TESTING = False
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'DEBUG')


class TestingConfig(Config):
    """Testing environment configuration."""
    
    TESTING = True
    DEBUG = True
    ORION_URL = 'http://localhost:1026'  # Mock or test Orion


class ProductionConfig(Config):
    """Production environment configuration."""
    
    DEBUG = False
    TESTING = False
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')


def get_config(config_name=None):
    """
    Get configuration object based on environment name.
    
    Args:
        config_name (str, optional): Configuration name. If None, reads from FLASK_CONFIG env var.
    
    Returns:
        Config: Configuration object for the specified environment.
    
    Raises:
        ValueError: If config_name is not recognized.
    """
    if config_name is None:
        config_name = os.getenv('FLASK_CONFIG', 'development')
    
    configs = {
        'development': DevelopmentConfig,
        'testing': TestingConfig,
        'production': ProductionConfig,
    }
    
    if config_name not in configs:
        raise ValueError(f"Unknown configuration: {config_name}. Must be one of {list(configs.keys())}")
    
    return configs[config_name]()
