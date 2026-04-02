"""Startup registration of external context providers in Orion."""

from urllib.parse import urljoin

from app.utils.logger import get_logger


logger = get_logger(__name__)

PROVIDER_URL = 'http://tutorial:3000/api/v2'


def _build_store_environment_registration() -> dict:
    """Build registration payload for Store temperature and humidity attributes."""
    return {
        'description': 'store-environment-context-provider',
        'dataProvided': {
            'entities': [{'type': 'Store', 'idPattern': '.*'}],
            'attrs': ['temperature', 'relativeHumidity'],
        },
        'provider': {
            'http': {'url': PROVIDER_URL},
            'legacyForwarding': True,
        },
    }


def _build_store_tweets_registration() -> dict:
    """Build registration payload for Store tweets attribute."""
    return {
        'description': 'store-tweets-context-provider',
        'dataProvided': {
            'entities': [{'type': 'Store', 'idPattern': '.*'}],
            'attrs': ['tweets'],
        },
        'provider': {
            'http': {'url': PROVIDER_URL},
            'legacyForwarding': True,
        },
    }


def _get_json_headers(orion_service) -> dict:
    """Build NGSIv2 JSON headers from Orion service settings."""
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Fiware-Service': orion_service.fiware_service,
        'Fiware-ServicePath': orion_service.fiware_servicepath,
    }


def register_all_context_providers(orion_service) -> None:
    """Register all required external context providers in Orion.

    Each registration is attempted independently so failures are logged but do
    not stop backend startup.
    """
    endpoint = urljoin(orion_service.base_url, '/v2/registrations')
    headers = _get_json_headers(orion_service)

    registrations = (
        ('temperature+relativeHumidity', _build_store_environment_registration()),
        ('tweets', _build_store_tweets_registration()),
    )

    for label, payload in registrations:
        try:
            response = orion_service.session.post(
                endpoint,
                json=payload,
                headers=headers,
                timeout=orion_service.timeout,
            )
            response.raise_for_status()
            registration_id = response.headers.get('Location', '').split('/')[-1] or 'unknown'
            logger.info(
                f"Registered Orion context provider for Store {label} (id={registration_id})"
            )
        except Exception as exc:
            logger.error(
                f"Failed to register Orion context provider for Store {label}: {exc}"
            )
