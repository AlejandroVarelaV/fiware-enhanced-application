"""Service layer for InventoryItem CRUD operations."""

from uuid import uuid4

from app.models.exceptions import ValidationError
from app.utils.logger import get_logger
from app.utils.ngsi_helpers import to_ngsi, from_ngsi
from app.utils.validators import (
    validate_required_fields,
    validate_non_negative_integer,
    validate_entity_reference,
)


logger = get_logger(__name__)


class InventoryItemService:
    """InventoryItem service with simple validation and NGSI mapping."""

    REQUIRED_FIELDS = ['shelfCount', 'stockCount', 'refStore', 'refShelf', 'refProduct']

    def __init__(self, orion_service):
        self.orion_service = orion_service

    def create(self, inventory_data):
        self._validate_inventory_data(inventory_data, is_update=False)

        payload = dict(inventory_data)
        payload['id'] = payload.get('id') or str(uuid4())

        ngsi_entity = to_ngsi(payload)
        created = self.orion_service.create_entity('InventoryItem', ngsi_entity)
        logger.info(f"Created InventoryItem entity: {payload['id']}")
        return from_ngsi(created)

    def get(self, inventory_id):
        entity = self.orion_service.get_entity(inventory_id)
        return from_ngsi(entity)

    def list(self):
        entities = self.orion_service.list_entities(entity_type='InventoryItem')
        return [from_ngsi(entity) for entity in entities]

    def update(self, inventory_id, updates):
        if not isinstance(updates, dict) or not updates:
            raise ValidationError('Request body must contain at least one field to update')

        self._validate_inventory_data(updates, is_update=True)

        ngsi_attrs = to_ngsi(updates)
        ngsi_attrs.pop('id', None)
        ngsi_attrs.pop('type', None)

        updated = self.orion_service.update_entity_attrs(inventory_id, ngsi_attrs)
        logger.info(f'Updated InventoryItem entity: {inventory_id}')
        return from_ngsi(updated)

    def delete(self, inventory_id):
        self.orion_service.delete_entity(inventory_id)
        logger.info(f'Deleted InventoryItem entity: {inventory_id}')
        return True

    def _validate_inventory_data(self, data, is_update=False):
        if not is_update:
            validate_required_fields(data, self.REQUIRED_FIELDS)
        elif not isinstance(data, dict):
            raise ValidationError('Request body must be a valid JSON object')

        if 'shelfCount' in data:
            validate_non_negative_integer(data['shelfCount'], 'shelfCount')

        if 'stockCount' in data:
            validate_non_negative_integer(data['stockCount'], 'stockCount')

        if 'refStore' in data:
            validate_entity_reference(self.orion_service, data['refStore'], 'refStore')

        if 'refShelf' in data:
            validate_entity_reference(self.orion_service, data['refShelf'], 'refShelf')

        if 'refProduct' in data:
            validate_entity_reference(self.orion_service, data['refProduct'], 'refProduct')
