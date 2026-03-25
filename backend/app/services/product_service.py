"""Service layer for Product CRUD operations."""

from uuid import uuid4

from app.models.exceptions import ValidationError
from app.utils.logger import get_logger
from app.utils.ngsi_helpers import to_ngsi, from_ngsi

logger = get_logger(__name__)


class ProductService:
    """Product service with minimal validation and NGSI mapping."""

    REQUIRED_FIELDS = ['name', 'image', 'size', 'price', 'color']

    def __init__(self, orion_service):
        self.orion_service = orion_service

    def create(self, product_data):
        self._validate_required_fields(product_data)

        payload = dict(product_data)
        payload['id'] = payload.get('id') or str(uuid4())

        ngsi_entity = to_ngsi(payload)
        created = self.orion_service.create_entity('Product', ngsi_entity)
        logger.info(f"Created Product entity: {payload['id']}")
        return from_ngsi(created)

    def get(self, product_id):
        entity = self.orion_service.get_entity(product_id)
        return from_ngsi(entity)

    def list(self):
        entities = self.orion_service.list_entities(entity_type='Product')
        return [from_ngsi(entity) for entity in entities]

    def update(self, product_id, updates):
        if not isinstance(updates, dict) or not updates:
            raise ValidationError('Request body must contain at least one field to update')

        ngsi_attrs = to_ngsi(updates)
        ngsi_attrs.pop('id', None)
        ngsi_attrs.pop('type', None)

        updated = self.orion_service.update_entity_attrs(product_id, ngsi_attrs)
        logger.info(f"Updated Product entity: {product_id}")
        return from_ngsi(updated)

    def delete(self, product_id):
        self.orion_service.delete_entity(product_id)
        logger.info(f"Deleted Product entity: {product_id}")
        return True

    def _validate_required_fields(self, data):
        if not isinstance(data, dict):
            raise ValidationError('Request body must be a valid JSON object')

        missing_fields = [
            field for field in self.REQUIRED_FIELDS
            if field not in data or data[field] is None
        ]
        if missing_fields:
            raise ValidationError(f"Missing required fields: {', '.join(missing_fields)}")
