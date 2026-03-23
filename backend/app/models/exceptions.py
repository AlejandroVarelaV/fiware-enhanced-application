"""
Custom exception classes for the application.
These exceptions are used throughout the application for error handling and propagation.
"""


class ApplicationError(Exception):
    """Base exception class for all application errors."""
    
    def __init__(self, message, error_code=None):
        """
        Initialize ApplicationError.
        
        Args:
            message (str): Error message.
            error_code (str, optional): Error code for categorization.
        """
        self.message = message
        self.error_code = error_code or 'INTERNAL_ERROR'
        super().__init__(self.message)


class OrionConnectionError(ApplicationError):
    """Raised when unable to connect to Orion Context Broker."""
    
    def __init__(self, message):
        super().__init__(message, 'ORION_CONNECTION_ERROR')


class OrionEntityNotFoundError(ApplicationError):
    """Raised when a requested entity is not found in Orion."""
    
    def __init__(self, entity_id):
        message = f"Entity with id '{entity_id}' not found"
        super().__init__(message, 'ENTITY_NOT_FOUND')


class OrionAPIError(ApplicationError):
    """Raised when Orion API returns an error response."""
    
    def __init__(self, message, status_code=None):
        super().__init__(message, 'ORION_API_ERROR')
        self.status_code = status_code


class ValidationError(ApplicationError):
    """Raised when input validation fails."""
    
    def __init__(self, message, field_name=None):
        super().__init__(message, 'VALIDATION_ERROR')
        self.field_name = field_name
