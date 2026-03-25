"""Service layer for Employee CRUD operations."""

from uuid import uuid4

from app.models.exceptions import ValidationError
from app.utils.logger import get_logger
from app.utils.ngsi_helpers import to_ngsi, from_ngsi
from app.utils.validators import (
    validate_required_fields,
    validate_string_field,
    validate_email,
    validate_datetime,
    validate_skills_enum,
    validate_entity_reference,
)


logger = get_logger(__name__)


class EmployeeService:
    """Employee service with simple validation and NGSI mapping."""

    REQUIRED_FIELDS = [
        'name',
        'image',
        'category',
        'email',
        'dateOfContract',
        'skills',
        'username',
        'password',
        'refStore',
    ]

    def __init__(self, orion_service):
        self.orion_service = orion_service

    def create(self, employee_data):
        self._validate_employee_data(employee_data, is_update=False)

        payload = dict(employee_data)
        payload['id'] = payload.get('id') or str(uuid4())

        ngsi_entity = to_ngsi(payload)
        created = self.orion_service.create_entity('Employee', ngsi_entity)
        logger.info(f"Created Employee entity: {payload['id']}")
        return from_ngsi(created)

    def get(self, employee_id):
        entity = self.orion_service.get_entity(employee_id)
        return from_ngsi(entity)

    def list(self):
        entities = self.orion_service.list_entities(entity_type='Employee')
        return [from_ngsi(entity) for entity in entities]

    def update(self, employee_id, updates):
        if not isinstance(updates, dict) or not updates:
            raise ValidationError('Request body must contain at least one field to update')

        self._validate_employee_data(updates, is_update=True)

        ngsi_attrs = to_ngsi(updates)
        ngsi_attrs.pop('id', None)
        ngsi_attrs.pop('type', None)

        updated = self.orion_service.update_entity_attrs(employee_id, ngsi_attrs)
        logger.info(f'Updated Employee entity: {employee_id}')
        return from_ngsi(updated)

    def delete(self, employee_id):
        self.orion_service.delete_entity(employee_id)
        logger.info(f'Deleted Employee entity: {employee_id}')
        return True

    def _validate_employee_data(self, data, is_update=False):
        if not is_update:
            validate_required_fields(data, self.REQUIRED_FIELDS)
        elif not isinstance(data, dict):
            raise ValidationError('Request body must be a valid JSON object')

        string_fields = ['name', 'image', 'category', 'username', 'password']
        for field_name in string_fields:
            if field_name in data:
                validate_string_field(data[field_name], field_name)

        if 'email' in data:
            validate_email(data['email'])

        if 'dateOfContract' in data:
            validate_datetime(data['dateOfContract'], 'dateOfContract')

        if 'skills' in data:
            validate_skills_enum(data['skills'])

        if 'refStore' in data:
            validate_entity_reference(self.orion_service, data['refStore'], 'refStore')
