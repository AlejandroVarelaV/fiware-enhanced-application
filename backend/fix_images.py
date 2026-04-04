"""Patch existing Orion entities so their image URLs point to live assets.

Run with:
    python3 backend/fix_images.py
"""

from __future__ import annotations

import os
import sys
from typing import Dict

import requests
from dotenv import load_dotenv


IMAGE_URLS: Dict[str, Dict[str, str]] = {
    'Product': {
        'product-001': '/img/products/apple.jpg',
        'product-002': '/img/products/banana.jpg',
        'product-003': '/img/products/milk.jpg',
        'product-004': '/img/products/bread.jpg',
        'product-005': '/img/products/rice.jpg',
        'product-006': '/img/products/oliveoil.jpg',
        'product-007': '/img/products/coffee.jpg',
        'product-008': '/img/products/orangejuice.jpg',
        'product-009': '/img/products/tomatosauce.jpg',
        'product-010': '/img/products/pasta.jpg',
    },
    'Store': {
        'store-001': '/img/stores/store.jpg',
        'store-002': '/img/stores/store.jpg',
        'store-003': '/img/stores/store.jpg',
        'store-004': '/img/stores/store.jpg',
    },
    'Employee': {
        'employee-001': '/img/employees/alex.jpg',
        'employee-002': '/img/employees/bea.jpg',
        'employee-003': '/img/employees/chris.jpg',
        'employee-004': '/img/employees/dana.jpg',
    },
}


def verify_remote_image(url: str) -> None:
    frontend_base_url = os.getenv('FRONTEND_BASE_URL', 'http://localhost:3000').rstrip('/')
    check_url = f'{frontend_base_url}{url}' if url.startswith('/') else url

    try:
        response = requests.get(check_url, timeout=15, headers={'User-Agent': 'Mozilla/5.0'})
        content_type = response.headers.get('content-type', '')
        if response.status_code != 200 or not content_type.startswith('image/'):
            print(f'Warning: {check_url} returned {response.status_code} {content_type}', file=sys.stderr)
    except requests.RequestException as exc:
        print(f'Warning: could not verify {check_url}: {exc}', file=sys.stderr)


def _headers() -> Dict[str, str]:
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Fiware-Service': os.getenv('ORION_FIWARE_SERVICE', 'smart_retail'),
        'Fiware-ServicePath': os.getenv('ORION_FIWARE_SERVICEPATH', '/'),
    }


def list_entities(api_base_url: str, entity_path: str) -> list[dict]:
    response = requests.get(
        f'{api_base_url.rstrip("/")}{entity_path}',
        timeout=15,
    )
    response.raise_for_status()
    data = response.json()
    if isinstance(data, list):
        return data
    return [data] if data else []


def patch_entity_image(base_url: str, entity_id: str, image_url: str) -> None:
    payload = {'image': {'type': 'Text', 'value': image_url}}
    response = requests.patch(
        f'{base_url.rstrip("/")}/v2/entities/{entity_id}/attrs',
        headers=_headers(),
        json=payload,
        timeout=15,
    )
    response.raise_for_status()
    verify_remote_image(image_url)


def main() -> int:
    load_dotenv()
    api_base_url = os.getenv('BACKEND_API_URL', 'http://localhost:5000')
    base_url = os.getenv('ORION_URL', 'http://localhost:1026')
    entity_paths = {
        'Product': '/api/products',
        'Store': '/api/stores',
        'Employee': '/api/employees',
    }

    updated_count = 0
    for entity_type, entity_urls in IMAGE_URLS.items():
        entities = list_entities(api_base_url, entity_paths[entity_type])
        entity_by_id = {entity['id']: entity for entity in entities}

        for entity_id, image_url in entity_urls.items():
            if entity_id not in entity_by_id:
                print(f'Skipping missing {entity_type} entity: {entity_id}', file=sys.stderr)
                continue

            current_image = entity_by_id[entity_id].get('image')
            if current_image == image_url:
                print(f'Already up to date: {entity_type} {entity_id}')
            else:
                patch_entity_image(base_url, entity_id, image_url)
                print(f'Patched {entity_type} {entity_id} -> {image_url}')
                updated_count += 1

    print(f'Finished. Updated {updated_count} entities.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
