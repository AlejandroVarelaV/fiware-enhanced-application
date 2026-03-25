"""Service layer for Store CRUD operations."""

from uuid import uuid4

from app.models.exceptions import ValidationError
from app.utils.logger import get_logger
from app.utils.ngsi_helpers import to_ngsi, from_ngsi

logger = get_logger(__name__)


class StoreService:
    """Store service with minimal validation and NGSI mapping."""

    REQUIRED_FIELDS = [
        'name',
        'image',
        'address',
        'location',
        'url',
        'telephone',
        'countryCode',
        'capacity',
        'description',
    ]

    def __init__(self, orion_service):
        self.orion_service = orion_service

    def create(self, store_data):
        self._validate_required_fields(store_data)

        payload = dict(store_data)
        payload['id'] = payload.get('id') or str(uuid4())

        ngsi_entity = to_ngsi(payload)
        created = self.orion_service.create_entity('Store', ngsi_entity)
        logger.info(f"Created Store entity: {payload['id']}")
        return from_ngsi(created)

    def get(self, store_id):
        entity = self.orion_service.get_entity(store_id)
        return from_ngsi(entity)

    def list(self):
        entities = self.orion_service.list_entities(entity_type='Store')
        return [from_ngsi(entity) for entity in entities]

    def update(self, store_id, updates):
        if not isinstance(updates, dict) or not updates:
            raise ValidationError('Request body must contain at least one field to update')

        ngsi_attrs = to_ngsi(updates)
        ngsi_attrs.pop('id', None)
        ngsi_attrs.pop('type', None)

        updated = self.orion_service.update_entity_attrs(store_id, ngsi_attrs)
        logger.info(f"Updated Store entity: {store_id}")
        return from_ngsi(updated)

    def delete(self, store_id):
        self.orion_service.delete_entity(store_id)
        logger.info(f"Deleted Store entity: {store_id}")
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
