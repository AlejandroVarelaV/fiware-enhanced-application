"""Registration routes for Orion context provider registrations."""

from urllib.parse import urljoin

import requests
from flask import Blueprint, current_app, jsonify

from app.utils.logger import get_logger


logger = get_logger(__name__)

registration_bp = Blueprint('registrations', __name__, url_prefix='/api')


@registration_bp.route('/registrations', methods=['GET'])
def list_registrations():
    """Proxy Orion registrations list to the frontend/backend clients."""
    orion_service = current_app.orion_service
    endpoint = urljoin(orion_service.base_url, '/v2/registrations')
    headers = {
        'Accept': 'application/json',
        'Fiware-Service': orion_service.fiware_service,
        'Fiware-ServicePath': orion_service.fiware_servicepath,
    }

    try:
        response = orion_service.session.get(
            endpoint,
            headers=headers,
            timeout=orion_service.timeout,
        )
    except requests.RequestException as exc:
        logger.error(f"Failed to retrieve Orion registrations: {exc}")
        return jsonify({
            'error': 'ORION_CONNECTION_ERROR',
            'message': str(exc),
        }), 503

    if response.status_code >= 400:
        logger.warning(
            f"Orion registrations proxy returned error {response.status_code}: {response.text}"
        )
        try:
            return jsonify(response.json()), response.status_code
        except ValueError:
            return jsonify({
                'error': 'ORION_API_ERROR',
                'message': response.text,
            }), response.status_code

    try:
        payload = response.json() if response.text else []
    except ValueError:
        logger.error('Orion registrations response is not valid JSON')
        return jsonify({
            'error': 'INVALID_ORION_RESPONSE',
            'message': 'Orion returned a non-JSON registrations payload',
        }), 502

    return jsonify(payload), response.status_code
