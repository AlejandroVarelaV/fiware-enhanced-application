"""Service layer for Shelf CRUD operations."""

from uuid import uuid4

from app.models.exceptions import ValidationError
from app.utils.logger import get_logger
from app.utils.ngsi_helpers import to_ngsi, from_ngsi
from app.utils.validators import (
    validate_required_fields,
    validate_string_field,
    validate_positive_integer,
    validate_geo_point,
    validate_entity_reference,
)


logger = get_logger(__name__)


class ShelfService:
    """Shelf service with simple validation and NGSI mapping."""

    REQUIRED_FIELDS = ['name', 'maxCapacity', 'refStore']

    def __init__(self, orion_service):
        self.orion_service = orion_service

    def create(self, shelf_data):
        self._validate_shelf_data(shelf_data, is_update=False)

        payload = dict(shelf_data)
        payload['id'] = payload.get('id') or str(uuid4())

        ngsi_entity = to_ngsi(payload)
        created = self.orion_service.create_entity('Shelf', ngsi_entity)
        logger.info(f"Created Shelf entity: {payload['id']}")
        return from_ngsi(created)

    def get(self, shelf_id):
        entity = self.orion_service.get_entity(shelf_id)
        return from_ngsi(entity)

    def list(self):
        entities = self.orion_service.list_entities(entity_type='Shelf')
        return [from_ngsi(entity) for entity in entities]

    def update(self, shelf_id, updates):
        if not isinstance(updates, dict) or not updates:
            raise ValidationError('Request body must contain at least one field to update')

        self._validate_shelf_data(updates, is_update=True)

        ngsi_attrs = to_ngsi(updates)
        ngsi_attrs.pop('id', None)
        ngsi_attrs.pop('type', None)

        updated = self.orion_service.update_entity_attrs(shelf_id, ngsi_attrs)
        logger.info(f'Updated Shelf entity: {shelf_id}')
        return from_ngsi(updated)

    def delete(self, shelf_id):
        self.orion_service.delete_entity(shelf_id)
        logger.info(f'Deleted Shelf entity: {shelf_id}')
        return True

    def _validate_shelf_data(self, data, is_update=False):
        if not is_update:
            validate_required_fields(data, self.REQUIRED_FIELDS)
        elif not isinstance(data, dict):
            raise ValidationError('Request body must be a valid JSON object')

        if 'name' in data:
            validate_string_field(data['name'], 'name')

        if 'maxCapacity' in data:
            validate_positive_integer(data['maxCapacity'], 'maxCapacity')

        if 'location' in data and data['location'] is not None:
            validate_geo_point(data['location'], 'location')

        if 'refStore' in data:
            validate_entity_reference(self.orion_service, data['refStore'], 'refStore')
