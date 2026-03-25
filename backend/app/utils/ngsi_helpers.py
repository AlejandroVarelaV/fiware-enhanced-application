"""Minimal helpers to map between plain dicts and NGSIv2 entities."""


def _infer_type(value):
    """Infer a basic NGSIv2 type from a Python value."""
    if isinstance(value, bool):
        return 'Boolean'
    if isinstance(value, int):
        return 'Integer'
    if isinstance(value, float):
        return 'Number'
    if isinstance(value, dict):
        if value.get('type') == 'Point' and 'coordinates' in value:
            return 'geo:json'
        return 'StructuredValue'
    if isinstance(value, list):
        return 'StructuredValue'
    return 'Text'


def to_ngsi(entity_dict):
    """Convert a plain entity dict to NGSIv2 format."""
    ngsi_entity = {}
    for key, value in entity_dict.items():
        if key in ('id', 'type'):
            ngsi_entity[key] = value
        else:
            ngsi_entity[key] = {
                'type': _infer_type(value),
                'value': value,
            }
    return ngsi_entity


def from_ngsi(entity):
    """Convert a NGSIv2 entity to a plain dict."""
    plain_entity = {}
    for key, value in entity.items():
        if key in ('id', 'type'):
            plain_entity[key] = value
        elif isinstance(value, dict) and 'value' in value:
            plain_entity[key] = value['value']
        else:
            plain_entity[key] = value
    return plain_entity
