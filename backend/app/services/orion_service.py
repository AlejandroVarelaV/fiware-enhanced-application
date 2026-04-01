"""
OrionService - Low-level NGSIv2 HTTP client for Orion Context Broker.

This service abstracts all HTTP communication with Orion and handles:
- Entity CRUD operations (POST, GET, PATCH, DELETE)
- List and query operations
- Error handling and logging
- Proper NGSIv2 headers
"""

import requests
import json
from typing import Optional, Dict, Any
from urllib.parse import urljoin

from app.models.exceptions import (
    OrionConnectionError,
    OrionEntityNotFoundError,
    OrionAPIError,
)
from app.utils.logger import get_logger

logger = get_logger(__name__)


class OrionService:
    """
    Low-level NGSIv2 HTTP client for Orion Context Broker.
    
    Handles all communication with Orion including entity CRUD operations,
    error handling, and proper NGSIv2 formatting.
    """
    
    def __init__(self, base_url: str, fiware_service: str, fiware_servicepath: str, timeout: int = 5):
        """
        Initialize OrionService.
        
        Args:
            base_url (str): Orion base URL (e.g., 'http://localhost:1026')
            fiware_service (str): FIWARE service name for multi-tenancy
            fiware_servicepath (str): FIWARE service path (e.g., '/')
            timeout (int): Request timeout in seconds (default: 5)
        """
        self.base_url = base_url.rstrip('/')
        self.fiware_service = fiware_service
        self.fiware_servicepath = fiware_servicepath
        self.timeout = timeout
        self.session = requests.Session()
        
        logger.info(f"OrionService initialized with base_url={self.base_url}, service={self.fiware_service}")
    
    def _get_headers(self) -> Dict[str, str]:
        """
        Get base NGSIv2 HTTP headers.
        
        Returns:
            Dict[str, str]: HTTP headers for Orion requests
        """
        return {
            'Accept': 'application/json',
            'Fiware-Service': self.fiware_service,
            'Fiware-ServicePath': self.fiware_servicepath,
        }

    def _get_json_headers(self) -> Dict[str, str]:
        """
        Get NGSIv2 headers for JSON request bodies.

        Returns:
            Dict[str, str]: HTTP headers including Content-Type
        """
        return {
            **self._get_headers(),
            'Content-Type': 'application/json',
        }
    
    def _handle_response(self, response: requests.Response, context: str = '') -> Dict[str, Any]:
        """
        Handle HTTP response from Orion.
        
        Args:
            response (requests.Response): Response object from requests library
            context (str): Context string for logging
        
        Returns:
            Dict[str, Any]: Parsed JSON response
        
        Raises:
            OrionEntityNotFoundError: If entity not found (404)
            OrionAPIError: If API returns error
            OrionConnectionError: If connection fails
        """
        try:
            if response.status_code == 404:
                logger.warning(f"Entity not found in Orion ({context}): {response.text}")
                # Try to extract entity ID from response
                try:
                    error_data = response.json()
                    if 'description' in error_data:
                        raise OrionEntityNotFoundError(error_data['description'])
                except (json.JSONDecodeError, KeyError):
                    pass
                raise OrionEntityNotFoundError('Unknown entity')
            
            if response.status_code >= 400:
                logger.error(f"Orion API error ({context}) status={response.status_code}: {response.text}")
                try:
                    error_data = response.json()
                    message = error_data.get('description', response.text)
                except json.JSONDecodeError:
                    message = response.text
                raise OrionAPIError(message, response.status_code)
            
            # For 204 No Content, return empty dict
            if response.status_code == 204:
                return {}
            
            # Parse JSON response
            if response.text:
                return response.json()
            return {}
        
        except requests.RequestException as e:
            logger.error(f"Connection error with Orion ({context}): {str(e)}")
            raise OrionConnectionError(f"Failed to connect to Orion at {self.base_url}: {str(e)}")
    
    def check_connection(self) -> bool:
        """
        Verify connection to Orion by fetching version info.
        
        Returns:
            bool: True if Orion is reachable, False otherwise
        """
        try:
            url = urljoin(self.base_url, '/version')
            logger.debug(f"Checking Orion connection: {url}")
            response = self.session.get(url, headers=self._get_headers(), timeout=self.timeout)
            
            if response.status_code == 200:
                logger.info("Orion connection successful")
                return True
            else:
                logger.warning(f"Orion connection check returned status {response.status_code}")
                return False
        
        except requests.RequestException as e:
            logger.warning(f"Orion connection check failed: {str(e)}")
            return False
    
    def create_entity(self, entity_type: str, entity_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new entity in Orion.
        
        Args:
            entity_type (str): Entity type (e.g., 'Product', 'Store')
            entity_data (Dict): Entity data with NGSIv2 attributes
        
        Returns:
            Dict: Created entity
        
        Raises:
            OrionAPIError: On creation failure
            OrionConnectionError: On connection failure
        """
        if 'id' not in entity_data:
            raise OrionAPIError('Entity ID is required', 400)

        url = urljoin(self.base_url, '/v2/entities')
        
        # Prepare entity with type
        payload = {'type': entity_type, **entity_data}
        
        entity_id = entity_data['id']
        logger.debug(f"Creating entity type={entity_type} with id={entity_id}")
        
        try:
            response = self.session.post(url, json=payload, headers=self._get_json_headers(), timeout=self.timeout)
            self._handle_response(response, f"create_entity type={entity_type}")
            logger.info(f"Entity created: type={entity_type}, id={entity_id}")

            # POST /v2/entities returns no entity payload; fetch canonical entity from Orion.
            return self.get_entity(entity_id)
        
        except (OrionAPIError, OrionConnectionError):
            raise
    
    def get_entity(self, entity_id: str) -> Dict[str, Any]:
        """
        Retrieve a single entity from Orion by ID.
        
        Args:
            entity_id (str): Entity ID
        
        Returns:
            Dict: Entity data
        
        Raises:
            OrionEntityNotFoundError: If entity not found
            OrionConnectionError: On connection failure
        """
        url = urljoin(self.base_url, f'/v2/entities/{entity_id}')
        
        logger.debug(f"Retrieving entity: {entity_id}")
        
        try:
            response = self.session.get(url, headers=self._get_headers(), timeout=self.timeout)
            entity = self._handle_response(response, f"get_entity id={entity_id}")
            logger.debug(f"Retrieved entity: {entity_id}")
            return entity
        
        except (OrionEntityNotFoundError, OrionAPIError, OrionConnectionError):
            raise
    
    def list_entities(self, entity_type: Optional[str] = None, limit: int = 1000) -> list:
        """
        List entities from Orion.
        
        Args:
            entity_type (str, optional): Filter by entity type. If None, returns all entities.
            limit (int): Maximum number of entities to return (default: 1000)
        
        Returns:
            list: List of entities
        
        Raises:
            OrionConnectionError: On connection failure
        """
        url = urljoin(self.base_url, '/v2/entities')
        
        params = {'limit': limit}
        if entity_type:
            params['type'] = entity_type
        
        logger.debug(f"Listing entities: type={entity_type}, limit={limit}")
        
        try:
            response = self.session.get(url, headers=self._get_headers(), params=params, timeout=self.timeout)
            entities = self._handle_response(response, f"list_entities type={entity_type}")
            
            if isinstance(entities, dict) and 'results' in entities:
                entities = entities['results']
            elif not isinstance(entities, list):
                entities = [entities] if entities else []
            
            logger.debug(f"Listed {len(entities)} entities of type {entity_type}")
            return entities
        
        except (OrionAPIError, OrionConnectionError):
            raise
    
    def update_entity_attrs(self, entity_id: str, attrs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update entity attributes in Orion via PATCH.
        
        Args:
            entity_id (str): Entity ID
            attrs (Dict): Attributes to update (NGSIv2 format with type metadata)
        
        Returns:
            Dict: Updated entity
        
        Raises:
            OrionEntityNotFoundError: If entity not found
            OrionAPIError: On update failure
            OrionConnectionError: On connection failure
        """
        url = urljoin(self.base_url, f'/v2/entities/{entity_id}/attrs')
        
        logger.debug(f"Updating entity attrs: {entity_id} with {list(attrs.keys())}")
        
        try:
            response = self.session.patch(url, json=attrs, headers=self._get_json_headers(), timeout=self.timeout)
            self._handle_response(response, f"update_entity_attrs id={entity_id}")
            logger.info(f"Entity attributes updated: {entity_id}")
            
            # Return updated entity by fetching it
            return self.get_entity(entity_id)
        
        except (OrionEntityNotFoundError, OrionAPIError, OrionConnectionError):
            raise
    
    def delete_entity(self, entity_id: str) -> bool:
        """
        Delete an entity from Orion.
        
        Args:
            entity_id (str): Entity ID
        
        Returns:
            bool: True if deleted successfully
        
        Raises:
            OrionEntityNotFoundError: If entity not found
            OrionAPIError: On deletion failure
            OrionConnectionError: On connection failure
        """
        url = urljoin(self.base_url, f'/v2/entities/{entity_id}')
        
        logger.debug(f"Deleting entity: {entity_id}")
        
        try:
            response = self.session.delete(url, headers=self._get_headers(), timeout=self.timeout)
            self._handle_response(response, f"delete_entity id={entity_id}")
            logger.info(f"Entity deleted: {entity_id}")
            return True
        
        except (OrionEntityNotFoundError, OrionAPIError, OrionConnectionError):
            raise
    
    def patch_entity_increment(self, entity_id: str, attr_name: str, inc_value: int) -> Dict[str, Any]:
        """
        Increment/decrement an entity attribute using Orion's $inc operator.
        
        This is used for operations like buy-one-unit that need atomic increments.
        
        Args:
            entity_id (str): Entity ID
            attr_name (str): Attribute name to increment
            inc_value (int): Value to increment by (can be negative for decrement)
        
        Returns:
            Dict: Updated entity
        
        Raises:
            OrionEntityNotFoundError: If entity not found
            OrionAPIError: On update failure
            OrionConnectionError: On connection failure
        """
        # Orion's increment syntax
        attrs = {
            attr_name: {
                'value': {'$inc': inc_value}
            }
        }
        
        logger.debug(f"Incrementing {attr_name} on {entity_id} by {inc_value}")
        return self.update_entity_attrs(entity_id, attrs)
