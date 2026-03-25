"""Simple validation helpers used by service layer."""

import re
from dateutil.parser import isoparse

from app.models.exceptions import ValidationError


EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def validate_required_fields(data, required_fields):
    """Validate request body and required fields."""
    if not isinstance(data, dict):
        raise ValidationError('Request body must be a valid JSON object')

    missing_fields = [
        field for field in required_fields
        if field not in data or data[field] is None
    ]
    if missing_fields:
        raise ValidationError(f"Missing required fields: {', '.join(missing_fields)}")


def validate_string_field(value, field_name):
    if not isinstance(value, str) or not value.strip():
        raise ValidationError(f"{field_name} must be a non-empty string")


def validate_email(email):
    validate_string_field(email, 'email')
    if not EMAIL_REGEX.match(email):
        raise ValidationError('Invalid email format')


def validate_datetime(dt_value, field_name='dateOfContract'):
    validate_string_field(dt_value, field_name)
    try:
        isoparse(dt_value)
    except Exception:
        raise ValidationError(f'{field_name} must be a valid ISO 8601 datetime')


def validate_positive_integer(value, field_name):
    if not isinstance(value, int) or value <= 0:
        raise ValidationError(f'{field_name} must be a positive integer')


def validate_non_negative_integer(value, field_name):
    if not isinstance(value, int) or value < 0:
        raise ValidationError(f'{field_name} must be a non-negative integer')


def validate_skills_enum(skills):
    allowed_skills = {'MachineryDriving', 'WritingReports', 'CustomerRelationships'}

    if not isinstance(skills, list) or not skills:
        raise ValidationError('skills must be a non-empty list')

    invalid = [skill for skill in skills if skill not in allowed_skills]
    if invalid:
        raise ValidationError(f"Invalid skills values: {', '.join(invalid)}")


def validate_geo_point(location, field_name='location'):
    if not isinstance(location, dict):
        raise ValidationError(f'{field_name} must be an object with Point coordinates')

    if location.get('type') != 'Point':
        raise ValidationError(f"{field_name}.type must be 'Point'")

    coordinates = location.get('coordinates')
    if not isinstance(coordinates, list) or len(coordinates) != 2:
        raise ValidationError(f'{field_name}.coordinates must contain [longitude, latitude]')

    if not all(isinstance(value, (int, float)) for value in coordinates):
        raise ValidationError(f'{field_name}.coordinates must be numeric values')


def validate_entity_reference(orion_service, entity_id, field_name):
    validate_string_field(entity_id, field_name)
    # Let OrionEntityNotFoundError propagate as 404 through global handlers.
    orion_service.get_entity(entity_id)
